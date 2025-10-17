import React from 'react'
import MapaReact from '../components/MapaReact'

const Mapa: React.FC = () => {
  return (
    <div className="mapa-page">
      <section className="hero-section section-sm">
        <div className="container">
          <div className="hero-content text-center">
            <div className="hero-visual" role="img" aria-label="Banner do mapa">
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <h1>Mapa de ONGs</h1>
            <p>Explore ONGs verificadas em Teresina e descubra como ajudar causas próximas a você</p>
          </div>
        </div>
      </section>

      <section className="map-section section">
        <div className="container">
          <div className="map-container">
            <MapaReact />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Mapa