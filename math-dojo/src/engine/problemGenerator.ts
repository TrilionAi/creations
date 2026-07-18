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

function makeQuotient(a: number, b: number, includeRemainder: boolean): Problem {
  const quotient = Math.floor(a / b);
  const remainder = a - quotient * b;
  return {
    id: nextId(),
    prompt: `${a} ÷ ${b}`,
    answer: quotient,
    operands: [a, b],
    ...(includeRemainder ? { secondaryAnswer: remainder, secondaryFormat: "remainder" as const } : {}),
  };
}

/** A fraction-valued answer (numerator, denominator) — fraction prompts vary too much
 * for a single template, so the caller builds its own prompt string and operand list. */
function makeFraction(prompt: string, numerator: number, denominator: number, operands: number[]): Problem {
  return {
    id: nextId(),
    prompt,
    answer: numerator,
    operands,
    secondaryAnswer: denominator,
    secondaryFormat: "fraction",
  };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
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

/** Exact division — the inverse of a times table fact, no remainder. */
export function generateExactDivision(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const q = randomInt(2, 9);
    return makeQuotient(b * q, b, false);
  });
}

/** Division that always leaves something over. */
export function generateDivisionWithRemainder(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const q = randomInt(2, 9);
    const r = randomInt(1, b - 1);
    return makeQuotient(b * q + r, b, true);
  });
}

/** Dividing a clean multiple of 10 or 100 by 10 or 100. */
export function generateDivideBy10And100(count: number): Problem[] {
  const divisors = [10, 100];
  return withoutImmediateRepeats(count, () => {
    const divisor = divisors[randomInt(0, divisors.length - 1)];
    const base = randomInt(2, 99);
    return makeQuotient(base * divisor, divisor, false);
  });
}

/** Two-digit ÷ one-digit, tens and units digits each divide cleanly. */
export function generateTwoDigitByOneDigitExact(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const maxDigit = Math.floor(9 / b);
    const tensQ = randomInt(1, maxDigit);
    const unitsQ = randomInt(0, maxDigit);
    const a = tensQ * b * 10 + unitsQ * b;
    return makeQuotient(a, b, false);
  });
}

/** Two-digit ÷ one-digit, with a remainder left over. */
export function generateTwoDigitByOneDigitWithRemainder(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const r = randomInt(1, b - 1);
    const maxQ = Math.floor((99 - r) / b);
    const minQ = Math.max(2, Math.ceil((10 - r) / b));
    const q = randomInt(Math.min(minQ, maxQ), maxQ);
    return makeQuotient(b * q + r, b, true);
  });
}

/** Three-digit ÷ one-digit, hundreds/tens/units digits each divide cleanly. */
export function generateThreeDigitByOneDigitExact(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const maxDigit = Math.floor(9 / b);
    const hundredsQ = randomInt(1, maxDigit);
    const tensQ = randomInt(0, maxDigit);
    const unitsQ = randomInt(0, maxDigit);
    const a = hundredsQ * b * 100 + tensQ * b * 10 + unitsQ * b;
    return makeQuotient(a, b, false);
  });
}

/** Three-digit ÷ one-digit, with a remainder left over. */
export function generateThreeDigitByOneDigitWithRemainder(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 9);
    const r = randomInt(1, b - 1);
    const maxQ = Math.floor((999 - r) / b);
    const minQ = Math.max(12, Math.ceil((100 - r) / b));
    const q = randomInt(Math.min(minQ, maxQ), maxQ);
    return makeQuotient(b * q + r, b, true);
  });
}

/** Introduces two-digit divisors — dividend divides exactly. */
export function generateTwoDigitDivisorExact(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(11, 29);
    const q = randomInt(2, 9);
    return makeQuotient(b * q, b, false);
  });
}

/** Three-digit ÷ two-digit, full long-division sizing, no remainder. */
export function generateThreeDigitByTwoDigitExact(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(11, 29);
    const q = randomInt(11, 29);
    return makeQuotient(b * q, b, false);
  });
}

/** Three-digit ÷ two-digit, with a remainder left over — the capstone. */
export function generateThreeDigitByTwoDigitWithRemainder(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(11, 29);
    const q = randomInt(11, 29);
    const r = randomInt(1, b - 1);
    return makeQuotient(b * q + r, b, true);
  });
}

