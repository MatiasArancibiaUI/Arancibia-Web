import { prefersReducedMotion } from './util.js';

// Entrada escalonada de los bloques de cada vista (una vez, breve).
export function rise(root) {
  if (prefersReducedMotion()) return;
  // .stack queda afuera: cualquier animación le crearía un contexto de apilado y la capa de atrás quedaría adelante.
  const items = root.querySelectorAll('.eyebrow, .headline, .profile, .logo-strip, .card:not(.stack), .filters');
  items.forEach((el, i) => {
    el.style.setProperty('--i', String(Math.min(i, 10)));
    el.classList.add('rise');
  });
}

// Los números de píxeles cuentan desde cero hasta su valor.
export function countUp(root) {
  const nodes = root.querySelectorAll('[data-count]');
  if (prefersReducedMotion()) return;
  nodes.forEach((node) => {
    const target = Number(node.dataset.count);
    if (!Number.isFinite(target) || target <= 0) return;
    const dur = 700;
    const start = performance.now();
    node.textContent = '0';
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1 && node.isConnected) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
