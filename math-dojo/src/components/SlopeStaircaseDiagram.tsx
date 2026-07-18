import styles from "./SlopeStaircaseDiagram.module.css";

interface SlopeStaircaseDiagramProps {
  rise: number;
  run: number;
}

/** A rise-over-run staircase: a vertical stack of `rise` units above a
 * horizontal row of `run` units, sharing a corner — concretely shows slope
 * as "how many steps up, over how many steps across." */
export function SlopeStaircaseDiagram({ rise, run }: SlopeStaircaseDiagramProps) {
  return (
    <div className={styles.wrap} role="img" aria-label={`rise ${rise}, run ${run}`}>
      <div className={styles.riseCol}>
        {Array.from({ length: rise }).map((_, i) => (
          <span key={i} className={styles.unit} />
        ))}
      </div>
      <div className={styles.runRow}>
        {Array.from({ length: run }).map((_, i) => (
          <span key={i} className={styles.unit} />
        ))}
      </div>
    </div>
  );
}
