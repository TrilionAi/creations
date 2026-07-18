import styles from "./BalanceScaleDiagram.module.css";

interface BalanceScaleDiagramProps {
  leftUnits: number;
  rightUnits: number;
}

/** A level balance scale — an x-box plus leftUnits sits on one pan, rightUnits
 * on the other. Concretely shows that an equation just means "these two things
 * weigh the same," and solving means figuring out what x must be to keep it level. */
export function BalanceScaleDiagram({ leftUnits, rightUnits }: BalanceScaleDiagramProps) {
  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label={`balanced scale: x plus ${leftUnits} equals ${rightUnits}`}
    >
      <span className={styles.fulcrum} />
      <div className={styles.beamRow}>
        <div className={styles.pan}>
          <span className={styles.xBox}>x</span>
          <div className={styles.units}>
            {Array.from({ length: leftUnits }).map((_, i) => (
              <span key={i} className={styles.unit} />
            ))}
          </div>
        </div>
        <span className={styles.equals}>=</span>
        <div className={styles.pan}>
          <div className={styles.units}>
            {Array.from({ length: rightUnits }).map((_, i) => (
              <span key={i} className={styles.unit} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
