import { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
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
