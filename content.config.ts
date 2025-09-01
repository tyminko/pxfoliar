import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        draft: z.boolean().default(false).optional(),
        year: z.string().optional(),
        image: z.object({
          src: z.string().editor({ input: 'media' }).optional(),
          alt: z.string().optional(),
        }),
        slug: z.string().editor({ hidden: true }),
        credits: z.array(z.object({
          role: z.string().default('author').optional(),
          name: z.string().default('Andrei Dureika').optional(),
        })),
      }),
    }),
  },
})
