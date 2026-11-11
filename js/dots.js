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

// Los colores se leen una sola vez y se vuelven a leer al cambiar el tema: leerlos en cada cuadro fuerza un recálculo de estilos.
let tokenCache = null;
const tokens = () => {
  if (tokenCache) return { ...tokenCache };
  const cs = getComputedStyle(document.documentElement);
  const get = (n) => cs.getPropertyValue(n).trim();
  tokenCache = { accent: get('--accent'), off: get('--dot-off'), offBlack: get('--dot-off-black'), soft: get('--accent-soft'), onBlack: get('--on-black') };
  return { ...tokenCache };
};

let dprNow = 1;
const snap = (v) => Math.round(v * dprNow) / dprNow;
const px = (ctx, x, y, r) => {
  const s = Math.max(1, Math.round(r * 2 * dprNow)) / dprNow;
  ctx.fillRect(snap(x - r), snap(y - r), s, s);
};
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

// Globo de puntos blancos para la tarjeta de acento: paralelos y meridianos que giran despacio, polvo de
// partículas que titila alrededor, una línea de escaneo que lo recorre y lo ilumina, y cada tanto una
// franja que se corre como un glitch. Unas pocas partículas son naranjas.
function orb(ctx, w, h, rng, c, { t }) {
  // Centro un poco más abajo y radio acotado por el alto libre, para que el globo no tape la cabecera.
  const cx = w / 2;
  const cy = h * 0.56;
  const R = Math.min(w * 0.42, h * 0.38);
  const spin = t * 0.22;
  const tilt = 0.38;
  const scanY = t ? ((t * 55) % (h + 80)) - 40 : -999;
  const tick = Math.floor(t * 2);
  const glitchOn = t > 0 && (tick * 2654435761) % 7 === 0;
  const glitchY = (tick * 97) % Math.max(1, Math.round(h));
  const glitchDx = ((tick % 2) * 2 - 1) * 10;
  const shift = (y) => (glitchOn && Math.abs(y - glitchY) < 9 ? glitchDx : 0);

  // Polvo de fondo en toda la tarjeta.
  ctx.fillStyle = c.onBlack;
  for (let k = 0; k < 110; k++) {
    const x = rng() * w;
    const y = rng() * h;
    const ph = rng() * 6.28;
    ctx.globalAlpha = 0.06 + 0.16 * (0.5 + 0.5 * Math.sin(t * 1.6 + ph));
    px(ctx, x + shift(y), y, 0.6);
  }

  // Puntos del globo: paralelos y meridianos.
  const sphere = [];
  const L = 11;
  for (let li = 0; li < L; li++) {
    const u = -0.92 + (1.84 * li) / (L - 1);
    const count = Math.round(56 * Math.sqrt(1 - u * u)) + 6;
    for (let k = 0; k < count; k++) sphere.push([u, (Math.PI * 2 * k) / count + li * 0.3]);
  }
  const M = 9;
  for (let m = 0; m < M; m++) {
    for (let k = 1; k < 26; k++) sphere.push([-1 + (2 * k) / 26, (Math.PI * 2 * m) / M]);
  }
  const pts = sphere.map(([u, phi]) => {
    const rxy = Math.sqrt(1 - u * u);
    const x = rxy * Math.cos(phi);
    const z = rxy * Math.sin(phi);
    const x1 = x * Math.cos(spin) + z * Math.sin(spin);
    const z1 = -x * Math.sin(spin) + z * Math.cos(spin);
    const y2 = u * Math.cos(tilt) - z1 * Math.sin(tilt);
    const z2 = u * Math.sin(tilt) + z1 * Math.cos(tilt);
    const persp = 1 / (1.25 - z2 * 0.25);
    const sy = cy + y2 * R * persp;
    return { sx: cx + x1 * R * persp + shift(sy), sy, depth: (z2 + 1) / 2, hot: rng() < 0.03 };
  });
  pts.sort((p, q) => p.depth - q.depth);
  for (const p of pts) {
    const lit = Math.max(0, 1 - Math.abs(p.sy - scanY) / 14);
    ctx.globalAlpha = Math.min(1, 0.1 + 0.75 * p.depth * p.depth + lit * 0.6);
    ctx.fillStyle = p.hot ? c.accent : c.onBlack;
    px(ctx, p.sx, p.sy, 0.55 + p.depth * 0.85 + lit * 0.35);
  }
  if (t) {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = c.onBlack;
    ctx.fillRect(0, snap(scanY), w, 1 / dprNow);
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

// Borde que se disuelve en píxeles: la fila de abajo llena y cada vez menos píxeles hacia arriba.
// En vivo, los píxeles del borde titilan despacio.
function dissolve(ctx, w, h, rng, c, { t }) {
  const pitch = 6;
  const size = pitch - 1;
  const cols = Math.ceil(w / pitch);
  const rows = Math.max(2, Math.floor(h / pitch));
  ctx.fillStyle = c.accent;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const r0 = rng();
      const wobble = rng() * 6.28;
      const keep = Math.pow(1 - j / rows, 1.8);
      const flicker = t ? 0.12 * Math.sin(t * 1.4 + wobble) : 0;
      if (j > 0 && r0 + flicker > keep) continue;
      ctx.fillRect(snap(i * pitch), snap(h - (j + 1) * pitch), snap(size), snap(size));
    }
  }
}

