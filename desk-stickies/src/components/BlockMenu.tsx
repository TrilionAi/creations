import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
}

/* "+" menu in the title bar: inserts/toggles block-level content
 * at the current cursor position (Notion-style block picker). */
export default function BlockMenu({ editor }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!editor) return null;

  const items: { icon: string; label: string; action: () => void }[] = [
    { icon: '☐', label: 'Checklist', action: () => editor.chain().focus().toggleTaskList().run() },
    { icon: '•', label: 'Bullet list', action: () => editor.chain().focus().toggleBulletList().run() },
    { icon: '1.', label: 'Numbered list', action: () => editor.chain().focus().toggleOrderedList().run() },
    {
      icon: '▶', label: 'Toggle section', action: () => {
        editor.chain().focus()
          .insertContent({
            type: 'toggleBlock',
            attrs: { open: false, title: '' },
            content: [{ type: 'paragraph' }],
          })
          .run();
      },
    },
    { icon: 'H1', label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: 'H2', label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: '“', label: 'Quote', action: () => editor.chain().focus().toggleBlockquote().run() },
    { icon: '</>', label: 'Code block', action: () => editor.chain().focus().toggleCodeBlock().run() },
  ];

  return (
    <div className="block-menu" ref={wrapperRef}>
      <button
        className={`titlebar-btn ${open ? 'pinned' : ''}`}
        onClick={() => setOpen(!open)}
        title="Insert block"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z"/>
        </svg>
      </button>
      {open && (
        <div className="block-menu-dropdown">
          {items.map((item) => (
            <button
              key={item.label}
              className="block-menu-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                item.action();
                setOpen(false);
              }}
            >
              <span className="block-menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
