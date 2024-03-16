<template>
  <p class="px-4 pt-4 font-medium capitalize text-gray-900">{{ menu?.name }}</p>
  <ul>
    <li v-for="(item, index) in menu?.children" :key="index + 'subChildren'">
      <a
        :class="state.getSelectedMenu == item.url ? 'bg-yellow-200' : ''"
        class="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-gray-900 transition duration-500 ease-in-out hover:cursor-pointer hover:bg-gray-200"
        @click="navigateTo(item.url)"
      >
        <Icon :name="item.icon || ''" />
        <span class="ml-4 capitalize">{{ item.name }}</span>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps({
  menu: Object,
})
const state = useLayoutStore()

// function navigate(url: string, name: string) {
//   state.setTitle(name)
//   const title = setTitleApp(name)
//   useHead({
//     titleTemplate: title,
//   })
//   navigateTo(url)
// }
</script>

<style></style>
