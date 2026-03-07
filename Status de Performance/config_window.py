"""
Config Window - Janela de configurações do overlay
Permite ajustar fonte, limites de temperatura, cores e auto-iniciar
"""

import json
import os
import sys
import platform

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QSlider,
    QSpinBox, QCheckBox, QPushButton, QGroupBox, QColorDialog,
    QFrame
)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QFont, QColor


# Caminho do arquivo de configurações
CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(CONFIG_DIR, 'settings.json')

# Configurações padrão
DEFAULT_SETTINGS = {
    'font_size': 11,
    'cpu_temp_limit': 85,
    'gpu_temp_limit': 83,
    'auto_start': False,
    'position_x': None,
    'position_y': None,
    # Cores
    'color_normal': '#00FF00',      # Verde
    'color_warning': '#FFAA00',     # Laranja
    'color_critical': '#FF4444',    # Vermelho
    'color_temp': '#00AAFF',        # Azul claro
    'color_background': '#1E1E1E',  # Cinza escuro
    # Atalhos (teclas virtuais)
    'hotkey_toggle': 'ctrl+num1',
    'hotkey_drag': 'ctrl+num2',
    'hotkey_quit': 'ctrl+num3',
    'hotkey_config': 'ctrl+num0',
}


def load_settings():
    """Carrega configurações do arquivo JSON"""
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                settings = json.load(f)
                return {**DEFAULT_SETTINGS, **settings}
    except Exception:
        pass
    return DEFAULT_SETTINGS.copy()


def save_settings(settings):
    """Salva configurações no arquivo JSON"""
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(settings, f, indent=2)
        return True
    except Exception:
        return False


def set_auto_start(enabled):
    """Configura o auto-iniciar com o sistema"""
    if platform.system() == 'Windows':
        import winreg
        key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
        app_name = "StatusDePerformance"

        try:
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path, 0, winreg.KEY_ALL_ACCESS)

            if enabled:
                exe_path = os.path.abspath(os.path.join(CONFIG_DIR, 'main.py'))
                python_path = sys.executable.replace('python.exe', 'pythonw.exe')
                command = f'"{python_path}" "{exe_path}"'
                winreg.SetValueEx(key, app_name, 0, winreg.REG_SZ, command)
            else:
                try:
                    winreg.DeleteValue(key, app_name)
                except FileNotFoundError:
                    pass

            winreg.CloseKey(key)
            return True
        except Exception as e:
            print(f"Erro ao configurar auto-start: {e}")
            return False
    return False


