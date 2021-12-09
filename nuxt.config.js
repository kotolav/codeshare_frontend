require('dotenv').config()

export default {
   // Target: https://go.nuxtjs.dev/config-target
   target: 'server',
   server: {
      timing: true,
   },

   env: {
      baseUrl: 'http://localhost:3000',
      apiServer: 'http://codeshare.local/api',
   },

   googleFonts: {
      display: 'swap',
      preload: true,
      families: {
         Roboto: [300, 400, 700],
         Lato: [400, 700],
      },
   },

   // Global page headers: https://go.nuxtjs.dev/config-head
   head: {
      title: 'CodeShare',
      htmlAttrs: {
         lang: 'en',
      },
      meta: [
         { charset: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1' },
         {
            hid: 'description',
            name: 'description',
            content: 'CodeShare - делитесь своим кодом с другими!',
         },
         { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
   },

   // Global CSS: https://go.nuxtjs.dev/config-css
   css: [
      '~assets/scss/main.scss',
      '~node_modules/vue-multiselect/dist/vue-multiselect.min.css',
   ],

   styleResources: {
      scss: ['@/assets/scss/variables.scss', '@/assets/scss/mixins.scss'],
   },

   // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
   plugins: [
      '~/plugins/axios.ts',
      '~/plugins/languageNameFormatter.ts',
      '~/plugins/dateDiffHuman.ts',
      '~/plugins/textareaAutosize.js',
      '~/plugins/multiselect.js',
   ],

   // Auto import components: https://go.nuxtjs.dev/config-components
   components: true,

   // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
   buildModules: [
      // https://go.nuxtjs.dev/typescript
      '@nuxt/typescript-build',
      '@nuxtjs/composition-api/module',
      '@nuxtjs/google-fonts',
   ],

   // Modules: https://go.nuxtjs.dev/config-modules
   modules: [
      // https://go.nuxtjs.dev/axios

      '@nuxtjs/axios',
      '@nuxtjs/style-resources',
      '@nuxtjs/dayjs',
      'cookie-universal-nuxt',
   ],

   dayjs: {
      locales: ['en', 'ru'],
      defaultLocale: 'ru',
      defaultTimeZone: 'Europe/Moscow',
      plugins: [
         'utc', // import 'dayjs/plugin/utc'
         'timezone', // import 'dayjs/plugin/timezone'
         'relativeTime',
      ],
   },

   loading: {
      color: '#71d3ff',
   },

   // Axios module configuration: https://go.nuxtjs.dev/config-axios
   axios: {},

   // Build Configuration: https://go.nuxtjs.dev/config-build
   build: {},
}
