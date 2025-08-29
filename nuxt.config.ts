// https://nuxt.com/docs/api/configuration/nuxt-config
import type { FileAfterParseHook } from '@nuxt/content'
import { ContentAfterParseTransform } from './scripts/md-after-parse-transform'

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
  hooks: {
    async 'content:file:afterParse'(ctx: FileAfterParseHook) {
      await ContentAfterParseTransform(ctx)
    }
  }
})
