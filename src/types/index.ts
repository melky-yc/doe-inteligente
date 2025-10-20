// Tipos para doadores
export interface Doador {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  tipoDoacao: 'dinheiro' | 'alimentos' | 'roupas' | 'brinquedos' | 'outros';
  valorPreferido?: number;
  frequencia?: 'unica' | 'mensal' | 'trimestral' | 'anual';
  criadoEm?: Date;
}

// Tipos para ONGs
export interface ONG {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  descricao: string;
  causas: string[];
  website?: string;
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  coordenadas?: {
    lat: number;
    lng: number;
  };
  verificada: boolean;
  criadaEm?: Date;
  // Novos campos para perfil expandido
  logoUrl?: string;
  bannerUrl?: string;
  missao?: string;
  visao?: string;
  valores?: string[];
  projetos?: string[];
  transparencia?: {
    relatorioAnual?: string;
    certificacoes?: string[];
  };
}

// Tipos para contato
export interface ContatoForm {
  nome: string;
  email: string;
  mensagem: string;
}

// Tipos para doações
export interface Doacao {
  id?: string;
  doadorId: string;
  ongId: string;
  tipo: 'dinheiro' | 'alimentos' | 'roupas' | 'brinquedos' | 'outros';
  valor?: number;
  descricao?: string;
  status: 'pendente' | 'confirmada' | 'entregue' | 'cancelada';
  dataDoacao: Date;
  dataEntrega?: Date;
}

// Tipos para API responses
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para navegação
export interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

// Tipos para formulários
export interface FormErrors {
  [key: string]: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: FormErrors;
  success: boolean;
}

// Tipos para mapas
export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  description?: string;
  type: 'ong' | 'doador';
}

// Tipos para solicitações de doação
export type Urgencia = 'baixa' | 'media' | 'alta'

export interface ItemSolicitado {
  nome: string
  quantidade: number
  unidade?: string
  // Novos campos para doação parcial
  quantidadeDoada?: number
  doacoes?: DoacaoParcial[]
}

// Novo tipo para doações parciais
export interface DoacaoParcial {
  id: string
  doadorNome: string
  quantidade: number
  dataDoacao: Date
  status: 'reservado' | 'confirmado' | 'entregue'
}

export interface SolicitacaoDoacao {
  id: string
  ongId?: string
  ongNome: string
  titulo: string
  itens: ItemSolicitado[]
  urgencia: Urgencia
  descricao?: string
  criadaEm: Date
  favorita?: boolean
  compartilhavel?: boolean
  // Novos campos para progresso e ordenação
  progresso?: number // 0-100, calculado automaticamente
  dataAtualizacao?: Date
  totalItens?: number
  itensCompletos?: number
}

// Adiciona tipo de Notification centralizado
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Novos tipos para funcionalidades avançadas
export interface FiltrosSolicitacoes {
  busca?: string
  item?: string
  urgencia?: Urgencia | ''
  favoritos?: boolean
  ordenacao?: 'urgencia' | 'data' | 'progresso'
  direcao?: 'asc' | 'desc'
}

export interface PaginacaoConfig {
  pagina: number
  limite: number
  total: number
  temProxima: boolean
}

export interface EstadoFavoritos {
  [solicitacaoId: string]: boolean
}

export interface ConfiguracaoModal {
  aberto: boolean
  solicitacaoId?: string
  tipo?: 'total' | 'parcial'
}

export interface DoacaoFormData {
  doadorNome: string
  email?: string
  telefone?: string
  itens: {
    [itemNome: string]: number
  }
  observacoes?: string
}