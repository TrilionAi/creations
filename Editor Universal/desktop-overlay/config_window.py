"""
Config Window - Janela de configurações do Editor Universal Desktop
Permite ajustar hotkeys, cores, espessura e guia de leitura
Widgets HotkeyButton e ColorButton reutilizados do Status de Performance
"""

import sys
import platform

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QSlider,
    QSpinBox, QPushButton, QGroupBox, QColorDialog
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QFont, QColor

from settings import load_settings, save_settings, DEFAULT_SETTINGS


class HotkeyButton(QPushButton):
    """Botão que captura combinação de teclas"""
    hotkey_changed = Signal(str)

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
        self._update_text()
        self.setFixedWidth(150)
        self.clicked.connect(self._start_capture)
        self.setStyleSheet("""
            QPushButton {
                background-color: #444;
                color: white;
                padding: 5px 10px;
                border: 2px solid #555;
                border-radius: 4px;
            }
            QPushButton:hover { border: 2px solid #666; }
        """)

    def _update_text(self):
        self.setText("Pressione tecla..." if self.waiting
                     else (self.hotkey.upper() if self.hotkey else "Nenhum"))

    def _start_capture(self):
        self.waiting = True
        self._update_text()
        self.setFocus()

    def keyPressEvent(self, event):
        if not self.waiting:
            return super().keyPressEvent(event)

        key = event.key()
        modifiers = event.modifiers()
        parts = []

        if modifiers & Qt.KeyboardModifier.ControlModifier:
            parts.append('ctrl')
        if modifiers & Qt.KeyboardModifier.AltModifier:
            parts.append('alt')
        if modifiers & Qt.KeyboardModifier.ShiftModifier:
            parts.append('shift')

        if key not in (Qt.Key.Key_Control, Qt.Key.Key_Alt,
                       Qt.Key.Key_Shift, Qt.Key.Key_Meta):
            vk = event.nativeVirtualKey()
            if vk in self.VK_NAMES:
                key_name = self.VK_NAMES[vk].lower()
            elif 65 <= vk <= 90:
                key_name = chr(vk).lower()
            elif 48 <= vk <= 57:
                key_name = chr(vk)
            else:
                key_name = f'vk{vk}'

            parts.append(key_name)
            self.hotkey = '+'.join(parts)
            self.waiting = False
            self._update_text()
            self.hotkey_changed.emit(self.hotkey)

    def focusOutEvent(self, event):
        if self.waiting:
            self.waiting = False
            self._update_text()
        super().focusOutEvent(event)

    def get_hotkey(self):
        return self.hotkey

    def set_hotkey(self, hotkey):
        self.hotkey = hotkey
        self._update_text()


class ColorButton(QPushButton):
    """Botão que mostra e permite selecionar uma cor"""
    color_changed = Signal(str)

    def __init__(self, color='#FFFFFF', parent=None):
        super().__init__(parent)
        self.color = color
        self.setFixedSize(60, 30)
        self._update_style()
        self.clicked.connect(self._choose_color)

    def _update_style(self):
        self.setStyleSheet(f"""
            QPushButton {{
                background-color: {self.color};
                border: 2px solid #666;
                border-radius: 4px;
            }}
            QPushButton:hover {{ border: 2px solid #999; }}
        """)

    def _choose_color(self):
        color = QColorDialog.getColor(QColor(self.color), self, "Escolha uma cor")
        if color.isValid():
            self.color = color.name()
            self._update_style()
            self.color_changed.emit(self.color)

    def set_color(self, color):
        self.color = color
        self._update_style()

    def get_color(self):
        return self.color


