import { invoke } from '@tauri-apps/api/core';
import { PostIt } from '../types/postit';
import { createNewPostIt } from './database';

function windowArgs(p: PostIt) {
  return {
    id: p.id,
    posX: p.pos_x,
    posY: p.pos_y,
    width: p.width,
    height: p.height,
    priority: p.priority,
  };
}

/** Open a window for an existing post-it. */
export async function openPostItWindow(p: PostIt): Promise<void> {
  await invoke('create_postit_window', windowArgs(p));
}

/** Bring a post-it window to the front, recreating it if needed. */
export async function focusPostItWindow(p: PostIt): Promise<void> {
  await invoke('focus_postit_window', windowArgs(p));
}

/** Create a fresh post-it in the database and open its window. */
export async function spawnNewPostIt(): Promise<PostIt> {
  const p = await createNewPostIt();
  await openPostItWindow(p);
  return p;
}
