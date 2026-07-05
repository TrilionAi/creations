import { Priority } from '../types/postit';

export const PRIORITY_COLORS: Record<Priority, { bg: string; border: string; label: string }> = {
  glass: { bg: '#FDFD96', border: '#e8e870', label: 'Default' },
  red: { bg: '#FF9B9B', border: '#e07070', label: 'Urgent' },
  orange: { bg: '#FFCC80', border: '#e0a850', label: 'High' },
  yellow: { bg: '#FDFD96', border: '#e8e870', label: 'Medium' },
  green: { bg: '#A8E6A3', border: '#80c07a', label: 'Done' },
};

export const PRIORITIES: Priority[] = ['glass', 'red', 'orange', 'yellow', 'green'];

export const DEFAULT_BG_COLOR = '#FDFD96';

export const PAPER_PRESETS = [
  '#FDFD96', // yellow (classic)
  '#FFB6C1', // pink
  '#FFCC80', // orange
  '#A8E6A3', // green
  '#A8D8EA', // blue
  '#D7B6FF', // purple
  '#FFCBA4', // peach
  '#FFFFFF', // white
];

export function darkenColor(hex: string, factor: number): string {
  const r = Math.max(0, Math.round(parseInt(hex.slice(1, 3), 16) * factor));
  const g = Math.max(0, Math.round(parseInt(hex.slice(3, 5), 16) * factor));
  const b = Math.max(0, Math.round(parseInt(hex.slice(5, 7), 16) * factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

export function hexToHsv(hex: string): [number, number, number] {
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

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}
