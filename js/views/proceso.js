import { personal } from '../../data/personal.js';
import { icon } from '../icons.js';
import { logo, hasLogo, toolChip } from '../logos.js';
import { esc, isDev, normalize, prefersReducedMotion } from '../util.js';

export const title = 'Proceso';

// Recorrido automático: cuánto se queda en cada etapa antes de pasar a la siguiente.
const DWELL_MS = 6000;
const pad = (n) => String(n).padStart(2, '0');

// La búsqueda puede pedir una etapa puntual: se guarda hasta que la vista se monta.
let pedida = null;
export function verEtapa(id) {
  pedida = id;
  if (location.hash === '#/proceso') document.dispatchEvent(new CustomEvent('proceso:etapa'));
  else location.hash = '#/proceso';
}

const pending = (cls, t) =>
  isDev()
    ? `<article class="card pending ${cls}"><h3 class="label">${esc(t)}</h3><p class="pending-text">Completar</p></article>`
    : '';

// Tarjetas personales (PENDIENTE): con texto se muestran; vacías, solo en ?dev.
const extra = (cls, t, texto) =>
  texto ? `<article class="card extra ${cls}"><h3 class="label">${esc(t)}</h3><p class="extra-text">${esc(texto)}</p></article>` : pending(cls, t);

const playLabel = (on) => `${icon(on ? 'pause' : 'play')}<span>${on ? 'Pausar' : 'Reproducir'}</span>`;

function pipeline() {
  const p = personal.proceso;
  const n = p.pasos.length;
  const tabs = p.pasos
    .map(
      (s, i) => `
      <li>
        <button type="button" class="stage" role="tab" id="pt-${s.id}" aria-controls="pp-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
          <span class="stage-top">
            <span class="stage-n">${pad(i + 1)}</span>
            <span class="stage-state" aria-hidden="true">${icon('check')}</span>
          </span>
          <span class="stage-ic" aria-hidden="true">${icon(s.icono)}</span>
          <span class="stage-t">${esc(s.titulo)}</span>
        </button>
      </li>`,
    )
    .join('');
  const panels = p.pasos
    .map((s, i) => {
      const slug = normalize(s.titulo).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `
      <div class="pp" role="tabpanel" id="pp-${s.id}" aria-labelledby="pt-${s.id}" tabindex="0"${i === 0 ? '' : ' hidden'}>
        <div class="pp-main">
          <p class="dots pp-n" aria-hidden="true">${pad(i + 1)}</p>
          <h3 class="pp-title">${esc(s.titulo)}</h3>
          <p class="pp-text">${esc(s.texto)}</p>
          <ul class="chips pp-tools" aria-label="Herramientas">${s.herramientas.map(toolChip).join('')}</ul>
        </div>
        <div class="console">
          <p class="console-bar" aria-hidden="true"><i></i><i></i><i></i><span>proceso / ${pad(i + 1)}-${esc(slug)}</span></p>
          <ol class="console-lines">
            ${s.hago.map((h, k) => `<li class="c-task" style="--k:${k}"><span class="c-mark" aria-hidden="true"></span><span class="c-txt">${esc(h)}</span><span class="c-ok">${icon('check')}<span class="sr-only">hecho</span></span></li>`).join('')}
            <li class="c-out" style="--k:${s.hago.length}"><span class="c-lab">Entregable</span><strong>${esc(s.entrega)}</strong></li>
          </ol>
        </div>
      </div>`;
    })
    .join('');

  return `
    <article class="card pipeline" aria-labelledby="h-proc" style="--n:${n}; --dwell:${DWELL_MS}ms">
      <i class="tick" aria-hidden="true"></i>
      <div class="card-head">
        <div>
          <h2 class="label" id="h-proc">${esc(p.titulo)}</h2>
          <p class="sub">${esc(p.bajada)}</p>
        </div>
        <div class="pipe-ctrl">
          <p class="pipe-count" aria-hidden="true"><span class="pipe-cur">01</span> / ${pad(n)}</p>
          <button type="button" class="pipe-play" aria-pressed="false">${playLabel(false)}</button>
        </div>
      </div>
      <ol class="stages" role="tablist" aria-label="Etapas del proceso">${tabs}</ol>
      <div class="segs" aria-hidden="true">${p.pasos.map(() => '<span><i></i></span>').join('')}</div>
      <div class="pipe-panels">${panels}</div>
    </article>`;
}

