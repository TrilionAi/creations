import styles from "./FractionDiagram.module.css";

interface FractionDiagramProps {
  total: number;
  shaded: number;
}

export function FractionDiagram({ total, shaded }: FractionDiagramProps) {
  return (
    <div className={styles.bar} role="img" aria-label={`${shaded} of ${total} parts shaded`}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={[styles.segment, i < shaded ? styles.segmentShaded : ""].join(" ")} />
      ))}
    </div>
  );
}
