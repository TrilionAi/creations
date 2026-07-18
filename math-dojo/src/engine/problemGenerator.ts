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

/** A decimal-valued answer, whole part + a single tenths digit (e.g. 3.5 -> whole=3, tenths=5). */
function makeDecimal(prompt: string, whole: number, tenths: number, operands: number[]): Problem {
  return {
    id: nextId(),
    prompt,
    answer: whole,
    operands,
    secondaryAnswer: tenths,
    secondaryFormat: "decimal",
  };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Renders a signed integer inside a chain like "a + b" — the leading term shows its
 * natural sign, a later term wraps a negative value in parentheses ("4 + (-7)") so a
 * run-on "+ -7" or "- -7" never appears in a prompt. */
function formatSignedTerm(n: number, leading: boolean): string {
  if (leading) return `${n}`;
  return n < 0 ? `(${n})` : `${n}`;
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

/** Identify a decimal (tenths only) from a shaded bar — no prompt text, the diagram is the problem. */
export function generateIdentifyDecimalTenths(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const tenths = randomInt(1, 9);
    const problem = makeDecimal("", 0, tenths, [0, tenths]);
    return { ...problem, diagram: { kind: "fraction" as const, total: 10, shaded: tenths } };
  });
}

/** Writing a tenths fraction (n/10) as a decimal. */
export function generateFractionTenthsToDecimal(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const n = randomInt(1, 9);
    return makeDecimal(`${n}/10`, 0, n, [n]);
  });
}

/** Writing a mixed number with tenths (whole n/10) as a decimal. */
export function generateMixedTenthsToDecimal(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const whole = randomInt(1, 9);
    const tenths = randomInt(1, 9);
    return makeDecimal(`${whole} ${tenths}/10`, whole, tenths, [whole, tenths]);
  });
}

/** Adding decimals (tenths only), no carry into the whole part. */
export function generateAddDecimalsNoCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const w1 = randomInt(1, 8);
    const w2 = randomInt(1, 8);
    const t1 = randomInt(0, 9);
    const t2 = randomInt(0, 9 - t1);
    return makeDecimal(`${w1}.${t1} + ${w2}.${t2}`, w1 + w2, t1 + t2, [w1, t1, w2, t2]);
  });
}

/** Adding decimals (tenths only), the tenths always carry into the whole part. */
export function generateAddDecimalsWithCarry(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const w1 = randomInt(1, 8);
    const w2 = randomInt(1, 8);
    const t1 = randomInt(1, 9);
    const t2 = randomInt(10 - t1, 9);
    return makeDecimal(`${w1}.${t1} + ${w2}.${t2}`, w1 + w2 + 1, t1 + t2 - 10, [w1, t1, w2, t2]);
  });
}

/** Subtracting decimals (tenths only), no borrowing needed. */
export function generateSubtractDecimalsNoBorrow(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const w1 = randomInt(1, 9);
    const w2 = randomInt(0, w1 - 1);
    const t1 = randomInt(0, 9);
    const t2 = randomInt(0, t1);
    return makeDecimal(`${w1}.${t1} - ${w2}.${t2}`, w1 - w2, t1 - t2, [w1, t1, w2, t2]);
  });
}

/** Subtracting decimals (tenths only), always borrows from the whole part. */
export function generateSubtractDecimalsWithBorrow(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const w1 = randomInt(2, 9);
    const w2 = randomInt(1, w1 - 1);
    const t1 = randomInt(0, 8);
    const t2 = randomInt(t1 + 1, 9);
    return makeDecimal(`${w1}.${t1} - ${w2}.${t2}`, w1 - 1 - w2, t1 + 10 - t2, [w1, t1, w2, t2]);
  });
}

