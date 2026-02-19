export interface PostIt {
  id: string;
  title: string;
  content: string;
  priority: Priority;
  skin: string;
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  is_pinned: number; // SQLite stores as 0/1
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
