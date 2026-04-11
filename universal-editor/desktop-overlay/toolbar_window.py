"""
Toolbar Window - Barra vertical compacta estilo moderno
Sempre visível, arrastável, semi-transparente quando idle.
Usa Segoe Fluent Icons quando disponível, fallback para emojis.
"""

from PySide6.QtWidgets import QWidget, QColorDialog, QApplication, QToolTip
from PySide6.QtCore import Qt, Signal, QPoint, QRect, QTimer, QRectF
from PySide6.QtGui import QFont, QColor, QPainter, QBrush, QPen, QCursor

from settings import save_settings
from toolbar_theme import (
    BG_DARK, BG_BUTTON, BG_HOVER, BG_ACTIVE, ACCENT,
    TEXT_COLOR, TEXT_DIM, BORDER_COLOR, SEPARATOR_COLOR, DANGER_BG,
    POINTER_ACTIVE_BG, POINTER_ACTIVE_BORDER, GREEN,
    GHOST_ACTIVE_BG, GHOST_ACTIVE_BORDER,
    SIZE_PRESETS, BAR_WIDTH, BTN_SIZE, GRIP_HEIGHT, SEP_HEIGHT, PADDING,
    CORNER_RADIUS, BTN_CORNER_RADIUS,
    get_icon_font, get_icon, build_buttons
)


