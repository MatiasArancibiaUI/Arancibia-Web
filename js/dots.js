import { hashString, prefersReducedMotion } from './util.js';

// Gráficos de píxeles en canvas. Semilla fija para que el dibujo sea estable,
// colores leídos de los tokens y redibujo al cambiar el tema o el tamaño.
// El movimiento es lento y a baja frecuencia (12 cuadros por segundo) para que se lea como píxeles.

const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const seedOf = (canvas) => {
  const s = canvas.dataset.seed || '1';
  return /^\d+$/.test(s) ? Number(s) : hashString(s);
};

const tokens = () => {
  const cs = getComputedStyle(document.documentElement);
  const get = (n) => cs.getPropertyValue(n).trim();
  return { accent: get('--accent'), off: get('--dot-off'), offBlack: get('--dot-off-black'), soft: get('--accent-soft') };
};

const px = (ctx, x, y, r) => ctx.fillRect(x - r, y - r, r * 2, r * 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Columnas de píxeles naranjas de alturas distintas. En vivo, cada columna respira ±1 píxel.
function wave(ctx, w, h, rng, c, { progress, t }) {
  const pitch = Math.max(6, Math.min(11, h / 8));
  const r = pitch * 0.36;
  const cols = Math.floor(w / pitch);
  const rows = Math.max(3, Math.floor(h / pitch));
  const offX = (w - (cols - 1) * pitch) / 2;
  const phase = rng() * 10;
  ctx.fillStyle = c.accent;
  for (let i = 0; i < cols; i++) {
    const base = 0.32 + 0.16 * Math.sin(i * 0.31 + phase) + 0.1 * Math.sin(i * 0.9 + phase * 2);
    const spike = rng() < 0.16 ? rng() * 0.45 : rng() * 0.12;
    const floater = rng() < 0.22;
    let full = Math.max(2, Math.min(rows, Math.round((base + spike) * rows)));
    if (t) full = Math.max(2, Math.min(rows, full + Math.round(Math.sin(t * 1.1 + i * 0.45 + phase))));
    const height = Math.max(1, Math.round(full * easeOut(progress)));
    const x = offX + i * pitch;
    for (let j = 0; j < height; j++) px(ctx, x, h - r - 1 - j * pitch, r);
    if (progress >= 1 && floater && full < rows - 1) px(ctx, x, h - r - 1 - (full + 1) * pitch, r);
  }
}

// Píldora de píxeles: apagados grises, encendidos naranjas. En vivo, una columna la recorre.
function pill(ctx, w, h, rng, c, { progress, t }, canvas) {
  const fill = Number(canvas.dataset.fill || 0.5);
  const pitch = Math.max(4.5, Math.min(7, h / 9));
  const r = pitch * 0.32;
  const rad = h / 2;
  const cols = Math.floor(w / pitch);
  const rows = Math.floor(h / pitch);
  const offX = (w - (cols - 1) * pitch) / 2;
  const offY = (h - (rows - 1) * pitch) / 2;
  const phase = rng() * 10;
  const scan = t ? Math.floor((t * 9) % (cols + 12)) - 6 : -99;
  const inside = (x, y) => {
    const cx = Math.min(Math.max(x, rad), w - rad);
    return Math.hypot(x - cx, y - rad) <= rad - r;
  };
  for (let i = 0; i < cols; i++) {
    const v = fill * (0.75 + 0.35 * Math.sin(i * 0.45 + phase)) + (rng() < 0.2 ? rng() * 0.3 : rng() * 0.08);
    const lit = Math.round(Math.min(1, v) * rows * easeOut(progress));
    const near = Math.abs(i - scan) <= 1;
    for (let j = 0; j < rows; j++) {
      const x = offX + i * pitch;
      const y = offY + (rows - 1 - j) * pitch;
      if (!inside(x, y)) continue;
      ctx.fillStyle = j < lit ? c.accent : near ? c.soft : c.off;
      px(ctx, x, y, r);
    }
  }
}

// Anillo de partículas para la tarjeta de acento; gira muy despacio.
function ring(ctx, w, h, rng, c, { t }) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.4;
  const n = Math.round(Math.min(1400, R * 9));
  const angle = t * 0.05;
  ctx.fillStyle = c.accent;
  for (let k = 0; k < n; k++) {
    const a = rng() * Math.PI * 2;
    const g = (rng() + rng() + rng() - 1.5) / 1.5;
    const wob = 0.07 * Math.sin(a * 5 + 1.3) + 0.04 * Math.sin(a * 11);
    const rr = R * (1 + g * 0.16 + wob);
    const size = 0.5 + rng() * 1.1;
    ctx.globalAlpha = 0.25 + rng() * 0.7;
    px(ctx, cx + Math.cos(a + angle) * rr, cy + Math.sin(a + angle) * rr, size);
  }
  ctx.globalAlpha = 1;
}

