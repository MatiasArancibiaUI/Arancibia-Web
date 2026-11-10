import { profile } from '../../data/profile.js';
import { personal } from '../../data/personal.js';
import { icon } from '../icons.js';
import { logo, hasLogo, companyLogo } from '../logos.js';
import { esc, fmtYM, fmtRange, monthsBetween, yearsSince, isCurrent } from '../util.js';
import { cvButton, initTabs } from '../ui.js';

export const title = 'Inicio';

// Franja de herramientas: primero las que tienen logo, sin repetir marcas.
function stackStrip() {
  const seen = new Set();
  const tools = profile.habilidades
    .flatMap((h) => h.items)
    .filter((t) => {
      const key = logo(t);
      if (!hasLogo(t) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const items = tools.map((t) => `<li>${logo(t)}<span>${esc(t)}</span></li>`).join('');
  return `
    <section class="logo-strip" aria-label="Herramientas que uso">
      <p class="strip-label">Stack</p>
      <div class="strip-track">
        <ul class="strip-list">${items}</ul>
        <ul class="strip-list" aria-hidden="true">${items}</ul>
      </div>
    </section>`;
}

const tag = (t) => `<li class="chip">${hasLogo(t) ? logo(t) : ''}${esc(t)}</li>`;

// Pestaña Herramientas: solo programas. Quedan afuera conceptos, lenguajes, metodologías y duplicados.
const NO_PROGRAMAS = new Set(['Prototipado interactivo', 'Design systems', 'Design-to-code', 'UX Research', 'HTML', 'CSS', 'JavaScript', 'Vercel Apps']);
const programas = [...new Set(profile.habilidades.filter((h) => h.id !== 'metodologias').flatMap((h) => h.items))].filter((t) => !NO_PROGRAMAS.has(t));

export function render() {
  const [actual] = profile.experiencia;
  const mesesActual = monthsBetween(actual.inicio, actual.fin);
  // Experiencias anteriores: la actual vive en la tarjeta grande de la derecha.
  const roles = profile.experiencia.filter((e) => e.fin).map((e) => ({ ...e, meses: monthsBetween(e.inicio, e.fin) }));
  const maxMeses = Math.max(...roles.map((e) => e.meses));
  const totalMeses = profile.experiencia.reduce((s, e) => s + monthsBetween(e.inicio, e.fin), 0);
  const anios = yearsSince(profile.inicioCarrera);
  const estudio = profile.educacion[0];
  const cursando = personal.aprendiendo.items.filter((i) => i.inicio && isCurrent(i.fin)).length;
  const c = profile.contacto;
  const ingles = profile.idiomas.find((i) => i.corto === 'EN');
  const educacion = [
    ...profile.educacion.map((e) => ({ t: e.tituloCorto, s: e.institucionCorta, f: fmtRange(e.inicio, e.fin) })),
    ...profile.certificaciones.map((x) => ({ t: x.titulo, s: x.institucion, f: fmtYM(x.fecha) })),
  ];

  return `
  <section class="view home">
    <div class="home-profile">
      <img class="photo" src="assets/matias-bn.webp" alt="Retrato de Matías Arancibia en blanco y negro, con saco y corbata" width="800" height="728" fetchpriority="high">

      <div class="profile">
        <p class="name">${esc(profile.nombre)}</p>
        <p class="role">${esc(profile.rol)}</p>
        <p class="loc">${icon('mapPin')} ${esc(c.ubicacion)} · ES nativo · EN ${esc(ingles.nivel)}</p>
      </div>

      <section class="card tabcard" aria-label="Resumen">
        <i class="tick" aria-hidden="true"></i>
        <div class="tabs" role="tablist" aria-label="Resumen">
          <button type="button" role="tab" id="tab-exp" aria-selected="true" aria-controls="panel-exp">${icon('history')} Experiencia <span class="badge">${profile.experiencia.length}</span></button>
          <button type="button" role="tab" id="tab-tools" aria-selected="false" aria-controls="panel-tools" tabindex="-1">Herramientas <span class="badge">${programas.length}</span></button>
          <button type="button" role="tab" id="tab-edu" aria-selected="false" aria-controls="panel-edu" tabindex="-1">Educación <span class="badge">${educacion.length}</span></button>
        </div>

        <div class="tab-panels">
          <div role="tabpanel" id="panel-exp" aria-labelledby="tab-exp" class="panel" tabindex="0">
            <div class="pills">
              ${roles
                .map(
                  (e, i) => `
                <div class="pill-row">
                  <div class="pill" aria-hidden="true"><canvas data-kind="pill" data-seed="${4 + i * 7}" data-fill="${(0.15 + 0.6 * (e.meses / maxMeses)).toFixed(2)}"></canvas></div>
                  <div class="pill-num">
                    <span class="dots" data-count="${e.meses}" aria-hidden="true">${e.meses}</span>
                    <span class="pill-meta">
                      <span class="unit" aria-hidden="true">meses</span>
                      <span class="pill-label"><span class="sr-only">${e.meses} meses en </span>${esc(e.empresa)}</span>
                    </span>
                  </div>
                </div>`,
                )
                .join('')}
            </div>
            <p class="trend">${icon('trendingUp')} ${totalMeses} meses diseñando, sumando los tres roles.</p>
          </div>

          <div role="tabpanel" id="panel-tools" aria-labelledby="tab-tools" class="panel" tabindex="0" hidden>
            <ul class="chips tool-chips">${programas.map(tag).join('')}</ul>
          </div>

          <div role="tabpanel" id="panel-edu" aria-labelledby="tab-edu" class="panel" tabindex="0" hidden>
            <ul class="rows edu-grid">
              ${educacion.map((e) => `<li><div><p class="row-t">${esc(e.t)}</p><p class="row-s">${esc(e.s)}</p></div><p class="row-d">${esc(e.f)}</p></li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="tiles">
          <button type="button" class="tile black" data-open-contact>
            <span class="tile-title">Hablemos</span>
            <span class="tile-label">${icon('mail')} Email, teléfono y redes ${icon('arrowRight', 'ic-end')}</span>
          </button>
          <div class="tile gray">
            <p class="tile-num"><span class="dots" aria-hidden="true"><span data-count="${anios}">${anios}</span>+</span></p>
            <p class="tile-label">${icon('layers')} <span><span class="sr-only">Más de ${anios} </span>años diseñando producto digital</span></p>
          </div>
        </div>
      </section>
    </div>

    <div class="home-work">
      <p class="eyebrow"><span class="idx">01</span> Inicio · AI Product Designer</p>
      <h1 class="headline view-title" tabindex="-1">Diseño interfaces que salen a <span class="hl">producción</span>.</h1>
      ${stackStrip()}

      <article class="card big stack" aria-labelledby="h-actual">
        <i class="tick" aria-hidden="true"></i>
        <div class="card-head">
          <div>
            <h2 class="label" id="h-actual">Trabajo actual</h2>
            <p class="sub now-co">${companyLogo(actual.empresa) || esc(actual.empresa)}<span>desde ${fmtYM(actual.inicio)}</span></p>
          </div>
          <div class="btn-row">
            <a class="icon-btn sm" href="#/experiencia" aria-label="Abrir experiencia" title="Abrir experiencia">${icon('arrowUpRight')}</a>
            ${cvButton('sm')}
            <div class="menu-wrap">
              <button type="button" class="icon-btn sm" data-menu-toggle aria-expanded="false" aria-controls="m-actual" aria-label="Más opciones" title="Más">${icon('more')}</button>
              <ul class="menu" id="m-actual" role="menu" hidden>
                <li role="none"><a role="menuitem" href="#/sobre-mi">${icon('user')} Ver perfil completo</a></li>
                <li role="none"><a role="menuitem" href="#/proyectos">${icon('grid')} Ver proyectos</a></li>
                <li role="none"><button type="button" role="menuitem" data-copy="${esc(c.email)}">${icon('mail')} Copiar email</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="big-mid">
          <dl class="facts">
            <div><dt>${icon('briefcase')} Rol</dt><dd>${esc(actual.cargo)}</dd></div>
            <div><dt>${icon('mapPin')} Modalidad</dt><dd>${esc(actual.modalidad)}</dd></div>
            <div><dt>${icon('target')} Foco</dt><dd>${esc(actual.foco)}</dd></div>
          </dl>
          <p class="big-num">
            <span class="dots" data-count="${mesesActual}" aria-hidden="true">${mesesActual}</span>
            <span class="unit" aria-hidden="true">meses</span>
            <span class="sr-only">${mesesActual} meses en ${esc(actual.empresa)}</span>
          </p>
        </div>
        <div class="wave" aria-hidden="true"><canvas data-kind="wave" data-seed="7"></canvas></div>
      </article>

      <div class="home-row">
        <article class="card learn" aria-labelledby="h-learn">
          <div class="card-head">
            <div>
              <h2 class="label" id="h-learn">Aprendiendo ahora (${cursando})</h2>
              <p class="sub">Desde ${fmtYM(estudio.inicio)}</p>
            </div>
            <a class="icon-btn sm" href="#/proceso" aria-label="Ver mi proceso de trabajo" title="Proceso">${icon('settings')}</a>
          </div>
          <div class="learn-art" aria-hidden="true"><canvas data-kind="scatter" data-seed="21"></canvas></div>
          <div class="learn-body">
            <p class="learn-title">${esc(estudio.tituloCorto)}, ${esc(estudio.institucionCorta)}</p>
            <ul class="chips sm">${['n8n', 'Claude Code'].map(tag).join('')}</ul>
          </div>
        </article>

        <article class="card black feat" aria-labelledby="h-feat">
          <div class="card-head">
            <div>
              <h2 class="label" id="h-feat">Proyecto destacado</h2>
              <p class="sub">${esc(actual.empresa)} · 2026</p>
            </div>
            <div class="menu-wrap">
              <button type="button" class="icon-btn sm" data-menu-toggle aria-expanded="false" aria-controls="m-feat" aria-label="Más sobre el proyecto destacado" title="Más">${icon('more')}</button>
              <ul class="menu" id="m-feat" role="menu" hidden>
                <li role="none"><a role="menuitem" href="#/experiencia">${icon('history')} Ver en experiencia</a></li>
                <li role="none"><a role="menuitem" href="#/proyectos">${icon('grid')} Todos los proyectos</a></li>
              </ul>
            </div>
          </div>
          <div class="ring">
            <canvas data-kind="ring" data-seed="3" aria-hidden="true"></canvas>
            <p class="ring-label"><span class="dots" aria-hidden="true">DS</span><span class="ring-unit">Design System</span></p>
          </div>
          <a class="play-link" href="#/proyectos">Ver proyecto <span class="play">${icon('play')}</span></a>
        </article>
      </div>
    </div>
  </section>`;
}

export function mount(el) {
  initTabs(el);
  // Recorta la foto a la altura del borde superior de la tarjeta de pestañas.
  const photo = el.querySelector('.photo');
  const tabcard = el.querySelector('.tabcard');
  const fit = () => {
    if (getComputedStyle(photo).position !== 'absolute') {
      photo.style.removeProperty('--photo-cut');
      return;
    }
    const p = photo.getBoundingClientRect();
    const cut = Math.max(0, p.bottom - tabcard.getBoundingClientRect().top - 24);
    photo.style.setProperty('--photo-cut', `${Math.round(cut)}px`);
  };
  const ro = new ResizeObserver(fit);
  ro.observe(el);
  ro.observe(tabcard);
  photo.addEventListener('load', fit);
  fit();
  return () => ro.disconnect();
}
