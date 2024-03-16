<template>
  <ul>
    <li>
      <a
        :class="isSelected ? 'bg-yellow-200' : ''"
        class="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-gray-900 transition duration-500 ease-in-out hover:cursor-pointer hover:bg-gray-200"
        @click="navigateTo(menu?.url)"
      >
        <Icon :name="menu?.icon || ''" />
        <span class="ml-4 capitalize">{{ menu?.name }}</span>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps({
  menu: Object,
})
const state = useLayoutStore()
const isSelected = computed(() => {
  return state.getSelectedMenu == props.menu?.url
})

// function navigate() {
//   state.setTitle(props.menu?.name)
//   const title = setTitleApp(props.menu?.name)
//   useHead({
//     titleTemplate: title,
//   })
//   navigateTo(props.menu?.url)
// }
</script>

<style></style>