function flujoIA() {
  const f = personal.flujoIA;
  const nodo = (x, k) => `
    <li class="sys-node" style="--k:${k}">
      <span class="sys-ic" aria-hidden="true">${x.herramienta && hasLogo(x.herramienta) ? logo(x.herramienta) : icon(x.icono || 'workflow')}</span>
      <span class="sys-t">${esc(x.nombre)}</span>
      <span class="sys-s">${esc(x.nota)}</span>
    </li>`;
  return `
    <article class="card black sysmap" aria-labelledby="h-sys" style="--m:${f.nodos.length}">
      <div class="card-head">
        <div>
          <h2 class="label" id="h-sys">${esc(f.titulo)}</h2>
          <p class="sub">${esc(f.bajada)}</p>
        </div>
        ${icon('workflow')}
      </div>
      <div class="sys">
        <ol class="sys-nodes">${f.nodos.map(nodo).join('')}</ol>
        <div class="sys-loop" aria-hidden="true"><span class="sys-loop-packet"></span></div>
        <p class="sys-loop-t">${icon('repeat')} ${esc(f.ciclo)}</p>
      </div>
      <p class="sys-text">${esc(f.texto)}</p>
    </article>`;
}

export function render() {
  const extras = [
    extra('p-1', personal.motiva.titulo, personal.motiva.texto),
    extra('p-2', personal.fuera.titulo, personal.fuera.texto),
    extra('p-3', personal.referentes.titulo, personal.referentes.items.join(' · ')),
  ].join('');

  return `
  <section class="view proc${isDev() ? ' is-dev' : ''}">
    <header class="view-head">
      <div><p class="eyebrow"><span class="idx">04</span> Proceso · AI Product Designer</p><h1 class="headline view-title" tabindex="-1">De la idea al <span class="hl">deploy</span>.</h1></div>
    </header>
    ${pipeline()}
    ${flujoIA()}
    ${extras ? `<div class="extra-grid">${extras}</div>` : ''}
  </section>`;
}

export function mount(el) {
  const card = el.querySelector('.pipeline');
  const tabs = [...card.querySelectorAll('[role="tab"]')];
  const segs = [...card.querySelectorAll('.segs > span')];
  const cur = card.querySelector('.pipe-cur');
  const playBtn = card.querySelector('.pipe-play');
  let index = 0;
  let playing = false;

  const select = (i, focus = false) => {
    index = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      const on = k === index;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle('is-done', k < index);
      segs[k].className = k < index ? 'is-done' : on ? 'is-on' : '';
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    cur.textContent = pad(index + 1);
    if (focus) tabs[index].focus();
  };

  const setPlaying = (on) => {
    playing = on;
    card.classList.toggle('is-playing', on);
    playBtn.setAttribute('aria-pressed', String(on));
    playBtn.setAttribute('aria-label', on ? 'Pausar el recorrido automático' : 'Reproducir el recorrido automático');
    playBtn.innerHTML = playLabel(on);
  };

  // El segmento de la etapa activa marca el tiempo; al llenarse, pasa a la siguiente.
  const onSegEnd = (e) => {
    if (playing && e.animationName === 'seg-fill') select(index + 1);
  };

  const onClick = (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    setPlaying(false);
    select(tabs.indexOf(tab));
  };

  const onKey = (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    e.stopPropagation();
    setPlaying(false);
    select(keys[e.key], true);
  };

  const onPlay = () => setPlaying(!playing);

  const onPedida = () => {
    const k = personal.proceso.pasos.findIndex((s) => s.id === pedida);
    pedida = null;
    if (k < 0) return;
    setPlaying(false);
    select(k);
    card.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const list = card.querySelector('[role="tablist"]');
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKey);
  card.addEventListener('animationend', onSegEnd);
  playBtn.addEventListener('click', onPlay);
  document.addEventListener('proceso:etapa', onPedida);

  // Las animaciones en bucle solo corren con el bloque en pantalla.
  const io = new IntersectionObserver((items) => items.forEach((it) => it.target.classList.toggle('is-in', it.isIntersecting)), { threshold: 0.2 });
  el.querySelectorAll('.pipeline, .sysmap').forEach((n) => io.observe(n));

  select(0);
  setPlaying(!prefersReducedMotion());
  if (pedida) onPedida();

  return () => {
    io.disconnect();
    document.removeEventListener('proceso:etapa', onPedida);
  };
}
