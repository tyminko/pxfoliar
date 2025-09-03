import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'events/*.md',
      schema: z.object({
        draft: z.boolean().default(false),
        category: z.enum(['Alps', 'Himalaya', 'Pyrenees']).optional(),
        date: z.date(),
        image: z.object({
          src: z.string().editor({ input: 'media' }),
          alt: z.string(),
        }),
        slug: z.string(),
        icon: z.string().optional().editor({ input: 'icon' }),
        authors: z.array(z.object({
          slug: z.string(),
          username: z.string(),
          name: z.string(),
          to: z.string(),
          avatar: z.object({
            src: z.string(),
            alt: z.string(),
          }),
        })),
      }),
    }),
  },
})

// // Shared schemas
// const imageSchema = z.object({
//   src: z.string().editor({ input: 'media' }),
//   width: z.number().optional(),
//   height: z.number().optional(),
//   aspectRatio: z.number().optional(),
//   palette: z.string().editor({ hidden: true }),
// })

// const creditSchema = z.object({
//   role: z.string().default('author'),
//   name: z.string().default('Andrei Dureika'),
// })

// const baseEntrySchema = z.object({
//   title: z.string(),
//   draft: z.boolean().default(false).optional(),
//   description: z.string().optional(),
//   image: imageSchema.optional(),
//   credits: z.array(creditSchema).optional(),
// })

// export const collections = {
//   projects: defineCollection({
//     type: 'page',
//     source: 'projects/*.md',
//     schema: baseEntrySchema.extend({
//       year: z.string().optional(),
//     }),
//   }),

//   events: defineCollection({
//     type: 'page',
//     source: 'events/*.md',
//     schema: baseEntrySchema.extend({
//       startDate: z.date(),
//       endDate: z.date().optional(),
//     }),
//   }),
// }
// // .editor({ hidden: true })
// // export default defineContentConfig({
// // })
