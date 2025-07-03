// --- HOMEPAGE ANIMATION ---
function pmAnimHomepage() {
  const canvas = document.getElementById('pm-home-anim');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Draw dots
    for(let x=32;x<=288;x+=32) {
      ctx.beginPath();
      ctx.arc(x,60,5,0,2*Math.PI);
      ctx.fillStyle="#fff";
      ctx.globalAlpha = 0.5 + 0.5*Math.sin(t/11 + x);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Pac-Man
    let px = 32 + ((t*2)%256);
    let mouth = Math.abs(Math.sin(t/7))*Math.PI/4+0.15;
    ctx.save();
    ctx.translate(px,60);
    ctx.beginPath();
    ctx.arc(0,0,22,mouth,2*Math.PI-mouth,false);
    ctx.lineTo(0,0);
    ctx.closePath();
    ctx.fillStyle="#ffe900"; ctx.strokeStyle="#d8c800"; ctx.lineWidth=2;
    ctx.shadowColor="#ffe900"; ctx.shadowBlur=8;
    ctx.fill(); ctx.shadowBlur=0;
    ctx.stroke();
    // Eye
    ctx.beginPath();
    ctx.arc(7,-8,3,0,2*Math.PI); ctx.fillStyle="#191970"; ctx.fill();
    ctx.restore();
    // Ghosts (Blinky, Pinky, Inky, Clyde)
    const ghostColors = ["#ff4444","#ffb8ff","#00eaff","#ffb847"];
    for(let i=0;i<4;++i) {
      let gx = 170+48*i - ((t*2)%256);
      ctx.save();
      ctx.translate(gx,60);
      // Body
      ctx.beginPath();
      ctx.arc(0,0,18,Math.PI,0);
      ctx.lineTo(18,20);
      for(let j=0;j<5;++j)
        ctx.lineTo(18-36*(j%2)/4,20+4*(j%2));
      ctx.lineTo(-18,20);
      ctx.closePath();
      ctx.fillStyle=ghostColors[i]; ctx.fill();
      // Eyes
      ctx.beginPath();
      ctx.arc(-7,-3,4,0,2*Math.PI);
      ctx.arc(7,-3,4,0,2*Math.PI);
      ctx.fillStyle="#fff"; ctx.fill();
      ctx.beginPath();
      ctx.arc(-7,-2,2,0,2*Math.PI);
      ctx.arc(7,-2,2,0,2*Math.PI);
      ctx.fillStyle="#191970"; ctx.fill();
      ctx.restore();
    }
    t++;
    requestAnimationFrame(draw);
  }
  draw();
}


// --- LOGIN/REGISTER LOGIC ---
let pmCurrentUser = "";
function pmSaveUser(u, p) {
  localStorage.setItem('pm-user-'+u, JSON.stringify({ password: p }));
}
function pmGetUser(u) {
  try { return JSON.parse(localStorage.getItem('pm-user-'+u)); } catch(e){ return null; }
}
function pmSetMsg(id, msg, ok) {
  let el = document.getElementById(id);
  el.textContent = msg;
  el.style.color = ok ? "#86ffae" : "#ff6060";
}
function pmLogin() {
  let u = document.getElementById('pm-login-user').value.trim();
  let p = document.getElementById('pm-login-pass').value;
  let user = pmGetUser(u);
  if (!u || !p) return pmSetMsg('pm-login-msg',"Enter username & password.");
  if (!user) return pmSetMsg('pm-login-msg',"User not found.");
  if (user.password !== p) return pmSetMsg('pm-login-msg',"Wrong password.");
  pmCurrentUser = u;
  document.getElementById('pm-auth-overlay').style.display = "none";
  document.getElementById('pm-userbar-welcome').textContent = "Hello, " + u + "!";
  document.getElementById('pm-userbar').style.display = "";
  pmOnLogin && pmOnLogin();
}
function pmRegister() {
  let u = document.getElementById('pm-reg-user').value.trim();
  let p = document.getElementById('pm-reg-pass').value;
  if (!u || !p) return pmSetMsg('pm-register-msg',"Enter username & password.", false);
  if (pmGetUser(u)) return pmSetMsg('pm-register-msg',"User already exists.", false);
  pmSaveUser(u, p);
  pmSetMsg('pm-register-msg',"Registered! You can sign in now.", true);
}
function pmShowLogin() {
  document.getElementById('pm-login-box').style.display = "";
  document.getElementById('pm-register-box').style.display = "none";
  pmSetMsg('pm-login-msg',"",true);pmSetMsg('pm-register-msg',"",true);
}
function pmShowRegister() {
  document.getElementById('pm-login-box').style.display = "none";
  document.getElementById('pm-register-box').style.display = "";
  pmSetMsg('pm-login-msg',"",true);pmSetMsg('pm-register-msg',"",true);
}
function pmLogout() {
  pmCurrentUser = "";
  document.getElementById('pm-userbar').style.display = "none";
  document.getElementById('pm-auth-overlay').style.display = "flex";
  pmShowLogin();
  pmOnLogout && pmOnLogout();
}
function pmGoHome() {
  document.getElementById('pm-homepage').style.display = "";
  document.getElementById('pm-auth-overlay').style.display = "none";
  document.getElementById('pm-userbar').style.display = "none";
  pmOnLogout && pmOnLogout();
}
function pmGoToLogin() {
  document.getElementById('pm-homepage').style.display = "none";
  document.getElementById('pm-auth-overlay').style.display = "flex";
  pmShowLogin();
}

window.pmLogin = pmLogin;
window.pmRegister = pmRegister;
window.pmShowLogin = pmShowLogin;
window.pmShowRegister = pmShowRegister;
window.pmLogout = pmLogout;
window.pmGoHome = pmGoHome;
window.pmGoToLogin = pmGoToLogin;


// --- INIT HOMEPAGE ---
window.addEventListener('DOMContentLoaded',function(){
  pmAnimHomepage();
  pmGoHome();
});

// --- INTEGRATION HOOKS ---
// Call this in your Pac-Man game to start on login:
window.pmOnLogin = function() {
  // E.g. startGame();
  // You can use pmCurrentUser to save scores
  // Example:
  if (typeof startGame === "function") startGame();
};
// Call this to pause/stop game on logout/home:
window.pmOnLogout = function() {
  // E.g. stopGame();
  if (typeof stopGame === "function") stopGame();
};
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
