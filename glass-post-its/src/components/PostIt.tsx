import { useCallback, useMemo } from 'react';
import { usePostIt } from '../hooks/usePostIt';
import { useAutoGreen } from '../hooks/useAutoGreen';
import TitleBar from './TitleBar';
import Editor from './Editor';
import FormatToolbar from './FormatToolbar';
import PriorityPicker from './PriorityPicker';
import SkinPicker from './SkinPicker';
import { useEditor, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import CollapsibleTaskItem from './CollapsibleTaskItem';
import { Priority } from '../types/postit';
import { SKINS } from '../lib/skins';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

interface Props {
  id: string;
}

export default function PostItView({ id }: Props) {
  const { postit, updateField } = usePostIt(id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CollapsibleTaskItem);
        },
      }).configure({ nested: true }),
      Underline,
      Placeholder.configure({ placeholder: 'Write something...' }),
      Highlight,
      TextStyle,
      Color,
    ],
    content: postit?.content || '',
    onUpdate: ({ editor }) => {
      updateField('content', editor.getHTML());
    },
  }, [postit?.id]);

  const handlePriorityChange = useCallback(async (priority: Priority) => {
    updateField('priority', priority);
    const win = getCurrentWebviewWindow();
    const windowId = win.label.replace('postit-', '');
    await invoke('update_glass_tint', { id: windowId, priority });
  }, [updateField]);

  const handleSkinChange = useCallback((skinId: string) => {
    updateField('skin', skinId);
  }, [updateField]);

  useAutoGreen(editor, postit?.priority || 'glass', handlePriorityChange);

  // Get skin styles as CSS custom properties
  const skin = SKINS[postit?.skin || 'glass'] || SKINS.glass;
  const skinStyles = useMemo(() => ({
    '--skin-bg': skin.bgTint,
    '--skin-border': skin.borderColor,
    '--skin-glow': skin.glowColor,
    '--skin-text': skin.textColor,
    '--skin-text-secondary': skin.textSecondary,
    '--skin-accent': skin.accentColor,
    '--skin-reflection': String(skin.reflectionOpacity),
  } as React.CSSProperties), [skin]);

  if (!postit) return null;

  const skinClass = postit.skin !== 'glass' ? `skin-${postit.skin}` : '';

  return (
    <div
      className={`glass-surface priority-${postit.priority} ${skinClass}`}
      style={skinStyles}
    >
      <TitleBar
        id={id}
        title={postit.title}
        isPinned={!!postit.is_pinned}
        onTitleChange={(title) => updateField('title', title)}
        onPinToggle={() => updateField('is_pinned', postit.is_pinned ? 0 : 1)}
      />
      <div className="toolbar-row">
        <FormatToolbar editor={editor} />
        <div className="toolbar-right">
          <PriorityPicker
            current={postit.priority}
            onChange={handlePriorityChange}
          />
          <SkinPicker
            current={postit.skin || 'glass'}
            onChange={handleSkinChange}
          />
        </div>
      </div>
      <div className="postit-content">
        <Editor editor={editor} />
      </div>
    </div>
  );
}
