import styles from "./ParabolaDiagram.module.css";

interface ParabolaDiagramProps {
  points: { x: number; y: number }[];
}

/** A handful of plotted points, positioned by their (x, y) values — enough of
 * them trace out the U-shape of a parabola without needing to draw a curve. */
export function ParabolaDiagram({ points }: ParabolaDiagramProps) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return (
    <div className={styles.wrap} role="img" aria-label="a curve shaped like a U, plotted from several points">
      {points.map((p, i) => {
        const leftPct = maxX === minX ? 50 : ((p.x - minX) / (maxX - minX)) * 100;
        const topPct = maxY === minY ? 50 : 100 - ((p.y - minY) / (maxY - minY)) * 100;
        return (
          <span
            key={i}
            className={styles.point}
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
          />
        );
      })}
    </div>
  );
}
