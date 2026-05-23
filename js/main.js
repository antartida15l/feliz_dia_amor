/* ══════════════════════════════
   LIBERTAD BIRTHDAY — main.js
   Formas con crayón: corazones,
   globos, estrellas, tulipanes
══════════════════════════════ */

const PI2 = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

/* ─── CRAYÓN ENGINE ─────────────────── */
function drawCrayon(ctx, x1, y1, x2, y2, col, w) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.ceil(dist / 2);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    ctx.beginPath();
    ctx.arc(
      x1 + (x2 - x1) * t + rnd(-1.5, 1.5),
      y1 + (y2 - y1) * t + rnd(-1.5, 1.5),
      w * rnd(0.25, 1),
      0, PI2
    );
    ctx.fillStyle = col;
    ctx.globalAlpha = rnd(0.05, 0.22);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawPath(ctx, pts, col, w) {
  for (let i = 0; i < pts.length - 1; i++) {
    drawCrayon(ctx, pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1], col, w);
  }
}

/* ─── FORMAS ─────────────────────────── */
function heartPts(cx, cy, size, n = 55) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * PI2 - Math.PI;
    pts.push([
      cx + size * (16 * Math.pow(Math.sin(t), 3)) / 16,
      cy - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / 16
    ]);
  }
  pts.push(pts[0]);
  return pts;
}

function starPts(cx, cy, r1, r2, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i / (n * 2)) * PI2 - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  pts.push(pts[0]);
  return pts;
}

function balloonPts(cx, cy, rx, ry, n = 50) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * PI2;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}

function tulipPts(cx, cy, size) {
  const pts = [];
  // tallo
  const stem = [[cx, cy + size * 0.5], [cx, cy - size * 0.3]];
  // pétalo izq
  const left = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const a = Math.PI + t * Math.PI;
    left.push([cx - size * 0.55 * Math.sin(t * Math.PI) * 0.9, cy - size * 0.3 - t * size * 0.7]);
  }
  // pétalo der
  const right = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    right.push([cx + size * 0.55 * Math.sin(t * Math.PI) * 0.9, cy - size * 0.3 - t * size * 0.7]);
  }
  return { stem, left, right };
}

function diamondPts(cx, cy, r) {
  return [[cx, cy - r], [cx + r * 0.6, cy], [cx, cy + r], [cx - r * 0.6, cy], [cx, cy - r]];
}

function sparkle(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * PI2;
    const len = i % 2 === 0 ? r : r * 0.4;
    pts.push([cx + len * Math.cos(a), cy + len * Math.sin(a)]);
  }
  pts.push(pts[0]);
  return pts;
}

/* ─── FONDO CON FORMAS ──────────────── */
function buildBg(canvasId, colors) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  const col = () => colors[Math.floor(rnd(0, colors.length))];

  const drawers = [
    // Corazón
    () => {
      const x = rnd(30, w - 30), y = rnd(30, h - 30), s = rnd(10, 28);
      drawPath(ctx, heartPts(x, y, s), col(), rnd(1.2, 3));
    },
    // Estrella 5 puntas
    () => {
      const x = rnd(30, w - 30), y = rnd(30, h - 30);
      const r1 = rnd(12, 24), r2 = r1 * 0.42;
      drawPath(ctx, starPts(x, y, r1, r2, 5), col(), rnd(1, 2.5));
    },
    // Estrella 6 puntas (tulipán sim)
    () => {
      const x = rnd(30, w - 30), y = rnd(30, h - 30);
      const r1 = rnd(10, 20), r2 = r1 * 0.5;
      drawPath(ctx, starPts(x, y, r1, r2, 6), col(), rnd(1, 2));
    },
    // Globo oval + hilo
    () => {
      const x = rnd(30, w - 30), y = rnd(40, h - 60);
      const rx = rnd(10, 20), ry = rnd(14, 28);
      const c2 = col();
      drawPath(ctx, balloonPts(x, y, rx, ry), c2, rnd(1.2, 2.5));
      // hilo
      drawCrayon(ctx, x, y + ry, x + rnd(-6, 6), y + ry + rnd(18, 38), c2, 1);
    },
    // Globo corazón
    () => {
      const x = rnd(30, w - 30), y = rnd(40, h - 60), s = rnd(10, 22);
      const c2 = col();
      drawPath(ctx, heartPts(x, y, s), c2, rnd(1.5, 3));
      drawCrayon(ctx, x, y + s, x + rnd(-4, 4), y + s + rnd(16, 32), c2, 1);
    },
    // Tulipán
    () => {
      const x = rnd(30, w - 30), y = rnd(40, h - 30), s = rnd(14, 26);
      const c2 = col();
      const t = tulipPts(x, y, s);
      drawPath(ctx, t.stem, c2, 1.5);
      drawPath(ctx, t.left, c2, rnd(1, 2.5));
      drawPath(ctx, t.right, c2, rnd(1, 2.5));
    },
    // Diamante
    () => {
      const x = rnd(30, w - 30), y = rnd(30, h - 30), r = rnd(10, 20);
      drawPath(ctx, diamondPts(x, y, r), col(), rnd(1, 2.5));
    },
    // Sparkle / destello
    () => {
      const x = rnd(20, w - 20), y = rnd(20, h - 20), r = rnd(8, 18);
      drawPath(ctx, sparkle(x, y, r), col(), rnd(1, 2));
    },
    // Punto suelto
    () => {
      const x = rnd(10, w - 10), y = rnd(10, h - 10);
      const c2 = col();
      drawCrayon(ctx, x, y, x + rnd(-3, 3), y + rnd(-3, 3), c2, rnd(2, 5));
    },
  ];

  for (let i = 0; i < 70; i++) {
    drawers[Math.floor(rnd(0, drawers.length))]();
  }
}

