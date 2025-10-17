import React, { useEffect, useRef } from 'react'
import { createApp, type App } from 'vue'
import MapaVue from '../components/MapaVue.vue'

const Mapa: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const vueAppRef = useRef<App<Element> | null>(null)

  useEffect(() => {
    if (mapContainerRef.current && !vueAppRef.current) {
      // Create Vue app and mount it
      vueAppRef.current = createApp(MapaVue)
      vueAppRef.current.mount(mapContainerRef.current)
    }

    return () => {
      // Cleanup Vue app when component unmounts
      if (vueAppRef.current) {
        vueAppRef.current.unmount()
        vueAppRef.current = null
      }
    }
  }, [])

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
            <div ref={mapContainerRef} className="vue-map-wrapper"></div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default Mapa