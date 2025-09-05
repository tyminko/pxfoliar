<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: event } = await useAsyncData(`project-${slug}`, () =>
  queryCollection('events')
    .where('path', '=', `/events/${slug}`)
    .first()
)

const period = computed(() => {
  const start = event.value?.startDate ? new Date(event.value.startDate) : null
  const end = event.value?.endDate ? new Date(event.value.endDate) : null
  const formatter = new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  })
  const format = (d: Date) => formatter.format(d)
  if (start && end) return `${format(start)}-${format(end)}`
  if (start) return format(start)
  if (end) return format(end)
  return ''
})
</script>

<template>
  <PageContent :item="event">
    <template #header-desc>
      <div class="desc">{{ period }} <span>•</span> {{ event?.description }}</div>
    </template>
  </PageContent>
</template>
