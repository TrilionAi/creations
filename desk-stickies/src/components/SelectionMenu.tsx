import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Editor } from '@tiptap/react';
import { hsvToHex, hexToHsv } from '../lib/colors';

interface Props {
  editor: Editor | null;
}

const FONT_SIZES = ['10px', '12px', '13.5px', '16px', '20px', '24px', '32px'];
const DEFAULT_SIZE = '13.5px';

const QUICK_COLORS = [
  '#2c2c2c', '#d63031', '#e17055', '#fdcb6e',
  '#00b894', '#0984e3', '#6c5ce7', '#e84393',
];

/* ===== Text Color Picker (dropdown inside the bubble) ===== */
function TextColorPicker({ editor }: { editor: Editor }) {
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

  useEffect(() => {
    const newHex = currentColor.slice(1);
    if (newHex.toLowerCase() !== hexInput.toLowerCase()) {
      setHexInput(newHex);
    }
  }, [currentColor]);

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
    // A toggle-section title may be the active target instead of a text selection
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

/* ===== Floating Selection Menu =====
 * Notion-style bubble with two modes:
 *  - 'selection': full formatting row, anchored above the text selection
 *  - 'title': color picker only, anchored above a focused toggle-section
 *    title input (the only formatting a toggle title supports)
 * Buttons use onMouseDown preventDefault so the editor keeps its selection.
 */
type MenuMode = 'selection' | 'title' | null;

const MENU_MARGIN = 6;
const TITLEBAR_CLEARANCE = 48;

function focusedToggleTitle(): HTMLElement | null {
  const el = document.activeElement;
  return el instanceof HTMLElement && el.classList.contains('toggle-title-input') ? el : null;
}

export default function SelectionMenu({ editor }: Props) {
  const [mode, setMode] = useState<MenuMode>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  const positionAt = useCallback((anchor: { left: number; right: number; top: number; bottom: number }) => {
    const menuW = menuRef.current?.offsetWidth || 250;
    const menuH = menuRef.current?.offsetHeight || 34;

    let left = (anchor.left + anchor.right) / 2 - menuW / 2;
    left = Math.max(MENU_MARGIN, Math.min(left, window.innerWidth - menuW - MENU_MARGIN));

    let top = anchor.top - menuH - 8;
    if (top < TITLEBAR_CLEARANCE) {
      top = anchor.bottom + 8;
    }
    top = Math.max(MENU_MARGIN, Math.min(top, window.innerHeight - menuH - MENU_MARGIN));

    setPos({ left, top });
  }, []);

  const update = useCallback(() => {
    if (!editor) return;

    const titleInput = focusedToggleTitle();
    if (titleInput) {
      setTick(t => t + 1);
      positionAt(titleInput.getBoundingClientRect());
      setMode('title');
      return;
    }

    const { from, to, empty } = editor.state.selection;
    if (empty) {
      setMode(null);
      return;
    }
    setTick(t => t + 1);
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to, -1);
    positionAt({
      left: start.left,
      right: end.right,
      top: Math.min(start.top, end.top),
      bottom: Math.max(start.bottom, end.bottom),
    });
    setMode('selection');
  }, [editor, positionAt]);

  useEffect(() => {
    if (!editor) return;

    const hideOnBlur = ({ event }: { event: FocusEvent }) => {
      // Keep the bubble when focus moves into it (e.g. hex input)
      // or onto a toggle title (focusin will switch to 'title' mode)
      const next = event.relatedTarget as HTMLElement | null;
      if (next && (menuRef.current?.contains(next) || next.classList?.contains('toggle-title-input'))) return;
      setMode(null);
    };

    // Clicking anywhere outside the menu, the editor text, and toggle
    // titles dismisses the bubble — this covers targets that never fire
    // editor events (title bar, note background, other UI)
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (menuRef.current?.contains(t)) return;
      if (t.classList?.contains('toggle-title-input')) return;
      if (editor.view.dom.contains(t)) return;
      setMode(null);
    };

    editor.on('transaction', update);
    editor.on('blur', hideOnBlur);
    document.addEventListener('focusin', update);
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      editor.off('transaction', update);
      editor.off('blur', hideOnBlur);
      document.removeEventListener('focusin', update);
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [editor, update]);

  // Re-clamp once real menu dimensions are known
  useLayoutEffect(() => {
    if (mode) update();
  }, [mode]);

  if (!editor || !mode) return null;

  const btn = (
    label: React.ReactNode,
    title: string,
    action: () => void,
    active = false,
    extraClass = ''
  ) => (
    <button
      className={`format-btn ${extraClass} ${active ? 'is-active' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={action}
      title={title}
    >
      {label}
    </button>
  );

  const changeFontSize = (dir: 1 | -1) => {
    const num = parseFloat(editor.getAttributes('textStyle').fontSize || DEFAULT_SIZE);
    const next = dir === 1
      ? FONT_SIZES.find(s => parseFloat(s) > num)
      : [...FONT_SIZES].reverse().find(s => parseFloat(s) < num);
    if (next) editor.chain().focus().setFontSize(next).run();
  };

  return (
    <div
      className="selection-menu"
      ref={menuRef}
      style={{ left: pos.left, top: pos.top }}
      onMouseDown={(e) => {
        // Don't steal focus unless the target needs it (hex input)
        if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault();
      }}
    >
      {mode === 'selection' && (
        <>
          {btn(<strong>B</strong>, 'Bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
          {btn(<em>I</em>, 'Italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
          {btn(<u>U</u>, 'Underline', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
          {btn(<s>S</s>, 'Strikethrough', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
          {btn('H', 'Highlight', () => editor.chain().focus().toggleHighlight().run(), editor.isActive('highlight'))}
        </>
      )}
      <TextColorPicker editor={editor} />
      {mode === 'selection' && (
        <>
          {btn('A-', 'Decrease font size', () => changeFontSize(-1), false, 'font-size-btn')}
          {btn('A+', 'Increase font size', () => changeFontSize(1), false, 'font-size-btn')}
          {btn('</>', 'Inline code', () => editor.chain().focus().toggleCode().run(), editor.isActive('code'))}
        </>
      )}
    </div>
  );
}
