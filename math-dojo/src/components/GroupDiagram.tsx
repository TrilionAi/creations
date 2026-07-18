import styles from "./GroupDiagram.module.css";

interface GroupDiagramProps {
  groups: number;
  perGroup: number;
}

export function GroupDiagram({ groups, perGroup }: GroupDiagramProps) {
  return (
    <div className={styles.wrap} role="img" aria-label={`${groups} groups of ${perGroup}`}>
      {Array.from({ length: groups }).map((_, g) => (
        <div key={g} className={styles.group}>
          {Array.from({ length: perGroup }).map((_, d) => (
            <span key={d} className={styles.dot} />
          ))}
        </div>
      ))}
    </div>
  );
}
