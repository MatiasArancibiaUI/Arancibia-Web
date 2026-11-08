import { personal } from '../../data/personal.js';
import { profile } from '../../data/profile.js';
import { icon } from '../icons.js';
import { esc, fmtRange, fmtYM, isDev } from '../util.js';

export const title = 'Personal';

const pending = (cls, t) =>
  isDev()
    ? `<article class="card bento-card pending ${cls}"><h2 class="label">${esc(t)}</h2><p class="pending-text">Completar</p></article>`
    : '';

export function render() {
  const a = personal.aprendiendo;
  const cert = profile.certificaciones.find((x) => x.id === personal.ultimo.certificacion);
  const m = personal.motiva;
  const f = personal.fuera;
  const r = personal.referentes;

  return `
  <section class="view personal${isDev() ? ' is-dev' : ''}">
    <header class="view-head">
      <h1 class="headline view-title" tabindex="-1">Lo que estoy aprendiendo.</h1>
    </header>
    <div class="bento">
      <article class="card black bento-card b-learn" aria-labelledby="h-apr">
        <div class="card-head">
          <h2 class="label" id="h-apr">${esc(a.titulo)}</h2>
          ${icon('cap')}
        </div>
        <ul class="learn-list">
          ${a.items
            .map(
              (i) =>
                `<li><p class="learn-item">${esc(i.titulo)}</p><p class="sub">${esc([i.lugar, i.inicio ? fmtRange(i.inicio, i.fin) : ''].filter(Boolean).join(' · '))}</p></li>`,
            )
            .join('')}
        </ul>
        <div class="b-art" aria-hidden="true"><canvas data-kind="scatter" data-seed="33"></canvas></div>
      </article>

      <article class="card bento-card b-now" aria-labelledby="h-now">
        <div class="card-head">
          <h2 class="label" id="h-now">${esc(personal.metido.titulo)}</h2>
          ${icon('activity')}
        </div>
        <ul class="now-list">
          ${personal.metido.items.map((t, i) => `<li><span class="dots" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span>${esc(t)}</span></li>`).join('')}
        </ul>
      </article>

      ${
        cert
          ? `<article class="card bento-card b-cert" aria-labelledby="h-cert">
        <div class="card-head">
          <h2 class="label" id="h-cert">${esc(personal.ultimo.titulo)}</h2>
          ${icon('award')}
        </div>
        <p class="cert-title">${esc(cert.titulo)}</p>
        <p class="sub">${esc(cert.institucion)} · ${fmtYM(cert.fecha)}</p>
        <p class="cert-text">${esc(cert.detalle)}</p>
      </article>`
          : ''
      }

      ${m.texto ? `<article class="card bento-card b-p1"><h2 class="label">${esc(m.titulo)}</h2><p class="bento-text">${esc(m.texto)}</p></article>` : pending('b-p1', m.titulo)}
      ${f.texto ? `<article class="card bento-card b-p2"><h2 class="label">${esc(f.titulo)}</h2><p class="bento-text">${esc(f.texto)}</p></article>` : pending('b-p2', f.titulo)}
      ${
        r.items.length
          ? `<article class="card bento-card b-p3"><h2 class="label">${esc(r.titulo)}</h2><ul class="ref-list">${r.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></article>`
          : pending('b-p3', r.titulo)
      }
    </div>
  </section>`;
}
