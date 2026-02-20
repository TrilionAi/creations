import { useState, useRef, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
}

/* ===== Color conversion helpers ===== */
function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d + 6) % 6 * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

const FONT_SIZES = ['10px', '12px', '13.5px', '16px', '20px', '24px', '32px'];
const DEFAULT_SIZE = '13.5px';

const QUICK_COLORS = [
  '#ffffff', '#ff6b6b', '#ffa94d', '#ffd43b',
  '#69db7c', '#74c0fc', '#b197fc', '#f783ac',
];

/* ===== Color Picker Component ===== */
function ColorPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(0);
  const [val, setVal] = useState(1);
  const [hexInput, setHexInput] = useState('ffffff');
  const [dragging, setDragging] = useState<'gradient' | 'hue' | null>(null);

  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentColorRef = useRef('#ffffff');

  const currentColor = hsvToHex(hue, sat, val);
  currentColorRef.current = currentColor;

  const barColor = editor.getAttributes('textStyle').color || '#ffffff';

  // Sync HSV from editor color when opening
  useEffect(() => {
    if (open) {
      const color = editor.getAttributes('textStyle').color || '#ffffff';
      const [h, s, v] = hexToHsv(color);
      setHue(h);
      setSat(s);
      setVal(v);
      setHexInput(color.slice(1));
    }
  }, [open]);

  // Sync hex input from HSV changes
  useEffect(() => {
    const newHex = currentColor.slice(1);
    if (newHex.toLowerCase() !== hexInput.toLowerCase()) {
      setHexInput(newHex);
    }
  }, [currentColor]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const updateGradient = useCallback((clientX: number, clientY: number) => {
    const rect = gradientRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSat(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)));
    setVal(1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)));
  }, []);

  const updateHue = useCallback((clientX: number) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHue(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 360);
  }, []);

  // Global mouse tracking for drag
  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      e.preventDefault();
      if (dragging === 'gradient') updateGradient(e.clientX, e.clientY);
      else if (dragging === 'hue') updateHue(e.clientX);
    };
    const handleUp = () => {
      setDragging(null);
      applyToEditor(currentColorRef.current);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, updateGradient, updateHue]);

  const applyToEditor = useCallback((color: string) => {
    // Check if a toggle title is active
    const activeTitlePos = (editor.storage as Record<string, any>).toggleBlock?.activeTitle;
    if (typeof activeTitlePos === 'number') {
      const node = editor.state.doc.nodeAt(activeTitlePos);
      if (node?.type.name === 'toggleBlock') {
        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(activeTitlePos, undefined, {
            ...node.attrs,
            titleColor: color,
          })
        );
      }
      return;
    }
    editor.chain().focus().setColor(color).run();
  }, [editor]);

  const handleQuickColor = useCallback((color: string) => {
    const [h, s, v] = hexToHsv(color);
    setHue(h);
    setSat(s);
    setVal(v);
    applyToEditor(color);
    setOpen(false);
  }, [applyToEditor]);

  const handleHexChange = useCallback((value: string) => {
    const clean = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) {
      const [h, s, v] = hexToHsv(`#${clean}`);
      setHue(h);
      setSat(s);
      setVal(v);
    }
  }, []);

  const handleHexSubmit = useCallback(() => {
    if (hexInput.length === 6) {
      applyToEditor(`#${hexInput}`);
    }
  }, [hexInput, applyToEditor]);

  return (
    <div className="cp-wrapper" ref={wrapperRef}>
      <button
        className="format-btn cp-trigger"
        onClick={() => setOpen(!open)}
        title="Text color"
      >
        <span className="cp-icon">A</span>
        <span className="cp-bar" style={{ background: barColor }} />
      </button>
      {open && (
        <div className="cp-dropdown">
          {/* Gradient area: saturation (x) × value (y) */}
          <div
            className="cp-gradient"
            ref={gradientRef}
            style={{ background: `hsl(${hue}, 100%, 50%)` }}
            onMouseDown={(e) => {
              e.preventDefault();
              setDragging('gradient');
              updateGradient(e.clientX, e.clientY);
            }}
          >
            <div className="cp-gradient-white" />
            <div className="cp-gradient-black" />
            <div
              className="cp-handle"
              style={{
                left: `${sat * 100}%`,
                top: `${(1 - val) * 100}%`,
                borderColor: val > 0.5 ? 'white' : '#ccc',
              }}
            />
          </div>

          {/* Hue slider */}
          <div
            className="cp-hue"
            ref={hueRef}
            onMouseDown={(e) => {
              e.preventDefault();
              setDragging('hue');
              updateHue(e.clientX);
            }}
          >
            <div
              className="cp-hue-handle"
              style={{ left: `${(hue / 360) * 100}%` }}
            />
          </div>

          {/* Hex input + preview */}
          <div className="cp-hex-row">
            <div className="cp-preview" style={{ background: currentColor }} />
            <div className="cp-hex-input">
              <span className="cp-hash">#</span>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
                placeholder="ffffff"
                maxLength={6}
              />
            </div>
          </div>

          {/* Quick preset colors */}
          <div className="cp-quick">
            {QUICK_COLORS.map((color) => (
              <button
                key={color}
                className="cp-quick-dot"
                style={{ background: color }}
                onClick={() => handleQuickColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Format Toolbar ===== */
export default function FormatToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="format-toolbar">
      <button
        className={`format-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        className={`format-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        className={`format-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <u>U</u>
      </button>
      <button
        className={`format-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        className={`format-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Highlight"
      >
        H
      </button>
      <ColorPicker editor={editor} />
      <button
        className="format-btn font-size-btn"
        onClick={() => {
          const current = editor.getAttributes('textStyle').fontSize || DEFAULT_SIZE;
          const num = parseFloat(current);
          const idx = FONT_SIZES.findIndex(s => parseFloat(s) >= num);
          const prevIdx = idx <= 0 ? 0 : idx - 1;
          if (parseFloat(FONT_SIZES[prevIdx]) !== num || prevIdx > 0) {
            const newSize = FONT_SIZES[Math.max(0, idx <= 0 ? 0 : prevIdx)];
            editor.chain().focus().setFontSize(newSize).run();
          }
        }}
        title="Decrease font size"
      >
        A-
      </button>
      <button
        className="format-btn font-size-btn"
        onClick={() => {
          const current = editor.getAttributes('textStyle').fontSize || DEFAULT_SIZE;
          const num = parseFloat(current);
          const idx = FONT_SIZES.findIndex(s => parseFloat(s) > num);
          if (idx !== -1) {
            editor.chain().focus().setFontSize(FONT_SIZES[idx]).run();
          }
        }}
        title="Increase font size"
      >
        A+
      </button>
      <span className="format-separator" />
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        {'\u2022'}
      </button>
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
      >
        1.
      </button>
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="Checklist"
      >
        {'\u2610'}
      </button>
      <button
        className="format-btn"
        onClick={() => {
          editor.chain().focus()
            .insertContent({
              type: 'toggleBlock',
              attrs: { open: false, title: '' },
              content: [
                { type: 'paragraph' },
              ]
            })
            .run();
        }}
        title="Toggle (collapsible section)"
      >
        {'\u25B6'}
      </button>
      <span className="format-separator" />
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        H1
      </button>
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </button>
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        {'\u201C'}
      </button>
      <button
        className="format-btn"
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        {'</>'}
      </button>
    </div>
  );
}
