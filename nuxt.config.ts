// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxt/image',
    'nuxt-icon',
    '@pinia/nuxt',
    'nuxt-lodash',
  ],
  lodash: {
    prefix: '_',
  },
  auth: {
    globalAppMiddleware: {
      isEnabled: true,
    },
    provider: {
      type: 'local',
    },
    session: {
      // Whether to refresh the session every time the browser window is refocused.
      enableRefreshOnWindowFocus: false,

      // Whether to refresh the session every `X` milliseconds. Set this to `false` to turn it off. The session will only be refreshed if a session already exists.
      enableRefreshPeriodically: false,
    },
  },
  devtools: { enabled: false },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api',
      app_name: process.env.NUXT_APP_NAME || 'Frozen Food Store',
      jwt_key: process.env.NUXT_JWT_KEY || '1234567890qwertyuiop',
    },
  },
  typescript: {
    typeCheck: true,
  },
  pages: true,
})