class HotkeyButton(QPushButton):
    """Botão que captura combinação de teclas"""
    hotkey_changed = pyqtSignal(str)

    # Mapeamento de teclas virtuais para nomes
    VK_NAMES = {
        96: 'Num0', 97: 'Num1', 98: 'Num2', 99: 'Num3', 100: 'Num4',
        101: 'Num5', 102: 'Num6', 103: 'Num7', 104: 'Num8', 105: 'Num9',
        112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
        118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
    }

    def __init__(self, hotkey='', parent=None):
        super().__init__(parent)
        self.hotkey = hotkey
        self.waiting = False
        self.modifiers = []
        self.update_text()
        self.setFixedWidth(150)
        self.clicked.connect(self.start_capture)
        self.setStyleSheet("""
            QPushButton {
                background-color: #444;
                color: white;
                padding: 5px 10px;
                border: 2px solid #555;
                border-radius: 4px;
            }
            QPushButton:hover {
                border: 2px solid #666;
            }
        """)

    def update_text(self):
        if self.waiting:
            self.setText("Pressione tecla...")
        else:
            self.setText(self.hotkey.upper() if self.hotkey else "Nenhum")

    def start_capture(self):
        self.waiting = True
        self.modifiers = []
        self.update_text()
        self.setFocus()

    def keyPressEvent(self, event):
        if not self.waiting:
            super().keyPressEvent(event)
            return

        key = event.key()
        modifiers = event.modifiers()

        # Constrói a string do atalho
        parts = []

        if modifiers & Qt.KeyboardModifier.ControlModifier:
            parts.append('ctrl')
        if modifiers & Qt.KeyboardModifier.AltModifier:
            parts.append('alt')
        if modifiers & Qt.KeyboardModifier.ShiftModifier:
            parts.append('shift')

        # Verifica se é uma tecla válida (não apenas modificador)
        if key not in (Qt.Key.Key_Control, Qt.Key.Key_Alt, Qt.Key.Key_Shift, Qt.Key.Key_Meta):
            # Obtém o código da tecla virtual do Windows
            vk = event.nativeVirtualKey()

            # Nome da tecla
            if vk in self.VK_NAMES:
                key_name = self.VK_NAMES[vk].lower()
            elif 65 <= vk <= 90:  # A-Z
                key_name = chr(vk).lower()
            elif 48 <= vk <= 57:  # 0-9
                key_name = chr(vk)
            else:
                key_name = f'vk{vk}'

            parts.append(key_name)

            self.hotkey = '+'.join(parts)
            self.waiting = False
            self.update_text()
            self.hotkey_changed.emit(self.hotkey)

    def focusOutEvent(self, event):
        if self.waiting:
            self.waiting = False
            self.update_text()
        super().focusOutEvent(event)

    def get_hotkey(self):
        return self.hotkey

    def set_hotkey(self, hotkey):
        self.hotkey = hotkey
        self.update_text()


class ColorButton(QPushButton):
    """Botão que mostra e permite selecionar uma cor"""
    color_changed = pyqtSignal(str)

    def __init__(self, color='#FFFFFF', parent=None):
        super().__init__(parent)
        self.color = color
        self.setFixedSize(60, 30)
        self.update_style()
        self.clicked.connect(self.choose_color)

    def update_style(self):
        self.setStyleSheet(f"""
            QPushButton {{
                background-color: {self.color};
                border: 2px solid #666;
                border-radius: 4px;
            }}
            QPushButton:hover {{
                border: 2px solid #999;
            }}
        """)

    def choose_color(self):
        color = QColorDialog.getColor(QColor(self.color), self, "Escolha uma cor")
        if color.isValid():
            self.color = color.name()
            self.update_style()
            self.color_changed.emit(self.color)

    def set_color(self, color):
        self.color = color
        self.update_style()

    def get_color(self):
        return self.color