/** Multiplying a decimal (tenths only) by 10 or 100 — the result is always a whole number. */
export function generateMultiplyDecimalBy10Or100(count: number): Problem[] {
  const multipliers = [10, 100];
  return withoutImmediateRepeats(count, () => {
    const whole = randomInt(1, 9);
    const tenths = randomInt(1, 9);
    const multiplier = multipliers[randomInt(0, multipliers.length - 1)];
    const valueTimesTen = whole * 10 + tenths;
    const answer = multiplier === 10 ? valueTimesTen : valueTimesTen * 10;
    return {
      id: nextId(),
      prompt: `${whole}.${tenths} × ${multiplier}`,
      answer,
      operands: [whole, tenths, multiplier],
    };
  });
}

/** Dividing a whole number by 10 — the reverse place-value shift, giving a decimal. */
export function generateDivideWholeBy10(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const whole = randomInt(1, 9);
    const tenths = randomInt(0, 9);
    const dividend = whole * 10 + tenths;
    return makeDecimal(`${dividend} ÷ 10`, whole, tenths, [dividend]);
  });
}

/** Rounding a decimal (tenths only) to the nearest whole number — the capstone. */
export function generateRoundDecimal(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const whole = randomInt(1, 9);
    const tenths = randomInt(1, 9);
    const answer = tenths >= 5 ? whole + 1 : whole;
    return {
      id: nextId(),
      prompt: `${whole}.${tenths}`,
      answer,
      operands: [whole, tenths],
    };
  });
}

/** Reads a "variable box" picture — a box labeled x (revealed value) plus loose unit
 * squares — the total is what the picture represents, added together. */
export function generateVariableBoxReading(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const xValue = randomInt(1, 9);
    const units = randomInt(1, 9);
    return {
      id: nextId(),
      prompt: "",
      answer: xValue + units,
      operands: [xValue, units],
      diagram: { kind: "variableBox" as const, xValue, units },
    };
  });
}

/** Evaluate a linear expression "ax + b" by substituting a given value for x. */
export function generateEvaluateExpression(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(0, 9);
    const xVal = randomInt(1, 9);
    return {
      id: nextId(),
      prompt: `${a}x + ${b}, x = ${xVal}`,
      answer: a * xVal + b,
      operands: [a, b, xVal],
    };
  });
}

/** Order of operations — multiply before add, and parentheses before anything outside them. */
export function generateOrderOfOperations(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const template = randomInt(0, 2);
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    const c = randomInt(2, 9);
    if (template === 0) {
      return { id: nextId(), prompt: `${a} + ${b} × ${c}`, answer: a + b * c, operands: [a, b, c] };
    }
    if (template === 1) {
      return { id: nextId(), prompt: `(${a} + ${b}) × ${c}`, answer: (a + b) * c, operands: [a, b, c] };
    }
    const product = a * b;
    const cBounded = randomInt(1, product);
    return {
      id: nextId(),
      prompt: `${a} × ${b} − ${cBounded}`,
      answer: product - cBounded,
      operands: [a, b, cBounded],
    };
  });
}

/** Reads a negative position on the number line — always hops left past zero. */
export function generateNegativeNumberLine(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const start = randomInt(0, 4);
    const distance = randomInt(start + 1, start + 7);
    const end = start - distance;
    return {
      id: nextId(),
      prompt: "",
      answer: end,
      operands: [start, distance],
      diagram: { kind: "numberLine" as const, start, end },
      allowNegative: true,
    };
  });
}

/** Adding two integers with the same sign — both positive or both negative. */
export function generateAddIntegersSameSign(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const sign = Math.random() < 0.5 ? 1 : -1;
    const a = sign * randomInt(1, 9);
    const b = sign * randomInt(1, 9);
    return {
      id: nextId(),
      prompt: `${formatSignedTerm(a, true)} + ${formatSignedTerm(b, false)}`,
      answer: a + b,
      operands: [a, b],
      allowNegative: true,
    };
  });
}

