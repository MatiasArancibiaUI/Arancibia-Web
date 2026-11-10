// Fuente de verdad: CV de Matías Arancibia. No agregar nada que no esté en el CV.
export const profile = {
  nombre: 'Matías Arancibia',
  nombreCompleto: 'Matías Ezequiel Arancibia',
  rol: 'AI Product Designer',
  especialidad: 'UI/UX, Design Systems, AI Automation y Design-to-Code',

  contacto: {
    email: 'matias.arancibia05@gmail.com',
    telefono: '+54 9 11 2628-7243',
    telefonoHref: '+5491126287243',
    linkedin: 'https://www.linkedin.com/in/matias-arancibia',
    behance: 'https://www.behance.net/matiasargentina',
    github: '', // PENDIENTE
    ubicacion: 'CABA, Argentina',
  },

  // Vacío hasta que exista assets/cv-matias-arancibia.pdf; el botón queda deshabilitado.
  cv: '',

  perfil: [
    'Diseñador y desarrollador de interfaces Semi Senior, enfocado en la automatización de productos digitales, principalmente financieros, con handoff en código listo para producción e integración de sistemas de diseño institucionales y UI kits web.',
    'Lideré y creé la automatización y agentización del Design System de BYMA, conectando Figma, GitHub y Claude Code/Cursor, con skills que generan interfaces listas para desarrollo en tiempo récord, reduciendo costos e iteraciones.',
    'Experiencia en sitios institucionales, interfaces de backoffice y productos financieros de alta complejidad del mercado de capitales, como CEDEARs, ETFs y Fondos Comunes de Inversión. Me mantengo en formación constante, disfruto el trabajo en equipo y busco ofrecer soluciones innovadoras y ágiles con las nuevas herramientas de Inteligencia Artificial.',
  ],

  experiencia: [
    {
      id: 'byma',
      empresa: 'BYMA',
      empresaCompleta: 'BYMA Bolsas y Mercados Argentinos S.A.',
      cargo: 'AI Product Designer',
      inicio: '2026-03',
      fin: null,
      lugar: 'Buenos Aires',
      modalidad: 'Híbrido',
      foco: 'Design System e IA',
      herramientas: ['Figma', 'GitHub', 'Claude Code', 'Cursor', 'Figma Agent'],
      puntos: [
        'Diseño de interfaz de usuario y experiencia UX/UI para productos del mercado de capitales, incluyendo la sección de Inversores y Financiamiento de la web oficial de BYMA.',
        'Lideré el rediseño integral del sitio web de Caja de Valores, una pieza clave de la presencia digital institucional de BYMA.',
        'Lideré una iniciativa insignia de automatización que conecta Figma con el código front-end: generé specs técnicas por componente e integré el sistema con IA (Claude Code) para convertir decisiones de diseño en pantallas reales, reduciendo el tiempo de diseño a desarrollo y fijando un nuevo estándar de trabajo para el equipo.',
        'Desarrollé skills personalizadas para optimizar los flujos con Figma Agent, ampliando esta automatización entre diseño e IA.',
        'Trabajo colaborativo con equipos de producto y tecnología en un entorno híbrido de alta exigencia.',
      ],
    },
    {
      id: 'uade',
      empresa: 'UADE',
      empresaCompleta: 'UADE',
      cargo: 'Diseñador UX/UI, Product Designer (prácticas)',
      inicio: '2025-07',
      fin: '2026-01',
      lugar: '',
      modalidad: 'Remoto',
      herramientas: ['Figma'],
      puntos: [
        'Diseño end-to-end de interfaces web y mobile en Figma, desde investigación hasta prototipado interactivo y handoff a desarrollo.',
        'UX Research: entrevistas, análisis de comportamiento y síntesis de insights de usuario.',
        'Diseño de flujos con funcionalidades impulsadas por Inteligencia Artificial y Machine Learning.',
      ],
    },
    {
      id: 'dogma',
      empresa: 'Dogma Solutions',
      empresaCompleta: 'Dogma Solutions',
      cargo: 'Diseñador UX/UI',
      inicio: '2023-03',
      fin: '2025-04',
      lugar: 'Buenos Aires',
      modalidad: 'Híbrido',
      herramientas: [],
      puntos: [
        'Diseño de interfaces en proyectos de consultoría TI para clientes externos.',
        'Diseño y desarrollo de módulos de backoffice.',
        'Elaboración de reportes y presentaciones ejecutivas para clientes.',
        'Colaboración con equipos de desarrollo bajo metodología ágil y dinámica de sprints.',
      ],
    },
  ],

  educacion: [
    {
      id: 'utn',
      titulo: 'Diplomatura en Inteligencia Artificial y Ciencia de Datos',
      tituloCorto: 'Diplomatura en IA y Ciencia de Datos',
      institucion: 'Universidad Tecnológica Nacional (UTN)',
      institucionCorta: 'UTN',
      inicio: '2026-08',
      fin: null,
      detalle: '',
    },
    {
      id: 'uade-lic',
      titulo: 'Licenciatura en Multimedia e Interacción',
      tituloCorto: 'Licenciatura en Multimedia e Interacción',
      institucion: 'UADE',
      institucionCorta: 'UADE',
      inicio: '2021-03',
      fin: '2026-12',
      detalle: 'Desarrollo y diseño de interfaces responsive, contenido digital/multimedia y recursos informáticos.',
    },
  ],

  certificaciones: [
    { id: 'ai-automation', titulo: 'AI Automation', institucion: 'Coderhouse', fecha: '2026-05', detalle: 'n8n, Claude Code y automatización de flujos con IA.' },
    { id: 'javascript', titulo: 'Curso de JavaScript', institucion: 'Coderhouse', fecha: '2024-01', detalle: '' },
  ],

  habilidades: [
    { id: 'ia', categoria: 'Inteligencia Artificial y Automatización', corta: 'IA y Automatización', items: ['n8n', 'Claude', 'Claude Code', 'Gemini', 'GitHub Copilot', 'Cursor', 'Vercel'] },
    { id: 'diseno', categoria: 'Diseño UX/UI', corta: 'Diseño UX/UI', items: ['Figma', 'Figma Make', 'Prototipado interactivo', 'Design systems', 'Design-to-code', 'UX Research'] },
    { id: 'analitica', categoria: 'Analítica y Research UX', corta: 'Analítica y Research', items: ['Pendo', 'Hotjar', 'Microsoft Clarity'] },
    { id: 'gestion', categoria: 'Gestión y Colaboración', corta: 'Gestión', items: ['Microsoft Teams', 'Jira Service Management'] },
    // El CV indica "nivel medio": se muestra con medidor (2 de 3: básico, medio, avanzado).
    { id: 'frontend', categoria: 'Desarrollo y Front-end', corta: 'Front-end', nivel: { texto: 'Nivel medio', valor: 2, total: 3 }, items: ['Visual Studio', 'Storybook', 'GitHub', 'Vercel Apps', 'HTML', 'CSS', 'JavaScript'] },
    { id: 'metodologias', categoria: 'Metodologías', corta: 'Metodologías', items: ['Metodologías ágiles', 'Dinámica de sprints', 'Handoff a desarrollo'] },
  ],

  // Inglés: escala de 7 niveles (Beginner a Proficiency); Upper Intermediate es el quinto.
  idiomas: [
    { idioma: 'Español', corto: 'ES', nivel: 'Nativo' },
    { idioma: 'Inglés', corto: 'EN', nivel: 'Upper Intermediate', medidor: { valor: 5, total: 7 } },
  ],

  // Inicio de la carrera en diseño de producto (Dogma Solutions), para "años diseñando".
  inicioCarrera: '2023-03',
};
