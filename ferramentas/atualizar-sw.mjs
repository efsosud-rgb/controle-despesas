/**
 * Atualiza a lista de arquivos e a VERSAO do service worker (sw.js).
 *   node ferramentas/atualizar-sw.mjs             → reescreve o bloco gerado do sw.js
 *   node ferramentas/atualizar-sw.mjs --conferir  → só confere; sai com erro se estiver desatualizado
 *
 * Só vai para o ar (e para o cache sem internet) o que está em PUBLICADOS. Documentação, testes e ferramentas
 * ficam no repositório mas não são publicados.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');

/** Arquivos e pastas que formam o app publicado. */
export const PUBLICADOS = ['index.html', 'manifest.webmanifest', 'sw.js', 'css', 'fontes', 'icones', 'js', 'vendor'];

const IGNORAR = new Set(['.DS_Store', 'Thumbs.db']);
const MARCADORES = /\/\/ <gerado por ferramentas\/atualizar-sw\.mjs: não edite à mão>[\s\S]*?\/\/ <\/gerado>/;

/** @param {string} caminho */
function listarDentro(caminho) {
  if (statSync(caminho).isFile()) return [relative(RAIZ, caminho).split(sep).join('/')];
  const encontrados = [];
  for (const nome of readdirSync(caminho).sort()) {
    if (IGNORAR.has(nome) || nome.startsWith('.')) continue;
    encontrados.push(...listarDentro(join(caminho, nome)));
  }
  return encontrados;
}

/** Todos os arquivos publicados, em caminhos relativos com "/", em ordem. */
export function listarPublicados() {
  const arquivos = [];
  for (const item of PUBLICADOS) {
    const caminho = join(RAIZ, item);
    if (!existsSync(caminho)) throw new Error(`Item publicado não encontrado: ${item}`);
    arquivos.push(...listarDentro(caminho));
  }
  return [...new Set(arquivos)].sort();
}

export function blocoGerado() {
  const publicados = listarPublicados();
  const hash = createHash('sha256');
  for (const arquivo of publicados) {
    let conteudo = readFileSync(join(RAIZ, arquivo));
    /* O próprio sw.js entra na versão sem o bloco gerado (que contém a versão). */
    if (arquivo === 'sw.js') conteudo = Buffer.from(conteudo.toString('utf8').replace(MARCADORES, ''));
    hash.update(arquivo);
    hash.update('\0');
    hash.update(conteudo);
  }
  const versao = hash.digest('hex').slice(0, 12);
  const lista = ['./', ...publicados.filter((a) => a !== 'sw.js').map((a) => `./${a}`)];
  return {
    versao,
    quantidade: lista.length,
    texto: `// <gerado por ferramentas/atualizar-sw.mjs: não edite à mão>\nconst VERSAO = '${versao}';\nconst ARQUIVOS = ${JSON.stringify(lista, null, 2)};\n// </gerado>`,
  };
}

export function swAtualizado() {
  const caminho = join(RAIZ, 'sw.js');
  const atual = readFileSync(caminho, 'utf8');
  if (!MARCADORES.test(atual)) throw new Error('Marcadores do bloco gerado não encontrados no sw.js');
  const bloco = blocoGerado();
  return { caminho, atual, novo: atual.replace(MARCADORES, bloco.texto), bloco };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { caminho, atual, novo, bloco } = swAtualizado();
  if (process.argv.includes('--conferir')) {
    if (novo !== atual) {
      console.error('sw.js desatualizado: rode "node ferramentas/atualizar-sw.mjs".');
      process.exit(1);
    }
    console.log(`sw.js em dia (versão ${bloco.versao}, ${bloco.quantidade} arquivos).`);
  } else {
    writeFileSync(caminho, novo);
    console.log(`sw.js atualizado (versão ${bloco.versao}, ${bloco.quantidade} arquivos).`);
  }
}
