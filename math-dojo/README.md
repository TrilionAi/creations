# Math Dojo

A belt-ranked math practice game, inspired by the Kumon method's small-step worksheets — adapted into a martial-arts belt system with its own progression, mastery rules, and playable-in-the-browser format.

## Concept

- **Belts instead of worksheet levels**: White → Blue → Purple → Brown → Black (6 degrees) → Coral, each mapped to one area of math (Addition, Subtraction, Multiplication, Division, then Fractions/Decimals/Algebra/Equations/Functions/Pre-Calculus, finishing with Calculus I).
- **Stripes instead of worksheet packs**: each belt breaks into a handful of stripes, and each stripe teaches exactly one small technique — a worked example first, self-taught, no lecture — then drills it hard.
- **Real Kumon-style volume**: a stripe isn't "solve 10 problems and move on" — it's several pages of a dozen problems each (72–108 per stripe on White Belt), the same repeat-until-automatic volume as an actual Kumon booklet. Problems are generated on the fly (never hand-authored, so the well never runs dry), and the generator avoids repeating the same two numbers back to back so a page doesn't feel like the same problem copy-pasted.
- **Mastery-gated progression**: a stripe is only marked earned once you clear the whole multi-page drill at a minimum accuracy *and* average speed. Miss either bar and you retry with a freshly generated set.
- **Self-correction loop**: get a problem wrong and it goes to the back of the queue instead of just being marked wrong — you see the right answer immediately and solve it again before moving on, the same way Kumon has students check and fix their own work.
- **Real breathers between pages**: finishing a page pauses on a "page complete" screen with a button — it waits for you, so stepping away for water or a call doesn't cost you the page.
- Progress is saved locally in the browser (`localStorage`) — no account needed.
- Ships in **English, Portuguese and Spanish** with an in-app switcher (auto-detected from the browser on first visit).

## Status

MVP slice: the full game engine (lesson → multi-page timed drill → mastery scoring → belt map) is built and working end-to-end for **White Belt (Addition)**, all 10 stripes:

1. Adding within 10
2. Adding within 20 (crossing ten)
3. Adding three numbers
4. Two-digit + one-digit, no carrying
5. Two-digit + one-digit, with carrying
6. Two-digit + two-digit, no carrying
7. Two-digit + two-digit, with carrying
8. Three-digit + three-digit, no carrying
9. Three-digit + three-digit, one carry
10. Three-digit + three-digit, double carry

Blue/Purple/Brown/Black/Coral belts are on the map as "coming soon" — same engine, new content to be filled in belt by belt.

Live at **https://trilionai.github.io/creations/**.

## Stack

React 19 + TypeScript + Vite. No backend, no runtime dependencies beyond React — plain CSS (custom properties for the design system, CSS Modules per component). Deployed to GitHub Pages via `.github/workflows/math-dojo-build.yml`.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```