// Ilustraciones de las etapas del proceso (#/proceso): cada una es una figura hecha de partículas blancas
// (líneas, arcos y rellenos muestreados). Al cambiar data-variant, las mismas partículas viajan en arco
// hasta la figura nueva. Comparte la estética del globo: profundidad, polvo, escaneo y glitch.
const STAGE_N = 680;
const TAU = Math.PI * 2;
const L = (x1, y1, x2, y2) => ['l', x1, y1, x2, y2];
const C = (x, y, r, a0 = 0, a1 = TAU) => ['c', x, y, r, a0, a1];
const F = (x1, y1, x2, y2, k = 1) => ['f', x1, y1, x2, y2, k];
const rect = (x1, y1, x2, y2) => [L(x1, y1, x2, y1), L(x2, y1, x2, y2), L(x2, y2, x1, y2), L(x1, y2, x1, y1)];

const SHAPES = {
  idear: () => {
    const rays = [];
    for (let k = 0; k < 7; k++) {
      const a = Math.PI + 0.25 + (k * (Math.PI - 0.5)) / 6;
      rays.push(L(Math.cos(a) * 0.74, -0.2 + Math.sin(a) * 0.74, Math.cos(a) * 0.9, -0.2 + Math.sin(a) * 0.9));
    }
    return [
      C(0, -0.2, 0.52, Math.PI / 2 + 0.62, Math.PI / 2 + TAU - 0.62),
      L(-0.3, 0.22, -0.2, 0.46), L(0.3, 0.22, 0.2, 0.46),
      L(-0.22, 0.5, 0.22, 0.5), L(-0.2, 0.6, 0.2, 0.6), L(-0.13, 0.7, 0.13, 0.7),
      L(-0.14, 0.12, -0.06, -0.16), L(-0.06, -0.16, 0.02, 0.06), L(0.02, 0.06, 0.1, -0.16), L(0.1, -0.16, 0.16, 0.12),
      ...rays,
    ];
  },
  investigar: () => [
    C(-0.14, -0.14, 0.5), C(-0.14, -0.14, 0.4, 3.5, 4.7),
    L(0.22, 0.22, 0.7, 0.7), L(0.27, 0.17, 0.75, 0.65), L(0.17, 0.27, 0.65, 0.75),
    F(-0.46, -0.46, 0.18, 0.18, 0.25),
  ],
  disenar: () => [
    ...rect(-0.82, -0.62, 0.82, 0.62), L(-0.82, -0.4, 0.82, -0.4),
    C(-0.72, -0.51, 0.035), C(-0.62, -0.51, 0.035), C(-0.52, -0.51, 0.035),
    L(-0.46, -0.4, -0.46, 0.62),
    ...rect(-0.34, -0.28, 0.12, 0.1), ...rect(0.22, -0.28, 0.7, 0.1), ...rect(-0.34, 0.2, 0.7, 0.5),
    F(-0.3, -0.24, 0.08, 0.06, 0.6),
    L(0.42, 0.28, 0.42, 0.5), L(0.42, 0.28, 0.58, 0.44), L(0.58, 0.44, 0.42, 0.5),
  ],
  validar: () => [
    C(0, 0, 0.64, 0.2, 2.9), C(0, 0, 0.64, 3.34, 6.05),
    L(0.62, 0.17, 0.7, 0.36), L(0.62, 0.17, 0.44, 0.25),
    L(-0.62, -0.17, -0.7, -0.36), L(-0.62, -0.17, -0.44, -0.25),
    L(-0.26, 0.02, -0.06, 0.22), L(-0.06, 0.22, 0.3, -0.2),
    L(-0.26, 0.08, -0.06, 0.28), L(-0.06, 0.28, 0.3, -0.14),
  ],
  documentar: () => [
    L(-0.46, -0.66, 0.22, -0.66), L(0.22, -0.66, 0.46, -0.42), L(0.46, -0.42, 0.46, 0.66), L(0.46, 0.66, -0.46, 0.66), L(-0.46, 0.66, -0.46, -0.66),
    L(0.22, -0.66, 0.22, -0.42), L(0.22, -0.42, 0.46, -0.42),
    L(-0.32, -0.36, 0.06, -0.36), L(-0.32, -0.32, 0.06, -0.32),
    L(-0.32, -0.16, 0.32, -0.16), L(-0.32, -0.02, 0.2, -0.02), L(-0.32, 0.12, 0.3, 0.12),
    L(-0.32, 0.26, 0.12, 0.26), L(-0.32, 0.4, 0.28, 0.4), L(-0.32, 0.52, 0.02, 0.52),
  ],
  generar: () => {
    const layers = [[-0.66, [-0.44, 0, 0.44]], [0, [-0.6, -0.2, 0.2, 0.6]], [0.66, [-0.3, 0.3]]];
    const prims = [];
    layers.forEach(([x, ys]) => ys.forEach((y) => prims.push(C(x, y, 0.09), F(x - 0.04, y - 0.04, x + 0.04, y + 0.04, 0.8))));
    for (let i = 0; i < layers.length - 1; i++) {
      const [x1, a] = layers[i];
      const [x2, b] = layers[i + 1];
      a.forEach((y1) => b.forEach((y2) => prims.push(['l', x1 + 0.09, y1, x2 - 0.09, y2, 0.55])));
    }
    return prims;
  },
  desplegar: () => {
    const prims = [L(0, -0.66, 0.7, 0.52), L(0.7, 0.52, -0.7, 0.52), L(-0.7, 0.52, 0, -0.66)];
    for (let y = -0.38; y < 0.5; y += 0.15) {
      const half = ((y + 0.66) / 1.18) * 0.7 * 0.78;
      prims.push(['l', -half, y, half, y, 0.5]);
    }
    prims.push(L(-0.86, 0.72, 0.86, 0.72));
    return prims;
  },
};

