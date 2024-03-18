export default defineAppConfig({
    title: process.env.NUXT_APP_NAME || 'Frozen Food Store',
    theme: {
        dark: true,
        colors: {
            primary: '#ff0000'
        }
    },
    uploadDir: 'public/upload'
})