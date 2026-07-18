export type BeltId = "white" | "blue" | "purple" | "brown" | "black" | "coral";

export type Locale = "en" | "pt" | "es";

export type LocalizedText = Record<Locale, string>;

export interface Problem {
  id: string;
  prompt: string;
  answer: number;
  operands: number[];
  /** Present only for "divide with remainder" problems — answer is the quotient, this is the leftover. */
  remainder?: number;
}

export interface LessonStep {
  text: LocalizedText;
}

/** An optional visual grounding the lesson's worked example — dots clustered into
 * groups (multiplication/division) or a hop-by-hop number line (addition/subtraction). */
export type LessonDiagram =
  | { kind: "groups"; groups: number; perGroup: number }
  | { kind: "numberLine"; start: number; end: number };

export interface Lesson {
  intro: LocalizedText;
  example: Problem;
  steps: LessonStep[];
  diagram?: LessonDiagram;
}

export interface MasteryRequirement {
  problemsPerPage: number;
  pagesToMaster: number;
  passAccuracy: number;
  targetTimeSec: number;
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
