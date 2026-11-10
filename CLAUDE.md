# Portfolio de Matías Arancibia: convenciones generales

Leé este archivo completo antes de tocar cualquier cosa del proyecto. Si una instrucción mía en el chat contradice algo de acá, gana la instrucción del chat.

## 0. Índice rápido de skills y agentes

Hay copias del mismo skill en varias carpetas; **no mover ni borrar nada**. Usar la de `.claude/`, salvo `design-taste-frontend`, que solo existe en `.agents/`.

| Qué | Dónde |
|---|---|
| Skill `impeccable` (activo en Claude) | `.claude/skills/impeccable/SKILL.md` |
| ↳ playbooks por comando | `.claude/skills/impeccable/reference/*.md` (`craft-floor`, `new-work`, `shape`, `audit`, `critique`, `polish`, `animate`, `layout`, `typeset`, `colorize`, `harden`, `optimize`, `adapt`, `document`, `live`, …) |
| ↳ ejecutable | `.claude/skills/impeccable/scripts/impeccable` (`.cmd` en Windows) |
| Subagentes de impeccable | `.claude/agents/impeccable-{asset-producer,documenter,finish-reviewer,manual-edit-applier}.md` |
| Skill `design-taste-frontend` (requiere Node 22+ y Chrome/Edge) | `.agents/skills/design-taste-frontend/SKILL.md` |
| ↳ referencias, scripts, assets | `.agents/skills/design-taste-frontend/{references,scripts,assets,library}/` (`gate.mjs` = chequeo final) |
| Impeccable para otros agentes | `.agents/skills/impeccable/` (+ `agents/*.toml`), `.agent/skills/impeccable/`, `.codex/hooks.json` |
| Versiones fijadas / hooks / config | `skills-lock.json`, `.claude/settings.local.json`, `.impeccable/config.local.json` |

Uso: para crear, rediseñar, auditar, pulir o animar UI, invocar `/impeccable <comando> [target]` y leer `reference/craft-floor.md` antes de editar UI. `impeccable` pide `PRODUCT.md` y `DESIGN.md` en la raíz (todavía no existen; se generan con `impeccable init` / `document`). Los skills nunca pisan las reglas de este archivo: la dirección visual de la sección 1 y el sistema de la sección 3 mandan.

Comandos (Windows/PowerShell): `npm run dev` levanta `scripts/dev.mjs` (servidor estático sin dependencias) en http://localhost:5173. No hay build. Si PowerShell bloquea `npm.ps1`: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` o usar `npm.cmd`. Abrir `index.html` con doble clic no funciona: los módulos ES necesitan servidor.

## 1. Qué es este proyecto

Sitio web personal de Matías Ezequiel Arancibia, AI Product Designer (UI/UX, Design Systems, AI Automation y Design-to-Code), con base en CABA, Argentina. Su trabajo actual es en BYMA (Bolsas y Mercados Argentinos), en productos del mercado de capitales.

El sitio muestra cuatro cosas: proyectos, herramientas que usa, experiencia y medios de contacto. Es un portfolio que tiene que transmitir criterio de diseño y manejo de automatización con IA, así que la calidad visual y de código es parte del mensaje.

Referencia visual: un tablero apaisado tipo dashboard (composición "Rythea") con la estética técnica de "Sigil": acento naranja, píxeles cuadrados, retícula de plano de fondo, etiquetas en monoespaciada con un cuadrito naranja, esquinas naranjas en las tarjetas principales, una palabra del titular en tipografía de píxeles, una tarjeta negra de acento, la foto recortada en blanco y negro asomando sobre las tarjetas y un dock semicircular. El perfil (foto, nombre, pestañas) va a la izquierda y el trabajo (titular, stack, tarjetas) a la derecha. No cambiar esta dirección sin que yo lo pida.

## 2. Stack y estructura

- Webapp estática de una sola página: HTML, CSS y JavaScript con módulos ES, sin framework, sin build y sin dependencias (solo Google Fonts). Deploy en Vercel sirviendo la raíz tal cual.
- Si una librería es realmente necesaria, preguntame antes y fijá la versión exacta.

