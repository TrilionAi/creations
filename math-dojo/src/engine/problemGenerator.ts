import type { Problem } from "../types";

let seedCounter = 0;

function nextId(): string {
  seedCounter += 1;
  return `p${seedCounter}-${Math.floor(Math.random() * 1e6)}`;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeSum(operands: number[]): Problem {
  return {
    id: nextId(),
    prompt: operands.join(" + "),
    answer: operands.reduce((sum, n) => sum + n, 0),
    operands,
  };
}

function pairKey(operands: number[]): string {
  return [...operands].sort((x, y) => x - y).join(",");
}

/**
 * Builds a sequence from `single`, retrying a problem a few times if it would
 * land right next to the same operand set or the same answer — occasional
 * repeats elsewhere in the set are fine, back-to-back ones feel monotonous.
 */
function withoutImmediateRepeats(count: number, single: (index: number) => Problem): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < count; i += 1) {
    let candidate = single(i);
    let attempts = 0;
    while (
      i > 0 &&
      attempts < 8 &&
      (pairKey(candidate.operands) === pairKey(problems[i - 1].operands) ||
        candidate.answer === problems[i - 1].answer)
    ) {
      candidate = single(i);
      attempts += 1;
    }
    problems.push(candidate);
  }
  return problems;
}

/** Both single digits, sum never exceeds 10. */
export function generateAddWithin10(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(1, 9);
    const b = randomInt(1, Math.max(1, 10 - a));
    return makeSum([a, b]);
  });
}

/** Single digits, sums land in the 10-20 range at least half the time. */
export function generateAddWithin20(count: number): Problem[] {
  return withoutImmediateRepeats(count, (i) => {
    const forceTeen = i % 2 === 0;
    let a = randomInt(1, 9);
    let b = randomInt(1, 9);
    if (forceTeen && a + b < 11) {
      b = randomInt(11 - a, 9);
    }
    return makeSum([a, b]);
  });
}

/** Three single-digit addends — chain the addition left to right. */
export function generateThreeAddends(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);
    const c = randomInt(1, 9);
    return makeSum([a, b, c]);
  });
}

/** Two-digit + one-digit, units column never carries. */
export function generateTwoDigitPlusOneNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 8);
    const b = randomInt(1, 9 - aUnits);
    const aTens = randomInt(1, 9);
    const a = aTens * 10 + aUnits;
    return makeSum([a, b]);
  });
}

/** Two-digit + one-digit, units column always forces a carry. */
export function generateTwoDigitPlusOneWithCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(2, 9);
    const b = randomInt(Math.max(1, 10 - aUnits), 9);
    const aTens = randomInt(1, 8);
    const a = aTens * 10 + aUnits;
    return makeSum([a, b]);
  });
}

/** Two-digit + two-digit, units and tens columns never carry. */
export function generateTwoDigitNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 9);
    const bUnits = randomInt(0, 9 - aUnits);
    const aTens = randomInt(1, 8);
    const bTens = randomInt(1, 9 - aTens);
    const a = aTens * 10 + aUnits;
    const b = bTens * 10 + bUnits;
    return makeSum([a, b]);
  });
}

/** Two-digit + two-digit, units column always forces a carry into the tens. */
export function generateTwoDigitWithCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(2, 9);
    const bUnits = randomInt(10 - aUnits, 9);
    const aTens = randomInt(1, 8);
    const bTens = randomInt(1, 8);
    const a = aTens * 10 + aUnits;
    const b = bTens * 10 + bUnits;
    return makeSum([a, b]);
  });
}

/** Three-digit + three-digit, no column ever carries. */
export function generateThreeDigitNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 9);
    const bUnits = randomInt(0, 9 - aUnits);
    const aTens = randomInt(0, 9);
    const bTens = randomInt(0, 9 - aTens);
    const aHundreds = randomInt(1, 8);
    const bHundreds = randomInt(1, 9 - aHundreds);
    const a = aHundreds * 100 + aTens * 10 + aUnits;
    const b = bHundreds * 100 + bTens * 10 + bUnits;
    return makeSum([a, b]);
  });
}

/** Three-digit + three-digit, units carry into tens only — tens and hundreds stay clean. */
export function generateThreeDigitSingleCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(2, 9);
    const bUnits = randomInt(Math.max(1, 10 - aUnits), 9);
    const aTens = randomInt(0, 8);
    const bTens = randomInt(0, 8 - aTens);
    const aHundreds = randomInt(1, 8);
    const bHundreds = randomInt(1, 9 - aHundreds);
    const a = aHundreds * 100 + aTens * 10 + aUnits;
    const b = bHundreds * 100 + bTens * 10 + bUnits;
    return makeSum([a, b]);
  });
}

/** Three-digit + three-digit, the carry cascades from units into tens into hundreds. */
export function generateThreeDigitDoubleCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(2, 9);
    const bUnits = randomInt(Math.max(1, 10 - aUnits), 9);
    const aTens = randomInt(1, 9);
    const bTens = randomInt(Math.max(0, 9 - aTens), 9);
    const aHundreds = randomInt(1, 7);
    const bHundreds = randomInt(1, 8 - aHundreds);
    const a = aHundreds * 100 + aTens * 10 + aUnits;
    const b = bHundreds * 100 + bTens * 10 + bUnits;
    return makeSum([a, b]);
  });
}
