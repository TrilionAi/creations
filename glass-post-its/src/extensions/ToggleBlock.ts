import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import ToggleBlockView from '../components/ToggleBlockView';

export const ToggleBlock = Node.create({
  name: 'toggleBlock',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: (element) => element.getAttribute('data-open') !== 'false',
        renderHTML: (attributes) => ({ 'data-open': String(attributes.open) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toggleBlock"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'toggleBlock' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ToggleBlockView);
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view } = this.editor;
        const { $from } = state.selection;

        // Find if we're inside a toggleBlock
        let toggleDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'toggleBlock') {
            toggleDepth = d;
            break;
          }
        }

        if (toggleDepth === -1) return false;

        // Only handle Enter in the first child (title) of the toggleBlock
        const indexInToggle = $from.index(toggleDepth);
        if (indexInToggle !== 0) return false;

        const toggleNode = $from.node(toggleDepth);
        const firstChild = toggleNode.child(0);
        const atEnd = $from.parentOffset === firstChild.content.size;

        if (!atEnd) return false;

        const tr = state.tr;

        if (firstChild.content.size === 0) {
          // Empty title: exit toggle mode → replace with plain paragraph
          const toggleStart = $from.before(toggleDepth);
          const toggleEnd = $from.after(toggleDepth);
          tr.replaceWith(toggleStart, toggleEnd, state.schema.nodes.paragraph.create());
          tr.setSelection(TextSelection.create(tr.doc, toggleStart + 1));
          view.dispatch(tr);
          return true;
        }

        // Title has content: create new toggleBlock after current one
        const toggleEnd = $from.after(toggleDepth);
        const newToggle = state.schema.nodes.toggleBlock.create(
          { open: true },
          [
            state.schema.nodes.paragraph.create(),
            state.schema.nodes.paragraph.create(),
          ]
        );
        tr.insert(toggleEnd, newToggle);
        tr.setSelection(TextSelection.create(tr.doc, toggleEnd + 2));
        view.dispatch(tr);
        return true;
      },

      Backspace: () => {
        const { state, view } = this.editor;
        const { $from, empty } = state.selection;

        if (!empty) return false;

        // Find toggleBlock ancestor
        let toggleDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'toggleBlock') {
            toggleDepth = d;
            break;
          }
        }

        if (toggleDepth === -1) return false;

        // Only in the first child (title)
        const indexInToggle = $from.index(toggleDepth);
        if (indexInToggle !== 0) return false;

        // Only if cursor is at position 0 of the title
        if ($from.parentOffset !== 0) return false;

        const firstChild = $from.node(toggleDepth).child(0);
        if (firstChild.content.size === 0) {
          // Empty title + Backspace: exit toggle, replace with paragraph
          const toggleStart = $from.before(toggleDepth);
          const toggleEnd = $from.after(toggleDepth);
          const tr = state.tr;
          tr.replaceWith(toggleStart, toggleEnd, state.schema.nodes.paragraph.create());
          tr.setSelection(TextSelection.create(tr.doc, toggleStart + 1));
          view.dispatch(tr);
          return true;
        }

        return false;
      },
    };
  },
});
