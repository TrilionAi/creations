export type BeltId = "white" | "blue" | "purple" | "brown" | "black" | "coral";

export type Locale = "en" | "pt" | "es";

export type LocalizedText = Record<Locale, string>;

export interface Problem {
  id: string;
  prompt: string;
  answer: number;
  operands: number[];
}

export interface LessonStep {
  text: LocalizedText;
}

export interface Lesson {
  intro: LocalizedText;
  example: Problem;
  steps: LessonStep[];
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
