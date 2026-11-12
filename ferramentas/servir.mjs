/**
 * Servidor local para testar o app no navegador, sem instalar nada.
 *   node ferramentas/servir.mjs          → http://localhost:8080/
 *   node ferramentas/servir.mjs 3000     → http://localhost:3000/
 * Serve só os arquivos publicados, como no GitHub Pages.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { RAIZ, listarPublicados } from './atualizar-sw.mjs';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const porta = Number(process.argv[2]) || 8080;

createServer(async (pedido, resposta) => {
  const caminho = decodeURIComponent(new URL(pedido.url || '/', 'http://local').pathname).replace(/^\/+/, '') || 'index.html';
  const publicados = new Set(listarPublicados());
  const arquivo = caminho.endsWith('/') ? `${caminho}index.html` : caminho;
  if (!publicados.has(arquivo)) {
    resposta.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    resposta.end('Não encontrado');
    return;
  }
  try {
    const conteudo = await readFile(join(RAIZ, arquivo));
    resposta.writeHead(200, { 'content-type': TIPOS[extname(arquivo)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    resposta.end(conteudo);
  } catch (erro) {
    resposta.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    resposta.end('Erro ao ler o arquivo');
  }
}).listen(porta, () => {
  console.log(`Controle de Despesas em http://localhost:${porta}/ (Ctrl+C para parar)`);
});
