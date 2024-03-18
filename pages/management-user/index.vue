<template>
  <div>
    <!-- Table -->
    <DataTable
      @reloadTable="reloadTable"
      :is_loading="isLoading"
      is_search_enable
      :columns="columns"
      :data="data"
      :pagination="pagination"
    >
      <!-- Index -->
      <template v-slot:no="{ data }">
        {{ data + 1 }}
      </template>

      <!-- Role -->
      <template v-slot:role="{ data }">
        <div v-if="data == 1" class="badge badge-primary p-3">Super Admin</div>
        <div v-if="data == 2" class="badge badge-primary p-3">Pemilik Toko</div>
        <div v-if="data == 3" class="badge badge-primary p-3">Kasir</div>
      </template>

      <!-- Action -->
      <template v-slot:action="{ item }">
        <div class="flex justify-center gap-2">
          <button
            @click="edit(item.id)"
            data-tip="Edit"
            class="btn btn-info btn-xs tooltip text-white"
          >
            <Icon name="ic:baseline-edit" />
          </button>
          <button
            data-tip="Hapus"
            class="btn btn-error btn-xs tooltip text-white"
          >
            <Icon name="ic:baseline-delete" />
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Modal Edit -->
    <input v-model="showModalEdit" type="checkbox" id="modal_edit" class="modal-toggle" />
    <div class="modal" role="dialog">
      <div class="modal-box max-w-3xl">
        <form method="dialog">
          <button
            @click="showModalEdit = false"
            class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <!-- Title -->
        <h3 class="text-2xl font-bold">Edit {{ pageTitle }}</h3>
        <form @submit.prevent="submit" class="py-5">
          <!-- Content -->
          <formEdit v-if="showModalEdit" />
          <!-- Action -->
          <div class="modal-action">
            <button
              :disabled="state.isShow || isLoadingAction"
              class="btn btn-primary btn-md"
            >
              <div v-if="isLoadingAction" class="flex">
                <span class="loading loading-dots loading-xs mx-2"></span>
                <span class="self-center">Loading</span>
              </div>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/stores/management-user/user'
import DataTable from '~/components/datatable.vue'
import formEdit from '~/components/_pages/management-user/user/form-edit.vue'
import { toast } from 'vue3-toastify'

const state = useUserStore()

const pageTitle = ref('User')
const showModalEdit = ref(false)
const isLoadingAction = ref(false)
const columns = ref([
  {
    slotName: 'no',
    label: 'No',
    class: ['text-center'],
  },
  {
    db: 'fullName',
    label: 'Nama',
    class: ['text-center'],
  },
  {
    db: 'email',
    label: 'Email',
    class: ['text-center'],
  },
  {
    slotName: 'role',
    db: 'roleId',
    label: 'Role',
    class: ['text-center'],
  },
  {
    slotName: 'action',
    label: 'Aksi',
    db: 'action',
    class: ['text-center'],
    sortable: false,
  },
])
const data = computed(() => {
  return state.collection
})
const isLoading = computed(() => {
  return state.isLoading
})
const pagination = computed(() => {
  return state.pagination
})

onMounted(async () => {
  await state.load()
})

const reloadTable = async (keyword: string) => {
  state.tableParams.q = keyword
  await state.load()
}
const hideModal = () => {
  showModalEdit.value = false
}
const edit = (id: number) => {
  showModalEdit.value = true
  state.show(id)
}
const submit = () => {
  const formData = new FormData()
  formData.append('fullName', state.form.fullName)
  formData.append('email', state.form.email)
  formData.append('file', state.form.file || '')
  formData.append('roleId', state.form.roleId.toString())
  isLoadingAction.value = true
  state.store(formData).then((res) => {
    isLoadingAction.value = false
    if (res == undefined) {
      toast.error('Gagal disimpan')
    } else {
      toast.success('Berhasil disimpan')
      hideModal()
    }
  })
}
</script>
