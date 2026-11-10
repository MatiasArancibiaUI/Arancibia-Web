import { personal } from '../../data/personal.js';
import { icon } from '../icons.js';
import { logo, hasLogo, toolChip } from '../logos.js';
import { esc, isDev, prefersReducedMotion } from '../util.js';
import { redrawAll } from '../dots.js';

export const title = 'Proceso';

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

// Recorrido de las etapas: los textos pasan al scrollear y la ilustración queda fija al lado.
// Cada etapa tiene su figura de partículas (canvas "stage" en js/dots.js); al cambiar, las partículas viajan.
function story() {
  const p = personal.proceso;
  const n = p.pasos.length;
  const steps = p.pasos
    .map(
      (s, i) => `
      <li class="sstep${i === 0 ? ' is-on' : ''}" id="ps-${s.id}" data-i="${i}">
        <div class="sstep-visual card black" aria-hidden="true">
          <canvas data-kind="stage" data-variant="${s.id}" data-seed="${11 + i}"></canvas>
          <p class="dots sv-n">${pad(i + 1)}</p>
        </div>
        <p class="sstep-k"><span class="dots" aria-hidden="true">${pad(i + 1)}</span> Etapa ${i + 1} de ${n}</p>
        <h3 class="sstep-t">${esc(s.titulo)}</h3>
        <p class="sstep-x">${esc(s.texto)}</p>
        <ul class="sstep-list">${s.hago.map((h, k) => `<li style="--k:${k}">${esc(h)}</li>`).join('')}</ul>
        <p class="sstep-out"><span class="label">Entregable</span><strong>${esc(s.entrega)}</strong></p>
        <ul class="chips sm sstep-tools" aria-label="Herramientas">${s.herramientas.map(toolChip).join('')}</ul>
      </li>`,
    )
    .join('');
  const [first] = p.pasos;
  return `
    <section class="story" aria-labelledby="h-proc" style="--n:${n}">
      <h2 class="sr-only" id="h-proc">${esc(p.titulo)}</h2>
      <div class="story-grid">
        <ol class="story-steps">${steps}</ol>
        <div class="story-visual card black" aria-hidden="true">
          <canvas data-kind="stage" data-variant="${first.id}" data-seed="5"></canvas>
          <p class="dots sv-n">01</p>
          <div class="sv-rail">${p.pasos.map((_, i) => `<span${i === 0 ? ' class="is-on"' : ''}></span>`).join('')}</div>
        </div>
      </div>
    </section>`;
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
    ${story()}
    ${flujoIA()}
    ${extras ? `<div class="extra-grid">${extras}</div>` : ''}
  </section>`;
}

export function mount(el) {
  const steps = [...el.querySelectorAll('.sstep')];
  const visual = el.querySelector('.story-visual');
  const canvas = visual.querySelector('canvas');
  const num = visual.querySelector('.sv-n');
  const rail = [...visual.querySelectorAll('.sv-rail span')];
  const pasos = personal.proceso.pasos;
  const reduced = prefersReducedMotion();
  // Celular y tablet: cada etapa lleva su imagen en el flujo (la imagen fija taparía el texto al scrollear).
  const stacked = matchMedia('(max-width: 991.98px), (max-height: 631.98px)').matches;
  let active = -1;

  const activate = (i) => {
    if (i === active) return;
    active = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    rail.forEach((r, k) => (r.className = k < i ? 'is-done' : k === i ? 'is-on' : ''));
    canvas.dataset.variant = pasos[i].id;
    num.textContent = pad(i + 1);
    // Cambio con un parpadeo de glitch en el número.
    visual.classList.remove('is-swap');
    void visual.offsetWidth;
    visual.classList.add('is-swap');
    // En celular cada etapa tiene su imagen: al encenderse, sus partículas se vuelven a armar.
    if (stacked && !reduced) {
      const own = steps[i].querySelector('.sstep-visual canvas');
      if (own) own.__stage = null;
    }
    // Sin movimiento, el canvas no se anima solo: se redibuja con la figura nueva.
    if (reduced) redrawAll();
  };

  // La etapa activa es la que cruza una franja de la pantalla: el medio en escritorio; en celular, la parte baja,
  // para que la imagen de la etapa se arme apenas entra.
  const io = new IntersectionObserver(
    (items) => {
      const hit = items.filter((it) => it.isIntersecting).map((it) => Number(it.target.dataset.i));
      if (hit.length) activate(Math.max(...hit));
    },
    { rootMargin: stacked ? '-20% 0px -45% 0px' : '-45% 0px -45% 0px' },
  );
  steps.forEach((s) => io.observe(s));

  // El flujo con IA anima en bucle solo con el bloque en pantalla.
  const io2 = new IntersectionObserver((items) => items.forEach((it) => it.target.classList.toggle('is-in', it.isIntersecting)), { threshold: 0.2 });
  el.querySelectorAll('.sysmap').forEach((n) => io2.observe(n));

  const onPedida = () => {
    const k = pasos.findIndex((s) => s.id === pedida);
    pedida = null;
    if (k < 0) return;
    steps[k].scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
  };
  document.addEventListener('proceso:etapa', onPedida);
  activate(0);
  if (pedida) requestAnimationFrame(onPedida);

  return () => {
    io.disconnect();
    io2.disconnect();
    document.removeEventListener('proceso:etapa', onPedida);
  };
}
