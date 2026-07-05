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

from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu, QInputDialog
from PyQt6.QtGui import QIcon, QAction
from PyQt6.QtCore import QTimer
from PyQt6.QtMultimedia import QSoundEffect
from PyQt6.QtCore import QUrl

from circular_widget import CircularTimerWidget
from timer_logic import TimerController
from settings import settings, resolve_sound_path


APP_NAME = "Float Timer"


# --- Autostart (start with the system) ---

def _launch_command():
    """Command used to launch the app at login"""
    if getattr(sys, 'frozen', False):
        return f'"{sys.executable}"'
    script = os.path.abspath(__file__)
    return f'"{sys.executable}" "{script}"'


def _macos_plist_path():
    return os.path.expanduser('~/Library/LaunchAgents/com.trilionai.floattimer.plist')


def _linux_desktop_path():
    base = os.environ.get('XDG_CONFIG_HOME') or os.path.expanduser('~/.config')
    return os.path.join(base, 'autostart', 'float-timer.desktop')


def is_autostart_enabled():
    """Checks whether the app is registered to start with the system"""
    system = platform.system()
    try:
        if system == 'Windows':
            import winreg
            with winreg.OpenKey(
                winreg.HKEY_CURRENT_USER,
                r"Software\Microsoft\Windows\CurrentVersion\Run"
            ) as key:
                winreg.QueryValueEx(key, APP_NAME)
            return True
        if system == 'Darwin':
            return os.path.exists(_macos_plist_path())
        return os.path.exists(_linux_desktop_path())
    except OSError:
        return False


