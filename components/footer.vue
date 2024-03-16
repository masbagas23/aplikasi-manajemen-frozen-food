<template>
  <footer class="bg-white" aria-labelledby="footer-heading">
    <div class="px-4 py-5 mx-auto bg-yellow-300 max-w-full sm:px-6 lg:px-16">
      <div class="flex flex-wrap items-baseline lg:justify-center">
        <span class="mt-2 text-sm font-medium text-gray-500">
          Copyright © {{ new Date().getFullYear() }}
          <a href="https://wickedlabs.dev" class="text-wickedblue hover:text-gray-500" rel="noopener noreferrer"> {{
            config.public.app_name }}</a>
        </span>
      </div>
    </div>
  </footer>

</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
</script>

<style></style>