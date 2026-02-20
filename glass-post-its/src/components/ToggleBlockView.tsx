import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';

export default function ToggleBlockView({ node, updateAttributes }: NodeViewProps) {
  const isOpen = node.attrs.open;

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateAttributes({ open: !isOpen });
  };

  return (
    <NodeViewWrapper className={`toggle-block ${isOpen ? 'is-open' : 'is-closed'}`}>
      <button
        className="toggle-arrow-btn"
        onClick={toggle}
        contentEditable={false}
        title={isOpen ? 'Collapse' : 'Expand'}
      >
        <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor">
          <path d={isOpen ? 'M1 3L5 8L9 3Z' : 'M3 1L8 5L3 9Z'} />
        </svg>
      </button>
      <NodeViewContent className="toggle-body" />
    </NodeViewWrapper>
  );
}
