import { useState, useEffect, useRef, useCallback } from 'react';
import { PostIt } from '../types/postit';
import { getPostIt, updatePostIt } from '../lib/database';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { shadeState } from '../lib/shade';

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

  // Track window position/size changes. Payloads are physical pixels
  // but windows are created with logical units, so divide by the scale
  // factor before persisting (otherwise notes grow on HiDPI displays).
  useEffect(() => {
    const win = getCurrentWebviewWindow();

    // Independent debounce timers: dragging a corner emits both moved
    // and resized events, and each must persist its own update
    let moveTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const unlistenMove = win.onMoved((event) => {
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = setTimeout(async () => {
        const scale = await win.scaleFactor();
        const pos = event.payload;
        await updatePostIt({ id, pos_x: pos.x / scale, pos_y: pos.y / scale });
      }, 500);
    });

    const unlistenResize = win.onResized((event) => {
      // Rolled-up height is transient — never persist it as the note size
      if (shadeState.active) return;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(async () => {
        if (shadeState.active) return;
        const scale = await win.scaleFactor();
        const size = event.payload;
        await updatePostIt({ id, width: size.width / scale, height: size.height / scale });
      }, 500);
    });

    return () => {
      if (moveTimer) clearTimeout(moveTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
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
