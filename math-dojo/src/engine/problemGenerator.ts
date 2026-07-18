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

function makeDifference(operands: number[]): Problem {
  return {
    id: nextId(),
    prompt: operands.join(" - "),
    answer: operands.reduce((diff, n, i) => (i === 0 ? n : diff - n)),
    operands,
  };
}

function makeProduct(operands: number[]): Problem {
  return {
    id: nextId(),
    prompt: operands.join(" × "),
    answer: operands.reduce((product, n) => product * n, 1),
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

/** Both single digits, minuend never exceeds 10, result always positive. */
export function generateSubWithin10(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 10);
    const b = randomInt(1, a - 1);
    return makeDifference([a, b]);
  });
}

/** Teen minuend, subtrahend forces bridging back through 10. */
export function generateSubWithin20(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(11, 18);
    const unitsA = a - 10;
    const b = randomInt(unitsA + 1, 9);
    return makeDifference([a, b]);
  });
}

/** Chain two subtractions from a single starting number. */
export function generateSubThreeNumbers(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(12, 18);
    const b = randomInt(1, 7);
    const remaining = a - b;
    const c = randomInt(1, Math.min(7, remaining));
    return makeDifference([a, b, c]);
  });
}

/** Two-digit − one-digit, units digit never needs to borrow. */
export function generateTwoDigitMinusOneNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(1, 9);
    const b = randomInt(1, aUnits);
    const aTens = randomInt(1, 9);
    const a = aTens * 10 + aUnits;
    return makeDifference([a, b]);
  });
}

/** Two-digit − one-digit, units digit always forces a borrow from the tens. */
export function generateTwoDigitMinusOneWithCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 8);
    const b = randomInt(aUnits + 1, 9);
    const aTens = randomInt(1, 9);
    const a = aTens * 10 + aUnits;
    return makeDifference([a, b]);
  });
}

/** Two-digit − two-digit, neither column ever borrows. */
export function generateTwoDigitMinusTwoDigitNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 9);
    const bUnits = randomInt(0, aUnits);
    const aTens = randomInt(1, 9);
    const bTens = randomInt(1, aTens);
    const a = aTens * 10 + aUnits;
    const b = bTens * 10 + bUnits;
    return makeDifference([a, b]);
  });
}

/** Two-digit − two-digit, units column always forces a borrow from the tens. */
export function generateTwoDigitMinusTwoDigitWithCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 8);
    const bUnits = randomInt(aUnits + 1, 9);
    const aTens = randomInt(2, 9);
    const bTens = randomInt(1, aTens - 1);
    const a = aTens * 10 + aUnits;
    const b = bTens * 10 + bUnits;
    return makeDifference([a, b]);
  });
}

/** Three-digit − three-digit, no column ever borrows. */
export function generateThreeDigitMinusThreeDigitNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 9);
    const bUnits = randomInt(0, aUnits);
    const aTens = randomInt(0, 9);
    const bTens = randomInt(0, aTens);
    const aHundreds = randomInt(1, 9);
    const bHundreds = randomInt(1, aHundreds);
    const a = aHundreds * 100 + aTens * 10 + aUnits;
    const b = bHundreds * 100 + bTens * 10 + bUnits;
    return makeDifference([a, b]);
  });
}

/** Three-digit − three-digit, units borrow from tens only — hundreds stays clean. */
export function generateThreeDigitMinusThreeDigitSingleCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 8);
    const bUnits = randomInt(aUnits + 1, 9);
    const aTens = randomInt(1, 9);
    const bTens = randomInt(0, aTens - 1);
    const aHundreds = randomInt(1, 9);
    const bHundreds = randomInt(1, aHundreds);
    const a = aHundreds * 100 + aTens * 10 + aUnits;
    const b = bHundreds * 100 + bTens * 10 + bUnits;
    return makeDifference([a, b]);
  });
}

/** Three-digit − three-digit, the borrow cascades from units into tens into hundreds. */
export function generateThreeDigitMinusThreeDigitDoubleCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const aUnits = randomInt(0, 8);
    const bUnits = randomInt(aUnits + 1, 9);
    const aTens = randomInt(1, 8);
    const bTens = randomInt(aTens, 9);
    const aHundreds = randomInt(2, 9);
    const bHundreds = randomInt(1, aHundreds - 1);
    const a = aHundreds * 100 + aTens * 10 + aUnits;
    const b = bHundreds * 100 + bTens * 10 + bUnits;
    return makeDifference([a, b]);
  });
}

/** The ×2, ×5 and ×10 tables — related by doubling and halving. */
export function generateFriendlyTables(count: number): Problem[] {
  const tables = [2, 5, 10];
  return withoutImmediateRepeats(count, () => {
    const base = randomInt(2, 9);
    const table = tables[randomInt(0, tables.length - 1)];
    return makeProduct([base, table]);
  });
}

/** The ×3 and ×4 tables. */
export function generateTables3and4(count: number): Problem[] {
  const tables = [3, 4];
  return withoutImmediateRepeats(count, () => {
    const other = randomInt(2, 9);
    const table = tables[randomInt(0, tables.length - 1)];
    return makeProduct([other, table]);
  });
}

/** The ×6, ×7, ×8 and ×9 tables — the facts people struggle with most. */
export function generateHardTables(count: number): Problem[] {
  const tables = [6, 7, 8, 9];
  return withoutImmediateRepeats(count, () => {
    const other = randomInt(2, 9);
    const table = tables[randomInt(0, tables.length - 1)];
    return makeProduct([other, table]);
  });
}

/** Every single-digit fact, 2 through 9, all mixed together. */
export function generateAllTablesMixed(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    return makeProduct([a, b]);
  });
}

/** Multiplying a number by 10 or 100. */
export function generateMultiplyBy10And100(count: number): Problem[] {
  const multipliers = [10, 100];
  return withoutImmediateRepeats(count, () => {
    const base = randomInt(2, 99);
    const mult = multipliers[randomInt(0, multipliers.length - 1)];
    return makeProduct([base, mult]);
  });
}

/** Two-digit × one-digit, neither column's product ever hits double digits. */
export function generateTwoDigitByOneDigitNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const maxDigit = Math.floor(9 / b);
    const aUnits = randomInt(0, maxDigit);
    const aTens = randomInt(1, maxDigit);
    const a = aTens * 10 + aUnits;
    return makeProduct([a, b]);
  });
}

/** Two-digit × one-digit, the units product always carries into the tens. */
export function generateTwoDigitByOneDigitWithCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const minUnits = Math.min(Math.ceil(10 / b), 9);
    const aUnits = randomInt(minUnits, 9);
    const aTens = randomInt(1, 9);
    const a = aTens * 10 + aUnits;
    return makeProduct([a, b]);
  });
}

/** Two-digit × two-digit — split the second factor into tens and units. */
export function generateTwoDigitByTwoDigit(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(11, 89);
    const b = randomInt(11, 89);
    return makeProduct([a, b]);
  });
}

/** Three-digit × one-digit. */
export function generateThreeDigitByOneDigit(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(100, 999);
    const b = randomInt(2, 9);
    return makeProduct([a, b]);
  });
}

/** Three-digit × two-digit — the same split-and-add technique, at full size. */
export function generateThreeDigitByTwoDigit(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(100, 999);
    const b = randomInt(11, 99);
    return makeProduct([a, b]);
  });
}
