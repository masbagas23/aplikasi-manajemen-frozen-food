<template>
  <div>
    <div v-for="i in 7" :key="i" class="flex items-center gap-4 mb-3">
      <div class="skeleton h-8 w-1/5"></div>
      <div class="skeleton h-8 w-1/5"></div>
      <div class="skeleton h-8 w-1/5"></div>
      <div class="skeleton h-8 w-1/5"></div>
      <div class="skeleton h-8 w-1/5"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  totalRow: String,
})
</script>
