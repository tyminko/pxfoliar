import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Shared schemas
const imageSchema = z.object({
  src: z.string().editor({ input: 'media' }),
  // Computed fields are optional so drafts without transforms still validate
  width: z.number().editor({ hidden: true }).optional(),
  height: z.number().editor({ hidden: true }).optional(),
  aspectRatio: z.number().editor({ hidden: true }).optional(),
  // Accept palette as a comma string or array (Studio may write [])
  palette: z.union([z.string(), z.array(z.string())]).optional().editor({ hidden: true }),
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
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
      }),
    }),
  },
})
