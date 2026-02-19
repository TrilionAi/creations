import { useState } from 'react';
import { SKIN_LIST } from '../lib/skins';

interface Props {
  current: string;
  onChange: (skinId: string) => void;
}

export default function SkinPicker({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="skin-picker-wrapper">
      <button
        className="skin-toggle-btn"
        onClick={() => setOpen(!open)}
        title="Change skin"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 0 1 4.9 3H8V2.5zm-1.5.2V5.5H3.1A5.5 5.5 0 0 1 6.5 2.7zM2.5 7H6.5v2.5H3.1A5.5 5.5 0 0 1 2.5 7zm4 4v2.3A5.5 5.5 0 0 1 3.1 11H6.5zm1.5 2.3V11h3.4A5.5 5.5 0 0 1 8 13.3zM13.5 9.5H9.5V7h4A5.5 5.5 0 0 1 13.5 9.5z"/>
        </svg>
      </button>
      {open && (
        <div className="skin-picker-dropdown">
          {SKIN_LIST.map((skin) => (
            <button
              key={skin.id}
              className={`skin-option ${current === skin.id ? 'active' : ''}`}
              onClick={() => {
                onChange(skin.id);
                setOpen(false);
              }}
            >
              <span
                className="skin-preview"
                style={{
                  background: skin.gradient || skin.bgTint,
                  borderColor: skin.borderColor,
                }}
              />
              <span className="skin-info">
                <span className="skin-name">{skin.name}</span>
                <span className="skin-desc">{skin.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
