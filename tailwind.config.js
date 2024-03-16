/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './node_modules/vue-tailwind-datatable/src/**/*.vue',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['pastel'],
  },
  plugins: [require('daisyui')],
}
