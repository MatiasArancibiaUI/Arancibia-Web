import { personal } from '../../data/personal.js';
import { profile } from '../../data/profile.js';
import { icon } from '../icons.js';
import { logo, hasLogo, toolChip } from '../logos.js';
import { esc, fmtRange, fmtYM, isDev } from '../util.js';

export const title = 'Proceso';

const pending = (cls, t) =>
  isDev()
    ? `<article class="card pending ${cls}"><h2 class="label">${esc(t)}</h2><p class="pending-text">Completar</p></article>`
    : '';

// Tarjetas personales (PENDIENTE): con texto se muestran; vacías, solo en ?dev.
const extra = (cls, t, texto) =>
  texto ? `<article class="card extra ${cls}"><h2 class="label">${esc(t)}</h2><p class="extra-text">${esc(texto)}</p></article>` : pending(cls, t);

const meter = ({ valor, total }, label) =>
  `<span class="meter" role="img" aria-label="${esc(label)}">${Array.from({ length: total }, (_, i) => `<span class="${i < valor ? 'on' : ''}"></span>`).join('')}</span>`;

export function render() {
  const p = personal.proceso;
  const ia = profile.habilidades.find((h) => h.id === 'ia');
  const resto = profile.habilidades.filter((h) => h.id !== 'ia');
  const m = profile.mercado;
  const cert = profile.certificaciones[0];
  const a = personal.aprendiendo;

  return `
  <section class="view proc${isDev() ? ' is-dev' : ''}">
    <header class="view-head">
      <div><p class="eyebrow"><span class="idx">04</span> Proceso · Habilidades · Stack</p><h1 class="headline view-title" tabindex="-1">De diseño a <span class="hl">código</span>.</h1></div>
    </header>

    <div class="proc-grid">
      <article class="card black proc-main" aria-labelledby="h-proc">
        <div class="card-head">
          <div>
            <h2 class="label" id="h-proc">${esc(p.titulo)}</h2>
            <p class="sub">${esc(p.bajada)}</p>
          </div>
          ${icon('workflow')}
        </div>
        <ol class="steps">
          ${p.pasos
            .map(
              (s, i) => `
            <li class="step">
              <span class="dots step-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <h3 class="step-title">${icon(s.icono)} ${esc(s.titulo)}</h3>
              <p class="step-text">${esc(s.texto)}</p>
              <ul class="chips sm on-black step-tools" aria-label="Herramientas">${s.herramientas.map(toolChip).join('')}</ul>
            </li>`,
            )
            .join('')}
        </ol>
      </article>

      <article class="card proc-ai" aria-labelledby="h-ia">
        <div class="card-head">
          <h2 class="label" id="h-ia">Herramientas de IA</h2>
          <span class="count dots" aria-hidden="true">${ia.items.length}</span>
        </div>
        <ul class="ai-grid">
          ${ia.items.map((t) => `<li>${hasLogo(t) ? logo(t) : `<span class="logo-ph" aria-hidden="true">${esc(t[0])}</span>`}<span>${esc(t)}</span></li>`).join('')}
        </ul>
      </article>

      <article class="card proc-skills" aria-labelledby="h-skills">
        <div class="card-head">
          <h2 class="label" id="h-skills">Habilidades</h2>
          ${icon('layers')}
        </div>
        <dl class="skill-rows">
          ${resto
            .map(
              (h) => `
            <div>
              <dt><span class="dots" aria-hidden="true">${h.items.length}</span><span>${esc(h.categoria)}</span>${
                h.nivel ? `<span class="skill-level">${meter(h.nivel, `${h.nivel.texto}: ${h.nivel.valor} de ${h.nivel.total}`)} ${esc(h.nivel.texto)}</span>` : ''
              }</dt>
              <dd>${h.items.map(esc).join(' · ')}</dd>
            </div>`,
            )
            .join('')}
        </dl>
      </article>

      <article class="card proc-market" aria-labelledby="h-market">
        <div class="card-head">
          <h2 class="label" id="h-market">${esc(m.titulo)}</h2>
          ${icon('landmark')}
        </div>
        <ul class="instruments">
          ${m.instrumentos.map((x) => `<li>${esc(x)}</li>`).join('')}
        </ul>
        <p class="market-text">${esc(m.texto)}</p>
      </article>

      <article class="card proc-learn" aria-labelledby="h-learn2">
        <div class="card-head">
          <h2 class="label" id="h-learn2">${esc(a.titulo)}</h2>
          ${icon('cap')}
        </div>
        <ul class="learn-rows">
          ${a.items
            .map(
              (i) =>
                `<li><p class="lr-t">${esc(i.titulo)}</p><p class="lr-s">${esc([i.lugar, i.inicio ? fmtRange(i.inicio, i.fin) : 'En curso'].filter(Boolean).join(' · '))}</p></li>`,
            )
            .join('')}
          <li><p class="lr-t">${icon('award')} ${esc(cert.titulo)}</p><p class="lr-s">${esc(cert.institucion)} · terminado en ${fmtYM(cert.fecha)}</p></li>
        </ul>
      </article>

      ${extra('p-1', personal.motiva.titulo, personal.motiva.texto)}
      ${extra('p-2', personal.fuera.titulo, personal.fuera.texto)}
      ${extra('p-3', personal.referentes.titulo, personal.referentes.items.join(' · '))}
    </div>
  </section>`;
}
