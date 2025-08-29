// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon'
  ],
  content: {
    preview: {
      api: 'https://api.nuxt.studio',
    }
  },

  // GitHub Pages configuration
  nitro: {
    preset: 'github_pages'
  },

  // Ensure static generation
  ssr: true,

  // Output configuration for GitHub Pages
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/' : '/'
  }
})