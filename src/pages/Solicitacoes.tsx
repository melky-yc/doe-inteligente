import React, { useMemo, useState } from 'react'
import { SolicitacaoDoacao, Urgencia, FiltrosSolicitacoes, DoacaoFormData } from '@/types'
import { useAppStore } from '@/stores/appStore'
import { useFavoritosStore } from '@/stores/favoritosStore'
import ModalDoacaoParcial from '@/components/ModalDoacaoParcial'

const mockSolicitacoes: SolicitacaoDoacao[] = [
  {
    id: 's1',
    ongNome: 'Projeto Alimentar',
    titulo: 'Doação de Cestas Básicas',
    itens: [
      { nome: 'Arroz', quantidade: 50, unidade: 'kg', quantidadeDoada: 20 },
      { nome: 'Feijão', quantidade: 40, unidade: 'kg', quantidadeDoada: 15 },
      { nome: 'Óleo', quantidade: 20, unidade: 'L', quantidadeDoada: 0 },
    ],
    urgencia: 'alta',
    descricao: 'Apoio a 30 famílias em situação de vulnerabilidade no bairro XYZ.',
    criadaEm: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-01-20'),
    compartilhavel: true,
    progresso: 35,
  },
  {
    id: 's2',
    ongNome: 'Lar dos Idosos São José',
    titulo: 'Higiene e Cuidados',
    itens: [
      { nome: 'Fraldas geriátricas', quantidade: 100, unidade: 'un', quantidadeDoada: 80 },
      { nome: 'Sabonete', quantidade: 50, unidade: 'un', quantidadeDoada: 50 },
    ],
    urgencia: 'media',
    descricao: 'Itens de higiene pessoal para nossos residentes.',
    criadaEm: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-18'),
    compartilhavel: true,
    progresso: 87,
  },
  {
    id: 's3',
    ongNome: 'Casa da Esperança',
    titulo: 'Material Escolar',
    itens: [
      { nome: 'Cadernos', quantidade: 80, unidade: 'un', quantidadeDoada: 0 },
      { nome: 'Lápis', quantidade: 200, unidade: 'un', quantidadeDoada: 0 },
      { nome: 'Borrachas', quantidade: 120, unidade: 'un', quantidadeDoada: 0 },
    ],
    urgencia: 'baixa',
    descricao: 'Ajuda para crianças atendidas pelo projeto de reforço escolar.',
    criadaEm: new Date('2024-01-05'),
    dataAtualizacao: new Date('2024-01-05'),
    compartilhavel: true,
    progresso: 0,
  },
]

const urgenciaLabel: Record<Urgencia, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

const urgencyBadgeClass: Record<Urgencia, string> = {
  baixa: 'bg-green-100 text-green-700 ring-1 ring-green-200',
  media: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
  alta: 'bg-red-100 text-red-700 ring-1 ring-red-200',
}

