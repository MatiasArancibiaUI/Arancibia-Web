// Textos de la vista Proceso (#/proceso). Todo sale del CV y de lo que contó Matías sobre su forma de trabajo.
// Las tarjetas con contenido vacío no se muestran; con ?dev en la URL aparecen con un recuadro punteado.
export const personal = {
  // Proceso de trabajo como AI Product Designer, de la idea al deploy. Sin métricas: solo qué hago y qué entrego.
  proceso: {
    titulo: 'Mi proceso como AI Product Designer',
    pasos: [
      {
        id: 'idear',
        titulo: 'Idear',
        icono: 'lightbulb',
        texto: 'Defino el problema junto al equipo de producto: objetivos, usuarios y alcance de la interfaz.',
        hago: ['Relevamiento con producto y tecnología', 'Objetivos y alcance de la primera versión'],
        entrega: 'Problema y alcance acordados',
        herramientas: ['Microsoft Teams', 'Jira Service Management'],
      },
      {
        id: 'investigar',
        titulo: 'Investigar',
        icono: 'search',
        texto: 'UX Research: entrevistas, análisis de comportamiento y síntesis de insights de usuario.',
        hago: ['Entrevistas con usuarios', 'Análisis de comportamiento', 'Síntesis de insights'],
        entrega: 'Insights de usuario',
        herramientas: ['Hotjar', 'Microsoft Clarity', 'Pendo'],
      },
      {
        id: 'disenar',
        titulo: 'Diseñar',
        icono: 'penLine',
        texto: 'Interfaces web y mobile y prototipos interactivos sobre el design system.',
        hago: ['Flujos y pantallas web y mobile', 'Prototipo interactivo'],
        entrega: 'Prototipo navegable',
        herramientas: ['Figma', 'Figma Make'],
      },
      {
        id: 'validar',
        titulo: 'Validar con P.O.',
        icono: 'repeat',
        texto: 'Reviso cada propuesta con el Product Owner, sumo su feedback e itero hasta que la interfaz queda aprobada.',
        hago: ['Revisión con el Product Owner', 'Ajustes según el feedback', 'Nueva iteración hasta aprobar'],
        entrega: 'Versión aprobada',
        herramientas: ['Figma', 'Microsoft Teams', 'Jira Service Management'],
      },
      {
        id: 'documentar',
        titulo: 'Documentar',
        icono: 'fileText',
        texto: 'Specs técnicas por componente y archivos .md que leen el equipo y los agentes.',
        hago: ['Spec técnica por componente', 'Archivo .md con uso, variantes y estados'],
        entrega: 'Specs y .md por componente',
        herramientas: ['Figma', 'Storybook', 'GitHub'],
      },
      {
        id: 'generar',
        titulo: 'Generar con IA',
        icono: 'bot',
        texto: 'Agentes y skills propias para Figma Agent y Claude Code convierten las decisiones de diseño en pantallas reales.',
        hago: ['Skills personalizadas para Figma Agent', 'Pantallas generadas con Claude Code y Cursor'],
        entrega: 'Pantallas listas para desarrollo',
        herramientas: ['Claude Code', 'Cursor', 'Figma Agent'],
      },
      {
        id: 'desplegar',
        titulo: 'Desplegar',
        icono: 'rocket',
        texto: 'Handoff en código listo para producción: push al repositorio y deploy en Vercel.',
        hago: ['Código versionado en GitHub', 'Deploy en Vercel'],
        entrega: 'Código publicado',
        herramientas: ['GitHub', 'Vercel'],
      },
    ],
  },

  // Flujo con IA debajo del recorrido: cómo se conectan diseño, agentes y código (perfil y experiencia en BYMA del CV).
  flujoIA: {
    titulo: 'Flujo con IA',
    bajada: 'Cómo conecto diseño, agentes y código en entornos corporativos.',
    nodos: [
      { nombre: 'Figma', nota: 'Diseño y prototipo', herramienta: 'Figma' },
      { nombre: 'componente.md', nota: 'Spec por componente', icono: 'fileText' },
      { nombre: 'Skills propias', nota: 'Figma Agent y Claude Code', icono: 'bot' },
      { nombre: 'Claude Code', nota: 'Con Cursor, pantallas reales', herramienta: 'Claude Code' },
      { nombre: 'GitHub', nota: 'Repositorio', herramienta: 'GitHub' },
      { nombre: 'Vercel', nota: 'Deploy', herramienta: 'Vercel' },
    ],
    ciclo: 'Validación e iteración con el P.O.',
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