### Rutas (hash router en `js/main.js`)

| Ruta | Vista | Atajo | Archivo |
| --- | --- | --- | --- |
| `#/` | Inicio (tablero tipo Rythea) | `1` | `js/views/home.js` |
| `#/experiencia` | Experiencia | `2` | `js/views/experiencia.js` |
| `#/proyectos` | Proyectos | `3` | `js/views/proyectos.js` |
| `#/proceso` | Proceso: proceso de diseño a código (destacado), herramientas de IA, habilidades, mercado de capitales y "Aprendiendo ahora". `#/personal` redirige acá | `4` | `js/views/proceso.js` |
| `#/sobre-mi` | Sobre mí (ficha visual tipo CV) | `5` | `js/views/sobre-mi.js` |

Menú inferior: barra horizontal centrada (`.dock`) con ícono y nombre en el mismo orden que los atajos: Inicio (casa), Experiencia (maletín), Proyectos (carpeta), Proceso (flujo), Sobre mí (credencial). En celular solo muestra el nombre de la vista activa.

Cada vista exporta `title`, `render()` (devuelve HTML) y opcionalmente `mount(el)` (devuelve una función de limpieza). Para sumar una vista: crear el módulo, agregarlo al arreglo `routes` de `js/main.js` y un botón en el `.dock` de `index.html`. `/` o `Ctrl+K` abren la búsqueda, `Esc` la cierra.

### Archivos

- `index.html`: barra superior, `<main id="main">` donde se monta la vista, dock, diálogo de contacto, metas, Open Graph y manifest.
- `css/tokens.css` (tokens claro/oscuro) · `css/base.css` (reset, marco `.app`, transición de vistas, scroll fino) · `css/components.css` (botones, tarjetas, chips, menús, dock, diálogo) · `css/views.css` (una sección por vista + degradación por altura + modo apilado).
- `js/main.js` (router y arranque) · `js/dock.js` · `js/search.js` (paleta de búsqueda en memoria) · `js/dots.js` (canvas de píxeles: `wave`, `pill`, `ring`, `scatter`, `cover`, con movimiento lento) · `js/motion.js` (entrada escalonada y conteo de números) · `js/brand.js` (logo) · `js/logos.js` (logos de herramientas) · `js/theme.js` · `js/ui.js` (copiar, menús, pestañas, contacto, botón de CV) · `js/icons.js` (íconos de línea estilo Lucide) · `js/util.js` (fechas, escape, normalizar).
- **Datos (fuente de verdad, se editan acá y no en el HTML):** `data/profile.js` (CV: contacto, perfil, experiencia, educación, certificaciones, habilidades, idiomas, `cv`), `data/projects.js` (proyectos), `data/personal.js` (vista Proceso: pasos del proceso, "Aprendiendo ahora" y las tarjetas personales PENDIENTES). `profile.mercado` guarda los instrumentos financieros del CV (CEDEARs, ETFs, Fondos Comunes de Inversión).
- `assets/`: `matias-bn.webp` (recorte B/N con alfa, 800 × 728, 21 KB, sacado de la foto original de 800 × 800), `logo.svg` / `logo-dark.svg` (monograma), `icon.svg` (favicon), íconos PNG de la app, `og.jpg`. El CV va en `assets/cv-matias-arancibia.pdf`; al subirlo, poner esa ruta en `profile.cv` y los botones de descarga se activan solos.
- `manifest.webmanifest`: instalable como app (sin service worker).
- `scripts/dev.mjs`: servidor local.
- Nombres de archivos y carpetas en minúsculas, con guiones, sin acentos ni espacios.

### Reglas de pantalla

