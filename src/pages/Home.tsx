import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const features = [
    {
      icon: 'fa-location-dot',
      title: 'Encontre ONGs próximas',
      description: 'Descubra organizações atuando na sua região para apoiar causas locais.'
    },
    {
      icon: 'fa-hand-holding-heart',
      title: 'Doe com segurança',
      description: 'Transparência e proteção para suas contribuições, com processos confiáveis.'
    },
    {
      icon: 'fa-people-group',
      title: 'Fortaleça sua comunidade',
      description: 'Conecte-se a projetos que geram impacto real onde você mora.'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <div className="hero-visual" role="img" aria-label="Banner de destaque da plataforma">
              <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
                <path 
                  d="M32 12c-6-10-22-8-22 6 0 10 9 16 22 26 13-10 22-16 22-26 0-14-16-16-22-6z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1>Conectando Doadores e ONGs de Teresina</h1>
            <p className="hero-description">
              Uma plataforma inteligente que facilita doações transparentes e conecta 
              pessoas que querem ajudar com organizações que fazem a diferença.
            </p>
            <div className="hero-actions">
              <Link className="btn primary lg" to="/mapa">
                <i className="fa-solid fa-heart" aria-hidden="true"></i>
                Quero Ajudar Agora
              </Link>
              <Link className="btn secondary lg" to="/cadastro">
                <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Como Funciona</h2>
            <p>Descubra como nossa plataforma facilita o processo de doação</p>
          </div>
          
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="map-preview-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Mapa de ONGs</h2>
            <p>Visualize organizações próximas a você no mapa interativo</p>
          </div>
          
          <div className="map-preview-container">
            <div className="map-placeholder" role="img" aria-label="Mapa ilustrativo com ONGs de Teresina">
              <div className="map-overlay">
                <h3>Explore ONGs em Teresina</h3>
                <p>Encontre organizações verificadas na sua região</p>
                <Link className="btn primary" to="/mapa">
                  <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i>
                  Ver Mapa Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Pronto para Fazer a Diferença?</h2>
            <p>
              Junte-se à nossa comunidade de doadores e ONGs comprometidos 
              em transformar Teresina em um lugar melhor para todos.
            </p>
            <div className="cta-actions">
              <Link className="btn primary lg" to="/cadastro">
                Começar Agora
              </Link>
              <Link className="btn outline lg" to="/contato">
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default Home