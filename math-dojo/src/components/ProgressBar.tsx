import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
