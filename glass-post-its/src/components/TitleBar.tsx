import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

interface Props {
  id: string;
  title: string;
  isPinned: boolean;
  onTitleChange: (title: string) => void;
  onPinToggle: () => void;
}

export default function TitleBar({ id, title, isPinned, onTitleChange, onPinToggle }: Props) {
  const handleClose = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const win = getCurrentWebviewWindow();
      await win.hide(); // Hide instead of close to preserve the window
      await win.close();
    } catch {
      // If close fails, try via Rust command
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
    <div className="titlebar" data-tauri-drag-region>
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
          onMouseDown={handlePin}
          title={isPinned ? 'Unpin' : 'Always on top'}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1-.707.707l-.586-.586-3.535 3.536.293.293a.5.5 0 0 1-.708.707L7.464 7.94l-3.182 3.182L5 14.5a.5.5 0 0 1-.854.354L.854 11.5A.5.5 0 0 1 1.207 10.646L4.536 7.318 2.172 4.954a.5.5 0 0 1 .707-.708l.293.293L6.707 1H3.975a.5.5 0 0 1 0-1h5.853a.5.5 0 0 1 0 .722z"/>
          </svg>
        </button>
        <button
          className="titlebar-btn close"
          onMouseDown={handleClose}
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1.41 0L0 1.41 3.59 5 0 8.59 1.41 10 5 6.41 8.59 10 10 8.59 6.41 5 10 1.41 8.59 0 5 3.59z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
