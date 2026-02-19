import Database from '@tauri-apps/plugin-sql';
import { PostIt } from '../types/postit';

let db: Awaited<ReturnType<typeof Database.load>> | null = null;

export async function getDb() {
  if (!db) {
    db = await Database.load('sqlite:glass-postits.db');
    // Create tables if not exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS postits (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        priority TEXT NOT NULL DEFAULT 'glass',
        skin TEXT NOT NULL DEFAULT 'glass',
        pos_x REAL NOT NULL DEFAULT 100.0,
        pos_y REAL NOT NULL DEFAULT 100.0,
        width REAL NOT NULL DEFAULT 320.0,
        height REAL NOT NULL DEFAULT 380.0,
        is_pinned INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
    // Migration: add skin column if missing (for existing DBs)
    try {
      await db.execute(`ALTER TABLE postits ADD COLUMN skin TEXT NOT NULL DEFAULT 'glass'`);
    } catch {
      // Column already exists, ignore
    }
  }
  return db;
}

export async function getAllPostIts(): Promise<PostIt[]> {
  const database = await getDb();
  return await database.select<PostIt[]>('SELECT * FROM postits ORDER BY created_at DESC');
}

export async function getPostIt(id: string): Promise<PostIt | null> {
  const database = await getDb();
  const results = await database.select<PostIt[]>('SELECT * FROM postits WHERE id = ?', [id]);
  return results.length > 0 ? results[0] : null;
}

export async function createPostIt(postit: PostIt): Promise<void> {
  const database = await getDb();
  await database.execute(
    'INSERT INTO postits (id, title, content, priority, skin, pos_x, pos_y, width, height, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [postit.id, postit.title, postit.content, postit.priority, postit.skin || 'glass', postit.pos_x, postit.pos_y, postit.width, postit.height, postit.is_pinned, postit.created_at, postit.updated_at]
  );
}

export async function updatePostIt(postit: Partial<PostIt> & { id: string }): Promise<void> {
  const database = await getDb();
  const fields: string[] = [];
  const values: unknown[] = [];

  const updatableFields = ['title', 'content', 'priority', 'skin', 'pos_x', 'pos_y', 'width', 'height', 'is_pinned'] as const;

  for (const field of updatableFields) {
    if (postit[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(postit[field]);
    }
  }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(postit.id);

  await database.execute(`UPDATE postits SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deletePostIt(id: string): Promise<void> {
  const database = await getDb();
  await database.execute('DELETE FROM postits WHERE id = ?', [id]);
}

export async function updatePosition(id: string, x: number, y: number, width: number, height: number): Promise<void> {
  const database = await getDb();
  await database.execute(
    'UPDATE postits SET pos_x = ?, pos_y = ?, width = ?, height = ?, updated_at = ? WHERE id = ?',
    [x, y, width, height, new Date().toISOString(), id]
  );
}
