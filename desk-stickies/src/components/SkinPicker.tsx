import { useState, useRef, useEffect } from 'react';
import { SKIN_LIST } from '../lib/skins';
import { createPortal } from 'react-dom';

interface Props {
  current: string;
  onChange: (skinId: string) => void;
}

export default function SkinPicker({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: Math.max(4, rect.right - 200),
      });
    }
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className="skin-toggle-btn"
        onClick={() => setOpen(!open)}
        title="Change skin"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 0 1 4.9 3H8V2.5zm-1.5.2V5.5H3.1A5.5 5.5 0 0 1 6.5 2.7zM2.5 7H6.5v2.5H3.1A5.5 5.5 0 0 1 2.5 7zm4 4v2.3A5.5 5.5 0 0 1 3.1 11H6.5zm1.5 2.3V11h3.4A5.5 5.5 0 0 1 8 13.3zM13.5 9.5H9.5V7h4A5.5 5.5 0 0 1 13.5 9.5z"/>
        </svg>
      </button>
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="skin-picker-dropdown"
          style={{ top: pos.top, left: pos.left }}
        >
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
                  background: skin.previewBg,
                  borderColor: skin.previewBorder,
                }}
              />
              <span className="skin-info">
                <span className="skin-name">{skin.name}</span>
                <span className="skin-desc">{skin.description}</span>
              </span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
