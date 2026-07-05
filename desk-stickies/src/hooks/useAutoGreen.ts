import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

const AUTO_GREEN = '#A8E6A3';

export function useAutoGreen(
  editor: Editor | null,
  currentBgColor: string,
  onColorChange: (color: string) => void
) {
  useEffect(() => {
    if (!editor) return;

    const checkAllTasksDone = () => {
      const { doc } = editor.state;
      let totalTasks = 0;
      let checkedTasks = 0;

      doc.descendants((node) => {
        if (node.type.name === 'taskItem') {
          totalTasks++;
          if (node.attrs.checked) {
            checkedTasks++;
          }
        }
      });

      if (totalTasks > 0 && totalTasks === checkedTasks && currentBgColor !== AUTO_GREEN) {
        onColorChange(AUTO_GREEN);
      }
    };

    editor.on('update', checkAllTasksDone);
    return () => {
      editor.off('update', checkAllTasksDone);
    };
  }, [editor, currentBgColor, onColorChange]);
}
