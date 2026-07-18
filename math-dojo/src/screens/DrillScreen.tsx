import { useEffect, useRef, useState } from "react";
import type { AttemptRecord, Problem, SessionSummary, Stripe } from "../types";
import { evaluateSession } from "../engine/progress";
import { NumPad } from "../components/NumPad";
import { ProgressBar } from "../components/ProgressBar";
import { useLocale } from "../i18n/LocaleContext";
import { UI_STRINGS } from "../i18n/ui";
import styles from "./DrillScreen.module.css";

interface DrillScreenProps {
  stripe: Stripe;
  onComplete: (summary: SessionSummary) => void;
  onExit: () => void;
}

type Feedback = "correct" | "incorrect" | null;

export function DrillScreen({ stripe, onComplete, onExit }: DrillScreenProps) {
  const { locale } = useLocale();
  const t = UI_STRINGS[locale];
  const { problemsPerPage, pagesToMaster } = stripe.mastery;
  const totalCount = problemsPerPage * pagesToMaster;
  const [queue, setQueue] = useState<Problem[]>(() => stripe.generate(totalCount));
  const [input, setInput] = useState("");
  const [remainderInput, setRemainderInput] = useState("");
  const [activeField, setActiveField] = useState<"quotient" | "remainder">("quotient");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [pageBreak, setPageBreak] = useState<number | null>(null);

  const attemptsRef = useRef<Map<string, AttemptRecord>>(new Map());
  const firstShownAtRef = useRef<Map<string, number>>(new Map());
  const lockRef = useRef(false);

  const current: Problem | undefined = queue[0];

  // seed attempt records once for the original set
  useEffect(() => {
    queue.forEach((p) => {
      attemptsRef.current.set(p.id, {
        problem: p,
        firstTryCorrect: false,
        timeToFirstCorrectMs: 0,
        mistakeCount: 0,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stamp the moment each problem is first shown, for speed scoring
  useEffect(() => {
    if (!current) return;
    if (!firstShownAtRef.current.has(current.id)) {
      firstShownAtRef.current.set(current.id, Date.now());
    }
  }, [current?.id]);

  // session finished once every original problem has been resolved correctly
  useEffect(() => {
    if (queue.length === 0 && attemptsRef.current.size === totalCount) {
      const attempts = Array.from(attemptsRef.current.values());
      const correctCount = attempts.filter((a) => a.firstTryCorrect).length;
      const accuracy = correctCount / totalCount;
      const avgTimeSec = attempts.reduce((sum, a) => sum + a.timeToFirstCorrectMs, 0) / totalCount / 1000;
      const passed = evaluateSession(stripe, accuracy, avgTimeSec);
      onComplete({ stripe, accuracy, avgTimeSec, passed, attempts });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  const hasRemainder = current?.remainder !== undefined;

  function handleDigit(digit: string) {
    if (feedback || lockRef.current) return;
    if (hasRemainder && activeField === "remainder") {
      setRemainderInput((v) => (v.length < 6 ? v + digit : v));
    } else {
      setInput((v) => (v.length < 6 ? v + digit : v));
    }
  }

  function handleBackspace() {
    if (feedback || lockRef.current) return;
    if (hasRemainder && activeField === "remainder") {
      setRemainderInput((v) => v.slice(0, -1));
    } else {
      setInput((v) => v.slice(0, -1));
    }
  }

  function handleSubmit() {
    if (!current || lockRef.current) return;
    if (input === "" || (hasRemainder && remainderInput === "")) return;
    lockRef.current = true;
    const numeric = Number(input);
    const record = attemptsRef.current.get(current.id)!;
    const isCorrect = hasRemainder
      ? numeric === current.answer && Number(remainderInput) === current.remainder
      : numeric === current.answer;

    if (isCorrect) {
      if (record.mistakeCount === 0) record.firstTryCorrect = true;
      const shownAt = firstShownAtRef.current.get(current.id) ?? Date.now();
      record.timeToFirstCorrectMs = Date.now() - shownAt;
      setFeedback("correct");

      const newSolved = solvedCount + 1;
      setSolvedCount(newSolved);
      const justFinishedPage = newSolved % problemsPerPage === 0;
      const isLastProblem = newSolved === totalCount;
      const pageJustCompleted = justFinishedPage && !isLastProblem ? newSolved / problemsPerPage : null;

      window.setTimeout(() => {
        setQueue((q) => q.slice(1));
        setInput("");
        setRemainderInput("");
        setActiveField("quotient");
        setFeedback(null);
        if (pageJustCompleted !== null) {
          // hold here — lockRef stays true until the person taps continue
          setPageBreak(pageJustCompleted);
        } else {
          lockRef.current = false;
        }
      }, 450);
    } else {
      record.mistakeCount += 1;
      setFeedback("incorrect");
      window.setTimeout(() => {
        setQueue((q) => {
          const [first, ...rest] = q;
          return [...rest, first];
        });
        setInput("");
        setRemainderInput("");
        setActiveField("quotient");
        setFeedback(null);
        lockRef.current = false;
      }, 1000);
    }
  }

  function handleContinuePage() {
    setPageBreak(null);
    lockRef.current = false;
  }

  const submitRef = useRef(handleSubmit);
  submitRef.current = handleSubmit;
  const continueRef = useRef(handleContinuePage);
  continueRef.current = handleContinuePage;
  const pageBreakRef = useRef(pageBreak);
  pageBreakRef.current = pageBreak;
  const digitRef = useRef(handleDigit);
  digitRef.current = handleDigit;
  const backspaceRef = useRef(handleBackspace);
  backspaceRef.current = handleBackspace;
  const hasRemainderRef = useRef(hasRemainder);
  hasRemainderRef.current = hasRemainder;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (pageBreakRef.current !== null) {
        if (e.key === "Enter" || e.key === " ") continueRef.current();
        return;
      }
      if (e.key >= "0" && e.key <= "9") {
        digitRef.current(e.key);
      } else if (e.key === "Backspace") {
        backspaceRef.current();
      } else if (e.key === "Tab" && hasRemainderRef.current) {
        e.preventDefault();
        setActiveField((f) => (f === "quotient" ? "remainder" : "quotient"));
      } else if (e.key === "Enter") {
        submitRef.current();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!current) return null;

  const pageIndex0 = Math.min(Math.floor(solvedCount / problemsPerPage), pagesToMaster - 1);
  const currentPageNumber = pageIndex0 + 1;
  const inPageSolved = solvedCount - pageIndex0 * problemsPerPage;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.exit} onClick={onExit} aria-label={t.exitDrillAria}>
          ✕
        </button>
        <div className={styles.progressWrap}>
          <ProgressBar value={inPageSolved} max={problemsPerPage} />
        </div>
        <span className={styles.count}>{t.pageLabel(currentPageNumber, pagesToMaster)}</span>
      </div>

      <div className={styles.problemArea}>
        {pageBreak !== null ? (
          <div className={styles.pageBreakCard}>
            <div className={styles.pageBreakEmoji}>📖</div>
            <div className={styles.pageBreakText}>{t.pageComplete(pageBreak, pagesToMaster)}</div>
            <button type="button" className={styles.pageBreakCta} onClick={handleContinuePage}>
              {t.continue}
            </button>
          </div>
        ) : (
          <>
            <div
              className={[
                styles.card,
                feedback === "correct" ? styles.cardCorrect : "",
                feedback === "incorrect" ? styles.cardIncorrect : "",
              ].join(" ")}
            >
              <div className={styles.prompt}>{current.prompt}</div>
              <div className={styles.equalsRow}>
                <span className={styles.equalsSign}>=</span>
                <button
                  type="button"
                  onClick={() => setActiveField("quotient")}
                  className={[
                    styles.answerBox,
                    input === "" ? styles.answerBoxEmpty : "",
                    hasRemainder && activeField === "quotient" ? styles.answerBoxActive : "",
                  ].join(" ")}
                >
                  {input || "?"}
                </button>
                {hasRemainder && (
                  <>
                    <span className={styles.remainderLabel}>{t.remainderLabel}</span>
                    <button
                      type="button"
                      onClick={() => setActiveField("remainder")}
                      className={[
                        styles.answerBox,
                        remainderInput === "" ? styles.answerBoxEmpty : "",
                        activeField === "remainder" ? styles.answerBoxActive : "",
                      ].join(" ")}
                    >
                      {remainderInput || "?"}
                    </button>
                  </>
                )}
              </div>
              {feedback === "incorrect" && (
                <div className={styles.revealCorrect}>
                  {hasRemainder
                    ? t.correctAnswerRevealWithRemainder(current.answer, current.remainder!)
                    : t.correctAnswerReveal(current.answer)}
                </div>
              )}
            </div>

            <div className={styles.padArea}>
              <NumPad
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                onSubmit={handleSubmit}
                submitDisabled={input === "" || (hasRemainder && remainderInput === "") || feedback !== null}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
