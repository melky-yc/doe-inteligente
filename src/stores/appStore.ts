import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark'
  isLoading: boolean
  notifications: Notification[]
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isLoading: false,
      notifications: [],
      
      setTheme: (theme) => set({ theme }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = { ...notification, id }
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Remover automaticamente notificações após a duração especificada
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration || 5000)
        }
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
    }),
    {
      name: 'doe-inteligente-app-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)