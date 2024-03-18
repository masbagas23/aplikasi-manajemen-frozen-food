import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import { string } from 'zod'

interface IFormUser {
  fullName: string
  email: string
  avaUrl: string
  roleId: number
  file: null | File
  updatedAt: null | Date
}

interface IUserStore {
  isLoading: boolean
  isShow: boolean
  collection: Array<Object>
  pagination: Object
  tableParams: { [key: string]: any }
  form: IFormUser
  errors: null | { [key: string]: any }
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): IUserStore => ({
    form: {
      fullName: '',
      email: '',
      avaUrl: '',
      roleId: 0,
      updatedAt: null,
      file: null,
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
    errors: null,
  }),
  actions: {
    resetForm() {
      this.form = {
        fullName: '',
        email: '',
        avaUrl: '',
        roleId: 0,
        updatedAt: null,
        file: null,
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
    async store(form: FormData) {
      this.errors = null

      const { token } = useAuth()
      const res = await $fetch('/api/management-users', {
        method: 'POST',
        headers: {
          authorization: token.value || '',
        },
        body: form,
      }).catch((err) => {
        this.errors = JSON.parse(err.statusMessage)
      })
      this.load()
      return res
    },
  },
})
