"""
Overlay Widget - Barra horizontal de métricas do sistema
Fica sempre visível no topo da tela
"""

from PyQt6.QtWidgets import QWidget, QLabel, QHBoxLayout
from PyQt6.QtCore import Qt, QTimer, QPoint
from PyQt6.QtGui import QFont, QColor

import hardware_monitor

# Windows API para forçar janela no topo
import ctypes
try:
    user32 = ctypes.windll.user32
    HWND_TOPMOST = -1
    SWP_NOMOVE = 0x0002
    SWP_NOSIZE = 0x0001
    SWP_NOACTIVATE = 0x0010
    SWP_SHOWWINDOW = 0x0040
    WIN32_AVAILABLE = True
except:
    WIN32_AVAILABLE = False


class PerformanceOverlay(QWidget):
    """Widget overlay que mostra métricas do sistema"""

    def __init__(self, settings=None):
        super().__init__()
        self.settings = settings or {}
        self.dragging = False
        self.drag_enabled = False
        self.drag_offset = QPoint()
        self.blink_state = False

        # Limites de temperatura
        self.cpu_temp_limit = self.settings.get('cpu_temp_limit', 85)
        self.gpu_temp_limit = self.settings.get('gpu_temp_limit', 83)

        # Cores personalizáveis
        self.color_normal = self.settings.get('color_normal', '#00FF00')
        self.color_warning = self.settings.get('color_warning', '#FFAA00')
        self.color_critical = self.settings.get('color_critical', '#FF4444')
        self.color_temp = self.settings.get('color_temp', '#00AAFF')
        self.color_background = self.settings.get('color_background', '#1E1E1E')

        # Estados de alerta
        self.cpu_temp_alert = False
        self.gpu_temp_alert = False

        self.init_ui()
        self.init_timer()

        # Inicializa NVIDIA
        hardware_monitor.init_nvidia()

    def init_ui(self):
        """Configura a interface do overlay"""
        # Janela sem bordas, sempre no topo, transparente
        # BypassWindowManagerHint ajuda a ficar acima de alguns jogos
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool |
            Qt.WindowType.BypassWindowManagerHint
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating)

        # Layout horizontal
        layout = QHBoxLayout()
        layout.setContentsMargins(10, 5, 10, 5)
        layout.setSpacing(15)

        # Fonte
        font_size = self.settings.get('font_size', 11)
        self.font = QFont('Segoe UI', font_size, QFont.Weight.Bold)

        # Labels para cada métrica
        self.cpu_label = self._create_label("CPU: --%")
        self.gpu_label = self._create_label("GPU: --%")
        self.ram_label = self._create_label("RAM: --%")
        self.cpu_temp_label = self._create_label("CPU: --°C")
        self.gpu_temp_label = self._create_label("GPU: --°C")

        layout.addWidget(self.cpu_label)
        layout.addWidget(self.gpu_label)
        layout.addWidget(self.ram_label)
        layout.addWidget(self._create_separator())
        layout.addWidget(self.cpu_temp_label)
        layout.addWidget(self.gpu_temp_label)

        self.setLayout(layout)

        # Aplica estilo do fundo
        self.update_background_style()

        # Posiciona no centro-topo da tela
        self.adjustSize()
        self.move_to_default_position()

    def update_background_style(self):
        """Atualiza o estilo do fundo com a cor configurada"""
        bg_color = QColor(self.color_background)
        self.setStyleSheet(f"""
            QWidget {{
                background-color: rgba({bg_color.red()}, {bg_color.green()}, {bg_color.blue()}, 200);
                border-radius: 8px;
            }}
        """)

    def _create_label(self, text):
        """Cria um label estilizado"""
        label = QLabel(text)
        label.setFont(self.font)
        label.setStyleSheet(f"color: {self.color_normal}; background: transparent;")
        return label

    def _create_separator(self):
        """Cria um separador visual"""
        sep = QLabel("|")
        sep.setFont(self.font)
        sep.setStyleSheet("color: #666666; background: transparent;")
        return sep

    def move_to_default_position(self):
        """Move o overlay para a posição padrão (centro-topo)"""
        from PyQt6.QtWidgets import QApplication
        screen = QApplication.primaryScreen().geometry()
        x = (screen.width() - self.width()) // 2
        y = 10
        self.move(x, y)

    def init_timer(self):
        """Inicializa o timer de atualização (1x por segundo)"""
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_metrics)
        self.update_timer.start(1000)

        # Timer para o efeito de piscar
        self.blink_timer = QTimer()
        self.blink_timer.timeout.connect(self.toggle_blink)
        self.blink_timer.start(500)

        # Timer para manter no topo (ajuda com jogos borderless)
        self.raise_timer = QTimer()
        self.raise_timer.timeout.connect(self.stay_on_top)
        self.raise_timer.start(2000)  # A cada 2 segundos

    def stay_on_top(self):
        """Mantém a janela no topo usando Windows API"""
        if self.isVisible():
            # Usa Windows API para forçar no topo (funciona melhor com jogos)
            if WIN32_AVAILABLE:
                try:
                    hwnd = int(self.winId())
                    user32.SetWindowPos(
                        hwnd,
                        HWND_TOPMOST,
                        0, 0, 0, 0,
                        SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW
                    )
                except Exception:
                    pass
            self.raise_()

    def update_metrics(self):
        """Atualiza todas as métricas"""
        metrics = hardware_monitor.get_all_metrics()

        # CPU Usage
        cpu = metrics['cpu_usage']
        self.cpu_label.setText(f"CPU: {cpu:.0f}%")
        self._colorize_usage(self.cpu_label, cpu)

        # GPU Usage
        gpu = metrics['gpu_usage']
        if gpu is not None:
            self.gpu_label.setText(f"GPU: {gpu:.0f}%")
            self._colorize_usage(self.gpu_label, gpu)
        else:
            self.gpu_label.setText("GPU: N/A")

        # RAM Usage
        ram = metrics['ram_usage']
        self.ram_label.setText(f"RAM: {ram:.0f}%")
        self._colorize_usage(self.ram_label, ram)

        # CPU Temperature
        cpu_temp = metrics['cpu_temp']
        if cpu_temp is not None:
            self.cpu_temp_label.setText(f"CPU: {cpu_temp:.0f}°C")
            self.cpu_temp_alert = cpu_temp > self.cpu_temp_limit
        else:
            self.cpu_temp_label.setText("CPU: --°C")
            self.cpu_temp_alert = False

        # GPU Temperature
        gpu_temp = metrics['gpu_temp']
        if gpu_temp is not None:
            self.gpu_temp_label.setText(f"GPU: {gpu_temp:.0f}°C")
            self.gpu_temp_alert = gpu_temp > self.gpu_temp_limit
        else:
            self.gpu_temp_label.setText("GPU: --°C")
            self.gpu_temp_alert = False

    def _colorize_usage(self, label, value):
        """Define a cor baseada no uso"""
        if value >= 90:
            color = self.color_critical
        elif value >= 70:
            color = self.color_warning
        elif value >= 50:
            color = "#FFFF00"  # Amarelo intermediário
        else:
            color = self.color_normal
        label.setStyleSheet(f"color: {color}; background: transparent;")

    def toggle_blink(self):
        """Alterna o estado de piscar para alertas de temperatura"""
        self.blink_state = not self.blink_state

        # CPU Temp Alert
        if self.cpu_temp_alert:
            if self.blink_state:
                self.cpu_temp_label.setStyleSheet(f"color: {self.color_critical}; background: transparent;")
            else:
                self.cpu_temp_label.setStyleSheet("color: #FF6666; background: transparent;")
        else:
            self.cpu_temp_label.setStyleSheet(f"color: {self.color_temp}; background: transparent;")

        # GPU Temp Alert
        if self.gpu_temp_alert:
            if self.blink_state:
                self.gpu_temp_label.setStyleSheet(f"color: {self.color_critical}; background: transparent;")
            else:
                self.gpu_temp_label.setStyleSheet("color: #FF6666; background: transparent;")
        else:
            self.gpu_temp_label.setStyleSheet(f"color: {self.color_temp}; background: transparent;")

    def set_drag_enabled(self, enabled):
        """Habilita ou desabilita o arrasto"""
        self.drag_enabled = enabled
        if enabled:
            self.setCursor(Qt.CursorShape.OpenHandCursor)
        else:
            self.setCursor(Qt.CursorShape.ArrowCursor)

    def mousePressEvent(self, event):
        """Inicia o arrasto se habilitado"""
        if self.drag_enabled and event.button() == Qt.MouseButton.LeftButton:
            self.dragging = True
            self.drag_offset = event.pos()
            self.setCursor(Qt.CursorShape.ClosedHandCursor)

    def mouseMoveEvent(self, event):
        """Move a janela durante o arrasto"""
        if self.dragging:
            new_pos = event.globalPosition().toPoint() - self.drag_offset
            self.move(new_pos)

    def mouseReleaseEvent(self, event):
        """Finaliza o arrasto"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.dragging = False
            if self.drag_enabled:
                self.setCursor(Qt.CursorShape.OpenHandCursor)

    def update_font_size(self, size):
        """Atualiza o tamanho da fonte"""
        self.font.setPointSize(size)
        for label in [self.cpu_label, self.gpu_label, self.ram_label,
                      self.cpu_temp_label, self.gpu_temp_label]:
            label.setFont(self.font)
        self.adjustSize()

    def update_temp_limits(self, cpu_limit, gpu_limit):
        """Atualiza os limites de temperatura"""
        self.cpu_temp_limit = cpu_limit
        self.gpu_temp_limit = gpu_limit

    def update_colors(self, colors):
        """Atualiza as cores do overlay em tempo real"""
        self.color_normal = colors.get('color_normal', self.color_normal)
        self.color_warning = colors.get('color_warning', self.color_warning)
        self.color_critical = colors.get('color_critical', self.color_critical)
        self.color_temp = colors.get('color_temp', self.color_temp)
        self.color_background = colors.get('color_background', self.color_background)

        # Atualiza o fundo
        self.update_background_style()

        # Força atualização das métricas para aplicar novas cores
        self.update_metrics()

    def showEvent(self, event):
        """Chamado quando a janela é mostrada"""
        super().showEvent(event)
        # Força ficar no topo imediatamente
        self.stay_on_top()

    def closeEvent(self, event):
        """Limpa recursos ao fechar"""
        hardware_monitor.shutdown_nvidia()
        self.update_timer.stop()
        self.blink_timer.stop()
        self.raise_timer.stop()
        super().closeEvent(event)


if __name__ == '__main__':
    from PyQt6.QtWidgets import QApplication
    import sys

    app = QApplication(sys.argv)
    overlay = PerformanceOverlay()
    overlay.show()
    sys.exit(app.exec())
