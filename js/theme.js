import { icon } from './icons.js';

const KEY = 'theme';
const media = matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;

const effective = () => root.dataset.theme || (media.matches ? 'dark' : 'light');

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
  media.addEventListener('change', () => {
    if (root.dataset.theme) return;
    syncButton(btn);
    window.dispatchEvent(new Event('themechange'));
  });
}
