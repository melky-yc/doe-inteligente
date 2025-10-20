# Plataforma de Doação Inteligente

Conecta doadores e ONGs de Teresina com transparência e praticidade. O projeto está estruturado em React + TypeScript (frontend) e Express + TypeScript (backend), com foco em qualidade, acessibilidade e uma experiência moderna.

## Funcionalidades
- Favoritos persistentes por solicitação.
- Filtros: busca, item, urgência e favoritos.
- Ordenação: `urgencia | data | progresso` com direção `asc | desc`.
- Barras de progresso por solicitação e por item (cores dinâmicas conforme avanço).
- Modal de doação parcial com seleção granular de itens, validação em tempo real e prevenção de quantidades inválidas.
- UI responsiva, acessível, com notificações e tema claro/escuro.

## Rotas
- `/` Home
- `/mapa` Mapa interativo de ONGs (React)
- `/cadastro` Formulários de cadastro de doador e ONG
- `/contato` Contato e suporte
- `/solicitacoes` Lista de solicitações com favoritos, filtros e doações

## Requisitos
- Node.js 18+
- npm

## Instalação e Desenvolvimento
```bash
npm install
npm run dev             # Frontend + Backend
# ou
npm run dev:frontend    # Vite (porta 5173, tenta 5174/5175 se ocupada)
npm run dev:backend     # Express (porta 3030)
```

## Build e Preview
```bash
npm run build           # dist/client + dist/server
npm run preview         # serve dist/client
npm start               # roda dist/server
```

## Scripts úteis
- `npm run type-check` — verificação de tipos sem emissão.
- `npm run lint` — linting com regras de TS e React Hooks.
- `npm run build:frontend` — `tsc` + `vite build`.
- `npm run build:backend` — `tsc --project tsconfig.server.json`.

## Troubleshooting
- Erro `EADDRINUSE` (porta 3030 em uso):
  - Verifique processos: `Get-NetTCPConnection -LocalPort 3030 | Format-Table LocalAddress,LocalPort,State,OwningProcess`
  - Finalize pelo PID: `Stop-Process -Id <PID> -Force`
  - Use outra porta temporária: `$env:PORT = 3031; npm run dev:backend`

## Documentação
- Guia de desenvolvimento: `README_DEV.md`
- Manual de manutenção: `README_MAINTENANCE.md`

## Atualizações recentes
- Correções de tipos e lint: remoção de `any`, genéricos em `updateFiltro`, comparação de datas com `getTime()`.
- Ajustes de build do backend: `rootDir` para `./src`, inclusão de `src/types`, e `noUnusedParameters=false`.
- Modal de doação parcial criado e integrado.
- UI refinada: favoritos persistentes, filtros/ordenação, barras de progresso, botões de doação separados.

## Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS v4, Zustand, React Router.
- Backend: Node.js, Express, Helmet, CORS, Compression.

---
Plataforma de Doação Inteligente — contribuindo com um impacto real na comunidade.