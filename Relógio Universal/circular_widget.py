"""
Circular Widget - Widget circular transparente para Timer/Cronômetro
Design fosco semi-transparente que funciona sobre qualquer fundo
"""

from PyQt6.QtWidgets import QWidget, QMenu, QInputDialog, QWidgetAction, QSlider, QLabel, QHBoxLayout
from PyQt6.QtCore import Qt, QPoint, QRectF, pyqtSignal, QTimer
from PyQt6.QtGui import (
    QPainter, QColor, QFont, QPen, QBrush,
    QRadialGradient, QPainterPath
)

from settings import settings, TRANSLATIONS


class CircularTimerWidget(QWidget):
    """Widget circular para exibir timer/cronômetro"""

    # Sinais
    play_pause_clicked = pyqtSignal()
    reset_clicked = pyqtSignal()
    time_selected = pyqtSignal(int)  # segundos

    def __init__(self, size=150):
        super().__init__()
        self.circle_size = size
        self.dragging = False
        self.drag_offset = QPoint()

        # Transparência (0.0 a 1.0) - carrega das configurações
        self.opacity = settings.opacity

        # Estado do timer
        self.time_seconds = 0
        self.total_seconds = 0  # Para calcular progresso
        self.is_running = False
        self.is_timer_mode = False  # False = cronômetro, True = timer

        # Para detectar double-click
        self.click_timer = QTimer()
        self.click_timer.setSingleShot(True)
        self.click_timer.timeout.connect(self.single_click_action)
        self.pending_click = False

        self.init_ui()

    def init_ui(self):
        """Configura a interface"""
        # Janela sem bordas, sempre no topo, transparente
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)

        # Tamanho fixo circular
        self.setFixedSize(self.circle_size, self.circle_size)

        # Posição inicial (carrega das configurações ou centro da tela)
        saved_pos = settings.position
        if saved_pos:
            self.move(saved_pos[0], saved_pos[1])
        else:
            self.move_to_center()

    def move_to_center(self):
        """Move para o centro da tela"""
        from PyQt6.QtWidgets import QApplication
        screen = QApplication.primaryScreen().geometry()
        x = (screen.width() - self.width()) // 2
        y = (screen.height() - self.height()) // 2
        self.move(x, y)

    def paintEvent(self, event):
        """Desenha o widget circular"""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        center_x = self.width() / 2
        center_y = self.height() / 2
        radius = min(center_x, center_y) - 5

        # Calcula alpha baseado na opacidade
        base_alpha = int(255 * self.opacity)

        # Fundo circular com gradiente fosco
        gradient = QRadialGradient(center_x, center_y, radius)
        gradient.setColorAt(0, QColor(40, 40, 40, int(base_alpha * 0.85)))
        gradient.setColorAt(0.7, QColor(30, 30, 30, int(base_alpha * 0.9)))
        gradient.setColorAt(1, QColor(20, 20, 20, int(base_alpha * 0.95)))

        # Desenha círculo de fundo
        painter.setBrush(QBrush(gradient))
        painter.setPen(QPen(QColor(80, 80, 80, int(base_alpha * 0.6)), 2))
        painter.drawEllipse(
            QRectF(center_x - radius, center_y - radius, radius * 2, radius * 2)
        )

        # Arco de progresso (se timer mode) - mais afastado do centro
        if self.is_timer_mode and self.total_seconds > 0:
            progress = self.time_seconds / self.total_seconds
            # Arco na borda externa (radius - 4 para ficar mais na borda)
            self.draw_progress_arc(painter, center_x, center_y, radius - 4, progress)

        # Texto do tempo
        self.draw_time_text(painter, center_x, center_y)

        # Indicador de estado (play/pause)
        self.draw_state_indicator(painter, center_x, center_y + radius * 0.35)

    def draw_progress_arc(self, painter, cx, cy, radius, progress):
        """Desenha o arco de progresso na borda externa"""
        rect = QRectF(cx - radius, cy - radius, radius * 2, radius * 2)

        # Fundo do arco (cinza escuro) - mais fino (4px)
        painter.setPen(QPen(QColor(60, 60, 60), 4, Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
        painter.drawArc(rect, 90 * 16, -360 * 16)

        # Arco de progresso (verde para azul baseado no tempo restante)
        if progress > 0.3:
            color = QColor(0, 200, 100)  # Verde
        elif progress > 0.1:
            color = QColor(255, 180, 0)  # Amarelo/Laranja
        else:
            color = QColor(255, 80, 80)  # Vermelho

        painter.setPen(QPen(color, 4, Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
        # Desenha do topo (90°) no sentido horário
        span = int(-360 * progress * 16)
        painter.drawArc(rect, 90 * 16, span)

    def draw_time_text(self, painter, cx, cy):
        """Desenha o texto do tempo no centro"""
        # Formata o tempo
        hours = self.time_seconds // 3600
        minutes = (self.time_seconds % 3600) // 60
        seconds = self.time_seconds % 60

        if hours > 0:
            time_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            font_size = int(self.circle_size * 0.13)  # Menor para caber
        else:
            time_str = f"{minutes:02d}:{seconds:02d}"
            font_size = int(self.circle_size * 0.19)  # Ligeiramente menor

        font = QFont('Consolas', font_size, QFont.Weight.Bold)
        painter.setFont(font)
        painter.setPen(QColor(255, 255, 255))

        # Centraliza o texto (um pouco mais pra cima)
        text_rect = painter.fontMetrics().boundingRect(time_str)
        text_x = cx - text_rect.width() / 2
        text_y = cy + text_rect.height() / 4 - 2  # Sobe um pouco

        painter.drawText(int(text_x), int(text_y), time_str)

    def draw_state_indicator(self, painter, cx, cy):
        """Desenha indicador de play/pause"""
        size = self.circle_size * 0.08

        if self.is_running:
            # Pause icon (duas barras)
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor(150, 150, 150))
            bar_width = size * 0.3
            gap = size * 0.3
            painter.drawRect(QRectF(cx - gap - bar_width, cy - size/2, bar_width, size))
            painter.drawRect(QRectF(cx + gap, cy - size/2, bar_width, size))
        else:
            # Play icon (triângulo)
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(QColor(150, 150, 150))
            path = QPainterPath()
            path.moveTo(cx - size * 0.4, cy - size * 0.5)
            path.lineTo(cx - size * 0.4, cy + size * 0.5)
            path.lineTo(cx + size * 0.6, cy)
            path.closeSubpath()
            painter.drawPath(path)

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

    def mousePressEvent(self, event):
        """Inicia arrasto ou clique"""
        if event.button() == Qt.MouseButton.LeftButton:
            # Verifica se é double-click
            if self.pending_click:
                self.pending_click = False
                self.click_timer.stop()
                self.double_click_action()
            else:
                self.pending_click = True
                self.click_timer.start(300)  # 300ms para double-click

            # Prepara para arrasto
            self.drag_offset = event.pos()
            self.dragging = False
            self.drag_start_pos = event.globalPosition().toPoint()

    def mouseMoveEvent(self, event):
        """Move durante arrasto"""
        if event.buttons() & Qt.MouseButton.LeftButton:
            # Verifica se moveu o suficiente para ser arrasto
            delta = (event.globalPosition().toPoint() - self.drag_start_pos).manhattanLength()
            if delta > 10:
                self.dragging = True
                self.pending_click = False
                self.click_timer.stop()
                new_pos = event.globalPosition().toPoint() - self.drag_offset
                self.move(new_pos)

    def mouseReleaseEvent(self, event):
        """Finaliza arrasto ou clique"""
        if event.button() == Qt.MouseButton.LeftButton:
            if self.dragging:
                self.dragging = False
                self.pending_click = False
                # Salva posição após arrastar
                pos = self.pos()
                settings.position = (pos.x(), pos.y())
                settings.save()

    def single_click_action(self):
        """Ação de clique simples - play/pause"""
        if self.pending_click and not self.dragging:
            self.play_pause_clicked.emit()
        self.pending_click = False

    def double_click_action(self):
        """Ação de double-click - reset"""
        self.reset_clicked.emit()

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

        # Opções de tempo predefinidas (traduzidas)
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
            # Marca o idioma atual
            lang_name = lang_data['name']
            if lang_code == settings.language:
                lang_name = f"✓ {lang_name}"
            lang_menu.addAction(lang_name, lambda lc=lang_code: self.set_language(lc))

        menu.addSeparator()
        menu.addAction(settings.tr('close'), self.close)

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
        """Converte entrada de tempo para segundos (aceita MM:SS ou segundos)"""
        text = text.strip()
        try:
            if ':' in text:
                # Formato MM:SS
                parts = text.split(':')
                if len(parts) == 2:
                    minutes = int(parts[0])
                    seconds = int(parts[1])
                    return minutes * 60 + seconds
                elif len(parts) == 3:
                    # Formato HH:MM:SS
                    hours = int(parts[0])
                    minutes = int(parts[1])
                    seconds = int(parts[2])
                    return hours * 3600 + minutes * 60 + seconds
            else:
                # Apenas segundos
                return int(text)
        except ValueError:
            return 0
        return 0


if __name__ == '__main__':
    # Teste do widget
    from PyQt6.QtWidgets import QApplication
    import sys

    app = QApplication(sys.argv)
    widget = CircularTimerWidget(150)
    widget.set_time(125)  # 2:05
    widget.show()
    sys.exit(app.exec())
