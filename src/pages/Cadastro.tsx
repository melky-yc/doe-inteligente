import React, { useState } from 'react'
import { useAppStore } from '../stores/appStore'
import { Doador, ONG, ApiResponse } from '../types'

type TabType = 'doador' | 'ong'

interface FormErrors {
  [key: string]: string
}

const Cadastro: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('doador')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const { addNotification } = useAppStore()

  // Estado do formulário de doador
  const [doadorForm, setDoadorForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    tipoDoacao: 'dinheiro' as const,
    valorPreferido: '',
    frequencia: 'unica' as const
  })

  // Estado do formulário de ONG
  const [ongForm, setOngForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cnpj: '',
    descricao: '',
    causas: [] as string[],
    website: '',
    instagram: '',
    facebook: '',
    whatsapp: ''
  })

  const tiposDoacao = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'brinquedos', label: 'Brinquedos' },
    { value: 'outros', label: 'Outros' }
  ]

  const frequencias = [
    { value: 'unica', label: 'Única' },
    { value: 'mensal', label: 'Mensal' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'anual', label: 'Anual' }
  ]

  const causasDisponiveis = [
    'Crianças e Adolescentes',
    'Idosos',
    'Educação',
    'Saúde',
    'Meio Ambiente',
    'Animais',
    'Cultura',
    'Esporte',
    'Assistência Social',
    'Direitos Humanos'
  ]

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return emailRegex.test(email)
  }

  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
    return cleanCNPJ.length === 14
  }

  const validateDoadorForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!doadorForm.nome.trim() || doadorForm.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!doadorForm.email.trim() || !validateEmail(doadorForm.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (doadorForm.telefone && doadorForm.telefone.replace(/[^\d]/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido'
    }

    if (doadorForm.valorPreferido && isNaN(Number(doadorForm.valorPreferido))) {
      newErrors.valorPreferido = 'Valor deve ser um número'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOngForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!ongForm.nome.trim() || ongForm.nome.trim().length < 3) {
      newErrors.nome = 'Nome da ONG deve ter pelo menos 3 caracteres'
    }

    if (!ongForm.email.trim() || !validateEmail(ongForm.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!ongForm.telefone.trim() || ongForm.telefone.replace(/[^\d]/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido'
    }

    if (!ongForm.cnpj.trim() || !validateCNPJ(ongForm.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido'
    }

    if (!ongForm.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório'
    }

    if (!ongForm.descricao.trim() || ongForm.descricao.trim().length < 20) {
      newErrors.descricao = 'Descrição deve ter pelo menos 20 caracteres'
    }

    if (ongForm.causas.length === 0) {
      newErrors.causas = 'Selecione pelo menos uma causa'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDoadorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateDoadorForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/doador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: doadorForm.nome.trim(),
          email: doadorForm.email.trim(),
          telefone: doadorForm.telefone.trim() || undefined,
          endereco: doadorForm.endereco.trim() || undefined,
          tipoDoacao: doadorForm.tipoDoacao,
          valorPreferido: doadorForm.valorPreferido ? Number(doadorForm.valorPreferido) : undefined,
          frequencia: doadorForm.frequencia
        } as Partial<Doador>),
      })

      const result: ApiResponse<Doador> = await response.json()

      if (result.ok) {
        addNotification({
          type: 'success',
          title: 'Cadastro realizado!',
          message: result.message || 'Doador cadastrado com sucesso!'
        })
        
        // Reset formulario
        setDoadorForm({
          nome: '',
          email: '',
          telefone: '',
          endereco: '',
          tipoDoacao: 'dinheiro',
          valorPreferido: '',
          frequencia: 'unica'
        })
        setErrors({})
      } else {
        addNotification({
          type: 'error',
          title: 'Erro no cadastro',
          message: result.error || 'Erro desconhecido'
        })
      }
    } catch (_error) {
      addNotification({
        type: 'error',
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOngSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOngForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/ong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: ongForm.nome.trim(),
          email: ongForm.email.trim(),
          telefone: ongForm.telefone.trim(),
          endereco: ongForm.endereco.trim(),
          cnpj: ongForm.cnpj.trim(),
          descricao: ongForm.descricao.trim(),
          causas: ongForm.causas,
          website: ongForm.website.trim() || undefined,
          redesSociais: {
            instagram: ongForm.instagram.trim() || undefined,
            facebook: ongForm.facebook.trim() || undefined,
            whatsapp: ongForm.whatsapp.trim() || undefined,
          }
        } as Partial<ONG>),
      })

      const result: ApiResponse<ONG> = await response.json()

      if (result.ok) {
        addNotification({
          type: 'success',
          title: 'Cadastro realizado!',
          message: result.message || 'ONG cadastrada com sucesso!'
        })
        
        // Reset formulario
        setOngForm({
          nome: '',
          email: '',
          telefone: '',
          endereco: '',
          cnpj: '',
          descricao: '',
          causas: [],
          website: '',
          instagram: '',
          facebook: '',
          whatsapp: ''
        })
        setErrors({})
      } else {
        addNotification({
          type: 'error',
          title: 'Erro no cadastro',
          message: result.error || 'Erro desconhecido'
        })
      }
    } catch (_error) {
      addNotification({
        type: 'error',
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCausaToggle = (causa: string) => {
    setOngForm(prev => ({
      ...prev,
      causas: prev.causas.includes(causa)
        ? prev.causas.filter(c => c !== causa)
        : [...prev.causas, causa]
    }))
  }

  return (
    <div className="cadastro-page">
      <section className="hero-section section-sm">
        <div className="container">
          <div className="hero-content text-center">
            <div className="hero-visual" role="img" aria-label="Banner de cadastro">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h1>Crie seu cadastro e faça a diferença</h1>
            <p>Junte-se à nossa comunidade e ajude a transformar vidas em Teresina</p>
          </div>
        </div>
      </section>

      <section className="form-section section">
        <div className="container">
          <div className="form-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'doador' ? 'active' : ''}`}
                onClick={() => setActiveTab('doador')}
                type="button"
              >
                <i className="fa-solid fa-heart"></i>
                Sou Doador
              </button>
              <button
                className={`tab ${activeTab === 'ong' ? 'active' : ''}`}
                onClick={() => setActiveTab('ong')}
                type="button"
              >
                <i className="fa-solid fa-building"></i>
                Sou ONG
              </button>
            </div>

            {activeTab === 'doador' && (
              <form className="form-panel card" onSubmit={handleDoadorSubmit}>
                <h2>Cadastro de Doador</h2>
                <p>Preencha seus dados para começar a ajudar</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="doador-nome">
                    Nome completo *
                  </label>
                  <input
                    className={`form-input ${errors.nome ? 'error' : ''}`}
                    id="doador-nome"
                    type="text"
                    value={doadorForm.nome}
                    onChange={(e) => setDoadorForm(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                  {errors.nome && <span className="form-error">{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="doador-email">
                    E-mail *
                  </label>
                  <input
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    id="doador-email"
                    type="email"
                    value={doadorForm.email}
                    onChange={(e) => setDoadorForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="doador-telefone">
                    Telefone
                  </label>
                  <input
                    className={`form-input ${errors.telefone ? 'error' : ''}`}
                    id="doador-telefone"
                    type="tel"
                    value={doadorForm.telefone}
                    onChange={(e) => setDoadorForm(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(86) 99999-9999"
                  />
                  {errors.telefone && <span className="form-error">{errors.telefone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="doador-endereco">
                    Endereço
                  </label>
                  <input
                    className="form-input"
                    id="doador-endereco"
                    type="text"
                    value={doadorForm.endereco}
                    onChange={(e) => setDoadorForm(prev => ({ ...prev, endereco: e.target.value }))}
                    placeholder="Seu endereço completo"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="doador-tipo">
                    Tipo de doação *
                  </label>
                  <select
                    className="form-select"
                    id="doador-tipo"
                    value={doadorForm.tipoDoacao}
                    onChange={(e) => setDoadorForm(prev => ({ ...prev, tipoDoacao: e.target.value as Doador['tipoDoacao'] }))}
                    required
                  >
                    {tiposDoacao.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {doadorForm.tipoDoacao === 'dinheiro' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="doador-valor">
                      Valor (R$)
                    </label>
                    <input
                      className={`form-input ${errors.valorPreferido ? 'error' : ''}`}
                      id="doador-valor"
                      type="number"
                      min="1"
                      step="0.01"
                      value={doadorForm.valorPreferido}
                      onChange={(e) => setDoadorForm(prev => ({ ...prev, valorPreferido: e.target.value }))}
                      placeholder="100.00"
                    />
                    {errors.valorPreferido && <span className="form-error">{errors.valorPreferido}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="doador-frequencia">
                    Frequência de doação
                  </label>
                  <select
                    className="form-select"
                    id="doador-frequencia"
                    value={doadorForm.frequencia}
                    onChange={(e) => setDoadorForm(prev => ({ ...prev, frequencia: e.target.value as Doador['frequencia'] }))}
                  >
                    {frequencias.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn primary lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user-plus"></i>
                      Cadastrar Doador
                    </>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'ong' && (
              <form className="form-panel card" onSubmit={handleOngSubmit}>
                <h2>Cadastro de ONG</h2>
                <p>Registre sua organização na plataforma</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-nome">
                    Nome da ONG *
                  </label>
                  <input
                    className={`form-input ${errors.nome ? 'error' : ''}`}
                    id="ong-nome"
                    type="text"
                    value={ongForm.nome}
                    onChange={(e) => setOngForm(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome da sua organização"
                    required
                  />
                  {errors.nome && <span className="form-error">{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-email">
                    E-mail institucional *
                  </label>
                  <input
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    id="ong-email"
                    type="email"
                    value={ongForm.email}
                    onChange={(e) => setOngForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@suaong.org"
                    required
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-telefone">
                    Telefone *
                  </label>
                  <input
                    className={`form-input ${errors.telefone ? 'error' : ''}`}
                    id="ong-telefone"
                    type="tel"
                    value={ongForm.telefone}
                    onChange={(e) => setOngForm(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(86) 3215-4567"
                    required
                  />
                  {errors.telefone && <span className="form-error">{errors.telefone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-cnpj">
                    CNPJ *
                  </label>
                  <input
                    className={`form-input ${errors.cnpj ? 'error' : ''}`}
                    id="ong-cnpj"
                    type="text"
                    value={ongForm.cnpj}
                    onChange={(e) => setOngForm(prev => ({ ...prev, cnpj: e.target.value }))}
                    placeholder="12.345.678/0001-90"
                    required
                  />
                  {errors.cnpj && <span className="form-error">{errors.cnpj}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-endereco">
                    Endereço completo *
                  </label>
                  <input
                    className={`form-input ${errors.endereco ? 'error' : ''}`}
                    id="ong-endereco"
                    type="text"
                    value={ongForm.endereco}
                    onChange={(e) => setOngForm(prev => ({ ...prev, endereco: e.target.value }))}
                    placeholder="Rua, número, bairro, cidade - UF"
                    required
                  />
                  {errors.endereco && <span className="form-error">{errors.endereco}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-descricao">
                    Descrição da ONG *
                  </label>
                  <textarea
                    className={`form-textarea ${errors.descricao ? 'error' : ''}`}
                    id="ong-descricao"
                    rows={4}
                    value={ongForm.descricao}
                    onChange={(e) => setOngForm(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o trabalho da sua organização..."
                    required
                  />
                  {errors.descricao && <span className="form-error">{errors.descricao}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Causas que atende * {errors.causas && <span className="form-error">({errors.causas})</span>}
                  </label>
                  <div className="checkbox-grid">
                    {causasDisponiveis.map(causa => (
                      <label key={causa} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={ongForm.causas.includes(causa)}
                          onChange={() => handleCausaToggle(causa)}
                        />
                        <span className="checkbox-label">{causa}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ong-website">
                    Website
                  </label>
                  <input
                    className="form-input"
                    id="ong-website"
                    type="url"
                    value={ongForm.website}
                    onChange={(e) => setOngForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.suaong.org"
                  />
                </div>

                <div className="social-fields">
                  <h3>Redes Sociais</h3>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="ong-instagram">
                      Instagram
                    </label>
                    <input
                      className="form-input"
                      id="ong-instagram"
                      type="text"
                      value={ongForm.instagram}
                      onChange={(e) => setOngForm(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="@suaong"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ong-facebook">
                      Facebook
                    </label>
                    <input
                      className="form-input"
                      id="ong-facebook"
                      type="text"
                      value={ongForm.facebook}
                      onChange={(e) => setOngForm(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="facebook.com/suaong"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ong-whatsapp">
                      WhatsApp
                    </label>
                    <input
                      className="form-input"
                      id="ong-whatsapp"
                      type="tel"
                      value={ongForm.whatsapp}
                      onChange={(e) => setOngForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="(86) 99999-9999"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn primary lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-building"></i>
                      Cadastrar ONG
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          margin-top: -80px;
          padding-top: calc(var(--space-2xl) + 80px);
        }
        
        .hero-content {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .hero-visual {
          font-size: 4rem;
          margin-bottom: var(--space-lg);
          color: rgba(255, 255, 255, 0.9);
        }
        
        .hero-section h1 {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
          color: white;
        }
        
        .hero-section p {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .tabs {
          display: flex;
          margin-bottom: var(--space-lg);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 2px 8px var(--shadow);
        }
        
        .tab {
          flex: 1;
          padding: var(--space-lg);
          border: none;
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 1.125rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
        }
        
        .tab:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .tab.active {
          background-color: var(--primary);
          color: white;
        }
        
        .form-panel {
          padding: var(--space-2xl);
        }
        
        .form-panel h2 {
          font-size: 2rem;
          margin-bottom: var(--space-sm);
          color: var(--text-primary);
        }
        
        .form-panel > p {
          margin-bottom: var(--space-2xl);
          color: var(--text-secondary);
          font-size: 1.125rem;
        }
        
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-sm);
          margin-top: var(--space-sm);
        }
        
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .checkbox-item:hover {
          background-color: var(--bg-secondary);
          border-color: var(--primary);
        }
        
        .checkbox-item input[type="checkbox"] {
          margin: 0;
        }
        
        .checkbox-item input[type="checkbox"]:checked + .checkbox-label {
          color: var(--primary);
          font-weight: 500;
        }
        
        .checkbox-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        
        .social-fields {
          margin-top: var(--space-2xl);
          padding-top: var(--space-2xl);
          border-top: 1px solid var(--border);
        }
        
        .social-fields h3 {
          font-size: 1.25rem;
          margin-bottom: var(--space-lg);
          color: var(--text-primary);
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem;
          }
          
          .hero-visual {
            font-size: 3rem;
          }
          
          .tabs {
            flex-direction: column;
          }
          
          .tab {
            padding: var(--space-md);
            font-size: 1rem;
          }
          
          .form-panel {
            padding: var(--space-lg);
          }
          
          .checkbox-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            padding: var(--space-lg) 0;
            padding-top: calc(var(--space-lg) + 80px);
          }
          
          .hero-section h1 {
            font-size: 1.75rem;
          }
          
          .form-panel {
            padding: var(--space-md);
          }
        }
      `}</style>
    </div>
  )
}

export default Cadastro