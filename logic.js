// Pure game logic for classic Snake. No DOM dependencies.

export const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

export function oppositeDirection(dirA, dirB) {
  return (
    (dirA === Direction.UP && dirB === Direction.DOWN) ||
    (dirA === Direction.DOWN && dirB === Direction.UP) ||
    (dirA === Direction.LEFT && dirB === Direction.RIGHT) ||
    (dirA === Direction.RIGHT && dirB === Direction.LEFT)
  );
}

export function createInitialState(gridSize = 20, rng = Math.random) {
  const mid = Math.floor(gridSize / 2);
  const snake = [{ x: mid, y: mid }];
  const food = placeFood(snake, gridSize, rng);
  return {
    gridSize,
    snake,
    direction: Direction.RIGHT,
    pendingDirection: Direction.RIGHT,
    food,
    score: 0,
    alive: true,
    tick: 0,
  };
}

export function placeFood(snake, gridSize, rng = Math.random) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const openCells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) openCells.push({ x, y });
    }
  }
  if (openCells.length === 0) return null;
  const choice = openCells[Math.floor(rng() * openCells.length)];
  return choice;
}

export function queueDirection(state, next) {
  if (!state.alive) return state;
  if (!Direction[next.toUpperCase?.()] && !Object.values(Direction).includes(next)) {
    return state;
  }
  const normalized = typeof next === 'string' ? next.toLowerCase() : next;
  if (oppositeDirection(normalized, state.direction)) {
    return state;
  }
  return { ...state, pendingDirection: normalized };
}

function advanceHead(head, direction) {
  switch (direction) {
    case Direction.UP:
      return { x: head.x, y: head.y - 1 };
    case Direction.DOWN:
      return { x: head.x, y: head.y + 1 };
    case Direction.LEFT:
      return { x: head.x - 1, y: head.y };
    case Direction.RIGHT:
    default:
      return { x: head.x + 1, y: head.y };
  }
}

export function tick(state, rng = Math.random) {
  if (!state.alive) return state;

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const nextHead = advanceHead(head, direction);

  // Wall collision
  if (
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.gridSize ||
    nextHead.y >= state.gridSize
  ) {
    return { ...state, alive: false };
  }

  // Self collision (include head move onto body)
  const occupied = new Set(state.snake.map((p) => `${p.x},${p.y}`));
  if (occupied.has(`${nextHead.x},${nextHead.y}`)) {
    return { ...state, alive: false };
  }

  const ateFood = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const newSnake = [nextHead, ...state.snake];
  if (!ateFood) {
    newSnake.pop();
  }

  let nextFood = state.food;
  let score = state.score;
  if (ateFood) {
    score += 10;
    nextFood = placeFood(newSnake, state.gridSize, rng);
  }

  return {
    ...state,
    snake: newSnake,
    direction,
    pendingDirection: direction,
    food: nextFood,
    score,
    tick: state.tick + 1,
  };
}

export function isWin(state) {
  return state.food === null && state.alive;
}