/** Adding two integers with opposite signs. */
export function generateAddIntegersDifferentSigns(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const signA = Math.random() < 0.5 ? 1 : -1;
    const a = signA * randomInt(1, 9);
    const b = -signA * randomInt(1, 9);
    return {
      id: nextId(),
      prompt: `${formatSignedTerm(a, true)} + ${formatSignedTerm(b, false)}`,
      answer: a + b,
      operands: [a, b],
      allowNegative: true,
    };
  });
}

/** Subtracting one integer from another — either can be negative. */
export function generateSubtractIntegers(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(-9, 9);
    const b = randomInt(-9, 9);
    return {
      id: nextId(),
      prompt: `${formatSignedTerm(a, true)} - ${formatSignedTerm(b, false)}`,
      answer: a - b,
      operands: [a, b],
      allowNegative: true,
    };
  });
}

/** Combining two "like terms" (same variable) into a single coefficient. */
export function generateCombiningLikeTerms(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const sign1 = Math.random() < 0.5 ? 1 : -1;
    const sign2 = Math.random() < 0.5 ? 1 : -1;
    const c1 = sign1 * randomInt(2, 9);
    const c2 = sign2 * randomInt(2, 9);
    const operator = c2 >= 0 ? "+" : "−";
    const magnitude = Math.abs(c2);
    return {
      id: nextId(),
      prompt: `${c1}x ${operator} ${magnitude}x`,
      answer: c1 + c2,
      operands: [c1, c2],
      allowNegative: true,
    };
  });
}

/** The distributive property, tested via evaluation: a(x ± b), with x given. */
export function generateDistributiveProperty(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const xVal = randomInt(2, 9);
    const useSubtraction = Math.random() < 0.5;
    const b = useSubtraction ? randomInt(1, xVal - 1) : randomInt(1, 9);
    const inner = useSubtraction ? xVal - b : xVal + b;
    return {
      id: nextId(),
      prompt: `${a}(x ${useSubtraction ? "−" : "+"} ${b}), x = ${xVal}`,
      answer: a * inner,
      operands: [a, b, xVal],
    };
  });
}

/** Multi-step: distribute, then add or subtract a constant, for a given x that can
 * itself be negative — the capstone, synthesizing every earlier Algebra stripe. */
export function generateMultiStepExpression(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(1, 9);
    const c = randomInt(1, 20);
    const innerOp = Math.random() < 0.5 ? "+" : "−";
    const outerOp = Math.random() < 0.5 ? "+" : "−";
    const xVal = randomInt(-9, 9);
    const inner = innerOp === "+" ? xVal + b : xVal - b;
    const answer = outerOp === "+" ? a * inner + c : a * inner - c;
    return {
      id: nextId(),
      prompt: `${a}(x ${innerOp} ${b}) ${outerOp} ${c}, x = ${xVal}`,
      answer,
      operands: [a, b, c, xVal],
      allowNegative: true,
    };
  });
}

/** Reads a balanced scale — x plus leftUnits on one pan, rightUnits on the other —
 * and figures out what x must be to keep it level. */
export function generateBalanceScaleReading(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const leftUnits = randomInt(1, 8);
    const rightUnits = randomInt(leftUnits + 1, 9);
    return {
      id: nextId(),
      prompt: "",
      answer: rightUnits - leftUnits,
      operands: [leftUnits, rightUnits],
      diagram: { kind: "balanceScale" as const, leftUnits, rightUnits },
    };
  });
}

/** One-step equations: "x + a = b" or "x - a = b" — undo with the opposite operation. */
export function generateOneStepAddSub(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const useAddition = Math.random() < 0.5;
    if (useAddition) {
      const a = randomInt(1, 9);
      const xVal = randomInt(1, 9);
      const b = xVal + a;
      return { id: nextId(), prompt: `x + ${a} = ${b}`, answer: xVal, operands: [a, b], isEquation: true };
    }
    const xVal = randomInt(2, 9);
    const a = randomInt(1, xVal - 1);
    const b = xVal - a;
    return { id: nextId(), prompt: `x - ${a} = ${b}`, answer: xVal, operands: [a, b], isEquation: true };
  });
}

