import type { Belt, ProgressState } from "../types";
import { isStripeUnlocked } from "../engine/progress";
import { BeltStrip } from "../components/BeltStrip";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLocale } from "../i18n/LocaleContext";
import { UI_STRINGS } from "../i18n/ui";
import styles from "./MapScreen.module.css";

interface MapScreenProps {
  belts: Belt[];
  progress: ProgressState;
  onSelectStripe: (stripeId: string) => void;
}

export function MapScreen({ belts, progress, onSelectStripe }: MapScreenProps) {
  const { locale } = useLocale();
  const t = UI_STRINGS[locale];

  return (
    <div className={styles.page}>
      <div className={styles.langRow}>
        <LanguageSwitcher />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>
          Math <span>Dojo</span>
        </h1>
        <p className={styles.subtitle}>{t.tagline}</p>
      </header>

      <div className={styles.beltList}>
        {belts.map((belt, i) => (
          <div key={belt.id} className={styles.card} style={{ animationDelay: `${i * 60}ms` }}>
            <div className={styles.cardHead}>
              <span className={styles.beltName}>{belt.name[locale]}</span>
              <span className={styles.operation}>{belt.operationLabel[locale]}</span>
            </div>

            <BeltStrip belt={belt} progress={progress} />

            <p className={styles.tagline}>{belt.tagline[locale]}</p>

            {belt.locked ? (
              <span className={styles.comingSoon}>🔒 {t.comingSoon}</span>
            ) : (
              <div className={styles.stripeRow}>
                {belt.stripes.map((stripe) => {
                  const unlocked = isStripeUnlocked(stripe, belts, progress);
                  const passed = progress.stripeResults[stripe.id]?.passed ?? false;
                  return (
                    <button
                      key={stripe.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onSelectStripe(stripe.id)}
                      className={[
                        styles.stripeBtn,
                        passed ? styles.stripePassed : "",
                        unlocked && !passed ? styles.stripeCurrent : "",
                      ].join(" ")}
                    >
                      {passed ? "✓" : unlocked ? "" : "🔒"} {stripe.index}. {stripe.title[locale]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
