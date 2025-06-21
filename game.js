const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

// Map legend: 0 = empty, 1 = wall, 2 = dot
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,1,1,1,2,2,2,2,1,1,1,2,1],
  [1,2,1,0,1,2,1,1,2,1,0,1,2,1],
  [1,2,1,0,1,2,1,1,2,1,0,1,2,1],
  [1,2,2,2,2,2,2,0,2,2,2,2,2,1],
  [1,2,1,0,1,1,1,1,1,1,0,1,2,1],
  [1,2,1,0,1,0,0,0,1,1,0,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const tileSize = 32;
let pacman = {x:1, y:1, color:"yellow"};
let ghost = {x:12, y:8, color:"red"};
let direction = {x:0, y:0};      // Pac-Man's direction
let ghostDir = {x:0, y:0};       // Ghost's direction
let gameOver = false;
let dotCount = 0;

// Count total dots
for (let row of map) for (let v of row) if (v === 2) dotCount++;

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  for (let y=0; y<map.length; y++) {
    for (let x=0; x<map[0].length; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "#338";
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      } else if (map[y][x] === 2) {
        ctx.fillStyle = "#ff0";
        ctx.beginPath();
        ctx.arc(x*tileSize+tileSize/2, y*tileSize+tileSize/2, 5, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  // Draw Pac-Man
  ctx.fillStyle = pacman.color;
  ctx.beginPath();
  ctx.arc(pacman.x*tileSize+tileSize/2, pacman.y*tileSize+tileSize/2, tileSize/2-2, 0, Math.PI*2);
  ctx.fill();

  // Draw Ghost
  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.arc(ghost.x*tileSize+tileSize/2, ghost.y*tileSize+tileSize/2, tileSize/2-2, 0, Math.PI*2);
  ctx.fill();
}

// Check for wall
function canMove(x, y) {
  return map[y] && map[y][x] !== 1;
}

// Move Pac-Man
function movePacman() {
  let nx = pacman.x + direction.x;
  let ny = pacman.y + direction.y;
  if (canMove(nx, ny)) {
    pacman.x = nx;
    pacman.y = ny;
    // Eat dot
    if (map[ny][nx] === 2) {
      map[ny][nx] = 0;
      dotCount--;
    }
  }
}

// Move Ghost
function moveGhost() {
  let nx = ghost.x + ghostDir.x;
  let ny = ghost.y + ghostDir.y;
  if (canMove(nx, ny)) {
    ghost.x = nx;
    ghost.y = ny;
  }
}

// Game loop
function loop() {
  if (gameOver) return;
  movePacman();
  moveGhost();
  draw();
  // Check win/lose
  if (pacman.x === ghost.x && pacman.y === ghost.y) {
    statusEl.textContent = "Game Over – Ghost Wins!";
    gameOver = true;
    return;
  }
  if (dotCount === 0) {
    statusEl.textContent = "You Win – Pac-Man ate all the dots!";
    gameOver = true;
    return;
  }
  requestAnimationFrame(loop);
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (gameOver) return;
  // Pac-Man: Arrow keys
  if (e.key === "ArrowUp") direction = {x:0, y:-1};
  if (e.key === "ArrowDown") direction = {x:0, y:1};
  if (e.key === "ArrowLeft") direction = {x:-1, y:0};
  if (e.key === "ArrowRight") direction = {x:1, y:0};
  // Ghost: W/A/S/D
  if (e.key === "w" || e.key === "W") ghostDir = {x:0, y:-1};
  if (e.key === "s" || e.key === "S") ghostDir = {x:0, y:1};
  if (e.key === "a" || e.key === "A") ghostDir = {x:-1, y:0};
  if (e.key === "d" || e.key === "D") ghostDir = {x:1, y:0};
});

// Start game
draw();
statusEl.textContent = "";
setTimeout(loop, 500);