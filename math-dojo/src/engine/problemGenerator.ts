import type { Problem } from "../types";

let seedCounter = 0;

function nextId(): string {
  seedCounter += 1;
  return `p${seedCounter}-${Math.floor(Math.random() * 1e6)}`;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAddition(a: number, b: number): Problem {
  return {
    id: nextId(),
    prompt: `${a} + ${b}`,
    answer: a + b,
    operands: [a, b],
  };
}

/** Both single digits, sum never exceeds 10. */
export function generateAddWithin10(count: number): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < count; i += 1) {
    const a = randomInt(1, 9);
    const b = randomInt(1, Math.max(1, 10 - a));
    problems.push(makeAddition(a, b));
  }
  return problems;
}

/** Single digits, sums land in the 10-20 range at least half the time. */
export function generateAddWithin20(count: number): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < count; i += 1) {
    const forceTeen = i % 2 === 0;
    let a = randomInt(1, 9);
    let b = randomInt(1, 9);
    if (forceTeen && a + b < 11) {
      b = randomInt(11 - a, 9);
    }
    problems.push(makeAddition(a, b));
  }
  return problems;
}

/** Two-digit + two-digit, units and tens columns never carry. */
export function generateTwoDigitNoCarry(count: number): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < count; i += 1) {
    const aUnits = randomInt(0, 9);
    const bUnits = randomInt(0, 9 - aUnits);
    const aTens = randomInt(1, 8);
    const bTens = randomInt(1, 9 - aTens);
    const a = aTens * 10 + aUnits;
    const b = bTens * 10 + bUnits;
    problems.push(makeAddition(a, b));
  }
  return problems;
}

/** Two-digit + two-digit, units column always forces a carry into the tens. */
export function generateTwoDigitWithCarry(count: number): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < count; i += 1) {
    const aUnits = randomInt(2, 9);
    const bUnits = randomInt(10 - aUnits, 9);
    const aTens = randomInt(1, 8);
    const bTens = randomInt(1, 8);
    const a = aTens * 10 + aUnits;
    const b = bTens * 10 + bUnits;
    problems.push(makeAddition(a, b));
  }
  return problems;
}