/** One-step equations: "ax = b" or "x ÷ a = b" — undo with the opposite operation. */
export function generateOneStepMulDiv(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const useMultiplication = Math.random() < 0.5;
    const a = randomInt(2, 9);
    if (useMultiplication) {
      const xVal = randomInt(2, 9);
      const b = a * xVal;
      return { id: nextId(), prompt: `${a}x = ${b}`, answer: xVal, operands: [a, b], isEquation: true };
    }
    const quotient = randomInt(2, 9);
    const xVal = a * quotient;
    return {
      id: nextId(),
      prompt: `x ÷ ${a} = ${quotient}`,
      answer: xVal,
      operands: [a, quotient],
      isEquation: true,
    };
  });
}

/** Two-step equations: "ax + b = c" or "ax - b = c" — undo +/- first, then ×/÷. */
export function generateTwoStepEquation(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const useSubtraction = Math.random() < 0.5;
    const a = randomInt(2, 9);
    const xVal = randomInt(1, 9);
    if (useSubtraction) {
      const b = randomInt(1, a * xVal - 1);
      const c = a * xVal - b;
      return {
        id: nextId(),
        prompt: `${a}x - ${b} = ${c}`,
        answer: xVal,
        operands: [a, b, c],
        isEquation: true,
      };
    }
    const b = randomInt(0, 9);
    const c = a * xVal + b;
    return { id: nextId(), prompt: `${a}x + ${b} = ${c}`, answer: xVal, operands: [a, b, c], isEquation: true };
  });
}

/** Two-step equations whose solution lands below zero — same technique, negative answer. */
export function generateEquationNegativeSolution(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const xVal = randomInt(-9, -1);
    const b = randomInt(0, 9);
    const c = a * xVal + b;
    return {
      id: nextId(),
      prompt: `${a}x + ${b} = ${c}`,
      answer: xVal,
      operands: [a, b, c],
      allowNegative: true,
      isEquation: true,
    };
  });
}

/** Variables on both sides: "ax + b = cx + d" — gather the x-terms first. */
export function generateVariableBothSides(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(3, 6);
    let c = randomInt(2, 6);
    while (c === a) c = randomInt(2, 6);
    const b = randomInt(0, 6);
    const xVal = randomInt(-6, 6);
    const d = (a - c) * xVal + b;
    const dOperator = d >= 0 ? "+" : "−";
    return {
      id: nextId(),
      prompt: `${a}x + ${b} = ${c}x ${dOperator} ${Math.abs(d)}`,
      answer: xVal,
      operands: [a, b, c, d],
      allowNegative: true,
      isEquation: true,
    };
  });
}

/** Equations with distribution: "a(x + b) = c" or "a(x - b) = c" — distribute first. */
export function generateEquationWithDistribution(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(1, 9);
    const xVal = randomInt(-9, 9);
    const useSubtraction = Math.random() < 0.5;
    const inner = useSubtraction ? xVal - b : xVal + b;
    const c = a * inner;
    return {
      id: nextId(),
      prompt: `${a}(x ${useSubtraction ? "−" : "+"} ${b}) = ${c}`,
      answer: xVal,
      operands: [a, b, c],
      allowNegative: true,
      isEquation: true,
    };
  });
}

/** Combine the x-terms first: "ax + bx + c = d" or "ax - bx + c = d". */
export function generateCombineLikeTermsFirst(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const useSubtraction = Math.random() < 0.5;
    const xVal = randomInt(-9, 9);
    const constant = randomInt(0, 9);
    if (useSubtraction) {
      const c1 = randomInt(3, 9);
      const c2 = randomInt(2, c1 - 1);
      const d = (c1 - c2) * xVal + constant;
      return {
        id: nextId(),
        prompt: `${c1}x - ${c2}x + ${constant} = ${d}`,
        answer: xVal,
        operands: [c1, c2, constant, d],
        allowNegative: true,
      isEquation: true,
      };
    }
    const c1 = randomInt(2, 6);
    const c2 = randomInt(2, 6);
    const d = (c1 + c2) * xVal + constant;
    return {
      id: nextId(),
      prompt: `${c1}x + ${c2}x + ${constant} = ${d}`,
      answer: xVal,
      operands: [c1, c2, constant, d],
      allowNegative: true,
      isEquation: true,
    };
  });
}

