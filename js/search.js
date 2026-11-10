import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { personal } from '../data/personal.js';
import { verEtapa } from './views/proceso.js';
import { esc, normalize, fmtRange, fmtYM } from './util.js';

let input;
let list;
let results = [];
let active = -1;

export const getQuery = () => (input ? input.value : '');

export function setQuery(v) {
  input.value = v;
  window.dispatchEvent(new Event('search:query'));
  if (document.activeElement === input) renderResults();
}

function buildIndex(routes) {
  const go = (hash) => () => {
    location.hash = hash;
  };
  const idx = [];
  routes.forEach((r) => idx.push({ group: 'Vistas', label: r.label, hint: `Atajo ${r.key}`, keys: r.keywords || '', run: go(`#${r.path}`) }));
  projects.forEach((p) =>
    idx.push({
      group: 'Proyectos',
      label: p.titulo,
      hint: p.url ? `Abrir en ${p.destino === 'github' ? 'GitHub' : 'Behance'}` : `${p.empresa} · ${p.anio}`,
      keys: [p.tipo, p.empresa, p.descripcion, ...p.tecnologias].join(' '),
      run: () => {
        if (p.url) {
          window.open(p.url, '_blank', 'noopener');
          return;
        }
        input.value = p.titulo;
        location.hash = '#/proyectos';
        window.dispatchEvent(new Event('search:query'));
      },
    }),
  );
  profile.experiencia.forEach((e) =>
    idx.push({ group: 'Experiencia', label: `${e.cargo} · ${e.empresa}`, hint: fmtRange(e.inicio, e.fin), keys: [e.empresaCompleta, ...e.puntos].join(' '), run: go('#/experiencia') }),
  );
  profile.habilidades.forEach((h) =>
    h.items.forEach((i) => idx.push({ group: 'Herramientas', label: i, hint: h.corta, keys: h.categoria, run: go('#/') })),
  );
  personal.proceso.pasos.forEach((s, i) =>
    idx.push({ group: 'Proceso', label: s.titulo, hint: `Etapa ${i + 1}`, keys: [s.texto, s.entrega, ...s.hago].join(' '), run: () => verEtapa(s.id) }),
  );
  profile.educacion.forEach((e) =>
    idx.push({ group: 'Estudios', label: e.titulo, hint: `${e.institucionCorta} · ${fmtRange(e.inicio, e.fin)}`, keys: e.institucion, run: go('#/sobre-mi') }),
  );
  profile.certificaciones.forEach((x) =>
    idx.push({ group: 'Estudios', label: x.titulo, hint: `${x.institucion} · ${fmtYM(x.fecha)}`, keys: x.detalle, run: go('#/sobre-mi') }),
  );
  return idx.map((it) => ({ ...it, hay: normalize(`${it.label} ${it.keys}`), lab: normalize(it.label) }));
}

let index = [];

function search(q) {
  const n = normalize(q);
  if (!n) return index.filter((i) => i.group === 'Vistas');
  const terms = n.split(/\s+/);
  return index
    .filter((i) => terms.every((t) => i.hay.includes(t)))
    .sort((a, b) => Number(b.lab.startsWith(n)) - Number(a.lab.startsWith(n)) || Number(b.lab.includes(n)) - Number(a.lab.includes(n)))
    .slice(0, 12);
}

function renderResults() {
  results = search(input.value);
  active = results.length ? 0 : -1;
  if (!results.length) {
    list.innerHTML = `<p class="palette-empty">Sin resultados para “${esc(input.value.trim())}”.</p>`;
  } else {
    const groups = [...new Set(results.map((r) => r.group))];
    list.innerHTML = groups
      .map(
        (g) => `<div role="group" aria-label="${esc(g)}"><p class="palette-group" aria-hidden="true">${esc(g)}</p>${results
          .map((r, i) =>
            r.group === g
              ? `<div class="palette-item" role="option" id="opt-${i}" data-i="${i}" aria-selected="${i === active}"><span>${esc(r.label)}</span><span class="palette-hint">${esc(r.hint)}</span></div>`
              : '',
          )
          .join('')}</div>`,
      )
      .join('');
  }
  open();
  syncActive();
}

function syncActive() {
  list.querySelectorAll('[role="option"]').forEach((o) => o.setAttribute('aria-selected', String(Number(o.dataset.i) === active)));
  if (active >= 0) {
    input.setAttribute('aria-activedescendant', `opt-${active}`);
    list.querySelector(`#opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  } else input.removeAttribute('aria-activedescendant');
}

function open() {
  list.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

export function closeSearch(blur = true) {
  list.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
  if (blur) input.blur();
}

function choose(i) {
  const r = results[i];
  if (!r) return;
  closeSearch();
  r.run();
}

export function initSearch(el, listEl, routes) {
  input = el;
  list = listEl;
  index = buildIndex(routes);
  input.addEventListener('focus', renderResults);
  input.addEventListener('input', () => {
    renderResults();
    window.dispatchEvent(new Event('search:query'));
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      active = e.key === 'ArrowDown' ? (active + 1) % results.length : (active - 1 + results.length) % results.length;
      syncActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    }
  });
  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => {
    const o = e.target.closest('[role="option"]');
    if (o) choose(Number(o.dataset.i));
  });
  input.addEventListener('blur', () => closeSearch(false));
}

export const focusSearch = () => input.focus();
