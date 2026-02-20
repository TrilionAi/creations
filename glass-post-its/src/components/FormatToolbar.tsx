import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
}

const PRESET_COLORS = [
  { color: '#ffffff', label: 'White' },
  { color: '#ff6b6b', label: 'Red' },
  { color: '#ffa94d', label: 'Orange' },
  { color: '#ffd43b', label: 'Yellow' },
  { color: '#69db7c', label: 'Green' },
  { color: '#74c0fc', label: 'Blue' },
  { color: '#b197fc', label: 'Purple' },
  { color: '#f783ac', label: 'Pink' },
  { color: '#adb5bd', label: 'Gray' },
];

function ColorPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const currentColor = editor.getAttributes('textStyle').color || '#ffffff';

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const applyColor = (color: string) => {
    if (color === '#ffffff') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setOpen(false);
  };

  const handleHexSubmit = () => {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    if (/^#[0-9a-fA-F]{3,8}$/.test(normalized)) {
      applyColor(normalized);
      setHex('');
    }
  };

  return (
    <div className="color-picker-wrapper" ref={ref}>
      <button
        className="format-btn color-picker-btn"
        onClick={() => setOpen(!open)}
        title="Text color"
      >
        <span className="color-picker-icon">A</span>
        <span
          className="color-picker-bar"
          style={{ background: currentColor }}
        />
      </button>
      {open && (
        <div className="color-picker-dropdown">
          <div className="color-picker-grid">
            {PRESET_COLORS.map(({ color, label }) => (
              <button
                key={color}
                className={`color-picker-swatch ${currentColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => applyColor(color)}
                title={label}
              />
            ))}
          </div>
          <div className="color-picker-hex">
            <span className="color-picker-hash">#</span>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6))}
              onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
              placeholder="hex"
              maxLength={6}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormatToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="format-toolbar">
      <button
        className={`format-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        className={`format-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        className={`format-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <u>U</u>
      </button>
      <button
        className={`format-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        className={`format-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Highlight"
      >
        H
      </button>
      <ColorPicker editor={editor} />
      <span className="format-separator" />
      <button
        className={`format-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        {'\u2022'}
      </button>
      <button
        className={`format-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
      >
        1.
      </button>
      <button
        className={`format-btn ${editor.isActive('taskList') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="Checklist"
      >
        {'\u2610'}
      </button>
      <button
        className="format-btn"
        onClick={() => {
          editor.chain().focus()
            .insertContent({
              type: 'toggleBlock',
              attrs: { open: false, title: '' },
              content: [
                { type: 'paragraph' },
              ]
            })
            .run();
        }}
        title="Toggle (collapsible section)"
      >
        {'\u25B6'}
      </button>
      <span className="format-separator" />
      <button
        className={`format-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        H1
      </button>
      <button
        className={`format-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </button>
      <button
        className={`format-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        {'\u201C'}
      </button>
      <button
        className={`format-btn ${editor.isActive('code') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        {'</>'}
      </button>
    </div>
  );
}
