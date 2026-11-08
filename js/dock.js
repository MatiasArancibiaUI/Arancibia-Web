// Menú inferior horizontal: marca la vista activa y permite mover el foco
// con las flechas izquierda y derecha.
export function initDock(nav) {
  const items = [...nav.querySelectorAll('.dock-btn')];
  nav.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    if (i < 0 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    e.stopPropagation();
    const next = e.key === 'ArrowRight' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
  });
}

export function setDockActive(nav, path) {
  nav.querySelectorAll('.dock-btn').forEach((a) => {
    if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
