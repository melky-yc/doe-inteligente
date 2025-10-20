import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EstadoFavoritos } from '@/types'

interface FavoritosStore {
  favoritos: EstadoFavoritos
  toggleFavorito: (solicitacaoId: string) => void
  isFavorito: (solicitacaoId: string) => boolean
  getFavoritos: () => string[]
  limparFavoritos: () => void
}

export const useFavoritosStore = create<FavoritosStore>()(
  persist(
    (set, get) => ({
      favoritos: {},
      
      toggleFavorito: (solicitacaoId: string) => {
        set((state) => ({
          favoritos: {
            ...state.favoritos,
            [solicitacaoId]: !state.favoritos[solicitacaoId]
          }
        }))
      },
      
      isFavorito: (solicitacaoId: string) => {
        return !!get().favoritos[solicitacaoId]
      },
      
      getFavoritos: () => {
        const { favoritos } = get()
        return Object.keys(favoritos).filter(id => favoritos[id])
      },
      
      limparFavoritos: () => {
        set({ favoritos: {} })
      }
    }),
    {
      name: 'doe-inteligente-favoritos',
      version: 1,
    }
  )
)