const shapeCache = new Map();
function shapePoints(name) {
  if (shapeCache.has(name)) return shapeCache.get(name);
  const prims = (SHAPES[name] || SHAPES.idear)();
  const rng = mulberry32(hashString(name));
  const weight = (p) => {
    if (p[0] === 'l') return Math.hypot(p[3] - p[1], p[4] - p[2]) * (p[5] ?? 1);
    if (p[0] === 'c') return p[3] * (p[5] - p[4]);
    return (p[3] - p[1]) * (p[4] - p[2]) * 6 * p[5];
  };
  const total = prims.reduce((a, p) => a + weight(p), 0);
  const out = [];
  prims.forEach((p, idx) => {
    const n = idx === prims.length - 1 ? STAGE_N - out.length : Math.round((weight(p) / total) * STAGE_N);
    for (let k = 0; k < n && out.length < STAGE_N; k++) {
      const f = (k + 0.5) / Math.max(1, n);
      if (p[0] === 'l') out.push([p[1] + (p[3] - p[1]) * f, p[2] + (p[4] - p[2]) * f]);
      else if (p[0] === 'c') {
        const a = p[4] + (p[5] - p[4]) * f;
        out.push([p[1] + Math.cos(a) * p[3], p[2] + Math.sin(a) * p[3]]);
      } else out.push([p[1] + rng() * (p[3] - p[1]), p[2] + rng() * (p[4] - p[2])]);
    }
  });
  while (out.length < STAGE_N) out.push(out[out.length % Math.max(1, out.length)] || [0, 0]);
  shapeCache.set(name, out);
  return out;
}

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function stage(ctx, w, h, rng, c, { t }, canvas) {
  const name = canvas.dataset.variant || 'idear';
  const target = shapePoints(name);
  let st = canvas.__stage;
  // Posiciones en arreglos planos [x0, y0, x1, y1, ...] que se reutilizan: nada se crea por cuadro.
  if (!st) {
    // Primera vez: las partículas arrancan dispersas y se arman (con data-enter="none", ya armadas).
    const r0 = mulberry32(7);
    const still = canvas.dataset.enter === 'none';
    const from = new Float32Array(STAGE_N * 2);
    for (let i = 0; i < STAGE_N; i++) {
      from[i * 2] = still ? target[i][0] : (r0() * 2 - 1) * 1.6;
      from[i * 2 + 1] = still ? target[i][1] : (r0() * 2 - 1) * 1.1;
    }
    st = canvas.__stage = { name, from, start: t, cur: new Float32Array(STAGE_N * 2) };
  } else if (st.name !== name) {
    st.from.set(st.cur);
    st.name = name;
    st.start = t;
  }
  const cx = w / 2;
  const cy = h * 0.53;
  const R = Math.min(w * 0.36, h * 0.36);
  const scanY = t ? ((t * 60) % (h + 80)) - 40 : -999;
  const tick = Math.floor(t * 2);
  const glitchOn = t > 0 && (tick * 2654435761) % 9 === 0;
  const glitchY = (tick * 97) % Math.max(1, Math.round(h));
  const shift = (y) => (glitchOn && Math.abs(y - glitchY) < 8 ? ((tick % 2) * 2 - 1) * 9 : 0);

  ctx.fillStyle = c.onBlack;
  for (let k = 0; k < 90; k++) {
    const x = rng() * w;
    const y = rng() * h;
    const ph = rng() * TAU;
    ctx.globalAlpha = 0.05 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.7 + ph));
    px(ctx, x + shift(y), y, 0.6);
  }

  // Volumen: la figura tiene una capa de frente y otra de fondo (y algunas partículas en el medio), se
  // balancea despacio y, en escritorio, gira hacia el cursor (canvas.__tilt lo escribe js/views/proceso.js).
  const tilt = canvas.__tilt || (canvas.__tilt = { x: 0, y: 0, tx: 0, ty: 0 });
  tilt.x += (tilt.tx - tilt.x) * 0.14;
  tilt.y += (tilt.ty - tilt.y) * 0.14;
  const yaw = 0.24 * Math.sin(t * 0.45) + tilt.x * 0.32;
  const pitch = 0.08 * Math.sin(t * 0.33) - tilt.y * 0.26;
  const cyw = Math.cos(yaw);
  const syw = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const CAM = 2.6;
  // En canvas chicos (las cards del carrusel en celular) se dibuja una de cada dos partículas: a ese tamaño
  // la figura se ve igual y cuesta la mitad.
  const stride = w * h < 160000 ? 2 : 1;

  for (let i = 0; i < STAGE_N; i++) {
    const layer = rng();
    const z0 = layer < 0.5 ? 0.08 : layer < 0.86 ? -0.08 : (layer - 0.93) * 2;
    const hot = rng() < 0.04;
    const swirl = (rng() - 0.5) * 0.9;
    const delay = rng() * 0.35;
    const ph = rng() * TAU;
    if (i % stride) continue;
    const raw = t ? Math.min(1, Math.max(0, (t - st.start - delay) / 0.95)) : 1;
    const e = easeInOut(raw);
    const fx = st.from[i * 2];
    const fy = st.from[i * 2 + 1];
    const [tx, ty] = target[i];
    const arc = Math.sin(raw * Math.PI) * swirl;
    let x = fx + (tx - fx) * e - (ty - fy) * arc * 0.35;
    let y = fy + (ty - fy) * e + (tx - fx) * arc * 0.35;
    x += 0.008 * Math.sin(t * 1.3 + ph);
    y += 0.008 * Math.cos(t * 1.1 + ph);
    st.cur[i * 2] = x;
    st.cur[i * 2 + 1] = y;
    const x1 = x * cyw + z0 * syw;
    const z1 = -x * syw + z0 * cyw;
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    const persp = CAM / (CAM - z2);
    const sy = cy + y2 * R * persp;
    const sx = cx + x1 * R * persp + shift(sy);
    const depth = Math.min(1, Math.max(0, 0.5 + z2 * 3));
    const lit = Math.max(0, 1 - Math.abs(sy - scanY) / 14);
    ctx.globalAlpha = Math.min(1, 0.22 + 0.7 * depth + lit * 0.5);
    ctx.fillStyle = hot ? c.accent : c.onBlack;
    px(ctx, sx, sy, (0.7 + depth * 1.1) * persp + lit * 0.35);
  }
  if (t) {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = c.onBlack;
    ctx.fillRect(0, snap(scanY), w, 1 / dprNow);
  }
  ctx.globalAlpha = 1;
}

