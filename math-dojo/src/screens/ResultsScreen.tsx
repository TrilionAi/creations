import type { Belt, SessionSummary } from "../types";
import { useLocale } from "../i18n/LocaleContext";
import { UI_STRINGS } from "../i18n/ui";
import styles from "./ResultsScreen.module.css";

interface ResultsScreenProps {
  summary: SessionSummary;
  belts: Belt[];
  onRetry: () => void;
  onContinue: () => void;
}

export function ResultsScreen({ summary, belts, onRetry, onContinue }: ResultsScreenProps) {
  const { locale } = useLocale();
  const t = UI_STRINGS[locale];
  const belt = belts.find((b) => b.id === summary.stripe.beltId);
  const isLastStripeOfBelt = belt ? belt.stripes[belt.stripes.length - 1]?.id === summary.stripe.id : false;
  const beltEarned = summary.passed && isLastStripeOfBelt;

  const accuracyPct = Math.round(summary.accuracy * 100);
  const outcomeClass = summary.passed ? styles.pass : styles.fail;
  const stripeTitle = summary.stripe.title[locale];

  return (
    <div className={styles.page}>
      <div className={styles.badge}>{summary.passed ? "🥋" : "🔁"}</div>
      <h1 className={styles.headline}>{summary.passed ? t.resultsPassHeadline : t.resultsFailHeadline}</h1>
      <p className={styles.sub}>
        {summary.passed ? t.resultsPassSub(stripeTitle) : t.resultsFailSub(stripeTitle)}
      </p>

      <div className={styles.statRow}>
        <div className={[styles.stat, outcomeClass].join(" ")}>
          <div className={styles.statValue}>{accuracyPct}%</div>
          <div className={styles.statLabel}>{t.accuracy}</div>
        </div>
        <div className={[styles.stat, outcomeClass].join(" ")}>
          <div className={styles.statValue}>{summary.avgTimeSec.toFixed(1)}s</div>
          <div className={styles.statLabel}>{t.avgTime}</div>
        </div>
      </div>

      {beltEarned && belt && <div className={styles.beltEarned}>{t.beltEarned(belt.name[locale])}</div>}

      <div className={styles.actions}>
        {summary.passed ? (
          <button type="button" className={styles.primaryBtn} onClick={onContinue}>
            {t.continue}
          </button>
        ) : (
          <>
            <button type="button" className={styles.primaryBtn} onClick={onRetry}>
              {t.tryAgain}
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={onContinue}>
              {t.backToMap}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
