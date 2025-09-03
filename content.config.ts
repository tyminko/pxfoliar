import { defineCollection, z } from '@nuxt/content'

// Shared schemas
const imageSchema = z.object({
  src: z.string().editor({ input: 'media' }),
  width: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.number().optional(),
  palette: z.string().optional(),
})

const creditSchema = z.object({
  role: z.string().default('author'),
  name: z.string().default('Andrei Dureika'),
})

const baseEntrySchema = z.object({
  title: z.string(),
  draft: z.boolean().default(false).optional(),
  description: z.string().optional(),
  image: imageSchema.optional(),
  credits: z.array(creditSchema).optional(),
})

export const collections = {
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
      startDate: z.string(),
      endDate: z.string().optional(),
    }),
  }),
}
// .editor({ hidden: true })
// export default defineContentConfig({
// })
