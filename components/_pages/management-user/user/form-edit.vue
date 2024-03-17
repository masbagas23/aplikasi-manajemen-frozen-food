<template>
  <skeletonForm :totalRow="2" :totalCol="2" v-if="userState.isShow" />
  <div v-else class="grid grid-cols-2 gap-2">
    <!-- Full Name -->
    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Nama Lengkap</span>
        </div>
        <input
          v-model="userState.form.fullName"
          type="text"
          placeholder="Nama Lengkap"
          class="input input-bordered w-full"
        />
      </label>
    </div>
    <!-- Email -->
    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <input
          v-model="userState.form.email"
          type="email"
          placeholder="Email"
          class="input input-bordered w-full"
        />
      </label>
    </div>
    <!-- Role -->
    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Role</span>
        </div>
        <select class="select select-bordered" v-model="userState.form.roleId">
          <option disabled selected value="0">Pilih</option>
          <option
            :key="index + 'rolelist'"
            v-for="(item, index) in roleCollections"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </label>
    </div>
    <!-- Ava -->
    <div class="self-center">
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Foto Profil</span>
        </div>
        <input
          type="file"
          class="file-input file-input-bordered file-input-primary file-input-sm w-full"
        />
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoleStore } from '~/stores/management-user/role'
import { useUserStore } from '~/stores/management-user/user'
import skeletonForm from '~/components/skeleton-form.vue'

const roleState = useRoleStore()
const userState = useUserStore()

const isLoadingRole = computed(() => {
  return roleState.isLoading
})
const roleCollections = computed(() => {
  return roleState.getCollectionList
})

onMounted(async () => {
  await roleState.loadList()
})

onUnmounted(() => {
  userState.resetForm
})
</script>
<style></style>
