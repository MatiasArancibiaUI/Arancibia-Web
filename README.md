# Portfolio de Matías Arancibia

Webapp estática de una sola página. HTML, CSS y JavaScript con módulos ES, sin build ni dependencias.

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173. No sirve abrir `index.html` con doble clic, porque los módulos ES necesitan un servidor.

## Contenido

- `data/profile.js`: datos del CV.
- `data/projects.js`: proyectos. Para sumar uno, agregá un objeto.
- `data/personal.js`: textos de la vista Proceso (pasos, estudios y tarjetas personales pendientes). Con `?dev` en la URL se ven las tarjetas pendientes.

Las convenciones completas están en `CLAUDE.md`.

## Deploy

Vercel, sirviendo la raíz tal cual, sin comando de build.
