import React, { useState, useEffect } from 'react'
import type { SolicitacaoDoacao, DoacaoFormData } from '@/types'

interface ModalDoacaoParcialProps {
  solicitacao: SolicitacaoDoacao | null
  aberto: boolean
  onFechar: () => void
  onConfirmar: (dados: DoacaoFormData) => void
}

const ModalDoacaoParcial: React.FC<ModalDoacaoParcialProps> = ({
  solicitacao,
  aberto,
  onFechar,
  onConfirmar
}) => {
  const [formData, setFormData] = useState<DoacaoFormData>({
    doadorNome: '',
    email: '',
    telefone: '',
    itens: {},
    observacoes: ''
  })

  const [erros, setErros] = useState<Record<string, string>>({})

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (aberto && solicitacao) {
      setFormData({
        doadorNome: '',
        email: '',
        telefone: '',
        itens: {},
        observacoes: ''
      })
      setErros({})
    }
  }, [aberto, solicitacao])

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto) {
        onFechar()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [aberto, onFechar])

  const updateQuantidade = (itemNome: string, quantidade: number) => {
    setFormData(prev => ({
      ...prev,
      itens: {
        ...prev.itens,
        [itemNome]: quantidade
      }
    }))
    
    // Limpar erro do item se quantidade válida
    if (quantidade > 0 && erros[itemNome]) {
      setErros(prev => {
        const novosErros = { ...prev }
        delete novosErros[itemNome]
        return novosErros
      })
    }
  }

  const validarForm = (): boolean => {
    const novosErros: Record<string, string> = {}

    if (!formData.doadorNome.trim()) {
      novosErros.doadorNome = 'Nome é obrigatório'
    }

    const itensComQuantidade = Object.values(formData.itens).filter(q => q > 0)
    if (itensComQuantidade.length === 0) {
      novosErros.itens = 'Selecione pelo menos um item para doar'
    }

    // Validar quantidades individuais
    Object.entries(formData.itens).forEach(([itemNome, quantidade]) => {
      if (quantidade > 0) {
        const item = solicitacao?.itens.find(i => i.nome === itemNome)
        if (item) {
          const quantidadeRestante = item.quantidade - (item.quantidadeDoada || 0)
          if (quantidade > quantidadeRestante) {
            novosErros[itemNome] = `Máximo disponível: ${quantidadeRestante}`
          }
        }
      }
    })

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validarForm()) {
      onConfirmar(formData)
    }
  }

  const totalItens = Object.values(formData.itens).reduce((sum, q) => sum + q, 0)

  if (!aberto || !solicitacao) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div 
        className="relative mx-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            Doação Parcial - {solicitacao.titulo}
          </h2>
          <button
            onClick={onFechar}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
            aria-label="Fechar modal"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações do Doador */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Suas informações</h3>
            
            <div>
              <label htmlFor="doadorNome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo *
              </label>
              <input
                id="doadorNome"
                type="text"
                value={formData.doadorNome}
                onChange={(e) => setFormData(prev => ({ ...prev, doadorNome: e.target.value }))}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                  erros.doadorNome ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Seu nome completo"
              />
              {erros.doadorNome && (
                <p className="mt-1 text-sm text-red-600">{erros.doadorNome}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Seleção de Itens */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Selecione os itens</h3>
              {totalItens > 0 && (
                <span className="text-sm text-primary-600 font-medium">
                  {totalItens} item{totalItens !== 1 ? 's' : ''} selecionado{totalItens !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {erros.itens && (
              <p className="text-sm text-red-600">{erros.itens}</p>
            )}

            <div className="space-y-3">
              {solicitacao.itens.map((item) => {
                const quantidadeRestante = item.quantidade - (item.quantidadeDoada || 0)
                const quantidadeSelecionada = formData.itens[item.nome] || 0
                
                return (
                  <div 
                    key={item.nome} 
                    className={`rounded-lg border p-4 transition ${
                      quantidadeRestante === 0 ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.nome}</h4>
                        <p className="text-sm text-gray-600">
                          {quantidadeRestante > 0 ? (
                            <>Disponível: {quantidadeRestante} {item.unidade}</>
                          ) : (
                            <span className="text-green-600 font-medium">✓ Completo</span>
                          )}
                        </p>
                      </div>
                      
                      {quantidadeRestante > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantidade(item.nome, Math.max(0, quantidadeSelecionada - 1))}
                            className="rounded-lg border border-gray-300 p-1 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            disabled={quantidadeSelecionada === 0}
                          >
                            <i className="fa-solid fa-minus text-sm"></i>
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            max={quantidadeRestante}
                            value={quantidadeSelecionada}
                            onChange={(e) => updateQuantidade(item.nome, Math.min(quantidadeRestante, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                          />
                          
                          <button
                            type="button"
                            onClick={() => updateQuantidade(item.nome, Math.min(quantidadeRestante, quantidadeSelecionada + 1))}
                            className="rounded-lg border border-gray-300 p-1 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            disabled={quantidadeSelecionada >= quantidadeRestante}
                          >
                            <i className="fa-solid fa-plus text-sm"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {erros[item.nome] && (
                      <p className="text-sm text-red-600">{erros[item.nome]}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações (opcional)
            </label>
            <textarea
              id="observacoes"
              rows={3}
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Informações adicionais sobre a doação..."
            />
          </div>

          {/* Ações */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={totalItens === 0}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmar Doação
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalDoacaoParcial