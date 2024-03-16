<template>
  <data-table
    @search="searchUser"
    :is-loading="isLoading"
    is_search_enable
    :columns="columns"
    :data="data"
  >
    <template v-slot:no="{ data }">
      {{ data + 1 }}
    </template>
    
    <template v-slot:role="{ data }">
      <div v-if="data == 1" class="badge badge-accent">Super Admin</div>
    </template>
  </data-table>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/stores/management-user/user'
import DataTable from '~/components/datatable.vue'

const state = useUserStore()
const columns = ref([
  {
    slotName: 'no',
    label: 'No',
    class:['text-center']
  },
  {
    db: 'fullName',
    label: 'Nama',
    class:['text-center']
  },
  {
    db: 'email',
    label: 'Email',
    class:['text-center']
  },
  {
    slotName: 'role',
    db: 'roleId',
    label: 'Role',
    class:['text-center']
  },
])
const data = computed(() => {
  return state.collection
})
const isLoading = computed(() => {
  return state.isLoadingUser
})

const searchUser = async (keyword: string) => {
  state.tableParams.q = keyword
  await state.load()
}

onMounted(async () => {
  await state.load()
})
</script>
