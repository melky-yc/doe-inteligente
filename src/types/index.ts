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
}

// Adiciona tipo de Notification centralizado
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}