import { defineStore } from 'pinia'

export interface MenuInterface {
  id: number
  name: string
  url: string
  icon: string
  parent_id: number
  children: never[]
}

export const useLayoutStore = defineStore({
  id: 'layoutStore',
  state: () => ({
    isLoadingMenu: true,
    sidebarOpened: true,
    title: '',
    menus: [
      {
        id: 0,
        name: '',
        url: '',
        icon: '',
        parent_id: 0,
        children: [],
      },
    ],
  }),
  getters: {
    getMenus(): Array<MenuInterface> {
      return this.menus
    },
    getSelectedMenu(): string {
      return useRoute().path
    },
    getLoadingMenu(): boolean {
      return this.isLoadingMenu
    },
  },
  actions: {
    setSidebar() {
      this.sidebarOpened = !this.sidebarOpened
    },
    setTitle(title: string) {
      this.title = title
    },
    async getMenu() {
      const { token } = useAuth()
      const menus = await $fetch('/api/master/menus', {
        query: {
          is_parent: true,
        },
        headers: {
          authorization: token.value || '',
        },
        onRequest: () => {
          this.isLoadingMenu = true
        },
      })
      setTimeout(() => {
        this.isLoadingMenu = false
      }, 500)
      this.menus = menus.data as unknown as Array<MenuInterface>
    },
  },
})
