import { profile } from '../../data/profile.js';
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

// Línea de tiempo: un píxel por mes desde 2023; los meses con un rol se encienden en orden al entrar en pantalla.
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
    <section class="card timeline" aria-labelledby="h-tl" style="--n:${total}">
      <div class="card-head">
        <h2 class="label" id="h-tl">Línea de tiempo</h2>
        <p class="tl-range">${fmtYM(start)} – hoy</p>
      </div>
      <div class="tl" aria-hidden="true">
        <div class="tl-labels">
          ${roles.map((r) => `<p class="tl-role${r.fin ? '' : ' is-now'}" style="--x:${pct(r.a)}%;--i:${r.a}"><b>${esc(r.empresa)}</b><span>${fmtRange(r.inicio, r.fin)}</span></p>`).join('')}
        </div>
        <div class="tl-track">
          ${Array.from({ length: total }, (_, i) => {
            const r = roleAt(i);
            return `<span class="${r ? 'on' : ''}${i === total - 1 && r && !r.fin ? ' now' : ''}" style="--i:${i}"></span>`;
          }).join('')}
        </div>
        <div class="tl-years">
          ${years.map((y) => `<span style="--x:${pct(y.i)}%">${y.y}</span>`).join('')}
        </div>
      </div>
      <ul class="sr-only">
        ${roles.map((r) => `<li>${esc(r.empresa)}, ${esc(r.cargo)}: ${fmtRange(r.inicio, r.fin)}, ${monthsBetween(r.inicio, r.fin)} meses</li>`).join('')}
      </ul>
    </section>`;
}

export function render() {
  const [actual, ...previas] = profile.experiencia;
  const meses = monthsBetween(actual.inicio, actual.fin);
  return `
  <section class="view exp">
    <header class="view-head">
      <div><p class="eyebrow"><span class="idx">02</span> Experiencia</p><h1 class="headline view-title" tabindex="-1">Dónde diseñé y qué <span class="hl">hice</span>.</h1></div>
    </header>
    ${timeline()}
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
        <ul class="chips sm on-black" aria-label="Herramientas">${actual.herramientas.map(toolChip).join('')}</ul>
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

// La línea se enciende cuando entra en pantalla (al cargar o al scrollear hasta ella).
export function mount(el) {
  const tl = el.querySelector('.timeline');
  if (!tl || !('IntersectionObserver' in window)) {
    tl?.classList.add('is-in');
    return null;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      tl.classList.add('is-in');
      io.disconnect();
    },
    { threshold: 0.4 },
  );
  io.observe(tl);
  return () => io.disconnect();
}
