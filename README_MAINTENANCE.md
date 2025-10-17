# 🔧 Manual de Manutenção - Plataforma de Doação Inteligente

Este documento contém todos os procedimentos necessários para manter o projeto funcionando corretamente em produção e desenvolvimento.

## 📋 Índice

- [Dependências Críticas](#dependências-críticas)
- [Tarefas Periódicas](#tarefas-periódicas)
- [Configurações de Ambiente](#configurações-de-ambiente)
- [Monitoramento](#monitoramento)
- [Backup e Recuperação](#backup-e-recuperação)
- [Problemas Conhecidos](#problemas-conhecidos)
- [Procedimentos de Emergência](#procedimentos-de-emergência)

## 🎯 Dependências Críticas

### Runtime Dependencies (Produção)

#### Frontend Core
```json
{
  "react": "^18.2.0",           // ⚠️ CRÍTICO - Framework principal
  "react-dom": "^18.2.0",      // ⚠️ CRÍTICO - Renderização DOM
  "vue": "^3.4.21",             // ⚠️ CRÍTICO - Componente de mapa
  "react-router-dom": "^6.22.3" // ⚠️ CRÍTICO - Roteamento SPA
}
```

#### State Management
```json
{
  "zustand": "^4.5.2",         // ⚠️ CRÍTICO - Estado global
}
```

#### Backend Core
```json
{
  "express": "^4.18.2",        // ⚠️ CRÍTICO - Servidor web
  "helmet": "^7.2.0",          // ⚠️ CRÍTICO - Segurança HTTP
  "compression": "^1.8.1",     // 🔶 IMPORTANTE - Performance
  "cors": "^2.8.5"             // 🔶 IMPORTANTE - CORS policy
}
```

#### Build Tools
```json
{
  "vite": "^5.2.0",            // ⚠️ CRÍTICO - Build e dev server
  "typescript": "^5.4.2",      // ⚠️ CRÍTICO - Tipagem
  "@vitejs/plugin-react": "^4.2.1", // ⚠️ CRÍTICO - Plugin React
  "@vitejs/plugin-vue": "^5.0.4"    // ⚠️ CRÍTICO - Plugin Vue
}
```

### Versões Mínimas Suportadas
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **TypeScript**: >= 5.0.0

## 📅 Tarefas Periódicas

### Diárias
- [ ] Verificar logs de erro no console do servidor
- [ ] Monitorar uso de memória e CPU
- [ ] Verificar status dos serviços (frontend/backend)

### Semanais
```bash
# Atualizar dependências de segurança
npm audit
npm audit fix

# Verificar vulnerabilidades
npm audit --audit-level moderate

# Limpar cache do npm
npm cache clean --force
```

### Mensais
```bash
# Verificar atualizações de dependências
npm outdated

# Atualizar dependências menores (patch/minor)
npm update

# Verificar tamanho do bundle
npm run build
du -sh dist/
```

### Trimestrais
- [ ] Revisar e atualizar dependências principais (major versions)
- [ ] Executar testes de performance completos
- [ ] Revisar configurações de segurança
- [ ] Backup completo do projeto

## ⚙️ Configurações de Ambiente

### Variáveis de Ambiente

#### Desenvolvimento (.env.development)
```env
NODE_ENV=development
PORT=3030
VITE_API_URL=http://localhost:3030/api
VITE_APP_NAME="Plataforma de Doação Inteligente"
```

#### Produção (.env.production)
```env
NODE_ENV=production
PORT=3030
VITE_API_URL=/api
VITE_APP_NAME="Plataforma de Doação Inteligente"
```

### Configurações do Servidor

#### Nginx (Produção)
```nginx
server {
    listen 80;
    server_name doeinteligente.org;
    
    # Servir arquivos estáticos
    location / {
        root /var/www/doe-inteligente/dist/client;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para API
    location /api {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### PM2 (Process Manager)
```json
{
  "name": "doe-inteligente",
  "script": "dist/server/index.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3030
  },
  "log_file": "/var/log/doe-inteligente/combined.log",
  "out_file": "/var/log/doe-inteligente/out.log",
  "error_file": "/var/log/doe-inteligente/error.log",
  "max_memory_restart": "1G"
}
```

## 📊 Monitoramento

### Métricas Importantes
- **Tempo de resposta da API**: < 500ms
- **Uso de memória**: < 512MB por processo
- **CPU**: < 70% em média
- **Uptime**: > 99.5%

### Logs Críticos
```bash
# Logs do servidor
tail -f /var/log/doe-inteligente/error.log

# Logs do sistema
journalctl -u doe-inteligente -f

# Monitorar processos
pm2 monit
```

### Alertas Configurados
- Erro 500 > 5 ocorrências/minuto
- Uso de memória > 80%
- Tempo de resposta > 2 segundos
- Servidor offline > 1 minuto

## 💾 Backup e Recuperação

### Backup Automático
```bash
#!/bin/bash
# Script de backup diário
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/doe-inteligente"

# Backup do código
tar -czf "$BACKUP_DIR/code_$DATE.tar.gz" /var/www/doe-inteligente

# Backup dos logs
tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" /var/log/doe-inteligente

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Procedimento de Recuperação
1. Parar serviços: `pm2 stop doe-inteligente`
2. Restaurar código: `tar -xzf backup.tar.gz`
3. Instalar dependências: `npm ci`
4. Build: `npm run build`
5. Iniciar serviços: `pm2 start doe-inteligente`

## ⚠️ Problemas Conhecidos

### 1. Erro de Memória em Builds Grandes
**Sintoma**: `JavaScript heap out of memory` durante build
**Solução Temporária**:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```
**Solução Permanente**: Otimizar imports e lazy loading

### 2. Conflito React + Vue em Desenvolvimento
**Sintoma**: Hot reload não funciona para componentes Vue
**Solução**: Reiniciar servidor de desenvolvimento
```bash
npm run dev
```

### 3. CORS em Produção
**Sintoma**: Erro CORS em requests da API
**Verificação**:
```bash
# Verificar configuração CORS
curl -H "Origin: https://doeinteligente.org" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.doeinteligente.org/api/contato
```

### 4. Performance em Mobile
**Sintoma**: Carregamento lento em dispositivos móveis
**Monitoramento**:
```bash
# Verificar tamanho do bundle
npm run build
ls -la dist/client/assets/
```

## 🚨 Procedimentos de Emergência

### Servidor Offline
1. **Verificar status**: `pm2 status`
2. **Verificar logs**: `pm2 logs doe-inteligente --lines 50`
3. **Reiniciar**: `pm2 restart doe-inteligente`
4. **Se persistir**: `pm2 delete doe-inteligente && pm2 start ecosystem.config.js`

### Alto Uso de CPU/Memória
1. **Identificar processo**: `pm2 monit`
2. **Verificar logs**: `pm2 logs --lines 100`
3. **Reiniciar gradual**: `pm2 reload doe-inteligente`
4. **Escalar**: `pm2 scale doe-inteligente +2`

### Erro 500 Massivo
1. **Parar tráfego**: Configurar página de manutenção no Nginx
2. **Verificar logs**: `tail -f /var/log/doe-inteligente/error.log`
3. **Rollback**: Restaurar versão anterior
4. **Comunicar**: Notificar usuários via redes sociais

### Build Falhou
1. **Limpar cache**: `npm cache clean --force`
2. **Reinstalar**: `rm -rf node_modules && npm ci`
3. **Build local**: `npm run build`
4. **Deploy manual**: Copiar dist/ para servidor

## 📞 Contatos de Emergência

- **DevOps**: devops@doeinteligente.org
- **Suporte**: suporte@doeinteligente.org
- **Telefone Emergência**: (+55 86) 99999-9999

## 📚 Recursos Adicionais

- [Documentação Vite](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Express.js Guide](https://expressjs.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/)

---

**Última atualização**: $(date)  
**Responsável**: Equipe de DevOps  
**Versão**: 2.0.0