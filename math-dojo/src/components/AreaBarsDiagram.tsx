import styles from "./AreaBarsDiagram.module.css";

interface AreaBarsDiagramProps {
  heights: number[];
}

/** A row of thin rectangles, one per unit of width — a Riemann sum: adding up
 * each bar's area (height × 1) approximates the area under a curve. */
export function AreaBarsDiagram({ heights }: AreaBarsDiagramProps) {
  const max = Math.max(...heights);
  return (
    <div className={styles.wrap} role="img" aria-label={`bars with heights ${heights.join(", ")}`}>
      {heights.map((h, i) => (
        <div key={i} className={styles.column}>
          <span className={styles.bar} style={{ height: `${(h / max) * 100}%` }} />
          <span className={styles.label}>{h}</span>
        </div>
      ))}
    </div>
  );
}
