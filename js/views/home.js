import { profile } from '../../data/profile.js';
import { personal } from '../../data/personal.js';
import { icon } from '../icons.js';
import { esc, fmtYM, fmtYMLong, fmtRange, monthsBetween, yearsSince, isCurrent } from '../util.js';
import { copyButton, cvButton, initTabs } from '../ui.js';

export const title = 'Inicio';

export function render() {
  const [actual, ...previas] = profile.experiencia;
  const mesesActual = monthsBetween(actual.inicio, actual.fin);
  const previasMeses = previas.map((e) => ({ ...e, meses: monthsBetween(e.inicio, e.fin) }));
  const maxMeses = Math.max(...previasMeses.map((e) => e.meses));
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
    <div class="home-left">
      <h1 class="headline view-title" tabindex="-1">Diseño interfaces que salen a producción.</h1>

      <article class="card big stack" aria-labelledby="h-actual">
        <div class="card-head">
          <div>
            <h2 class="label" id="h-actual">Trabajo actual</h2>
            <p class="sub">${esc(actual.empresa)} · desde ${fmtYM(actual.inicio)}</p>
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
            <span class="dots" aria-hidden="true">${mesesActual}</span>
            <span class="unit" aria-hidden="true">meses</span>
            <span class="sr-only">${mesesActual} meses en ${esc(actual.empresa)}</span>
          </p>
        </div>
        <div class="wave" aria-hidden="true"><canvas data-kind="wave" data-seed="7"></canvas></div>
      </article>

      <div class="home-row">
        <article class="card black feat" aria-labelledby="h-feat">
          <div class="card-head">
            <div>
              <h2 class="label" id="h-feat">Proyecto destacado</h2>
              <p class="sub">${esc(actual.empresa)} · 2026</p>
            </div>
            <div class="menu-wrap">
              <button type="button" class="icon-btn sm on-black" data-menu-toggle aria-expanded="false" aria-controls="m-feat" aria-label="Más sobre el proyecto destacado" title="Más">${icon('more')}</button>
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

        <article class="card learn" aria-labelledby="h-learn">
          <div class="card-head">
            <div>
              <h2 class="label" id="h-learn">Aprendiendo ahora (${cursando})</h2>
              <p class="sub">Desde ${fmtYM(estudio.inicio)}</p>
            </div>
            <a class="icon-btn sm" href="#/personal" aria-label="Ver lo que estoy aprendiendo" title="Personal">${icon('settings')}</a>
          </div>
          <div class="learn-body">
            <p class="learn-title">${esc(estudio.tituloCorto)}, ${esc(estudio.institucionCorta)}</p>
            <ul class="chips"><li class="chip">n8n</li><li class="chip">Claude Code</li></ul>
          </div>
          <div class="learn-art" aria-hidden="true"><canvas data-kind="scatter" data-seed="21"></canvas></div>
        </article>
      </div>
    </div>

    <div class="home-right">
      <div class="profile">
        <p class="name">${esc(profile.nombre)}</p>
        <p class="email" translate="no">${esc(c.email)}</p>
        <p class="role">${esc(profile.rol)}</p>
        <ul class="info-chips">
          <li class="chip info"><span class="k">Ubicación:</span> ${esc(c.ubicacion)}</li>
          <li class="chip info"><span class="k">Idiomas:</span> ES nativo · EN ${esc(ingles.nivel)}</li>
          <li class="chip info phone">${icon('phone')}<span translate="no">${esc(c.telefono)}</span>${copyButton(c.telefono, 'teléfono', 'in-chip')}</li>
        </ul>
      </div>

      <img class="photo" src="assets/matias-bn.webp" alt="Retrato de Matías Arancibia en blanco y negro, con saco y corbata" width="364" height="352" fetchpriority="high">

      <section class="card tabcard" aria-label="Resumen">
        <div class="tabs" role="tablist" aria-label="Resumen">
          <button type="button" role="tab" id="tab-exp" aria-selected="true" aria-controls="panel-exp">${icon('history')} Experiencia <span class="badge">${profile.experiencia.length}</span></button>
          <button type="button" role="tab" id="tab-tools" aria-selected="false" aria-controls="panel-tools" tabindex="-1">Herramientas <span class="badge">${profile.habilidades.length}</span></button>
          <button type="button" role="tab" id="tab-edu" aria-selected="false" aria-controls="panel-edu" tabindex="-1">Educación <span class="badge">${educacion.length}</span></button>
        </div>

        <div class="tab-panels">
          <div role="tabpanel" id="panel-exp" aria-labelledby="tab-exp" class="panel" tabindex="0">
            <div class="panel-note">
              <p>${icon('heart', 'red')} Hoy estoy en ${esc(actual.empresa)}, desde ${fmtYMLong(actual.inicio)}</p>
              ${cvButton('sm')}
            </div>
            <div class="pills">
              ${previasMeses
                .map(
                  (e, i) => `
                <div class="pill-row">
                  <div class="pill" aria-hidden="true"><canvas data-kind="pill" data-seed="${11 + i * 7}" data-fill="${(0.15 + 0.6 * (e.meses / maxMeses)).toFixed(2)}"></canvas></div>
                  <div class="pill-num">
                    <p class="pill-val"><span class="dots" aria-hidden="true">${e.meses}</span><span class="unit" aria-hidden="true">meses</span></p>
                    <p class="pill-label"><span class="sr-only">${e.meses} meses en </span>${esc(e.empresa)}</p>
                  </div>
                </div>`,
                )
                .join('')}
            </div>
            <p class="trend">${icon('trendingUp')} ${totalMeses} meses diseñando, sumando los tres roles.</p>
          </div>

          <div role="tabpanel" id="panel-tools" aria-labelledby="tab-tools" class="panel scroll-y" tabindex="0" hidden>
            <dl class="tool-list">
              ${profile.habilidades
                .map((h) => `<div><dt>${esc(h.corta)}</dt><dd><ul class="chips sm">${h.items.map((i) => `<li class="chip">${esc(i)}</li>`).join('')}</ul></dd></div>`)
                .join('')}
            </dl>
          </div>

          <div role="tabpanel" id="panel-edu" aria-labelledby="tab-edu" class="panel scroll-y" tabindex="0" hidden>
            <ul class="rows">
              ${educacion.map((e) => `<li><div><p class="row-t">${esc(e.t)}</p><p class="row-s">${esc(e.s)}</p></div><p class="row-d">${esc(e.f)}</p></li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="tiles">
          <div class="tile gray">
            <p class="tile-num"><span class="dots" aria-hidden="true">${anios}+</span></p>
            <p class="tile-label">${icon('layers')} <span><span class="sr-only">Más de ${anios} </span>años diseñando producto digital</span></p>
          </div>
          <button type="button" class="tile black" data-open-contact>
            <span class="tile-title">Hablemos</span>
            <span class="tile-label">${icon('mail')} Email, teléfono y redes ${icon('arrowRight', 'ic-end')}</span>
          </button>
        </div>
      </section>
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
