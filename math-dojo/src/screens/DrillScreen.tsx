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
  const totalCount = stripe.mastery.setSize;
  const [queue, setQueue] = useState<Problem[]>(() => stripe.generate(totalCount));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [solvedCount, setSolvedCount] = useState(0);

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

  function handleDigit(digit: string) {
    if (feedback || lockRef.current) return;
    setInput((v) => (v.length < 6 ? v + digit : v));
  }

  function handleBackspace() {
    if (feedback || lockRef.current) return;
    setInput((v) => v.slice(0, -1));
  }

  function handleSubmit() {
    if (!current || lockRef.current || input === "") return;
    lockRef.current = true;
    const numeric = Number(input);
    const record = attemptsRef.current.get(current.id)!;
    const isCorrect = numeric === current.answer;

    if (isCorrect) {
      if (record.mistakeCount === 0) record.firstTryCorrect = true;
      const shownAt = firstShownAtRef.current.get(current.id) ?? Date.now();
      record.timeToFirstCorrectMs = Date.now() - shownAt;
      setFeedback("correct");
      setSolvedCount((c) => c + 1);
      window.setTimeout(() => {
        setQueue((q) => q.slice(1));
        setInput("");
        setFeedback(null);
        lockRef.current = false;
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
        setFeedback(null);
        lockRef.current = false;
      }, 1000);
    }
  }

  const submitRef = useRef(handleSubmit);
  submitRef.current = handleSubmit;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        setInput((v) => (v.length < 6 ? v + e.key : v));
      } else if (e.key === "Backspace") {
        setInput((v) => v.slice(0, -1));
      } else if (e.key === "Enter") {
        submitRef.current();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!current) return null;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.exit} onClick={onExit} aria-label={t.exitDrillAria}>
          ✕
        </button>
        <div className={styles.progressWrap}>
          <ProgressBar value={solvedCount} max={totalCount} />
        </div>
        <span className={styles.count}>
          {solvedCount}/{totalCount}
        </span>
      </div>

      <div className={styles.problemArea}>
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
            <span className={[styles.answerBox, input === "" ? styles.answerBoxEmpty : ""].join(" ")}>
              {input || "?"}
            </span>
          </div>
          {feedback === "incorrect" && (
            <div className={styles.revealCorrect}>{t.correctAnswerReveal(current.answer)}</div>
          )}
        </div>

        <div className={styles.padArea}>
          <NumPad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onSubmit={handleSubmit}
            submitDisabled={input === "" || feedback !== null}
          />
        </div>
      </div>
    </div>
  );
}
