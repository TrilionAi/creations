"""
Handle System - Sistema de seleção com handles estilo Photoshop
Suporta seleção única e multi-seleção (Ctrl+clique).
Resize, rotação, mover, bounding box.
Mixin class para ser usado pelo DrawingOverlay.
"""

import math
from PySide6.QtCore import Qt, QPoint, QRect, QPointF, QRectF
from PySide6.QtGui import QPen, QColor, QPainterPath, QFont, QTransform

from drawing_utils import (
    hit_test_text, hit_test_path, get_item_center, inverse_transform_pos,
    translate_path
)
from context_menu import ContextMenuMixin

# Mapa de handle oposto (para resize com âncora)
OPPOSITE_HANDLE = {
    'tl': 'br', 'tc': 'bc', 'tr': 'bl',
    'ml': 'mr',              'mr': 'ml',
    'bl': 'tr', 'bc': 'tc', 'br': 'tl',
}


class HandleSystemMixin(ContextMenuMixin):
    """Mixin que adiciona sistema de handles (seleção, resize, rotação) ao overlay.
    Suporta multi-seleção.
    Requer que a classe host tenha: paths, text_annotations, update()"""

    def _init_handle_state(self):
        """Inicializa estado do handle system"""
        # Multi-seleção: lista de (type, index)
        self.selected_items = []

        # Estado de transform ativo
        self.drag_offset = QPoint()
        self._handle_mode = 'idle'
        self._active_handle = None
        self._resize_anchor = QPointF()
        self._resize_start_bbox = None
        self._resize_start_mouse = QPointF()
        self._rotate_start_angle = 0.0
        self._rotate_start_mouse_angle = 0.0
        self._rotate_center = QPointF()
        self._move_last_pos = QPoint()
        self._original_items_snapshot = []  # snapshots de todos os itens selecionados

    # --- Selection API ---

    @property
    def selected_index(self):
        """Compatibilidade: retorna índice do primeiro item selecionado"""
        if self.selected_items:
            return self.selected_items[0][1]
        return -1

    @property
    def selected_type(self):
        """Compatibilidade: retorna tipo do primeiro item selecionado"""
        if self.selected_items:
            return self.selected_items[0][0]
        return None

    def _select_single(self, item_type, item_index):
        """Seleciona um único item, limpando seleção anterior"""
        self.selected_items = [(item_type, item_index)]
        self._handle_mode = 'selected'
        self.update()

    def _add_to_selection(self, item_type, item_index):
        """Adiciona/remove item da seleção (toggle)"""
        item = (item_type, item_index)
        if item in self.selected_items:
            self.selected_items.remove(item)
        else:
            self.selected_items.append(item)
        self._handle_mode = 'selected' if self.selected_items else 'idle'
        self.update()

    def _has_selection(self):
        return len(self.selected_items) > 0

    def _is_selected(self, item_type, item_index):
        return (item_type, item_index) in self.selected_items

    def _deselect(self):
        self.selected_items = []
        self._handle_mode = 'idle'
        self._active_handle = None
        self._original_items_snapshot = []
        # Se não está em modo de desenho/texto, voltar ao click-through
        if hasattr(self, 'draw_mode') and not self.draw_mode and not self.text_mode:
            self._set_click_through(True)
            self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating, True)
        self.update()

    # --- Bounding Box e Handles ---

    def _get_selection_bbox(self, item_type, item_index):
        PAD = 6
        if item_type == 'text':
            annot = self.text_annotations[item_index]
            _, rect = hit_test_text(annot, annot['pos'])
            return QRectF(rect).adjusted(-PAD, -PAD, PAD, PAD)

        pd = self.paths[item_index]
        ptype = pd['type']
        pw = pd['pen'].widthF() / 2

        if ptype in ('freehand', 'highlighter'):
            r = pd['path'].boundingRect()
            return QRectF(r).adjusted(-pw - PAD, -pw - PAD, pw + PAD, pw + PAD)
        elif ptype in ('rectangle', 'circle', 'filled-rect'):
            return QRectF(pd['rect']).adjusted(-pw - PAD, -pw - PAD, pw + PAD, pw + PAD)
        elif ptype in ('line', 'arrow'):
            p1, p2 = pd['p1'], pd['p2']
            x_min, x_max = min(p1.x(), p2.x()), max(p1.x(), p2.x())
            y_min, y_max = min(p1.y(), p2.y()), max(p1.y(), p2.y())
            return QRectF(
                x_min - pw - PAD, y_min - pw - PAD,
                (x_max - x_min) + 2 * (pw + PAD),
                (y_max - y_min) + 2 * (pw + PAD)
            )
        return QRectF()

    def _get_multi_selection_bbox(self):
        """Bounding box combinado de todos os itens selecionados"""
        combined = QRectF()
        for item_type, item_index in self.selected_items:
            try:
                bbox = self._get_selection_bbox(item_type, item_index)
                if combined.isNull():
                    combined = bbox
                else:
                    combined = combined.united(bbox)
            except (IndexError, KeyError):
                continue
        return combined

    def _get_handle_positions(self, bbox):
        x, y = bbox.x(), bbox.y()
        w, h = bbox.width(), bbox.height()
        ROT_DIST = 25
        return {
            'tl': QPointF(x, y),
            'tc': QPointF(x + w / 2, y),
            'tr': QPointF(x + w, y),
            'ml': QPointF(x, y + h / 2),
            'mr': QPointF(x + w, y + h / 2),
            'bl': QPointF(x, y + h),
            'bc': QPointF(x + w / 2, y + h),
            'br': QPointF(x + w, y + h),
            'rot': QPointF(x + w / 2, y - ROT_DIST),
        }

    def _hit_test_handle(self, pos, handles):
        GRAB_R2 = 10 * 10
        pos_f = QPointF(pos)
        rp = handles['rot']
        if (pos_f.x() - rp.x()) ** 2 + (pos_f.y() - rp.y()) ** 2 <= GRAB_R2:
            return 'rot'
        for hid in ('tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br'):
            hp = handles[hid]
            if (pos_f.x() - hp.x()) ** 2 + (pos_f.y() - hp.y()) ** 2 <= GRAB_R2:
                return hid
        return None

    def _handle_cursor(self, handle_id):
        if handle_id == 'rot':
            return Qt.CursorShape.CrossCursor
        cursor_map = {
            'tl': Qt.CursorShape.SizeFDiagCursor,
            'tr': Qt.CursorShape.SizeBDiagCursor,
            'bl': Qt.CursorShape.SizeBDiagCursor,
            'br': Qt.CursorShape.SizeFDiagCursor,
            'tc': Qt.CursorShape.SizeVerCursor,
            'bc': Qt.CursorShape.SizeVerCursor,
            'ml': Qt.CursorShape.SizeHorCursor,
            'mr': Qt.CursorShape.SizeHorCursor,
        }
        return cursor_map.get(handle_id, Qt.CursorShape.ArrowCursor)

    def _get_screen_to_local_transform(self, item_type, item_index):
        if item_type == 'path':
            pd = self.paths[item_index]
            return pd.get('rotation', 0.0), pd.get('scale', 1.0), get_item_center(pd)
        else:
            annot = self.text_annotations[item_index]
            _, rect = hit_test_text(annot, annot['pos'])
            return annot.get('rotation', 0.0), 1.0, QPointF(rect.center())

    def _hit_test_handles_at(self, screen_pos):
        """Hit-test nos handles — usa bbox combinado para multi-seleção"""
        if not self.selected_items:
            return None

        if len(self.selected_items) == 1:
            # Single selection: handles com transform
            item_type, item_index = self.selected_items[0]
            try:
                bbox = self._get_selection_bbox(item_type, item_index)
            except (IndexError, KeyError):
                return None
            handles = self._get_handle_positions(bbox)
            rotation, scale, center = self._get_screen_to_local_transform(
                item_type, item_index
            )
            if rotation != 0.0 or scale != 1.0:
                t = QTransform()
                t.translate(center.x(), center.y())
                t.rotate(-rotation)
                if scale != 1.0:
                    inv_s = 1.0 / scale if scale != 0 else 1.0
                    t.scale(inv_s, inv_s)
                t.translate(-center.x(), -center.y())
                local_pos = t.map(QPointF(screen_pos)).toPoint()
            else:
                local_pos = screen_pos
            return self._hit_test_handle(local_pos, handles)
        else:
            # Multi-selection: handles sem transform (bbox combinado sem rotação)
            bbox = self._get_multi_selection_bbox()
            if bbox.isNull():
                return None
            handles = self._get_handle_positions(bbox)
            return self._hit_test_handle(screen_pos, handles)

    def _hit_test_selected_body(self, pos):
        """Testa se pos está no corpo de algum item selecionado"""
        for item_type, item_index in self.selected_items:
            try:
                if item_type == 'path':
                    local = inverse_transform_pos(pos, self.paths[item_index], 'path')
                    if hit_test_path(self.paths[item_index], local):
                        return True
                else:
                    local = inverse_transform_pos(
                        pos, self.text_annotations[item_index], 'text')
                    hit, _ = hit_test_text(self.text_annotations[item_index], local)
                    if hit:
                        return True
            except (IndexError, KeyError):
                continue
        return False

    def _snapshot_item(self, item_type, item_index):
        if item_type == 'path':
            pd = self.paths[item_index]
            snap = dict(pd)
            if 'path' in snap:
                snap['path'] = QPainterPath(snap['path'])
            if 'rect' in snap:
                snap['rect'] = QRect(snap['rect'])
            if 'p1' in snap:
                snap['p1'] = QPoint(snap['p1'])
                snap['p2'] = QPoint(snap['p2'])
            snap['pen'] = QPen(snap['pen'])
            return snap
        else:
            annot = self.text_annotations[item_index]
            snap = dict(annot)
            snap['pos'] = QPoint(snap['pos'])
            snap['font'] = QFont(snap['font'])
            snap['color'] = QColor(snap['color'])
            return snap

    def _snapshot_all_selected(self):
        """Snapshot de todos os itens selecionados"""
        snapshots = []
        for item_type, item_index in self.selected_items:
            try:
                snap = self._snapshot_item(item_type, item_index)
                snapshots.append((item_type, item_index, snap))
            except (IndexError, KeyError):
                continue
        return snapshots

    # --- Renderização de handles ---

    def _draw_selection_handles(self, painter, bbox, rotation, scale, center):
        handles = self._get_handle_positions(bbox)
        painter.save()

        if rotation != 0.0 or scale != 1.0:
            painter.translate(center)
            if rotation != 0.0:
                painter.rotate(rotation)
            if scale != 1.0:
                painter.scale(scale, scale)
            painter.translate(-center)

        box_pen = QPen(QColor(58, 134, 255, 200), 1.5)
        box_pen.setStyle(Qt.PenStyle.DashLine)
        box_pen.setCosmetic(True)
        painter.setPen(box_pen)
        painter.setBrush(Qt.BrushStyle.NoBrush)
        painter.drawRect(bbox)

        line_pen = QPen(QColor(58, 134, 255, 160), 1)
        line_pen.setCosmetic(True)
        painter.setPen(line_pen)
        painter.drawLine(handles['tc'], handles['rot'])

        HANDLE_SZ = 7
        half = HANDLE_SZ / 2
        handle_pen = QPen(QColor(255, 255, 255), 1)
        handle_pen.setCosmetic(True)
        painter.setPen(handle_pen)
        painter.setBrush(QColor(58, 134, 255))
        for hid in ('tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br'):
            hp = handles[hid]
            painter.drawRect(QRectF(hp.x() - half, hp.y() - half, HANDLE_SZ, HANDLE_SZ))

        ROT_SZ = 9
        rot_half = ROT_SZ / 2
        rp = handles['rot']
        painter.drawEllipse(QRectF(rp.x() - rot_half, rp.y() - rot_half, ROT_SZ, ROT_SZ))

        painter.restore()

    def _draw_multi_selection_highlights(self, painter):
        """Desenha retângulo tracejado individual por item (multi-seleção)"""
        pen = QPen(QColor(58, 134, 255, 100), 1)
        pen.setStyle(Qt.PenStyle.DashLine)
        pen.setCosmetic(True)
        painter.setPen(pen)
        painter.setBrush(Qt.BrushStyle.NoBrush)

        for item_type, item_index in self.selected_items:
            try:
                bbox = self._get_selection_bbox(item_type, item_index)
                rotation, scale, center = self._get_screen_to_local_transform(
                    item_type, item_index)
                if rotation != 0.0 or scale != 1.0:
                    painter.save()
                    painter.translate(center)
                    if rotation != 0.0:
                        painter.rotate(rotation)
                    if scale != 1.0:
                        painter.scale(scale, scale)
                    painter.translate(-center)
                    painter.drawRect(bbox)
                    painter.restore()
                else:
                    painter.drawRect(bbox)
            except (IndexError, KeyError):
                continue

    # --- Resize ---

    def _start_resize(self, handle_id, screen_pos):
        self._handle_mode = 'resizing'
        self._active_handle = handle_id

        if len(self.selected_items) == 1:
            bbox = self._get_selection_bbox(
                self.selected_items[0][0], self.selected_items[0][1])
        else:
            bbox = self._get_multi_selection_bbox()

        handles = self._get_handle_positions(bbox)
        opposite_id = OPPOSITE_HANDLE[handle_id]
        self._resize_anchor = QPointF(handles[opposite_id])
        self._resize_start_bbox = QRectF(bbox)
        self._resize_start_mouse = QPointF(screen_pos)
        self._original_items_snapshot = self._snapshot_all_selected()

    def _update_resize(self, screen_pos):
        if not self.selected_items or self._active_handle is None:
            return

        # Para single selection com rotação, transformar para espaço local
        if len(self.selected_items) == 1:
            rotation, scale_val, center = self._get_screen_to_local_transform(
                self.selected_items[0][0], self.selected_items[0][1]
            )
            if rotation != 0.0 or scale_val != 1.0:
                item_type, item_index = self.selected_items[0]
                if item_type == 'path':
                    local_pos = inverse_transform_pos(
                        screen_pos, self.paths[item_index], 'path')
                else:
                    local_pos = inverse_transform_pos(
                        screen_pos, self.text_annotations[item_index], 'text')
            else:
                local_pos = screen_pos
        else:
            local_pos = screen_pos

        handle_id = self._active_handle
        anchor = self._resize_anchor
        orig_handles = self._get_handle_positions(self._resize_start_bbox)
        orig_handle_pos = orig_handles[handle_id]

        orig_dx = orig_handle_pos.x() - anchor.x()
        orig_dy = orig_handle_pos.y() - anchor.y()
        new_dx = float(local_pos.x() if isinstance(local_pos, QPoint) else local_pos.x()) - anchor.x()
        new_dy = float(local_pos.y() if isinstance(local_pos, QPoint) else local_pos.y()) - anchor.y()

        is_corner = handle_id in ('tl', 'tr', 'bl', 'br')
        is_h_edge = handle_id in ('ml', 'mr')
        is_v_edge = handle_id in ('tc', 'bc')

        if is_corner:
            orig_dist = math.sqrt(orig_dx ** 2 + orig_dy ** 2)
            new_dist = math.sqrt(new_dx ** 2 + new_dy ** 2)
            if orig_dist < 1:
                return
            factor = max(new_dist / orig_dist, 0.05)
            sx = sy = factor
        elif is_h_edge:
            if abs(orig_dx) < 1:
                return
            sx = max(abs(new_dx / orig_dx), 0.05)
            sy = 1.0
        elif is_v_edge:
            if abs(orig_dy) < 1:
                return
            sx = 1.0
            sy = max(abs(new_dy / orig_dy), 0.05)
        else:
            return

        self._apply_resize_all(sx, sy)
        self.update()

    def _apply_resize_all(self, sx, sy):
        """Aplica resize a todos os itens selecionados"""
        anchor = self._resize_anchor
        for item_type, item_index, snap in self._original_items_snapshot:
            try:
                self._apply_resize_item(item_type, item_index, snap, anchor, sx, sy)
            except (IndexError, KeyError):
                continue

    def _apply_resize_item(self, item_type, item_index, snap, anchor, sx, sy):
        """Aplica resize a um único item a partir do snapshot"""
        if item_type == 'path':
            pd = self.paths[item_index]
            ptype = pd['type']

            if ptype in ('rectangle', 'circle', 'filled-rect'):
                orig_rect = snap['rect']
                new_x = anchor.x() + (orig_rect.x() - anchor.x()) * sx
                new_y = anchor.y() + (orig_rect.y() - anchor.y()) * sy
                new_w = orig_rect.width() * sx
                new_h = orig_rect.height() * sy
                pd['rect'] = QRectF(new_x, new_y, new_w, new_h).normalized().toAlignedRect()

            elif ptype in ('line', 'arrow'):
                orig_p1, orig_p2 = snap['p1'], snap['p2']
                pd['p1'] = QPoint(
                    int(anchor.x() + (orig_p1.x() - anchor.x()) * sx),
                    int(anchor.y() + (orig_p1.y() - anchor.y()) * sy)
                )
                pd['p2'] = QPoint(
                    int(anchor.x() + (orig_p2.x() - anchor.x()) * sx),
                    int(anchor.y() + (orig_p2.y() - anchor.y()) * sy)
                )

            elif ptype in ('freehand', 'highlighter'):
                orig_scale = snap.get('scale', 1.0)
                uniform = (sx + sy) / 2.0
                pd['scale'] = orig_scale * uniform

        elif item_type == 'text':
            annot = self.text_annotations[item_index]
            orig_font_size = snap.get('font_size', 16)
            uniform = (sx + sy) / 2.0
            new_size = max(8, min(72, int(orig_font_size * uniform)))
            annot['font_size'] = new_size
            font = QFont(annot['font'])
            font.setPointSize(new_size)
            annot['font'] = font
            orig_pos = snap['pos']
            annot['pos'] = QPoint(
                int(anchor.x() + (orig_pos.x() - anchor.x()) * sx),
                int(anchor.y() + (orig_pos.y() - anchor.y()) * sy)
            )

    # --- Rotação ---

    def _start_rotate(self, screen_pos):
        self._handle_mode = 'rotating'
        self._active_handle = 'rot'

        if len(self.selected_items) == 1:
            item_type, item_index = self.selected_items[0]
            if item_type == 'path':
                item = self.paths[item_index]
                self._rotate_start_angle = item.get('rotation', 0.0)
                self._rotate_center = get_item_center(item)
            else:
                item = self.text_annotations[item_index]
                self._rotate_start_angle = item.get('rotation', 0.0)
                _, rect = hit_test_text(item, item['pos'])
                self._rotate_center = QPointF(rect.center())
        else:
            # Multi-seleção: rotação ao redor do centro combinado
            bbox = self._get_multi_selection_bbox()
            self._rotate_center = QPointF(bbox.center())
            self._rotate_start_angle = 0.0

        self._original_items_snapshot = self._snapshot_all_selected()

        dx = screen_pos.x() - self._rotate_center.x()
        dy = screen_pos.y() - self._rotate_center.y()
        self._rotate_start_mouse_angle = math.degrees(math.atan2(dy, dx))

    def _update_rotate(self, screen_pos):
        center = self._rotate_center
        dx = screen_pos.x() - center.x()
        dy = screen_pos.y() - center.y()
        current_angle = math.degrees(math.atan2(dy, dx))
        delta = current_angle - self._rotate_start_mouse_angle

        if len(self.selected_items) == 1:
            new_rotation = self._rotate_start_angle + delta
            item_type, item_index = self.selected_items[0]
            if item_type == 'path':
                self.paths[item_index]['rotation'] = new_rotation
            else:
                self.text_annotations[item_index]['rotation'] = new_rotation
        else:
            # Multi-seleção: aplicar delta de rotação a cada item
            for item_type, item_index, snap in self._original_items_snapshot:
                try:
                    orig_rotation = snap.get('rotation', 0.0)
                    new_rotation = orig_rotation + delta
                    if item_type == 'path':
                        self.paths[item_index]['rotation'] = new_rotation
                    else:
                        self.text_annotations[item_index]['rotation'] = new_rotation
                except (IndexError, KeyError):
                    continue

        self.update()

    # --- Multi-Move ---

    def _start_move(self, pos):
        self._handle_mode = 'moving'
        self._move_last_pos = QPoint(pos)

    def _update_move(self, pos):
        dx = pos.x() - self._move_last_pos.x()
        dy = pos.y() - self._move_last_pos.y()
        for item_type, item_index in self.selected_items:
            try:
                if item_type == 'path':
                    translate_path(self.paths[item_index], dx, dy)
                elif item_type == 'text':
                    annot = self.text_annotations[item_index]
                    annot['pos'] = QPoint(annot['pos'].x() + dx, annot['pos'].y() + dy)
            except (IndexError, KeyError):
                continue
        self._move_last_pos = QPoint(pos)
        self.update()

    # --- Multi-Delete ---

    def _delete_selected(self):
        """Deleta todos os itens selecionados (em ordem reversa para evitar shift)"""
        paths_to_delete = sorted(
            [idx for t, idx in self.selected_items if t == 'path'], reverse=True)
        texts_to_delete = sorted(
            [idx for t, idx in self.selected_items if t == 'text'], reverse=True)
        # Sets para lookup rápido
        path_set = set(paths_to_delete)
        text_set = set(texts_to_delete)
        for idx in paths_to_delete:
            if 0 <= idx < len(self.paths):
                self.paths.pop(idx)
        for idx in texts_to_delete:
            if 0 <= idx < len(self.text_annotations):
                self.text_annotations.pop(idx)
        # Sincronizar undo stack: remover entradas deletadas e reindexar
        if hasattr(self, '_undo_stack'):
            new_stack = []
            for t, i in self._undo_stack:
                if t == 'path' and i in path_set:
                    continue
                if t == 'text' and i in text_set:
                    continue
                adj_i = i
                if t == 'path':
                    adj_i -= sum(1 for d in path_set if d < i)
                elif t == 'text':
                    adj_i -= sum(1 for d in text_set if d < i)
                new_stack.append((t, adj_i))
            self._undo_stack = new_stack
        self._deselect()
