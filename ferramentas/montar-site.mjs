/**
 * Monta a pasta que vai para o GitHub Pages, só com os arquivos publicados
 * (os mesmos que o service worker guarda para funcionar sem internet).
 *   node ferramentas/montar-site.mjs _site
 */

import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, listarPublicados, swAtualizado } from './atualizar-sw.mjs';

/**
 * @param {string} destino pasta de saída (é apagada e recriada)
 * @returns {string[]} arquivos copiados
 */
export function montarSite(destino) {
  const alvo = resolve(destino);
  if (alvo === RAIZ || RAIZ.startsWith(alvo)) throw new Error('A pasta de saída não pode ser a raiz do projeto.');
  const { atual, novo } = swAtualizado();
  if (atual !== novo) throw new Error('sw.js desatualizado: rode "node ferramentas/atualizar-sw.mjs" antes de publicar.');
  rmSync(alvo, { recursive: true, force: true });
  const arquivos = listarPublicados();
  for (const arquivo of arquivos) {
    const saida = join(alvo, arquivo);
    mkdirSync(dirname(saida), { recursive: true });
    copyFileSync(join(RAIZ, arquivo), saida);
  }
  return arquivos;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const destino = process.argv[2];
  if (!destino) {
    console.error('Uso: node ferramentas/montar-site.mjs <pasta-de-saída>');
    process.exit(1);
  }
  try {
    const arquivos = montarSite(destino);
    console.log(`Site montado em ${destino} (${arquivos.length} arquivos).`);
  } catch (erro) {
    console.error(/** @type {Error} */ (erro).message);
    process.exit(1);
  }
}
