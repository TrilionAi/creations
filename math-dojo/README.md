# Math Dojo

A belt-ranked math practice game, inspired by the Kumon method's small-step worksheets — adapted into a martial-arts belt system with its own progression, mastery rules, and playable-in-the-browser format.

## Concept

- **Belts instead of worksheet levels**: White → Blue → Purple → Brown → Black (6 degrees) → Coral, each mapped to one area of math (Addition, Subtraction, Multiplication, Division, then Fractions/Decimals/Algebra/Equations/Functions/Pre-Calculus, finishing with Calculus I).
- **Stripes instead of worksheet packs**: each belt breaks into a handful of stripes, and each stripe teaches exactly one small technique — a worked example first, self-taught, no lecture — then drills it with a set of problems.
- **Mastery-gated progression**: a stripe is only marked earned once you clear its drill set at a minimum accuracy *and* average speed. Miss either bar and you retry with a freshly generated set — nothing is ever pre-scripted, so retries never repeat the same problems.
- **Self-correction loop**: get a problem wrong and it goes to the back of the queue instead of just being marked wrong — you see the right answer immediately and solve it again before moving on, the same way Kumon has students check and fix their own work.
- Progress is saved locally in the browser (`localStorage`) — no account needed.

## Status

MVP slice: the full game engine (lesson → timed drill → mastery scoring → belt map) is built and working end-to-end for **White Belt (Addition)**, all 4 stripes:

1. Adding within 10
2. Adding within 20 (crossing ten)
3. Two-digit addition, no carrying
4. Two-digit addition, with carrying

Blue/Purple/Brown/Black/Coral belts are on the map as "coming soon" — same engine, new content to be filled in belt by belt.

## Stack

React 19 + TypeScript + Vite. No backend, no runtime dependencies beyond React — plain CSS (custom properties for the design system, CSS Modules per component).

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```
