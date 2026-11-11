import { icon } from './icons.js';

// Clave nueva al pasar el oscuro a estándar: una elección guardada con el claro por defecto ya no aplica.
const KEY = 'theme-v2';
const root = document.documentElement;

// El oscuro es el estándar (index.html arranca con data-theme="dark"); el claro se elige con el botón.
const effective = () => (root.dataset.theme === 'light' ? 'light' : 'dark');

function syncButton(btn) {
  const dark = effective() === 'dark';
  btn.innerHTML = icon(dark ? 'sun' : 'moon');
  btn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  btn.title = dark ? 'Tema claro' : 'Tema oscuro';
  const meta = document.querySelector('meta[name="theme-color"]:not([media])');
  if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
}

export function initTheme(btn) {
  syncButton(btn);
  btn.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Sin almacenamiento disponible: el tema vale solo para esta visita.
    }
    syncButton(btn);
    window.dispatchEvent(new Event('themechange'));
  });
}
