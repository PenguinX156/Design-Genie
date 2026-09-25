import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (!(/^\/(baseline|treatment)(\/|$)/.test(path) || path === '/app.js') || path.includes('..')) { response.writeHead(404); response.end('Not found'); return; }
  const file = join(root, path.slice(1).endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1));
  try { const body = readFileSync(file); response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }); response.end(body); }
  catch { response.writeHead(404); response.end('Not found'); }
});
server.listen(4173, '127.0.0.1', () => console.log('Campaign Lab at http://127.0.0.1:4173/baseline/ and /treatment/'));
