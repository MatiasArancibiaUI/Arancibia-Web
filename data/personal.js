// Textos de la vista Personal. Las tarjetas con contenido vacío no se muestran;
// con ?dev en la URL aparecen con un recuadro punteado que dice "Completar".
export const personal = {
  aprendiendo: {
    titulo: 'Aprendiendo ahora',
    items: [
      { titulo: 'Diplomatura en IA y Ciencia de Datos', lugar: 'UTN', inicio: '2026-08', fin: null },
      { titulo: 'Licenciatura en Multimedia e Interacción', lugar: 'UADE', inicio: '2021-03', fin: '2026-12' },
      { titulo: 'Automatización con n8n y Claude Code', lugar: '', inicio: null, fin: null },
    ],
  },
  metido: {
    titulo: 'En lo que estoy metido',
    items: ['Design-to-code', 'Agentización de design systems', 'Skills para Figma Agent'],
  },
  ultimo: {
    titulo: 'Lo último que terminé',
    certificacion: 'ai-automation',
  },
  // PENDIENTE: los completa Matías.
  motiva: { titulo: 'Lo que me motiva', texto: '' },
  fuera: { titulo: 'Fuera de la pantalla', texto: '' },
  referentes: { titulo: 'Referentes y lecturas', items: [] },
};
