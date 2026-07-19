import type { Belt, ProgressState, SessionSummary, Stripe, StripeResult } from "../types";

const STORAGE_KEY = "math-dojo:progress:v1";

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stripeResults: {}, practiceDays: [] };
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed.stripeResults) return { stripeResults: {}, practiceDays: [] };
    return { ...parsed, practiceDays: parsed.practiceDays ?? [] };
  } catch {
    return { stripeResults: {}, practiceDays: [] };
  }
}

function dateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Consecutive-day practice streak ending today (or ending yesterday if today's
 * session hasn't happened yet, so the streak doesn't drop to 0 before the person
 * has had a chance to practice). */
export function computeDayStreak(practiceDays: string[] | undefined): number {
  if (!practiceDays || practiceDays.length === 0) return 0;
  const days = new Set(practiceDays);
  const cursor = new Date();
  if (!days.has(dateToIso(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dateToIso(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dateToIso(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function saveProgress(progress: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage unavailable (private mode, quota, etc.) — progress just won't persist
  }
}

export function getAllStripesFlat(belts: Belt[]): Stripe[] {
  return [...belts]
    .sort((a, b) => a.order - b.order)
    .flatMap((belt) => belt.stripes);
}

/**
 * Review mode: visiting the site with ?unlock=all in the URL bypasses the
 * mastery gate so every stripe with content can be browsed directly — for
 * content review while building, not part of the real player experience.
 */
function isReviewModeActive(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("unlock") === "all";
}

export function isStripeUnlocked(stripe: Stripe, belts: Belt[], progress: ProgressState): boolean {
  if (isReviewModeActive()) return true;
  const flat = getAllStripesFlat(belts);
  const idx = flat.findIndex((s) => s.id === stripe.id);
  if (idx <= 0) return true;
  const prev = flat[idx - 1];
  return progress.stripeResults[prev.id]?.passed ?? false;
}

export function isBeltUnlocked(belt: Belt, belts: Belt[], progress: ProgressState): boolean {
  if (belt.stripes.length === 0) return false;
  return isStripeUnlocked(belt.stripes[0], belts, progress);
}

export function recordSessionResult(progress: ProgressState, summary: SessionSummary): ProgressState {
  const existing = progress.stripeResults[summary.stripe.id];
  const nextResult: StripeResult = {
    stripeId: summary.stripe.id,
    passed: summary.passed || existing?.passed || false,
    bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, summary.accuracy),
    bestAvgTimeSec:
      existing?.bestAvgTimeSec !== undefined
        ? Math.min(existing.bestAvgTimeSec, summary.avgTimeSec)
        : summary.avgTimeSec,
    attempts: (existing?.attempts ?? 0) + 1,
  };
  const today = dateToIso(new Date());
  const practiceDays = progress.practiceDays?.includes(today)
    ? progress.practiceDays
    : [...(progress.practiceDays ?? []), today];
  const next: ProgressState = {
    stripeResults: { ...progress.stripeResults, [summary.stripe.id]: nextResult },
    practiceDays,
  };
  saveProgress(next);
  return next;
}

export function evaluateSession(stripe: Stripe, accuracy: number, avgTimeSec: number): boolean {
  return accuracy >= stripe.mastery.passAccuracy && avgTimeSec <= stripe.mastery.targetTimeSec;
}
