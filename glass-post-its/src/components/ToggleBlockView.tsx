import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';
import { useRef, useEffect, useCallback } from 'react';
import { TextSelection } from '@tiptap/pm/state';

export default function ToggleBlockView({ node, updateAttributes, editor, getPos }: NodeViewProps) {
  const isOpen = node.attrs.open;
  const title = node.attrs.title ?? '';
  const titleRef = useRef<HTMLInputElement>(null);

  // Auto-focus title input when newly created (empty title + closed)
  useEffect(() => {
    if (!isOpen && title === '' && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 10);
    }
  }, []);

  const focusBody = useCallback(() => {
    const pos = getPos();
    if (typeof pos === 'number') {
      setTimeout(() => {
        try {
          const { state } = editor;
          // pos = before toggleBlock, pos+1 = before first child, pos+2 = inside first child
          const sel = TextSelection.create(state.doc, pos + 2);
          editor.view.dispatch(state.tr.setSelection(sel));
          editor.view.focus();
        } catch {
          // ignore position errors
        }
      }, 50);
    }
  }, [editor, getPos]);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newOpen = !isOpen;
    updateAttributes({ open: newOpen });
    if (!newOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 10);
    }
  }, [isOpen, updateAttributes]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateAttributes({ open: true });
      focusBody();
    } else if (e.key === 'Backspace' && title === '') {
      e.preventDefault();
      const pos = getPos();
      if (typeof pos === 'number') {
        const { state } = editor;
        const tr = state.tr;
        const end = pos + node.nodeSize;
        tr.replaceWith(pos, end, state.schema.nodes.paragraph.create());
        tr.setSelection(TextSelection.create(tr.doc, pos + 1));
        editor.view.dispatch(tr);
        editor.view.focus();
      }
    }
  }, [title, updateAttributes, focusBody, editor, getPos, node]);

  return (
    <NodeViewWrapper className={`toggle-block ${isOpen ? 'is-open' : 'is-closed'}`}>
      <div className="toggle-header" contentEditable={false}>
        <button
          className="toggle-arrow-btn"
          onClick={toggle}
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor">
            <path d={isOpen ? 'M1 3L5 8L9 3Z' : 'M3 1L8 5L3 9Z'} />
          </svg>
        </button>
        <input
          ref={titleRef}
          className="toggle-title-input"
          value={title}
          onChange={(e) => updateAttributes({ title: e.target.value })}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled"
        />
      </div>
      <NodeViewContent className="toggle-body" />
    </NodeViewWrapper>
  );
}
