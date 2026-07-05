import { useEffect, useMemo, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { ask } from '@tauri-apps/plugin-dialog';
import {
  getAllPostIts,
  getTrashedPostIts,
  restorePostIt,
  deletePostItForever,
  emptyTrash,
  purgeOldTrash,
  TRASH_RETENTION_DAYS,
} from '../lib/database';
import { focusPostItWindow, spawnNewPostIt } from '../lib/windows';
import { PostIt } from '../types/postit';

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || '').replace(/\s+/g, ' ').trim();
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface NoteRowProps {
  postit: PostIt;
  text: string;
  onClick?: () => void;
  actions?: React.ReactNode;
}

function NoteRow({ postit, text, onClick, actions }: NoteRowProps) {
  const body = (
    <>
      <span className="hub-swatch" style={{ background: postit.bg_color }} />
      <span className="hub-note-text">
        <span className="hub-note-title">{postit.title || 'Untitled'}</span>
        <span className="hub-note-snippet">{text.slice(0, 80) || 'Empty note'}</span>
      </span>
    </>
  );
  if (onClick) {
    return (
      <button className="hub-note" onClick={onClick}>
        {body}
        <span className="hub-note-date">{formatDate(postit.updated_at)}</span>
      </button>
    );
  }
  return (
    <div className="hub-note hub-note-trashed">
      {body}
      <span className="hub-trash-actions">{actions}</span>
    </div>
  );
}

/* "Notes & Trash" window: search across all notes, bring any note
 * to front, and restore or permanently delete trashed notes. */
export default function HubView() {
  const [notes, setNotes] = useState<PostIt[]>([]);
  const [trash, setTrash] = useState<PostIt[]>([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    // Opportunistic purge so retention also applies while the app
    // stays resident in the tray for weeks without a restart
    await purgeOldTrash().catch(() => {});
    const [n, t] = await Promise.all([getAllPostIts(), getTrashedPostIts()]);
    setNotes(n);
    setTrash(t);
  };

  useEffect(() => {
    load();
    // Refresh whenever the window regains focus
    const win = getCurrentWebviewWindow();
    const unlisten = win.onFocusChanged(({ payload: focused }) => {
      if (focused) load();
    });
    return () => { unlisten.then(fn => fn()); };
  }, []);

  // Strip each note's HTML once per load, not per keystroke
  const noteTexts = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of [...notes, ...trash]) map.set(p.id, stripHtml(p.content));
    return map;
  }, [notes, trash]);

  const q = query.toLowerCase();
  const matches = (p: PostIt) =>
    !q || p.title.toLowerCase().includes(q) || (noteTexts.get(p.id) || '').toLowerCase().includes(q);

  const filteredNotes = notes.filter(matches);
  const filteredTrash = trash.filter(matches);

  const handleNew = async () => {
    await spawnNewPostIt();
    await load();
  };

  const handleRestore = async (p: PostIt) => {
    await restorePostIt(p.id);
    await focusPostItWindow(p);
    await load();
  };

  const handleDeleteForever = async (p: PostIt) => {
    const confirmed = await ask(
      `"${p.title || 'Untitled'}" will be permanently deleted. This cannot be undone.`,
      { title: 'Delete forever', kind: 'warning', okLabel: 'Delete', cancelLabel: 'Cancel' }
    );
    if (!confirmed) return;
    await deletePostItForever(p.id);
    await load();
  };

  const handleEmptyTrash = async () => {
    const confirmed = await ask(
      `All ${trash.length} notes in the trash will be permanently deleted.`,
      { title: 'Empty trash', kind: 'warning', okLabel: 'Empty trash', cancelLabel: 'Cancel' }
    );
    if (!confirmed) return;
    await emptyTrash();
    await load();
  };

  return (
    <div className="hub">
      <div className="hub-header">
        <input
          className="hub-search"
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button className="hub-new-btn" onClick={handleNew} title="New note">+ New</button>
      </div>

      <div className="hub-body">
        <div className="hub-section-title">
          Notes <span className="hub-count">{filteredNotes.length}</span>
        </div>
        {filteredNotes.length === 0 && (
          <div className="hub-empty">{query ? 'No notes match your search.' : 'No notes yet — create one!'}</div>
        )}
        {filteredNotes.map((p) => (
          <NoteRow
            key={p.id}
            postit={p}
            text={noteTexts.get(p.id) || ''}
            onClick={() => focusPostItWindow(p)}
          />
        ))}

        {trash.length > 0 && (
          <>
            <div className="hub-section-title hub-trash-title">
              Trash <span className="hub-count">{filteredTrash.length}</span>
              <button className="hub-empty-trash" onClick={handleEmptyTrash}>Empty trash</button>
            </div>
            <div className="hub-trash-hint">
              Notes in the trash are deleted after {TRASH_RETENTION_DAYS} days.
            </div>
            {filteredTrash.map((p) => (
              <NoteRow
                key={p.id}
                postit={p}
                text={noteTexts.get(p.id) || ''}
                actions={
                  <>
                    <button className="hub-action" onClick={() => handleRestore(p)} title="Restore">Restore</button>
                    <button className="hub-action hub-action-danger" onClick={() => handleDeleteForever(p)} title="Delete forever">Delete</button>
                  </>
                }
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
