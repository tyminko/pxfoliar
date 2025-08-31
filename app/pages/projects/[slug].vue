<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch the specific project
const { data: project } = await useAsyncData(`project-${slug}`, () =>
  queryCollection('content')
    .where('path', '=', `/projects/${slug}`)
    .first()
)

// Handle 404 if project not found
if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found'
  })
}

// Set page meta
useSeoMeta({
  title: project.value.seo?.title || project.value.title,
  description: project.value.seo?.description || project.value.description
})
</script>

<template>
  <div class="project-page">
    <ContentRenderer v-if="project" :value="project" />
  </div>
</template>

<style scoped>
  
</style>
