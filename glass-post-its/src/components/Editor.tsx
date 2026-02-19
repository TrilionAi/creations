import { EditorContent, Editor as TiptapEditor } from '@tiptap/react';

interface Props {
  editor: TiptapEditor | null;
}

export default function Editor({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
}
