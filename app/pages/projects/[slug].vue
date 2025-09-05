<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: project } = await useAsyncData(`project-${slug}`, () =>
  queryCollection('projects')
    .where('path', '=', `/projects/${slug}`)
    .first()
)
</script>

<template>
  <PageContent :item="project">
    <template #header-desc>
      <div class="desc">{{ project?.year }} <span>•</span> {{ project?.description }}</div>
    </template>
  </PageContent>
</template>
