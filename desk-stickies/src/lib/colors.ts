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

export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}
