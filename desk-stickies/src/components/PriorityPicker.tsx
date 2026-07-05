import { useState, useRef, useEffect, useCallback } from 'react';
import { PAPER_PRESETS, hsvToHex, hexToHsv } from '../lib/colors';

interface Props {
  currentColor: string;
  opacity: number;
  onChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}

/* Palette button in the title bar: paper color presets, free
 * color picker and background opacity, all in one dropdown. */
export default function PostItColorPicker({ currentColor, opacity, onChange, onOpacityChange }: Props) {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(0);
  const [val, setVal] = useState(1);
  const [hexInput, setHexInput] = useState('FDFD96');
  const [dragging, setDragging] = useState<'gradient' | 'hue' | null>(null);

  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentColorRef = useRef(currentColor);

  const pickerColor = hsvToHex(hue, sat, val);
  currentColorRef.current = pickerColor;

  useEffect(() => {
    if (open) {
      const [h, s, v] = hexToHsv(currentColor);
      setHue(h);
      setSat(s);
      setVal(v);
      setHexInput(currentColor.slice(1));
    }
  }, [open]);

  useEffect(() => {
    const newHex = pickerColor.slice(1);
    if (newHex.toLowerCase() !== hexInput.toLowerCase()) {
      setHexInput(newHex);
    }
  }, [pickerColor]);

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
      onChange(currentColorRef.current);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, updateGradient, updateHue, onChange]);

  const handlePreset = (color: string) => {
    const [h, s, v] = hexToHsv(color);
    setHue(h);
    setSat(s);
    setVal(v);
    onChange(color);
  };

  const handleHexChange = (value: string) => {
    const clean = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) {
      const [h, s, v] = hexToHsv(`#${clean}`);
      setHue(h);
      setSat(s);
      setVal(v);
    }
  };

  const handleHexSubmit = () => {
    if (hexInput.length === 6) {
      onChange(`#${hexInput}`);
    }
  };

  return (
    <div className="postit-color-picker" ref={wrapperRef}>
      <button
        className={`titlebar-btn ${open ? 'pinned' : ''}`}
        onClick={() => setOpen(!open)}
        title="Note color & opacity"
      >
        <span className="palette-swatch" style={{ background: currentColor }} />
      </button>

      {open && (
        <div className="paper-cp-dropdown">
          {/* Preset dots */}
          <div className="paper-cp-presets">
            {PAPER_PRESETS.map((color) => (
              <button
                key={color}
                className={`paper-color-dot ${currentColor.toUpperCase() === color.toUpperCase() ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => handlePreset(color)}
                title={color}
              />
            ))}
          </div>

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

          <div className="paper-cp-hex-row">
            <div className="paper-cp-preview" style={{ background: pickerColor }} />
            <div className="paper-cp-hex-input">
              <span className="paper-cp-hash">#</span>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
                placeholder="FDFD96"
                maxLength={6}
              />
            </div>
          </div>

          {/* Background opacity */}
          <div className="paper-cp-opacity">
            <span className="paper-cp-opacity-label">Opacity</span>
            <input
              type="range"
              min={30}
              max={100}
              value={Math.round(opacity * 100)}
              onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            />
            <span className="paper-cp-opacity-value">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
