import { defineCollection, z } from '@nuxt/content'

// Shared schemas
const imageSchema = z.object({
  src: z.string().default('').editor({ input: 'media' }),
  width: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.number().optional(),
  palette: z.string(),
})

const creditSchema = z.object({
  role: z.string().default('author'),
  name: z.string().default('Andrei Dureika'),
})

const baseEntrySchema = {
  title: z.string(),
  draft: z.boolean().default(false).optional(),
  description: z.string().optional(),
  image: imageSchema.optional(),
  credits: z.array(creditSchema).optional(),
}

export const collections = {
  projects: defineCollection({
    type: 'page',
    source: 'projects/*.md',
    schema: z.object({
      year: z.string().optional(),
      ...baseEntrySchema,
    }),
  }),
  events: defineCollection({
    type: 'page',
    source: 'events/*.md',
    schema: z.object({
      startDate: z.date(),
      endDate: z.date().optional(),
      ...baseEntrySchema,
    }),
  }),
}
// .editor({ hidden: true })
// export default defineContentConfig({
// })
