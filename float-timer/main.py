"""
Float Timer - Circular Timer/Stopwatch
Transparent circular widgets that stay always visible
Supports multiple independent timers with editable titles and custom arc colors

Controls:
- Single click: Play/Pause
- Single click on title: Edit title
- Double click: Reset (anywhere, including on title)
- Right click: Menu with time options
- Drag: Move the widget
"""

import sys
import os
import platform

# Add the current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu
from PyQt6.QtGui import QIcon, QAction
from PyQt6.QtCore import QTimer
from PyQt6.QtMultimedia import QSoundEffect
from PyQt6.QtCore import QUrl

from circular_widget import CircularTimerWidget
from timer_logic import TimerController
from settings import settings


class TimerApp:
    """Float Timer main application - manages multiple timer instances"""

    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setQuitOnLastWindowClosed(False)
        self.app.setApplicationName("Float Timer")

        self.timers = []  # list of {'widget': w, 'controller': c}

        # Alert sound
        self.setup_sound()

        # Tray icon
        self.setup_tray()

        # Load saved timers
        saved_timers = settings.timers
        for config in saved_timers:
            self.create_timer(
                title=config.get('title', 'Timer'),
                pos_x=config.get('pos_x'),
                pos_y=config.get('pos_y'),
                arc_color=config.get('color', '#00c864'),
            )

        self.update_removable_state()

        # Save immediately to persist migrated format and initial state
        self.save_timer_configs()

    def create_timer(self, title="Timer", pos_x=None, pos_y=None, arc_color="#00c864"):
        """Creates a new timer instance (widget + controller)"""
        widget = CircularTimerWidget(150, title=title, arc_color=arc_color)
        controller = TimerController()

        # Set position
        if pos_x is not None and pos_y is not None:
            widget.move(pos_x, pos_y)
        else:
            widget.move_to_center()

        # Connect widget -> controller
        widget.play_pause_clicked.connect(controller.toggle)
        widget.reset_clicked.connect(controller.reset)
        widget.time_selected.connect(
            lambda s, w=widget, c=controller: self.on_time_selected(s, w, c)
        )

        # Connect controller -> widget
        controller.time_updated.connect(widget.update_time)
        controller.state_changed.connect(widget.set_running)
        controller.timer_finished.connect(
            lambda w=widget: self.on_timer_finished(w)
        )

        # Connect management signals
        widget.title_changed.connect(lambda _: self.save_timer_configs())
        widget.color_changed.connect(lambda _: self.save_timer_configs())
        widget.position_changed.connect(lambda: self.save_timer_configs())
        widget.add_timer_requested.connect(lambda w=widget: self.add_timer_near(w))
        widget.remove_requested.connect(lambda w=widget: self.remove_timer(w))

        # Connect silence button to stop sound
        widget.notification.silenced.connect(self.silence_alert)

        entry = {'widget': widget, 'controller': controller}
        self.timers.append(entry)

        widget.show()
        return entry

    def add_timer_near(self, source_widget):
        """Add a new timer positioned near the source widget"""
        pos = source_widget.pos()
        new_x = pos.x() + 170  # 150px size + 20px gap
        new_y = pos.y()

        # Check screen bounds
        screen = self.app.primaryScreen().geometry()
        if new_x + 150 > screen.width():
            new_x = pos.x() - 170
        if new_x < 0:
            new_x = 50

        self.create_timer(title="Timer", pos_x=new_x, pos_y=new_y)
        self.update_removable_state()
        self.save_timer_configs()
        self.rebuild_tray_menu()

    def add_timer_default(self):
        """Add a new timer (from tray menu, near last timer)"""
        if self.timers:
            self.add_timer_near(self.timers[-1]['widget'])
        else:
            self.create_timer()
            self.update_removable_state()
            self.save_timer_configs()
            self.rebuild_tray_menu()

    def remove_timer(self, widget):
        """Remove a specific timer permanently"""
        if len(self.timers) <= 1:
            return

        for entry in self.timers:
            if entry['widget'] is widget:
                entry['controller'].stop()
                entry['widget'].notification.hide()
                entry['widget'].close()
                self.timers.remove(entry)
                break

        self.update_removable_state()
        self.save_timer_configs()
        self.rebuild_tray_menu()

    def update_removable_state(self):
        """Update whether each timer shows the remove option"""
        removable = len(self.timers) > 1
        for entry in self.timers:
            entry['widget'].set_removable(removable)

    def save_timer_configs(self):
        """Save all timer positions, titles and colors to settings"""
        configs = []
        for entry in self.timers:
            w = entry['widget']
            pos = w.pos()
            configs.append({
                'title': w.title,
                'pos_x': pos.x(),
                'pos_y': pos.y(),
                'color': w.arc_color.name(),
            })
        settings.timers = configs
        settings.save()

    # --- Sound ---

    def setup_sound(self):
        """Sets up alert sound with loop support"""
        self.alert_sound = None
        sound_path = None
        if platform.system() == 'Windows':
            sound_path = "C:/Windows/Media/Alarm01.wav"
        elif platform.system() == 'Darwin':
            for p in ["/System/Library/Sounds/Glass.aiff", "/System/Library/Sounds/Ping.aiff"]:
                if os.path.exists(p):
                    sound_path = p
                    break
        if sound_path and os.path.exists(sound_path):
            self.alert_sound = QSoundEffect()
            self.alert_sound.setSource(QUrl.fromLocalFile(sound_path))
            self.alert_sound.setVolume(0.5)

    def start_alert_sound(self):
        """Start looping the alert sound"""
        if self.alert_sound:
            self.alert_sound.setLoopCount(10000)  # loop until silenced
            self.alert_sound.play()

    def silence_alert(self):
        """Stop the alert sound"""
        if self.alert_sound:
            self.alert_sound.stop()
            self.alert_sound.setLoopCount(1)

    # --- Tray ---

    def setup_tray(self):
        """Sets up the system tray icon"""
        self.tray = QSystemTrayIcon()

        icon_path = os.path.join(os.path.dirname(__file__), 'icon.ico')
        if os.path.exists(icon_path):
            self.tray.setIcon(QIcon(icon_path))
        else:
            self.tray.setIcon(self.app.style().standardIcon(
                self.app.style().StandardPixmap.SP_MediaPlay
            ))

        self.rebuild_tray_menu()
        self.tray.setToolTip("Float Timer")
        self.tray.show()
        self.tray.activated.connect(self.tray_activated)

    def rebuild_tray_menu(self):
        """Rebuilds the tray menu"""
        menu = QMenu()

        show_action = QAction(settings.tr('show'), menu)
        show_action.triggered.connect(self.show_all)
        menu.addAction(show_action)

        hide_action = QAction(settings.tr('hide'), menu)
        hide_action.triggered.connect(self.hide_all)
        menu.addAction(hide_action)

        menu.addSeparator()

        add_action = QAction(settings.tr('add_timer'), menu)
        add_action.triggered.connect(self.add_timer_default)
        menu.addAction(add_action)

        menu.addSeparator()

        quit_action = QAction(settings.tr('quit'), menu)
        quit_action.triggered.connect(self.quit_app)
        menu.addAction(quit_action)

        self.tray.setContextMenu(menu)

    def tray_activated(self, reason):
        """Callback when tray is activated"""
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            any_visible = any(t['widget'].isVisible() for t in self.timers)
            if any_visible:
                self.hide_all()
            else:
                self.show_all()

    def show_all(self):
        """Shows all timers"""
        for entry in self.timers:
            entry['widget'].show()
            entry['widget'].raise_()

    def hide_all(self):
        """Hides all timers"""
        for entry in self.timers:
            entry['widget'].hide()

    # --- Timer events ---

    def on_time_selected(self, seconds, widget, controller):
        """When a time is selected from a timer's menu"""
        controller.set_timer(seconds)
        is_timer = seconds > 0
        widget.set_time(seconds, is_timer)

        title = widget.title
        if seconds > 0:
            time_str = self.format_time(seconds)
            widget.show_notification(
                title,
                settings.tr('timer_set').format(time=time_str),
                2000
            )
        else:
            widget.show_notification(
                title,
                settings.tr('stopwatch_mode'),
                2000
            )

    def format_time(self, seconds):
        """Formats seconds for display"""
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes:02d}:{secs:02d}"

    def on_timer_finished(self, widget):
        """When a timer reaches zero"""
        # Start looping sound
        self.start_alert_sound()

        # Show alert notification with silence button
        title = widget.title
        widget.show_notification(
            title,
            settings.tr('time_up'),
            alert=True
        )

        # Flash the widget
        self.flash_widget(widget)

    def flash_widget(self, widget):
        """Makes a specific widget flash"""
        flash_count = [0]

        def toggle_visibility():
            flash_count[0] += 1
            if flash_count[0] >= 10:
                flash_timer.stop()
                widget.show()
                return

            if widget.isVisible():
                widget.hide()
            else:
                widget.show()

        flash_timer = QTimer()
        flash_timer.timeout.connect(toggle_visibility)
        flash_timer.start(200)
        # Store reference to prevent garbage collection
        widget._flash_timer = flash_timer

    def quit_app(self):
        """Quits the application"""
        self.save_timer_configs()
        self.silence_alert()
        for entry in self.timers:
            entry['controller'].stop()
            entry['widget'].notification.hide()
            entry['widget'].close()
        self.tray.hide()
        self.app.quit()

    def run(self):
        """Starts the application"""
        return self.app.exec()


def main():
    """Main entry point"""
    # Configure AppUserModelID for Windows
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
