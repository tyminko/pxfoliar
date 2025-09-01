import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        draft: z.boolean().default(false),
        year: z.string(),
        image: z.object({
          src: z.string().editor({ input: 'media' }),
          alt: z.string(),
        }),
        slug: z.string().editor({ hidden: true }),
        credits: z.array(z.object({
          role: z.string().default('author'),
          name: z.string().default('Andrei Dureika'),
        })),
      }),
    }),
  },
})
