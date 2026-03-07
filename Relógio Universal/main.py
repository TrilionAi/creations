"""
Float Timer - Circular Timer/Stopwatch
Transparent circular widget that stays always visible

Controls:
- Single click: Play/Pause
- Double click: Reset
- Right click: Menu with time options
- Drag: Move the widget
"""

import sys
import os
import platform

# Adiciona o diretório atual ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu, QMessageBox
from PyQt6.QtGui import QIcon, QAction
from PyQt6.QtCore import QTimer
from PyQt6.QtMultimedia import QSoundEffect
from PyQt6.QtCore import QUrl

from circular_widget import CircularTimerWidget
from timer_logic import TimerController
from settings import settings


class TimerApp:
    """Float Timer main application"""

    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setQuitOnLastWindowClosed(False)
        self.app.setApplicationName("Float Timer")

        # Cria o widget circular
        self.widget = CircularTimerWidget(150)

        # Cria o controlador do timer
        self.controller = TimerController()

        # Conecta sinais
        self.setup_connections()

        # Configura tray icon
        self.setup_tray()

        # Som de alerta (quando timer termina)
        self.setup_sound()

        # Mostra o widget
        self.widget.show()

    def setup_connections(self):
        """Conecta sinais entre widget e controller"""
        # Widget -> Controller
        self.widget.play_pause_clicked.connect(self.controller.toggle)
        self.widget.reset_clicked.connect(self.controller.reset)
        self.widget.time_selected.connect(self.on_time_selected)

        # Controller -> Widget
        self.controller.time_updated.connect(self.on_time_updated)
        self.controller.state_changed.connect(self.widget.set_running)
        self.controller.timer_finished.connect(self.on_timer_finished)

    def setup_tray(self):
        """Configura o ícone na bandeja do sistema"""
        self.tray = QSystemTrayIcon()

        # Tenta carregar ícone personalizado
        icon_path = os.path.join(os.path.dirname(__file__), 'icon.ico')
        if os.path.exists(icon_path):
            self.tray.setIcon(QIcon(icon_path))
        else:
            self.tray.setIcon(self.app.style().standardIcon(
                self.app.style().StandardPixmap.SP_MediaPlay
            ))

        # Menu do tray
        menu = QMenu()

        show_action = QAction(settings.tr('show'), menu)
        show_action.triggered.connect(self.show_widget)
        menu.addAction(show_action)

        hide_action = QAction(settings.tr('hide'), menu)
        hide_action.triggered.connect(self.hide_widget)
        menu.addAction(hide_action)

        menu.addSeparator()

        # Submenu de tempos rápidos
        time_menu = menu.addMenu(settings.tr('set_time'))
        time_menu.addAction(settings.tr('stopwatch'), lambda: self.on_time_selected(0))
        time_menu.addSeparator()
        time_menu.addAction(f"1 {settings.tr('minute')}", lambda: self.on_time_selected(60))
        time_menu.addAction(f"5 {settings.tr('minutes')}", lambda: self.on_time_selected(300))
        time_menu.addAction(f"10 {settings.tr('minutes')}", lambda: self.on_time_selected(600))
        time_menu.addAction(f"15 {settings.tr('minutes')}", lambda: self.on_time_selected(900))
        time_menu.addAction(settings.tr('pomodoro_25'), lambda: self.on_time_selected(1500))
        time_menu.addAction(settings.tr('pomodoro_45'), lambda: self.on_time_selected(2700))
        time_menu.addAction(f"1 {settings.tr('hour')}", lambda: self.on_time_selected(3600))

        menu.addSeparator()

        reset_action = QAction(settings.tr('reset'), menu)
        reset_action.triggered.connect(self.controller.reset)
        menu.addAction(reset_action)

        menu.addSeparator()

        quit_action = QAction(settings.tr('quit'), menu)
        quit_action.triggered.connect(self.quit_app)
        menu.addAction(quit_action)

        self.tray.setContextMenu(menu)
        self.tray.setToolTip("Float Timer")
        self.tray.show()

        # Double-click no tray mostra/esconde
        self.tray.activated.connect(self.tray_activated)

    def setup_sound(self):
        """Configura som de alerta"""
        self.alert_sound = None
        # Tenta usar som do sistema
        if platform.system() == 'Windows':
            sound_path = "C:/Windows/Media/Alarm01.wav"
            if os.path.exists(sound_path):
                self.alert_sound = QSoundEffect()
                self.alert_sound.setSource(QUrl.fromLocalFile(sound_path))
                self.alert_sound.setVolume(0.5)

    def tray_activated(self, reason):
        """Callback quando tray é ativado"""
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            if self.widget.isVisible():
                self.hide_widget()
            else:
                self.show_widget()

    def show_widget(self):
        """Mostra o widget"""
        self.widget.show()
        self.widget.raise_()

    def hide_widget(self):
        """Esconde o widget"""
        self.widget.hide()

    def on_time_selected(self, seconds):
        """Quando um tempo é selecionado no menu"""
        self.controller.set_timer(seconds)
        is_timer = seconds > 0
        self.widget.set_time(seconds, is_timer)

        # Notificação (traduzida)
        if seconds > 0:
            time_str = self.format_time(seconds)
            self.tray.showMessage(
                "Float Timer",
                settings.tr('timer_set').format(time=time_str),
                QSystemTrayIcon.MessageIcon.Information,
                1500
            )
        else:
            self.tray.showMessage(
                "Float Timer",
                settings.tr('stopwatch_mode'),
                QSystemTrayIcon.MessageIcon.Information,
                1500
            )

    def format_time(self, seconds):
        """Formata segundos para exibição (MM:SS ou HH:MM:SS)"""
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes:02d}:{secs:02d}"

    def on_time_updated(self, seconds):
        """Quando o tempo é atualizado"""
        self.widget.update_time(seconds)

    def on_timer_finished(self):
        """Quando o timer chega a zero"""
        # Toca som
        if self.alert_sound:
            self.alert_sound.play()

        # Notificação (traduzida)
        self.tray.showMessage(
            "Float Timer",
            settings.tr('time_up'),
            QSystemTrayIcon.MessageIcon.Warning,
            5000
        )

        # Pisca a janela (visual feedback)
        self.flash_widget()

    def flash_widget(self):
        """Faz o widget piscar"""
        self.flash_count = 0

        def toggle_visibility():
            self.flash_count += 1
            if self.flash_count >= 10:
                self.flash_timer.stop()
                self.widget.show()
                return

            if self.widget.isVisible():
                self.widget.hide()
            else:
                self.widget.show()

        self.flash_timer = QTimer()
        self.flash_timer.timeout.connect(toggle_visibility)
        self.flash_timer.start(200)

    def quit_app(self):
        """Encerra a aplicação"""
        self.controller.stop()
        self.widget.close()
        self.tray.hide()
        self.app.quit()

    def run(self):
        """Inicia a aplicação"""
        return self.app.exec()


def main():
    """Main entry point"""
    # Configure AppUserModelID for Windows (removes "Python" from notifications)
    if platform.system() == 'Windows':
        import ctypes
        app_id = 'FloatTimer.Timer.1.0'
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(app_id)

    # Prevent multiple instances
    import socket
    try:
        lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        lock_socket.bind(('127.0.0.1', 47833))
    except socket.error:
        print("Float Timer is already running.")
        sys.exit(1)

    app = TimerApp()
    sys.exit(app.run())


if __name__ == '__main__':
    main()
