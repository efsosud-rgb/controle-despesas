# Controle de Despesas

App de controle de despesas pessoais que se instala na tela inicial do celular (PWA).

**Abrir e instalar:** https://efsosud-rgb.github.io/controle-despesas/

- Despesas únicas, futuras e recorrentes (semanal, mensal, anual ou parcelada), com fim por quantidade de vezes ou por data.
- Recebíveis (renda) de uma ou mais pessoas da família, cada um no nome de quem recebe.
- Marca o que foi pago ou recebido, mostra o que está atrasado e o saldo previsto do mês.
- Sem login nesta versão: os dados ficam só no aparelho. Backup e restauração por arquivo em Família › Ajustes.
- Funciona sem internet depois da primeira visita.
- Logo 3D interativa (Three.js) na tela de boas-vindas e em Ajustes.

## Como instalar no celular

- **Android (Chrome):** abra o link, toque em **Instalar** (ou no menu ⋮ › **Instalar app**).
- **iPhone (Safari):** abra o link, toque em **Compartilhar** › **Adicionar à Tela de Início**.

## Desenvolvimento

Não há etapa de build: os arquivos do repositório são o app. Precisa do Node 22 ou mais novo.

```bash
npm test          # testes
npm run servir    # abre o app em http://localhost:8080/
npm run sw        # depois de mudar qualquer arquivo publicado
```

Cada envio para a branch `main` roda os testes no GitHub Actions e, se passarem, publica no GitHub Pages
(`.github/workflows/publicar.yml`). Pull requests só rodam os testes.
As regras para quem mexe no código (pessoas e IAs) estão em [AGENTS.md](AGENTS.md).

## Estrutura

| Pasta/arquivo | O que tem |
|---|---|
| `index.html`, `manifest.webmanifest`, `sw.js` | Página, dados de instalação e o service worker (uso sem internet) |
| `js/datas.js`, `js/dinheiro.js` | Datas `AAAA-MM-DD` sem fuso e dinheiro em centavos inteiros |
| `js/recorrencia.js` | Regras de repetição e as ocorrências que cada lançamento gera |
| `js/resumo.js` | Totais do mês, pendências e renda por pessoa |
| `js/dados.js`, `js/loja.js` | Leitura, conferência e gravação dos dados; backup |
| `js/acoes.js` | Todas as mudanças nos dados (funções puras) e a validação do formulário |
| `js/app.js`, `js/telas.js`, `js/folhas.js`, `js/ui.js`, `js/boas-vindas.js`, `js/instalacao-ui.js`, `js/instalar.js` | Interface (Preact + htm) e instalação |
| `js/logo3d.js` | Cena 3D da logo |
| `vendor/` | Bibliotecas de terceiros com versão fixa (licenças em `vendor/LICENCAS.txt`) |
| `fontes/`, `icones/`, `css/` | Fontes Inter e Space Grotesk (licença OFL), ícones do app e estilos |
| `testes/` | Testes automáticos (`node --test`) |
| `ferramentas/` | Atualização do service worker, montagem do site e servidor local |

## Formato dos dados

Guardados na chave `controle-despesas:v1` do localStorage do navegador. Cada lançamento guarda a regra
(valor, primeira data e repetição); as ocorrências são calculadas na hora. O que muda numa ocorrência só fica no
lançamento pelo número da ocorrência: `baixas` (pagas/recebidas), `ajustes` (valor diferente só naquela vez),
`excluidas` e `corte` ("esta e as próximas" apagadas).

## Histórico

O app começou na pasta `despesas/` do repositório [efsosud-rgb.github.io](https://github.com/efsosud-rgb/efsosud-rgb.github.io)
e veio para cá com o histórico. O endereço antigo, https://efsosud-rgb.github.io/despesas/, leva para o novo.