// Fondo de la foto de la home: polvo que titila, alguna chispa naranja y una línea de escaneo.
function field(ctx, w, h, rng, c, { t }) {
  for (let k = 0; k < 80; k++) {
    const x = rng() * w;
    const y = rng() * h;
    const ph = rng() * 6.28;
    const hot = rng() < 0.06;
    ctx.globalAlpha = 0.06 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.5 + ph));
    ctx.fillStyle = hot ? c.accent : c.onBlack;
    px(ctx, x, y, hot ? 0.9 : 0.6);
  }
  if (t) {
    const scanY = ((t * 40) % (h + 60)) - 30;
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = c.onBlack;
    ctx.fillRect(0, snap(scanY), w, 1 / dprNow);
  }
  ctx.globalAlpha = 1;
}

const KINDS = { wave, pill, orb, scatter, cover, dissolve, stage, field };
const LIVE = new Set(['wave', 'pill', 'orb', 'scatter', 'dissolve', 'stage', 'field']);
// Cuadros por segundo: 12 en general; las etapas, 24 en escritorio para que el viaje de las partículas se vea
// fluido (en pantallas táctiles, 12, para cuidar la batería).
const FRAME_MS = { stage: matchMedia('(pointer: coarse)').matches ? 83 : 41 };
const GROWS = new Set(['wave', 'pill']);
const mounted = new Set();
let grewOnce = false;

