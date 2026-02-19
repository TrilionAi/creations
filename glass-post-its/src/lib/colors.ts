import { Priority } from '../types/postit';

export const PRIORITY_COLORS: Record<Priority, { bg: string; border: string; label: string }> = {
  glass: { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)', label: 'Default' },
  red: { bg: 'rgba(255,100,100,0.15)', border: 'rgba(255,100,100,0.4)', label: 'Urgent' },
  orange: { bg: 'rgba(255,180,100,0.15)', border: 'rgba(255,180,100,0.4)', label: 'High' },
  yellow: { bg: 'rgba(255,255,150,0.15)', border: 'rgba(255,255,150,0.4)', label: 'Medium' },
  green: { bg: 'rgba(100,255,150,0.15)', border: 'rgba(100,255,150,0.4)', label: 'Done' },
};

export const PRIORITIES: Priority[] = ['glass', 'red', 'orange', 'yellow', 'green'];
