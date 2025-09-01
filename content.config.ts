import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string().optional(),
        draft: z.boolean().default(false).optional(),
        year: z.string().optional(),
      }),
    }),
  },
})
