// https://nuxt.com/docs/api/configuration/nuxt-config
import type { FileAfterParseHook } from '@nuxt/content'
import { ContentAfterParseTransform } from './scripts/md-after-parse-transform'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      style: [
        {
          innerHTML: '@layer reset, bazuca, components, utilities;'
        }
      ]
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon'
  ],
  css: ['~/assets/css/main.css'],
  content: {
    preview: {
      // api: 'https://api.nuxt.studio'
    }
  },

  image: {
    provider: 'imagekit',
    imagekit: {
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/mxm',
      baseURL: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/mxm'
    },
    presets: {
      default: {
        provider: 'imagekit',
        sizes: 'sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
      }
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
