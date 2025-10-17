# Plataforma de Doação Inteligente

Uma plataforma moderna que conecta doadores e ONGs em Teresina, facilitando doações inteligentes e transparentes para causas sociais.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal para UI
- **Vue 3** - Componente de mapa interativo
- **TypeScript** - Tipagem estática
- **React Router** - Roteamento SPA
- **Zustand** - Gerenciamento de estado
- **Vite** - Build tool e dev server

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem no backend
- **Helmet** - Segurança HTTP
- **Compression** - Compressão de resposta
- **CORS** - Cross-Origin Resource Sharing

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Concurrently** - Execução paralela de scripts
- **TSX** - Execução TypeScript
- **Vite** - Hot Module Replacement

## 📁 Estrutura do Projeto

```
Doe_Inteligente/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── Header.tsx       # Cabeçalho com navegação
│   │   ├── Footer.tsx       # Rodapé
│   │   ├── MapaVue.vue      # Componente Vue para mapa
│   │   └── NotificationSystem.tsx # Sistema de notificações
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.tsx         # Página inicial
│   │   ├── Cadastro.tsx     # Formulários de cadastro
│   │   ├── Mapa.tsx         # Página do mapa
│   │   └── Contato.tsx      # Formulário de contato
│   ├── stores/              # Gerenciamento de estado
│   │   └── appStore.ts      # Store principal (Zustand)
│   ├── styles/              # Estilos globais
│   │   └── global.css       # CSS global com variáveis
│   ├── types/               # Definições TypeScript
│   │   └── index.ts         # Tipos da aplicação
│   ├── server/              # Backend Express
│   │   └── index.ts         # Servidor principal
│   ├── main.tsx             # Ponto de entrada React
│   └── App.tsx              # Componente raiz
├── dist/                    # Build de produção
├── public/                  # Arquivos estáticos
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Config TypeScript (frontend)
├── tsconfig.server.json     # Config TypeScript (backend)
├── package.json             # Dependências e scripts
└── README.md                # Documentação
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd Doe_Inteligente

# Instale as dependências
npm install
```

### Desenvolvimento
```bash
# Inicia frontend (Vite) e backend (Express) simultaneamente
npm run dev

# Ou execute separadamente:
npm run dev:frontend  # Frontend na porta 5173
npm run dev:backend   # Backend na porta 3030
```

### Produção
```bash
# Build completo
npm run build

# Inicia servidor de produção
npm start
```

### Outros Scripts
```bash
# Verificação de tipos
npm run type-check

# Linting
npm run lint

# Preview do build
npm run preview
```

## 🌟 Funcionalidades

### ✅ Implementadas
- **Página Inicial**: Hero section, features, preview do mapa
- **Sistema de Cadastro**: Formulários para doadores e ONGs
- **Mapa Interativo**: Visualização de ONGs com filtros (Vue.js)
- **Contato**: Formulário funcional com validação
- **Navegação**: SPA com React Router
- **Tema**: Suporte a modo claro/escuro
- **Notificações**: Sistema de feedback visual
- **Responsivo**: Design adaptável para mobile
- **Acessibilidade**: ARIA labels, navegação por teclado
- **API REST**: Endpoints para cadastro e contato
- **Validação**: Frontend e backend com TypeScript

### 🔄 Integração React + Vue
O projeto demonstra uma integração única entre React e Vue:
- **React**: Gerencia a aplicação principal, roteamento e estado
- **Vue**: Componente especializado para o mapa interativo
- **Comunicação**: Via props e eventos entre os frameworks
- **Build**: Vite configurado para suportar ambos

## 🎨 Design System

### Cores
- **Primary**: #0066cc (Azul principal)
- **Success**: #10b981 (Verde)
- **Error**: #ef4444 (Vermelho)
- **Warning**: #f59e0b (Amarelo)

### Tipografia
- **Fonte**: Poppins (Google Fonts)
- **Pesos**: 400, 500, 600, 700

### Componentes
- **Botões**: Primary, Secondary, Outline, Danger
- **Cards**: Elevação e hover effects
- **Forms**: Validação visual e estados
- **Grid**: Sistema responsivo

## 🔧 Configuração

### Variáveis de Ambiente
```env
PORT=3030                    # Porta do backend
NODE_ENV=production          # Ambiente
```

### Proxy de Desenvolvimento
O Vite está configurado para fazer proxy das requisições `/api/*` para o backend Express na porta 3030.

## 📱 Responsividade

- **Desktop**: Layout completo com sidebar
- **Tablet**: Grid adaptável
- **Mobile**: Menu hambúrguer, layout vertical

## 🔒 Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para desenvolvimento
- **Validação**: Sanitização de inputs
- **CSP**: Content Security Policy configurado

## 🚀 Performance

- **Code Splitting**: Roteamento lazy
- **Tree Shaking**: Vite otimização
- **Compression**: Gzip no servidor
- **Cache**: Headers apropriados
- **Bundle Analysis**: Vite bundle analyzer

## 🧪 Testes

### Estrutura de Testes (Planejado)
```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Monitoramento

### Métricas Implementadas
- **Logs**: Console estruturado
- **Errors**: Tratamento centralizado
- **Performance**: Vite dev tools

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvimento**: Plataforma de Doação Inteligente
- **Design**: Sistema moderno e acessível
- **Backend**: API REST com TypeScript

## 📞 Suporte

- **Email**: contato@doeinteligente.org
- **WhatsApp**: (+55 86) 99999-9999
- **Instagram**: @doeinteligente

---

**Plataforma de Doação Inteligente** - Conectando doadores e ONGs para um mundo melhor! 💙