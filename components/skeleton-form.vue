<template>
  <div
    :class="`grid grid-cols-${totalCol} gap-3 mb-5`"
    v-for="i in totalRow"
    :key="i + 'totalRow'"
  >
    <div
      v-for="i in totalCol"
      :key="i + 'totalRow'"
      :class="`grid w-full grid-cols-1 gap-3`"
    >
      <div class="skeleton h-4 w-1/2"></div>
      <div class="skeleton h-8 w-full"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  totalRow: {
    type: Number,
  },
  totalCol: {
    type: Number,
  },
})
</script>
