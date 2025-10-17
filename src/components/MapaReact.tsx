import React, { useState, useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import { ONG } from '../types'

interface MapFilters {
  causa: string
  busca: string
}

const MapaReact: React.FC = () => {
  const [ongs, setOngs] = useState<ONG[]>([])
  const [ongsFiltradas, setOngsFiltradas] = useState<ONG[]>([])
  const [ongSelecionada, setOngSelecionada] = useState<ONG | null>(null)
  const [filtros, setFiltros] = useState<MapFilters>({ causa: '', busca: '' })
  const [isLoading, setIsLoading] = useState(true)
  const { addNotification } = useAppStore()

  // Define callbacks antes de usá-los nos efeitos
  const carregarONGs = React.useCallback(async () => {
    try {
      const response = await fetch('/api/ongs')
      const result = await response.json()
      
      if (result.ok) {
        setOngs(result.data)
        setOngsFiltradas(result.data)
      } else {
        addNotification({
          type: 'error',
          title: 'Erro ao carregar ONGs',
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
      setIsLoading(false)
    }
  }, [addNotification])

  const filtrarONGs = React.useCallback(() => {
    let resultado = [...ongs]
    
    if (filtros.causa) {
      resultado = resultado.filter(ong => 
        ong.causas.includes(filtros.causa)
      )
    }
    
    if (filtros.busca.trim()) {
      const termo = filtros.busca.toLowerCase().trim()
      resultado = resultado.filter(ong =>
        ong.nome.toLowerCase().includes(termo) ||
        ong.descricao.toLowerCase().includes(termo) ||
        ong.causas.some(causa => causa.toLowerCase().includes(termo))
      )
    }
    
    setOngsFiltradas(resultado)
    
    if (ongSelecionada && !resultado.find(ong => ong.id === ongSelecionada.id)) {
      setOngSelecionada(null)
    }
  }, [ongs, filtros, ongSelecionada])

  const causasDisponiveis = React.useMemo(() => {
    const todasCausas = ongs.flatMap(ong => ong.causas)
    return [...new Set(todasCausas)].sort()
  }, [ongs])

  useEffect(() => {
    carregarONGs()
  }, [carregarONGs])

  useEffect(() => {
    filtrarONGs()
  }, [filtros, ongs, filtrarONGs])

  const getMarkerStyle = (ong: ONG): React.CSSProperties => {
    if (!ong.coordenadas) return {}
    
    const left = ((ong.coordenadas.lng + 42.9) / 0.2) * 100
    const top = ((5.2 - ong.coordenadas.lat) / 0.2) * 100
    
    return {
      left: `${Math.max(5, Math.min(95, left))}%`,
      top: `${Math.max(5, Math.min(95, top))}%`
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getShortAddress = (endereco: string) => {
    const parts = endereco.split(',')
    return parts.length > 2 ? `${parts[1]?.trim()}, ${parts[2]?.trim()}` : endereco
  }

  if (isLoading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Carregando mapa de ONGs...</p>
      </div>
    )
  }

  return (
    <div className="mapa-react-container">
      {/* Filtros Modernos */}
      <div className="map-filters-modern">
        <div className="filters-header">
          <h3>
            <i className="fa-solid fa-filter" aria-hidden="true"></i>
            Filtros de Busca
          </h3>
          <div className="results-badge">
            {ongsFiltradas.length} ONG{ongsFiltradas.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="causa-filter" className="filter-label">
              <i className="fa-solid fa-heart" aria-hidden="true"></i>
              Causa
            </label>
            <select
              id="causa-filter"
              className="filter-select"
              value={filtros.causa}
              onChange={(e) => setFiltros(prev => ({ ...prev, causa: e.target.value }))}
            >
              <option value="">Todas as causas</option>
              {causasDisponiveis.map(causa => (
                <option key={causa} value={causa}>{causa}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="search-filter" className="filter-label">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              Buscar
            </label>
            <input
              id="search-filter"
              type="text"
              className="filter-input"
              value={filtros.busca}
              onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
              placeholder="Nome da ONG, descrição..."
            />
          </div>
        </div>
      </div>

      {/* Área do Mapa */}
      <div className="map-area-modern">
        <div className="map-container-modern">
          <div className="map-placeholder-modern">
            <div className="map-background-modern">
              <div className="map-title-modern">
                <h3>
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  Teresina - PI
                </h3>
                <p>Mapa interativo de ONGs verificadas</p>
              </div>
              
              {/* Marcadores */}
              {ongsFiltradas.map(ong => (
                <button
                  key={ong.id}
                  className={`map-marker-modern ${ongSelecionada?.id === ong.id ? 'active' : ''}`}
                  style={getMarkerStyle(ong)}
                  onClick={() => setOngSelecionada(ong)}
                  title={ong.nome}
                  aria-label={`Selecionar ${ong.nome}`}
                >
                  <i className="fa-solid fa-map-pin" aria-hidden="true"></i>
                  <span className="marker-pulse"></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Painel de Detalhes */}
        {ongSelecionada && (
          <div className="ong-details-modern">
            <div className="ong-header-modern">
              <div className="ong-title-section">
                <h3>{ongSelecionada.nome}</h3>
                {ongSelecionada.verificada && (
                  <div className="verification-badge-modern">
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    Verificada
                  </div>
                )}
              </div>
              <button
                onClick={() => setOngSelecionada(null)}
                className="close-btn-modern"
                aria-label="Fechar detalhes"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
            
            <div className="ong-content-modern">
              <p className="ong-description-modern">{ongSelecionada.descricao}</p>
              
              <div className="ong-info-modern">
                <div className="info-item-modern">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <span>{ongSelecionada.endereco}</span>
                </div>
                
                <div className="info-item-modern">
                  <i className="fa-solid fa-phone" aria-hidden="true"></i>
                  <a href={`tel:${ongSelecionada.telefone}`}>{ongSelecionada.telefone}</a>
                </div>
                
                <div className="info-item-modern">
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                  <a href={`mailto:${ongSelecionada.email}`}>{ongSelecionada.email}</a>
                </div>
              </div>
              
              <div className="ong-causes-modern">
                <h4>
                  <i className="fa-solid fa-heart" aria-hidden="true"></i>
                  Causas atendidas
                </h4>
                <div className="causes-list-modern">
                  {ongSelecionada.causas.map(causa => (
                    <span key={causa} className="cause-tag-modern">
                      {causa}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="ong-actions-modern">
                {ongSelecionada.redesSociais?.whatsapp && (
                  <a
                    href={`https://wa.me/${ongSelecionada.redesSociais.whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn primary"
                  >
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                    Entrar em Contato
                  </a>
                )}
                
                {ongSelecionada.website && (
                  <a
                    href={ongSelecionada.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn secondary"
                  >
                    <i className="fa-solid fa-globe" aria-hidden="true"></i>
                    Site Oficial
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de ONGs */}
      <div className="ongs-list-modern">
        <div className="list-header-modern">
          <h3>
            <i className="fa-solid fa-building" aria-hidden="true"></i>
            ONGs Cadastradas
          </h3>
          <div className="list-stats">
            {ongsFiltradas.length} de {ongs.length} ONGs
          </div>
        </div>
        
        <div className="ongs-grid-modern">
          {ongsFiltradas.map(ong => (
            <div
              key={ong.id}
              className={`ong-card-modern ${ongSelecionada?.id === ong.id ? 'active' : ''}`}
              onClick={() => setOngSelecionada(ong)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOngSelecionada(ong)
                }
              }}
            >
              <div className="ong-card-header-modern">
                <h4>{ong.nome}</h4>
                {ong.verificada && (
                  <div className="verification-badge-small">
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                  </div>
                )}
              </div>
              
              <p className="ong-card-description-modern">
                {truncateText(ong.descricao, 120)}
              </p>
              
              <div className="ong-card-causes-modern">
                {ong.causas.slice(0, 3).map(causa => (
                  <span key={causa} className="cause-tag-small">
                    {causa}
                  </span>
                ))}
                {ong.causas.length > 3 && (
                  <span className="more-causes-modern">
                    +{ong.causas.length - 3}
                  </span>
                )}
              </div>
              
              <div className="ong-card-location-modern">
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                {getShortAddress(ong.endereco)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapaReact