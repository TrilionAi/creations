"""
Drawing Utils - Funções utilitárias de desenho, hit-test e manipulação de paths
"""

import math
from PySide6.QtCore import Qt, QPoint, QRect, QPointF, QRectF
from PySide6.QtGui import (
    QPen, QColor, QPainterPath, QFont, QFontMetrics,
    QPolygonF, QPainterPathStroker, QTransform
)


def make_pen(brush_color, brush_size, tool=None):
    """Cria QPen configurado para a ferramenta"""
    if tool == 'highlighter':
        c = QColor(brush_color)
        c.setAlpha(76)
        pen = QPen(c, max(brush_size, 20))
    else:
        pen = QPen(brush_color, brush_size)
    pen.setCapStyle(Qt.PenCapStyle.RoundCap)
    pen.setJoinStyle(Qt.PenJoinStyle.RoundJoin)
    return pen


def draw_arrow_head(painter, p1, p2, size):
    """Desenha ponta de seta"""
    angle = math.atan2(p2.y() - p1.y(), p2.x() - p1.x())
    head_len = max(size * 4, 12)
    arrow_p1 = QPointF(
        p2.x() - head_len * math.cos(angle - math.pi / 6),
        p2.y() - head_len * math.sin(angle - math.pi / 6)
    )
    arrow_p2 = QPointF(
        p2.x() - head_len * math.cos(angle + math.pi / 6),
        p2.y() - head_len * math.sin(angle + math.pi / 6)
    )
    triangle = QPolygonF([QPointF(p2), arrow_p1, arrow_p2])
    painter.setBrush(painter.pen().color())
    painter.drawPolygon(triangle)


def draw_shape(painter, path_data, brush_color=None):
    """Desenha uma forma (sem seleção visual)"""
    ptype = path_data['type']
    if ptype in ('freehand', 'highlighter'):
        painter.drawPath(path_data['path'])
    elif ptype == 'rectangle':
        painter.drawRect(path_data['rect'])
    elif ptype == 'filled-rect':
        fill_color = path_data.get('fill_color', brush_color)
        painter.save()
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QColor(fill_color) if isinstance(fill_color, str) else fill_color)
        painter.drawRect(path_data['rect'])
        painter.restore()
    elif ptype == 'circle':
        painter.drawEllipse(path_data['rect'])
    elif ptype in ('line', 'arrow'):
        painter.drawLine(path_data['p1'], path_data['p2'])


def draw_path_data(painter, path_data, brush_color=None):
    """Desenha um item de path completo"""
    pen = path_data['pen']
    painter.setPen(pen)
    painter.setBrush(Qt.BrushStyle.NoBrush)
    ptype = path_data['type']

    if ptype == 'highlighter':
        from PySide6.QtGui import QPainter
        painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_Multiply)

    draw_shape(painter, path_data, brush_color)

    if ptype == 'arrow':
        painter.setBrush(pen.color())
        draw_arrow_head(
            painter,
            QPointF(path_data['p1']),
            QPointF(path_data['p2']),
            pen.widthF()
        )

    if ptype == 'highlighter':
        from PySide6.QtGui import QPainter
        painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_SourceOver)


# --- Hit-testing ---

def hit_test_text(annot, pos):
    """Verifica se pos está dentro da bounding box de uma anotação de texto.
    Retorna (bool, QRect)."""
    font = QFont(annot['font'])
    font.setBold(annot.get('bold', False))
    font.setItalic(annot.get('italic', False))
    if 'font_size' in annot:
        font.setPointSize(annot['font_size'])
    fm = QFontMetrics(font)

    lines = annot['text'].split('\n')
    max_width = max((fm.horizontalAdvance(line) for line in lines), default=0)
    total_height = fm.height() * len(lines)

    rect = QRect(
        annot['pos'].x() - 4,
        annot['pos'].y() - 2,
        max_width + 12,
        total_height + 6
    )
    return rect.contains(pos), rect


