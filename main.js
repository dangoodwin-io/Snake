import { createInitialState, Direction, queueDirection, tick, isWin } from './logic.js';

const gridSize = 20;
const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const controlButtons = document.querySelectorAll('[data-direction]');

document.documentElement.style.setProperty('--grid-size', gridSize);

let state = createInitialState(gridSize);
let timerId = null;
let tickMs = 140;

function buildBoard() {
  const total = gridSize * gridSize;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    fragment.appendChild(cell);
  }
  boardEl.appendChild(fragment);
}

function cellIndex(x, y) {
  return y * gridSize + x;
}

function render() {
  const cells = boardEl.children;
  // Clear classes
  for (const cell of cells) {
    cell.className = 'cell';
  }

  // Draw snake
  for (const segment of state.snake) {
    const idx = cellIndex(segment.x, segment.y);
    cells[idx]?.classList.add('snake');
  }

  // Draw food
  if (state.food) {
    const idx = cellIndex(state.food.x, state.food.y);
    cells[idx]?.classList.add('food');
  }

  scoreEl.textContent = `Score: ${state.score}`;
  if (!state.alive) {
    statusEl.textContent = 'Game over. Press restart';
  } else if (isWin(state)) {
    statusEl.textContent = 'You win! Press restart';
  } else {
    statusEl.textContent = 'Running';
  }
}

function stopLoop() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startLoop() {
  stopLoop();
  timerId = setInterval(() => {
    state = tick(state);
    render();
    if (!state.alive || isWin(state)) {
      stopLoop();
    }
  }, tickMs);
}

function restart() {
  state = createInitialState(gridSize);
  render();
  startLoop();
}

function handleDirection(input) {
  state = queueDirection(state, input);
}

function onKeydown(evt) {
  const key = evt.key.toLowerCase();
  const map = {
    arrowup: Direction.UP,
    w: Direction.UP,
    arrowdown: Direction.DOWN,
    s: Direction.DOWN,
    arrowleft: Direction.LEFT,
    a: Direction.LEFT,
    arrowright: Direction.RIGHT,
    d: Direction.RIGHT,
  };
  if (map[key]) {
    evt.preventDefault();
    handleDirection(map[key]);
  }
}

function wireControls() {
  document.addEventListener('keydown', onKeydown);
  restartBtn.addEventListener('click', restart);
  controlButtons.forEach((btn) => {
    btn.addEventListener('click', () => handleDirection(btn.dataset.direction));
  });
}

function init() {
  buildBoard();
  wireControls();
  render();
  startLoop();
}

init();
