import type { Belt, ProgressState, Stripe, StripeDegree } from "../types";
import { isStripeUnlocked } from "../engine/progress";
import { computeGrade } from "../engine/grading";
import { BeltStrip } from "../components/BeltStrip";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLocale } from "../i18n/LocaleContext";
import { UI_STRINGS } from "../i18n/ui";
import styles from "./MapScreen.module.css";

interface MapScreenProps {
  belts: Belt[];
  progress: ProgressState;
  onSelectStripe: (stripeId: string) => void;
  onOpenStats: () => void;
}

interface StripeGroup {
  degree: StripeDegree | null;
  stripes: Stripe[];
}

/** Groups consecutive stripes sharing the same `degree` (Black Belt's 6 sub-sections).
 * Belts without degrees just come back as one group with no heading. */
function groupByDegree(stripes: Stripe[]): StripeGroup[] {
  const groups: StripeGroup[] = [];
  for (const stripe of stripes) {
    const last = groups[groups.length - 1];
    if (last && last.degree?.index === stripe.degree?.index) {
      last.stripes.push(stripe);
    } else {
      groups.push({ degree: stripe.degree ?? null, stripes: [stripe] });
    }
  }
  return groups;
}

export function MapScreen({ belts, progress, onSelectStripe, onOpenStats }: MapScreenProps) {
  const { locale } = useLocale();
  const t = UI_STRINGS[locale];

  return (
    <div className={styles.page}>
      <div className={styles.langRow}>
        <button type="button" className={styles.statsBtn} onClick={onOpenStats}>
          🏆 {t.statsNav}
        </button>
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
              <div className={styles.stripeGroups}>
                {groupByDegree(belt.stripes).map((group, gi) => (
                  <div key={gi} className={styles.stripeGroup}>
                    {group.degree && (
                      <div className={styles.degreeHeading}>
                        {t.degreeLabel} {group.degree.index} · {group.degree.name[locale]}
                      </div>
                    )}
                    <div className={styles.stripeRow}>
                      {group.stripes.map((stripe) => {
                        const unlocked = isStripeUnlocked(stripe, belts, progress);
                        const result = progress.stripeResults[stripe.id];
                        const passed = result?.passed ?? false;
                        const grade = computeGrade(stripe, result);
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
                            {grade ? (
                              <span
                                className={[styles.gradeBadge, styles[`grade${grade}`]].join(" ")}
                                title={t.gradeTitle(grade)}
                              >
                                {grade}
                              </span>
                            ) : unlocked ? (
                              ""
                            ) : (
                              "🔒"
                            )}{" "}
                            {stripe.index}. {stripe.title[locale]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