- El marco `.app` mide `min(100vw - 32px, 1440px)` × `min(100dvh - 32px, 920px)` y es contenedor de tamaño (`container: app / size`): las medidas usan `cqh`/`cqw` con `clamp()`.
- Sin scroll de página desde 1024×700. Las vistas largas usan scroll interno dentro del marco. Debajo de 760 px y 680 px de alto del marco se ocultan detalles secundarios antes de que algo se corte.
- Con el marco de menos de 960 px de ancho o 600 px de alto, todo pasa a una columna con scroll interno en `.main` (celular y tablet vertical).
- El menú reserva su espacio con `--reserve` en `.view` (alto del menú + margen); nada queda debajo. En el modo apilado el menú deja de flotar y es la última fila del marco (media query en `css/components.css`), así siempre se ve en celular.
- Pestaña Herramientas de la home: solo programas, como etiquetas con logo (sin conceptos, lenguajes ni metodologías; la lista de exclusiones es `NO_PROGRAMAS` en `js/views/home.js`).
- Tarjeta de pestañas de la home: Experiencia muestra los roles anteriores (UADE y Dogma); el actual vive en la tarjeta grande "Trabajo actual", con el logo monocromo de BYMA (`companyLogo()` en `js/logos.js`). Herramientas y Educación ocultan los mosaicos de abajo para leerse completas, sin scroll.
- La barra superior no lleva reloj ni chip de CABA. Las vistas con scroll no llevan desvanecido ni sombra bajo el menú.
- La home entra completa, sin scroll: si no entra, primero se compacta y después se ocultan detalles secundarios por altura. Las demás vistas (Experiencia, Proyectos, Proceso, Sobre mí) scrollean dentro del marco (`.view-host.scrolls`, lo asigna `js/main.js`): el contenido toma su alto natural, con aire entre bloques, y no se esconde nada por altura. En el modo apilado (celular) scrollea `.main`.
- Meses y años se calculan en `js/util.js` (`monthsBetween` cuenta el mes de inicio y el de fin). Nunca escribir duraciones a mano.
- Las consultas de contenedor no aplican a `.app` mismo: para cambiar variables por tamaño se usa `.app > *`.

## 3. Sistema de diseño

Todo color, tipografía y radio sale de tokens CSS definidos en `:root`. No escribir colores sueltos en los componentes.

### Tokens de color (tema claro)

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#e9e7e1` | Fondo de la página (gris cálido) |
| `--panel` | `#f3f2ee` | Panel grande que contiene el tablero |
| `--card` | `#fbfaf7` | Tarjetas |
| `--soft` | `#ebe9e3` | Chips, barra de pestañas, tiles grises |
| `--ink` | `#141413` | Texto principal |
| `--mute` | `#6b6964` | Texto secundario y etiquetas |
| `--accent` | `#ff5a00` | Acento naranja: píxeles, marcadores, cuadritos, esquinas |
| `--accent-display` | `#e14b00` | Naranja para texto grande (números, palabra del titular), contraste de 3:1 o más |
| `--accent-soft` | `#ffe4d4` | Celdas resaltadas, barrido de las píldoras |
| `--dot-off` | `#dad7cf` | Píxeles apagados |
| `--line` / `--grid` | `#e0ded7` / tinta al 5,5 % | Bordes finos / retícula de fondo |
| `--black` | `#121211` | Tarjeta negra, dock activo, tile negro |
| `--on-black` / `--on-black-mute` | `#f5f4f0` / `#9a9893` | Texto sobre negro |

El tema oscuro redefine los mismos tokens (ahí `--black` se invierte a claro). Reglas:
- El naranja es el único acento. No sumar otros colores de marca. Los logos de herramientas van monocromos.
- El naranja se usa en píxeles, marcadores, números grandes y una palabra del titular, nunca en texto chico ni en bloques de texto.
- La tarjeta negra es el único elemento de alto contraste por sección. No convertir más tarjetas en negras.
- Cualquier color nuevo se agrega como token con sus dos valores (claro y oscuro) y se prueba en ambos temas.

### Tipografía