/** Distribute, then gather x-terms from both sides: "a(x + b) = cx + d". */
export function generateDistributionBothSides(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 6);
    let c = randomInt(2, 6);
    while (c === a) c = randomInt(2, 6);
    const b = randomInt(1, 6);
    const xVal = randomInt(-6, 6);
    const d = (a - c) * xVal + a * b;
    const dOperator = d >= 0 ? "+" : "−";
    return {
      id: nextId(),
      prompt: `${a}(x + ${b}) = ${c}x ${dOperator} ${Math.abs(d)}`,
      answer: xVal,
      operands: [a, b, c, d],
      allowNegative: true,
      isEquation: true,
    };
  });
}

/** Multi-step: distribute, subtract a constant, gather x-terms from both sides —
 * the capstone, synthesizing every earlier Equations stripe. */
export function generateMultiStepEquation(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 6);
    const b = randomInt(1, 6);
    const e = randomInt(1, 9);
    let c = randomInt(2, 6);
    while (c === a) c = randomInt(2, 6);
    const xVal = randomInt(-6, 6);
    const d = (a - c) * xVal + a * b - e;
    const dOperator = d >= 0 ? "+" : "−";
    return {
      id: nextId(),
      prompt: `${a}(x + ${b}) - ${e} = ${c}x ${dOperator} ${Math.abs(d)}`,
      answer: xVal,
      operands: [a, b, e, c, d],
      allowNegative: true,
      isEquation: true,
    };
  });
}

const FUNCTION_MACHINE_RULES = [
  { label: "× 2", apply: (x: number) => x * 2 },
  { label: "× 3", apply: (x: number) => x * 3 },
  { label: "+ 4", apply: (x: number) => x + 4 },
  { label: "+ 7", apply: (x: number) => x + 7 },
];

/** Reads a function machine — an input, a rule, and the revealed output. */
export function generateFunctionMachineReading(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const rule = FUNCTION_MACHINE_RULES[randomInt(0, FUNCTION_MACHINE_RULES.length - 1)];
    const input = randomInt(2, 9);
    const output = rule.apply(input);
    return {
      id: nextId(),
      prompt: "",
      answer: output,
      operands: [input, output],
      diagram: { kind: "functionMachine" as const, input, rule: rule.label, output },
    };
  });
}

/** Evaluate a linear function f(x) = ax + b for a positive input. */
export function generateEvaluateFunctionPositive(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(0, 9);
    const xVal = randomInt(1, 9);
    return {
      id: nextId(),
      prompt: `f(x) = ${a}x + ${b}, find f(${xVal})`,
      answer: a * xVal + b,
      operands: [a, b, xVal],
    };
  });
}

/** Evaluate a linear function f(x) = ax + b for a negative input. */
export function generateEvaluateFunctionNegative(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(0, 9);
    const xVal = randomInt(-9, -1);
    return {
      id: nextId(),
      prompt: `f(x) = ${a}x + ${b}, find f(${xVal})`,
      answer: a * xVal + b,
      operands: [a, b, xVal],
      allowNegative: true,
    };
  });
}

/** Reads a rise-over-run staircase and reports the slope as a reduced fraction. */
export function generateSlopeStaircaseReading(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    let run = randomInt(2, 9);
    let rise = randomInt(1, 9);
    while (gcd(rise, run) !== 1) {
      run = randomInt(2, 9);
      rise = randomInt(1, 9);
    }
    return {
      id: nextId(),
      prompt: "",
      answer: rise,
      operands: [rise, run],
      secondaryAnswer: run,
      secondaryFormat: "fraction",
      diagram: { kind: "slopeStaircase" as const, rise, run },
    };
  });
}

