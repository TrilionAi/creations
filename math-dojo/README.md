# Math Dojo

A belt-ranked math practice game, inspired by the Kumon method's small-step worksheets — adapted into a martial-arts belt system with its own progression, mastery rules, and playable-in-the-browser format.

## Concept

- **Belts instead of worksheet levels**: White → Blue → Purple → Brown → Black (6 degrees) → Coral, each mapped to one area of math (Addition, Subtraction, Multiplication, Division, then Fractions/Decimals/Algebra/Equations/Functions/Pre-Calculus, finishing with Calculus I).
- **Stripes instead of worksheet packs**: each belt breaks into a handful of stripes, and each stripe teaches exactly one small technique — a worked example first, self-taught, no lecture — then drills it hard.
- **Real Kumon-style volume**: a stripe isn't "solve 10 problems and move on" — it's several pages of a dozen problems each (72–108 per stripe on White Belt), the same repeat-until-automatic volume as an actual Kumon booklet. Problems are generated on the fly (never hand-authored, so the well never runs dry), and the generator avoids repeating the same two numbers back to back so a page doesn't feel like the same problem copy-pasted.
- **Mastery-gated progression**: a stripe is only marked earned once you clear the whole multi-page drill at a minimum accuracy *and* average speed. Miss either bar and you retry with a freshly generated set.
- **Self-correction loop**: get a problem wrong and it goes to the back of the queue instead of just being marked wrong — you see the right answer immediately and solve it again before moving on, the same way Kumon has students check and fix their own work.
- **Real breathers between pages**: finishing a page pauses on a "page complete" screen with a button — it waits for you, so stepping away for water or a call doesn't cost you the page.
- **Color-linked worked examples**: lesson steps that carry a number forward (a carry digit, a borrow, a split-apart piece) highlight that number in the same accent color everywhere it reappears, so the eye can follow it step to step instead of re-deriving where it came from.
- **Visual diagrams on the foundational lessons**: the first stripe of each belt gets a concrete picture, not just text — a dot array clustered into equal groups for multiplication/division, a hop-by-hop number line for addition/subtraction, a shaded bar for fractions/decimals, a labeled "variable box" beside unit squares for algebra — since the first lesson of anything is the one that has to land hardest. Some diagrams appear on every problem in a drill, not just the lesson, when reading the picture *is* the skill (identifying a shaded fraction).
- **Negative numbers**: Algebra's integer-arithmetic stripes can have a negative answer, so the number pad grows a "± negative" toggle for exactly those problems — invisible everywhere else in the app.
- **Black Belt is organized into named degrees**: unlike the arithmetic belts' flat stripe list, Black Belt groups its (eventually ~60) stripes under labeled sections — Fractions, Decimals, Algebra, Equations, Functions, Pre-Calculus — each with its own progress marker on the belt.
- Progress is saved locally in the browser (`localStorage`) — no account needed.
- Ships in **English, Portuguese and Spanish** with an in-app switcher (auto-detected from the browser on first visit).

## Status

The engine (lesson → multi-page timed drill → mastery scoring → belt map) is built once and reused for every belt. Content so far:

- **White Belt (Addition)** — all 10 stripes: within 10, within 20, three addends, 2-digit+1-digit (no/with carry), 2-digit+2-digit (no/with carry), 3-digit+3-digit (no/single/double carry).
- **Blue Belt (Subtraction)** — all 10 stripes, same progression mirrored for subtraction: within 10, within 20 (bridging back through ten), three-number chains, 2-digit−1-digit (no/with borrow), 2-digit−2-digit (no/with borrow), 3-digit−3-digit (no/single/double borrow).
- **Purple Belt (Multiplication)** — all 10 stripes: the friendly ×2/×5/×10 tables, ×3/×4, the hard ×6/×7/×8/×9 facts, all single-digit tables mixed, ×10/×100 place-value shifts, 2-digit×1-digit (no/with carry), 2-digit×2-digit, 3-digit×1-digit, 3-digit×2-digit.
- **Brown Belt (Division)** — all 10 stripes: exact division (the inverse of a times-table fact), division with a remainder, ÷10/÷100, 2-digit÷1-digit (no/with remainder), 3-digit÷1-digit (no/with remainder), an intro to two-digit divisors, and 3-digit÷2-digit full long division (no/with remainder) as the capstone. Remainder problems use a two-part answer — a quotient box and a separate "R" box.
- **Black Belt · Degree 1 (Fractions)** — 10 stripes: what a fraction means (with a shaded-bar diagram on every drill problem, not just the lesson), equivalent fractions, simplifying, a fraction of a whole number, adding/subtracting with matching denominators, adding with different denominators, multiplying, dividing, and converting mixed numbers to improper fractions. Fraction answers render as a real stacked fraction (numerator over a bar over denominator), not squeezed into one line.
- **Black Belt · Degree 2 (Decimals)** — 10 stripes: what a decimal means (with a shaded-bar diagram on every drill problem, reusing the fraction visual since a decimal *is* a fraction of ten), tenths as fractions and as mixed numbers, adding/subtracting decimals (no carry/borrow, then with), multiplying by 10 and 100 and dividing a whole number by 10 (echoing Purple Belt's place-value shift trick), and rounding to the nearest whole number as the capstone. Decimal answers render as a whole-number box and a tenths-digit box split by a "." — tenths only, by design, to avoid leading-zero ambiguity in a second box.
- **Black Belt · Degree 3 (Algebra)** — 10 stripes: what a variable means (a labeled "x" box beside unit squares, revealing what it holds), evaluating expressions, order of operations, negative numbers on the number line, adding integers (same sign, then different signs), subtracting integers, combining like terms, the distributive property (echoing Purple Belt's split-into-tens trick, now with a variable), and a multi-step capstone that distributes, evaluates for a possibly-negative x, and finishes the arithmetic — synthesizing everything in the degree. This is the first content to need negative answers, so the number pad grows a "± negative" toggle exactly where a stripe's problems call for it.

Coral Belt and Black Belt's remaining 3 degrees are on the map as "coming soon" — same engine, new content to be filled in degree by degree.

Add `?unlock=all` to the URL to browse every stripe's lesson directly from the map without playing through the real progression — useful for reviewing content, not part of the normal player experience.

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