// Ilustración: dispersión de píxeles con tendencia que sube; el último punto late.
function scatter(ctx, w, h, rng, c, { t }) {
  const pitch = Math.max(7, Math.min(10, h / 12));
  const r = pitch * 0.3;
  const cols = Math.floor(w / pitch);
  const rows = Math.floor(h / pitch);
  const offX = (w - (cols - 1) * pitch) / 2;
  const offY = (h - (rows - 1) * pitch) / 2;
  const lit = new Set();
  let last = null;
  for (let i = 0; i < cols; i++) {
    const p = i / Math.max(1, cols - 1);
    const trend = 0.15 + 0.7 * p + 0.08 * Math.sin(p * 7);
    const center = Math.round(trend * (rows - 1));
    const spread = rng() < 0.5 ? 1 : 2;
    for (let s = 0; s < spread; s++) {
      const j = center + Math.round((rng() - 0.5) * 4);
      if (j >= 0 && j < rows) {
        lit.add(`${i}:${j}`);
        last = [i, j];
      }
    }
  }
  const blink = t ? Math.sin(t * 3) > 0 : true;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const isLast = last && last[0] === i && last[1] === j;
      ctx.fillStyle = lit.has(`${i}:${j}`) && (!isLast || blink) ? c.accent : c.off;
      px(ctx, offX + i * pitch, offY + (rows - 1 - j) * pitch, r);
    }
  }
}

// Portada de proyecto: patrón de píxeles derivado del id.
function cover(ctx, w, h, rng, c) {
  const pitch = Math.max(8, Math.min(12, h / 10));
  const r = pitch * 0.32;
  const cols = Math.floor(w / pitch);
  const rows = Math.floor(h / pitch);
  const offX = (w - (cols - 1) * pitch) / 2;
  const offY = (h - (rows - 1) * pitch) / 2;
  const kind = Math.floor(rng() * 4);
  const cx = cols * (0.3 + rng() * 0.4);
  const cy = rows * (0.3 + rng() * 0.4);
  const k = 0.25 + rng() * 0.35;
  const isOn = (i, j) => {
    switch (kind) {
      case 0: return Math.abs(Math.hypot(i - cx, (j - cy) * 1.1) - rows * 0.32) < 1.1;
      case 1: return (i + j * 2) % 9 < 2;
      case 2: return j > rows - rows * (0.25 + 0.5 * Math.abs(Math.sin(i * k + cx))) && i % 2 === 0;
      default: return (i > cx - 3 && i < cx + 3 && j > cy - 3 && j < cy + 3) || ((i - j) % 7 === 0 && i > cx);
    }
  };
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      ctx.fillStyle = isOn(i, j) ? c.accent : c.off;
      px(ctx, offX + i * pitch, offY + j * pitch, r);
    }
  }
}

const KINDS = { wave, pill, ring, scatter, cover };
const LIVE = new Set(['wave', 'pill', 'ring', 'scatter']);
const GROWS = new Set(['wave', 'pill']);
const mounted = new Set();
let grewOnce = false;

function draw(entry, state = { progress: 1, t: 0 }) {
  const { canvas } = entry;
  const fn = KINDS[canvas.dataset.kind];
  const rect = canvas.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  if (!fn || w < 4 || h < 4) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const c = tokens();
  if (canvas.closest('.black')) c.off = c.offBlack;
  fn(ctx, w, h, mulberry32(seedOf(canvas)), c, state, canvas);
}

// Bucle por canvas vivo: crece una vez y después se mueve despacio.
function run(entry, grow) {
  const start = performance.now();
  let lastFrame = 0;
  const step = (now) => {
    if (entry.dead) return;
    entry.raf = requestAnimationFrame(step);
    if (document.hidden || now - lastFrame < 83) return;
    lastFrame = now;
    const elapsed = now - start;
    const progress = grow ? Math.min(1, elapsed / 520) : 1;
    draw(entry, { progress, t: elapsed / 1000 });
  };
  entry.raf = requestAnimationFrame(step);
}

export function mountDots(root) {
  const entries = [...root.querySelectorAll('canvas[data-kind]')].map((canvas) => ({ canvas, raf: 0, dead: false }));
  const reduced = prefersReducedMotion();
  const ro = new ResizeObserver((items) => {
    for (const it of items) {
      const entry = entries.find((e) => e.canvas === it.target);
      if (entry && !entry.raf) draw(entry);
    }
  });
  for (const entry of entries) {
    mounted.add(entry);
    const kind = entry.canvas.dataset.kind;
    if (!reduced && LIVE.has(kind)) run(entry, !grewOnce && GROWS.has(kind));
    else draw(entry);
    ro.observe(entry.canvas);
  }
  if (entries.some((e) => GROWS.has(e.canvas.dataset.kind))) grewOnce = true;
  return () => {
    ro.disconnect();
    for (const entry of entries) {
      entry.dead = true;
      cancelAnimationFrame(entry.raf);
      mounted.delete(entry);
    }
  };
}

export function redrawAll() {
  for (const entry of mounted) if (!entry.raf) draw(entry);
}

window.addEventListener('themechange', redrawAll);
