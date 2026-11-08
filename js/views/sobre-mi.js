import { profile } from '../../data/profile.js';
import { icon } from '../icons.js';
import { esc, fmtRange, fmtYM } from '../util.js';
import { contactRows, linkRows, cvTextButton } from '../ui.js';

export const title = 'Sobre mí';

const meter = ({ valor, total }, label) =>
  `<span class="meter" role="img" aria-label="${esc(label)}">${Array.from({ length: total }, (_, i) => `<span class="${i < valor ? 'on' : ''}"></span>`).join('')}</span>`;

export function render() {
  const c = profile.contacto;
  return `
  <section class="view about">
    <header class="view-head">
      <h1 class="headline view-title" tabindex="-1">Mi perfil, en formato CV.</h1>
    </header>
    <div class="about-grid">
      <aside class="card about-id scroll-y" aria-label="Datos de contacto">
        <div class="about-photo"><img src="assets/matias-bn.webp" alt="Retrato de Matías Arancibia en blanco y negro" width="364" height="352" loading="lazy"></div>
        <h2 class="about-name">${esc(profile.nombreCompleto)}</h2>
        <p class="about-role">${esc(profile.rol)}</p>
        <p class="sub">${icon('mapPin')} ${esc(c.ubicacion)}</p>
        <div class="contact-list">${contactRows()}</div>
        <div class="link-list">${linkRows()}</div>
        ${cvTextButton()}
      </aside>

      <div class="card about-main scroll-y" tabindex="0" aria-label="Perfil, experiencia y estudios">
        <section>
          <h2 class="section-title">Perfil profesional</h2>
          ${profile.perfil.map((p) => `<p class="about-text">${esc(p)}</p>`).join('')}
        </section>
        <section>
          <h2 class="section-title">Experiencia</h2>
          <ul class="cv-rows">
            ${profile.experiencia.map((e) => `<li><span><b>${esc(e.cargo)}</b> · ${esc(e.empresaCompleta)}</span><span class="cv-date">${fmtRange(e.inicio, e.fin)}</span></li>`).join('')}
          </ul>
        </section>
        <section>
          <h2 class="section-title">Educación</h2>
          <ul class="cv-rows">
            ${profile.educacion
              .map(
                (e) =>
                  `<li><span><b>${esc(e.titulo)}</b> · ${esc(e.institucion)}${e.detalle ? `<span class="cv-note">${esc(e.detalle)}</span>` : ''}</span><span class="cv-date">${fmtRange(e.inicio, e.fin)}</span></li>`,
              )
              .join('')}
          </ul>
        </section>
        <section>
          <h2 class="section-title">Certificaciones</h2>
          <ul class="cv-rows">
            ${profile.certificaciones
              .map(
                (x) =>
                  `<li><span><b>${esc(x.titulo)}</b> · ${esc(x.institucion)}${x.detalle ? `<span class="cv-note">${esc(x.detalle)}</span>` : ''}</span><span class="cv-date">${fmtYM(x.fecha)}</span></li>`,
              )
              .join('')}
          </ul>
        </section>
      </div>

      <div class="card about-skills scroll-y" tabindex="0" aria-label="Habilidades e idiomas">
        <section>
          <h2 class="section-title">Habilidades</h2>
          ${profile.habilidades
            .map(
              (h) => `
            <div class="skill">
              <p class="skill-head"><span>${esc(h.categoria)}</span>${
                h.nivel ? `<span class="skill-level">${meter(h.nivel, `${h.nivel.texto}: ${h.nivel.valor} de ${h.nivel.total}`)} ${esc(h.nivel.texto)}</span>` : ''
              }</p>
              <ul class="chips sm">${h.items.map((i) => `<li class="chip">${esc(i)}</li>`).join('')}</ul>
            </div>`,
            )
            .join('')}
        </section>
        <section>
          <h2 class="section-title">Idiomas</h2>
          <ul class="cv-rows">
            ${profile.idiomas
              .map(
                (i) =>
                  `<li><span><b>${esc(i.idioma)}</b></span><span class="cv-date">${
                    i.medidor ? `${meter(i.medidor, `${i.nivel}: nivel ${i.medidor.valor} de ${i.medidor.total}`)} ` : ''
                  }${esc(i.nivel)}</span></li>`,
              )
              .join('')}
          </ul>
        </section>
      </div>
    </div>
  </section>`;
}
