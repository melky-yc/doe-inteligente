import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const app = express();
const PORT = process.env.PORT || 3030;
// Middleware de segurança e performance
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Middleware para logs
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Cache controle para assets
app.use((req, res, next) => {
    if (req.path.startsWith('/assets') || req.path.includes('.')) {
        res.set('Cache-Control', 'public, max-age=31536000'); // 1 ano
    }
    else {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
    next();
});
// Servir arquivos estáticos (apenas em produção)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(projectRoot, 'dist/client')));
}
// Validação de email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
};
// Validação de CNPJ (básica)
const isValidCNPJ = (cnpj) => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
};
// API Routes
app.post('/api/contato', (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;
        if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
            return res.status(400).json({
                ok: false,
                error: 'Nome deve ter pelo menos 2 caracteres'
            });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                ok: false,
                error: 'E-mail inválido'
            });
        }
        if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length < 10) {
            return res.status(400).json({
                ok: false,
                error: 'Mensagem deve ter pelo menos 10 caracteres'
            });
        }
        // Simular processamento
        console.log('[Contato]', { nome: nome.trim(), email: email.trim(), mensagem: mensagem.trim() });
        res.json({
            ok: true,
            message: 'Mensagem enviada com sucesso! Retornaremos em breve.'
        });
    }
    catch (error) {
        console.error('Erro no endpoint de contato:', error);
        res.status(500).json({
            ok: false,
            error: 'Erro interno do servidor'
        });
    }
});
app.post('/api/doador', (req, res) => {
    try {
        const { nome, email, telefone, tipoDoacao } = req.body;
        if (!nome || nome.trim().length < 3) {
            return res.status(400).json({
                ok: false,
                error: 'Nome deve ter pelo menos 3 caracteres'
            });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                ok: false,
                error: 'E-mail inválido'
            });
        }
        if (!tipoDoacao) {
            return res.status(400).json({
                ok: false,
                error: 'Tipo de doação é obrigatório'
            });
        }
        // Simular salvamento
        const novoDoador = {
            id: Date.now().toString(),
            nome: nome.trim(),
            email: email.trim(),
            telefone: telefone?.trim(),
            tipoDoacao,
            criadoEm: new Date(),
        };
        console.log('[Doador Cadastrado]', novoDoador);
        res.json({
            ok: true,
            data: novoDoador,
            message: 'Doador cadastrado com sucesso!'
        });
    }
    catch (error) {
        console.error('Erro no cadastro de doador:', error);
        res.status(500).json({
            ok: false,
            error: 'Erro interno do servidor'
        });
    }
});
app.post('/api/ong', (req, res) => {
    try {
        const { nome, email, telefone, cnpj, descricao, causas } = req.body;
        if (!nome || nome.trim().length < 3) {
            return res.status(400).json({
                ok: false,
                error: 'Nome da ONG deve ter pelo menos 3 caracteres'
            });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                ok: false,
                error: 'E-mail inválido'
            });
        }
        if (!cnpj || !isValidCNPJ(cnpj)) {
            return res.status(400).json({
                ok: false,
                error: 'CNPJ inválido'
            });
        }
        if (!telefone || telefone.trim().length < 10) {
            return res.status(400).json({
                ok: false,
                error: 'Telefone inválido'
            });
        }
        // Simular salvamento
        const novaONG = {
            id: Date.now().toString(),
            nome: nome.trim(),
            email: email.trim(),
            telefone: telefone.trim(),
            cnpj: cnpj.trim(),
            descricao: descricao?.trim() || '',
            causas: causas || [],
            endereco: '',
            verificada: false,
            criadaEm: new Date(),
        };
        console.log('[ONG Cadastrada]', novaONG);
        res.json({
            ok: true,
            data: novaONG,
            message: 'ONG cadastrada com sucesso! Aguarde a verificação.'
        });
    }
    catch (error) {
        console.error('Erro no cadastro de ONG:', error);
        res.status(500).json({
            ok: false,
            error: 'Erro interno do servidor'
        });
    }
});
// Endpoint para listar ONGs (para o mapa)
app.get('/api/ongs', (req, res) => {
    try {
        // Dados fictícios para demonstração
        const ongs = [
            {
                id: '1',
                nome: 'Casa da Esperança',
                email: 'contato@casaesperanca.org',
                telefone: '(86) 3215-4567',
                endereco: 'Rua das Flores, 123 - Centro, Teresina - PI',
                cnpj: '12.345.678/0001-90',
                descricao: 'Cuidamos de crianças em situação de vulnerabilidade social.',
                causas: ['crianças', 'educação'],
                coordenadas: { lat: -5.0892, lng: -42.8019 },
                verificada: true,
                criadaEm: new Date('2020-01-15'),
            },
            {
                id: '2',
                nome: 'Lar dos Idosos São José',
                email: 'contato@larsaojose.org',
                telefone: '(86) 3234-5678',
                endereco: 'Av. Frei Serafim, 456 - Centro, Teresina - PI',
                cnpj: '98.765.432/0001-10',
                descricao: 'Acolhimento e cuidado para idosos em situação de abandono.',
                causas: ['idosos', 'saúde'],
                coordenadas: { lat: -5.0950, lng: -42.7900 },
                verificada: true,
                criadaEm: new Date('2018-03-20'),
            },
            {
                id: '3',
                nome: 'Projeto Alimentar',
                email: 'contato@projetoalimentar.org',
                telefone: '(86) 3245-6789',
                endereco: 'Rua Coelho Rodrigues, 789 - Fátima, Teresina - PI',
                cnpj: '11.222.333/0001-44',
                descricao: 'Distribuição de alimentos para famílias carentes.',
                causas: ['fome', 'família'],
                coordenadas: { lat: -5.1000, lng: -42.7800 },
                verificada: true,
                criadaEm: new Date('2019-07-10'),
            },
        ];
        res.json({
            ok: true,
            data: ongs
        });
    }
    catch (error) {
        console.error('Erro ao listar ONGs:', error);
        res.status(500).json({
            ok: false,
            error: 'Erro interno do servidor'
        });
    }
});
// Fallback para SPA (Single Page Application)
app.get('*', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(projectRoot, 'dist/client/index.html'));
    }
    else {
        res.sendFile(path.join(projectRoot, 'index.html'));
    }
});
// Error handler
app.use((error, req, res, _next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({
        ok: false,
        error: 'Erro interno do servidor'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Frontend: http://localhost:5173`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
});