/** Calculates slope from two labeled points — always a positive, already-reduced slope. */
export function generateSlopeFromTwoPoints(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    let run = randomInt(2, 9);
    let rise = randomInt(1, 9);
    while (gcd(rise, run) !== 1) {
      run = randomInt(2, 9);
      rise = randomInt(1, 9);
    }
    const x1 = randomInt(-5, 5);
    const y1 = randomInt(-5, 5);
    const x2 = x1 + run;
    const y2 = y1 + rise;
    return {
      id: nextId(),
      prompt: `Point A: (${x1}, ${y1}), Point B: (${x2}, ${y2})`,
      answer: rise,
      operands: [x1, y1, x2, y2],
      secondaryAnswer: run,
      secondaryFormat: "fraction",
    };
  });
}

/** The y-intercept of f(x) = ax + b is just b — read it directly. */
export function generateFindYIntercept(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const b = randomInt(1, 9);
    return {
      id: nextId(),
      prompt: `f(x) = ${a}x + ${b}, find the y-intercept`,
      answer: b,
      operands: [a, b],
    };
  });
}

/** Find the zero (x-intercept) of a linear function — solving ax + b = 0. */
export function generateFindXIntercept(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    let xVal = randomInt(-9, 9);
    while (xVal === 0) xVal = randomInt(-9, 9);
    const b = -a * xVal;
    return {
      id: nextId(),
      prompt: `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0`,
      answer: xVal,
      operands: [a, b],
      allowNegative: true,
      isEquation: true,
    };
  });
}

/** Evaluate a simple quadratic f(x) = x² + c for a small input. */
export function generateEvaluateBasicQuadratic(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const c = randomInt(-9, 9);
    const xVal = randomInt(-6, 6);
    return {
      id: nextId(),
      prompt: `f(x) = x² ${c >= 0 ? "+" : "-"} ${Math.abs(c)}, find f(${xVal})`,
      answer: xVal * xVal + c,
      operands: [c, xVal],
      allowNegative: true,
    };
  });
}

/** Evaluate a full quadratic f(x) = x² + bx + c for a small input. */
export function generateEvaluateFullQuadratic(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const b = (Math.random() < 0.5 ? 1 : -1) * randomInt(2, 9);
    const c = randomInt(-9, 9);
    const xVal = randomInt(-6, 6);
    return {
      id: nextId(),
      prompt: `f(x) = x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}, find f(${xVal})`,
      answer: xVal * xVal + b * xVal + c,
      operands: [b, c, xVal],
      allowNegative: true,
    };
  });
}

/** Capstone: evaluate a linear function and a quadratic function at the same
 * input, then add the results — synthesizes every earlier Functions stripe. */
export function generateCombineFunctions(count: number): Problem[] {
  return withoutImmediateRepeats(count, () => {
    const a = randomInt(2, 9);
    const bLin = randomInt(-9, 9);
    const bQuad = (Math.random() < 0.5 ? 1 : -1) * randomInt(2, 9);
    const cQuad = randomInt(-9, 9);
    const xVal = randomInt(-6, 6);
    const fVal = a * xVal + bLin;
    const gVal = xVal * xVal + bQuad * xVal + cQuad;
    return {
      id: nextId(),
      prompt: `f(x) = ${a}x ${bLin >= 0 ? "+" : "-"} ${Math.abs(bLin)} and g(x) = x² ${bQuad >= 0 ? "+" : "-"} ${Math.abs(bQuad)}x ${cQuad >= 0 ? "+" : "-"} ${Math.abs(cQuad)}. Find f(${xVal}) + g(${xVal}).`,
      answer: fVal + gVal,
      operands: [a, bLin, bQuad, cQuad, xVal],
      allowNegative: true,
    };
  });
}