def hit_test_path(path_data, pos):
    """Verifica se pos está perto do path"""
    threshold = max(path_data['pen'].widthF() * 2, 10)
    ptype = path_data['type']

    if ptype in ('freehand', 'highlighter'):
        stroker = QPainterPathStroker()
        stroker.setWidth(threshold)
        stroke_path = stroker.createStroke(path_data['path'])
        return stroke_path.contains(QPointF(pos))
    elif ptype == 'rectangle':
        rect = path_data['rect']
        path = QPainterPath()
        path.addRect(rect.x(), rect.y(), rect.width(), rect.height())
        stroker = QPainterPathStroker()
        stroker.setWidth(threshold)
        return stroker.createStroke(path).contains(QPointF(pos))
    elif ptype == 'filled-rect':
        rect = path_data['rect']
        expanded = QRect(
            rect.x() - int(threshold),
            rect.y() - int(threshold),
            rect.width() + int(threshold) * 2,
            rect.height() + int(threshold) * 2
        )
        return expanded.contains(pos)
    elif ptype == 'circle':
        rect = path_data['rect']
        path = QPainterPath()
        path.addEllipse(rect.x(), rect.y(), rect.width(), rect.height())
        stroker = QPainterPathStroker()
        stroker.setWidth(threshold)
        return stroker.createStroke(path).contains(QPointF(pos))
    elif ptype in ('line', 'arrow'):
        path = QPainterPath()
        path.moveTo(QPointF(path_data['p1']))
        path.lineTo(QPointF(path_data['p2']))
        stroker = QPainterPathStroker()
        stroker.setWidth(threshold)
        return stroker.createStroke(path).contains(QPointF(pos))
    return False


# --- Manipulação de paths ---

def translate_path(path_data, dx, dy):
    """Move um path por (dx, dy)"""
    ptype = path_data['type']
    if ptype in ('freehand', 'highlighter'):
        path_data['path'].translate(dx, dy)
    elif ptype in ('rectangle', 'circle', 'filled-rect'):
        r = path_data['rect']
        path_data['rect'] = QRect(r.x() + dx, r.y() + dy, r.width(), r.height())
    elif ptype in ('line', 'arrow'):
        path_data['p1'] = QPoint(path_data['p1'].x() + dx, path_data['p1'].y() + dy)
        path_data['p2'] = QPoint(path_data['p2'].x() + dx, path_data['p2'].y() + dy)


def get_item_center(path_data):
    """Retorna o centro de um path como QPointF"""
    ptype = path_data['type']
    if ptype in ('freehand', 'highlighter'):
        return QPointF(path_data['path'].boundingRect().center())
    elif ptype in ('rectangle', 'circle', 'filled-rect'):
        return QPointF(path_data['rect'].center())
    elif ptype in ('line', 'arrow'):
        p1, p2 = path_data['p1'], path_data['p2']
        return QPointF((p1.x() + p2.x()) / 2.0, (p1.y() + p2.y()) / 2.0)
    return QPointF(0, 0)


def inverse_transform_pos(pos, item_data, item_type):
    """Transforma posição de clique para o espaço local do item"""
    if item_type == 'path':
        rotation = item_data.get('rotation', 0.0)
        scale = item_data.get('scale', 1.0)
        if rotation == 0.0 and scale == 1.0:
            return pos
        center = get_item_center(item_data)
    else:
        rotation = item_data.get('rotation', 0.0)
        if rotation == 0.0:
            return pos
        _, rect = hit_test_text(item_data, item_data['pos'])
        center = QPointF(rect.center())

    transform = QTransform()
    transform.translate(center.x(), center.y())
    transform.rotate(-rotation)
    if item_type == 'path' and scale != 1.0:
        inv_s = 1.0 / scale if scale != 0 else 1.0
        transform.scale(inv_s, inv_s)
    transform.translate(-center.x(), -center.y())
    return transform.map(QPointF(pos)).toPoint()
