import { table } from 'console'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    isLoadingUser: true,
    collection: [{}],
    tableParams: {
      limit: 10,
      page: 0,
      col: 'id',
      asc: false,
      q: '',
    },
  }),
  actions: {
    async load() {
      const { token } = useAuth()
      const res: { [key: string]: any } = await $fetch(
        '/api/management-users',
        {
          query: this.tableParams,
          headers: {
            authorization: token.value || '',
          },
          onRequest: () => {
            this.isLoadingUser = true
          },
          onResponse: () => {
            setTimeout(() => {
              this.isLoadingUser = false
            }, 1500)
          },
        }
      )
      this.collection = res.data.data
    },
  },
})
