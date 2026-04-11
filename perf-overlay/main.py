"""
Performance Status - Lightweight System Monitor
Overlay that shows CPU, GPU, RAM and temperatures

Controls:
- Ctrl+Num1: Show/Hide overlay
- Ctrl+Num2: Enable/Disable drag mode
- Ctrl+Num3: Close application
- Ctrl+Num0: Open settings
- Right-click on overlay or tray icon: Menu
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu
from PyQt6.QtGui import QIcon, QAction, QPixmap, QPainter, QColor
from PyQt6.QtCore import QTimer, Qt, QObject, pyqtSignal

from overlay import PerformanceOverlay
from config_window import ConfigWindow, load_settings, save_settings

# Global hotkeys
from pynput import keyboard as pynput_kb


class HotkeySignals(QObject):
    """Signals for thread-safe hotkey communication"""
    toggle_signal = pyqtSignal()
    drag_signal = pyqtSignal()
    quit_signal = pyqtSignal()
    config_signal = pyqtSignal()



def create_colored_icon(color='#00FF00'):
    """Creates a simple colored icon for the system tray"""
    pixmap = QPixmap(32, 32)
    pixmap.fill(Qt.GlobalColor.transparent)
    painter = QPainter(pixmap)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing)
    painter.setBrush(QColor(color))
    painter.setPen(QColor('#000000'))
    painter.drawEllipse(2, 2, 28, 28)
    painter.end()
    return QIcon(pixmap)


class PerformanceApp:
    """Main Performance Status application"""

    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setQuitOnLastWindowClosed(False)
        self.app.setApplicationName("Performance Status")

        # Load settings
        self.settings = load_settings()

        # Create the overlay
        self.overlay = PerformanceOverlay(self.settings)

        # Add context menu to overlay
        self.setup_overlay_context_menu()

        # Restore position if saved
        if self.settings.get('position_x') is not None:
            self.overlay.move(
                self.settings['position_x'],
                self.settings['position_y']
            )

        # Config window (created on demand)
        self.config_window = None

        # Drag state
        self.drag_mode = False

        # Signals for hotkeys (thread-safe)
        self.hotkey_signals = HotkeySignals()
        self.hotkey_signals.toggle_signal.connect(self.toggle_visibility)
        self.hotkey_signals.drag_signal.connect(self.toggle_drag)
        self.hotkey_signals.quit_signal.connect(self.quit_app)
        self.hotkey_signals.config_signal.connect(self.open_config)

        # Set up tray icon
        self.setup_tray()

        # Set up global hotkeys
        self.setup_hotkeys()

        # Show the overlay initially
        self.overlay.show()

    def setup_overlay_context_menu(self):
        """Sets up context menu (right-click) on the overlay"""
        self.overlay.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
        self.overlay.customContextMenuRequested.connect(self.show_overlay_menu)

    def show_overlay_menu(self, pos):
        """Shows the overlay context menu"""
        menu = QMenu()
        menu.setStyleSheet("""
            QMenu {
                background-color: #2b2b2b;
                color: white;
                border: 1px solid #444;
            }
            QMenu::item {
                padding: 8px 20px;
            }
            QMenu::item:selected {
                background-color: #3d3d3d;
            }
        """)

        config_action = menu.addAction("Settings")
        config_action.triggered.connect(self.open_config)

        drag_action = menu.addAction("Drag Mode")
        drag_action.triggered.connect(self.toggle_drag)

        menu.addSeparator()

        hide_action = menu.addAction("Hide")
        hide_action.triggered.connect(self.hide_overlay)

        menu.addSeparator()

        quit_action = menu.addAction("Close Application")
        quit_action.triggered.connect(self.quit_app)

        menu.exec(self.overlay.mapToGlobal(pos))

    def setup_tray(self):
        """Sets up the system tray icon"""
        self.tray = QSystemTrayIcon(self.app)

        # Create visible green icon
        self.tray.setIcon(create_colored_icon('#00FF00'))

        # Tray menu
        menu = QMenu()

        toggle_action = QAction("Show/Hide (Ctrl+Num1)", menu)
        toggle_action.triggered.connect(self.toggle_visibility)
        menu.addAction(toggle_action)

        drag_action = QAction("Drag Mode (Ctrl+Num2)", menu)
        drag_action.triggered.connect(self.toggle_drag)
        menu.addAction(drag_action)

        menu.addSeparator()

        config_action = QAction("Settings (Ctrl+Num0)", menu)
        config_action.triggered.connect(self.open_config)
        menu.addAction(config_action)

        menu.addSeparator()

        quit_action = QAction("Close (Ctrl+Num3)", menu)
        quit_action.triggered.connect(self.quit_app)
        menu.addAction(quit_action)

        self.tray.setContextMenu(menu)
        self.tray.setToolTip("Performance Status\nRight-click for menu")
        self.tray.show()

        # Check if tray is available
        if not QSystemTrayIcon.isSystemTrayAvailable():
            print("Warning: System tray not available")

        # Double-click on tray shows/hides
        self.tray.activated.connect(self.tray_activated)

    def tray_activated(self, reason):
        """Callback when tray is activated"""
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            if self.overlay.isVisible():
                self.hide_overlay()
            else:
                self.show_overlay()
        elif reason == QSystemTrayIcon.ActivationReason.Trigger:
            # Single click also shows menu
            pass

    def setup_hotkeys(self):
        """Sets up global hotkeys based on settings"""
        self.ctrl_pressed = False
        self.alt_pressed = False
        self.shift_pressed = False

        # Name to VK code mapping
        self.vk_map = {
            'num0': 96, 'num1': 97, 'num2': 98, 'num3': 99, 'num4': 100,
            'num5': 101, 'num6': 102, 'num7': 103, 'num8': 104, 'num9': 105,
            'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117,
            'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123,
        }
        # Add letters A-Z
        for i in range(26):
            self.vk_map[chr(97 + i)] = 65 + i
        # Add numbers 0-9
        for i in range(10):
            self.vk_map[str(i)] = 48 + i

        # Load hotkeys from settings
        self.hotkeys = {
            'toggle': self.parse_hotkey(self.settings.get('hotkey_toggle', 'ctrl+num1')),
            'drag': self.parse_hotkey(self.settings.get('hotkey_drag', 'ctrl+num2')),
            'quit': self.parse_hotkey(self.settings.get('hotkey_quit', 'ctrl+num3')),
            'config': self.parse_hotkey(self.settings.get('hotkey_config', 'ctrl+num0')),
        }

        def on_press(key):
            # Detect modifiers
            if key == pynput_kb.Key.ctrl_l or key == pynput_kb.Key.ctrl_r:
                self.ctrl_pressed = True
                return
            if key == pynput_kb.Key.alt_l or key == pynput_kb.Key.alt_r:
                self.alt_pressed = True
                return
            if key == pynput_kb.Key.shift_l or key == pynput_kb.Key.shift_r:
                self.shift_pressed = True
                return

            # Check pressed key
            try:
                vk = key.vk if hasattr(key, 'vk') else None
                if vk:
                    self.check_hotkey(vk)
            except:
                pass

        def on_release(key):
            if key == pynput_kb.Key.ctrl_l or key == pynput_kb.Key.ctrl_r:
                self.ctrl_pressed = False
            if key == pynput_kb.Key.alt_l or key == pynput_kb.Key.alt_r:
                self.alt_pressed = False
            if key == pynput_kb.Key.shift_l or key == pynput_kb.Key.shift_r:
                self.shift_pressed = False

        self.hotkey_listener = pynput_kb.Listener(on_press=on_press, on_release=on_release)
        self.hotkey_listener.start()

    def parse_hotkey(self, hotkey_str):
        """Converts hotkey string to dictionary"""
        if not hotkey_str:
            return None
        parts = hotkey_str.lower().split('+')
        return {
            'ctrl': 'ctrl' in parts,
            'alt': 'alt' in parts,
            'shift': 'shift' in parts,
            'vk': self.vk_map.get(parts[-1], 0) if parts else 0
        }

    def check_hotkey(self, vk):
        """Checks if a hotkey was triggered"""
        for name, hk in self.hotkeys.items():
            if hk and hk['vk'] == vk:
                if hk['ctrl'] == self.ctrl_pressed and \
                   hk['alt'] == self.alt_pressed and \
                   hk['shift'] == self.shift_pressed:
                    if name == 'toggle':
                        self.hotkey_signals.toggle_signal.emit()
                    elif name == 'drag':
                        self.hotkey_signals.drag_signal.emit()
                    elif name == 'quit':
                        self.hotkey_signals.quit_signal.emit()
                    elif name == 'config':
                        self.hotkey_signals.config_signal.emit()

    def toggle_visibility(self):
        """Toggles overlay visibility"""
        if self.overlay.isVisible():
            self.hide_overlay()
        else:
            self.show_overlay()

    def show_overlay(self):
        """Shows the overlay"""
        self.overlay.show()
        self.overlay.raise_()
        self.tray.setIcon(create_colored_icon('#00FF00'))  # Green = visible

    def hide_overlay(self):
        """Hides the overlay"""
        self.settings['position_x'] = self.overlay.x()
        self.settings['position_y'] = self.overlay.y()
        save_settings(self.settings)
        self.overlay.hide()
        self.tray.setIcon(create_colored_icon('#888888'))  # Gray = hidden

    def toggle_drag(self):
        """Toggles drag mode"""
        self.drag_mode = not self.drag_mode
        self.overlay.set_drag_enabled(self.drag_mode)

        if self.drag_mode:
            self.tray.showMessage(
                "Performance Status",
                "Drag mode ENABLED.\nDrag the overlay. PgDn to disable.",
                QSystemTrayIcon.MessageIcon.Information,
                2000
            )
        else:
            self.settings['position_x'] = self.overlay.x()
            self.settings['position_y'] = self.overlay.y()
            save_settings(self.settings)

    def open_config(self):
        """Opens the settings window"""
        if self.config_window is None or not self.config_window.isVisible():
            self.config_window = ConfigWindow(self.settings, self.overlay)

            self.config_window.font_size_changed.connect(
                self.overlay.update_font_size
            )
            self.config_window.temp_limits_changed.connect(
                self.overlay.update_temp_limits
            )
            self.config_window.colors_changed.connect(
                self.overlay.update_colors
            )
            self.config_window.settings_saved.connect(self.on_settings_saved)

            self.config_window.show()
        else:
            self.config_window.raise_()
            self.config_window.activateWindow()

    def on_settings_saved(self):
        """Callback when settings are saved"""
        self.settings = load_settings()
        # Reload hotkeys with new settings
        self.hotkeys = {
            'toggle': self.parse_hotkey(self.settings.get('hotkey_toggle', 'ctrl+num1')),
            'drag': self.parse_hotkey(self.settings.get('hotkey_drag', 'ctrl+num2')),
            'quit': self.parse_hotkey(self.settings.get('hotkey_quit', 'ctrl+num3')),
            'config': self.parse_hotkey(self.settings.get('hotkey_config', 'ctrl+num0')),
        }

    def quit_app(self):
        """Shuts down the application"""
        if self.overlay.isVisible():
            self.settings['position_x'] = self.overlay.x()
            self.settings['position_y'] = self.overlay.y()
            save_settings(self.settings)

        if hasattr(self, 'hotkey_listener'):
            self.hotkey_listener.stop()
        self.overlay.close()
        self.tray.hide()
        self.app.quit()

    def run(self):
        """Starts the application"""
        return self.app.exec()


def main():
    """Main entry point"""
    import socket
    try:
        lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        lock_socket.bind(('127.0.0.1', 47832))
    except socket.error:
        print("Performance Status is already running.")
        sys.exit(1)

    app = PerformanceApp()
    sys.exit(app.run())


if __name__ == '__main__':
    main()
