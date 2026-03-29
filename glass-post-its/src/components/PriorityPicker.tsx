import { useState, useRef, useEffect, useCallback } from 'react';
import { PAPER_PRESETS } from '../lib/colors';

interface Props {
  currentColor: string;
  onChange: (color: string) => void;
}

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

export default function PostItColorPicker({ currentColor, onChange }: Props) {
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
      setOpen(false);
    }
  };

  return (
    <div className="postit-color-picker" ref={wrapperRef}>
      {/* Preset dots */}
      {PAPER_PRESETS.map((color) => (
        <button
          key={color}
          className={`paper-color-dot ${currentColor.toUpperCase() === color.toUpperCase() ? 'active' : ''}`}
          style={{ background: color }}
          onClick={() => handlePreset(color)}
          title={color}
        />
      ))}
      {/* Custom color button */}
      <button
        className={`paper-color-dot custom-dot ${!PAPER_PRESETS.includes(currentColor.toUpperCase()) && !PAPER_PRESETS.includes(currentColor) ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        title="Custom color"
      >
        <span className="custom-dot-icon">+</span>
      </button>

      {open && (
        <div className="paper-cp-dropdown">
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
        </div>
      )}
    </div>
  );
}
