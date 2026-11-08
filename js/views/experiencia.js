import { profile } from '../../data/profile.js';
import { icon } from '../icons.js';
import { esc, fmtRange, fmtYM, monthsBetween, currentYM, parseYM } from '../util.js';

export const title = 'Experiencia';

const meta = (e) => [fmtRange(e.inicio, e.fin), e.lugar, e.modalidad].filter(Boolean).join(' · ');

function timeline() {
  const start = '2023-01';
  const total = monthsBetween(start, currentYM());
  const idx = (ym) => monthsBetween(start, ym) - 1;
  const roles = [...profile.experiencia].reverse().map((e) => ({ ...e, a: idx(e.inicio), b: idx(e.fin || currentYM()) }));
  const roleAt = (i) => roles.find((r) => i >= r.a && i <= r.b);
  const years = [];
  for (let y = parseYM(start).y; y <= parseYM(currentYM()).y; y++) years.push({ y, i: idx(`${y}-01`) });
  const pct = (i) => ((i + 0.5) / total) * 100;

  return `
    <section class="card timeline" aria-labelledby="h-tl">
      <h2 class="label" id="h-tl">Línea de tiempo · 2023 a hoy</h2>
      <div class="tl">
        <div class="tl-labels" aria-hidden="true">
          ${roles.map((r) => `<p class="tl-role" style="--x:${pct(r.a)}%"><b>${esc(r.empresa)}</b><span>${fmtRange(r.inicio, r.fin)}</span></p>`).join('')}
        </div>
        <div class="tl-track" style="--n:${total}" aria-hidden="true">
          ${Array.from({ length: total }, (_, i) => `<span class="${roleAt(i) ? 'on' : ''}"></span>`).join('')}
        </div>
        <div class="tl-years" aria-hidden="true">
          ${years.map((y) => `<span style="--x:${pct(y.i)}%">${y.y}</span>`).join('')}
        </div>
        <ul class="sr-only">
          ${roles.map((r) => `<li>${esc(r.empresa)}, ${esc(r.cargo)}: ${fmtRange(r.inicio, r.fin)}</li>`).join('')}
        </ul>
      </div>
    </section>`;
}

export function render() {
  const [actual, ...previas] = profile.experiencia;
  const meses = monthsBetween(actual.inicio, actual.fin);
  return `
  <section class="view exp">
    <header class="view-head">
      <h1 class="headline view-title" tabindex="-1">Dónde diseñé y qué hice.</h1>
    </header>
    <div class="exp-grid">
      <article class="card black exp-main" aria-labelledby="h-byma">
        <div class="card-head">
          <div>
            <p class="label">Trabajo actual <span class="live"><span class="live-dot"></span>Actual</span></p>
            <h2 class="exp-company" id="h-byma">${esc(actual.empresa)}</h2>
            <p class="exp-role">${esc(actual.cargo)}</p>
            <p class="sub">${esc(meta(actual))}</p>
          </div>
          <p class="big-num">
            <span class="dots" aria-hidden="true">${meses}</span>
            <span class="unit" aria-hidden="true">meses</span>
            <span class="sr-only">${meses} meses</span>
          </p>
        </div>
        <ul class="bullets scroll-y" tabindex="0" aria-label="Qué hago en ${esc(actual.empresa)}">
          ${actual.puntos.map((p) => `<li>${esc(p)}</li>`).join('')}
        </ul>
        <ul class="chips on-black">${actual.herramientas.map((h) => `<li class="chip">${esc(h)}</li>`).join('')}</ul>
        <div class="wave exp-wave" aria-hidden="true"><canvas data-kind="wave" data-seed="19"></canvas></div>
      </article>

      <div class="exp-side">
        ${previas
          .map((e) => {
            const m = monthsBetween(e.inicio, e.fin);
            return `
          <article class="card exp-item" aria-labelledby="h-${e.id}">
            <button type="button" class="exp-toggle" aria-expanded="false" aria-controls="b-${e.id}">
              <span class="exp-item-head">
                <span>
                  <span class="label">${fmtYM(e.inicio)} – ${fmtYM(e.fin)}</span>
                  <span class="exp-item-title" id="h-${e.id}">${esc(e.empresa)}</span>
                  <span class="exp-item-role">${esc(e.cargo)}</span>
                  <span class="sub">${esc([e.lugar, e.modalidad].filter(Boolean).join(' · '))}</span>
                </span>
                <span class="mini-num"><span class="dots" aria-hidden="true">${m}</span><span class="unit" aria-hidden="true">meses</span><span class="sr-only">${m} meses</span></span>
              </span>
              <span class="exp-more">${icon('chevronDown')}<span class="exp-more-t">Ver detalle</span></span>
            </button>
            <ul class="bullets exp-body scroll-y" id="b-${e.id}">
              ${e.puntos.map((p) => `<li>${esc(p)}</li>`).join('')}
            </ul>
          </article>`;
          })
          .join('')}
      </div>

      ${timeline()}
    </div>
  </section>`;
}

export function mount(el) {
  const items = [...el.querySelectorAll('.exp-item')];
  el.querySelector('.exp-side').addEventListener('click', (e) => {
    const btn = e.target.closest('.exp-toggle');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') !== 'true';
    items.forEach((it) => {
      const b = it.querySelector('.exp-toggle');
      const on = open && b === btn;
      b.setAttribute('aria-expanded', String(on));
      b.querySelector('.exp-more-t').textContent = on ? 'Cerrar detalle' : 'Ver detalle';
      it.classList.toggle('is-open', on);
      it.classList.toggle('is-shut', open && !on);
    });
  });
}
