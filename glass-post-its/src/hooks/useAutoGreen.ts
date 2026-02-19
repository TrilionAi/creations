import { useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Priority } from '../types/postit';

export function useAutoGreen(
  editor: Editor | null,
  currentPriority: Priority,
  onPriorityChange: (priority: Priority) => void
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

      if (totalTasks > 0 && totalTasks === checkedTasks && currentPriority !== 'green') {
        onPriorityChange('green');
      }
    };

    editor.on('update', checkAllTasksDone);
    return () => {
      editor.off('update', checkAllTasksDone);
    };
  }, [editor, currentPriority, onPriorityChange]);
}
