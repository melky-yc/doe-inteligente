// Permite importar arquivos .vue em TypeScript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

// Referências de tipos do Vite
/// <reference types="vite/client" />