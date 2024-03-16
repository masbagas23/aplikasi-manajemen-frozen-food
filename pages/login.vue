<template>
  <div>
    <!-- Card -->
    <section>
      <div
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-12 lg:px-24 lg:py-24"
      >
        <div
          class="mx-auto transform justify-center rounded-lg bg-white text-left align-bottom transition-all sm:w-full sm:max-w-2xl sm:align-middle"
        >
          <div
            class="mx-auto grid grid-cols-1 flex-wrap items-center justify-center rounded-xl shadow-xl lg:grid-cols-2"
          >
            <!-- Right Side -->
            <div class="w-full px-5 py-3">
              <div>
                <div class="mt-3 text-left sm:mt-5">
                  <div class="inline-flex w-full items-center">
                    <h3
                      class="l eading-6 text-2xl font-bold text-neutral-600 lg:text-5xl"
                    >
                      Masuk
                    </h3>
                  </div>
                  <div class="mt-4 text-base text-gray-500">
                    <p>Silahkan gunakan akun yang telah terdaftar.</p>
                  </div>
                </div>
              </div>
              <!-- Form -->
              <form @submit.prevent="loginPost()">
                <div class="mt-6 space-y-4">
                  <!-- Email -->
                  <div>
                    <label for="email" class="sr-only">Email</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      required
                      v-model="email"
                      class="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="admin@faugetfrozenfood.com"
                    />
                  </div>
                  <!-- Password -->
                  <div>
                    <label for="password" class="sr-only">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      v-model="password"
                      class="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="************"
                    />
                  </div>
                  <div class="mt-4 flex flex-col lg:space-y-2">
                    <!-- Button -->
                    <button
                      type="submit"
                      class="flex w-full transform items-center justify-center rounded-xl bg-yellow-300 px-10 py-4 text-center text-base font-medium transition duration-500 ease-in-out hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      Masuk
                    </button>
                    <!-- Forgot Link -->
                    <a
                      href="#"
                      type="button"
                      class="inline-flex justify-center pt-4 text-base font-medium text-gray-500 hover:text-neutral-600 focus:text-yellow-600 focus:outline-none sm:text-sm"
                    >
                      Forgot your Password?
                    </a>
                  </div>
                </div>
              </form>
            </div>

            <!-- Left Side -->
            <div class="order-first flex w-full justify-center lg:block">
              <NuxtImg fit="fill" src="/img/banner-1.jpg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard',
  },
})
useHead({
  title: 'login',
})

const { signIn, token, data, status, lastRefreshedAt, signOut, getSession } =
  useAuth()
const email = ref('')
const password = ref('')

function loginPost() {
  signIn(
    { email: email.value, password: password.value },
    { callbackUrl: '/dashboard' }
  )
}
</script>
