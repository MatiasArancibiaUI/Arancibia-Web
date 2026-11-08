const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const parseYM = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

export const currentYM = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// Meses contando el mes de inicio y el de fin (Mar–Abr = 2), como LinkedIn.
export const monthsBetween = (inicio, fin) => {
  const a = parseYM(inicio);
  const b = parseYM(fin || currentYM());
  return Math.max(0, (b.y - a.y) * 12 + (b.m - a.m) + 1);
};

export const yearsSince = (inicio) => Math.floor((monthsBetween(inicio, null) - 1) / 12);

export const fmtYM = (ym) => {
  const { y, m } = parseYM(ym);
  return `${MESES[m - 1]} ${y}`;
};

export const fmtYMLong = (ym) => {
  const { y, m } = parseYM(ym);
  return `${MESES_LARGOS[m - 1]} de ${y}`;
};

export const fmtRange = (inicio, fin) => `${fmtYM(inicio)} – ${fin ? fmtYM(fin) : 'Actualidad'}`;

export const isCurrent = (fin) => !fin || fin >= currentYM();

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const normalize = (s) =>
  String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const hashString = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isDev = () => new URLSearchParams(location.search).has('dev');
