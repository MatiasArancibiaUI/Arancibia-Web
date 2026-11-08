// Servidor estático mínimo para desarrollo local (los módulos ES no cargan desde file://).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 5173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(root)) throw new Error('fuera de la raíz');
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
});

// Si el puerto está ocupado (otro servidor abierto), prueba el siguiente.
let tryPort = port;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && tryPort < port + 10) {
    console.log(`El puerto ${tryPort} está ocupado, pruebo con ${tryPort + 1}…`);
    server.listen(++tryPort);
    return;
  }
  console.error(err.message);
  process.exit(1);
});
server.on('listening', () => console.log(`Portfolio en http://localhost:${tryPort}  (Ctrl+C para cortar)`));
server.listen(tryPort);
