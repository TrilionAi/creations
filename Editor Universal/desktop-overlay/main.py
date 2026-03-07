"""
Editor Universal Desktop - Overlay de desenho e anotação
Funciona sobre qualquer programa do Windows.

Controles:
- Ctrl+Num1: Ativar/Desativar modo desenho
- Ctrl+Num2: Ativar/Desativar guia de leitura
- Ctrl+Num3: Ativar/Desativar modo texto
- Ctrl+Z: Desfazer último traço
- Ctrl+Shift+C: Limpar tudo
- Ctrl+Num0: Fechar aplicativo
"""

import sys
import os
import socket
import logging
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configura logging para arquivo de erro (usa mesmo diretório do settings)
from settings import CONFIG_DIR
LOG_FILE = os.path.join(CONFIG_DIR, 'error.log')
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

from PySide6.QtWidgets import QApplication, QSystemTrayIcon, QMenu
from PySide6.QtGui import QIcon, QAction, QPixmap, QPainter, QColor
from PySide6.QtCore import QTimer, Qt, QObject, Signal

from overlay import DrawingOverlay
from toolbar_window import ToolbarWindow
from config_window import ConfigWindow
from settings import load_settings, save_settings

from pynput import keyboard as pynput_kb
from pynput import mouse as pynput_mouse


class HotkeySignals(QObject):
    """Signals para comunicação thread-safe entre threads pynput e Qt"""
    toggle_draw = Signal()
    toggle_guide = Signal()
    toggle_text = Signal()
    undo = Signal()
    clear_all = Signal()
    quit_app = Signal()
    mouse_moved = Signal(int, int)
    right_click_normal_mode = Signal(int, int, bool)  # x, y, ctrl_held


def create_tray_icon(color='#3a86ff'):
    """Cria ícone de lápis para a bandeja do sistema.
    A cor 'color' é usada como indicador de estado (circulinho no canto).
    """
    size = 32
    pixmap = QPixmap(size, size)
    pixmap.fill(Qt.GlobalColor.transparent)
    painter = QPainter(pixmap)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing)

    # --- Desenhar lápis inclinado ~35 graus ---
    painter.save()
    painter.translate(size / 2, size / 2)
    painter.rotate(-35)

    pw = 7    # largura do lápis
    ph = 26   # altura total
    half_w = pw / 2

    # Posicionar lápis centrado
    top_y = -ph / 2
    bot_y = ph / 2

    # Seções (de cima pra baixo)
    eraser_h = ph * 0.11
    band_h = ph * 0.05
    body_h = ph * 0.54
    wood_h = ph * 0.20
    tip_h = ph * 0.10

    y0 = top_y
    y1 = y0 + eraser_h
    y2 = y1 + band_h
    y3 = y2 + body_h
    y4 = y3 + wood_h
    y5 = y4 + tip_h

    from PySide6.QtCore import QRectF, QPointF
    from PySide6.QtGui import QPolygonF

    # Borracha rosa
    painter.setPen(Qt.PenStyle.NoPen)
    painter.setBrush(QColor(255, 160, 170))
    painter.drawRoundedRect(QRectF(-half_w, y0, pw, eraser_h), 2, 2)

    # Virola metálica
    painter.setBrush(QColor(210, 140, 40))
    painter.drawRect(QRectF(-half_w, y1, pw, band_h))

    # Corpo amarelo
    painter.setBrush(QColor(255, 210, 50))
    painter.drawRect(QRectF(-half_w, y2, pw, body_h))

    # Sombra no corpo
    painter.setBrush(QColor(220, 175, 30))
    painter.drawRect(QRectF(-half_w, y2, pw * 0.25, body_h))

    # Ponta madeira (trapezóide)
    wood_poly = QPolygonF([
        QPointF(-half_w, y3),
        QPointF(half_w, y3),
        QPointF(pw * 0.12, y4),
        QPointF(-pw * 0.12, y4),
    ])
    painter.setBrush(QColor(225, 180, 120))
    painter.drawPolygon(wood_poly)

    # Grafite
    tip_poly = QPolygonF([
        QPointF(-pw * 0.12, y4),
        QPointF(pw * 0.12, y4),
        QPointF(0, y5),
    ])
    painter.setBrush(QColor(70, 70, 70))
    painter.drawPolygon(tip_poly)

    # Contorno do lápis inteiro
    outline_poly = QPolygonF([
        QPointF(-half_w, y0 + 1),
        QPointF(-half_w, y3),
        QPointF(-pw * 0.12, y4),
        QPointF(0, y5),
        QPointF(pw * 0.12, y4),
        QPointF(half_w, y3),
        QPointF(half_w, y0 + 1),
    ])
    painter.setPen(QColor(60, 50, 30))
    painter.setBrush(Qt.BrushStyle.NoBrush)
    painter.drawPolyline(outline_poly)

    # Arco do topo da borracha
    painter.drawArc(QRectF(-half_w, y0, pw, 4), 0, 180 * 16)

    painter.restore()

    # --- Indicador de estado (bolinha colorida no canto inferior direito) ---
    if color != '#3a86ff':
        indicator_size = 10
        painter.setPen(QColor('#2b2b2b'))
        painter.setBrush(QColor(color))
        painter.drawEllipse(
            size - indicator_size - 1, size - indicator_size - 1,
            indicator_size, indicator_size
        )

    painter.end()
    return QIcon(pixmap)


