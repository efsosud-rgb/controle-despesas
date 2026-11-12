import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { montarSite } from '../ferramentas/montar-site.mjs';
import { blocoGerado } from '../ferramentas/atualizar-sw.mjs';

test('o site publicado tem só os arquivos do app, e tudo o que o service worker guarda existe nele', () => {
  const pasta = mkdtempSync(join(tmpdir(), 'controle-despesas-site-'));
  try {
    const arquivos = montarSite(join(pasta, 'site'));
    const site = join(pasta, 'site');
    for (const essencial of ['index.html', 'sw.js', 'manifest.webmanifest', 'js/app.js', 'css/app.css', 'icones/icone-512.png']) {
      assert.ok(arquivos.includes(essencial), `faltou ${essencial}`);
    }
    for (const fora of ['README.md', 'AGENTS.md', 'CLAUDE.md', 'package.json', 'testes', 'ferramentas', '.github']) {
      assert.ok(!existsSync(join(site, fora)), `${fora} não deveria ser publicado`);
    }
    const { texto } = blocoGerado();
    const lista = JSON.parse(texto.slice(texto.indexOf('['), texto.lastIndexOf(']') + 1));
    for (const item of lista.filter((a) => a !== './')) {
      assert.ok(existsSync(join(site, item)), `o service worker guarda ${item}, mas ele não está no site`);
    }
    const html = readFileSync(join(site, 'index.html'), 'utf8');
    const locais = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map((m) => m[1]);
    assert.ok(locais.length >= 5);
    for (const ref of locais) assert.ok(existsSync(join(site, ref)), `index.html aponta para ${ref}, que não está no site`);
    const manifesto = JSON.parse(readFileSync(join(site, 'manifest.webmanifest'), 'utf8'));
    for (const icone of manifesto.icons) assert.ok(existsSync(join(site, icone.src)), `ícone ${icone.src} faltando`);
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
});