/** Identify a shaded fraction from a picture — no prompt text, the diagram is the problem. */
export function generateIdentifyFraction(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const total = randomInt(4, 10);
    const shaded = randomInt(1, total - 1);
    const problem = makeFraction("", shaded, total, [shaded, total]);
    return { ...problem, diagram: { kind: "fraction" as const, total, shaded } };
  });
}

/** Equivalent fractions — find the missing numerator for a given target denominator. */
export function generateEquivalentFraction(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = randomInt(2, 6);
    const multiplier = randomInt(2, 4);
    const d = b * multiplier;
    const a = randomInt(1, b - 1);
    return {
      id: nextId(),
      prompt: `${a}/${b} = ?/${d}`,
      answer: a * multiplier,
      operands: [a, b, d],
    };
  });
}

/** Simplify a fraction to lowest terms. */
export function generateSimplifyFraction(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    let denom = randomInt(2, 9);
    let numer = randomInt(1, denom - 1);
    while (gcd(numer, denom) !== 1) {
      denom = randomInt(2, 9);
      numer = randomInt(1, denom - 1);
    }
    const k = randomInt(2, 4);
    const a = numer * k;
    const b = denom * k;
    return makeFraction(`${a}/${b}`, numer, denom, [a, b]);
  });
}

/** A fraction of a whole number, e.g. "3/4 × 20". */
export function generateFractionOfNumber(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const d = randomInt(2, 10);
    const n = randomInt(1, d - 1);
    const whole = d * randomInt(2, 9);
    return {
      id: nextId(),
      prompt: `${n}/${d} × ${whole}`,
      answer: (whole / d) * n,
      operands: [n, d, whole],
    };
  });
}

/** Adding fractions that already share a denominator. */
export function generateAddFractionsSameDenominator(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const d = randomInt(3, 10);
    const n1 = randomInt(1, d - 2);
    const n2 = randomInt(1, d - 1 - n1);
    return makeFraction(`${n1}/${d} + ${n2}/${d}`, n1 + n2, d, [n1, n2, d]);
  });
}

/** Subtracting fractions that already share a denominator. */
export function generateSubtractFractionsSameDenominator(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const d = randomInt(3, 10);
    const n1 = randomInt(2, d - 1);
    const n2 = randomInt(1, n1 - 1);
    return makeFraction(`${n1}/${d} - ${n2}/${d}`, n1 - n2, d, [n1, n2, d]);
  });
}

/** Adding fractions with different denominators — one denominator is a multiple of the other. */
export function generateAddFractionsDifferentDenominators(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b1 = randomInt(2, 6);
    const multiplier = randomInt(2, 3);
    const b2 = b1 * multiplier;
    const n1 = randomInt(1, b1 - 1);
    const n2 = randomInt(1, b2 - 1);
    const numerator = n1 * multiplier + n2;
    return makeFraction(`${n1}/${b1} + ${n2}/${b2}`, numerator, b2, [n1, b1, n2, b2]);
  });
}

/** Multiplying two fractions — multiply straight across. */
export function generateMultiplyFractions(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const d1 = randomInt(2, 6);
    const n1 = randomInt(1, d1 - 1);
    const d2 = randomInt(2, 6);
    const n2 = randomInt(1, d2 - 1);
    return makeFraction(`${n1}/${d1} × ${n2}/${d2}`, n1 * n2, d1 * d2, [n1, d1, n2, d2]);
  });
}

/** Dividing by a fraction — flip the second fraction and multiply. */
export function generateDivideFractions(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const d1 = randomInt(2, 6);
    const n1 = randomInt(1, d1 - 1);
    const d2 = randomInt(2, 6);
    const n2 = randomInt(1, d2 - 1);
    return makeFraction(`${n1}/${d1} ÷ ${n2}/${d2}`, n1 * d2, d1 * n2, [n1, d1, n2, d2]);
  });
}

/** Converting a mixed number to an improper fraction. */
export function generateMixedToImproper(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const whole = randomInt(1, 5);
    const d = randomInt(2, 9);
    const n = randomInt(1, d - 1);
    return makeFraction(`${whole} ${n}/${d}`, whole * d + n, d, [whole, n, d]);
  });
}
