"""
Text Editor - Editor inline de texto + barra de formatação para o overlay
Mixin class para ser usado pelo DrawingOverlay.
"""

from PySide6.QtWidgets import QTextEdit, QPushButton, QSpinBox, QHBoxLayout, QWidget
from PySide6.QtCore import Qt, QPoint, QRect
from PySide6.QtGui import QFont, QColor


class TextEditorMixin:
    """Mixin que adiciona funcionalidade de editor inline de texto ao overlay.
    Requer que a classe host tenha: settings, text_font_size, text_bold, text_italic,
    brush_color, text_annotations, update()"""

    def _init_text_editor_state(self):
        """Inicializa estado do editor inline"""
        self._active_editor = None
        self._active_editor_pos = None
        self._active_format_bar = None
        self._editing_text_index = None
        self._text_dragged = False

    def _handle_text_click(self, pos):
        """Cria editor de texto inline na posição clicada"""
        if self._active_editor:
            self._commit_text_editor()
            return
        self._create_text_editor(pos)

    def _create_text_editor(self, pos, existing_text='', existing_annot=None):
        """Cria o editor QTextEdit inline + mini barra de formatação"""
        font_family = self.settings.get('font_family', 'Segoe UI')

        if existing_annot:
            font_size = existing_annot.get('font_size', self.text_font_size)
            bold = existing_annot.get('bold', False)
            italic = existing_annot.get('italic', False)
            color = existing_annot['color']
        else:
            font_size = self.text_font_size
            bold = self.text_bold
            italic = self.text_italic
            color = QColor(self.brush_color)

        font = QFont(font_family, font_size)
        font.setBold(bold)
        font.setItalic(italic)

        editor = QTextEdit(self)
        editor.setFont(font)
        editor.setTextColor(color)
        if existing_text:
            editor.setPlainText(existing_text)

        editor.move(pos.x(), pos.y())
        editor.setMinimumSize(120, 32)
        editor.resize(220, 36)

        color_hex = color.name()
        editor.setStyleSheet(f"""
            QTextEdit {{
                background-color: rgba(0, 0, 0, 40);
                border: 2px solid rgba(58, 134, 255, 180);
                border-radius: 3px;
                color: {color_hex};
                padding: 2px 4px;
                selection-background-color: rgba(58, 134, 255, 100);
            }}
        """)
        editor.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        editor.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)

        self._active_editor = editor
        self._active_editor_pos = pos

        editor.textChanged.connect(self._auto_resize_editor)
        editor.show()
        editor.setFocus()
        editor.raise_()

        self._create_format_bar(pos, font_size, bold, italic)
        self._auto_resize_editor()

    def _create_format_bar(self, editor_pos, font_size, bold, italic):
        """Cria mini barra de formatação B | I | tamanho"""
        bar = QWidget(self)
        layout = QHBoxLayout(bar)
        layout.setContentsMargins(2, 2, 2, 2)
        layout.setSpacing(3)

        bar.setStyleSheet("""
            QWidget { background: rgba(30, 30, 50, 220); border-radius: 3px; }
            QPushButton {
                background: #333; color: white; border: 1px solid #555;
                border-radius: 2px; font-size: 12px; min-width: 26px; min-height: 22px;
            }
            QPushButton:checked { background: #0f3460; border-color: #3a86ff; }
            QPushButton:hover { background: #444; }
            QSpinBox {
                background: #333; color: white; border: 1px solid #555;
                border-radius: 2px; font-size: 11px; min-width: 50px; min-height: 22px;
            }
            QSpinBox::up-button, QSpinBox::down-button {
                background: #444; border: none; width: 14px;
            }
        """)

        bold_btn = QPushButton("B", bar)
        bold_btn.setCheckable(True)
        bold_btn.setChecked(bold)
        bold_btn.setFont(QFont('Segoe UI', 10, QFont.Weight.Bold))
        bold_btn.clicked.connect(self._toggle_editor_bold)
        layout.addWidget(bold_btn)

        italic_btn = QPushButton("I", bar)
        italic_btn.setCheckable(True)
        italic_btn.setChecked(italic)
        f = QFont('Segoe UI', 10)
        f.setItalic(True)
        italic_btn.setFont(f)
        italic_btn.clicked.connect(self._toggle_editor_italic)
        layout.addWidget(italic_btn)

        size_spin = QSpinBox(bar)
        size_spin.setRange(8, 72)
        size_spin.setValue(font_size)
        size_spin.setSuffix("pt")
        size_spin.valueChanged.connect(self._change_editor_font_size)
        layout.addWidget(size_spin)

        bar_height = 28
        bar.setFixedHeight(bar_height)
        bar.adjustSize()
        bar_w = bar.sizeHint().width()
        bar.move(editor_pos.x(), max(editor_pos.y() - bar_height - 4, 0))
        bar.resize(bar_w, bar_height)
        bar.show()
        bar.raise_()

        self._active_format_bar = bar

    def _toggle_editor_bold(self, checked):
        if not self._active_editor:
            return
        font = self._active_editor.font()
        font.setBold(checked)
        self._active_editor.setFont(font)
        self.text_bold = checked

    def _toggle_editor_italic(self, checked):
        if not self._active_editor:
            return
        font = self._active_editor.font()
        font.setItalic(checked)
        self._active_editor.setFont(font)
        self.text_italic = checked

    def _change_editor_font_size(self, size):
        if not self._active_editor:
            return
        font = self._active_editor.font()
        font.setPointSize(size)
        self._active_editor.setFont(font)
        self.text_font_size = size
        self._auto_resize_editor()

    def _auto_resize_editor(self):
        if not self._active_editor:
            return
        editor = self._active_editor
        doc = editor.document()
        doc.adjustSize()
        new_width = min(int(doc.idealWidth()) + 24, 600)
        new_height = min(int(doc.size().height()) + 12, 400)
        editor.resize(max(new_width, 120), max(new_height, 32))

    def _commit_text_editor(self):
        """Comita o texto do editor inline e cria/atualiza anotação"""
        if not self._active_editor:
            return

        text = self._active_editor.toPlainText().strip()
        font = QFont(self._active_editor.font())
        color = QColor(self._active_editor.textColor())
        bold = font.bold()
        italic = font.italic()
        font_size = font.pointSize()
        editing_idx = self._editing_text_index

        if text:
            if editing_idx is not None and 0 <= editing_idx < len(self.text_annotations):
                annot = self.text_annotations[editing_idx]
                annot['text'] = text
                annot['font'] = font
                annot['color'] = color
                annot['bold'] = bold
                annot['italic'] = italic
                annot['font_size'] = font_size
            else:
                self.text_annotations.append({
                    'pos': QPoint(self._active_editor_pos),
                    'text': text,
                    'font': font,
                    'color': color,
                    'bold': bold,
                    'italic': italic,
                    'font_size': font_size,
                })
                # Registrar na pilha de undo unificada
                if hasattr(self, '_undo_stack'):
                    self._undo_stack.append(('text', len(self.text_annotations) - 1))
        elif editing_idx is not None and 0 <= editing_idx < len(self.text_annotations):
            self.text_annotations.pop(editing_idx)

        self._cleanup_text_editor()
        self.update()

    def _dismiss_text_editor(self):
        self._cleanup_text_editor()

    def _cleanup_text_editor(self):
        if self._active_editor:
            self._active_editor.deleteLater()
            self._active_editor = None
        if self._active_format_bar:
            self._active_format_bar.deleteLater()
            self._active_format_bar = None
        self._active_editor_pos = None
        self._editing_text_index = None
