import type { Belt, ProgressState } from "../types";
import styles from "./BeltStrip.module.css";

interface BeltStripProps {
  belt: Belt;
  progress: ProgressState;
}

const PIP_WIDTH = 4;
const PIP_GAP = 3;
const TIP_PADDING = 20;
const TIP_MIN_WIDTH = 56;

export function BeltStrip({ belt, progress }: BeltStripProps) {
  const totalStripes = belt.locked ? 4 : belt.stripes.length;
  const passedCount = belt.stripes.filter((s) => progress.stripeResults[s.id]?.passed).length;
  const tipWidth = Math.max(
    TIP_MIN_WIDTH,
    totalStripes * PIP_WIDTH + Math.max(0, totalStripes - 1) * PIP_GAP + TIP_PADDING,
  );

  return (
    <div
      className={[styles.strip, belt.locked ? styles.locked : ""].join(" ")}
      style={{
        ["--belt-fill" as string]: `var(${belt.colorVar})`,
        ["--tip-width" as string]: `${tipWidth}px`,
      }}
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
