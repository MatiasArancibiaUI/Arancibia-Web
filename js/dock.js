// Menú de secciones (barra inferior en celular, riel vertical en escritorio): marca la vista activa
// y mueve el foco con las flechas, en horizontal o en vertical.
const NEXT = new Set(['ArrowRight', 'ArrowDown']);
const PREV = new Set(['ArrowLeft', 'ArrowUp']);
export function initDock(nav) {
  const items = [...nav.querySelectorAll('.dock-btn')];
  nav.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    if (i < 0 || (!NEXT.has(e.key) && !PREV.has(e.key))) return;
    e.preventDefault();
    e.stopPropagation();
    const next = NEXT.has(e.key) ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
  });
}

export function setDockActive(nav, path) {
  nav.querySelectorAll('.dock-btn').forEach((a) => {
    if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
