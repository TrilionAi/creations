import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getAllPostIts, purgeOldTrash } from '../lib/database';
import { openPostItWindow, spawnNewPostIt } from '../lib/windows';

export default function ManagerView() {
  useEffect(() => {
    // Restore existing post-its on startup — windows are created in
    // parallel so a large number of notes doesn't slow down boot, and
    // one failed window doesn't block the others
    const restorePostIts = async () => {
      const postits = await getAllPostIts();
      const results = await Promise.allSettled(postits.map(openPostItWindow));
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Failed to restore post-it ${postits[i].id}:`, r.reason);
        }
      });
    };

    restorePostIts()
      .catch((e) => console.error('Failed to restore post-its:', e))
      .finally(() => {
        purgeOldTrash().catch(() => {});
      });

    // Listen for tray "new postit" event
    const unlisten = listen('create-new-postit', () => {
      spawnNewPostIt().catch((e) => console.error('Failed to create post-it:', e));
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  return null; // Hidden window, no UI
}