class EditorUniversalApp:
    """Aplicação principal do Editor Universal Desktop"""

    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setQuitOnLastWindowClosed(False)
        self.app.setApplicationName("Editor Universal")

        self.settings = load_settings()

        # Overlay
        self.overlay = DrawingOverlay(self.settings)
        self.overlay.show()

        # Toolbar
        self.toolbar = ToolbarWindow(self.settings)
        self._connect_toolbar()
        self.toolbar.show()  # Mostra bolinha flutuante no startup

        # Config (criada sob demanda)
        self.config_window = None

        # Signals
        self.signals = HotkeySignals()
        self.signals.toggle_draw.connect(self._toggle_draw)
        self.signals.toggle_guide.connect(self._toggle_guide)
        self.signals.toggle_text.connect(self._toggle_text)
        self.signals.undo.connect(self.overlay.undo)
        self.signals.clear_all.connect(self.overlay.clear_all)
        self.signals.quit_app.connect(self._quit)
        self.signals.mouse_moved.connect(self.overlay.update_guide_position)
        self.signals.right_click_normal_mode.connect(self._handle_normal_mode_right_click)

        # Tray
        self._setup_tray()

        # Hotkeys
        self._setup_hotkeys()

        # Mouse listener (para guia de leitura global)
        self._setup_mouse_listener()

        # Registrar toolbar HWND na overlay para Z-order
        QTimer.singleShot(200, self._register_toolbar_hwnd)

        # Timer para manter overlay no topo
        self.raise_timer = QTimer()
        self.raise_timer.timeout.connect(self.overlay.stay_on_top)
        self.raise_timer.start(3000)

    def _register_toolbar_hwnd(self):
        """Registra HWND da toolbar na overlay para manter toolbar acima"""
        try:
            toolbar_hwnd = int(self.toolbar.winId())
            self.overlay.set_toolbar_hwnd(toolbar_hwnd)
            print(f"[Editor Universal] Toolbar HWND registrado: {toolbar_hwnd}")
        except Exception as e:
            print(f"[Editor Universal] Erro ao registrar toolbar HWND: {e}")

    def _connect_toolbar(self):
        """Conecta sinais da toolbar ao overlay"""
        self.toolbar.tool_changed.connect(self._on_tool_changed)
        self.toolbar.color_changed.connect(self.overlay.set_brush_color)
        self.toolbar.size_changed.connect(self.overlay.set_brush_size)
        self.toolbar.undo_requested.connect(self.overlay.undo)
        self.toolbar.clear_requested.connect(self.overlay.clear_all)
        self.toolbar.draw_mode_toggled.connect(self._toggle_draw)
        self.toolbar.guide_toggled.connect(self._toggle_guide)
        self.toolbar.text_mode_toggled.connect(self._toggle_text)
        self.toolbar.ghost_mode_toggled.connect(self._toggle_ghost)
        self.toolbar.pointer_mode_requested.connect(self._activate_pointer_mode)
        self.toolbar.draw_mode_requested.connect(self._activate_draw_mode)

        # Feedback visual
        self.overlay.mode_changed.connect(self.toolbar.update_draw_mode_state)

    def _setup_tray(self):
        """Configura ícone na bandeja do sistema"""
        self.tray = QSystemTrayIcon(self.app)
        self.tray.setIcon(create_tray_icon('#3a86ff'))
        self.tray.setToolTip("Editor Universal\nClique direito para menu")

        menu = QMenu()
        menu.setStyleSheet("""
            QMenu {
                background-color: #2b2b2b; color: white;
                border: 1px solid #444;
            }
            QMenu::item { padding: 8px 20px; }
            QMenu::item:selected { background-color: #3d3d3d; }
        """)

        toolbar_action = QAction("Mostrar Toolbar", menu)
        toolbar_action.triggered.connect(self._show_toolbar)
        menu.addAction(toolbar_action)

        draw_action = QAction("Modo Desenho (Ctrl+Num1)", menu)
        draw_action.triggered.connect(self._toggle_draw)
        menu.addAction(draw_action)

        guide_action = QAction("Guia de Leitura (Ctrl+Num2)", menu)
        guide_action.triggered.connect(self._toggle_guide)
        menu.addAction(guide_action)

        menu.addSeparator()

        config_action = QAction("Configurações", menu)
        config_action.triggered.connect(self._open_config)
        menu.addAction(config_action)

        menu.addSeparator()

        quit_action = QAction("Fechar (Ctrl+Num0)", menu)
        quit_action.triggered.connect(self._quit)
        menu.addAction(quit_action)

        self.tray.setContextMenu(menu)
        self.tray.show()

        self.tray.activated.connect(self._tray_activated)

    def _tray_activated(self, reason):
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            self._show_toolbar()

    def _show_toolbar(self):
        if self.toolbar.isVisible():
            self.toolbar.raise_()
            self.toolbar.activateWindow()
        else:
            self.toolbar.show()

    def _setup_hotkeys(self):
        """Configura hotkeys globais com pynput"""
        self.ctrl_pressed = False
        self.alt_pressed = False
        self.shift_pressed = False

        self.vk_map = {
            'num0': 96, 'num1': 97, 'num2': 98, 'num3': 99, 'num4': 100,
            'num5': 101, 'num6': 102, 'num7': 103, 'num8': 104, 'num9': 105,
            'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117,
            'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123,
        }
        for i in range(26):
            self.vk_map[chr(97 + i)] = 65 + i
        for i in range(10):
            self.vk_map[str(i)] = 48 + i
        # Tecla Z para undo
        self.vk_map['z'] = 90
        self.vk_map['c'] = 67

        self.hotkeys = {
            'toggle_draw': self._parse_hotkey(self.settings.get('hotkey_toggle_draw', 'ctrl+num1')),
            'toggle_guide': self._parse_hotkey(self.settings.get('hotkey_toggle_guide', 'ctrl+num2')),
            'toggle_text': self._parse_hotkey(self.settings.get('hotkey_toggle_text', 'ctrl+num3')),
            'undo': self._parse_hotkey(self.settings.get('hotkey_undo', 'ctrl+z')),
            'clear': self._parse_hotkey(self.settings.get('hotkey_clear', 'ctrl+shift+c')),
            'quit': self._parse_hotkey(self.settings.get('hotkey_quit', 'ctrl+num0')),
        }

        def on_press(key):
            if key == pynput_kb.Key.ctrl_l or key == pynput_kb.Key.ctrl_r:
                self.ctrl_pressed = True
                return
            if key == pynput_kb.Key.alt_l or key == pynput_kb.Key.alt_r:
                self.alt_pressed = True
                return
            if key == pynput_kb.Key.shift_l or key == pynput_kb.Key.shift_r:
                self.shift_pressed = True
                return

            vk = None
            try:
                # Estratégia 1: atributo .vk direto (KeyCode com numpad)
                vk = getattr(key, 'vk', None)

                # Estratégia 2: Key enum → key.value.vk
                if vk is None and hasattr(key, 'value'):
                    vk = getattr(key.value, 'vk', None)

                # Estratégia 3: caractere normal → ord()
                if vk is None and hasattr(key, 'char') and key.char:
                    vk = ord(key.char.upper())
            except Exception:
                pass

            if vk is not None:
                self._check_hotkey(vk)

        def on_release(key):
            if key == pynput_kb.Key.ctrl_l or key == pynput_kb.Key.ctrl_r:
                self.ctrl_pressed = False
            if key == pynput_kb.Key.alt_l or key == pynput_kb.Key.alt_r:
                self.alt_pressed = False
            if key == pynput_kb.Key.shift_l or key == pynput_kb.Key.shift_r:
                self.shift_pressed = False

        self.kb_listener = pynput_kb.Listener(on_press=on_press, on_release=on_release)
        self.kb_listener.start()

    def _setup_mouse_listener(self):
        """Listener global de mouse para guia de leitura + right-click no modo normal"""
        def on_move(x, y):
            self.signals.mouse_moved.emit(x, y)

        def on_click(x, y, button, pressed):
            if button == pynput_mouse.Button.right and pressed:
                # Right-click no modo normal → tentar selecionar item
                if not self.overlay.draw_mode and not self.overlay.text_mode:
                    self.signals.right_click_normal_mode.emit(
                        x, y, self.ctrl_pressed)

        self.mouse_listener = pynput_mouse.Listener(
            on_move=on_move, on_click=on_click)
        self.mouse_listener.start()

    def _parse_hotkey(self, hotkey_str):
        if not hotkey_str:
            return None
        parts = hotkey_str.lower().split('+')
        return {
            'ctrl': 'ctrl' in parts,
            'alt': 'alt' in parts,
            'shift': 'shift' in parts,
            'vk': self.vk_map.get(parts[-1], 0) if parts else 0
        }

    def _check_hotkey(self, vk):
        for name, hk in self.hotkeys.items():
            if hk and hk['vk'] == vk:
                if (hk['ctrl'] == self.ctrl_pressed and
                    hk['alt'] == self.alt_pressed and
                    hk['shift'] == self.shift_pressed):
                    signal_map = {
                        'toggle_draw': self.signals.toggle_draw,
                        'toggle_guide': self.signals.toggle_guide,
                        'toggle_text': self.signals.toggle_text,
                        'undo': self.signals.undo,
                        'clear': self.signals.clear_all,
                        'quit': self.signals.quit_app,
                    }
                    signal = signal_map.get(name)
                    if signal:
                        signal.emit()

    def _toggle_draw(self):
        self.overlay.toggle_draw_mode()
        is_on = self.overlay.draw_mode
        print(f"[Editor Universal] Modo desenho: {'ON' if is_on else 'OFF'}")
        self.tray.setIcon(create_tray_icon('#FF4444' if is_on else '#3a86ff'))
        if is_on:
            self.toolbar.update_text_mode_state(False)

    def _activate_pointer_mode(self):
        """Volta ao modo normal (click-through)"""
        if self.overlay.draw_mode:
            self.overlay.toggle_draw_mode()
        if self.overlay.text_mode:
            self.overlay.toggle_text_mode()
        self.toolbar.update_draw_mode_state(False)
        self.toolbar.update_text_mode_state(False)
        self.tray.setIcon(create_tray_icon('#3a86ff'))
        print("[Editor Universal] Modo normal (pointer)")

    def _on_tool_changed(self, tool):
        """Troca ferramenta e re-ativa overlay (toolbar roubou foco ao clicar)"""
        self.overlay.set_tool(tool)
        if self.overlay.draw_mode:
            # Delay para dar tempo do Qt processar o clique da toolbar
            QTimer.singleShot(50, self.overlay._activate_overlay)

    def _activate_draw_mode(self):
        """Ativa draw mode se não estiver ativo"""
        if not self.overlay.draw_mode:
            self.overlay.toggle_draw_mode()
            self.tray.setIcon(create_tray_icon('#FF4444'))
            self.toolbar.update_text_mode_state(False)
            print("[Editor Universal] Modo desenho auto-ativado")

    def _handle_normal_mode_right_click(self, x, y, ctrl_held):
        """Tenta selecionar item no modo normal (click-through desativado temporariamente)"""
        from PySide6.QtCore import QPoint, Qt
        from drawing_utils import hit_test_text, hit_test_path, inverse_transform_pos

        pos = QPoint(x, y)
        found = False

        # Checar textos
        for i in range(len(self.overlay.text_annotations) - 1, -1, -1):
            local = inverse_transform_pos(pos, self.overlay.text_annotations[i], 'text')
            hit, _ = hit_test_text(self.overlay.text_annotations[i], local)
            if hit:
                found = True
                break

        # Checar paths
        if not found:
            for i in range(len(self.overlay.paths) - 1, -1, -1):
                local = inverse_transform_pos(pos, self.overlay.paths[i], 'path')
                if hit_test_path(self.overlay.paths[i], local):
                    found = True
                    break

        if found:
            # Ativar overlay temporariamente para seleção
            self.overlay._set_click_through(False)
            self.overlay._activate_overlay()
            modifiers = Qt.KeyboardModifier.ControlModifier if ctrl_held else Qt.KeyboardModifier(0)
            self.overlay._handle_right_click(pos, modifiers)

    def _toggle_guide(self):
        state = self.overlay.toggle_guide()
        self.toolbar.update_guide_state(state)
        print(f"[Editor Universal] Guia de leitura: {'ON' if state else 'OFF'}")

    def _toggle_text(self):
        state = self.overlay.toggle_text_mode()
        print(f"[Editor Universal] Modo texto: {'ON' if state else 'OFF'}")
        self.toolbar.update_text_mode_state(state)
        if state:
            self.toolbar.update_draw_mode_state(False)
        self.tray.setIcon(create_tray_icon('#00CC88' if state else '#3a86ff'))

    def _toggle_ghost(self):
        state = self.overlay.toggle_ghost_mode()
        self.toolbar.update_ghost_state(state)
        print(f"[Editor Universal] Modo apresentação: {'ON' if state else 'OFF'}")

    def _open_config(self):
        if self.config_window is None or not self.config_window.isVisible():
            self.config_window = ConfigWindow(self.settings)
            self.config_window.settings_saved.connect(self._on_settings_saved)
            self.config_window.show()
        else:
            self.config_window.raise_()
            self.config_window.activateWindow()

    def _on_settings_saved(self):
        self.settings = load_settings()
        self.hotkeys = {
            'toggle_draw': self._parse_hotkey(self.settings.get('hotkey_toggle_draw', 'ctrl+num1')),
            'toggle_guide': self._parse_hotkey(self.settings.get('hotkey_toggle_guide', 'ctrl+num2')),
            'toggle_text': self._parse_hotkey(self.settings.get('hotkey_toggle_text', 'ctrl+num3')),
            'undo': self._parse_hotkey(self.settings.get('hotkey_undo', 'ctrl+z')),
            'clear': self._parse_hotkey(self.settings.get('hotkey_clear', 'ctrl+shift+c')),
            'quit': self._parse_hotkey(self.settings.get('hotkey_quit', 'ctrl+num0')),
        }
        self.overlay.set_brush_color(self.settings.get('brush_color', '#FF0000'))
        self.overlay.set_brush_size(self.settings.get('brush_size', 3))
        self.overlay.set_guide_height(self.settings.get('guide_height', 40))

    def _quit(self):
        save_settings(self.settings)
        if hasattr(self, 'kb_listener'):
            self.kb_listener.stop()
        if hasattr(self, 'mouse_listener'):
            self.mouse_listener.stop()
        self.raise_timer.stop()
        self.overlay.close()
        self.toolbar.close()
        self.tray.hide()
        self.app.quit()

    def run(self):
        return self.app.exec()


def main():
    print("[Editor Universal] Iniciando...")

    # Single instance lock
    try:
        lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        lock_socket.bind(('127.0.0.1', 47834))
        print("[Editor Universal] Lock obtido (porta 47833)")
    except socket.error:
        print("[Editor Universal] ERRO: Já está em execução! Feche a instância anterior.")
        sys.exit(1)

    try:
        print("[Editor Universal] Criando aplicação...")
        app = EditorUniversalApp()
        print("[Editor Universal] Pronto! Use Ctrl+Num1 para desenhar, Ctrl+Num3 para texto.")
        print("[Editor Universal] Ctrl+Num0 para fechar.")
        sys.exit(app.run())
    except Exception as e:
        logging.error(f"Erro fatal: {e}\n{traceback.format_exc()}")
        print(f"[Editor Universal] Erro fatal: {e}")
        print(f"Verifique o arquivo error.log para detalhes.")
        raise


if __name__ == '__main__':
    main()
