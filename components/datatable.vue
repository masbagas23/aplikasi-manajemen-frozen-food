<script setup>
import axios from 'axios'
import SkeletonTable from '~/components/skeleton-table.vue'

const emits = defineEmits(['search'])

const props = defineProps({
  columns: { type: [Array, Object], default: () => [] },
  data: { type: Array, default: () => [] },
  allowedItemsPerPage: { type: Array, default: [5, 10, 20, 50, 100] },
  is_ssp_mode: { type: Boolean, default: false },
  url: { type: String, default: null },
  is_search_enable: { type: Boolean, default: false },
  is_count_enable: { type: Boolean, default: true },
  defaultItemsPerPage: { type: Number, default: null },
  defaultSortBy: { type: [String, Number], default: null },
  defaultSortDesc: { type: Boolean, default: false },
  is_fetch_on_init: { type: Boolean, default: true },
  is_loading: { type: Boolean, default: true },
})

const ajaxData = ref(null)

const currentPage = ref(1)
const totalItemCount = ref(null)
const totalFilteredItemCount = ref(null)
const itemsPerPage = ref(null)
const sort = reactive({ by: null, desc: false })
const search = ref('')
const extraParams = ref({})
const is_loading = ref(true)
const is_fetching = ref(false)
const is_failed = ref(false)
const is_initiated = ref(false)

watch(
  () => props.is_loading,
  (newValue, oldValue) => {
    is_loading.value = newValue
    console.log(newValue)
  }
)

const currentItemPosition = computed(() => {
  let cip = { start: 1, end: 1 }

  if (props.is_ssp_mode) {
    if (ajaxData.value !== null) {
      cip.start = ajaxData.value.data.current_item_position_start
      cip.end = ajaxData.value.data.current_item_position_end
    }
  } else {
    if (itemsPerPage.value > 0) {
      cip.start = (currentPage.value - 1) * itemsPerPage.value + 1
      cip.start = cip.start < 0 ? 0 : cip.start
      cip.end = currentPage.value * itemsPerPage.value
      if (cip.end > totalFilteredItemCount.value)
        cip.end = totalFilteredItemCount.value
    } else {
      cip.end = totalFilteredItemCount.value
    }
  }

  return cip
})

const columnsFinal = computed(() => {
  let newColumns = []
  for (let i in props.columns) {
    let c = props.columns[i]

    if (typeof c !== 'object') {
      newColumns.push({ label: c, db: i, sortable: true, class: [] })
    } else {
      if (typeof c.sortable === 'undefined') c.sortable = true
      if (typeof c.class === 'undefined') c.class = []
      newColumns.push(c)
    }
  }
  return newColumns
})

const dataFinal = computed(() => {
  let dt = []

  if (props.is_ssp_mode) {
    if (ajaxData.value !== null) {
      dt = ajaxData.value.data.items
    }
  } else {
    dt = props.data.sort((a, b) => {
      const by = sortFinal.value.by

      if (sortFinal.value.desc)
        return a[by] < b[by] ? 1 : b[by] < a[by] ? -1 : 0
      return a[by] > b[by] ? 1 : b[by] > a[by] ? -1 : 0
    })

    // if (search.value.length > 0)
    //   dt = dt.filter((item) => {
    //     for (let key in item) {
    //       if (
    //         item[key]
    //           .toString()
    //           .toLowerCase()
    //           .search(search.value.toLowerCase()) >= 0
    //       )
    //         return true
    //     }
    //     return false
    //   })
  }

  return dt
})

const sortFinal = computed(() => {
  let s = {
    by: props.defaultSortBy,
    desc: props.defaultSortDesc,
  }

  if (typeof sort.by === 'string') {
    if (columnsFinal.value.some((e) => e.db === sort.by)) {
      s.by = sort.by
      s.desc = sort.desc
    }
  } else {
    if (s.by === null) s.by = columnsFinal.value[0].db
  }

  return s
})

const maxPage = computed(() =>
  itemsPerPage.value == -1
    ? 1
    : totalFilteredItemCount.value == null
      ? 1
      : Math.ceil(totalFilteredItemCount.value / itemsPerPage.value)
)

const canPrevPage = computed(() => {
  return currentPage.value > 1
})

const canNextPage = computed(() => {
  if (props.is_ssp_mode) {
    return (
      currentPage.value < maxPage.value ||
      (!props.is_count_enable && dataFinal.value.length >= itemsPerPage.value)
    )
  } else {
    return currentPage.value < maxPage.value
  }
})

const changePage = function (changeValue) {
  if (is_loading.value) return false

  if (changeValue < 0) {
    if (!canPrevPage.value) return false
  } else if (changeValue > 0) {
    if (!canNextPage.value) return false
  }

  currentPage.value = currentPage.value + changeValue

  reload()
}

const reload = function () {
  if (props.is_ssp_mode) {
    fetchData()
  }
}

