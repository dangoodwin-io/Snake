import assert from 'node:assert';
import { createInitialState, queueDirection, tick, Direction, placeFood, isWin } from '../logic.js';

function rngFrom(values) {
  let idx = 0;
  return () => {
    const v = values[idx % values.length];
    idx += 1;
    return v;
  };
}

function advanceSteps(state, steps, rng) {
  let s = state;
  for (let i = 0; i < steps; i++) {
    s = tick(s, rng);
  }
  return s;
}

// Movement forward
{
  const state = createInitialState(10, rngFrom([0.1]));
  const next = tick(state);
  assert.deepStrictEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
}

// Direction queue rejects reverse
{
  const state = createInitialState(10);
  const afterQueue = queueDirection(state, Direction.LEFT); // reverse of initial right
  assert.strictEqual(afterQueue.pendingDirection, Direction.RIGHT);
}

// Growth when eating food
{
  const rng = rngFrom([0]);
  let state = createInitialState(6, rng);
  // place food directly in front of head for deterministic eat
  const head = state.snake[0];
  state.food = { x: head.x + 1, y: head.y };
  state = tick(state, rng);
  assert.strictEqual(state.snake.length, 2);
  assert.strictEqual(state.score, 10);
}

// Wall collision ends game
{
  let state = createInitialState(3);
  // move right until hit wall (initial at 1,1 -> move twice)
  state = advanceSteps(state, 2);
  assert.strictEqual(state.alive, false);
}

// Self collision detection
{
  const state = {
    gridSize: 5,
    snake: [
      { x: 2, y: 2 }, // head
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    direction: Direction.RIGHT,
    pendingDirection: Direction.LEFT, // will move into its own body at (1,2)
    food: { x: 4, y: 4 },
    score: 0,
    alive: true,
    tick: 0,
  };
  const after = tick(state);
  assert.strictEqual(after.alive, false);
}

// placeFood never on snake, returns null when full
{
  const snake = [{ x: 0, y: 0 }];
  const food = placeFood(snake, 2, rngFrom([0]));
  assert.notDeepStrictEqual(food, snake[0]);

  const fullSnake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];
  assert.strictEqual(placeFood(fullSnake, 2), null);
}

// Win condition when board full of snake and alive
{
  const state = {
    gridSize: 2,
    snake: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    food: null,
    score: 30,
    alive: true,
    direction: Direction.RIGHT,
    pendingDirection: Direction.RIGHT,
    tick: 5,
  };
  assert.strictEqual(isWin(state), true);
}

console.log('All snake logic tests passed.');
