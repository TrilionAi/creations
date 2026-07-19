import type { Belt, ProgressState } from "../types";
import { computeDayStreak } from "../engine/progress";
import { computeGrade, type Grade } from "../engine/grading";
import { useLocale } from "../i18n/LocaleContext";
import { UI_STRINGS } from "../i18n/ui";
import styles from "./StatsScreen.module.css";

interface StatsScreenProps {
  belts: Belt[];
  progress: ProgressState;
  onBack: () => void;
}

export function StatsScreen({ belts, progress, onBack }: StatsScreenProps) {
  const { locale } = useLocale();
  const t = UI_STRINGS[locale];

  const playableBelts = belts.filter((b) => !b.locked);
  const allStripes = playableBelts.flatMap((b) => b.stripes);
  const totalStripes = allStripes.length;
  const passedStripes = allStripes.filter((s) => progress.stripeResults[s.id]?.passed).length;

  const beltsEarned = playableBelts.filter((b) => {
    const last = b.stripes[b.stripes.length - 1];
    return last && (progress.stripeResults[last.id]?.passed ?? false);
  }).length;

  const dayStreak = computeDayStreak(progress.practiceDays);
  const sessions = Object.values(progress.stripeResults).reduce((sum, r) => sum + r.attempts, 0);

  const gradeCounts: Record<Grade, number> = { S: 0, A: 0, B: 0 };
  for (const stripe of allStripes) {
    const grade = computeGrade(stripe, progress.stripeResults[stripe.id]);
    if (grade) gradeCounts[grade] += 1;
  }

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← {t.backToMap}
      </button>

      <header className={styles.header}>
        <div className={styles.trophy}>🏆</div>
        <h1 className={styles.title}>{t.statsTitle}</h1>
      </header>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {beltsEarned}/{playableBelts.length}
          </div>
          <div className={styles.statLabel}>{t.statBeltsEarned}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {passedStripes}/{totalStripes}
          </div>
          <div className={styles.statLabel}>{t.statStripesMastered}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>🔥 {dayStreak}</div>
          <div className={styles.statLabel}>{t.statDayStreak}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{sessions}</div>
          <div className={styles.statLabel}>{t.statSessions}</div>
        </div>
      </div>

      <div className={styles.gradeRow}>
        <div className={[styles.gradeChip, styles.gradeChipS].join(" ")}>
          <span className={styles.gradeChipLetter}>S</span> {gradeCounts.S}
        </div>
        <div className={[styles.gradeChip, styles.gradeChipA].join(" ")}>
          <span className={styles.gradeChipLetter}>A</span> {gradeCounts.A}
        </div>
        <div className={[styles.gradeChip, styles.gradeChipB].join(" ")}>
          <span className={styles.gradeChipLetter}>B</span> {gradeCounts.B}
        </div>
      </div>
      <p className={styles.gradeHint}>{t.statGradeHint}</p>

      <div className={styles.beltList}>
        {playableBelts.map((belt) => {
          const total = belt.stripes.length;
          const passed = belt.stripes.filter((s) => progress.stripeResults[s.id]?.passed).length;
          const complete = passed === total;
          return (
            <div key={belt.id} className={styles.beltRow}>
              <span className={styles.beltDot} style={{ background: `var(${belt.colorVar})` }} />
              <span className={styles.beltRowName}>{belt.name[locale]}</span>
              <span className={[styles.beltRowCount, complete ? styles.beltRowComplete : ""].join(" ")}>
                {complete ? "✓" : `${passed}/${total}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
