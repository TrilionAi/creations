import { useState } from 'react';
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';

export default function CollapsibleTaskItem({ node, updateAttributes, editor }: NodeViewProps) {
  const [collapsed, setCollapsed] = useState(false);
  const checked = node.attrs.checked;

  // Check if this task item has nested content (subtasks)
  let hasNestedList = false;
  node.content.forEach((child) => {
    if (child.type.name === 'taskList' || child.type.name === 'bulletList' || child.type.name === 'orderedList') {
      hasNestedList = true;
    }
  });

  const toggleChecked = () => {
    updateAttributes({ checked: !checked });
  };

  const toggleCollapsed = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  return (
    <NodeViewWrapper as="li" className={`task-item ${checked ? 'is-checked' : ''} ${collapsed ? 'is-collapsed' : ''}`} data-checked={checked}>
      <div className="task-item-row">
        {hasNestedList && (
          <button
            className={`task-collapse-btn ${collapsed ? 'collapsed' : 'expanded'}`}
            onClick={toggleCollapsed}
            contentEditable={false}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d={collapsed ? 'M3 1L8 5L3 9Z' : 'M1 3L5 8L9 3Z'} />
            </svg>
          </button>
        )}
        {!hasNestedList && <span className="task-collapse-spacer" />}
        <label className="task-checkbox-label" contentEditable={false}>
          <input
            type="checkbox"
            checked={checked}
            onChange={toggleChecked}
          />
        </label>
        <NodeViewContent className="task-item-content" />
      </div>
    </NodeViewWrapper>
  );
}
