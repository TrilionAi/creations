export interface PostIt {
  id: string;
  title: string;
  content: string;
  priority: Priority;
  skin: string;
  bg_color: string; // hex color for paper background
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  is_pinned: number; // SQLite stores as 0/1
  opacity: number; // paper background opacity, 0.3–1
  deleted_at: string | null; // set when the note is in the trash
  created_at: string;
  updated_at: string;
}

export type Priority = 'glass' | 'red' | 'orange' | 'yellow' | 'green';

export interface Task {
  id: string;
  postit_id: string;
  text: string;
  is_checked: number;
  sort_order: number;
}

export interface SubTask {
  id: string;
  task_id: string;
  text: string;
  is_checked: number;
  sort_order: number;
}
