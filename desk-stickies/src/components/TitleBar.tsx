import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { invoke } from '@tauri-apps/api/core';
import { trashPostIt } from '../lib/database';

interface Props {
  id: string;
  title: string;
  isPinned: boolean;
  isShaded: boolean;
  onTitleChange: (title: string) => void;
  onPinToggle: () => void;
  onShadeToggle: () => void;
  onBeforeClose: () => Promise<void>;
  children?: React.ReactNode;
}

export default function TitleBar({ id, title, isPinned, isShaded, onTitleChange, onPinToggle, onShadeToggle, onBeforeClose, children }: Props) {
  const handleClose = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Flush any debounced edits first — the webview is destroyed on
    // close, so pending changes would otherwise be lost forever
    try {
      await onBeforeClose();
    } catch {
      // Still close; the note keeps its last saved state
    }

    // Soft delete: the note goes to the trash and can be restored
    // from the tray menu ("Notes & Trash") for up to 30 days.
    await trashPostIt(id);

    try {
      const win = getCurrentWebviewWindow();
      await win.close();
    } catch {
      await invoke('close_postit_window', { id });
    }
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPinToggle();
    await invoke('set_always_on_top', { id, pinned: !isPinned });
  };

  return (
    <div className={`titlebar ${isShaded ? 'shaded' : ''}`} data-tauri-drag-region>
      <div className="titlebar-left">{children}</div>
      <input
        className="titlebar-title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled"
        style={{
          border: 'none',
          background: 'transparent',
          outline: 'none',
          color: 'inherit',
          font: 'inherit',
          width: '100%',
          cursor: 'text',
        }}
        data-tauri-drag-region="false"
      />
      <div className="titlebar-buttons">
        <button
          className={`titlebar-btn ${isPinned ? 'pinned' : ''}`}
          onClick={handlePin}
          title={isPinned ? 'Unpin' : 'Always on top'}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1-.707.707l-.586-.586-3.535 3.536.293.293a.5.5 0 0 1-.708.707L7.464 7.94l-3.182 3.182L5 14.5a.5.5 0 0 1-.854.354L.854 11.5A.5.5 0 0 1 1.207 10.646L4.536 7.318 2.172 4.954a.5.5 0 0 1 .707-.708l.293.293L6.707 1H3.975a.5.5 0 0 1 0-1h5.853a.5.5 0 0 1 0 .722z"/>
          </svg>
        </button>
        <button
          className={`titlebar-btn ${isShaded ? 'pinned' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShadeToggle(); }}
          title={isShaded ? 'Expand' : 'Roll up to title bar'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ transform: isShaded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          >
            <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
          </svg>
        </button>
        <button
          className="titlebar-btn close"
          onClick={handleClose}
          title="Move to trash"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1.41 0L0 1.41 3.59 5 0 8.59 1.41 10 5 6.41 8.59 10 10 8.59 6.41 5 10 1.41 8.59 0 5 3.59z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
