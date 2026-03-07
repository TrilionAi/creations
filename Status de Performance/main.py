"""
Status de Performance - Monitor de Sistema Leve
Overlay que mostra CPU, GPU, RAM e temperaturas

Controles:
- Ctrl+Num1: Mostrar/Esconder overlay
- Ctrl+Num2: Ativar/Desativar modo arrastar
- Ctrl+Num3: Fechar aplicativo
- Ctrl+Num0: Abrir configurações
- Clique direito no overlay ou ícone da bandeja: Menu
"""

import sys
import os

# Adiciona o diretório atual ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication, QSystemTrayIcon, QMenu
from PyQt6.QtGui import QIcon, QAction, QPixmap, QPainter, QColor
from PyQt6.QtCore import QTimer, Qt, QObject, pyqtSignal

from overlay import PerformanceOverlay
from config_window import ConfigWindow, load_settings, save_settings

# Hotkeys globais
from pynput import keyboard as pynput_kb


class HotkeySignals(QObject):
    """Signals para comunicação thread-safe de hotkeys"""
    toggle_signal = pyqtSignal()
    drag_signal = pyqtSignal()
    quit_signal = pyqtSignal()
    config_signal = pyqtSignal()



def create_colored_icon(color='#00FF00'):
    """Cria um ícone colorido simples para a bandeja"""
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
    """Aplicação principal do Status de Performance"""

    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setQuitOnLastWindowClosed(False)
        self.app.setApplicationName("Status de Performance")

        # Carrega configurações
        self.settings = load_settings()

        # Cria o overlay
        self.overlay = PerformanceOverlay(self.settings)

        # Adiciona menu de contexto ao overlay
        self.setup_overlay_context_menu()

        # Restaura posição se salva
        if self.settings.get('position_x') is not None:
            self.overlay.move(
                self.settings['position_x'],
                self.settings['position_y']
            )

        # Janela de configuração (criada sob demanda)
        self.config_window = None

        # Estado do arrasto
        self.drag_mode = False

        # Signals para hotkeys (thread-safe)
        self.hotkey_signals = HotkeySignals()
        self.hotkey_signals.toggle_signal.connect(self.toggle_visibility)
        self.hotkey_signals.drag_signal.connect(self.toggle_drag)
        self.hotkey_signals.quit_signal.connect(self.quit_app)
        self.hotkey_signals.config_signal.connect(self.open_config)

        # Configura tray icon
        self.setup_tray()

        # Configura hotkeys globais
        self.setup_hotkeys()

        # Mostra o overlay inicialmente
        self.overlay.show()

    def setup_overlay_context_menu(self):
        """Configura menu de contexto (botão direito) no overlay"""
        self.overlay.setContextMenuPolicy(Qt.ContextMenuPolicy.CustomContextMenu)
        self.overlay.customContextMenuRequested.connect(self.show_overlay_menu)

    def show_overlay_menu(self, pos):
        """Mostra o menu de contexto do overlay"""
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

        config_action = menu.addAction("Configurações")
        config_action.triggered.connect(self.open_config)

        drag_action = menu.addAction("Modo Arrastar")
        drag_action.triggered.connect(self.toggle_drag)

        menu.addSeparator()

        hide_action = menu.addAction("Esconder")
        hide_action.triggered.connect(self.hide_overlay)

        menu.addSeparator()

        quit_action = menu.addAction("Fechar Aplicativo")
        quit_action.triggered.connect(self.quit_app)

        menu.exec(self.overlay.mapToGlobal(pos))

    def setup_tray(self):
        """Configura o ícone na bandeja do sistema"""
        self.tray = QSystemTrayIcon(self.app)

        # Cria ícone verde visível
        self.tray.setIcon(create_colored_icon('#00FF00'))

        # Menu do tray
        menu = QMenu()

        toggle_action = QAction("Mostrar/Esconder (Ctrl+Num1)", menu)
        toggle_action.triggered.connect(self.toggle_visibility)
        menu.addAction(toggle_action)

        drag_action = QAction("Modo Arrasto (Ctrl+Num2)", menu)
        drag_action.triggered.connect(self.toggle_drag)
        menu.addAction(drag_action)

        menu.addSeparator()

        config_action = QAction("Configurações (Ctrl+Num0)", menu)
        config_action.triggered.connect(self.open_config)
        menu.addAction(config_action)

        menu.addSeparator()

        quit_action = QAction("Fechar (Ctrl+Num3)", menu)
        quit_action.triggered.connect(self.quit_app)
        menu.addAction(quit_action)

        self.tray.setContextMenu(menu)
        self.tray.setToolTip("Status de Performance\nClique direito para menu")
        self.tray.show()

        # Verifica se o tray está disponível
        if not QSystemTrayIcon.isSystemTrayAvailable():
            print("Aviso: Bandeja do sistema não disponível")

        # Double-click no tray mostra/esconde
        self.tray.activated.connect(self.tray_activated)

    def tray_activated(self, reason):
        """Callback quando o tray é ativado"""
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            if self.overlay.isVisible():
                self.hide_overlay()
            else:
                self.show_overlay()
        elif reason == QSystemTrayIcon.ActivationReason.Trigger:
            # Clique simples também mostra menu
            pass

    def setup_hotkeys(self):
        """Configura hotkeys globais baseado nas configurações"""
        self.ctrl_pressed = False
        self.alt_pressed = False
        self.shift_pressed = False

        # Mapeamento de nomes para códigos VK
        self.vk_map = {
            'num0': 96, 'num1': 97, 'num2': 98, 'num3': 99, 'num4': 100,
            'num5': 101, 'num6': 102, 'num7': 103, 'num8': 104, 'num9': 105,
            'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117,
            'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123,
        }
        # Adiciona letras A-Z
        for i in range(26):
            self.vk_map[chr(97 + i)] = 65 + i
        # Adiciona números 0-9
        for i in range(10):
            self.vk_map[str(i)] = 48 + i

        # Carrega atalhos das configurações
        self.hotkeys = {
            'toggle': self.parse_hotkey(self.settings.get('hotkey_toggle', 'ctrl+num1')),
            'drag': self.parse_hotkey(self.settings.get('hotkey_drag', 'ctrl+num2')),
            'quit': self.parse_hotkey(self.settings.get('hotkey_quit', 'ctrl+num3')),
            'config': self.parse_hotkey(self.settings.get('hotkey_config', 'ctrl+num0')),
        }

        def on_press(key):
            # Detecta modificadores
            if key == pynput_kb.Key.ctrl_l or key == pynput_kb.Key.ctrl_r:
                self.ctrl_pressed = True
                return
            if key == pynput_kb.Key.alt_l or key == pynput_kb.Key.alt_r:
                self.alt_pressed = True
                return
            if key == pynput_kb.Key.shift_l or key == pynput_kb.Key.shift_r:
                self.shift_pressed = True
                return

            # Verifica tecla pressionada
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
        """Converte string de hotkey para dicionário"""
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
        """Verifica se uma hotkey foi acionada"""
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
        """Alterna visibilidade do overlay"""
        if self.overlay.isVisible():
            self.hide_overlay()
        else:
            self.show_overlay()

    def show_overlay(self):
        """Mostra o overlay"""
        self.overlay.show()
        self.overlay.raise_()
        self.tray.setIcon(create_colored_icon('#00FF00'))  # Verde = visível

    def hide_overlay(self):
        """Esconde o overlay"""
        self.settings['position_x'] = self.overlay.x()
        self.settings['position_y'] = self.overlay.y()
        save_settings(self.settings)
        self.overlay.hide()
        self.tray.setIcon(create_colored_icon('#888888'))  # Cinza = escondido

    def toggle_drag(self):
        """Alterna modo de arrasto"""
        self.drag_mode = not self.drag_mode
        self.overlay.set_drag_enabled(self.drag_mode)

        if self.drag_mode:
            self.tray.showMessage(
                "Status de Performance",
                "Modo arrasto ATIVADO.\nArraste o overlay. PgDn para desativar.",
                QSystemTrayIcon.MessageIcon.Information,
                2000
            )
        else:
            self.settings['position_x'] = self.overlay.x()
            self.settings['position_y'] = self.overlay.y()
            save_settings(self.settings)

    def open_config(self):
        """Abre a janela de configurações"""
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
        """Callback quando configurações são salvas"""
        self.settings = load_settings()
        # Recarrega os hotkeys com as novas configurações
        self.hotkeys = {
            'toggle': self.parse_hotkey(self.settings.get('hotkey_toggle', 'ctrl+num1')),
            'drag': self.parse_hotkey(self.settings.get('hotkey_drag', 'ctrl+num2')),
            'quit': self.parse_hotkey(self.settings.get('hotkey_quit', 'ctrl+num3')),
            'config': self.parse_hotkey(self.settings.get('hotkey_config', 'ctrl+num0')),
        }

    def quit_app(self):
        """Encerra a aplicação"""
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
        """Inicia a aplicação"""
        return self.app.exec()


def main():
    """Ponto de entrada principal"""
    import socket
    try:
        lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        lock_socket.bind(('127.0.0.1', 47832))
    except socket.error:
        print("Status de Performance já está em execução.")
        sys.exit(1)

    app = PerformanceApp()
    sys.exit(app.run())


if __name__ == '__main__':
    main()