const fetchData = function (options = {}) {
  if (!props.is_ssp_mode) return false
  if (is_fetching.value) return false
  if (typeof props.url !== 'string') throw new Error('`url` is required.')

  is_loading.value = true
  is_fetching.value = true
  is_failed.value = false

  let params = getParams()

  if (typeof options.params !== 'undefined') {
    params = { ...params, ...options.params }
  }

  axios
    .get(props.url, {
      params,
    })
    .then((response) => {
      ajaxData.value = response.data
      totalItemCount.value = response.data.data.total_item_count ?? 0
      totalFilteredItemCount.value =
        response.data.data.total_filtered_item_count ?? 0
      if (typeof options.success === 'function') options.success(response)
    })
    .catch((e) => {
      console.log(e)
      is_failed.value = true
    })
    .then(() => {
      is_loading.value = false
      is_fetching.value = false
    })
}

const sorting = function (db_name) {
  let the_column = columnsFinal.value.find((e) => e.db == db_name)
  if (the_column === undefined) return false
  if (!the_column.sortable) return false

  if (sortFinal.value.by == db_name) sort.desc = !sort.desc
  else sort.desc = false

  sort.by = db_name

  return true
}

const setParams = function (params) {
  extraParams.value = params
}

const getParams = function (override = null, is_return_url_params = false) {
  let params = {
    page: currentPage.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortFinal.value.by,
    sortDesc: sortFinal.value.desc ? 'true' : 'false',
  }

  // if (search.value.length > 0) params.search = search.value

  params = { ...params, ...extraParams.value }

  if (typeof override === 'function') {
    params = override(params)
  }

  if (is_return_url_params) {
    let url_params = {}
    for (let key in params) {
      let v = params[key]
      if (Array.isArray(v)) {
        for (let i in v) {
          url_params[`${key}[${i}]`] = v[i]
        }
      } else {
        url_params[key] = v
      }
    }

    return new URLSearchParams(url_params).toString()
  }

  return params
}

watch(itemsPerPage, () => {
  if (!is_initiated.value) return

  if (currentPage.value > maxPage.value) currentPage.value = maxPage.value
  reload()
})

watch(sort, () => {
  if (!is_initiated.value) return

  reload()
})

let searchTimeout = null
watch(search, () => {
  if (props.is_ssp_mode) {
    is_loading.value = true

    if (searchTimeout !== null) clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
      currentPage.value = 1
      fetchData(() => {
        searchTimeout = null
      })
    }, 800)
  } else {
    // currentPage.value = 1
    // totalFilteredItemCount.value = dataFinal.value.length
    emits('search', search.value)
  }
})

onMounted(async () => {
  if (itemsPerPage.value === null)
    itemsPerPage.value =
      props.defaultItemsPerPage ??
      (Array.isArray(props.allowedItemsPerPage)
        ? props.allowedItemsPerPage[0] ?? 10
        : 10)
  sort.desc = sortFinal.value.desc
  sort.by = sortFinal.value.by

  if (props.is_ssp_mode) {
    if (props.is_fetch_on_init) fetchData()
  } else {
    is_loading.value = false
    totalItemCount.value = totalFilteredItemCount.value = props.data.length
  }

  await nextTick()

  is_initiated.value = true
})

defineExpose({
  fetchData,
  setParams,
  getParams,
})
</script>

