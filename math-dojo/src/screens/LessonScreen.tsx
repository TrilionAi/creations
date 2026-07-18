import type { Stripe } from "../types";
import { useLocale } from "../i18n/LocaleContext";
import { UI_STRINGS } from "../i18n/ui";
import { GroupDiagram } from "../components/GroupDiagram";
import { NumberLineDiagram } from "../components/NumberLineDiagram";
import { FractionDiagram } from "../components/FractionDiagram";
import { VariableBoxDiagram } from "../components/VariableBoxDiagram";
import { BalanceScaleDiagram } from "../components/BalanceScaleDiagram";
import styles from "./LessonScreen.module.css";

interface LessonScreenProps {
  stripe: Stripe;
  onBack: () => void;
  onStart: () => void;
}

/**
 * Step text can wrap a number in {{...}} to mark it as the "linking" value
 * that carries across steps (a carry, a borrow, a bridge amount) — rendered
 * in a consistent accent color so the eye can track it step to step.
 */
function renderHighlighted(text: string) {
  return text.split(/(\{\{.+?\}\})/g).map((part, i) => {
    const match = part.match(/^\{\{(.+)\}\}$/);
    if (!match) return part;
    return (
      <span key={i} className={styles.linkNum}>
        {match[1]}
      </span>
    );
  });
}

export function LessonScreen({ stripe, onBack, onStart }: LessonScreenProps) {
  const { locale } = useLocale();
  const t = UI_STRINGS[locale];
  const { lesson } = stripe;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← {t.backToMap}
      </button>

      <span className={styles.eyebrow}>
        {t.stripeLabel} {stripe.index} · {stripe.title[locale]}
      </span>
      <h1 className={styles.title}>{stripe.summary[locale]}</h1>

      <div className={styles.card}>
        <p className={styles.intro}>{lesson.intro[locale]}</p>

        <div className={styles.exampleProblem}>
          {lesson.example.isEquation ? (
            <div className={styles.exampleEquation}>
              <div>{lesson.example.prompt}</div>
              <div>
                x = <span className={styles.exampleAnswer}>{lesson.example.answer}</span>
              </div>
            </div>
          ) : (
            <>
              {lesson.example.prompt} ={" "}
              {lesson.example.secondaryFormat === "fraction" ? (
                <span className={styles.exampleFraction}>
                  <span className={styles.exampleAnswer}>{lesson.example.answer}</span>
                  <span className={styles.exampleFractionBar} />
                  <span className={styles.exampleAnswer}>{lesson.example.secondaryAnswer}</span>
                </span>
              ) : lesson.example.secondaryFormat === "decimal" ? (
                <>
                  <span className={styles.exampleAnswer}>{lesson.example.answer}</span>
                  <span className={styles.exampleAnswer}>.</span>
                  <span className={styles.exampleAnswer}>{lesson.example.secondaryAnswer}</span>
                </>
              ) : (
                <>
                  <span className={styles.exampleAnswer}>{lesson.example.answer}</span>
                  {lesson.example.secondaryAnswer !== undefined && (
                    <>
                      {" "}
                      {t.remainderLabel}{" "}
                      <span className={styles.exampleAnswer}>{lesson.example.secondaryAnswer}</span>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {lesson.diagram && (
          <div className={styles.diagramWrap}>
            {lesson.diagram.kind === "groups" && (
              <GroupDiagram groups={lesson.diagram.groups} perGroup={lesson.diagram.perGroup} />
            )}
            {lesson.diagram.kind === "numberLine" && (
              <NumberLineDiagram start={lesson.diagram.start} end={lesson.diagram.end} />
            )}
            {lesson.diagram.kind === "fraction" && (
              <FractionDiagram total={lesson.diagram.total} shaded={lesson.diagram.shaded} />
            )}
            {lesson.diagram.kind === "variableBox" && (
              <VariableBoxDiagram xValue={lesson.diagram.xValue} units={lesson.diagram.units} />
            )}
            {lesson.diagram.kind === "balanceScale" && (
              <BalanceScaleDiagram leftUnits={lesson.diagram.leftUnits} rightUnits={lesson.diagram.rightUnits} />
            )}
          </div>
        )}

        <ol className={styles.steps}>
          {lesson.steps.map((step, i) => (
            <li key={i} className={styles.step} style={{ animationDelay: `${i * 90}ms` }}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepText}>{renderHighlighted(step.text[locale])}</span>
            </li>
          ))}
        </ol>

        <button type="button" className={styles.cta} onClick={onStart}>
          {t.startPractice}
        </button>
        <p className={styles.meta}>
          {t.lessonMeta(
            stripe.mastery.pagesToMaster,
            stripe.mastery.problemsPerPage,
            Math.round(stripe.mastery.passAccuracy * 100),
            stripe.mastery.targetTimeSec,
          )}
        </p>
      </div>
    </div>
  );
}
