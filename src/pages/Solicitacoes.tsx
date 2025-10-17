import React, { useMemo, useState } from 'react'
import { SolicitacaoDoacao, Urgencia } from '@/types'
import { useAppStore } from '@/stores/appStore'

const mockSolicitacoes: SolicitacaoDoacao[] = [
  {
    id: 's1',
    ongNome: 'Projeto Alimentar',
    titulo: 'Doação de Cestas Básicas',
    itens: [
      { nome: 'Arroz', quantidade: 50, unidade: 'kg' },
      { nome: 'Feijão', quantidade: 40, unidade: 'kg' },
      { nome: 'Óleo', quantidade: 20, unidade: 'L' },
    ],
    urgencia: 'alta',
    descricao: 'Apoio a 30 famílias em situação de vulnerabilidade no bairro XYZ.',
    criadaEm: new Date(),
    compartilhavel: true,
  },
  {
    id: 's2',
    ongNome: 'Lar dos Idosos São José',
    titulo: 'Higiene e Cuidados',
    itens: [
      { nome: 'Fraldas geriátricas', quantidade: 100, unidade: 'un' },
      { nome: 'Sabonete', quantidade: 50, unidade: 'un' },
    ],
    urgencia: 'media',
    descricao: 'Itens de higiene pessoal para nossos residentes.',
    criadaEm: new Date(),
    compartilhavel: true,
  },
  {
    id: 's3',
    ongNome: 'Casa da Esperança',
    titulo: 'Material Escolar',
    itens: [
      { nome: 'Cadernos', quantidade: 80, unidade: 'un' },
      { nome: 'Lápis', quantidade: 200, unidade: 'un' },
      { nome: 'Borrachas', quantidade: 120, unidade: 'un' },
    ],
    urgencia: 'baixa',
    descricao: 'Ajuda para crianças atendidas pelo projeto de reforço escolar.',
    criadaEm: new Date(),
    compartilhavel: true,
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
  const [busca, setBusca] = useState('')
  const [filtroItem, setFiltroItem] = useState('')
  const [filtroUrgencia, setFiltroUrgencia] = useState<Urgencia | ''>('')
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({})
  const [modalSolicitacaoId, setModalSolicitacaoId] = useState<string | null>(null)
  const { addNotification } = useAppStore()

  const todasTagsItens = useMemo(() => {
    const itens = mockSolicitacoes.flatMap(s => s.itens.map(i => i.nome.toLowerCase()))
    return Array.from(new Set(itens)).sort()
  }, [])

  const solicitacoesFiltradas = useMemo(() => {
    let resultado = [...mockSolicitacoes]

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim()
      resultado = resultado.filter(s =>
        s.titulo.toLowerCase().includes(termo) ||
        s.ongNome.toLowerCase().includes(termo) ||
        s.itens.some(i => i.nome.toLowerCase().includes(termo))
      )
    }

    if (filtroItem) {
      const item = filtroItem.toLowerCase()
      resultado = resultado.filter(s => s.itens.some(i => i.nome.toLowerCase() === item))
    }

    if (filtroUrgencia) {
      resultado = resultado.filter(s => s.urgencia === filtroUrgencia)
    }

    return resultado
  }, [busca, filtroItem, filtroUrgencia])

  const toggleFavorito = (id: string) => {
    setFavoritos(prev => ({ ...prev, [id]: !prev[id] }))
    addNotification({
      type: 'success',
      title: favoritos[id] ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      message: 'Você pode filtrar por favoritos em breve.',
    })
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
          {/* Filtros com Tailwind */}
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
            <label htmlFor="busca" className="mb-2 block text-sm font-medium text-gray-800">Buscar</label>
            <input
              id="busca"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="ONG, título ou item..."
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>

            <div>
              <label htmlFor="item" className="mb-2 block text-sm font-medium text-gray-800">Item</label>
              <select
                id="item"
                value={filtroItem}
                onChange={(e) => setFiltroItem(e.target.value)}
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
                value={filtroUrgencia}
                onChange={(e) => setFiltroUrgencia(e.target.value as Urgencia | '')}
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                <option value="">Todas</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          {/* Lista */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {solicitacoesFiltradas.map((s) => (
              <article key={s.id} aria-labelledby={`sol-title-${s.id}`} className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg">
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <h3 id={`sol-title-${s.id}`} className="text-lg font-semibold text-gray-900">
                                    {s.titulo}
                                  </h3>
                                  <p className="text-sm text-gray-600">{s.ongNome}</p>
                                </div>
                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${urgencyBadgeClass[s.urgencia]}`}>
                                  <i className="fa-solid fa-bolt"></i>
                                  {urgenciaLabel[s.urgencia]}
                                </span>
                              </div>

                              {/* Itens */}
                              <div className="mb-4 rounded-xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-200">
                                <h4 className="mb-3 text-sm font-semibold text-gray-800">Itens necessários</h4>
                                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {s.itens.map((i, idx) => (
                                    <li key={idx} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-gray-200">
                                      <span className="text-gray-800">{i.nome}</span>
                                      <span className="text-gray-600">{i.quantidade} {i.unidade || ''}</span>
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
                                    onClick={() => setModalSolicitacaoId(s.id)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                  >
                                    <i className="fa-solid fa-hand-holding-heart"></i>
                                    Ajudar (total ou parcial)
                                  </button>
                                  <button
                                    onClick={() => toggleFavorito(s.id)}
                                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 ${favoritos[s.id] ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300' : 'bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50'}`}
                                    aria-pressed={!!favoritos[s.id]}
                                  >
                                    <i className="fa-solid fa-star"></i>
                                    {favoritos[s.id] ? 'Favorito' : 'Favoritar'}
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

                            {/* Modal simples */}
                            {modalSolicitacaoId === s.id && (
                              <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm">
                                <div className="absolute inset-x-4 top-8 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
                                  <h4 className="mb-3 text-base font-semibold text-gray-900">Como você deseja ajudar?</h4>
                                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                      className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                      onClick={() => {
                                        addNotification({ type: 'success', title: 'Doação total escolhida', message: 'A ONG será notificada.' })
                                        setModalSolicitacaoId(null)
                                      }}
                                    >
                                      Doar todos os itens
                                    </button>
                                    <button
                                      className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                      onClick={() => {
                                        addNotification({ type: 'info', title: 'Doação parcial', message: 'Selecione os itens que deseja doar.' })
                                        setModalSolicitacaoId(null)
                                      }}
                                    >
                                      Doar parcialmente
                                    </button>
                                  </div>
                                  <div className="flex justify-end">
                                    <button
                                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50"
                                      onClick={() => setModalSolicitacaoId(null)}
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                      Fechar
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
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhuma solicitação encontrada</h3>
                          <p className="text-gray-600">Tente ajustar os filtros ou buscar por outro termo.</p>
                        </div>
                      )}
        </div>
      </section>
    </div>
  )
}

export default Solicitações