const Solicitações: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosSolicitacoes>({
    busca: '',
    item: '',
    urgencia: '',
    favoritos: false,
    ordenacao: 'urgencia',
    direcao: 'desc'
  })
  const [modalSolicitacaoId, setModalSolicitacaoId] = useState<string | null>(null)
  const [modalDoacaoParcial, setModalDoacaoParcial] = useState(false)
  const { addNotification } = useAppStore()
  const { toggleFavorito, isFavorito } = useFavoritosStore()

  const todasTagsItens = useMemo(() => {
    const itens = mockSolicitacoes.flatMap(s => s.itens.map(i => i.nome.toLowerCase()))
    return Array.from(new Set(itens)).sort()
  }, [])

  const solicitacoesFiltradas = useMemo(() => {
    let resultado = [...mockSolicitacoes]

    // Filtro por busca
    if (filtros.busca?.trim()) {
      const termo = filtros.busca.toLowerCase().trim()
      resultado = resultado.filter(s =>
        s.titulo.toLowerCase().includes(termo) ||
        s.ongNome.toLowerCase().includes(termo) ||
        s.itens.some(i => i.nome.toLowerCase().includes(termo))
      )
    }

    // Filtro por item específico
    if (filtros.item) {
      const item = filtros.item.toLowerCase()
      resultado = resultado.filter(s => s.itens.some(i => i.nome.toLowerCase() === item))
    }

    // Filtro por urgência
    if (filtros.urgencia) {
      resultado = resultado.filter(s => s.urgencia === filtros.urgencia)
    }

    // Filtro por favoritos
    if (filtros.favoritos) {
      resultado = resultado.filter(s => isFavorito(s.id))
    }

    // Ordenação
    resultado.sort((a, b) => {
      let valorA: number = 0
      let valorB: number = 0
      
      switch (filtros.ordenacao) {
        case 'urgencia': {
          const urgenciaOrdem: Record<Urgencia, number> = { baixa: 1, media: 2, alta: 3 }
          valorA = urgenciaOrdem[a.urgencia]
          valorB = urgenciaOrdem[b.urgencia]
          break
        }
        case 'data': {
          const dataA = (a.dataAtualizacao || a.criadaEm).getTime()
          const dataB = (b.dataAtualizacao || b.criadaEm).getTime()
          valorA = dataA
          valorB = dataB
          break
        }
        case 'progresso': {
          valorA = a.progresso ?? 0
          valorB = b.progresso ?? 0
          break
        }
        default:
          return 0
      }

      const multiplicador = filtros.direcao === 'asc' ? 1 : -1
      return (valorA - valorB) * multiplicador
    })

    return resultado
  }, [filtros, isFavorito])

  const handleToggleFavorito = (id: string) => {
    toggleFavorito(id)
    addNotification({
      type: 'success',
      title: isFavorito(id) ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      message: 'Suas preferências foram salvas.',
    })
  }

  const updateFiltro = <K extends keyof FiltrosSolicitacoes>(campo: K, valor: FiltrosSolicitacoes[K]) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const abrirModalDoacao = (solicitacaoId: string, tipo: 'total' | 'parcial') => {
    setModalSolicitacaoId(solicitacaoId)
    if (tipo === 'parcial') {
      setModalDoacaoParcial(true)
    }
  }

  const fecharModais = () => {
    setModalSolicitacaoId(null)
    setModalDoacaoParcial(false)
  }

  const confirmarDoacaoTotal = () => {
    addNotification({ 
      type: 'success', 
      title: 'Doação total confirmada', 
      message: 'A ONG será notificada sobre sua doação.' 
    })
    fecharModais()
  }

  const confirmarDoacaoParcial = (dados: DoacaoFormData) => {
    // Aqui seria feita a integração com API
    console.log('Doação parcial:', dados)
    
    const totalItens = Object.values(dados.itens).reduce((sum, q) => sum + q, 0)
    addNotification({ 
      type: 'success', 
      title: 'Doação parcial confirmada', 
      message: `${totalItens} item${totalItens !== 1 ? 's' : ''} reservado${totalItens !== 1 ? 's' : ''} com sucesso!` 
    })
    fecharModais()
  }

  const compartilhar = async (sol: SolicitacaoDoacao) => {
    const shareText = `${sol.titulo} — ${sol.ongNome}`
    const shareUrl = `${window.location.origin}/solicitacoes#${sol.id}`

    try {
      if (navigator.share) {
        await navigator.share({ title: sol.titulo, text: shareText, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(`${shareText} — ${shareUrl}`)
      }
      addNotification({ type: 'success', title: 'Link compartilhado!', message: 'O link foi compartilhado/copiado com sucesso.' })
    } catch {
      addNotification({ type: 'error', title: 'Falha ao compartilhar' })
    }
  }

  return (
    <div className="solicitacoes-page">
      {/* Hero */}
      <section className="hero-section section-sm">
        <div className="container">
          <div className="hero-content text-center">
            <div className="hero-visual" role="img" aria-label="Banner de solicitações">
              <i className="fa-solid fa-hands-helping"></i>
            </div>
            <h1>Solicitações de Doação</h1>
            <p>Descubra como você pode ajudar — doe itens específicos ou contribua parcialmente.</p>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="section">
        <div className="container">
          {/* Filtros e Ordenação */}
          <div className="mb-6 space-y-4">
            {/* Linha 1: Busca e Filtros Rápidos */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label htmlFor="busca" className="mb-2 block text-sm font-medium text-gray-800">Buscar</label>
                <input
                  id="busca"
                  type="text"
                  value={filtros.busca}
                  onChange={(e) => updateFiltro('busca', e.target.value)}
                  placeholder="ONG, título ou item..."
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label htmlFor="item" className="mb-2 block text-sm font-medium text-gray-800">Item</label>
                <select
                  id="item"
                  value={filtros.item}
                  onChange={(e) => updateFiltro('item', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">Todos</option>
                  {todasTagsItens.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="urgencia" className="mb-2 block text-sm font-medium text-gray-800">Urgência</label>
                <select
                  id="urgencia"
                  value={filtros.urgencia}
                  onChange={(e) => updateFiltro('urgencia', e.target.value as Urgencia | '')}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">Todas</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            {/* Linha 2: Ordenação e Filtros Especiais */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="ordenacao" className="text-sm font-medium text-gray-700">Ordenar por:</label>
                  <select
                    id="ordenacao"
                    value={filtros.ordenacao}
                    onChange={(e) => updateFiltro('ordenacao', e.target.value as FiltrosSolicitacoes['ordenacao'])}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                  >
                    <option value="urgencia">Urgência</option>
                    <option value="data">Data</option>
                    <option value="progresso">Progresso</option>
                  </select>
                </div>

                <button
                  onClick={() => updateFiltro('direcao', filtros.direcao === 'asc' ? 'desc' : 'asc')}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  title={`Ordenação ${filtros.direcao === 'asc' ? 'crescente' : 'decrescente'}`}
                >
                  <i className={`fa-solid ${filtros.direcao === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                  {filtros.direcao === 'asc' ? 'Crescente' : 'Decrescente'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateFiltro('favoritos', !filtros.favoritos)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                    filtros.favoritos 
                      ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300' 
                      : 'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <i className="fa-solid fa-star"></i>
                  {filtros.favoritos ? 'Mostrando favoritos' : 'Mostrar favoritos'}
                </button>

                <div className="text-sm text-gray-600">
                  {solicitacoesFiltradas.length} solicitação{solicitacoesFiltradas.length !== 1 ? 'ões' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Lista */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {solicitacoesFiltradas.map((s) => (
              <article key={s.id} aria-labelledby={`sol-title-${s.id}`} className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg">
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 id={`sol-title-${s.id}`} className="text-lg font-semibold text-gray-900">
                        {s.titulo}
                      </h3>
                      <p className="text-sm text-gray-600">{s.ongNome}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFavorito(s.id)}
                        className={`inline-flex items-center gap-1 rounded-lg p-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                          isFavorito(s.id) 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={isFavorito(s.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${urgencyBadgeClass[s.urgencia]}`}>
                        <i className="fa-solid fa-bolt"></i>
                        {urgenciaLabel[s.urgencia]}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  {typeof s.progresso === 'number' && (
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Progresso da doação</span>
                        <span className="text-gray-600">{s.progresso}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            s.progresso >= 80 ? 'bg-green-500' : 
                            s.progresso >= 40 ? 'bg-yellow-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${Math.min(s.progresso, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                              {/* Itens */}
                  <div className="mb-4 rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-200">
                    <h4 className="mb-3 text-sm font-semibold text-gray-800">Itens necessários</h4>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {s.itens.map((i, idx) => (
                        <li key={idx} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-gray-200">
                          <span className="text-gray-800">{i.nome}</span>
                          <div className="flex items-center gap-2 text-xs">
                            {i.quantidadeDoada && i.quantidadeDoada > 0 ? (
                              <>
                                <span className="text-green-600 font-medium">{i.quantidadeDoada}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-600">{i.quantidade} {i.unidade || ''}</span>
                              </>
                            ) : (
                              <span className="text-gray-600">{i.quantidade} {i.unidade || ''}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                              {s.descricao && (
                                <p className="mb-4 text-sm text-gray-700">{s.descricao}</p>
                              )}

                  {/* Ações */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirModalDoacao(s.id, 'total')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        <i className="fa-solid fa-hand-holding-heart"></i>
                        Doar tudo
                      </button>
                      
                      <button
                        onClick={() => abrirModalDoacao(s.id, 'parcial')}
                        className="inline-flex items-center gap-2 rounded-lg bg-white border border-primary-600 text-primary-600 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        <i className="fa-solid fa-list-check"></i>
                        Doar parcial
                      </button>
                    </div>

                    <button
                      onClick={() => compartilhar(s)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <i className="fa-solid fa-share"></i>
                      Compartilhar
                    </button>
                  </div>
                </div>

                {/* Modal de doação total */}
                {modalSolicitacaoId === s.id && !modalDoacaoParcial && (
                  <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm">
                    <div className="absolute inset-x-4 top-8 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
                      <h4 className="mb-3 text-base font-semibold text-gray-900">Confirmar doação total</h4>
                      <p className="mb-4 text-sm text-gray-600">
                        Você está prestes a doar todos os itens desta solicitação. A ONG será notificada imediatamente.
                      </p>
                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          onClick={fecharModais}
                        >
                          Cancelar
                        </button>
                        <button
                          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                          onClick={confirmarDoacaoTotal}
                        >
                          Confirmar doação
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
                        ))}
                      </div>

                      {/* Estado vazio */}
                      {solicitacoesFiltradas.length === 0 && (
                        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-gray-200">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-primary-600">
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhuma solicitação encontrada</h3>
                          <p className="text-gray-600">Tente ajustar os filtros ou buscar por outro termo.</p>
                        </div>
                      )}
        </div>
      </section>

      {/* Modal de Doação Parcial */}
      <ModalDoacaoParcial
        solicitacao={mockSolicitacoes.find(s => s.id === modalSolicitacaoId) || null}
        aberto={modalDoacaoParcial}
        onFechar={fecharModais}
        onConfirmar={confirmarDoacaoParcial}
      />
    </div>
  )
}

export default Solicitações