class ToolbarWindow(QWidget):
    """Barra vertical compacta com ícones modernos"""

    tool_changed = Signal(str)
    color_changed = Signal(str)
    size_changed = Signal(int)
    undo_requested = Signal()
    clear_requested = Signal()
    draw_mode_toggled = Signal()
    guide_toggled = Signal()
    text_mode_toggled = Signal()
    ghost_mode_toggled = Signal()
    pointer_mode_requested = Signal()
    draw_mode_requested = Signal()

    def __init__(self, settings=None):
        super().__init__()
        self.settings = settings or {}
        self.current_tool = 'freehand'
        self._draw_mode_on = False
        self._guide_on = False
        self._text_mode_on = False
        self._ghost_on = False
        self._minimized = False
        self._first_show = True

        # Drag
        self._dragging = False
        self._drag_offset = QPoint()

        # Cor e tamanho
        self._brush_color = self.settings.get('brush_color', '#FF0000')
        self._size_index = 1
        self._brush_size = SIZE_PRESETS[self._size_index]

        # Hover
        self._hovered = False
        self._hover_btn_index = -1

        # Botões
        self._buttons = build_buttons(self._brush_size)

        # Fonte de ícones (cacheada)
        self._icon_font_name = None

        self._init_ui()

    def _init_ui(self):
        self.setWindowTitle("Editor Universal")
        self.setWindowFlags(
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool |
            Qt.WindowType.FramelessWindowHint
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setMouseTracking(True)
        self._update_geometry()

    def _update_geometry(self):
        if self._minimized:
            self.setFixedSize(BAR_WIDTH, GRIP_HEIGHT + BTN_SIZE)
        else:
            self.setFixedSize(BAR_WIDTH, self._get_total_height())

    def _get_button_y_positions(self):
        positions = []
        y = GRIP_HEIGHT
        for btn in self._buttons:
            if btn[3] == 'sep':
                positions.append(y)
                y += SEP_HEIGHT + 4
            else:
                positions.append(y)
                y += BTN_SIZE
        return positions

    def _get_total_height(self):
        positions = self._get_button_y_positions()
        if not positions:
            return GRIP_HEIGHT + BTN_SIZE
        last_btn = self._buttons[-1]
        last_y = positions[-1]
        if last_btn[3] == 'sep':
            return last_y + SEP_HEIGHT + 4
        return last_y + BTN_SIZE

    def _get_icon_font(self):
        """Retorna nome da fonte de ícones (cached)"""
        if self._icon_font_name is None:
            self._icon_font_name = get_icon_font()
        return self._icon_font_name

    # --- paintEvent ---

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)

        # Fundo principal com cantos arredondados
        p.setBrush(QBrush(QColor(BG_DARK)))
        p.setPen(QPen(BORDER_COLOR, 1))
        p.drawRoundedRect(0, 0, self.width(), self.height(),
                          CORNER_RADIUS, CORNER_RADIUS)

        # Glass effect: highlight sutil no topo
        highlight = QColor(255, 255, 255, 12)
        p.setPen(QPen(highlight, 1))
        p.setBrush(Qt.BrushStyle.NoBrush)
        p.drawRoundedRect(1, 1, self.width() - 2, self.height() - 2,
                          CORNER_RADIUS - 1, CORNER_RADIUS - 1)

        # Grip: barra centralizada
        grip_color = QColor(TEXT_DIM)
        grip_color.setAlpha(100)
        p.setPen(Qt.PenStyle.NoPen)
        p.setBrush(QBrush(grip_color))
        cx = BAR_WIDTH // 2
        p.drawRoundedRect(cx - 8, 5, 16, 3, 1.5, 1.5)

        if self._minimized:
            self._draw_button(p, 0, GRIP_HEIGHT, get_icon('expand'),
                              'Expandir', False, False, 'expand')
        else:
            positions = self._get_button_y_positions()
            for i, (btn_id, icon, tooltip, btype) in enumerate(self._buttons):
                y = positions[i]
                if btype == 'sep':
                    sep_color = QColor(SEPARATOR_COLOR)
                    sep_color.setAlpha(80)
                    p.setPen(QPen(sep_color, 1))
                    p.drawLine(10, y + 2, BAR_WIDTH - 10, y + 2)
                else:
                    is_active = self._is_button_active(btn_id, btype)
                    is_hover = (i == self._hover_btn_index)
                    self._draw_button(p, i, y, icon, tooltip,
                                      is_active, is_hover, btype, btn_id)

        p.end()

    def _draw_button(self, p, index, y, icon, tooltip, is_active, is_hover,
                     btype, btn_id=None):
        x = PADDING
        w = BAR_WIDTH - 2 * PADDING
        h = BTN_SIZE

        # Background
        p.setPen(Qt.PenStyle.NoPen)
        if btn_id == 'pointer' and is_active:
            p.setBrush(QBrush(POINTER_ACTIVE_BG))
        elif btn_id == 'ghost' and is_active:
            p.setBrush(QBrush(GHOST_ACTIVE_BG))
        elif btn_id == 'clear' and is_hover:
            p.setBrush(QBrush(QColor(140, 40, 40)))
        elif btn_id == 'clear':
            p.setBrush(QBrush(DANGER_BG))
        elif is_active:
            p.setBrush(QBrush(BG_ACTIVE))
        elif is_hover:
            p.setBrush(QBrush(BG_HOVER))
        else:
            p.setBrush(Qt.BrushStyle.NoBrush)

        p.drawRoundedRect(x, y, w, h, BTN_CORNER_RADIUS, BTN_CORNER_RADIUS)

        # Borda para pointer ativo
        if btn_id == 'pointer' and is_active:
            p.setPen(QPen(POINTER_ACTIVE_BORDER, 1))
            p.setBrush(Qt.BrushStyle.NoBrush)
            p.drawRoundedRect(x, y, w, h, BTN_CORNER_RADIUS, BTN_CORNER_RADIUS)

        # Borda para ghost ativo
        if btn_id == 'ghost' and is_active:
            p.setPen(QPen(GHOST_ACTIVE_BORDER, 1))
            p.setBrush(Qt.BrushStyle.NoBrush)
            p.drawRoundedRect(x, y, w, h, BTN_CORNER_RADIUS, BTN_CORNER_RADIUS)

        # Cor swatch
        if btype == 'color':
            p.setBrush(QBrush(QColor(self._brush_color)))
            p.setPen(QPen(QColor('#666'), 1.5))
            circle_size = 18
            cx = BAR_WIDTH // 2 - circle_size // 2
            cy = y + h // 2 - circle_size // 2
            p.drawEllipse(cx, cy, circle_size, circle_size)
            return

        # Tamanho (número)
        if btype == 'size':
            p.setPen(QPen(TEXT_COLOR))
            font = QFont('Segoe UI', 12, QFont.Weight.Bold)
            p.setFont(font)
            p.drawText(QRect(x, y, w, h),
                       Qt.AlignmentFlag.AlignCenter, str(self._brush_size))
            return

        # Ícone
        text_color = TEXT_COLOR
        if is_active:
            if btn_id == 'pointer':
                text_color = GREEN
            elif btn_id == 'ghost':
                text_color = GHOST_ACTIVE_BORDER
            else:
                text_color = QColor(255, 255, 255)
        elif is_hover:
            text_color = QColor(240, 240, 240)

        p.setPen(QPen(text_color))

        icon_font = self._get_icon_font()
        if icon_font:
            p.setFont(QFont(icon_font, 14))
        else:
            p.setFont(QFont('Segoe UI', 14))

        p.drawText(QRect(x, y, w, h), Qt.AlignmentFlag.AlignCenter, icon)

        # Indicador lateral para ferramentas ativas
        if is_active and btype == 'tool':
            p.setBrush(QBrush(ACCENT))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawRoundedRect(1, y + 10, 3, h - 20, 1.5, 1.5)

    def _is_button_active(self, btn_id, btype):
        if btype == 'tool':
            return btn_id == self.current_tool and self._draw_mode_on
        if btype == 'pointer_mode':
            return not self._draw_mode_on and not self._text_mode_on
        if btype == 'toggle_guide':
            return self._guide_on
        if btype == 'toggle_text':
            return self._text_mode_on
        if btype == 'toggle_ghost':
            return self._ghost_on
        return False

    # --- Mouse Events ---

    def mousePressEvent(self, event):
        if event.button() != Qt.MouseButton.LeftButton:
            return
        pos = event.pos()

        if pos.y() <= GRIP_HEIGHT:
            self._dragging = True
            self._drag_offset = pos
            self.setCursor(Qt.CursorShape.ClosedHandCursor)
            return

        if self._minimized:
            if pos.y() > GRIP_HEIGHT:
                self._minimized = False
                self._buttons = build_buttons(self._brush_size)
                self._update_geometry()
                self.update()
            return

        btn_index = self._get_button_at(pos)
        if btn_index >= 0:
            self._handle_button_click(btn_index)

    def mouseMoveEvent(self, event):
        if self._dragging:
            new_pos = event.globalPosition().toPoint() - self._drag_offset
            screen = QApplication.primaryScreen()
            if screen:
                geo = screen.availableGeometry()
                new_x = max(geo.left(), min(new_pos.x(), geo.right() - self.width()))
                new_y = max(geo.top(), min(new_pos.y(), geo.bottom() - self.height()))
                self.move(new_x, new_y)
            else:
                self.move(new_pos)
            return

        pos = event.pos()
        old_hover = self._hover_btn_index
        self._hover_btn_index = self._get_button_at(pos)
        if old_hover != self._hover_btn_index:
            self.update()

        if self._hover_btn_index >= 0 and not self._minimized:
            btn = self._buttons[self._hover_btn_index]
            global_pos = event.globalPosition().toPoint()
            QToolTip.showText(QPoint(global_pos.x() + 15, global_pos.y()),
                              btn[2], self)
            self.setCursor(Qt.CursorShape.PointingHandCursor)
        elif pos.y() <= GRIP_HEIGHT:
            QToolTip.hideText()
            self.setCursor(Qt.CursorShape.OpenHandCursor)
        else:
            QToolTip.hideText()
            self.setCursor(Qt.CursorShape.ArrowCursor)

    def mouseReleaseEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton and self._dragging:
            self._dragging = False
            self.setCursor(Qt.CursorShape.ArrowCursor)
            self._save_position()

    def enterEvent(self, event):
        self._hovered = True
        self.setWindowOpacity(1.0)

    def leaveEvent(self, event):
        self._hovered = False
        self._hover_btn_index = -1
        self.setWindowOpacity(0.8)
        self.update()

    def _get_button_at(self, pos):
        if self._minimized:
            return 0 if pos.y() > GRIP_HEIGHT else -1
        positions = self._get_button_y_positions()
        for i, (btn_id, icon, tooltip, btype) in enumerate(self._buttons):
            if btype == 'sep':
                continue
            y = positions[i]
            if QRect(PADDING, y, BAR_WIDTH - 2 * PADDING, BTN_SIZE).contains(pos):
                return i
        return -1

    def _handle_button_click(self, index):
        btn_id, icon, tooltip, btype = self._buttons[index]

        if btype == 'pointer_mode':
            self.pointer_mode_requested.emit()

        elif btype == 'tool':
            self.current_tool = btn_id
            # Auto-ativar draw mode PRIMEIRO, depois emitir tool_changed
            if not self._draw_mode_on:
                self.draw_mode_requested.emit()
            self.tool_changed.emit(btn_id)
            self.update()

        elif btype == 'color':
            self._choose_color()

        elif btype == 'size':
            self._cycle_size()

        elif btype == 'toggle_guide':
            self.guide_toggled.emit()

        elif btype == 'toggle_text':
            self.text_mode_toggled.emit()

        elif btype == 'toggle_ghost':
            self.ghost_mode_toggled.emit()

        elif btype == 'action_undo':
            self.undo_requested.emit()

        elif btype == 'action_clear':
            self.clear_requested.emit()

        elif btype == 'minimize':
            self._minimized = True
            self._update_geometry()
            self.update()

        elif btype == 'expand':
            self._minimized = False
            self._buttons = build_buttons(self._brush_size)
            self._update_geometry()
            self.update()

    # --- Ações ---

    def _choose_color(self):
        color = QColorDialog.getColor(QColor(self._brush_color), self,
                                      "Escolha uma cor")
        if color.isValid():
            self._brush_color = color.name()
            self.color_changed.emit(self._brush_color)
            self.update()

    def _cycle_size(self):
        self._size_index = (self._size_index + 1) % len(SIZE_PRESETS)
        self._brush_size = SIZE_PRESETS[self._size_index]
        for i, btn in enumerate(self._buttons):
            if btn[0] == 'size':
                self._buttons[i] = ('size', str(self._brush_size),
                                    'Thickness (click to cycle)', 'size')
                break
        self.size_changed.emit(self._brush_size)
        self.update()

    def update_draw_mode_state(self, active):
        self._draw_mode_on = active
        self.update()

    def update_guide_state(self, active):
        self._guide_on = active
        self.update()

    def update_text_mode_state(self, active):
        self._text_mode_on = active
        self.update()

    def update_ghost_state(self, active):
        self._ghost_on = active
        self.update()

    # --- Posição persistente ---

    def _save_position(self):
        pos = self.pos()
        self.settings['toolbar_x'] = pos.x()
        self.settings['toolbar_y'] = pos.y()
        try:
            save_settings(self.settings)
        except Exception:
            pass

    def _restore_position(self):
        screen = QApplication.primaryScreen()
        if not screen:
            return
        geo = screen.availableGeometry()
        saved_x = self.settings.get('toolbar_x')
        saved_y = self.settings.get('toolbar_y')
        if saved_x is not None and saved_y is not None:
            x = max(geo.left(), min(int(saved_x), geo.right() - self.width()))
            y = max(geo.top(), min(int(saved_y), geo.bottom() - self.height()))
            self.move(x, y)
        else:
            x = geo.right() - BAR_WIDTH - 20
            y = geo.top() + (geo.height() - self.height()) // 2
            self.move(x, y)

    def show(self):
        super().show()
        if self._first_show:
            self._first_show = False
            self._restore_position()
        self.setWindowOpacity(0.8)
