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
      title: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-title') || '',
        renderHTML: (attributes) => ({ 'data-title': attributes.title || '' }),
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

        const toggleNode = $from.node(toggleDepth);
        const indexInToggle = $from.index(toggleDepth);

        // If in the last child and it's an empty paragraph → exit toggle
        if (indexInToggle === toggleNode.childCount - 1) {
          const lastChild = toggleNode.child(toggleNode.childCount - 1);
          if (lastChild.type.name === 'paragraph' && lastChild.content.size === 0) {
            // Need at least 2 children to remove the last one (content: 'block+')
            if (toggleNode.childCount < 2) return false;

            const tr = state.tr;
            const paraStart = $from.before($from.depth);
            const paraEnd = $from.after($from.depth);
            const deletedSize = paraEnd - paraStart;

            // Delete the empty paragraph
            tr.delete(paraStart, paraEnd);

            // Insert a new paragraph after the toggle
            const newToggleEnd = $from.after(toggleDepth) - deletedSize;
            tr.insert(newToggleEnd, state.schema.nodes.paragraph.create());
            tr.setSelection(TextSelection.create(tr.doc, newToggleEnd + 1));
            view.dispatch(tr);
            return true;
          }
        }

        return false;
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

        // Only in the first child
        const indexInToggle = $from.index(toggleDepth);
        if (indexInToggle !== 0) return false;

        // Only if cursor is at position 0 of the first child
        if ($from.parentOffset !== 0) return false;

        const firstChild = $from.node(toggleDepth).child(0);
        if (firstChild.content.size === 0) {
          // Empty first paragraph + Backspace: exit toggle, replace with paragraph
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
