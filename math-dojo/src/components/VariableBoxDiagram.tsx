import styles from "./VariableBoxDiagram.module.css";

interface VariableBoxDiagramProps {
  xValue: number;
  units: number;
}

/** A labeled "x" box (revealed to hold `xValue`) beside `units` loose unit squares —
 * concretely shows that a variable is just a box that holds a number, same idea as
 * algebra tiles. Used on Algebra's opening stripe. */
export function VariableBoxDiagram({ xValue, units }: VariableBoxDiagramProps) {
  return (
    <div className={styles.wrap} role="img" aria-label={`x equals ${xValue}, plus ${units} more`}>
      <div className={styles.box}>
        <span className={styles.boxLabel}>x</span>
        <span className={styles.boxValue}>= {xValue}</span>
      </div>
      {units > 0 && (
        <>
          <span className={styles.plus}>+</span>
          <div className={styles.units}>
            {Array.from({ length: units }).map((_, i) => (
              <span key={i} className={styles.unit} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
