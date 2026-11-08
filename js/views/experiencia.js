import { profile } from '../../data/profile.js';
import { icon } from '../icons.js';
import { toolChip } from '../logos.js';
import { esc, fmtRange, fmtYM, monthsBetween, currentYM, parseYM } from '../util.js';

export const title = 'Experiencia';

function splitCols(items) {
  const cols = [[], []];
  const len = [0, 0];
  items.forEach((t) => {
    const i = len[0] <= len[1] ? 0 : 1;
    cols[i].push(t);
    len[i] += t.length + 60;
  });
  return cols;
}

const meta = (e) => [fmtRange(e.inicio, e.fin), e.lugar, e.modalidad].filter(Boolean).join(' · ');

// Línea de tiempo tipo Gantt: una barra por rol, con nombre y duración adentro.
function timeline() {
  const start = '2023-01';
  const total = monthsBetween(start, currentYM());
  const idx = (ym) => monthsBetween(start, ym) - 1;
  const roles = [...profile.experiencia].reverse().map((e) => {
    const a = idx(e.inicio);
    const b = idx(e.fin || currentYM());
    return { ...e, a, len: b - a + 1, meses: monthsBetween(e.inicio, e.fin) };
  });
  const years = [];
  for (let y = parseYM(start).y; y <= parseYM(currentYM()).y; y++) years.push({ y, i: idx(`${y}-01`) });
  const pct = (i) => (i / total) * 100;

  return `
    <section class="timeline" aria-labelledby="h-tl">
      <div class="tl-head">
        <h2 class="label" id="h-tl">Línea de tiempo</h2>
        <p class="tl-range">${fmtYM(start)} – hoy</p>
      </div>
      <div class="tl">
        <div class="tl-bars">
          ${roles
            .map(
              (r) => `
            <div class="tl-bar${r.fin ? '' : ' is-now'}" style="--x:${pct(r.a)}%;--w:${pct(r.len)}%">
              <b>${esc(r.empresa)}</b><span>${r.meses} meses</span>
            </div>`,
            )
            .join('')}
        </div>
        <div class="tl-axis" aria-hidden="true">
          ${years.map((y) => `<span style="--x:${pct(y.i)}%">${y.y}</span>`).join('')}
        </div>
      </div>
    </section>`;
}

export function render() {
  const [actual, ...previas] = profile.experiencia;
  const meses = monthsBetween(actual.inicio, actual.fin);
  return `
  <section class="view exp">
    <header class="view-head exp-head">
      <div><p class="eyebrow"><span class="idx">02</span> Experiencia</p><h1 class="headline view-title" tabindex="-1">Dónde diseñé y qué <span class="hl">hice</span>.</h1></div>
      ${timeline()}
    </header>
    <div class="exp-grid">
      <article class="card black exp-main" aria-labelledby="h-byma">
        <div class="card-head">
          <div>
            <p class="label">Trabajo actual <span class="live"><span class="live-dot"></span>Actual</span></p>
            <h2 class="exp-company" id="h-byma">${esc(actual.empresa)} <span class="exp-role">${esc(actual.cargo)}</span></h2>
            <p class="sub">${esc(meta(actual))}</p>
          </div>
          <p class="big-num">
            <span class="dots" data-count="${meses}" aria-hidden="true">${meses}</span>
            <span class="unit" aria-hidden="true">meses</span>
            <span class="sr-only">${meses} meses</span>
          </p>
        </div>
        <div class="bullet-cols">
          ${splitCols(actual.puntos).map((col) => `<ul class="bullets">${col.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`).join('')}
        </div>
        <div class="exp-foot">
          <ul class="chips sm on-black" aria-label="Herramientas">${actual.herramientas.map(toolChip).join('')}</ul>
          <p class="exp-market">${icon('landmark')} ${profile.mercado.instrumentos.map(esc).join(' · ')}</p>
        </div>
      </article>

      <div class="exp-side">
        ${previas
          .map((e) => {
            const m = monthsBetween(e.inicio, e.fin);
            return `
          <article class="card exp-item" aria-labelledby="h-${e.id}">
            <div class="exp-item-head">
              <div>
                <p class="label">${fmtYM(e.inicio)} – ${fmtYM(e.fin)}</p>
                <h2 class="exp-item-title" id="h-${e.id}">${esc(e.empresa)}</h2>
                <p class="exp-item-role">${esc(e.cargo)} <span>· ${esc([e.lugar, e.modalidad].filter(Boolean).join(' · '))}</span></p>
              </div>
              <p class="mini-num"><span class="dots" data-count="${m}" aria-hidden="true">${m}</span><span class="unit" aria-hidden="true">meses</span><span class="sr-only">${m} meses</span></p>
            </div>
            <ul class="bullets">
              ${e.puntos.map((p) => `<li>${esc(p)}</li>`).join('')}
            </ul>
          </article>`;
          })
          .join('')}
      </div>

    </div>
  </section>`;
}