- Display de píxeles: **Doto** (900, eje `ROND` en 0 = píxeles cuadrados), para números, siglas grandes y como mucho una palabra destacada por titular (`.hl`). Nunca para texto corrido.
- Cuerpo y títulos: **Plus Jakarta Sans** (400 a 800). Títulos en 700 con `letter-spacing: -.035em` y `text-wrap: balance`.
- Etiquetas, fechas, metadatos y subtítulos numerados (`.eyebrow` con `.idx` "01" a "05"): **JetBrains Mono** 500, 11px, mayúsculas, `letter-spacing: .08em`, color `--mute`. Las `.label` llevan un cuadrito naranja de 6px antes.
- Las fuentes se cargan desde Google Fonts con fallback real (`ui-monospace` para Doto y la mono, `system-ui` para el cuerpo).
- Texto corrido con un máximo de unos 65 caracteres de ancho.

### Forma

- Panel principal: radio 28px. Tarjetas: 20px con borde de 1px `--line`. Tiles: 16px. Chips: etiqueta de 6px (los datos del perfil, píldora). Botones de ícono y dock: círculos.
- Separación entre tarjetas: 20px en escritorio, menos en celular.
- Sin sombras. La jerarquía sale del color de fondo, los bordes finos y el espacio.
- Elementos gráficos permitidos (y solo estos): retícula de fondo cada 48px, esquina naranja `.tick` en las tarjetas principales, cuadritos naranjas en etiquetas y viñetas, rayado diagonal fino en el tile gris, borde punteado en el pie de los proyectos.

### Logo

Monograma "MA" en píxeles cuadrados (grilla de 13 × 7) con un cursor naranja de tres píxeles que parpadea: design-to-code. Vive en `js/brand.js` (`brandMark()` para el sitio, `brandSVG()` para generar archivos). Archivos: `assets/logo.svg`, `assets/logo-dark.svg`, `assets/icon.svg` y los PNG de la app.

### Movimiento

Discreto y siempre anulado con `prefers-reduced-motion`:
- Entrada escalonada de los bloques al cambiar de vista (`.rise`, medio segundo). Nunca en `.stack` (rompe el apilado).
- Números de píxeles que cuentan desde cero (`data-count`).
- Canvas a 12 cuadros por segundo: la onda crece una vez y después respira un píxel, una columna recorre las píldoras, el último punto del gráfico de dispersión late, el anillo gira muy lento.
- Franja de logos (`.logo-strip`) en desplazamiento lento; se pausa al pasar el mouse.
- El cursor del logo y "Actual" parpadean en pasos.
- Hover: tarjetas y botones suben 2px y toman el naranja.

### Componentes existentes (reutilizarlos, no inventar variantes)

- `.card`: tarjeta clara. `.black`: tarjeta negra.
- `.chip` y `.chips`: etiquetas de tecnologías o datos cortos.
- `.label`: etiqueta en mayúsculas.
- `.dots`: número o sigla en Doto.
- `.logo-strip`: franja "Stack" con los logos de las herramientas (`js/logos.js`, Simple Icons CC0). Cursor, Pendo y los productos de Microsoft no tienen logo libre y se muestran solo con su nombre. `toolChip(nombre)` arma una etiqueta con logo.
- `canvas[data-kind="wave"]` y `canvas[data-kind="ring"]`: ondas y anillo de píxeles naranjas, dibujados con `data-seed` fijo para que sean estables. Leen los colores de los tokens y se redibujan al cambiar el tema o el tamaño.
- `.tabcard` con `role="tablist"`: pestañas de Experiencia, Herramientas y Educación.
- `.tile`: acceso a una red (LinkedIn, Behance).
- `.dock`: navegación flotante inferior con la sección activa marcada.

Si falta un componente, primero intentá resolverlo con los existentes. Si hay que crear uno nuevo, tiene que usar los tokens, los radios y la tipografía de arriba.

Nombres actuales en el código: `.card`, `.card.black`, `.chip`/`.chips`, `.label`, `.dots`, `.icon-btn` (`.sm`, `.xs`), `.btn`, `.tabcard` + `[role=tablist]`, `.tile` (`.gray`, `.black`), `.dock`, `.menu`, `.meter`, `.stack` (capas apiladas). Canvas: `canvas[data-kind="wave|pill|ring|scatter|cover"][data-seed]`; dentro de una `.black` usan `--dot-off-black` para los puntos apagados. En tema oscuro, `--black` se invierte a claro para que la tarjeta de acento mantenga el contraste.

