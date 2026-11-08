import { icon } from './icons.js';
import { esc } from './util.js';
import { profile } from '../data/profile.js';

const c = profile.contacto;

// --- Copiar al portapapeles -------------------------------------------------

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export const copyButton = (text, what, cls = '') =>
  `<button type="button" class="copy-btn ${cls}" data-copy="${esc(text)}" aria-label="Copiar ${esc(what)}" title="Copiar">${icon('copy')}<span class="copy-ok" aria-hidden="true">Copiado</span></button>`;

function onCopyClick(e) {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  copyText(btn.dataset.copy).then((ok) => {
    const live = document.getElementById('announcer');
    if (live) live.textContent = ok ? 'Copiado al portapapeles' : 'No se pudo copiar. Seleccioná el texto a mano.';
    if (!ok) return;
    btn.classList.add('is-copied');
    btn.querySelector('.ic').outerHTML = icon('check');
    setTimeout(() => {
      btn.classList.remove('is-copied');
      const ic = btn.querySelector('.ic');
      if (ic) ic.outerHTML = icon('copy');
    }, 1600);
  });
}

// --- CV ---------------------------------------------------------------------

export const cvButton = (cls = '') =>
  profile.cv
    ? `<a class="icon-btn ${cls}" href="${esc(profile.cv)}" download aria-label="Descargar CV" title="Descargar CV">${icon('download')}</a>`
    : `<button type="button" class="icon-btn ${cls}" disabled aria-label="Descargar CV (todavía no disponible)" title="CV todavía no disponible">${icon('download')}</button>`;

export const cvTextButton = () =>
  profile.cv
    ? `<a class="btn" href="${esc(profile.cv)}" download>${icon('download')} Descargar CV</a>`
    : `<button type="button" class="btn" disabled title="CV todavía no disponible">${icon('download')} Descargar CV</button>`;

// --- Enlaces externos -------------------------------------------------------

export const links = () =>
  [
    { id: 'linkedin', label: 'LinkedIn', url: c.linkedin, icon: 'linkedin' },
    { id: 'behance', label: 'Behance', url: c.behance, icon: 'behance' },
    { id: 'github', label: 'GitHub', url: c.github, icon: 'github' },
  ].filter((l) => l.url);

// --- Menús desplegables -----------------------------------------------------

function closeMenus(except) {
  document.querySelectorAll('[data-menu-toggle][aria-expanded="true"]').forEach((b) => {
    if (b === except) return;
    b.setAttribute('aria-expanded', 'false');
    const m = document.getElementById(b.getAttribute('aria-controls'));
    if (m) m.hidden = true;
  });
}

function onMenuClick(e) {
  const toggle = e.target.closest('[data-menu-toggle]');
  if (toggle) {
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    closeMenus(toggle);
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    if (open) menu.querySelector('a, button')?.focus();
    return;
  }
  if (e.target.closest('.menu a, .menu button')) {
    closeMenus();
    return;
  }
  if (!e.target.closest('.menu')) closeMenus();
}

function onMenuKey(e) {
  const menu = e.target.closest('.menu');
  if (e.key === 'Escape' && menu) {
    const toggle = document.querySelector(`[aria-controls="${menu.id}"]`);
    closeMenus();
    toggle?.focus();
    e.stopPropagation();
    return;
  }
  if (menu && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    const items = [...menu.querySelectorAll('a, button:not([disabled])')];
    const i = items.indexOf(document.activeElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  }
}

// --- Contacto ---------------------------------------------------------------

export const contactRows = () => `
  <div class="contact-row">
    ${icon('mail')}
    <span class="contact-value" translate="no">${esc(c.email)}</span>
    ${copyButton(c.email, 'email')}
    <a class="icon-btn xs" href="mailto:${esc(c.email)}" aria-label="Escribir un email">${icon('arrowUpRight')}</a>
  </div>
  <div class="contact-row">
    ${icon('phone')}
    <span class="contact-value" translate="no">${esc(c.telefono)}</span>
    ${copyButton(c.telefono, 'teléfono')}
    <a class="icon-btn xs" href="tel:${esc(c.telefonoHref)}" aria-label="Llamar">${icon('arrowUpRight')}</a>
  </div>`;

export const linkRows = () =>
  links()
    .map(
      (l) =>
        `<a class="link-row" href="${esc(l.url)}" target="_blank" rel="noopener">${icon(l.icon)}<span>${l.label}</span>${icon('externalLink', 'ic-end')}</a>`,
    )
    .join('');

function initContact() {
  const dlg = document.getElementById('contact');
  dlg.innerHTML = `
    <div class="dialog-card">
      <div class="dialog-head">
        <div>
          <p class="label">Contacto</p>
          <h2 id="contact-title" class="dialog-title">Hablemos</h2>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="Cerrar">${icon('x')}</button>
      </div>
      <p class="dialog-text">Contame en qué estás trabajando. Podés copiar el email o el teléfono, o escribirme por LinkedIn.</p>
      <div class="contact-list">${contactRows()}</div>
      <div class="link-list">${linkRows()}</div>
    </div>`;
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-contact]');
    if (opener) {
      dlg.showModal();
      return;
    }
    if (e.target.closest('[data-close]') || e.target === dlg) dlg.close();
  });
}

function initLinksMenu() {
  const menu = document.getElementById('links-menu');
  menu.innerHTML = `
    ${links()
      .map((l) => `<li role="none"><a role="menuitem" href="${esc(l.url)}" target="_blank" rel="noopener">${icon(l.icon)} ${l.label}</a></li>`)
      .join('')}
    <li role="none"><button type="button" role="menuitem" data-copy="${esc(c.email)}">${icon('mail')} Copiar email</button></li>
    <li role="none"><button type="button" role="menuitem" data-open-contact>${icon('phone')} Ver contacto</button></li>`;
}

// --- Pestañas ---------------------------------------------------------------

export function initTabs(root) {
  root.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tab, false);
    });
    list.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        e.stopPropagation();
        select(next, true);
      }
    });
  });
}

export function initUI() {
  document.addEventListener('click', onCopyClick);
  document.addEventListener('click', onMenuClick);
  document.addEventListener('keydown', onMenuKey);
  initContact();
  initLinksMenu();
}
