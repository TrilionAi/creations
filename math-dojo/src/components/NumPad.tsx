import styles from "./NumPad.module.css";

interface NumPadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
}

export function NumPad({ onDigit, onBackspace, onSubmit, submitDisabled }: NumPadProps) {
  return (
    <div className={styles.pad}>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
        <button key={d} type="button" className={styles.key} onClick={() => onDigit(d)}>
          {d}
        </button>
      ))}
      <button type="button" className={[styles.key, styles.wide].join(" ")} onClick={onBackspace}>
        ⌫
      </button>
      <button type="button" className={styles.key} onClick={() => onDigit("0")}>
        0
      </button>
      <button
        type="button"
        className={[styles.key, styles.submit].join(" ")}
        onClick={onSubmit}
        disabled={submitDisabled}
      >
        ✓
      </button>
    </div>
  );
}