## 4. Layout y responsive

- Escritorio: tablero apaisado de dos columnas, 43 / 57 (izquierda: perfil con foto, nombre, rol, ubicación e idiomas en una línea, pestañas y accesos (email y teléfono viven en Sobre mí y en el diálogo "Hablemos"); derecha: subtítulo numerado, titular, franja de stack, trabajo actual, aprendiendo y proyecto destacado).
- Experiencia: debajo del título, la línea de tiempo en una tarjeta a todo el ancho (un píxel por mes desde 2023, etiquetas de cada rol arriba y años abajo; los meses se encienden en orden al entrar en pantalla). Debajo, BYMA a la izquierda con sus puntos en dos columnas; UADE y Dogma a la derecha, con todos sus puntos visibles.
- Proceso: el proceso es una columna alta (tarjeta negra) con los cinco pasos en vertical y sus herramientas como etiquetas; al lado, IA y mercado de capitales arriba, "Aprendiendo ahora" en el medio y habilidades abajo.
- Sobre mí: cuatro columnas. Datos de contacto y bio ocupan columnas completas; experiencia, idiomas, formación y certificaciones son tarjetas chicas.
- Menos de 980px: una columna. Menos de 680px: todo apilado, la foto pasa debajo del nombre y desaparecen los botones de texto de la barra superior.
- Margen lateral mínimo de 16px en cualquier ancho, respetando `env(safe-area-inset-*)`.
- Nunca scroll horizontal en la página. Solo tablas o bloques de código pueden desbordar, dentro de su propio contenedor con `overflow-x: auto`.
- Los hijos de grid o flex que contienen texto llevan `min-width: 0`.
- Probar siempre a 1440, 1024, 768 y 390px de ancho.

## 5. Tema claro y oscuro

- Respetar `prefers-color-scheme` y permitir el botón manual (`data-theme="light|dark"` en `<html>`, guardado en `localStorage` dentro de `try/catch`).
- Cada token tiene primero su valor claro en `:root`; el oscuro lo redefine en `@media (prefers-color-scheme: dark)` (con `:root:not([data-theme="light"])`) y en `:root[data-theme="dark"]`.
- `body` siempre tiene fondo explícito con un token.
- Cada cambio visual se revisa en los dos temas antes de darlo por terminado.

## 6. Foto y assets

- La foto es un recorte en blanco y negro con fondo transparente, en WebP. Está posicionada con `position: absolute` y se superpone al borde superior de la tarjeta de pestañas, que va por encima (`z-index`) y tapa la parte inferior del torso.
- Si se reemplaza la foto: mismo tratamiento (recorte limpio sin halo, escala de grises, WebP con alpha), probado sobre fondo claro y oscuro. Pesar menos de 100 KB.
- Toda imagen lleva `alt` descriptivo y `width` y `height` explícitos. Las decorativas llevan `alt=""` o `aria-hidden="true"`.
- Imágenes de proyectos: WebP o AVIF, con versión liviana para celular. Nada de imágenes de stock genéricas.

## 7. Contenido y tono

- **Fuente de verdad: mi CV.** Nombre, cargos, empresas, fechas, herramientas, educación y certificaciones salen de ahí. No inventar datos, cifras, clientes, métricas ni logros. Si falta un dato, dejá un marcador visible y avisame.
- Idioma: español. Voseo rioplatense en frases dirigidas al lector ("escribime", "contame"), sin exagerar.
- Frases cortas, directas, en voz activa. Nombrar las cosas como las reconoce quien las lee.
- Evitar: guiones largos para hacer aclaraciones, estructuras tipo "no es X, es Y", frases hechas ("apasionado", "soluciones innovadoras" sin ejemplo), emojis como marcadores de sección.
- Los botones dicen qué pasa al tocarlos ("Ver proyectos", "Copiar").
- Fechas con formato "Mar 2026 – Actualidad". Nombres propios de empresas y herramientas con su escritura oficial (BYMA, Figma, Claude Code, GitHub).
- Los datos confidenciales de BYMA o de clientes no se publican. Si un caso necesita mostrar pantallas o números internos, preguntame primero.

