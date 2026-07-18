import styles from "./NumberLineDiagram.module.css";

interface NumberLineDiagramProps {
  start: number;
  end: number;
}

export function NumberLineDiagram({ start, end }: NumberLineDiagramProps) {
  const forward = end >= start;
  const step = forward ? 1 : -1;
  const count = Math.abs(end - start) + 1;
  const nums = Array.from({ length: count }, (_, i) => start + i * step);

  return (
    <div className={styles.wrap} role="img" aria-label={`counting from ${start} to ${end}`}>
      {nums.map((n, i) => (
        <div key={n} className={styles.stop}>
          {i > 0 && <span className={styles.arrow}>{forward ? "→" : "←"}</span>}
          <span
            className={[styles.bubble, i === 0 ? styles.bubbleStart : "", n === end ? styles.bubbleEnd : ""].join(
              " ",
            )}
          >
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}
