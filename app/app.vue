<script setup lang="ts">
const { data: projects } = await useAsyncData('all-projects', () =>
  queryCollection('projects')
    .where('path', 'LIKE', '/projects/%')
    .all()
)
const { data: events } = await useAsyncData('all-events', () =>
  queryCollection('events')
    .where('path', 'LIKE', '/events/%')
    .all()
)
const sortedProjects = computed(() => {
  return [...(projects.value ?? [])].sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', undefined, { numeric: true }))
})
const sortedEvents = computed(() => {
  return [...(events.value ?? [])].sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? '', undefined, { numeric: true }))
})
//
onMounted(() => {
  
})
</script>

<template>
  <div class="app-wrap">
    <NavMenu :projects="sortedProjects" :events="sortedEvents" />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  --header-h-margin: var(--padding-xs);
  --header-h: calc(
    var(--font-size-h4) * var(--line-height-header) -
    var(--header-h-margin) -
    var(--font-size-desc) * var(--line-height-body) -
    var(--padding-base) * 2
  );
  --size-img-max-h: calc(100dvh - var(--header-h) - var(--padding-lg));
}
@layer base {
  .app-wrap {
    --content-inline-margin: var(--padding-base);

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;

    main {
      grid-column: 2;
      grid-row: 1;
      padding-inline: var(--content-inline-margin);

      p {
        max-width: 75ch;
      }
      @media (max-width: 768px) {
        /* padding-top: var(--size-base); */
      }
    }
  }
}
</style>