class ConfigWindow(QWidget):
    """Janela de configurações"""

    font_size_changed = pyqtSignal(int)
    temp_limits_changed = pyqtSignal(int, int)
    colors_changed = pyqtSignal(dict)
    settings_saved = pyqtSignal()

    def __init__(self, current_settings=None, overlay=None):
        super().__init__()
        self.settings = current_settings or load_settings()
        self.overlay = overlay
        self.init_ui()

    def init_ui(self):
        """Configura a interface"""
        self.setWindowTitle("Configurações - Status de Performance")
        self.setFixedSize(450, 680)
        self.setWindowFlags(Qt.WindowType.WindowStaysOnTopHint)

        layout = QVBoxLayout()
        layout.setSpacing(10)

        # Título
        title = QLabel("Configurações")
        title.setFont(QFont('Segoe UI', 14, QFont.Weight.Bold))
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        # Grupo: Aparência
        appearance_group = QGroupBox("Aparência")
        appearance_layout = QVBoxLayout()

        # Tamanho da fonte
        font_layout = QHBoxLayout()
        font_label = QLabel("Tamanho da Fonte:")
        self.font_slider = QSlider(Qt.Orientation.Horizontal)
        self.font_slider.setMinimum(8)
        self.font_slider.setMaximum(20)
        self.font_slider.setValue(self.settings.get('font_size', 11))
        self.font_slider.valueChanged.connect(self.on_font_change)
        self.font_value_label = QLabel(str(self.font_slider.value()))
        self.font_value_label.setFixedWidth(30)

        font_layout.addWidget(font_label)
        font_layout.addWidget(self.font_slider)
        font_layout.addWidget(self.font_value_label)
        appearance_layout.addLayout(font_layout)

        appearance_group.setLayout(appearance_layout)
        layout.addWidget(appearance_group)

        # Grupo: Cores
        colors_group = QGroupBox("Cores")
        colors_layout = QVBoxLayout()

        # Cor normal
        normal_layout = QHBoxLayout()
        normal_label = QLabel("Uso Normal (baixo):")
        self.color_normal_btn = ColorButton(self.settings.get('color_normal', '#00FF00'))
        self.color_normal_btn.color_changed.connect(self.on_color_change)
        normal_layout.addWidget(normal_label)
        normal_layout.addStretch()
        normal_layout.addWidget(self.color_normal_btn)
        colors_layout.addLayout(normal_layout)

        # Cor warning
        warning_layout = QHBoxLayout()
        warning_label = QLabel("Uso Médio (aviso):")
        self.color_warning_btn = ColorButton(self.settings.get('color_warning', '#FFAA00'))
        self.color_warning_btn.color_changed.connect(self.on_color_change)
        warning_layout.addWidget(warning_label)
        warning_layout.addStretch()
        warning_layout.addWidget(self.color_warning_btn)
        colors_layout.addLayout(warning_layout)

        # Cor critical
        critical_layout = QHBoxLayout()
        critical_label = QLabel("Uso Alto (crítico):")
        self.color_critical_btn = ColorButton(self.settings.get('color_critical', '#FF4444'))
        self.color_critical_btn.color_changed.connect(self.on_color_change)
        critical_layout.addWidget(critical_label)
        critical_layout.addStretch()
        critical_layout.addWidget(self.color_critical_btn)
        colors_layout.addLayout(critical_layout)

        # Cor temperatura
        temp_layout = QHBoxLayout()
        temp_label = QLabel("Temperatura Normal:")
        self.color_temp_btn = ColorButton(self.settings.get('color_temp', '#00AAFF'))
        self.color_temp_btn.color_changed.connect(self.on_color_change)
        temp_layout.addWidget(temp_label)
        temp_layout.addStretch()
        temp_layout.addWidget(self.color_temp_btn)
        colors_layout.addLayout(temp_layout)

        # Cor de fundo
        bg_layout = QHBoxLayout()
        bg_label = QLabel("Cor de Fundo:")
        self.color_bg_btn = ColorButton(self.settings.get('color_background', '#1E1E1E'))
        self.color_bg_btn.color_changed.connect(self.on_color_change)
        bg_layout.addWidget(bg_label)
        bg_layout.addStretch()
        bg_layout.addWidget(self.color_bg_btn)
        colors_layout.addLayout(bg_layout)

        colors_group.setLayout(colors_layout)
        layout.addWidget(colors_group)

        # Grupo: Limites de Temperatura
        temp_group = QGroupBox("Alertas de Temperatura")
        temp_group_layout = QVBoxLayout()

        # CPU Limit
        cpu_layout = QHBoxLayout()
        cpu_label = QLabel("Limite CPU (°C):")
        self.cpu_spin = QSpinBox()
        self.cpu_spin.setRange(60, 105)
        self.cpu_spin.setValue(self.settings.get('cpu_temp_limit', 85))
        self.cpu_spin.valueChanged.connect(self.on_temp_change)
        cpu_layout.addWidget(cpu_label)
        cpu_layout.addStretch()
        cpu_layout.addWidget(self.cpu_spin)
        temp_group_layout.addLayout(cpu_layout)

        # GPU Limit
        gpu_layout = QHBoxLayout()
        gpu_label = QLabel("Limite GPU (°C):")
        self.gpu_spin = QSpinBox()
        self.gpu_spin.setRange(60, 95)
        self.gpu_spin.setValue(self.settings.get('gpu_temp_limit', 83))
        self.gpu_spin.valueChanged.connect(self.on_temp_change)
        gpu_layout.addWidget(gpu_label)
        gpu_layout.addStretch()
        gpu_layout.addWidget(self.gpu_spin)
        temp_group_layout.addLayout(gpu_layout)

        temp_group.setLayout(temp_group_layout)
        layout.addWidget(temp_group)

        # Grupo: Atalhos de Teclado
        hotkeys_group = QGroupBox("Atalhos de Teclado (clique para alterar)")
        hotkeys_layout = QVBoxLayout()

        # Toggle visibility
        toggle_layout = QHBoxLayout()
        toggle_label = QLabel("Mostrar/Esconder:")
        self.hotkey_toggle_btn = HotkeyButton(self.settings.get('hotkey_toggle', 'ctrl+num1'))
        toggle_layout.addWidget(toggle_label)
        toggle_layout.addStretch()
        toggle_layout.addWidget(self.hotkey_toggle_btn)
        hotkeys_layout.addLayout(toggle_layout)

        # Drag mode
        drag_layout = QHBoxLayout()
        drag_label = QLabel("Modo Arrastar:")
        self.hotkey_drag_btn = HotkeyButton(self.settings.get('hotkey_drag', 'ctrl+num2'))
        drag_layout.addWidget(drag_label)
        drag_layout.addStretch()
        drag_layout.addWidget(self.hotkey_drag_btn)
        hotkeys_layout.addLayout(drag_layout)

        # Quit
        quit_layout = QHBoxLayout()
        quit_label = QLabel("Fechar Aplicativo:")
        self.hotkey_quit_btn = HotkeyButton(self.settings.get('hotkey_quit', 'ctrl+num3'))
        quit_layout.addWidget(quit_label)
        quit_layout.addStretch()
        quit_layout.addWidget(self.hotkey_quit_btn)
        hotkeys_layout.addLayout(quit_layout)

        # Config
        config_layout = QHBoxLayout()
        config_label = QLabel("Abrir Configurações:")
        self.hotkey_config_btn = HotkeyButton(self.settings.get('hotkey_config', 'ctrl+num0'))
        config_layout.addWidget(config_label)
        config_layout.addStretch()
        config_layout.addWidget(self.hotkey_config_btn)
        hotkeys_layout.addLayout(config_layout)

        hotkeys_group.setLayout(hotkeys_layout)
        layout.addWidget(hotkeys_group)

        # Grupo: Sistema
        system_group = QGroupBox("Sistema")
        system_layout = QVBoxLayout()

        self.auto_start_check = QCheckBox("Iniciar automaticamente com o Windows")
        self.auto_start_check.setChecked(self.settings.get('auto_start', False))
        system_layout.addWidget(self.auto_start_check)

        system_group.setLayout(system_layout)
        layout.addWidget(system_group)

        # Botões
        buttons_layout = QHBoxLayout()

        self.reset_btn = QPushButton("Resetar Cores")
        self.reset_btn.clicked.connect(self.reset_colors)
        self.reset_btn.setStyleSheet("""
            QPushButton {
                background-color: #555;
                color: white;
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #666;
            }
        """)

        self.save_btn = QPushButton("Salvar")
        self.save_btn.clicked.connect(self.save_and_close)
        self.save_btn.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
        """)

        self.cancel_btn = QPushButton("Cancelar")
        self.cancel_btn.clicked.connect(self.close)
        self.cancel_btn.setStyleSheet("""
            QPushButton {
                background-color: #666;
                color: white;
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #555;
            }
        """)

        buttons_layout.addWidget(self.reset_btn)
        buttons_layout.addStretch()
        buttons_layout.addWidget(self.cancel_btn)
        buttons_layout.addWidget(self.save_btn)
        layout.addLayout(buttons_layout)

        self.setLayout(layout)

        # Estilo geral
        self.setStyleSheet("""
            QWidget {
                background-color: #2b2b2b;
                color: #ffffff;
            }
            QGroupBox {
                border: 1px solid #444;
                border-radius: 5px;
                margin-top: 10px;
                padding-top: 10px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px;
            }
            QSlider::groove:horizontal {
                height: 6px;
                background: #444;
                border-radius: 3px;
            }
            QSlider::handle:horizontal {
                background: #4CAF50;
                width: 16px;
                margin: -5px 0;
                border-radius: 8px;
            }
            QSpinBox {
                background: #444;
                border: 1px solid #555;
                border-radius: 3px;
                padding: 3px;
            }
            QCheckBox::indicator {
                width: 18px;
                height: 18px;
            }
            QCheckBox::indicator:unchecked {
                border: 2px solid #666;
                background: #333;
                border-radius: 3px;
            }
            QCheckBox::indicator:checked {
                border: 2px solid #4CAF50;
                background: #4CAF50;
                border-radius: 3px;
            }
        """)

    def on_font_change(self, value):
        """Callback quando a fonte muda"""
        self.font_value_label.setText(str(value))
        self.font_size_changed.emit(value)

    def on_temp_change(self):
        """Callback quando limites de temp mudam"""
        self.temp_limits_changed.emit(self.cpu_spin.value(), self.gpu_spin.value())

    def on_color_change(self):
        """Callback quando uma cor muda"""
        colors = {
            'color_normal': self.color_normal_btn.get_color(),
            'color_warning': self.color_warning_btn.get_color(),
            'color_critical': self.color_critical_btn.get_color(),
            'color_temp': self.color_temp_btn.get_color(),
            'color_background': self.color_bg_btn.get_color(),
        }
        self.colors_changed.emit(colors)

    def reset_colors(self):
        """Reseta as cores para o padrão"""
        self.color_normal_btn.set_color(DEFAULT_SETTINGS['color_normal'])
        self.color_warning_btn.set_color(DEFAULT_SETTINGS['color_warning'])
        self.color_critical_btn.set_color(DEFAULT_SETTINGS['color_critical'])
        self.color_temp_btn.set_color(DEFAULT_SETTINGS['color_temp'])
        self.color_bg_btn.set_color(DEFAULT_SETTINGS['color_background'])
        self.on_color_change()

    def save_and_close(self):
        """Salva as configurações e fecha a janela"""
        self.settings['font_size'] = self.font_slider.value()
        self.settings['cpu_temp_limit'] = self.cpu_spin.value()
        self.settings['gpu_temp_limit'] = self.gpu_spin.value()
        self.settings['auto_start'] = self.auto_start_check.isChecked()
        self.settings['color_normal'] = self.color_normal_btn.get_color()
        self.settings['color_warning'] = self.color_warning_btn.get_color()
        self.settings['color_critical'] = self.color_critical_btn.get_color()
        self.settings['color_temp'] = self.color_temp_btn.get_color()
        self.settings['color_background'] = self.color_bg_btn.get_color()
        # Atalhos
        self.settings['hotkey_toggle'] = self.hotkey_toggle_btn.get_hotkey()
        self.settings['hotkey_drag'] = self.hotkey_drag_btn.get_hotkey()
        self.settings['hotkey_quit'] = self.hotkey_quit_btn.get_hotkey()
        self.settings['hotkey_config'] = self.hotkey_config_btn.get_hotkey()

        save_settings(self.settings)
        set_auto_start(self.settings['auto_start'])

        self.settings_saved.emit()
        self.close()

    def get_settings(self):
        """Retorna as configurações atuais"""
        return self.settings


if __name__ == '__main__':
    from PyQt6.QtWidgets import QApplication

    app = QApplication(sys.argv)
    window = ConfigWindow()
    window.show()
    sys.exit(app.exec())
