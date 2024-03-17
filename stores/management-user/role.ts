import { defineStore } from 'pinia'

interface roleInterface {
  id: number
  code: string
  name: string
  description: string
}

export const useRoleStore = defineStore({
  id: 'roleStore',
  state: () => ({
    isLoading: false,
    collectionList: [
      {
        id: 0,
        code: '',
        name: '',
        description: '',
      },
    ],
  }),
  getters: {
    getCollectionList(): Array<roleInterface> {
      return this.collectionList
    },
  },
  actions: {
    async loadList() {
      const { token } = useAuth()
      const res: { [key: string]: any } = await $fetch(
        '/api/management-users/roles',
        {
          headers: {
            authorization: token.value || '',
          },
          onRequest: () => {
            this.isLoading = true
          },
        }
      )
      this.isLoading = false
      this.collectionList = res.data as Array<roleInterface>
    },
  },
})