## 8. Cómo agregar un proyecto

Cuando te pase un proyecto nuevo, seguí estos pasos:

1. Pedime lo que falte: nombre, rol, año, qué problema resolvía, qué hice yo, tecnologías, resultado (solo si es real y publicable), links (demo, repo, Behance) e imágenes.
2. Agregar un objeto a `data/projects.js`: `{ id, titulo, tipo, descripcion, tecnologias, anio, empresa, rol, destino: "behance" | "github", url, portada }`. No se toca HTML ni CSS. Sin `url`, la tarjeta se ve apagada con "Link próximamente"; sin `portada`, se genera un patrón de puntos desde el `id`.
3. El proyecto destacado es la tarjeta negra de la home (`.feat` en `js/views/home.js`). Solo puede haber uno.
4. Los filtros y la búsqueda toman el proyecto automáticamente. La vista scrollea si hay más filas de las que entran.
5. Revisar enlaces, `alt` de imágenes y vista en celular.

## 9. Accesibilidad

- HTML semántico: un solo `<h1>`, jerarquía de títulos ordenada, `<main>`, `<nav>`, `<header>`, `<footer>`.
- Foco visible en todo elemento interactivo. Navegación completa con teclado, incluidas las pestañas con flechas izquierda y derecha.
- Contraste suficiente en ambos temas. El rojo sobre fondos claros no se usa para texto pequeño.
- Los números en Doto llevan `aria-hidden` cuando hay un texto equivalente al lado.
- Respetar `prefers-reduced-motion`: sin animaciones obligatorias, y las transiciones se anulan en ese caso.
- El contenido importante está visible al cargar. Nada queda oculto esperando un scroll o una animación.
- Email y teléfono se muestran como texto seleccionable con botón de copiar. Los enlaces `mailto:` y `tel:` son un extra, nunca la única vía.

## 10. Calidad del código

- HTML/JSX válido: etiquetas cerradas, `id` únicos.
- CSS: todo sobre tokens, sin `!important`, sin estilos en línea salvo casos puntuales justificados. Cuidar la especificidad para que unas reglas no anulen a otras sin querer.
- JavaScript: sin dependencias extra, sin variables globales, con `try/catch` en `localStorage` y en el portapapeles. Los canvas se redibujan con `ResizeObserver` y al cambiar el tema.
- Comentarios solo donde explican un porqué. Nada de código muerto ni comentado.
- Rendimiento: imágenes optimizadas, fuentes con `display=swap`, peso total de la página bajo 1 MB sin contar imágenes de casos.
- SEO básico: `<title>` con mi nombre, meta description, Open Graph con imagen, `lang="es"`.

## 11. Qué no hacer

- No cambiar la paleta, las fuentes ni la composición del tablero sin pedírmelo.
- No sumar secciones, animaciones llamativas, contadores ni efectos decorativos que no estén en este documento.
- No usar plantillas genéricas de portfolio, degradados morados, tarjetas con barra de color lateral ni íconos de emoji.
- No inventar proyectos, testimonios, métricas ni logos de clientes.
- No dejar texto de relleno (lorem ipsum) ni enlaces `#` en producción.
- No subir a ningún lado datos personales que no estén ya en el sitio (por ejemplo dirección o documento).

## 12. Antes de dar un cambio por terminado

- [ ] Se ve bien a 1440, 1024, 768 y 390px, sin scroll horizontal.
- [ ] Se ve bien en tema claro y oscuro.
- [ ] Todos los enlaces funcionan y abren en pestaña nueva los externos (`rel="noopener"`).
- [ ] Los datos coinciden con el CV.
- [ ] Hay foco visible y se navega con teclado.
- [ ] No hay errores en la consola.
- [ ] Te cuento en una o dos frases qué cambió y qué queda pendiente de mi parte.
