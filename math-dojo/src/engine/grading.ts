import type { Stripe, StripeResult } from "../types";

/** Personal-best performance tier for an already-passed stripe — purely cosmetic,
 * layered on top of the pass/fail gate, for players who want to chase more than
 * just clearing the bar. Built from the stripe's own best-ever accuracy and speed,
 * so it only ever improves, never regresses with a single bad session. */
export type Grade = "S" | "A" | "B";

export function computeGrade(stripe: Stripe, result: StripeResult | undefined): Grade | null {
  if (!result?.passed) return null;
  const speedRatio = result.bestAvgTimeSec / stripe.mastery.targetTimeSec;
  if (result.bestAccuracy >= 0.95 && speedRatio <= 0.7) return "S";
  if (result.bestAccuracy >= stripe.mastery.passAccuracy && speedRatio <= 0.85) return "A";
  return "B";
}
