import styles from "./FactorAreaDiagram.module.css";

interface FactorAreaDiagramProps {
  a: number;
  b: number;
}

/** The "box method" for (x + a)(x + b): a 2×2 grid whose four cells are the
 * partial areas x², ax, bx, ab — concretely shows why multiplying two
 * binomials (or factoring a trinomial back into them) works the way it does. */
export function FactorAreaDiagram({ a, b }: FactorAreaDiagramProps) {
  return (
    <div
      className={styles.grid}
      role="img"
      aria-label={`area grid for (x plus ${a}) times (x plus ${b}): x squared, ${a}x, ${b}x, and ${a * b}`}
    >
      <span className={[styles.cell, styles.big].join(" ")}>x²</span>
      <span className={styles.cell}>{a}x</span>
      <span className={styles.cell}>{b}x</span>
      <span className={styles.cell}>{a * b}</span>
    </div>
  );
}
