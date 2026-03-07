"""
Overlay - Janela transparente fullscreen para desenho e anotação
Fica sobre todas as janelas. Alterna entre click-through e modo desenho via hotkey.
Ferramentas: freehand, rectangle, circle, line, arrow, eraser
Inclui preview durante arrasto e seleção visual de itens com handles (estilo Photoshop).
Suporta multi-seleção (Ctrl+clique direito).
"""

from PySide6.QtWidgets import QWidget, QApplication
from PySide6.QtCore import Qt, QPoint, QRect, QPointF, Signal, QTimer
from PySide6.QtGui import (
    QPainter, QPen, QColor, QPainterPath, QFont, QCursor
)

from win32_utils import set_click_through, set_foreground, raise_window, stay_on_top
from drawing_utils import (
    make_pen, draw_arrow_head, draw_path_data, draw_shape,
    hit_test_text, hit_test_path, translate_path, get_item_center,
    inverse_transform_pos
)
from text_editor import TextEditorMixin
from handle_system import HandleSystemMixin


class DrawingOverlay(TextEditorMixin, HandleSystemMixin, QWidget):
    """Overlay transparente fullscreen com modo desenho"""

    mode_changed = Signal(bool)

    def __init__(self, settings=None):
        super().__init__()
        self.settings = settings or {}

        # Estado do modo
        self.draw_mode = False
        self.current_tool = 'freehand'
        self.ghost_mode = False  # Modo apresentação: desenhos somem ao soltar

        # Configurações de pincel
        self.brush_color = QColor(self.settings.get('brush_color', '#FF0000'))
        self.brush_size = self.settings.get('brush_size', 3)

        # Estado de desenho
        self.is_drawing = False
        self.start_point = QPoint()
        self.current_point = QPoint()
        self.current_path = QPainterPath()
        self.paths = []

        # Guia de leitura
        self.guide_enabled = False
        self.guide_y = 0
        self.guide_color = QColor(
            self.settings.get('guide_color_r', 255),
            self.settings.get('guide_color_g', 255),
            self.settings.get('guide_color_b', 0),
            self.settings.get('guide_color_a', 45)
        )
        self.guide_height = self.settings.get('guide_height', 32)

        # Anotações de texto
        self.text_mode = False
        self.text_annotations = []
        self.text_bold = False
        self.text_italic = False
        self.text_font_size = self.settings.get('font_size', 16)

        # Toolbar Z-order
        self._toolbar_hwnd = None

        # Undo stack unificada: [('path', idx), ('text', idx), ...]
        self._undo_stack = []

        # Inicializar mixins
        self._init_text_editor_state()
        self._init_handle_state()

        self._init_ui()

    def _init_ui(self):
        """Configura janela transparente fullscreen"""
        screen = QApplication.primaryScreen().geometry()
        self.setGeometry(screen)

        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating)
        self.setMouseTracking(True)

        self._hwnd = None
        QTimer.singleShot(50, self._cache_hwnd)

    def _cache_hwnd(self):
        try:
            self._hwnd = int(self.winId())
            # Ativar click-through na inicialização (modo normal)
            if not self.draw_mode and not self.text_mode:
                self._set_click_through(True)
        except Exception:
            self._hwnd = None

    # --- Toolbar Z-order ---

    def set_toolbar_hwnd(self, hwnd):
        self._toolbar_hwnd = hwnd

    def _raise_toolbar(self):
        raise_window(self._toolbar_hwnd)

    # --- Windows API delegação ---

    def _set_click_through(self, enabled):
        if self._hwnd is None:
            self._cache_hwnd()
        if self._hwnd:
            set_click_through(self._hwnd, enabled, self._toolbar_hwnd)

    def stay_on_top(self):
        if not self.isVisible():
            return
        if self._hwnd is None:
            self._cache_hwnd()
        if self._hwnd:
            stay_on_top(self._hwnd, self._toolbar_hwnd)

    # --- Modos ---

    def toggle_draw_mode(self):
        self.draw_mode = not self.draw_mode
        self.text_mode = False
        self._dismiss_text_editor()
        self._deselect()
        self._set_click_through(not self.draw_mode)
        self.setCursor(
            Qt.CursorShape.CrossCursor if self.draw_mode
            else Qt.CursorShape.ArrowCursor
        )
        self.mode_changed.emit(self.draw_mode)
        self.update()
        if self.draw_mode:
            self._activate_overlay()
            QTimer.singleShot(100, self._ensure_draw_mode)
        else:
            self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating, True)

    def _activate_overlay(self):
        """Ativa a overlay para receber eventos de mouse/teclado"""
        self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating, False)
        self.activateWindow()
        if self._hwnd:
            set_foreground(self._hwnd)
        # Toolbar SEMPRE acima do overlay (overlay é fullscreen)
        # Raise imediato + delay para garantir que estabilizou
        self._raise_toolbar()
        QTimer.singleShot(30, self._raise_toolbar)

    def _ensure_draw_mode(self):
        if self.draw_mode:
            self._set_click_through(False)
            self._activate_overlay()

    def _reactivate_if_needed(self):
        """Re-ativa overlay se tem seleção ou está em modo ativo"""
        if self._has_selection() or self.draw_mode or self.text_mode:
            self._set_click_through(False)
            self._activate_overlay()

    def toggle_guide(self):
        self.guide_enabled = not self.guide_enabled
        # Guia funciona em click-through — garantir que cliques passam
        if not self.draw_mode and not self.text_mode:
            self._set_click_through(True)
        self.update()
        return self.guide_enabled

    def toggle_ghost_mode(self):
        self.ghost_mode = not self.ghost_mode
        self.update()
        return self.ghost_mode

    def toggle_text_mode(self):
        self.text_mode = not self.text_mode
        self.draw_mode = False
        self._deselect()
        self._set_click_through(not self.text_mode)
        self.setCursor(
            Qt.CursorShape.IBeamCursor if self.text_mode
            else Qt.CursorShape.ArrowCursor
        )
        self.update()
        if self.text_mode:
            self._activate_overlay()
        else:
            self._dismiss_text_editor()
            self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating, True)
        return self.text_mode

    # --- Setters ---

    def set_tool(self, tool):
        self.current_tool = tool
        self._deselect()
        if self.draw_mode:
            if tool == 'eraser':
                self.setCursor(Qt.CursorShape.PointingHandCursor)
            else:
                self.setCursor(Qt.CursorShape.CrossCursor)
        self.update()

    def set_brush_color(self, color):
        if isinstance(color, str):
            self.brush_color = QColor(color)
        else:
            self.brush_color = color

    def set_brush_size(self, size):
        self.brush_size = size

    def set_guide_color(self, r, g, b, a):
        self.guide_color = QColor(r, g, b, a)
        self.update()

    def set_guide_height(self, h):
        self.guide_height = h
        self.update()

    def update_guide_position(self, x, y):
        if self.guide_enabled:
            self.guide_y = y
            self.update()

    # --- paintEvent ---

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        # Alpha=1 para hit-testing no Windows
        if self.draw_mode or self.text_mode or self._has_selection():
            painter.fillRect(self.rect(), QColor(0, 0, 0, 1))

        # Guia de leitura
        if self.guide_enabled:
            self._paint_guide(painter)

        # Desenhos completados
        for path_data in self.paths:
            self._paint_path_item(painter, path_data)

        # Preview durante desenho
        if self.is_drawing and self.current_tool not in ('eraser',):
            self._paint_preview(painter)

        # Anotações de texto
        for annot in self.text_annotations:
            self._paint_text_annotation(painter, annot)

        # Handles de seleção
        if self._has_selection() and self._handle_mode != 'idle':
            self._paint_selection(painter)

        painter.end()

    def _paint_selection(self, painter):
        """Renderiza handles de seleção (single ou multi)"""
        if len(self.selected_items) == 1:
            item_type, item_index = self.selected_items[0]
            try:
                bbox = self._get_selection_bbox(item_type, item_index)
                rotation, scale, center = self._get_screen_to_local_transform(
                    item_type, item_index
                )
                self._draw_selection_handles(painter, bbox, rotation, scale, center)
            except (IndexError, KeyError):
                self._handle_mode = 'idle'
        else:
            # Multi-seleção: highlights individuais + handles no bbox combinado
            self._draw_multi_selection_highlights(painter)
            combined = self._get_multi_selection_bbox()
            if not combined.isNull():
                self._draw_selection_handles(
                    painter, combined, 0.0, 1.0, QPointF(combined.center()))

    def _paint_guide(self, painter):
        guide_top = self.guide_y - self.guide_height // 2
        painter.fillRect(0, guide_top, self.width(), self.guide_height, self.guide_color)
        # Borda usa mesma cor do guia, mas mais opaca
        border_color = QColor(self.guide_color)
        border_color.setAlpha(min(self.guide_color.alpha() * 2, 120))
        line_pen = QPen(border_color, 1)
        painter.setPen(line_pen)
        painter.drawLine(0, guide_top, self.width(), guide_top)
        painter.drawLine(0, guide_top + self.guide_height,
                         self.width(), guide_top + self.guide_height)

    def _paint_path_item(self, painter, path_data):
        rotation = path_data.get('rotation', 0.0)
        scale = path_data.get('scale', 1.0)
        needs_transform = (rotation != 0.0 or scale != 1.0)

        if needs_transform:
            painter.save()
            center = get_item_center(path_data)
            painter.translate(center)
            if rotation != 0.0:
                painter.rotate(rotation)
            if scale != 1.0:
                painter.scale(scale, scale)
            painter.translate(-center)

        draw_path_data(painter, path_data, self.brush_color)

        if needs_transform:
            painter.restore()

    def _paint_preview(self, painter):
        pen = make_pen(self.brush_color, self.brush_size, self.current_tool)
        painter.setPen(pen)
        painter.setBrush(Qt.BrushStyle.NoBrush)

        if self.current_tool == 'highlighter':
            painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_Multiply)

        if self.current_tool in ('freehand', 'highlighter'):
            painter.drawPath(self.current_path)
        elif self.current_tool == 'rectangle':
            painter.drawRect(QRect(self.start_point, self.current_point).normalized())
        elif self.current_tool == 'filled-rect':
            preview_color = QColor(self.brush_color)
            preview_color.setAlpha(128)
            painter.save()
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(preview_color)
            painter.drawRect(QRect(self.start_point, self.current_point).normalized())
            painter.restore()
        elif self.current_tool == 'circle':
            painter.drawEllipse(QRect(self.start_point, self.current_point).normalized())
        elif self.current_tool == 'line':
            painter.drawLine(self.start_point, self.current_point)
        elif self.current_tool == 'arrow':
            painter.drawLine(self.start_point, self.current_point)
            painter.setBrush(self.brush_color)
            draw_arrow_head(painter, QPointF(self.start_point),
                            QPointF(self.current_point), self.brush_size)

        if self.current_tool == 'highlighter':
            painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_SourceOver)

    def _paint_text_annotation(self, painter, annot):
        rotation = annot.get('rotation', 0.0)
        if rotation != 0.0:
            painter.save()
            _, text_rect = hit_test_text(annot, annot['pos'])
            center = QPointF(text_rect.center())
            painter.translate(center)
            painter.rotate(rotation)
            painter.translate(-center)

        font = QFont(annot['font'])
        font.setBold(annot.get('bold', False))
        font.setItalic(annot.get('italic', False))
        if 'font_size' in annot:
            font.setPointSize(annot['font_size'])
        painter.setFont(font)
        painter.setPen(QPen(annot['color']))

        lines = annot['text'].split('\n')
        fm = painter.fontMetrics()
        y_offset = 0
        for line in lines:
            painter.drawText(annot['pos'].x(), annot['pos'].y() + y_offset + fm.ascent(), line)
            y_offset += fm.height()

        if rotation != 0.0:
            painter.restore()

    # --- Eventos de Mouse ---

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.RightButton:
            if self.draw_mode or self.text_mode or self._has_selection():
                self._handle_right_click(event.pos(), event.modifiers())
            return

        if event.button() != Qt.MouseButton.LeftButton:
            return

        pos = event.pos()

        # Editor inline: commit ao clicar fora
        if self._active_editor:
            editor_rect = self._active_editor.geometry()
            bar_rect = self._active_format_bar.geometry() if self._active_format_bar else QRect()
            if not editor_rect.contains(pos) and not bar_rect.contains(pos):
                self._commit_text_editor()
                return

        # Handle mode: checar handles primeiro
        if self._handle_mode == 'selected' and self._has_selection():
            handle_id = self._hit_test_handles_at(pos)
            if handle_id:
                if handle_id == 'rot':
                    self._start_rotate(pos)
                else:
                    self._start_resize(handle_id, pos)
                self.setCursor(self._handle_cursor(handle_id))
                return

            if self._hit_test_selected_body(pos):
                self._start_move(pos)
                self.setCursor(Qt.CursorShape.SizeAllCursor)
                return

            self._deselect()

        # Modo texto
        if self.text_mode:
            pos = event.pos()
            for i in range(len(self.text_annotations) - 1, -1, -1):
                hit, _ = hit_test_text(self.text_annotations[i], pos)
                if hit:
                    self._select_single('text', i)
                    self.drag_offset = pos
                    self.is_drawing = True
                    self._text_dragged = False
                    return
            self._handle_text_click(pos)
            return

        if not self.draw_mode:
            return
        pos = event.pos()

        # Eraser
        if self.current_tool == 'eraser':
            for i in range(len(self.text_annotations) - 1, -1, -1):
                hit, _ = hit_test_text(self.text_annotations[i], pos)
                if hit:
                    self.text_annotations.pop(i)
                    self.update()
                    return
            for i in range(len(self.paths) - 1, -1, -1):
                if hit_test_path(self.paths[i], pos):
                    self.paths.pop(i)
                    self.update()
                    break
            self.is_drawing = True
            return

        # Ferramentas de desenho normais
        self.is_drawing = True
        self.start_point = pos
        self.current_point = pos
        if self.current_tool in ('freehand', 'highlighter'):
            self.current_path = QPainterPath()
            self.current_path.moveTo(pos.x(), pos.y())

    def _handle_right_click(self, pos, modifiers=None):
        if self._active_editor:
            self._commit_text_editor()

        ctrl_held = modifiers and (modifiers & Qt.KeyboardModifier.ControlModifier)

        # Se tem seleção e clicou num item selecionado (sem Ctrl) → mini menu
        if self._has_selection() and not ctrl_held:
            if self._hit_test_selected_body(pos):
                self._show_mini_context_menu(pos)
                # Re-ativar overlay após fechar o menu (QMenu.exec rouba foco)
                QTimer.singleShot(50, self._reactivate_if_needed)
                return

        # Hit-test em todos os itens
        for i in range(len(self.text_annotations) - 1, -1, -1):
            local_pos = inverse_transform_pos(pos, self.text_annotations[i], 'text')
            hit, _ = hit_test_text(self.text_annotations[i], local_pos)
            if hit:
                if ctrl_held:
                    self._add_to_selection('text', i)
                else:
                    self._select_single('text', i)
                self._reactivate_if_needed()
                return

        for i in range(len(self.paths) - 1, -1, -1):
            local_pos = inverse_transform_pos(pos, self.paths[i], 'path')
            if hit_test_path(self.paths[i], local_pos):
                if ctrl_held:
                    self._add_to_selection('path', i)
                else:
                    self._select_single('path', i)
                self._reactivate_if_needed()
                return

        self._deselect()

    def mouseMoveEvent(self, event):
        pos = event.pos()

        # Handle transforms (usa métodos do mixin)
        if self._handle_mode == 'resizing':
            self._update_resize(pos)
            return
        if self._handle_mode == 'rotating':
            self._update_rotate(pos)
            return
        if self._handle_mode == 'moving':
            self._update_move(pos)
            return

        # Cursor hover sobre handles
        if self._handle_mode == 'selected':
            handle_id = self._hit_test_handles_at(pos)
            if handle_id:
                self.setCursor(self._handle_cursor(handle_id))
            elif self._hit_test_selected_body(pos):
                self.setCursor(Qt.CursorShape.SizeAllCursor)
            else:
                self.setCursor(Qt.CursorShape.ArrowCursor)
            return

        # Arrastar texto em text_mode
        if self.is_drawing and self.text_mode and self.selected_type == 'text' and self.selected_index >= 0:
            dx = pos.x() - self.drag_offset.x()
            dy = pos.y() - self.drag_offset.y()
            if abs(dx) > 2 or abs(dy) > 2:
                self._text_dragged = True
            annot = self.text_annotations[self.selected_index]
            annot['pos'] = QPoint(annot['pos'].x() + dx, annot['pos'].y() + dy)
            self.drag_offset = pos
            self.update()
            return

        # Fluxo normal de desenho
        if not self.is_drawing or not self.draw_mode:
            return

        # Eraser contínuo
        if self.current_tool == 'eraser':
            for i in range(len(self.paths) - 1, -1, -1):
                if hit_test_path(self.paths[i], pos):
                    self.paths.pop(i)
                    self.update()
            return

        self.current_point = pos
        if self.current_tool in ('freehand', 'highlighter'):
            self.current_path.lineTo(pos.x(), pos.y())
        self.update()

    def mouseReleaseEvent(self, event):
        # Finalizar transform via handles
        if self._handle_mode in ('resizing', 'rotating', 'moving'):
            self._handle_mode = 'selected'
            self._active_handle = None
            self._original_items_snapshot = []
            pos = event.pos()
            hid = self._hit_test_handles_at(pos)
            if hid:
                self.setCursor(self._handle_cursor(hid))
            elif self._hit_test_selected_body(pos):
                self.setCursor(Qt.CursorShape.SizeAllCursor)
            else:
                self.setCursor(Qt.CursorShape.ArrowCursor)
            self.update()
            return

        # Text mode release
        if self.is_drawing and self.text_mode and self.selected_type == 'text' and self.selected_index >= 0:
            self.is_drawing = False
            idx = self.selected_index
            if not self._text_dragged:
                annot = self.text_annotations[idx]
                self._editing_text_index = idx
                self._create_text_editor(
                    annot['pos'],
                    existing_text=annot['text'],
                    existing_annot=annot
                )
            self.selected_items = []
            self._text_dragged = False
            self.update()
            return

        # Draw mode release
        if not self.is_drawing or not self.draw_mode:
            return
        self.is_drawing = False

        if self.current_tool == 'eraser':
            self.update()
            return

        # Modo fantasma: desenho some ao soltar (não salva)
        if self.ghost_mode:
            self.current_path = QPainterPath()
            self.update()
            return

        pos = event.pos()
        pen = make_pen(self.brush_color, self.brush_size, self.current_tool)

        if self.current_tool in ('freehand', 'highlighter'):
            self.paths.append({
                'type': self.current_tool, 'path': self.current_path, 'pen': pen
            })
        elif self.current_tool == 'rectangle':
            rect = QRect(self.start_point, pos).normalized()
            self.paths.append({'type': 'rectangle', 'rect': rect, 'pen': pen})
        elif self.current_tool == 'filled-rect':
            rect = QRect(self.start_point, pos).normalized()
            modifiers = event.modifiers()
            if modifiers & Qt.KeyboardModifier.ShiftModifier and modifiers & Qt.KeyboardModifier.AltModifier:
                fill_color = QColor('#000000')
            elif modifiers & Qt.KeyboardModifier.ShiftModifier:
                fill_color = QColor('#FFFFFF')
            else:
                fill_color = QColor(self.brush_color)
            self.paths.append({
                'type': 'filled-rect', 'rect': rect, 'pen': pen, 'fill_color': fill_color
            })
        elif self.current_tool == 'circle':
            rect = QRect(self.start_point, pos).normalized()
            self.paths.append({'type': 'circle', 'rect': rect, 'pen': pen})
        elif self.current_tool == 'line':
            self.paths.append({
                'type': 'line', 'p1': QPoint(self.start_point), 'p2': QPoint(pos), 'pen': pen
            })
        elif self.current_tool == 'arrow':
            self.paths.append({
                'type': 'arrow', 'p1': QPoint(self.start_point), 'p2': QPoint(pos), 'pen': pen
            })

        # Registrar na pilha de undo unificada
        self._undo_stack.append(('path', len(self.paths) - 1))

        self.current_path = QPainterPath()
        self.update()

    def mouseDoubleClickEvent(self, event):
        if not (self.draw_mode or self.text_mode):
            return
        pos = event.pos()
        for i in range(len(self.text_annotations) - 1, -1, -1):
            hit, _ = hit_test_text(self.text_annotations[i], pos)
            if hit:
                self._deselect()
                annot = self.text_annotations[i]
                self._editing_text_index = i
                self._create_text_editor(
                    annot['pos'],
                    existing_text=annot['text'],
                    existing_annot=annot
                )
                return

    def keyPressEvent(self, event):
        if self._active_editor:
            if event.key() == Qt.Key.Key_Escape:
                self._dismiss_text_editor()
                self.update()
                return
            if event.key() == Qt.Key.Key_Return and not (event.modifiers() & Qt.KeyboardModifier.ShiftModifier):
                self._commit_text_editor()
                return

        if self._handle_mode != 'idle':
            if event.key() == Qt.Key.Key_Escape:
                self._deselect()
                return
            if event.key() == Qt.Key.Key_Delete:
                self._delete_selected()
                return

        super().keyPressEvent(event)

    # --- Ações ---

    def undo(self):
        if not self._undo_stack:
            return
        item_type, item_index = self._undo_stack.pop()
        if item_type == 'path' and 0 <= item_index < len(self.paths):
            self.paths.pop(item_index)
            # Ajustar índices restantes na stack
            self._undo_stack = [
                (t, i - 1) if t == 'path' and i > item_index else (t, i)
                for t, i in self._undo_stack
            ]
        elif item_type == 'text' and 0 <= item_index < len(self.text_annotations):
            self.text_annotations.pop(item_index)
            self._undo_stack = [
                (t, i - 1) if t == 'text' and i > item_index else (t, i)
                for t, i in self._undo_stack
            ]
        self._deselect()
        self.update()

    def clear_all(self):
        self.paths.clear()
        self.text_annotations.clear()
        self._undo_stack.clear()
        self._deselect()
        self._dismiss_text_editor()

    def add_text_annotation(self, pos, text, font=None, color=None):
        self.text_annotations.append({
            'pos': pos,
            'text': text,
            'font': font or QFont('Segoe UI', 16),
            'color': color or QColor('#FFFFFF'),
            'bold': False,
            'italic': False,
            'font_size': (font or QFont('Segoe UI', 16)).pointSize(),
        })
        self.update()

    def showEvent(self, event):
        super().showEvent(event)
        self.stay_on_top()
