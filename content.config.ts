import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Shared schemas
const imageSchema = z.object({
  src: z.string().editor({ input: 'media' }),
  width: z.number().editor({ hidden: true }),
  height: z.number().editor({ hidden: true }),
  aspectRatio: z.number().editor({ hidden: true }),
  palette: z.string().editor({ hidden: true }),
})

const creditSchema = z.object({
  role: z.string().default('author'),
  name: z.string().default('Andrei Dureika'),
})

const baseEntrySchema = z.object({
  title: z.string(),
  draft: z.boolean().default(false).optional(),
  image: imageSchema.optional(),
  credits: z.array(creditSchema).optional(),
})

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: baseEntrySchema.extend({
        year: z.string().optional(),
      }),
    }),

    events: defineCollection({
      type: 'page',
      source: 'events/*.md',
      schema: baseEntrySchema.extend({
        startDate: z.date(),
        endDate: z.date().optional(),
      }),
    }),
  },
})
