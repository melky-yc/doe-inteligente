# 👨‍💻 Guia do Desenvolvedor - Plataforma de Doação Inteligente

Este documento fornece uma visão técnica completa do projeto para desenvolvedores que irão contribuir ou manter o código.

## 📋 Índice

- [Arquitetura Geral](#arquitetura-geral)
- [Fluxo de Execução](#fluxo-de-execução)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Convenções de Código](#convenções-de-código)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Guia de Contribuição](#guia-de-contribuição)
- [Dependências de Desenvolvimento](#dependências-de-desenvolvimento)
- [Debugging e Testes](#debugging-e-testes)

## 🏗️ Arquitetura Geral

### Visão Macro
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Build Tools   │
│   (React)       │◄──►│   (Express)     │    │   (Vite)        │
│   Port: 5173    │    │   Port: 3030    │    │   TypeScript    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Stack Tecnológica

#### Frontend
- **React 18**: Framework principal para UI e roteamento
- **TypeScript**: Tipagem estática em todo o frontend
- **Tailwind CSS v4**: Estilização utilitária com diretiva `@config` no CSS
- **Zustand**: Gerenciamento de estado global React
- **React Router**: Roteamento SPA

#### Backend
- **Express.js**: Servidor web com TypeScript
- **Node.js**: Runtime JavaScript
- **Helmet**: Middleware de segurança
- **CORS**: Cross-Origin Resource Sharing
- **Compression**: Compressão de resposta

#### Build & Development
- **Vite**: Build tool e dev server com HMR
- **ESLint**: Linting para TypeScript e React
- **Concurrently**: Execução paralela de scripts

### Mapa Interativo (React)

O projeto utiliza um componente `MapaReact` com filtros e listagem de ONGs. Exemplo simplificado:

```tsx
import MapaReact from '@/components/MapaReact'

export default function MapaPage() {
  return <MapaReact />
}
```

## 🔄 Fluxo de Execução

### 1. Inicialização da Aplicação

```mermaid
graph TD
    A[npm run dev] --> B[Concurrently]
    B --> C[Vite Dev Server :5173]
    B --> D[Express Server :3030]
    C --> E[React App Mount]
    E --> F[Router Setup]
    F --> G[Zustand Store Init]
    G --> H[Component Render]
    H --> I[Map Component (React)]
```

### 2. Fluxo de Requisições

```
User Action → React Component → API Call → Express Route → Response → State Update → UI Update
```

### 3. Ciclo de Desenvolvimento

```bash
# 1. Desenvolvimento
npm run dev          # Inicia dev servers
# Hot reload automático para React

# 2. Build
npm run build        # Compila TypeScript + Vite build
# Gera: dist/client (frontend) + dist/server (backend)

# 3. Produção
npm start           # Executa servidor compilado
```

## 📁 Estrutura de Diretórios

```
src/
├── components/              # Componentes React reutilizáveis
│   ├── Header.tsx          # Navegação principal
│   ├── Footer.tsx          # Rodapé com links
│   ├── MapaReact.tsx       # Componente React para mapa
│   └── NotificationSystem.tsx # Sistema de notificações
├── pages/                  # Páginas da aplicação (React)
│   ├── Home.tsx           # Página inicial
│   ├── Cadastro.tsx       # Formulários de cadastro
│   ├── Mapa.tsx           # Container do mapa Vue
│   └── Contato.tsx        # Formulário de contato
├── stores/                # Gerenciamento de estado
│   └── appStore.ts        # Store Zustand global
├── styles/                # Estilos globais
│   └── global.css         # CSS com variáveis e utilitários
├── types/                 # Definições TypeScript
│   └── index.ts           # Interfaces e tipos
├── server/                # Backend Express
│   └── index.ts           # Servidor principal
├── main.tsx               # Entry point React
└── App.tsx                # Componente raiz
```

### Convenções de Nomenclatura

- **Componentes React**: PascalCase (`Header.tsx`)

- **Páginas**: PascalCase (`Home.tsx`)
- **Stores**: camelCase (`appStore.ts`)
- **Types**: PascalCase para interfaces (`interface User`)
- **Funções**: camelCase (`handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 📝 Convenções de Código

### TypeScript

#### Interfaces e Types
```typescript
// ✅ Bom - Interface para objetos
interface User {
  id: string
  name: string
  email: string
}

// ✅ Bom - Type para unions
type Status = 'pending' | 'completed' | 'error'

// ✅ Bom - Generic types
interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  error?: string
}
```

#### Componentes React
```typescript
// ✅ Bom - Props tipadas
interface ButtonProps {
  variant: 'primary' | 'secondary'
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  onClick, 
  children, 
  disabled = false 
}) => {
  return (
    <button 
      className={`btn ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

#### Hooks Customizados
```typescript
// ✅ Bom - Hook tipado
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Implementation...
  
  return { data, loading, error }
}
```

### CSS/Styling

#### Variáveis CSS
```css
/* ✅ Bom - Variáveis organizadas */
:root {
  /* Colors */
  --primary: #0066cc;
  --primary-dark: #0052a3;
  
  /* Spacing */
  --space-sm: 0.5rem;
  --space-md: 1rem;
  
  /* Typography */
  --font-size-lg: 1.125rem;
}
```

#### Classes Utilitárias
```css
/* ✅ Bom - Classes reutilizáveis */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  /* ... */
}

.btn.primary {
  background-color: var(--primary);
  color: white;
}
```

### Gerenciamento de Estado

#### Zustand Store
```typescript
// ✅ Bom - Store tipado e organizado
interface AppState {
  theme: 'light' | 'dark'
  notifications: Notification[]
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      notifications: [],
      
      setTheme: (theme) => set({ theme }),
      
      addNotification: (notification) => {
        const id = Date.now().toString()
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }]
        }))
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
```

## 🎯 Padrões de Desenvolvimento

### 1. Componentes Funcionais
- Sempre usar React.FC para componentes
- Props tipadas com interfaces
- Hooks no topo do componente
- Early returns para condições

### 2. Gerenciamento de Estado
- Estado local: useState para UI state
- Estado global: Zustand para dados compartilhados
- Estado do servidor: React Query (futuro)

### 3. Tratamento de Erros
```typescript
// ✅ Bom - Error boundaries e try/catch
const handleSubmit = async (data: FormData) => {
  try {
    setLoading(true)
    const response = await api.post('/endpoint', data)
    
    if (response.ok) {
      addNotification({ type: 'success', title: 'Sucesso!' })
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    addNotification({ 
      type: 'error', 
      title: 'Erro', 
      message: error.message 
    })
  } finally {
    setLoading(false)
  }
}
```

### 4. Performance
- Lazy loading para rotas
- Memoização com useMemo/useCallback
- Otimização de re-renders
- Code splitting

## 🤝 Guia de Contribuição

### Workflow de Desenvolvimento

1. **Fork e Clone**
```bash
git clone https://github.com/seu-usuario/doe-inteligente.git
cd doe-inteligente
npm install
```

2. **Branch Strategy**
```bash
# Feature branch
git checkout -b feature/nova-funcionalidade

# Bugfix branch
git checkout -b fix/correcao-bug

# Hotfix branch
git checkout -b hotfix/correcao-urgente
```

3. **Desenvolvimento**
```bash
# Iniciar desenvolvimento
npm run dev

# Verificar tipos
npm run type-check

# Linting
npm run lint

# Build local
npm run build
```

4. **Commit Convention**
```bash
# Formato: tipo(escopo): descrição
git commit -m "feat(cadastro): adicionar validação de CNPJ"
git commit -m "fix(mapa): corrigir filtro de ONGs"
git commit -m "docs(readme): atualizar instruções de instalação"
```

### Code Review Checklist

- [ ] Código segue convenções estabelecidas
- [ ] Tipos TypeScript corretos
- [ ] Componentes testáveis e reutilizáveis
- [ ] Performance otimizada
- [ ] Acessibilidade implementada
- [ ] Responsividade verificada
- [ ] Documentação atualizada

### Pull Request Template

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código testado localmente
- [ ] Tipos TypeScript corretos
- [ ] Linting passou
- [ ] Build funciona
- [ ] Documentação atualizada
```

## 🛠️ Dependências de Desenvolvimento

### Core Development
```json
{
  "typescript": "^5.4.2",           // Compilador TypeScript
  "vite": "^5.2.0",                 // Build tool
  "concurrently": "^8.2.2",        // Scripts paralelos
  "tsx": "^4.7.1"                  // TypeScript executor
}
```

### Linting e Formatação
```json
{
  "eslint": "^8.57.0",              // Linter JavaScript/TypeScript
  "@typescript-eslint/eslint-plugin": "^7.2.0",
  "@typescript-eslint/parser": "^7.2.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.6",
  "eslint-plugin-vue": "^9.22.0"
}
```

### Build Plugins
```json
{
  "@vitejs/plugin-react": "^4.2.1", // Plugin React para Vite
  "@vitejs/plugin-vue": "^5.0.4"    // Plugin Vue para Vite
}
```

### Tipos TypeScript
```json
{
  "@types/node": "^20.11.30",       // Tipos Node.js
  "@types/react": "^18.2.66",       // Tipos React
  "@types/react-dom": "^18.2.22",   // Tipos React DOM
  "@types/express": "^4.17.21",     // Tipos Express
  "@types/compression": "^1.7.5",   // Tipos Compression
  "@types/cors": "^2.8.17"          // Tipos CORS
}
```

## 🐛 Debugging e Testes

### Debug no VSCode

#### launch.json
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["--mode", "development"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/tsx",
      "args": ["watch", "src/server/index.ts"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Debugging Tips

#### Frontend
```typescript
// ✅ Bom - Debug com React DevTools
const MyComponent = () => {
  const state = useAppStore()
  
  // Debug state changes
  useEffect(() => {
    console.log('State changed:', state)
  }, [state])
  
  return <div>...</div>
}
```

#### Backend
```typescript
// ✅ Bom - Structured logging
app.post('/api/endpoint', (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/endpoint`, {
    body: req.body,
    headers: req.headers
  })
  
  // Implementation...
})
```

### Ferramentas de Debug

- **React DevTools**: Extensão do navegador
- **Vue DevTools**: Para componente Vue
- **Network Tab**: Monitorar requisições API
- **Console**: Logs estruturados
- **Vite HMR**: Hot Module Replacement

## 📚 Recursos e Referências

### Documentação Oficial
- [React Documentation](https://react.dev/)
- [Vue.js Guide](https://vuejs.org/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js Guide](https://expressjs.com/en/guide/)

### Ferramentas Recomendadas
- **VSCode**: Editor principal
- **React DevTools**: Debug React
- **Vue DevTools**: Debug Vue
- **Postman**: Testar APIs
- **Chrome DevTools**: Debug frontend

### Extensões VSCode
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Vetur (Vue)
- ESLint
- Prettier
- Auto Rename Tag

## 🛠️ Dev Servers e EADDRINUSE

### Risco de múltiplas instâncias de `npm run dev`
- `npm run dev` usa `concurrently` para iniciar frontend (Vite) e backend (Express) simultaneamente.
- Executar o mesmo comando em mais de um terminal ao mesmo tempo causa colisão de portas e erros `EADDRINUSE`.
- Mantenha apenas UMA instância de `npm run dev` ativa.

### Como evitar `EADDRINUSE`
- Finalize processos corretamente com `Ctrl + C` e aguarde ambos os serviços encerrarem.
- Verifique portas ocupadas:
  - PowerShell: `Get-NetTCPConnection -LocalPort 3030,5173 | Format-Table LocalAddress,LocalPort,State,OwningProcess`
  - Alternativa: `netstat -ano | findstr :3030` e `netstat -ano | findstr :5173`
- Finalize processo pelo PID quando necessário:
  - PowerShell: `Stop-Process -Id <PID> -Force`

### Portas e comportamento padrão
- Frontend (Vite): tenta `5173` e, se ocupada, usa automaticamente a próxima disponível (`5174`, `5175`, ...). O terminal informa a URL.
- Backend (Express): usa `PORT` do ambiente ou `3030` por padrão. Se `3030` estiver em uso, defina outra porta via variável de ambiente.

### Ajustando a porta do backend (Windows PowerShell)
- Temporário (sessão atual): `$env:PORT = 3031; npm run dev:backend`
- Permanente: `setx PORT 3031` (reinicie o terminal) e execute `npm run dev:backend`.

### Procedimentos recomendados para desenvolvimento local
- Preferir `npm run dev` em um único terminal para HMR completo (React + Vue + API).
- Se usar terminais separados:
  - Frontend: `npm run dev:frontend` (pode ajustar porta com `vite --port <porta>`).
  - Backend: `npm run dev:backend` (defina `$env:PORT=<porta>` para evitar colisões).
- Após trocar de branch ou atualizar dependências, reinicie os dev servers para limpar estados antigos.
- Confira sempre o terminal para confirmar URLs de preview e mensagens de porta.

---

**Última atualização**: $(date)  
**Responsável**: Equipe de Desenvolvimento  
**Versão**: 2.0.0