# Changelog

Todas as alterações significativas neste projeto serão documentadas aqui.

## 2.0.1 - Manutenção e Correções (2025-10-16)

- Removido `useEffect` com timers duplicados em `NotificationSystem.tsx`; timers agora são gerenciados apenas pela store (Zustand).
- Atualizados ícones Font Awesome para versão 6:
  - `fa-times` → `fa-xmark`
  - `fa-exclamation-triangle` → `fa-triangle-exclamation`
  - `fa-check-circle` → `fa-circle-check` (MapaVue.vue)
- Backend (Express):
  - Ajustado import ESM para `../types` sem extensão, evitando inconsistências de resolução.
  - Removida a referência estática a `/assets` em desenvolvimento, pois o diretório foi eliminado.
  - Atualizado handler de erro para prefixar parâmetro não utilizado (`_next`) conforme ESLint.
- TypeScript:
  - Adicionado `src/types/vue-shims.d.ts` para permitir imports de componentes `.vue` no TypeScript.
  - Removido import `React` não utilizado em `src/App.tsx` (JSX runtime moderno).
  - Ajustados tipos no shim Vue para evitar `{}` e `any` (uso de `Record<string, never>` e `unknown`).
  - Atualizado `ApiResponse<T>` para usar `unknown` como tipo padrão.
- Configuração:
  - Removido alias `@/utils` de `tsconfig.json` e `vite.config.ts`, pois o diretório não existe.
  - Corrigida configuração do ESLint para `plugin:@typescript-eslint/recommended`.
  - Adicionadas dependências de lint para Vue: `eslint-plugin-vue` e `vue-eslint-parser`.
  - Atualizado script `lint` para incluir arquivos `.vue`.
- Documentação:
  - Removidas menções à `Pinia` em `README_DEV.md` e `README_MAINTENANCE.md`.

### Verificação

- `npm run type-check` executado com sucesso (sem erros).
- `npm run lint` executado com sucesso (sem erros). Observação: aviso do parser sobre TypeScript 5.9.
- Dev servers funcionais: frontend disponível (porta dinâmica, ex.: `5174`) e backend `http://localhost:3030/api`.