class ConfigWindow(QWidget):
    """Janela de configurações"""

    settings_saved = Signal()

    def __init__(self, current_settings=None):
        super().__init__()
        self.settings = current_settings or load_settings()
        self._init_ui()

    def _init_ui(self):
        self.setWindowTitle("Configurações - Editor Universal")
        self.setFixedSize(430, 520)
        self.setWindowFlags(Qt.WindowType.WindowStaysOnTopHint)

        layout = QVBoxLayout()
        layout.setSpacing(10)

        title = QLabel("Configurações")
        title.setFont(QFont('Segoe UI', 14, QFont.Weight.Bold))
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        # --- Atalhos ---
        hotkeys_group = QGroupBox("Atalhos de Teclado (clique para alterar)")
        hotkeys_layout = QVBoxLayout()

        self._hotkey_buttons = {}
        hotkey_items = [
            ('hotkey_toggle_draw', 'Modo Desenho:'),
            ('hotkey_toggle_guide', 'Guia de Leitura:'),
            ('hotkey_toggle_text', 'Modo Texto:'),
            ('hotkey_quit', 'Fechar App:'),
        ]
        for key, label_text in hotkey_items:
            row = QHBoxLayout()
            row.addWidget(QLabel(label_text))
            row.addStretch()
            btn = HotkeyButton(self.settings.get(key, ''))
            self._hotkey_buttons[key] = btn
            row.addWidget(btn)
            hotkeys_layout.addLayout(row)

        hotkeys_group.setLayout(hotkeys_layout)
        layout.addWidget(hotkeys_group)

        # --- Cores ---
        colors_group = QGroupBox("Cores")
        colors_layout = QVBoxLayout()

        # Cor do pincel
        brush_row = QHBoxLayout()
        brush_row.addWidget(QLabel("Cor do Pincel:"))
        brush_row.addStretch()
        self._brush_color_btn = ColorButton(self.settings.get('brush_color', '#FF0000'))
        brush_row.addWidget(self._brush_color_btn)
        colors_layout.addLayout(brush_row)

        # Espessura padrão
        size_row = QHBoxLayout()
        size_row.addWidget(QLabel("Espessura Padrão:"))
        size_row.addStretch()
        self._size_spin = QSpinBox()
        self._size_spin.setRange(1, 20)
        self._size_spin.setValue(self.settings.get('brush_size', 3))
        size_row.addWidget(self._size_spin)
        colors_layout.addLayout(size_row)

        colors_group.setLayout(colors_layout)
        layout.addWidget(colors_group)

        # --- Guia de Leitura ---
        guide_group = QGroupBox("Guia de Leitura")
        guide_layout = QVBoxLayout()

        height_row = QHBoxLayout()
        height_row.addWidget(QLabel("Altura da Barra:"))
        self._guide_height_spin = QSpinBox()
        self._guide_height_spin.setRange(10, 100)
        self._guide_height_spin.setValue(self.settings.get('guide_height', 40))
        self._guide_height_spin.setSuffix(" px")
        height_row.addStretch()
        height_row.addWidget(self._guide_height_spin)
        guide_layout.addLayout(height_row)

        guide_group.setLayout(guide_layout)
        layout.addWidget(guide_group)

        # --- Botões ---
        buttons_row = QHBoxLayout()

        save_btn = QPushButton("Salvar")
        save_btn.clicked.connect(self._save_and_close)
        save_btn.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50; color: white;
                padding: 8px 20px; border: none; border-radius: 4px;
            }
            QPushButton:hover { background-color: #45a049; }
        """)

        cancel_btn = QPushButton("Cancelar")
        cancel_btn.clicked.connect(self.close)
        cancel_btn.setStyleSheet("""
            QPushButton {
                background-color: #666; color: white;
                padding: 8px 20px; border: none; border-radius: 4px;
            }
            QPushButton:hover { background-color: #555; }
        """)

        buttons_row.addStretch()
        buttons_row.addWidget(cancel_btn)
        buttons_row.addWidget(save_btn)
        layout.addLayout(buttons_row)

        self.setLayout(layout)

        # Estilo dark
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
            QSpinBox {
                background: #444;
                border: 1px solid #555;
                border-radius: 3px;
                padding: 3px;
                color: white;
            }
        """)

    def _save_and_close(self):
        # Hotkeys
        for key, btn in self._hotkey_buttons.items():
            self.settings[key] = btn.get_hotkey()

        # Cores
        self.settings['brush_color'] = self._brush_color_btn.get_color()
        self.settings['brush_size'] = self._size_spin.value()

        # Guia
        self.settings['guide_height'] = self._guide_height_spin.value()

        save_settings(self.settings)
        self.settings_saved.emit()
        self.close()