def set_autostart(enabled):
    """Registers/unregisters the app to start with the system"""
    system = platform.system()
    try:
        if system == 'Windows':
            import winreg
            with winreg.OpenKey(
                winreg.HKEY_CURRENT_USER,
                r"Software\Microsoft\Windows\CurrentVersion\Run",
                0, winreg.KEY_SET_VALUE
            ) as key:
                if enabled:
                    winreg.SetValueEx(key, APP_NAME, 0, winreg.REG_SZ, _launch_command())
                else:
                    try:
                        winreg.DeleteValue(key, APP_NAME)
                    except FileNotFoundError:
                        pass
        elif system == 'Darwin':
            plist = _macos_plist_path()
            if enabled:
                args = f"<string>{sys.executable}</string>"
                if not getattr(sys, 'frozen', False):
                    args += f"\n        <string>{os.path.abspath(__file__)}</string>"
                os.makedirs(os.path.dirname(plist), exist_ok=True)
                with open(plist, 'w', encoding='utf-8') as f:
                    f.write(f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.trilionai.floattimer</string>
    <key>ProgramArguments</key>
    <array>
        {args}
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
""")
            elif os.path.exists(plist):
                os.remove(plist)
        else:
            desktop = _linux_desktop_path()
            if enabled:
                os.makedirs(os.path.dirname(desktop), exist_ok=True)
                with open(desktop, 'w', encoding='utf-8') as f:
                    f.write(
                        "[Desktop Entry]\nType=Application\nName=Float Timer\n"
                        f"Exec={_launch_command()}\nX-GNOME-Autostart-enabled=true\n"
                    )
            elif os.path.exists(desktop):
                os.remove(desktop)
        return True
    except OSError:
        return False


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

        # Load saved timers — startup layout takes precedence over last state
        startup = settings.get('startup_template')
        templates = settings.templates
        if startup and startup in templates:
            saved_timers = templates[startup]
        else:
            saved_timers = settings.timers
        for config in saved_timers:
            self.create_timer_from_config(config)

        if not self.timers:
            self.create_timer()

        self.update_removable_state()

        # Save immediately to persist migrated format and initial state
        self.save_timer_configs()

    def create_timer_from_config(self, config):
        """Creates a timer from a saved config dict"""
        return self.create_timer(
            title=config.get('title', 'Timer'),
            pos_x=config.get('pos_x'),
            pos_y=config.get('pos_y'),
            arc_color=config.get('color', '#00c864'),
            duration=config.get('duration', 0),
            cycle=config.get('cycle'),
        )

    def create_timer(self, title="Timer", pos_x=None, pos_y=None, arc_color="#00c864",
                     duration=0, cycle=None):
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

        # Pomodoro cycle / sound / layout signals
        widget.cycle_selected.connect(
            lambda work, brk, w=widget: self.on_cycle_selected(w, work, brk)
        )
        widget.alert_sound_changed.connect(lambda _: self.reload_sound())
        widget.alert_volume_changed.connect(self.set_alert_volume)
        widget.test_sound_requested.connect(self.play_test_sound)
        widget.save_layout_requested.connect(self.save_layout_dialog)
        widget.load_layout_requested.connect(self.apply_template)

        entry = {'widget': widget, 'controller': controller, 'cycle': None, 'phase': 'work'}
        self.timers.append(entry)

        # Restore saved cycle or duration (loaded paused, ready to start)
        if cycle:
            entry['cycle'] = list(cycle)
            widget.set_cycle_active(True)
            controller.set_timer(cycle[0])
            widget.set_time(cycle[0], True)
        elif duration and duration > 0:
            controller.set_timer(duration)
            widget.set_time(duration, True)

        widget.show()
        return entry

    def find_entry(self, widget):
        """Finds the timer entry for a widget"""
        for entry in self.timers:
            if entry['widget'] is widget:
                return entry
        return None

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

    def current_configs(self):
        """Snapshot of all timers: position, title, color, duration and cycle"""
        configs = []
        for entry in self.timers:
            w = entry['widget']
            c = entry['controller']
            pos = w.pos()
            configs.append({
                'title': w.title,
                'pos_x': pos.x(),
                'pos_y': pos.y(),
                'color': w.arc_color.name(),
                'duration': c.initial_seconds if c.is_timer_mode else 0,
                'cycle': entry.get('cycle'),
            })
        return configs

    def save_timer_configs(self):
        """Save all timer configs to settings"""
        settings.timers = self.current_configs()
        settings.save()

    # --- Layouts (templates) ---

    def save_layout_dialog(self):
        """Asks for a name and saves the current arrangement as a layout"""
        name, ok = QInputDialog.getText(
            None, settings.tr('layouts'), settings.tr('layout_name_prompt')
        )
        if not ok or not name.strip():
            return
        name = name.strip()
        templates = settings.templates
        templates[name] = self.current_configs()
        settings.templates = templates
        settings.save()
        self.rebuild_tray_menu()
        if self.timers:
            self.timers[0]['widget'].show_notification(
                settings.tr('layouts'),
                settings.tr('layout_saved').format(name=name),
                2500
            )

    def apply_template(self, name):
        """Replaces all current timers with the ones from a saved layout"""
        configs = settings.templates.get(name)
        if not configs:
            return

        self.silence_alert()
        for entry in list(self.timers):
            entry['controller'].stop()
            entry['widget'].notification.hide()
            entry['widget'].close()
        self.timers.clear()

        for config in configs:
            self.create_timer_from_config(config)
        if not self.timers:
            self.create_timer()

        self.update_removable_state()
        self.save_timer_configs()
        self.rebuild_tray_menu()
        self.timers[0]['widget'].show_notification(
            settings.tr('layouts'),
            settings.tr('layout_loaded').format(name=name),
            2500
        )

    def delete_template(self, name):
        """Deletes a saved layout"""
        templates = settings.templates
        templates.pop(name, None)
        settings.templates = templates
        if settings.get('startup_template') == name:
            settings.set('startup_template', None)
        settings.save()
        self.rebuild_tray_menu()

    def set_startup_template(self, name):
        """Sets the layout loaded on startup (None = last state)"""
        settings.set('startup_template', name)
        settings.save()
        self.rebuild_tray_menu()

    # --- Sound ---

    def setup_sound(self):
        """Sets up alert sound with loop support (sound and volume from settings)"""
        self.alert_sound = None
        sound_path = resolve_sound_path(settings.get('alert_sound', ''))
        if sound_path and os.path.exists(sound_path):
            self.alert_sound = QSoundEffect()
            self.alert_sound.setSource(QUrl.fromLocalFile(sound_path))
            self.alert_sound.setVolume(settings.get('alert_volume', 50) / 100.0)

    def reload_sound(self):
        """Reloads the alert sound after the user picks a different one"""
        if self.alert_sound:
            self.alert_sound.stop()
        self.setup_sound()

    def set_alert_volume(self, value):
        """Applies a new alarm volume (0-100)"""
        if self.alert_sound:
            self.alert_sound.setVolume(value / 100.0)

    def play_test_sound(self):
        """Plays the alarm sound once so the user can preview it"""
        if self.alert_sound:
            self.alert_sound.stop()
            self.alert_sound.setLoopCount(1)
            self.alert_sound.play()

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

        # Layouts submenu
        layouts_menu = menu.addMenu(settings.tr('layouts'))
        save_action = QAction(settings.tr('save_layout'), layouts_menu)
        save_action.triggered.connect(self.save_layout_dialog)
        layouts_menu.addAction(save_action)

        template_names = list(settings.templates.keys())
        if template_names:
            load_menu = layouts_menu.addMenu(settings.tr('load_layout'))
            for name in template_names:
                action = QAction(name, load_menu)
                action.triggered.connect(lambda _, n=name: self.apply_template(n))
                load_menu.addAction(action)

            startup_menu = layouts_menu.addMenu(settings.tr('startup_layout'))
            current_startup = settings.get('startup_template')
            none_label = settings.tr('none')
            if current_startup is None:
                none_label = f"✓ {none_label}"
            none_action = QAction(none_label, startup_menu)
            none_action.triggered.connect(lambda: self.set_startup_template(None))
            startup_menu.addAction(none_action)
            for name in template_names:
                label = f"✓ {name}" if name == current_startup else name
                action = QAction(label, startup_menu)
                action.triggered.connect(lambda _, n=name: self.set_startup_template(n))
                startup_menu.addAction(action)

            delete_menu = layouts_menu.addMenu(settings.tr('delete_layout'))
            for name in template_names:
                action = QAction(name, delete_menu)
                action.triggered.connect(lambda _, n=name: self.delete_template(n))
                delete_menu.addAction(action)

        menu.addSeparator()

        # Start with system toggle
        autostart_action = QAction(settings.tr('autostart'), menu)
        autostart_action.setCheckable(True)
        autostart_action.setChecked(is_autostart_enabled())
        autostart_action.triggered.connect(lambda checked: set_autostart(checked))
        menu.addAction(autostart_action)

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
        # Picking a plain time turns off any active Pomodoro cycle
        entry = self.find_entry(widget)
        if entry:
            entry['cycle'] = None
            entry['phase'] = 'work'
        widget.set_cycle_active(False)

        controller.set_timer(seconds)
        is_timer = seconds > 0
        widget.set_time(seconds, is_timer)
        self.save_timer_configs()

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

    def on_cycle_selected(self, widget, work_seconds, break_seconds):
        """When a Pomodoro cycle is chosen (or disabled) from a timer's menu"""
        entry = self.find_entry(widget)
        if not entry:
            return
        controller = entry['controller']

        if work_seconds <= 0:
            entry['cycle'] = None
            entry['phase'] = 'work'
            widget.set_cycle_active(False)
            widget.show_notification(
                widget.title, settings.tr('cycle_disabled'), 2000
            )
        else:
            entry['cycle'] = [work_seconds, break_seconds]
            entry['phase'] = 'work'
            widget.set_cycle_active(True)
            controller.set_timer(work_seconds)
            widget.set_time(work_seconds, True)
            widget.show_notification(
                widget.title,
                settings.tr('cycle_set').format(
                    work=work_seconds // 60, brk=break_seconds // 60
                ),
                2500
            )
        self.save_timer_configs()

    def on_timer_finished(self, widget):
        """When a timer reaches zero"""
        entry = self.find_entry(widget)

        # Pomodoro cycle: auto-switch to the next phase and keep going
        if entry and entry.get('cycle'):
            work_seconds, break_seconds = entry['cycle']
            next_phase = 'break' if entry.get('phase', 'work') == 'work' else 'work'
            entry['phase'] = next_phase
            next_seconds = break_seconds if next_phase == 'break' else work_seconds
            phase_label = settings.tr('break') if next_phase == 'break' else settings.tr('focus')

            # Short chime (not the looping alarm) between phases
            if self.alert_sound:
                self.alert_sound.stop()
                self.alert_sound.setLoopCount(2)
                self.alert_sound.play()

            widget.show_notification(
                widget.title,
                settings.tr('phase_started').format(
                    phase=phase_label, min=next_seconds // 60
                ),
                4000
            )

            controller = entry['controller']
            controller.set_timer(next_seconds)
            widget.set_time(next_seconds, True)
            controller.start()
            return

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
