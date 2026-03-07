"""
Context Menu - Mini menu de contexto para itens selecionados
Suporta single e multi-seleção.
Mudar cor, espessura/tamanho de fonte, excluir.
Mixin class para ser usado pelo DrawingOverlay via HandleSystemMixin.
"""

from PySide6.QtWidgets import QMenu, QColorDialog, QInputDialog
from PySide6.QtCore import Qt
from PySide6.QtGui import QPen, QColor, QFont


MENU_STYLE = """
    QMenu {
        background-color: rgba(25, 25, 38, 245);
        color: #e0e0e0;
        border: 1px solid rgba(66, 140, 255, 60);
        border-radius: 8px;
        padding: 4px 0;
    }
    QMenu::item {
        padding: 8px 24px 8px 16px;
        border-radius: 4px;
        margin: 2px 4px;
    }
    QMenu::item:selected {
        background-color: rgba(66, 140, 255, 100);
    }
    QMenu::separator {
        height: 1px;
        background: rgba(66, 140, 255, 40);
        margin: 4px 10px;
    }
"""


class ContextMenuMixin:
    """Mixin que adiciona context menu para itens selecionados.
    Requer: paths, text_annotations, selected_items, _deselect(), _delete_selected(), update()"""

    def _show_mini_context_menu(self, pos):
        """Menu simplificado: cor + espessura + excluir (single ou multi)"""
        menu = QMenu(self)
        menu.setStyleSheet(MENU_STYLE)

        count = len(self.selected_items)

        if count == 1:
            it, ii = self.selected_items[0]

            color_action = menu.addAction("Mudar Cor")
            color_action.triggered.connect(lambda: self._ctx_change_color(it, ii))

            if it == 'path':
                size_action = menu.addAction("Mudar Espessura")
            else:
                size_action = menu.addAction("Mudar Tamanho da Fonte")
            size_action.triggered.connect(lambda: self._ctx_change_size(it, ii))

            menu.addSeparator()

            delete_action = menu.addAction("Excluir")
            delete_action.triggered.connect(self._delete_selected)

        elif count > 1:
            color_action = menu.addAction(f"Mudar Cor ({count} itens)")
            color_action.triggered.connect(self._ctx_change_color_multi)

            menu.addSeparator()

            delete_action = menu.addAction(f"Excluir ({count} itens)")
            delete_action.triggered.connect(self._delete_selected)

        global_pos = self.mapToGlobal(pos)
        menu.exec(global_pos)

    def _ctx_change_color(self, item_type, item_index):
        if item_type == 'path' and 0 <= item_index < len(self.paths):
            pd = self.paths[item_index]
            current_color = pd['pen'].color()
            new_color = QColorDialog.getColor(current_color, self, "Mudar Cor")
            if new_color.isValid():
                old_pen = pd['pen']
                if pd['type'] == 'highlighter':
                    c = QColor(new_color)
                    c.setAlpha(76)
                    new_pen = QPen(c, old_pen.widthF())
                else:
                    new_pen = QPen(new_color, old_pen.widthF())
                new_pen.setCapStyle(old_pen.capStyle())
                new_pen.setJoinStyle(old_pen.joinStyle())
                pd['pen'] = new_pen
                if pd['type'] == 'filled-rect':
                    pd['fill_color'] = new_color

        elif item_type == 'text' and 0 <= item_index < len(self.text_annotations):
            annot = self.text_annotations[item_index]
            new_color = QColorDialog.getColor(annot['color'], self, "Mudar Cor do Texto")
            if new_color.isValid():
                annot['color'] = new_color
        self.update()

    def _ctx_change_color_multi(self):
        """Muda cor de todos os itens selecionados"""
        new_color = QColorDialog.getColor(QColor('#FF0000'), self, "Mudar Cor")
        if not new_color.isValid():
            return
        for item_type, item_index in self.selected_items:
            try:
                if item_type == 'path' and 0 <= item_index < len(self.paths):
                    pd = self.paths[item_index]
                    old_pen = pd['pen']
                    if pd['type'] == 'highlighter':
                        c = QColor(new_color)
                        c.setAlpha(76)
                        new_pen = QPen(c, old_pen.widthF())
                    else:
                        new_pen = QPen(new_color, old_pen.widthF())
                    new_pen.setCapStyle(old_pen.capStyle())
                    new_pen.setJoinStyle(old_pen.joinStyle())
                    pd['pen'] = new_pen
                    if pd['type'] == 'filled-rect':
                        pd['fill_color'] = new_color
                elif item_type == 'text' and 0 <= item_index < len(self.text_annotations):
                    self.text_annotations[item_index]['color'] = new_color
            except (IndexError, KeyError):
                continue
        self.update()

    def _ctx_change_size(self, item_type, item_index):
        if item_type == 'path' and 0 <= item_index < len(self.paths):
            pd = self.paths[item_index]
            current = int(pd['pen'].widthF())
            value, ok = QInputDialog.getInt(
                self, "Espessura", "Nova espessura:", current, 1, 40, 1
            )
            if ok:
                old_pen = pd['pen']
                new_pen = QPen(old_pen.color(), value)
                new_pen.setCapStyle(old_pen.capStyle())
                new_pen.setJoinStyle(old_pen.joinStyle())
                pd['pen'] = new_pen

        elif item_type == 'text' and 0 <= item_index < len(self.text_annotations):
            annot = self.text_annotations[item_index]
            current = annot.get('font_size', 16)
            value, ok = QInputDialog.getInt(
                self, "Tamanho da Fonte", "Novo tamanho:", current, 8, 72, 1
            )
            if ok:
                annot['font_size'] = value
                font = QFont(annot['font'])
                font.setPointSize(value)
                annot['font'] = font
        self.update()

    def _ctx_delete(self, item_type, item_index):
        if item_type == 'path' and 0 <= item_index < len(self.paths):
            self.paths.pop(item_index)
        elif item_type == 'text' and 0 <= item_index < len(self.text_annotations):
            self.text_annotations.pop(item_index)
        self.update()
