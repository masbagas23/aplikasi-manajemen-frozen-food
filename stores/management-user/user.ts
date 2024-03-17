import { defineStore } from 'pinia'
import { string } from 'zod'

interface formUser {
  fullName: string
  email: string
  avaUrl: string
  roleId: number
  updatedAt: null | Date
}

interface userStateInterface {
  isLoading: boolean
  isShow: boolean
  collection: Array<Object>
  pagination: Object
  tableParams: { [key: string]: any }
  form: formUser
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): userStateInterface => ({
    form: {
      fullName: '',
      email: '',
      avaUrl: '',
      roleId: 0,
      updatedAt: null,
    },
    isLoading: true,
    isShow: true,
    collection: [{}],
    pagination: {},
    tableParams: {
      limit: 5,
      page: 1,
      col: 'id',
      asc: false,
      q: '',
    },
  }),
  actions: {
    resetForm() {
      this.form = {
        fullName: '',
        email: '',
        avaUrl: '',
        roleId: 0,
        updatedAt: null,
      }
    },
    //
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
            this.isLoading = true
          },
        }
      )
      setTimeout(() => {
        this.isLoading = false
      }, 1500)
      this.collection = res.data.data
      this.pagination = res.data.pagination
    },
    async show(id: number) {
      const { token } = useAuth()
      const res: { [key: string]: any } = await $fetch(
        '/api/management-users/' + id,
        {
          headers: {
            authorization: token.value || '',
          },
          onRequest: () => {
            this.isShow = true
          },
        }
      )
      this.form = res.data
      setTimeout(() => {
        this.isShow = false
      }, 1500)
    },
  },
})
