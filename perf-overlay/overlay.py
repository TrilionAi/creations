"""
Overlay Widget - Horizontal system metrics bar
Always visible at the top of the screen
"""

from PyQt6.QtWidgets import QWidget, QLabel, QHBoxLayout
from PyQt6.QtCore import Qt, QTimer, QPoint
from PyQt6.QtGui import QFont, QColor

import hardware_monitor

# Windows API to force window on top
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
    """Overlay widget that displays system metrics"""

    def __init__(self, settings=None):
        super().__init__()
        self.settings = settings or {}
        self.dragging = False
        self.drag_enabled = False
        self.drag_offset = QPoint()
        self.blink_state = False

        # Temperature limits
        self.cpu_temp_limit = self.settings.get('cpu_temp_limit', 85)
        self.gpu_temp_limit = self.settings.get('gpu_temp_limit', 83)

        # Customizable colors
        self.color_normal = self.settings.get('color_normal', '#00FF00')
        self.color_warning = self.settings.get('color_warning', '#FFAA00')
        self.color_critical = self.settings.get('color_critical', '#FF4444')
        self.color_temp = self.settings.get('color_temp', '#00AAFF')
        self.color_background = self.settings.get('color_background', '#1E1E1E')

        # Alert states
        self.cpu_temp_alert = False
        self.gpu_temp_alert = False

        self.init_ui()
        self.init_timer()

        # Initialize NVIDIA
        hardware_monitor.init_nvidia()

    def init_ui(self):
        """Sets up the overlay interface"""
        # Frameless window, always on top, transparent
        # BypassWindowManagerHint helps stay above some games
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool |
            Qt.WindowType.BypassWindowManagerHint
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating)

        # Horizontal layout
        layout = QHBoxLayout()
        layout.setContentsMargins(10, 5, 10, 5)
        layout.setSpacing(15)

        # Font
        font_size = self.settings.get('font_size', 11)
        self.font = QFont('Segoe UI', font_size, QFont.Weight.Bold)

        # Labels for each metric
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

        # Apply background style
        self.update_background_style()

        # Position at top-center of the screen
        self.adjustSize()
        self.move_to_default_position()

    def update_background_style(self):
        """Updates the background style with the configured color"""
        bg_color = QColor(self.color_background)
        self.setStyleSheet(f"""
            QWidget {{
                background-color: rgba({bg_color.red()}, {bg_color.green()}, {bg_color.blue()}, 200);
                border-radius: 8px;
            }}
        """)

    def _create_label(self, text):
        """Creates a styled label"""
        label = QLabel(text)
        label.setFont(self.font)
        label.setStyleSheet(f"color: {self.color_normal}; background: transparent;")
        return label

    def _create_separator(self):
        """Creates a visual separator"""
        sep = QLabel("|")
        sep.setFont(self.font)
        sep.setStyleSheet("color: #666666; background: transparent;")
        return sep

    def move_to_default_position(self):
        """Moves the overlay to the default position (top-center)"""
        from PyQt6.QtWidgets import QApplication
        screen = QApplication.primaryScreen().geometry()
        x = (screen.width() - self.width()) // 2
        y = 10
        self.move(x, y)

    def init_timer(self):
        """Initializes the update timer (once per second)"""
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_metrics)
        self.update_timer.start(1000)

        # Timer for blink effect
        self.blink_timer = QTimer()
        self.blink_timer.timeout.connect(self.toggle_blink)
        self.blink_timer.start(500)

        # Timer to stay on top (helps with borderless games)
        self.raise_timer = QTimer()
        self.raise_timer.timeout.connect(self.stay_on_top)
        self.raise_timer.start(2000)  # Every 2 seconds

    def stay_on_top(self):
        """Keeps the window on top using Windows API"""
        if self.isVisible():
            # Use Windows API to force on top (works better with games)
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
        """Updates all metrics"""
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
        """Sets the color based on usage"""
        if value >= 90:
            color = self.color_critical
        elif value >= 70:
            color = self.color_warning
        elif value >= 50:
            color = "#FFFF00"  # Intermediate yellow
        else:
            color = self.color_normal
        label.setStyleSheet(f"color: {color}; background: transparent;")

    def toggle_blink(self):
        """Toggles the blink state for temperature alerts"""
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
        """Enables or disables dragging"""
        self.drag_enabled = enabled
        if enabled:
            self.setCursor(Qt.CursorShape.OpenHandCursor)
        else:
            self.setCursor(Qt.CursorShape.ArrowCursor)

    def mousePressEvent(self, event):
        """Starts dragging if enabled"""
        if self.drag_enabled and event.button() == Qt.MouseButton.LeftButton:
            self.dragging = True
            self.drag_offset = event.pos()
            self.setCursor(Qt.CursorShape.ClosedHandCursor)

    def mouseMoveEvent(self, event):
        """Moves the window during dragging"""
        if self.dragging:
            new_pos = event.globalPosition().toPoint() - self.drag_offset
            self.move(new_pos)

    def mouseReleaseEvent(self, event):
        """Ends the dragging"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.dragging = False
            if self.drag_enabled:
                self.setCursor(Qt.CursorShape.OpenHandCursor)

    def update_font_size(self, size):
        """Updates the font size"""
        self.font.setPointSize(size)
        for label in [self.cpu_label, self.gpu_label, self.ram_label,
                      self.cpu_temp_label, self.gpu_temp_label]:
            label.setFont(self.font)
        self.adjustSize()

    def update_temp_limits(self, cpu_limit, gpu_limit):
        """Updates the temperature limits"""
        self.cpu_temp_limit = cpu_limit
        self.gpu_temp_limit = gpu_limit

    def update_colors(self, colors):
        """Updates overlay colors in real time"""
        self.color_normal = colors.get('color_normal', self.color_normal)
        self.color_warning = colors.get('color_warning', self.color_warning)
        self.color_critical = colors.get('color_critical', self.color_critical)
        self.color_temp = colors.get('color_temp', self.color_temp)
        self.color_background = colors.get('color_background', self.color_background)

        # Update the background
        self.update_background_style()

        # Force metrics update to apply new colors
        self.update_metrics()

    def showEvent(self, event):
        """Called when the window is shown"""
        super().showEvent(event)
        # Force stay on top immediately
        self.stay_on_top()

    def closeEvent(self, event):
        """Cleans up resources on close"""
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
