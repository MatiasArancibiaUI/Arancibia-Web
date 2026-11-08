// Menú inferior semicircular: marca la vista activa, muestra su nombre
// y permite mover el foco con las flechas izquierda y derecha.
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

export function setDockActive(nav, path, label) {
  nav.querySelectorAll('.dock-btn').forEach((a) => {
    const on = a.getAttribute('href') === `#${path}`;
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  nav.querySelector('.dock-label').textContent = label;
}
