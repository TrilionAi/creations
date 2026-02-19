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
  const handleClose = async () => {
    const win = getCurrentWebviewWindow();
    await win.close();
  };

  const handlePin = async () => {
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
        onClick={(e) => e.stopPropagation()}
      />
      <div className="titlebar-buttons">
        <button
          className={`titlebar-btn ${isPinned ? 'pinned' : ''}`}
          onClick={handlePin}
          title={isPinned ? 'Unpin' : 'Always on top'}
        >
          {isPinned ? '\u29BB' : '\u2299'}
        </button>
        <button className="titlebar-btn close" onClick={handleClose} title="Close">
          {'\u2715'}
        </button>
      </div>
    </div>
  );
}
