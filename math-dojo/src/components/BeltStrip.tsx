import type { Belt, ProgressState } from "../types";
import styles from "./BeltStrip.module.css";

interface BeltStripProps {
  belt: Belt;
  progress: ProgressState;
}

export function BeltStrip({ belt, progress }: BeltStripProps) {
  const totalStripes = belt.locked ? 4 : belt.stripes.length;
  const passedCount = belt.stripes.filter((s) => progress.stripeResults[s.id]?.passed).length;

  return (
    <div
      className={[styles.strip, belt.locked ? styles.locked : ""].join(" ")}
      style={{ ["--belt-fill" as string]: `var(${belt.colorVar})` }}
      aria-label={`${belt.name}, ${passedCount} of ${totalStripes} stripes earned`}
    >
      <div className={styles.body} />
      <div className={styles.tip}>
        {Array.from({ length: totalStripes }).map((_, i) => (
          <span
            key={i}
            className={[styles.pip, i < passedCount ? styles.pipFilled : ""].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
