import { profile } from '../data/profile.js';
import * as home from './views/home.js';
import * as experiencia from './views/experiencia.js';
import * as proyectos from './views/proyectos.js';
import * as sobreMi from './views/sobre-mi.js';
import * as proceso from './views/proceso.js';
import { mountDots } from './dots.js';
import { initTheme } from './theme.js';
import { initDock, setDockActive } from './dock.js';
import { initSearch, focusSearch, closeSearch } from './search.js';
import { initUI, cvButton } from './ui.js';
import { prefersReducedMotion } from './util.js';
import { rise, countUp } from './motion.js';
import { brandMark } from './brand.js';

const routes = [
  { path: '/', key: '1', label: 'Inicio', view: home, keywords: 'home dashboard tablero' },
  { path: '/experiencia', key: '2', label: 'Experiencia', view: experiencia, keywords: 'trabajo empleos cv byma uade dogma' },
  { path: '/proyectos', key: '3', label: 'Proyectos', view: proyectos, keywords: 'portfolio casos behance github' },
  { path: '/proceso', key: '4', label: 'Proceso', view: proceso, keywords: 'proceso habilidades herramientas ia stack aprendiendo estudios mercado etf cedear fci' },
  { path: '/sobre-mi', key: '5', label: 'Sobre mí', view: sobreMi, keywords: 'perfil cv idiomas contacto educacion' },
];

const main = document.getElementById('main');
const dock = document.getElementById('dock');
const announcer = document.getElementById('announcer');
let current = null;
let firstRender = true;
let seq = 0;

const findRoute = () => {
  let path = location.hash.replace(/^#/, '') || '/';
  if (path === '/personal') path = '/proceso'; // ruta anterior
  return routes.find((r) => r.path === path) || routes[0];
};

function render() {
  const route = findRoute();
  if (current && current.route === route) return;

  const my = ++seq;
  const el = document.createElement('div');
  // La home entra completa en el marco; el resto de las vistas scrollea adentro.
  el.className = route.path === '/' ? 'view-host' : 'view-host scroll-y scrolls';
  el.innerHTML = route.view.render();
  const prev = current;
  current = null;
  const reduced = prefersReducedMotion();

  const enter = () => {
    if (my !== seq) return;
    main.querySelectorAll('.view-host').forEach((v) => v.remove());
    main.append(el);
    const cleanups = [route.view.mount?.(el), mountDots(el)].filter(Boolean);
    current = { route, el, cleanup: () => cleanups.forEach((fn) => fn()) };
    rise(el);
    countUp(el);
    if (!firstRender) {
      el.querySelector('.view-title')?.focus({ preventScroll: true });
      announcer.textContent = `Vista: ${route.label}`;
    }
    firstRender = false;
  };

  if (prev) prev.cleanup();
  const showing = main.querySelector('.view-host');
  if (showing && !reduced && !firstRender) {
    showing.classList.add('leaving');
    setTimeout(enter, 110);
  } else enter();

  document.title = route.path === '/' ? `${profile.nombre} · ${profile.rol}` : `${route.label} · ${profile.nombre}`;
  setDockActive(dock, route.path, route.label);
}

function onKey(e) {
  const t = e.target;
  const typing = t.closest('input, textarea, select, [contenteditable="true"]');
  if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    focusSearch();
    return;
  }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (document.querySelector('dialog[open]')) return;
  if (e.key === '/') {
    e.preventDefault();
    focusSearch();
    return;
  }
  const r = routes.find((x) => x.key === e.key);
  if (r) location.hash = `#${r.path}`;
}

document.getElementById('cv-slot').outerHTML = cvButton('cv-top');
document.getElementById('brand-slot').outerHTML = brandMark();
document.querySelector('.skip').addEventListener('click', (e) => {
  e.preventDefault();
  main.focus();
});
initTheme(document.getElementById('theme-btn'));
initUI();
initDock(dock);
initSearch(document.getElementById('q'), document.getElementById('q-results'), routes);
document.addEventListener('keydown', onKey);
window.addEventListener('hashchange', () => {
  if (location.hash && !location.hash.startsWith('#/')) return;
  closeSearch(false);
  render();
});
render();
