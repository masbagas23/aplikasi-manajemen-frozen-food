<template>
  <div>
    <Sidebar>
      <slot />
    </Sidebar>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Sidebar from '~/components/sidebar.vue'
import Footer from '~/components/footer.vue'

const state = useLayoutStore()

onMounted(async () => {
  await state.getMenu()
})
</script>
