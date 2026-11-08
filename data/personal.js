// Textos de la vista Proceso (#/proceso). Todo sale del CV.
// Las tarjetas con contenido vacío no se muestran; con ?dev en la URL aparecen con un recuadro punteado.
export const personal = {
  // Proceso de trabajo como AI Product Designer. Cada paso resume frases del CV.
  proceso: {
    titulo: 'Mi proceso como AI Product Designer',
    bajada: 'De la investigación al código listo para producción.',
    pasos: [
      { titulo: 'Investigar', icono: 'search', texto: 'UX Research: entrevistas, análisis de comportamiento y síntesis de insights.', herramientas: ['Hotjar', 'Microsoft Clarity', 'Pendo'] },
      { titulo: 'Diseñar', icono: 'penLine', texto: 'Interfaces web y mobile y prototipos interactivos en Figma.', herramientas: ['Figma', 'Figma Make'] },
      { titulo: 'Especificar', icono: 'fileText', texto: 'Specs técnicas por componente del design system.', herramientas: ['Figma', 'Storybook'] },
      { titulo: 'Generar con IA', icono: 'bot', texto: 'Skills para Figma Agent y Claude Code que convierten decisiones de diseño en pantallas reales.', herramientas: ['Claude Code', 'Cursor', 'Figma Agent'] },
      { titulo: 'Entregar', icono: 'code', texto: 'Handoff en código listo para producción.', herramientas: ['GitHub', 'Vercel'] },
    ],
  },

  aprendiendo: {
    titulo: 'Aprendiendo ahora',
    items: [
      { titulo: 'Diplomatura en IA y Ciencia de Datos', lugar: 'UTN', inicio: '2026-08', fin: null },
      { titulo: 'Licenciatura en Multimedia e Interacción', lugar: 'UADE', inicio: '2021-03', fin: '2026-12' },
      { titulo: 'Automatización con n8n y Claude Code', lugar: '', inicio: null, fin: null },
    ],
  },

  // PENDIENTE: los completa Matías.
  motiva: { titulo: 'Lo que me motiva', texto: '' },
  fuera: { titulo: 'Fuera de la pantalla', texto: '' },
  referentes: { titulo: 'Referentes y lecturas', items: [] },
};
