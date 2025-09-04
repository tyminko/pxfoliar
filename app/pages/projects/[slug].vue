<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch the specific project
const { data: project } = await useAsyncData(`project-${slug}`, () =>
  queryCollection('projects')
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
    <header>
      <h1>{{ project?.title }}</h1>
      <div class="desc">{{ project?.year }} <span>•</span> {{ project?.description }}</div>
    </header>
    <ContentRenderer v-if="project" :value="project" />
  </div>
</template>

<style scoped>
header {
  --_pad-x: var(--content-inline-margin, var(--padding-sm));
  position: sticky;
  top: 0;
  margin-inline: calc(var(--_pad-x) * -1);
  padding-inline: var(--_pad-x);
  padding-block: var(--padding-base);
  width: fit-content;
  background-color: color-mix(in oklab, var(--color-bg), transparent 10%);
  backdrop-filter: blur(10px);
  z-index: 100;
  word-break: break-word;

  h1 {
    margin-bottom: var(--padding-xs);
    font-size: var(--font-size-h4);

  }
  @media (max-width: 768px) {
    padding-inline: var(--size-base);
    /* top: var(--size-base); */
    /* padding-top: 0; */
  }
}
</style>
