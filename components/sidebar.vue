<template>
  <div class="flex h-full overflow-hidden rounded-lg bg-white">
    <div class="md:flex md:flex-shrink-0">
      <div
        class="flex min-h-full w-64 flex-col border-r-2 shadow-sm"
        :class="layoutState.sidebarOpened ? '' : 'hidden'"
      >
        <div
          class="flex flex-grow flex-col overflow-y-auto border-r border-gray-50 bg-white"
        >
          <div class="flex flex-shrink-0 flex-col items-center px-4">
            <div class="navbar bg-white">
              <div class="flex flex-1 justify-center">
                <a class="btn btn-ghost text-xl">{{
                  config.public.app_name
                }}</a>
              </div>
            </div>
            <button
              class="focus:shadow-outline hidden rounded-lg focus:outline-none"
            >
              <svg fill="currentColor" viewBox="0 0 20 20" class="h-6 w-6">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div class="mt-5 flex flex-grow flex-col px-4">
            <nav class="flex-1 space-y-1 bg-white">
              <template v-if="!isLoadingMenu" v-for="(menu, index) in menus">
                <menuOptionSingle
                  :menu="menu as unknown as MenuInterface"
                  :key="index + 'single'"
                  v-if="
                    (menu as unknown as MenuInterface).children[0] == undefined
                  "
                />
                <menuOptionChildren
                  :menu="menu as unknown as MenuInterface"
                  :key="index + 'children'"
                  v-else
                />
              </template>
              <div v-else class="space-y-4">
                <div class="skeleton h-10 w-full"></div>
                <div class="skeleton h-10 w-full"></div>
                <div class="skeleton h-10 w-full"></div>
                <div class="skeleton h-10 w-full"></div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-0 flex-1 flex-col overflow-hidden">
      <main class="relative flex-1 overflow-y-auto focus:outline-none">
        <div class="pb-5">
          <Navbar />
          <div class="mx-auto px-4 sm:px-6 md:px-8">
            <!-- Put your content here -->
            <div class="py-4">
              <div class="min-h-screen rounded-lg">
                <!-- Title -->
                <h2 class="text-3xl font-bold capitalize">
                  {{ layoutState.title }}
                </h2>

                <!-- Breadcrumb -->
                <div class="breadcrumbs mb-5 flex w-full justify-end text-sm">
                  <ul>
                    <li
                      v-for="(item, index) in breadcrumbs"
                      :key="index + 'breadcrumb'"
                    >
                      <a class="capitalize">{{ item }}</a>
                    </li>
                    <li
                      class="capitalize"
                      v-show="
                        breadcrumbs[breadcrumbs.length - 1] != layoutState.title
                      "
                    >
                      {{ layoutState.title }}
                    </li>
                  </ul>
                </div>

                <!-- Content -->
                <slot />
              </div>
            </div>
            <!-- Do not cross the closing tag underneath this coment-->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Navbar from './navbar.vue'
import menuOptionChildren from './_sidebar/menu-option-children.vue'
import menuOptionSingle from './_sidebar/menu-option-single.vue'
import type { MenuInterface } from '~/stores/layout'
import { unknown } from 'zod'

// Data
const layoutState = useLayoutStore()
const config = useRuntimeConfig()

// Computed
const menus = computed(() => {
  return layoutState.getMenus
})
const isLoadingMenu = computed(() => {
  return layoutState.getLoadingMenu
})
const breadcrumbs = computed(() => {
  const path = useRoute().path
  const splitter = path.split('/')
  let breadcrumb: string[] = []
  splitter.forEach((e) => {
    breadcrumb.push(e == '' ? 'home' : e.replace('-', ' '))
  })
  return breadcrumb
})
</script>

<style></style>
