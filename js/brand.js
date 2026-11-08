// Logo: monograma "MA" en píxeles cuadrados + cursor naranja (design-to-code).
// Grilla de 13 × 7; cada píxel ocupa .84 de su celda para que se lean los cuadrados.
const M = ['X...X', 'XX.XX', 'X.X.X', 'X.X.X', 'X...X', 'X...X', 'X...X'];
const A = ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'];
const S = 0.84;

const pixels = () => {
  const out = [];
  M.forEach((row, y) => [...row].forEach((c, x) => c === 'X' && out.push([x, y])));
  A.forEach((row, y) => [...row].forEach((c, x) => c === 'X' && out.push([x + 6, y])));
  return out;
};

const rects = (list) => list.map(([x, y]) => `<rect x="${x}" y="${y}" width="${S}" height="${S}"/>`).join('');

// Cursor: tres píxeles apilados a la derecha de la A.
const cursor = rects([[12, 4], [12, 5], [12, 6]]);

export const brandMark = (cls = '') =>
  `<svg class="brand-mark${cls ? ` ${cls}` : ''}" viewBox="0 0 12.84 6.84" aria-hidden="true" focusable="false"><g fill="currentColor">${rects(pixels())}</g><g class="brand-cursor">${cursor}</g></svg>`;

// Para generar los archivos estáticos (favicon, íconos de la app).
export const brandSVG = ({ ink = '#141413', accent = '#ff5a00', bg = null, pad = 2 } = {}) => {
  const w = 12.84 + pad * 2;
  // Con fondo es un ícono cuadrado; sin fondo, el lienzo se ajusta al monograma.
  const h = bg ? w : 6.84 + pad * 2;
  const oy = (h - 6.84) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${
    bg ? `<rect width="${w}" height="${h}" rx="${w * 0.22}" fill="${bg}"/>` : ''
  }<g transform="translate(${pad} ${oy})"><g fill="${ink}">${rects(pixels())}</g><g fill="${accent}">${cursor}</g></g></svg>`;
};
