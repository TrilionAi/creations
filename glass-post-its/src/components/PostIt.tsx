import { useCallback, useEffect, useMemo } from 'react';
import { usePostIt } from '../hooks/usePostIt';
import { useAutoGreen } from '../hooks/useAutoGreen';
import TitleBar from './TitleBar';
import Editor from './Editor';
import FormatToolbar from './FormatToolbar';
import PostItColorPicker from './PriorityPicker';
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
import { ToggleBlock } from '../extensions/ToggleBlock';
import { FontSize } from '../extensions/FontSize';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { darkenColor, isLightColor, DEFAULT_BG_COLOR } from '../lib/colors';

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
      FontSize,
      ToggleBlock,
    ],
    content: postit?.content || '',
    onUpdate: ({ editor }) => {
      updateField('content', editor.getHTML());
    },
    onFocus: ({ editor }) => {
      if ((editor.storage as Record<string, any>).toggleBlock) {
        (editor.storage as Record<string, any>).toggleBlock.activeTitle = null;
      }
    },
  }, [postit?.id]);

  const handleColorChange = useCallback((color: string) => {
    updateField('bg_color', color);
  }, [updateField]);

  useAutoGreen(editor, postit?.bg_color || DEFAULT_BG_COLOR, handleColorChange);

  // Restore and enforce always-on-top for pinned post-its
  useEffect(() => {
    if (!postit) return;

    const win = getCurrentWebviewWindow();

    if (postit.is_pinned) {
      invoke('set_always_on_top', { id, pinned: true });
    }

    if (!postit.is_pinned) return;

    const unlisten = win.onFocusChanged(({ payload: focused }) => {
      if (!focused) {
        setTimeout(() => {
          invoke('set_always_on_top', { id, pinned: true });
        }, 150);
      }
    });

    return () => { unlisten.then(fn => fn()); };
  }, [id, postit?.is_pinned]);

  const bgColor = postit?.bg_color || DEFAULT_BG_COLOR;
  const light = isLightColor(bgColor);

  const paperVars = useMemo(() => ({
    '--paper-bg': bgColor,
    '--paper-border': darkenColor(bgColor, 0.82),
    '--paper-text': light ? '#2c2c2c' : '#f0f0f0',
    '--paper-text-secondary': light ? '#555555' : '#cccccc',
    '--paper-text-placeholder': light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)',
    '--paper-toolbar-bg': darkenColor(bgColor, 0.95),
    '--paper-btn-hover': light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
    '--paper-btn-active': light ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
    '--paper-separator': light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
    '--paper-accent': light ? '#2563eb' : '#74c0fc',
  } as React.CSSProperties), [bgColor, light]);

  if (!postit) return null;

  return (
    <div className="postit-container">
      <div className="paper-surface" style={paperVars}>
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
            <PostItColorPicker
              currentColor={bgColor}
              onChange={handleColorChange}
            />
          </div>
        </div>
        <div className="postit-content">
          <Editor editor={editor} />
        </div>
      </div>
    </div>
  );
}
