import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    global: group({
      title: 'Website',
      description: 'Global website configuration',
      icon: 'lucide:settings',
      fields: {
        name: field({
          type: 'string',
          title: 'Name',
          description: 'Your name',
          icon: 'lucide:user',
          default: 'Aurelius Valerian',
        }),
      },
    }),
  },
})