<template>
  <div>
    <div
      v-if="allowedItemsPerPage !== null || is_search_enable"
      class="mb-3 block md:flex md:flex-1 md:items-center md:justify-between"
    >
      <div
        v-if="allowedItemsPerPage !== null"
        class="mb-2 text-center text-xs md:mb-0 md:text-left"
      >
        <select
          v-model="itemsPerPage"
          class="select select-bordered select-sm mr-2 max-w-xs rounded-md"
        >
          <option
            v-for="(item, index) in allowedItemsPerPage"
            :value="item"
            :key="index"
          >
            <template v-if="item == -1"> All </template>
            <template v-else>
              {{ item }}
            </template>
          </option>
        </select>
        <span class="text-gray-600">Items Per Page</span>
      </div>
      <div v-if="is_search_enable">
        <label class="input input-sm input-bordered flex items-center gap-2">
          <input
            v-model.lazy="search"
            @keyup.enter="reload()"
            type="text"
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </label>
      </div>
    </div>
    <SkeletonTable totalRow="5" v-if="is_loading" />
    <div
      v-else
      class="mb-3 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
    >
      <table
        class="max-h-screen min-w-full border-collapse divide-y divide-gray-300 overflow-x-auto"
      >
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="item in columnsFinal"
              :key="item.db"
              scope="col"
              class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
              :class="{ 'cursor-pointer': item.sortable }"
              @click="sorting(item.db)"
            >
              <span v-if="sortFinal.by == item.db" class="mr-1">
                <svg
                  v-if="sortFinal.desc === false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="inline-block h-4 w-4 text-gray-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm14.47 3.97a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06L18 10.81V21a.75.75 0 01-1.5 0V10.81l-2.47 2.47a.75.75 0 11-1.06-1.06l3.75-3.75zM2.25 9A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm0 4.5a.75.75 0 01.75-.75h5.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="inline-block h-4 w-4 text-gray-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm15-.75A.75.75 0 0118 9v10.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V9a.75.75 0 01.75-.75zm-15 5.25a.75.75 0 01.75-.75h9.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ item.label }}
            </th>
          </tr>
        </thead>
        <tbody class="relative divide-y divide-gray-200 bg-white">
          <template v-if="is_failed">
            <tr>
              <td
                class="bg-red-50/80 px-2 py-6 text-center text-red-400"
                :colspan="columnsFinal.length"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="inline-block h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                Failed to load
              </td>
            </tr>
          </template>
          <template v-else-if="dataFinal.length <= 0">
            <tr>
              <td
                class="px-2 py-6 text-center text-gray-500"
                :colspan="columnsFinal.length"
              >
                No data
              </td>
            </tr>
          </template>
          <template v-else>
            <template v-for="(e_data, index) in dataFinal" :key="index">
              <tr
                v-if="
                  is_ssp_mode ||
                  (index + 1 >= currentItemPosition.start &&
                    index < currentItemPosition.end)
                "
              >
                <td
                  v-for="(e_col, index2) in columnsFinal"
                  class="whitespace-nowrap px-3 py-4 align-middle text-sm text-gray-500"
                  :class="e_col.class"
                  :key="index2"
                >
                  <template
                    v-if="
                      typeof e_data[e_col.db] === 'object' &&
                      !(
                        Array.isArray(e_data[e_col.db]) ||
                        e_data[e_col.db] === null
                      )
                    "
                  >
                    <slot
                      :name="e_data[e_col.db].slotName"
                      :data="e_data[e_col.db]"
                    ></slot>
                  </template>
                  <template v-else-if="Array.isArray(e_data[e_col.db])">
                    <template v-for="slot in e_data[e_col.db]">
                      <slot :name="slot.slotName" :data="slot"></slot>
                    </template>
                  </template>
                  <template
                    v-else-if="
                      e_data[e_col.db]?.toString().substring(0, 5) === 'html:'
                    "
                  >
                    <span v-html="e_data[e_col.db].substring(5)"></span>
                  </template>
                  <template v-else-if="e_col.slotName">
                    <slot
                      :name="e_col.slotName"
                      :data="e_col.slotName == 'no' ? index : e_data[e_col.db]"
                    ></slot>
                    <!-- {{ e_data[e_col.db] }} -->
                  </template>
                  <template v-else>
                    {{ e_data[e_col.db] }}
                  </template>
                </td>
              </tr>
            </template>
          </template>
          <div
            v-if="is_loading"
            class="absolute inset-0 flex items-center justify-center bg-gray-100/70"
          >
            <svg
              class="-ml-1 mr-3 inline-block h-5 w-5 animate-spin text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </tbody>
      </table>
    </div>
    <div
      class="block text-center md:flex md:flex-1 md:items-center md:justify-between md:text-left"
    >
      <div class="mb-2 hidden min-[420px]:block md:mb-0">
        <p v-if="is_count_enable" class="text-xs text-gray-700 lg:text-sm">
          Showing
          <span class="font-medium">{{ currentItemPosition.start }}</span> to
          <span class="font-medium">{{ currentItemPosition.end }}</span> of
          <span class="font-medium">{{ totalFilteredItemCount }}</span> results
          <span v-if="totalFilteredItemCount !== totalItemCount"
            >(filtered from
            <span class="font-medium">{{ totalItemCount }}</span> items)</span
          >
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <a
            @click="changePage(-1)"
            href="javascript:void(0);"
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
            :class="{ 'cursor-default opacity-40': !canPrevPage || is_loading }"
          >
            <span class="sr-only">Previous</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <span>
            <template v-if="is_count_enable">
              <select
                v-model="currentPage"
                @change="reload()"
                class="relative inline-flex cursor-pointer appearance-none items-center border border-gray-300 bg-white bg-none px-4 py-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                :disabled="dataFinal.length <= 0 || is_loading"
              >
                <template v-for="n in maxPage" :key="n">
                  <option :value="n">{{ n }}</option>
                </template>
              </select>
            </template>
            <template v-else>
              <input
                type="number"
                v-model="currentPage"
                @change="reload()"
                class="relative inline-flex w-20 cursor-pointer appearance-none items-center border border-gray-300 bg-white bg-none px-4 py-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              />
            </template>
          </span>
          <a
            @click="changePage(+1)"
            href="javascript:void(0);"
            class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
            :class="{ 'cursor-default opacity-40': !canNextPage || is_loading }"
          >
            <span class="sr-only">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
