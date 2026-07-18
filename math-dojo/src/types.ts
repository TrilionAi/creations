export type BeltId = "white" | "blue" | "purple" | "brown" | "black" | "coral";

export type Locale = "en" | "pt" | "es";

export type LocalizedText = Record<Locale, string>;

export type SecondaryAnswerFormat = "remainder" | "fraction";

/** A visual: dots clustered into groups (multiplication/division), a hop-by-hop
 * number line (addition/subtraction), or a bar split into equal parts with some
 * shaded (fractions). Used both on lesson worked examples and, optionally, on
 * individual drill problems where reading a picture *is* the skill being drilled. */
export type Diagram =
  | { kind: "groups"; groups: number; perGroup: number }
  | { kind: "numberLine"; start: number; end: number }
  | { kind: "fraction"; total: number; shaded: number };

export interface Problem {
  id: string;
  prompt: string;
  answer: number;
  operands: number[];
  /** Present only for two-part answers — division's leftover, or a fraction's denominator. */
  secondaryAnswer?: number;
  /** How to display/label the two-part answer: "12 R 3" side-by-side, or a stacked fraction bar. */
  secondaryFormat?: SecondaryAnswerFormat;
  /** Present when the drill itself is "read this picture" — e.g. identifying a shaded fraction. */
  diagram?: Diagram;
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