/* ─── PALETAS ────────────────────────── */
const PAL1 = ['#c084fc', '#f472b6', '#818cf8', '#e879f9', '#fff', '#f9a8d4'];
const PAL2 = ['#f472b6', '#fbbf24', '#a78bfa', '#fff', '#f9a8d4', '#fde68a'];
const PAL3 = ['#c084fc', '#f9a8d4', '#fff', '#818cf8', '#e0e7ff'];

/* ─── DRUM / SLOT ────────────────────── */
let drumRunning = false;

// altura de cada número en px — debe coincidir con CSS
function drumItemH() {
  const outer = document.querySelector('.drum-outer');
  return outer ? outer.offsetHeight : 130;
}

function buildDrum() {
  const tape = document.getElementById('drum');
  tape.innerHTML = '';
  const H = drumItemH();
  // 7 loops × 30 = 210 items → target = loop6 + 22 = 6×30+22 = 202
  for (let loop = 0; loop < 7; loop++) {
    for (let n = 1; n <= 30; n++) {
      const d = document.createElement('div');
      d.className = 'drum-num';
      d.style.height = H + 'px';
      d.textContent = n;
      tape.appendChild(d);
    }
  }
}

function startDrum() {
  if (drumRunning) return;
  drumRunning = true;

  buildDrum();
  const tape = document.getElementById('drum');
  const H = drumItemH();
  const TARGET = 6 * 30 + 22; // shows "23"
  const totalDist = TARGET * H;
  const DURATION = 5000;
  const t0 = performance.now();

  function ease(t) { return 1 - Math.pow(1 - t, 5); }

  function frame(now) {
    const elapsed = now - t0;
    const p = Math.min(elapsed / DURATION, 1);
    const off = ease(p) * totalDist;
    tape.style.transform = `translateY(-${off}px)`;

    const vis = Math.round(off / H);
    Array.from(tape.children).forEach((el, i) => el.classList.toggle('lit', i === vis));

    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      tape.style.transform = `translateY(-${TARGET * H}px)`;
      Array.from(tape.children).forEach((el, i) => el.classList.toggle('lit', i === TARGET));
      drumRunning = false;

      // Aparece la torta
      const cake = document.getElementById('cake');
      cake.style.animationPlayState = 'running';

      // Aparece botón carta
      setTimeout(() => {
        document.getElementById('btn2').style.display = 'inline-block';
      }, 500);
    }
  }
  requestAnimationFrame(frame);
}

/* ─── FOTO ───────────────────────────── */
document.getElementById('pi').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const img = document.getElementById('pimg');
  img.src = URL.createObjectURL(f);
  img.style.display = 'block';
  document.getElementById('ptxt').style.display = 'none';
});

/* ─── NAVEGACIÓN ─────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ─── MÚSICA ─────────────────────────── */
function tryPlay() {
  const m = document.getElementById('bg-music');

  m.muted = false;
  m.volume = 0.5;

  m.play().catch(() => {
    console.log("Autoplay bloqueado");
  });
}

window.addEventListener('load', () => {
  const m = document.getElementById('bg-music');

  m.currentTime = 42; // minuto/segundo donde empieza
  m.muted = false;

  m.play().catch(() => {
    console.log("Autoplay bloqueado");
  });
});

/* ─── INIT ───────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  buildBg('c1', PAL1);
  buildBg('c2', PAL2);
  buildBg('c3', PAL3);

  document.getElementById('cake').style.animationPlayState = 'paused';

  document.getElementById('btn1').addEventListener('click', () => {
    tryPlay();
    showScreen('s2');
    setTimeout(startDrum, 500);
  });

  document.getElementById('btn2').addEventListener('click', () => {
    showScreen('s3');
  });

  window.addEventListener('resize', () => {
    buildBg('c1', PAL1);
    buildBg('c2', PAL2);
    buildBg('c3', PAL3);
  });
});