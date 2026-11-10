import { profile } from '../../data/profile.js';
import { icon } from '../icons.js';
import { esc, fmtRange, fmtYM, monthsBetween } from '../util.js';
import { copyButton, cvTextButton, links } from '../ui.js';

export const title = 'Sobre mí';

const meter = ({ valor, total }, label) =>
  `<span class="meter" role="img" aria-label="${esc(label)}">${Array.from({ length: total }, (_, i) => `<span class="${i < valor ? 'on' : ''}"></span>`).join('')}</span>`;

export function render() {
  const c = profile.contacto;
  const exp = profile.experiencia.map((e) => ({ ...e, meses: monthsBetween(e.inicio, e.fin) }));
  const max = Math.max(...exp.map((e) => e.meses));

  return `
  <section class="view about">
    <header class="view-head">
      <div><p class="eyebrow"><span class="idx">05</span> Sobre mí</p><h1 class="headline view-title" tabindex="-1">Mi perfil, en formato <span class="hl">CV</span>.</h1></div>
    </header>
    <div class="about-grid">
      <aside class="card about-id" aria-label="Datos de contacto">
        <i class="tick" aria-hidden="true"></i>
        <div class="about-photo"><img src="assets/matias-bn.webp" alt="Retrato de Matías Arancibia en blanco y negro" width="800" height="728" loading="lazy"></div>
        <div class="about-who">
          <h2 class="about-name">${esc(profile.nombreCompleto)}</h2>
          <p class="role">${esc(profile.rol)}</p>
          <p class="about-loc">${icon('mapPin')} ${esc(c.ubicacion)}</p>
        </div>
        <dl class="spec">
          <div><dt>Email</dt><dd><span class="spec-val" translate="no">${esc(c.email)}</span>${copyButton(c.email, 'email', 'in-spec')}</dd></div>
          <div><dt>Teléfono</dt><dd><span class="spec-val" translate="no">${esc(c.telefono)}</span>${copyButton(c.telefono, 'teléfono', 'in-spec')}</dd></div>
        </dl>
        <div class="about-actions">
          ${links()
            .map((l) => `<a class="icon-btn" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${l.label} (se abre en una pestaña nueva)" title="${l.label}">${icon(l.icon)}</a>`)
            .join('')}
          ${cvTextButton()}
        </div>
      </aside>

      <article class="card about-bio" aria-labelledby="h-bio">
        <h2 class="label" id="h-bio">Perfil profesional</h2>
        <div class="bio-text">${profile.perfil.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </article>

      <article class="card about-exp" aria-labelledby="h-exp2">
        <div class="card-head">
          <h2 class="label" id="h-exp2">Experiencia</h2>
          <a class="icon-btn sm" href="#/experiencia" aria-label="Ver experiencia completa" title="Experiencia">${icon('arrowUpRight')}</a>
        </div>
        <ul class="exp-rows">
          ${exp
            .map(
              (e) => `
            <li>
              <span class="dots er-n" aria-hidden="true">${e.meses}</span>
              <div class="er-body">
                <p class="er-t">${esc(e.cargo)}</p>
                <p class="er-s">${esc(e.empresa)} · <span class="er-d">${fmtRange(e.inicio, e.fin)}</span></p>
                <span class="er-bar" aria-hidden="true"><span style="--w:${Math.round((e.meses / max) * 100)}%"></span></span>
              </div>
              <span class="sr-only">${e.meses} meses</span>
            </li>`,
            )
            .join('')}
        </ul>
      </article>

      <article class="card about-edu" aria-labelledby="h-edu2">
        <div class="card-head">
          <h2 class="label" id="h-edu2">Formación</h2>
          ${icon('cap')}
        </div>
        <ul class="edu-rows">
          ${profile.educacion
            .map((e) => `<li><p class="er-t">${esc(e.titulo)}</p><p class="er-s">${esc(e.institucionCorta)} · <span class="er-d">${fmtRange(e.inicio, e.fin)}</span></p></li>`)
            .join('')}
        </ul>
      </article>

      <article class="card about-cert" aria-labelledby="h-cert2">
        <div class="card-head">
          <h2 class="label" id="h-cert2">Certificaciones</h2>
          ${icon('award')}
        </div>
        <ul class="edu-rows">
          ${profile.certificaciones
            .map((x) => `<li><p class="er-t">${esc(x.titulo)}</p><p class="er-s">${esc(x.institucion)} · <span class="er-d">${fmtYM(x.fecha)}</span></p>${x.detalle ? `<p class="er-note">${esc(x.detalle)}</p>` : ''}</li>`)
            .join('')}
        </ul>
      </article>

      <article class="card about-lang" aria-labelledby="h-lang">
        <div class="card-head">
          <h2 class="label" id="h-lang">Idiomas</h2>
          ${icon('languages')}
        </div>
        <ul class="lang-rows">
          ${profile.idiomas
            .map(
              (i) => `
            <li>
              <span class="dots lang-code" aria-hidden="true">${esc(i.corto)}</span>
              <div>
                <p class="er-t">${esc(i.idioma)}</p>
                <p class="er-s">${esc(i.nivel)}</p>
                ${i.medidor ? meter(i.medidor, `${i.nivel}: nivel ${i.medidor.valor} de ${i.medidor.total}`) : ''}
              </div>
            </li>`,
            )
            .join('')}
        </ul>
      </article>
    </div>
  </section>`;
}
