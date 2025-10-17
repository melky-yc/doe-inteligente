import React, { useState } from 'react'
import { useAppStore } from '../stores/appStore'
import { ContatoForm, ApiResponse } from '../types'

interface FormErrors {
  [key: string]: string
}

const Contato: React.FC = () => {
  const [formData, setFormData] = useState<ContatoForm>({
    nome: '',
    email: '',
    mensagem: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useAppStore()

  const contactInfo = [
    {
      icon: 'fa-phone',
      title: 'Telefone',
      value: '(+55 86) 99999-9999',
      href: 'tel:+5586999999999',
      description: 'Ligue para nós durante o horário comercial'
    },
    {
      icon: 'fa-envelope',
      title: 'E-mail',
      value: 'contato@doeinteligente.org',
      href: 'mailto:contato@doeinteligente.org',
      description: 'Envie um e-mail e responderemos em breve'
    },
    {
      icon: 'fa-brands fa-whatsapp',
      title: 'WhatsApp',
      value: 'Conversar no WhatsApp',
      href: 'https://wa.me/5586999999999',
      description: 'Atendimento rápido via WhatsApp'
    },
    {
      icon: 'fa-map-location-dot',
      title: 'Localização',
      value: 'Teresina - PI',
      href: '#',
      description: 'Atendemos toda a região de Teresina'
    }
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nome.trim() || formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.mensagem.trim() || formData.mensagem.trim().length < 10) {
      newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          mensagem: formData.mensagem.trim()
        }),
      })

      const result: ApiResponse = await response.json()

      if (result.ok) {
        addNotification({
          type: 'success',
          title: 'Mensagem enviada!',
          message: result.message || 'Sua mensagem foi enviada com sucesso!'
        })
        
        // Reset form
        setFormData({
          nome: '',
          email: '',
          mensagem: ''
        })
        setErrors({})
      } else {
        addNotification({
          type: 'error',
          title: 'Erro ao enviar',
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

  const handleInputChange = (field: keyof ContatoForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="contato-page">
      <section className="hero-section section-sm">
        <div className="container">
          <div className="hero-content text-center">
            <div className="hero-visual" role="img" aria-label="Banner de contato">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h1>Fale com a Plataforma</h1>
            <p>Tire suas dúvidas, envie sugestões ou solicite suporte. Estamos aqui para ajudar!</p>
          </div>
        </div>
      </section>

      <section className="contact-section section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Entre em Contato</h2>
              <p>
                Escolha a forma mais conveniente para falar conosco. 
                Nossa equipe está pronta para atender você.
              </p>

              <div className="contact-methods">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="contact-method"
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className="contact-icon">
                      <i className={contact.icon}></i>
                    </div>
                    <div className="contact-details">
                      <h3>{contact.title}</h3>
                      <p className="contact-value">{contact.value}</p>
                      <p className="contact-description">{contact.description}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="social-section">
                <h3>Siga-nos nas Redes Sociais</h3>
                <div className="social-links">
                  <a
                    href="https://instagram.com/doeinteligente"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a
                    href="https://wa.me/5586999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                  <a
                    href="https://linkedin.com/company/doeinteligente"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <form className="contact-form card" onSubmit={handleSubmit}>
                <h2>Envie sua Mensagem</h2>
                <p>Preencha o formulário abaixo e entraremos em contato em breve.</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="contato-nome">
                    Nome completo *
                  </label>
                  <input
                    className={`form-input ${errors.nome ? 'error' : ''}`}
                    id="contato-nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                  {errors.nome && <span className="form-error">{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contato-email">
                    E-mail *
                  </label>
                  <input
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    id="contato-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contato-mensagem">
                    Mensagem *
                  </label>
                  <textarea
                    className={`form-textarea ${errors.mensagem ? 'error' : ''}`}
                    id="contato-mensagem"
                    rows={6}
                    value={formData.mensagem}
                    onChange={(e) => handleInputChange('mensagem', e.target.value)}
                    placeholder="Como podemos ajudar você? Descreva sua dúvida, sugestão ou solicitação..."
                    required
                  />
                  {errors.mensagem && <span className="form-error">{errors.mensagem}</span>}
                </div>

                <button
                  type="submit"
                  className="btn primary lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      Enviar Mensagem
                    </>
                  )}
                </button>

                <p className="form-note">
                  * Campos obrigatórios. Responderemos sua mensagem em até 24 horas.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default Contato