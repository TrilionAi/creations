import styles from "./FunctionMachineDiagram.module.css";

interface FunctionMachineDiagramProps {
  input: number;
  rule: string;
  output: number;
}

/** A "function machine": an input goes in, a rule is applied, an output comes
 * out — the classic concrete picture for what a function actually does. */
export function FunctionMachineDiagram({ input, rule, output }: FunctionMachineDiagramProps) {
  return (
    <div className={styles.wrap} role="img" aria-label={`input ${input}, rule ${rule}, output ${output}`}>
      <span className={styles.box}>{input}</span>
      <span className={styles.arrow}>→</span>
      <span className={styles.machine}>{rule}</span>
      <span className={styles.arrow}>→</span>
      <span className={styles.box}>{output}</span>
    </div>
  );
}
