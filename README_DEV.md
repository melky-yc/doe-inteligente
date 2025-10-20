# Documentação de Desenvolvimento

Este documento descreve como configurar, executar e evoluir o projeto com segurança e consistência.

## Visão Geral
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS v4.
- Backend: Node.js + Express + TypeScript (compilado em `dist/server`).
- Estado: Zustand.
- Qualidade: ESLint + TypeScript `strict`.

## Setup
- Requisitos: Node 18+ e npm.
- Instalação: `npm install`.
- Ambiente: `PORT=3030` (opcional). O Vite faz proxy de `/api` para `http://localhost:PORT`.

## Scripts
- `npm run dev`: inicia frontend e backend (concurrently).
- `npm run dev:frontend`: inicia Vite (`http://localhost:5173`, usa porta alternativa se ocupada).
- `npm run dev:backend`: inicia backend com TSX watch.
- `npm run build`: compila cliente e servidor.
- `npm run build:frontend`: `tsc` + `vite build` para `dist/client`.
- `npm run build:backend`: `tsc --project tsconfig.server.json` para `dist/server`.
- `npm run preview`: serve `dist/client`.
- `npm run type-check`: verificação de tipos sem emissão.
- `npm run lint`: ESLint com regras de Typescript e hooks.

## Estrutura
- `src/components`: componentes reutilizáveis.
- `src/pages`: páginas SPA (inclui `Solicitacoes.tsx`).
- `src/stores`: Zustand stores (ex.: `appStore`, `favoritosStore`).
- `src/types`: tipos compartilhados (frontend e backend).
- `src/server`: servidor Express.

## Padrões de Código
- TypeScript `strict` no frontend e backend.
- Sem `any`: use tipos explícitos e genéricos.
- Evite código morto e imports não usados.
- Componentes: funções puras, propriedades tipadas, estado mínimo.
- Estilos: Tailwind utilitário + CSS modular em `src/styles`.

## Fluxos Principais
- Solicitações de Doação (`src/pages/Solicitacoes.tsx`):
  - Favoritos persistentes via `useFavoritosStore()`.
  - Filtros: busca, item, urgência, favoritos.
  - Ordenação: `urgencia | data | progresso` com direção `asc | desc`.
  - Progresso por solicitação e por item.
  - Ações: `Doar tudo` (confirmação) e `Doar parcial` (modal granular).
- Modal de Doação Parcial (`src/components/ModalDoacaoParcial.tsx`):
  - Formulário com nome, email, telefone (validação), seleção de itens e quantidades.
  - Respeita quantidade restante e previne entradas inválidas.
  - `ESC` fecha, `useEffect` limpa ao fechar.

## Integrações
- Compartilhamento: usa `navigator.share` ou clipboard.
- Notificações: `useAppStore().addNotification` para feedback de ações.
- API: rotas em `src/server/index.ts`. No futuro, integrar `confirmarDoacaoParcial` e `confirmarDoacaoTotal` com endpoints.

## Qualidade e CI Local
- `npm run type-check` após alterações significativas.
- `npm run lint` para garantir estilo e regras.
- `npm run build` antes de merges para validar produção.

## Debug
- Frontend: HMR Vite. Verifique console e rede.
- Backend: TSX watch com logs. Em erro de porta, ajuste `PORT` ou pare processos anteriores.

## Atualizações Recentes (v2.0.0)
- Correções de tipos: remoção de `any`, genéricos em `updateFiltro`, comparação de datas com `getTime()`.
- Remoção de variáveis não usadas e parâmetros redundantes.
- Modal de doação parcial: criação e integração completa.
- Botão favorito duplicado removido; mantido no cabeçalho do card.
- Ajustes de build: `tsconfig.server.json` com `rootDir: ./src`, inclusão de `src/types`, e `noUnusedParameters: false` para compilar Express sem ruído.

## Próximos Passos
- Perfis detalhados de ONGs com fotos, verificação, redes sociais.
- Paginação e lazy loading para listas grandes.
- Integração real de doações com backend e persistência.
- Testes unitários e E2E.