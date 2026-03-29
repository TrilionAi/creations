import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { getAllPostIts, createPostIt } from '../lib/database';
import { PostIt } from '../types/postit';

function generateId(): string {
  return crypto.randomUUID();
}

export default function ManagerView() {
  useEffect(() => {
    // Restore existing post-its on startup
    const restorePostIts = async () => {
      const postits = await getAllPostIts();
      for (const p of postits) {
        await invoke('create_postit_window', {
          id: p.id,
          posX: p.pos_x,
          posY: p.pos_y,
          width: p.width,
          height: p.height,
          priority: p.priority,
        });
      }
    };

    restorePostIts();

    // Listen for tray "new postit" event
    const unlisten = listen('create-new-postit', async () => {
      const id = generateId();
      const now = new Date().toISOString();
      const newPostIt: PostIt = {
        id,
        title: '',
        content: '',
        priority: 'glass',
        skin: 'glass',
        bg_color: '#FDFD96',
        pos_x: 100 + Math.random() * 200,
        pos_y: 100 + Math.random() * 200,
        width: 320,
        height: 380,
        is_pinned: 0,
        created_at: now,
        updated_at: now,
      };
      await createPostIt(newPostIt);
      await invoke('create_postit_window', {
        id,
        posX: newPostIt.pos_x,
        posY: newPostIt.pos_y,
        width: newPostIt.width,
        height: newPostIt.height,
        priority: newPostIt.priority,
      });
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  return null; // Hidden window, no UI
}
