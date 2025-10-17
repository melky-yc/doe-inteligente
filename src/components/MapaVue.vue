<template>
  <div class="mapa-vue-container">
    <!-- Filters -->
    <div class="map-filters">
      <div class="filter-group">
        <label for="causa-filter">Filtrar por causa:</label>
        <select id="causa-filter" v-model="filtroSelecionado" @change="filtrarONGs">
          <option value="">Todas as causas</option>
          <option v-for="causa in causasDisponiveis" :key="causa" :value="causa">
            {{ causa }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="search-filter">Buscar ONG:</label>
        <input
          id="search-filter"
          type="text"
          v-model="termoBusca"
          @input="filtrarONGs"
          placeholder="Digite o nome da ONG..."
        />
      </div>
      
      <div class="results-count">
        {{ ongsFiltradas.length }} ONG{{ ongsFiltradas.length !== 1 ? 's' : '' }} encontrada{{ ongsFiltradas.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Map Area -->
    <div class="map-area">
      <div class="map-placeholder" ref="mapElement">
        <!-- Simulated map with markers -->
        <div class="map-background">
          <div class="map-title">
            <h3>Teresina - PI</h3>
            <p>Mapa interativo de ONGs</p>
          </div>
          
          <!-- Markers for filtered ONGs -->
          <div
            v-for="ong in ongsFiltradas"
            :key="ong.id"
            class="map-marker"
            :style="getMarkerStyle(ong)"
            @click="selecionarONG(ong)"
            :class="{ active: ongSelecionada?.id === ong.id }"
            :title="ong.nome"
          >
            <i class="fa-solid fa-map-pin"></i>
          </div>
        </div>
      </div>

      <!-- ONG Details Panel -->
      <div v-if="ongSelecionada" class="ong-details">
        <div class="ong-header">
          <h3>{{ ongSelecionada.nome }}</h3>
          <button @click="fecharDetalhes" class="close-btn" aria-label="Fechar detalhes">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div class="ong-content">
          <p class="ong-description">{{ ongSelecionada.descricao }}</p>
          
          <div class="ong-info">
            <div class="info-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>{{ ongSelecionada.endereco }}</span>
            </div>
            
            <div class="info-item">
              <i class="fa-solid fa-phone"></i>
              <a :href="`tel:${ongSelecionada.telefone}`">{{ ongSelecionada.telefone }}</a>
            </div>
            
            <div class="info-item">
              <i class="fa-solid fa-envelope"></i>
              <a :href="`mailto:${ongSelecionada.email}`">{{ ongSelecionada.email }}</a>
            </div>
          </div>
          
          <div class="ong-causes">
            <h4>Causas atendidas:</h4>
            <div class="causes-list">
              <span
                v-for="causa in ongSelecionada.causas"
                :key="causa"
                class="cause-tag"
              >
                {{ causa }}
              </span>
            </div>
          </div>
          
          <div class="ong-actions">
            <a
              v-if="ongSelecionada.redesSociais?.whatsapp"
              :href="`https://wa.me/${ongSelecionada.redesSociais.whatsapp.replace(/[^\d]/g, '')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn primary"
            >
              <i class="fa-brands fa-whatsapp"></i>
              Entrar em Contato
            </a>
            
            <a
              v-if="ongSelecionada.website"
              :href="ongSelecionada.website"
              target="_blank"
              rel="noopener noreferrer"
              class="btn secondary"
            >
              <i class="fa-solid fa-globe"></i>
              Site Oficial
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ONGs List -->
    <div class="ongs-list">
      <h3>ONGs Cadastradas</h3>
      <div class="ongs-grid">
        <div
          v-for="ong in ongsFiltradas"
          :key="ong.id"
          class="ong-card"
          @click="selecionarONG(ong)"
          :class="{ active: ongSelecionada?.id === ong.id }"
        >
          <div class="ong-card-header">
            <h4>{{ ong.nome }}</h4>
            <div class="verification-badge" v-if="ong.verificada">
              <i class="fa-solid fa-circle-check"></i>
              Verificada
            </div>
          </div>
          
          <p class="ong-card-description">{{ truncateText(ong.descricao, 100) }}</p>
          
          <div class="ong-card-causes">
            <span
              v-for="causa in ong.causas.slice(0, 2)"
              :key="causa"
              class="cause-tag small"
            >
              {{ causa }}
            </span>
            <span v-if="ong.causas.length > 2" class="more-causes">
              +{{ ong.causas.length - 2 }} mais
            </span>
          </div>
          
          <div class="ong-card-location">
            <i class="fa-solid fa-location-dot"></i>
            {{ getShortAddress(ong.endereco) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface ONG {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  cnpj: string
  descricao: string
  causas: string[]
  website?: string
  redesSociais?: {
    instagram?: string
    facebook?: string
    whatsapp?: string
  }
  coordenadas?: {
    lat: number
    lng: number
  }
  verificada: boolean
  criadaEm?: Date
}

const ongs = ref<ONG[]>([])
const ongsFiltradas = ref<ONG[]>([])
const ongSelecionada = ref<ONG | null>(null)
const filtroSelecionado = ref('')
const termoBusca = ref('')
const isLoading = ref(true)

const causasDisponiveis = computed(() => {
  const todasCausas = ongs.value.flatMap(ong => ong.causas)
  return [...new Set(todasCausas)].sort()
})

const carregarONGs = async () => {
  try {
    const response = await fetch('/api/ongs')
    const result = await response.json()
    
    if (result.ok) {
      ongs.value = result.data
      ongsFiltradas.value = result.data
    } else {
      console.error('Erro ao carregar ONGs:', result.error)
    }
  } catch (error) {
    console.error('Erro de conexão:', error)
  } finally {
    isLoading.value = false
  }
}

const filtrarONGs = () => {
  let resultado = [...ongs.value]
  
  // Filter by cause
  if (filtroSelecionado.value) {
    resultado = resultado.filter(ong => 
      ong.causas.includes(filtroSelecionado.value)
    )
  }
  
  // Filter by search term
  if (termoBusca.value.trim()) {
    const termo = termoBusca.value.toLowerCase().trim()
    resultado = resultado.filter(ong =>
      ong.nome.toLowerCase().includes(termo) ||
      ong.descricao.toLowerCase().includes(termo) ||
      ong.causas.some(causa => causa.toLowerCase().includes(termo))
    )
  }
  
  ongsFiltradas.value = resultado
  
  // Clear selection if selected ONG is not in filtered results
  if (ongSelecionada.value && !resultado.find(ong => ong.id === ongSelecionada.value?.id)) {
    ongSelecionada.value = null
  }
}

const selecionarONG = (ong: ONG) => {
  ongSelecionada.value = ong
}

const fecharDetalhes = () => {
  ongSelecionada.value = null
}

const getMarkerStyle = (ong: ONG) => {
  if (!ong.coordenadas) return {}
  
  // Convert lat/lng to percentage positions (simplified)
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

onMounted(() => {
  carregarONGs()
})
</script>

<style scoped>
.mapa-vue-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  min-height: 600px;
}

.map-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.results-count {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.map-area {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
  min-height: 400px;
}

.map-placeholder {
  position: relative;
  background: linear-gradient(45deg, #e2e8f0, #cbd5e1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  min-height: 400px;
}

.map-background {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(0, 102, 204, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(0, 102, 204, 0.1) 0%, transparent 50%);
}

.map-title {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
}

.map-title h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.map-title p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.map-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: var(--primary);
  color: white;
  border: 2px solid white;
  border-radius: 50% 50% 50% 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: rotate(-45deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 10;
}

.map-marker i {
  transform: rotate(45deg);
  font-size: 0.75rem;
}

.map-marker:hover,
.map-marker.active {
  background-color: var(--primary-dark);
  transform: rotate(-45deg) scale(1.2);
  z-index: 20;
}

.ong-details {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.ong-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.ong-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.close-btn:hover {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
}

.ong-content {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.ong-description {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.ong-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.info-item i {
  width: 16px;
  color: var(--primary);
}

.info-item a {
  color: var(--primary);
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.ong-causes h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.causes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.cause-tag {
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.cause-tag.small {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
}

.ong-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn.primary {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn.primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.btn.secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border);
}

.btn.secondary:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
}

.ongs-list {
  margin-top: 1rem;
}

.ongs-list h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.ongs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.ong-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.ong-card:hover,
.ong-card.active {
  border-color: var(--primary);
  box-shadow: 0 4px 12px var(--shadow-lg);
  transform: translateY(-2px);
}

.ong-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.ong-card-header h4 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.verification-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--success);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  font-size: 0.625rem;
  font-weight: 500;
}

.ong-card-description {
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.ong-card-causes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.more-causes {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  font-size: 0.625rem;
}

.ong-card-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.ong-card-location i {
  color: var(--primary);
}

@media (max-width: 1024px) {
  .map-area {
    grid-template-columns: 1fr;
  }
  
  .ong-details {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .mapa-vue-container {
    padding: 1rem;
  }
  
  .map-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .results-count {
    margin-left: 0;
    text-align: center;
  }
  
  .ongs-grid {
    grid-template-columns: 1fr;
  }
}
</style>