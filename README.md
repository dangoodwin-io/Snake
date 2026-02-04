# Snake

Minimal, dependency-free Snake implemented with plain HTML/CSS/JS and a small logic module.

## Getting started
- Install Node 18+ (for the test script).
- Tests: `npm test`
- Dev server: `npm run dev` then open http://localhost:8000
- Build placeholder: `npm run build` (no build step needed for static files)

## Gameplay
- Controls: Arrow keys or WASD; on-screen buttons also work.
- Restart button resets the run; score increments by 10 per food.
- Game ends on wall or self collision; win when the board fills.

## Project layout
- `index.html` – markup for the board, score, controls.
- `style.css` – minimal dark grid styling.
- `main.js` – DOM wiring, rendering, and loop.
- `logic.js` – pure game engine (tick, food placement, collisions).
- `tests/logic.test.js` – logic tests run with Node.
