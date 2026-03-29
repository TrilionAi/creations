"""
Circular Widget - Widget circular transparente para Timer/Cronômetro
Design fosco semi-transparente que funciona sobre qualquer fundo
Suporta título editável por clique
"""

from PyQt6.QtWidgets import (QWidget, QMenu, QInputDialog, QWidgetAction,
                              QSlider, QLabel, QHBoxLayout, QLineEdit)
from PyQt6.QtCore import Qt, QPoint, QRectF, pyqtSignal, QTimer
from PyQt6.QtGui import (
    QPainter, QColor, QFont, QPen, QBrush,
    QRadialGradient, QPainterPath
)

from settings import settings, TRANSLATIONS


class CircularTimerWidget(QWidget):
    """Widget circular para exibir timer/cronômetro com título editável"""

    # Sinais
    play_pause_clicked = pyqtSignal()
    reset_clicked = pyqtSignal()
    time_selected = pyqtSignal(int)  # segundos
    title_changed = pyqtSignal(str)
    position_changed = pyqtSignal()
    add_timer_requested = pyqtSignal()
    remove_requested = pyqtSignal()

    def __init__(self, size=150, title="Timer"):
        super().__init__()
        self.circle_size = size
        self.dragging = False
        self.drag_offset = QPoint()

        # Transparência (0.0 a 1.0) - carrega das configurações
        self.opacity = settings.opacity

        # Estado do timer
        self.time_seconds = 0
        self.total_seconds = 0
        self.is_running = False
        self.is_timer_mode = False

        # Title
        self.title = title
        self.title_rect = QRectF()
        self.removable = False

        # Click position for title hit detection
        self.last_click_pos = QPoint()

        # Para detectar double-click
        self.click_timer = QTimer()
        self.click_timer.setSingleShot(True)
        self.click_timer.timeout.connect(self.single_click_action)
        self.pending_click = False

        self.init_ui()
        self.setup_title_edit()

    def init_ui(self):
        """Configura a interface"""
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setFixedSize(self.circle_size, self.circle_size)

    def setup_title_edit(self):
        """Creates the inline title editor"""
        self.title_edit = QLineEdit(self)
        self.title_edit.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.title_edit.setStyleSheet("""
            QLineEdit {
                background: rgba(50, 50, 50, 230);
                color: white;
                border: 1px solid #00c864;
                border-radius: 3px;
                font-family: 'Segoe UI', sans-serif;
                font-size: 10px;
                padding: 1px 4px;
            }
        """)
        self.title_edit.hide()
        self.title_edit.editingFinished.connect(self.finish_title_edit)

    def set_position(self, pos_x, pos_y):
        """Sets widget position from saved settings"""
        if pos_x is not None and pos_y is not None:
            self.move(pos_x, pos_y)
        else:
            self.move_to_center()

    def move_to_center(self):
        """Move para o centro da tela"""
        from PyQt6.QtWidgets import QApplication
        screen = QApplication.primaryScreen().geometry()
        x = (screen.width() - self.width()) // 2
        y = (screen.height() - self.height()) // 2
        self.move(x, y)

    def set_removable(self, removable):
        """Sets whether this timer can be removed"""
        self.removable = removable

    # --- Paint ---

    def paintEvent(self, event):
        """Desenha o widget circular"""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        center_x = self.width() / 2
        center_y = self.height() / 2
        radius = min(center_x, center_y) - 5

        base_alpha = int(255 * self.opacity)

        # Fundo circular com gradiente fosco
        gradient = QRadialGradient(center_x, center_y, radius)
        gradient.setColorAt(0, QColor(40, 40, 40, int(base_alpha * 0.85)))
        gradient.setColorAt(0.7, QColor(30, 30, 30, int(base_alpha * 0.9)))
        gradient.setColorAt(1, QColor(20, 20, 20, int(base_alpha * 0.95)))

        painter.setBrush(QBrush(gradient))
        painter.setPen(QPen(QColor(80, 80, 80, int(base_alpha * 0.6)), 2))
        painter.drawEllipse(
            QRectF(center_x - radius, center_y - radius, radius * 2, radius * 2)
        )

        # Arco de progresso (se timer mode)
        if self.is_timer_mode and self.total_seconds > 0:
            progress = self.time_seconds / self.total_seconds
            self.draw_progress_arc(painter, center_x, center_y, radius - 4, progress)

        # Title text
        self.draw_title(painter, center_x, center_y, radius)

        # Texto do tempo
        self.draw_time_text(painter, center_x, center_y)

        # Indicador de estado (play/pause)
        self.draw_state_indicator(painter, center_x, center_y + radius * 0.40)

    def draw_title(self, painter, cx, cy, radius):
        """Draws the title text above the time"""
        font_size = max(8, int(self.circle_size * 0.063))
        font = QFont('Segoe UI', font_size)
        painter.setFont(font)
        painter.setPen(QColor(160, 160, 160))

        metrics = painter.fontMetrics()
        max_width = int(radius * 1.5)
        display_title = metrics.elidedText(self.title, Qt.TextElideMode.ElideRight, max_width)

        text_width = metrics.horizontalAdvance(display_title)
        text_x = cx - text_width / 2
        text_y = cy - radius * 0.35

        painter.drawText(int(text_x), int(text_y), display_title)

        # Store rect for hit testing (with generous padding)
        padding_h = 10
        padding_v = 6
        self.title_rect = QRectF(
            text_x - padding_h,
            text_y - metrics.ascent() - padding_v,
            text_width + padding_h * 2,
            metrics.height() + padding_v * 2
        )

    def draw_progress_arc(self, painter, cx, cy, radius, progress):
        """Desenha o arco de progresso na borda externa"""
        rect = QRectF(cx - radius, cy - radius, radius * 2, radius * 2)

        painter.setPen(QPen(QColor(60, 60, 60), 4, Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
        painter.drawArc(rect, 90 * 16, -360 * 16)

        if progress > 0.3:
            color = QColor(0, 200, 100)
        elif progress > 0.1:
            color = QColor(255, 180, 0)
        else:
            color = QColor(255, 80, 80)

        painter.setPen(QPen(color, 4, Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
        span = int(-360 * progress * 16)
        painter.drawArc(rect, 90 * 16, span)

    def draw_time_text(self, painter, cx, cy):
        """Desenha o texto do tempo no centro"""
        hours = self.time_seconds // 3600
        minutes = (self.time_seconds % 3600) // 60
        seconds = self.time_seconds % 60

        if hours > 0:
            time_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            font_size = int(self.circle_size * 0.13)
        else:
            time_str = f"{minutes:02d}:{seconds:02d}"
            font_size = int(self.circle_size * 0.19)

        font = QFont('Consolas', font_size, QFont.Weight.Bold)
        painter.setFont(font)
        painter.setPen(QColor(255, 255, 255))

        text_rect = painter.fontMetrics().boundingRect(time_str)
        text_x = cx - text_rect.width() / 2
        text_y = cy + text_rect.height() / 4 + 3

        painter.drawText(int(text_x), int(text_y), time_str)

    def draw_state_indicator(self, painter, cx, cy):
        """Desenha indicador de play/pause"""
        size = self.circle_size * 0.08

        if self.is_running:
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor(150, 150, 150))
            bar_width = size * 0.3
            gap = size * 0.3
            painter.drawRect(QRectF(cx - gap - bar_width, cy - size/2, bar_width, size))
            painter.drawRect(QRectF(cx + gap, cy - size/2, bar_width, size))
        else:
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor(150, 150, 150))
            path = QPainterPath()
            path.moveTo(cx - size * 0.4, cy - size * 0.5)
            path.lineTo(cx - size * 0.4, cy + size * 0.5)
            path.lineTo(cx + size * 0.6, cy)
            path.closeSubpath()
            painter.drawPath(path)

    # --- State ---

    def set_time(self, seconds, is_timer=False):
        """Define o tempo atual"""
        self.time_seconds = seconds
        if is_timer:
            self.total_seconds = seconds
        self.is_timer_mode = is_timer
        self.update()

    def set_running(self, running):
        """Define se está rodando"""
        self.is_running = running
        self.update()

    def update_time(self, seconds):
        """Atualiza o tempo exibido"""
        self.time_seconds = seconds
        self.update()

    # --- Click handling ---

    def mousePressEvent(self, event):
        """Inicia arrasto ou clique"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.last_click_pos = event.pos()

            if self.pending_click:
                self.pending_click = False
                self.click_timer.stop()
                self.double_click_action()
            else:
                self.pending_click = True
                self.click_timer.start(300)

            self.drag_offset = event.pos()
            self.dragging = False
            self.drag_start_pos = event.globalPosition().toPoint()

    def mouseMoveEvent(self, event):
        """Move durante arrasto"""
        if event.buttons() & Qt.MouseButton.LeftButton:
            delta = (event.globalPosition().toPoint() - self.drag_start_pos).manhattanLength()
            if delta > 10:
                self.dragging = True
                self.pending_click = False
                self.click_timer.stop()
                new_pos = event.globalPosition().toPoint() - self.drag_offset
                self.move(new_pos)

    def mouseReleaseEvent(self, event):
        """Finaliza arrasto"""
        if event.button() == Qt.MouseButton.LeftButton:
            if self.dragging:
                self.dragging = False
                self.pending_click = False
                self.position_changed.emit()

    def single_click_action(self):
        """Ação de clique simples - play/pause ou editar título"""
        if self.pending_click and not self.dragging:
            if self.title_rect.contains(self.last_click_pos.toPointF()):
                self.show_title_edit()
            else:
                self.play_pause_clicked.emit()
        self.pending_click = False

    def double_click_action(self):
        """Ação de double-click - reset (funciona em qualquer lugar)"""
        if self.title_edit.isVisible():
            self.title_edit.hide()
        self.reset_clicked.emit()

    # --- Title editing ---

    def show_title_edit(self):
        """Shows inline editor for the title"""
        edit_width = int(self.circle_size * 0.75)
        edit_height = 20
        x = (self.width() - edit_width) // 2
        y = max(5, int(self.title_rect.top()))
        self.title_edit.setGeometry(x, y, edit_width, edit_height)
        self.title_edit.setText(self.title)
        self.title_edit.selectAll()
        self.title_edit.show()
        self.title_edit.setFocus()

    def finish_title_edit(self):
        """Saves the title from the inline editor"""
        if not self.title_edit.isVisible():
            return
        new_title = self.title_edit.text().strip()
        if new_title:
            self.title = new_title
        self.title_edit.hide()
        self.title_changed.emit(self.title)
        self.update()

    # --- Context menu ---

    def contextMenuEvent(self, event):
        """Menu de contexto (clique direito)"""
        menu = QMenu(self)
        menu.setStyleSheet("""
            QMenu {
                background-color: #2b2b2b;
                color: white;
                border: 1px solid #444;
                padding: 5px;
            }
            QMenu::item {
                padding: 8px 25px;
            }
            QMenu::item:selected {
                background-color: #4a4a4a;
            }
            QMenu::separator {
                height: 1px;
                background: #444;
                margin: 5px 0;
            }
            QSlider::groove:horizontal {
                height: 6px;
                background: #555;
                border-radius: 3px;
            }
            QSlider::handle:horizontal {
                background: #00c864;
                width: 14px;
                margin: -4px 0;
                border-radius: 7px;
            }
            QSlider::sub-page:horizontal {
                background: #00c864;
                border-radius: 3px;
            }
        """)

        # Opções de tempo predefinidas
        menu.addAction(settings.tr('stopwatch'), lambda: self.time_selected.emit(0))
        menu.addSeparator()
        menu.addAction(f"1 {settings.tr('minute')}", lambda: self.time_selected.emit(60))
        menu.addAction(f"5 {settings.tr('minutes')}", lambda: self.time_selected.emit(300))
        menu.addAction(f"10 {settings.tr('minutes')}", lambda: self.time_selected.emit(600))
        menu.addAction(f"15 {settings.tr('minutes')}", lambda: self.time_selected.emit(900))
        menu.addAction(settings.tr('pomodoro_25'), lambda: self.time_selected.emit(1500))
        menu.addAction(settings.tr('pomodoro_45'), lambda: self.time_selected.emit(2700))
        menu.addAction(f"1 {settings.tr('hour')}", lambda: self.time_selected.emit(3600))
        menu.addSeparator()
        menu.addAction(settings.tr('custom'), self.show_custom_time_dialog)
        menu.addSeparator()

        # Slider de transparência
        opacity_widget = QWidget()
        opacity_layout = QHBoxLayout(opacity_widget)
        opacity_layout.setContentsMargins(10, 5, 10, 5)

        opacity_label = QLabel(settings.tr('opacity'))
        opacity_label.setStyleSheet("color: white;")
        opacity_layout.addWidget(opacity_label)

        opacity_slider = QSlider(Qt.Orientation.Horizontal)
        opacity_slider.setMinimum(30)
        opacity_slider.setMaximum(100)
        opacity_slider.setValue(int(self.opacity * 100))
        opacity_slider.setFixedWidth(100)
        opacity_slider.valueChanged.connect(self.set_opacity)
        opacity_layout.addWidget(opacity_slider)

        opacity_action = QWidgetAction(menu)
        opacity_action.setDefaultWidget(opacity_widget)
        menu.addAction(opacity_action)

        menu.addSeparator()

        # Submenu de idioma
        lang_menu = menu.addMenu(settings.tr('language'))
        for lang_code, lang_data in TRANSLATIONS.items():
            lang_name = lang_data['name']
            if lang_code == settings.language:
                lang_name = f"✓ {lang_name}"
            lang_menu.addAction(lang_name, lambda lc=lang_code: self.set_language(lc))

        menu.addSeparator()

        # Add / Remove timer
        menu.addAction(settings.tr('add_timer'), lambda: self.add_timer_requested.emit())
        if self.removable:
            menu.addAction(settings.tr('remove_timer'), lambda: self.remove_requested.emit())

        menu.exec(event.globalPos())

    def set_opacity(self, value):
        """Define a opacidade do widget"""
        self.opacity = value / 100.0
        settings.opacity = self.opacity
        settings.save()
        self.update()

    def set_language(self, lang_code):
        """Define o idioma do app"""
        settings.language = lang_code
        settings.save()

    def show_custom_time_dialog(self):
        """Mostra diálogo para tempo personalizado"""
        text, ok = QInputDialog.getText(
            self,
            settings.tr('custom_title'),
            settings.tr('custom_prompt'),
            text="5:00"
        )
        if ok and text:
            seconds = self.parse_time_input(text)
            if seconds > 0:
                self.time_selected.emit(seconds)

    def parse_time_input(self, text):
        """Converte entrada de tempo para segundos"""
        text = text.strip()
        try:
            if ':' in text:
                parts = text.split(':')
                if len(parts) == 2:
                    minutes = int(parts[0])
                    seconds = int(parts[1])
                    return minutes * 60 + seconds
                elif len(parts) == 3:
                    hours = int(parts[0])
                    minutes = int(parts[1])
                    seconds = int(parts[2])
                    return hours * 3600 + minutes * 60 + seconds
            else:
                return int(text)
        except ValueError:
            return 0
        return 0
