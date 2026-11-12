# Regras para quem mexe neste repositório

Valem para pessoas e para IAs (Claude Code, Codex, Jules).

## O projeto

Controle de Despesas: app instalável (PWA) de despesas, recebíveis e renda da família.
Sem login nesta versão: os dados ficam só no aparelho (localStorage), com backup por arquivo.
Publicado em https://efsosud-rgb.github.io/controle-despesas/ pelo GitHub Actions a cada envio para a branch `main`.

## Regras

1. Tudo em português do Brasil: textos da tela, comentários e mensagens de commit.
2. Sem etapa de build e sem dependência nova. Módulos ES puros; Preact + htm e Three.js ficam copiados em `vendor/` com versão fixa. Biblioteca nova só com aprovação do Eric.
3. Depois de mudar qualquer arquivo publicado (`index.html`, `manifest.webmanifest`, `sw.js`, `css/`, `fontes/`, `icones/`, `js/`, `vendor/`), rode `node ferramentas/atualizar-sw.mjs`. Sem isso, quem já instalou continua com a versão antiga, e os testes falham.
4. `npm test` precisa passar antes de qualquer commit (Node 22 ou mais novo). O GitHub Actions roda os mesmos testes e só publica se eles passarem.
5. Nunca inventar dados: valores e totais vêm só do que a pessoa lançou. Sem dado, a tela mostra "—" e o motivo.
6. Dinheiro em centavos inteiros; datas como texto `AAAA-MM-DD`, sem hora e sem fuso. As regras ficam em `js/datas.js`, `js/dinheiro.js` e `js/recorrencia.js`, todas com testes.
7. Mudar o formato dos dados (chave `controle-despesas:v1`) exige migrar o que já está guardado e continuar lendo os backups antigos (campo `formato` do arquivo).
8. Acessibilidade: alvo de toque com pelo menos 44 px, todo campo com rótulo, contraste de pelo menos 4,5:1 e respeito a "reduzir movimento".
9. Nenhuma requisição para fora do próprio site (sem analytics, CDN ou rastreador): o app precisa abrir sem internet.
10. Não afirmar que algo funciona sem ter testado. Diga o que foi verificado e o que não foi.

## Comandos

| Comando | O que faz |
|---|---|
| `npm test` | Roda os testes |
| `npm run sw` | Atualiza a lista e a versão do service worker |
| `npm run servir` | Abre o app em http://localhost:8080/ |
| `npm run site` | Monta em `_site/` só o que vai para o ar |
