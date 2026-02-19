import { Priority } from '../types/postit';
import { PRIORITIES } from '../lib/colors';

interface Props {
  current: Priority;
  onChange: (priority: Priority) => void;
}

export default function PriorityPicker({ current, onChange }: Props) {
  return (
    <div className="priority-picker">
      {PRIORITIES.map((p) => (
        <button
          key={p}
          className={`priority-dot dot-${p} ${current === p ? 'active' : ''}`}
          onClick={() => onChange(p)}
          title={p.charAt(0).toUpperCase() + p.slice(1)}
        />
      ))}
    </div>
  );
}
