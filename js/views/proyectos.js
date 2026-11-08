import { projects } from '../../data/projects.js';
import { icon } from '../icons.js';
import { esc, normalize } from '../util.js';
import { getQuery, setQuery } from '../search.js';

export const title = 'Proyectos';

const DESTINOS = { behance: { label: 'Behance', icon: 'behance' }, github: { label: 'GitHub', icon: 'github' } };

const haystack = (p) => normalize([p.titulo, p.tipo, p.descripcion, p.empresa, p.rol, p.anio, ...p.tecnologias].join(' '));

function card(p) {
  const d = DESTINOS[p.destino];
  const cover = p.portada
    ? `<img src="${esc(p.portada)}" alt="" width="640" height="360" loading="lazy">`
    : `<canvas data-kind="cover" data-seed="${esc(p.id)}" aria-hidden="true"></canvas>`;
  const body = `
    <div class="pcard-cover">${cover}</div>
    <div class="pcard-body">
      <p class="label">${esc(p.tipo)}</p>
      <h2 class="pcard-title">${esc(p.titulo)}</h2>
      <p class="pcard-desc">${esc(p.descripcion)}</p>
      ${p.tecnologias.length ? `<ul class="chips sm">${p.tecnologias.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul>` : ''}
      <p class="pcard-meta">${esc(p.anio)} · ${esc(p.empresa)} · ${esc(p.rol)}</p>
    </div>`;
  if (p.url) {
    return `<li data-id="${esc(p.id)}" data-destino="${p.destino}">
      <a class="card pcard" href="${esc(p.url)}" target="_blank" rel="noopener">
        ${body}
        <p class="pcard-foot">${icon(d.icon)} Ver en ${d.label} <span class="sr-only">(se abre en una pestaña nueva)</span>${icon('arrowUpRight', 'ic-end')}</p>
      </a></li>`;
  }
  return `<li data-id="${esc(p.id)}" data-destino="${p.destino}">
    <div class="card pcard is-off">
      ${body}
      <p class="pcard-foot">${icon(d.icon)} Link próximamente</p>
    </div></li>`;
}

export function render() {
  const count = (k) => (k === 'todos' ? projects.length : projects.filter((p) => p.destino === k).length);
  return `
  <section class="view proj">
    <header class="view-head">
      <h1 class="headline view-title" tabindex="-1">Proyectos que diseñé.</h1>
      <div class="filters" role="group" aria-label="Filtrar por destino">
        ${['todos', 'behance', 'github']
          .map(
            (k) =>
              `<button type="button" class="filter" data-filter="${k}" aria-pressed="${k === 'todos'}">${k === 'todos' ? 'Todos' : DESTINOS[k].label} <span class="filter-n">${count(k)}</span></button>`,
          )
          .join('')}
      </div>
    </header>
    <p class="filter-status" hidden><span class="filter-text"></span> <button type="button" class="link-btn" data-clear>Limpiar búsqueda</button></p>
    <div class="proj-wrap scroll-y">
      <ul class="proj-grid">${projects.map(card).join('')}</ul>
      <p class="empty" hidden>Ningún proyecto coincide con la búsqueda.</p>
    </div>
  </section>`;
}

export function mount(el) {
  let filtro = 'todos';
  const items = [...el.querySelectorAll('.proj-grid > li')];
  const status = el.querySelector('.filter-status');
  const apply = () => {
    const q = normalize(getQuery());
    let visibles = 0;
    items.forEach((li) => {
      const p = projects.find((x) => x.id === li.dataset.id);
      const ok = (filtro === 'todos' || p.destino === filtro) && (!q || haystack(p).includes(q));
      li.hidden = !ok;
      if (ok) visibles++;
    });
    el.querySelector('.empty').hidden = visibles > 0;
    el.querySelector('.proj-wrap').classList.toggle('many', visibles > 6);
    status.hidden = !q;
    status.querySelector('.filter-text').textContent = q ? `Mostrando ${visibles} de ${projects.length} para “${getQuery().trim()}”.` : '';
  };
  el.querySelector('.filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filtro = b.dataset.filter;
    el.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    apply();
  });
  status.querySelector('[data-clear]').addEventListener('click', () => setQuery(''));
  const onQuery = () => apply();
  window.addEventListener('search:query', onQuery);
  apply();
  return () => window.removeEventListener('search:query', onQuery);
}
