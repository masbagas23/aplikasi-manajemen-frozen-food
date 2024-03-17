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
            onclick="modal_edit.showModal()"
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
    <dialog id="modal_edit" class="modal">
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
        <form class="py-5">
          <!-- Content -->
          <formEdit v-if="showModalEdit" />
          <!-- Action -->
          <div class="modal-action">
            <button :disabled="state.isShow" class="btn btn-primary btn-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/stores/management-user/user'
import DataTable from '~/components/datatable.vue'
import formEdit from '~/components/_pages/management-user/user/form-edit.vue'

const state = useUserStore()
const pageTitle = ref('User')
const showModalEdit = ref(false)
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
const reloadTable = async (keyword: string) => {
  state.tableParams.q = keyword
  await state.load()
}

onMounted(async () => {
  await state.load()
})

const edit = (id: number) => {
  showModalEdit.value = true
  state.show(id)
}
</script>
