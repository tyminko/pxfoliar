// https://nuxt.com/docs/api/configuration/nuxt-config
import type { FileAfterParseHook } from '@nuxt/content'
import { ContentAfterParseTransform } from './scripts/md-after-parse-transform'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: process.env.DEPLOY_TARGET === 'github'
      ? (process.env.GITHUB_PAGES_BASE_PATH || '/')
      : '/',
    head: {
      style: [
        {
          innerHTML: '@layer reset, base, components, utilities;'
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
  // Use default auto-registration; Studio discovery handled via hook below
  components: true,
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
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

  nitro: {
    preset: process.env.DEPLOY_TARGET === 'github' ? 'github_pages' : undefined
  },

  hooks: {
    async 'content:file:afterParse'(ctx: FileAfterParseHook) {
      await ContentAfterParseTransform(ctx)
    },
    'components:extend': (components) => {
      // Ensure Studio indexes custom content components
      const isContentComponent = (c: { filePath?: string }) =>
        (typeof c.filePath === 'string') && (
          c.filePath.includes('/app/components/content/')
        )
      components
        .filter(isContentComponent)
        .forEach((c) => { c.global = true })
    }
  }
})
