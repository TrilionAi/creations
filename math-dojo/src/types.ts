export type BeltId = "white" | "blue" | "purple" | "brown" | "black" | "coral";

export type Locale = "en" | "pt" | "es";

export type LocalizedText = Record<Locale, string>;

export type SecondaryAnswerFormat = "remainder" | "fraction" | "decimal" | "pair" | "radical";

/** A visual: dots clustered into groups (multiplication/division), a hop-by-hop
 * number line (addition/subtraction, and reused as-is for negative integers since
 * it already renders any start/end), a bar split into equal parts with some shaded
 * (fractions/decimals), a labeled "variable box" beside unit squares (algebra —
 * concretely shows what a variable holds), a level balance scale with x on one
 * pan (equations — shows that solving means keeping both sides equal), an
 * input/rule/output "function machine" (functions — shows a function as a
 * mapping), a rise-over-run staircase (functions — shows what slope means), a
 * handful of plotted points forming a U (functions — the shape of a parabola),
 * or a 2×2 area grid for (x+a)(x+b) (pre-calculus — the "box method" for
 * factoring, showing x², ax, bx, ab as the four partial areas). Used both on
 * lesson worked examples and, optionally, on individual drill problems where
 * reading a picture *is* the skill. */
export type Diagram =
  | { kind: "groups"; groups: number; perGroup: number }
  | { kind: "numberLine"; start: number; end: number }
  | { kind: "fraction"; total: number; shaded: number }
  | { kind: "variableBox"; xValue: number; units: number }
  | { kind: "balanceScale"; leftUnits: number; rightUnits: number }
  | { kind: "functionMachine"; input: number; rule: string; output: number }
  | { kind: "slopeStaircase"; rise: number; run: number }
  | { kind: "parabola"; points: { x: number; y: number }[] }
  | { kind: "factorArea"; a: number; b: number };

export interface Problem {
  id: string;
  prompt: string;
  answer: number;
  operands: number[];
  /** Present only for two-part answers — division's leftover, a fraction's denominator,
   * or a decimal's single tenths digit. */
  secondaryAnswer?: number;
  /** How to display/label the two-part answer: "12 R 3" side-by-side, a stacked
   * fraction bar, "3.5" with a "." separator (decimal — tenths digit only), "2, 5"
   * with a "," separator (pair — two independently meaningful numbers, e.g. two
   * roots or an x/y solution pair), or "5√2" with a "√" separator (radical — a
   * coefficient outside the root, a value remaining inside it). */
  secondaryFormat?: SecondaryAnswerFormat;
  /** Present when the drill itself is "read this picture" — e.g. identifying a shaded fraction. */
  diagram?: Diagram;
  /** True when this problem's answer can be negative — shows the NumPad's sign toggle.
   * Absent (falsy) everywhere outside Algebra's integer-arithmetic stripes. */
  allowNegative?: boolean;
  /** True when `prompt` is itself a complete equation to solve for x (e.g. "2x + 4 = 0"),
   * not an expression to evaluate. Changes how the worked example and drill answer row
   * are labeled — never concatenate "prompt = answer", since the prompt already contains
   * an "=" and a second one would misleadingly chain a third, false equality. */
  isEquation?: boolean;
  /** Overrides the default "x =" label shown for `isEquation` problems — e.g. "x, y ="
   * for a system of two equations, where the pair answer isn't two roots of one x. */
  equationLabel?: string;
}

export interface LessonStep {
  text: LocalizedText;
}

export interface Lesson {
  intro: LocalizedText;
  example: Problem;
  steps: LessonStep[];
  diagram?: Diagram;
}

export interface MasteryRequirement {
  problemsPerPage: number;
  pagesToMaster: number;
  passAccuracy: number;
  targetTimeSec: number;
}

export interface StripeDegree {
  index: number;
  name: LocalizedText;
}

export interface Stripe {
  id: string;
  beltId: BeltId;
  index: number;
  title: LocalizedText;
  summary: LocalizedText;
  lesson: Lesson;
  mastery: MasteryRequirement;
  generate: (count: number) => Problem[];
  /** Groups stripes into named sub-sections on the map (Black Belt's 6 degrees) — absent elsewhere. */
  degree?: StripeDegree;
}

export interface Belt {
  id: BeltId;
  name: LocalizedText;
  order: number;
  operationLabel: LocalizedText;
  colorVar: string;
  tagline: LocalizedText;
  stripes: Stripe[];
  locked?: boolean;
}

export interface StripeResult {
  stripeId: string;
  passed: boolean;
  bestAccuracy: number;
  bestAvgTimeSec: number;
  attempts: number;
}

export interface ProgressState {
  stripeResults: Record<string, StripeResult>;
}

export interface AttemptRecord {
  problem: Problem;
  firstTryCorrect: boolean;
  timeToFirstCorrectMs: number;
  mistakeCount: number;
}

export interface SessionSummary {
  stripe: Stripe;
  accuracy: number;
  avgTimeSec: number;
  passed: boolean;
  attempts: AttemptRecord[];
}
