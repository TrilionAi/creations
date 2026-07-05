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
    // Migrations: each ALTER fails silently if the column already exists
    const migrations = [
      `ALTER TABLE postits ADD COLUMN skin TEXT NOT NULL DEFAULT 'glass'`,
      `ALTER TABLE postits ADD COLUMN bg_color TEXT NOT NULL DEFAULT '#FDFD96'`,
      `ALTER TABLE postits ADD COLUMN opacity REAL NOT NULL DEFAULT 1.0`,
      `ALTER TABLE postits ADD COLUMN deleted_at TEXT`,
    ];
    for (const sql of migrations) {
      try {
        await db.execute(sql);
      } catch {
        // Column already exists, ignore
      }
    }
  }
  return db;
}

export async function getAllPostIts(): Promise<PostIt[]> {
  const database = await getDb();
  return await database.select<PostIt[]>(
    'SELECT * FROM postits WHERE deleted_at IS NULL ORDER BY created_at DESC'
  );
}

export async function getTrashedPostIts(): Promise<PostIt[]> {
  const database = await getDb();
  return await database.select<PostIt[]>(
    'SELECT * FROM postits WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'
  );
}

export async function getPostIt(id: string): Promise<PostIt | null> {
  const database = await getDb();
  const results = await database.select<PostIt[]>('SELECT * FROM postits WHERE id = ?', [id]);
  return results.length > 0 ? results[0] : null;
}

export async function createPostIt(postit: PostIt): Promise<void> {
  const database = await getDb();
  await database.execute(
    'INSERT INTO postits (id, title, content, priority, skin, bg_color, opacity, pos_x, pos_y, width, height, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [postit.id, postit.title, postit.content, postit.priority, postit.skin || 'glass', postit.bg_color || '#FDFD96', postit.opacity ?? 1, postit.pos_x, postit.pos_y, postit.width, postit.height, postit.is_pinned, postit.created_at, postit.updated_at]
  );
}

/** Insert a fresh post-it with default values and return it. */
export async function createNewPostIt(): Promise<PostIt> {
  const now = new Date().toISOString();
  const postit: PostIt = {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    priority: 'glass',
    skin: 'glass',
    bg_color: '#FDFD96',
    opacity: 1,
    deleted_at: null,
    pos_x: 100 + Math.random() * 200,
    pos_y: 100 + Math.random() * 200,
    width: 320,
    height: 380,
    is_pinned: 0,
    created_at: now,
    updated_at: now,
  };
  await createPostIt(postit);
  return postit;
}

export async function updatePostIt(postit: Partial<PostIt> & { id: string }): Promise<void> {
  const database = await getDb();
  const fields: string[] = [];
  const values: unknown[] = [];

  const updatableFields = ['title', 'content', 'priority', 'skin', 'bg_color', 'opacity', 'pos_x', 'pos_y', 'width', 'height', 'is_pinned'] as const;

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

/** Soft delete: move the note to the trash (restorable). */
export async function trashPostIt(id: string): Promise<void> {
  const database = await getDb();
  await database.execute('UPDATE postits SET deleted_at = ? WHERE id = ?', [new Date().toISOString(), id]);
}

export async function restorePostIt(id: string): Promise<void> {
  const database = await getDb();
  await database.execute('UPDATE postits SET deleted_at = NULL WHERE id = ?', [id]);
}

export async function deletePostItForever(id: string): Promise<void> {
  const database = await getDb();
  await database.execute('DELETE FROM postits WHERE id = ?', [id]);
}

export async function emptyTrash(): Promise<void> {
  const database = await getDb();
  await database.execute('DELETE FROM postits WHERE deleted_at IS NOT NULL');
}

/** How long trashed notes are kept before being purged. */
export const TRASH_RETENTION_DAYS = 30;

/** Permanently remove notes that have been in the trash longer than `days`. */
export async function purgeOldTrash(days = TRASH_RETENTION_DAYS): Promise<void> {
  const database = await getDb();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  await database.execute('DELETE FROM postits WHERE deleted_at IS NOT NULL AND deleted_at < ?', [cutoff]);
}

export async function updatePosition(id: string, x: number, y: number, width: number, height: number): Promise<void> {
  const database = await getDb();
  await database.execute(
    'UPDATE postits SET pos_x = ?, pos_y = ?, width = ?, height = ?, updated_at = ? WHERE id = ?',
    [x, y, width, height, new Date().toISOString(), id]
  );
}
