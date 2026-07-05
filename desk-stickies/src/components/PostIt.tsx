import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePostIt } from '../hooks/usePostIt';
import { useAutoGreen } from '../hooks/useAutoGreen';
import TitleBar from './TitleBar';
import Editor from './Editor';
import SelectionMenu from './SelectionMenu';
import BlockMenu from './BlockMenu';
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
import { LogicalSize } from '@tauri-apps/api/dpi';
import { darkenColor, hexToRgba, isLightColor, DEFAULT_BG_COLOR } from '../lib/colors';
import { shadeState, SHADE_HEIGHT } from '../lib/shade';
import { updatePostIt } from '../lib/database';

interface Props {
  id: string;
}

export default function PostItView({ id }: Props) {
  const { postit, updateField, saveNow } = usePostIt(id);
  const [shaded, setShaded] = useState(false);
  const preShadeSize = useRef<{ w: number; h: number } | null>(null);

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

  const handleOpacityChange = useCallback((opacity: number) => {
    updateField('opacity', opacity);
  }, [updateField]);

  useAutoGreen(editor, postit?.bg_color || DEFAULT_BG_COLOR, handleColorChange);

  // Shade mode: roll the window up to just the title bar. If any
  // window call fails, roll the UI state back — a note must never be
  // left with hidden content but a full-size window.
  const handleShadeToggle = useCallback(async () => {
    const win = getCurrentWebviewWindow();
    if (!shadeState.active) {
      try {
        const [size, scale] = await Promise.all([win.innerSize(), win.scaleFactor()]);
        const logical = { w: size.width / scale, h: size.height / scale };
        preShadeSize.current = logical;
        // Persist the real size now — resize events are ignored while shaded
        updatePostIt({ id, width: logical.w, height: logical.h }).catch(() => {});
        await win.setSize(new LogicalSize(logical.w, SHADE_HEIGHT));
        await win.setResizable(false);
        shadeState.active = true;
        setShaded(true);
      } catch (e) {
        console.error('Failed to roll up:', e);
        shadeState.active = false;
        setShaded(false);
        win.setResizable(true).catch(() => {});
      }
    } else {
      try {
        await win.setResizable(true);
        const prev = preShadeSize.current;
        if (prev) {
          await win.setSize(new LogicalSize(prev.w, prev.h));
        }
      } catch (e) {
        console.error('Failed to expand:', e);
      } finally {
        // Always leave shade mode — worst case the user resizes by hand
        shadeState.active = false;
        setShaded(false);
      }
    }
  }, [id]);

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
  const opacity = postit?.opacity ?? 1;
  const light = isLightColor(bgColor);

  const paperVars = useMemo(() => ({
    '--paper-bg': hexToRgba(bgColor, opacity),
    '--paper-border': hexToRgba(darkenColor(bgColor, 0.82), opacity),
    '--paper-alpha': opacity,
    '--paper-text': light ? '#2c2c2c' : '#f0f0f0',
    '--paper-text-secondary': light ? '#555555' : '#cccccc',
    '--paper-text-placeholder': light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)',
    '--paper-toolbar-bg': hexToRgba(darkenColor(bgColor, 0.95), opacity),
    '--paper-btn-hover': light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
    '--paper-btn-active': light ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
    '--paper-separator': light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
    '--paper-accent': light ? '#2563eb' : '#74c0fc',
  } as React.CSSProperties), [bgColor, opacity, light]);

  if (!postit) return null;

  return (
    <div className="postit-container">
      <div className={`paper-surface ${shaded ? 'shaded' : ''}`} style={paperVars}>
        <TitleBar
          id={id}
          title={postit.title}
          isPinned={!!postit.is_pinned}
          isShaded={shaded}
          onTitleChange={(title) => updateField('title', title)}
          onPinToggle={() => updateField('is_pinned', postit.is_pinned ? 0 : 1)}
          onShadeToggle={handleShadeToggle}
          onBeforeClose={saveNow}
        >
          <BlockMenu editor={editor} />
          <PostItColorPicker
            currentColor={bgColor}
            opacity={opacity}
            onChange={handleColorChange}
            onOpacityChange={handleOpacityChange}
          />
        </TitleBar>
        <div className="postit-content">
          <Editor editor={editor} />
        </div>
        {!shaded && <SelectionMenu editor={editor} />}
      </div>
    </div>
  );
}
