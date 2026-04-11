import { useState, useEffect, useRef, useCallback } from 'react';
import { PostIt } from '../types/postit';
import { getPostIt, updatePostIt } from '../lib/database';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

export function usePostIt(id: string) {
  const [postit, setPostIt] = useState<PostIt | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingChanges = useRef<Partial<PostIt>>({});

  // Load post-it data
  useEffect(() => {
    const load = async () => {
      const data = await getPostIt(id);
      if (data) {
        setPostIt(data);
      }
    };
    load();
  }, [id]);

  // Track window position/size changes
  useEffect(() => {
    const win = getCurrentWebviewWindow();

    // Debounced position save
    let moveTimer: ReturnType<typeof setTimeout> | null = null;

    const unlistenMove = win.onMoved((event) => {
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = setTimeout(async () => {
        const pos = event.payload;
        await updatePostIt({ id, pos_x: pos.x, pos_y: pos.y });
      }, 500);
    });

    const unlistenResize = win.onResized((event) => {
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = setTimeout(async () => {
        const size = event.payload;
        await updatePostIt({ id, width: size.width, height: size.height });
      }, 500);
    });

    return () => {
      if (moveTimer) clearTimeout(moveTimer);
      unlistenMove.then(fn => fn());
      unlistenResize.then(fn => fn());
    };
  }, [id]);

  const saveNow = useCallback(async () => {
    if (Object.keys(pendingChanges.current).length > 0) {
      await updatePostIt({ id, ...pendingChanges.current });
      pendingChanges.current = {};
    }
  }, [id]);

  const updateField = useCallback((field: keyof PostIt, value: PostIt[keyof PostIt]) => {
    setPostIt(prev => prev ? { ...prev, [field]: value } : null);
    (pendingChanges.current as Record<string, unknown>)[field] = value;

    // Debounced save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNow();
    }, 500);
  }, [saveNow]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      // Sync save what we can
      if (Object.keys(pendingChanges.current).length > 0) {
        updatePostIt({ id, ...pendingChanges.current });
      }
    };
  }, [id]);

  return { postit, updateField, saveNow };
}