function draw(entry, state = { progress: 1, t: 0 }) {
  const { canvas } = entry;
  const fn = KINDS[canvas.dataset.kind];
  // El tamaño lo informa el ResizeObserver; medirlo en cada cuadro forzaría un recálculo de layout.
  if (!entry.w) {
    const rect = canvas.getBoundingClientRect();
    entry.w = Math.round(rect.width);
    entry.h = Math.round(rect.height);
  }
  const { w, h } = entry;
  if (!fn || w < 4 || h < 4) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  dprNow = bw / w;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dprNow, 0, 0, bh / h, 0, 0);
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
    if (document.hidden || !entry.visible || now - lastFrame < (FRAME_MS[entry.canvas.dataset.kind] || 83)) return;
    lastFrame = now;
    const elapsed = now - start;
    const progress = grow ? Math.min(1, elapsed / 520) : 1;
    draw(entry, { progress, t: elapsed / 1000 });
  };
  entry.raf = requestAnimationFrame(step);
}

export function mountDots(root) {
  const entries = [...root.querySelectorAll('canvas[data-kind]')].map((canvas) => ({ canvas, raf: 0, dead: false, visible: true, w: 0, h: 0 }));
  const reduced = prefersReducedMotion();
  const ro = new ResizeObserver((items) => {
    for (const it of items) {
      const entry = entries.find((e) => e.canvas === it.target);
      if (!entry) continue;
      entry.w = Math.round(it.contentRect.width);
      entry.h = Math.round(it.contentRect.height);
      if (!entry.raf) draw(entry);
    }
  });
  // Un canvas fuera de pantalla (por ejemplo, abajo del scroll en celular) no se anima.
  const io = new IntersectionObserver((items) => {
    for (const it of items) {
      const entry = entries.find((e) => e.canvas === it.target);
      if (entry) entry.visible = it.isIntersecting;
    }
  });
  for (const entry of entries) {
    mounted.add(entry);
    const kind = entry.canvas.dataset.kind;
    if (!reduced && LIVE.has(kind)) run(entry, !grewOnce && GROWS.has(kind));
    else draw(entry);
    ro.observe(entry.canvas);
    io.observe(entry.canvas);
  }
  if (entries.some((e) => GROWS.has(e.canvas.dataset.kind))) grewOnce = true;
  return () => {
    ro.disconnect();
    io.disconnect();
    for (const entry of entries) {
      entry.dead = true;
      cancelAnimationFrame(entry.raf);
      mounted.delete(entry);
    }
  };
}

export function redrawAll() {
  tokenCache = null;
  for (const entry of mounted) if (!entry.raf) draw(entry);
}

window.addEventListener('themechange', redrawAll);
