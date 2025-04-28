import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MenuItem {
  id: string
  title: string
  path: string
  icon: string
  enabled: boolean
  order: number
}

interface MenuStore {
  menuItems: MenuItem[]
  setMenuItems: (items: MenuItem[]) => void
  getEnabledMenuItems: () => MenuItem[]
}

export const useMenuStore = create(
  persist<MenuStore>(
    (set, get) => ({
      menuItems: [],
      setMenuItems: (items) => set({ menuItems: items }),
      getEnabledMenuItems: () => {
        const { menuItems } = get()
        return menuItems
          .filter(item => item.enabled)
          .sort((a, b) => a.order - b.order)
      }
    }),
    {
      name: 'menu-storage'
    }
  )
)