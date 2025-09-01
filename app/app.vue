<script setup lang="ts">
const { data: projects } = await useAsyncData('all-projects', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/projects/%')
    .all()
)
const sortedProjects = computed(() => {
  return [...(projects.value ?? [])].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }))
})
</script>

<template>
  <div class="app-wrap">
    <NavMenu :projects="sortedProjects" />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  --size-img-max-h: calc(100dvh - var(--size-base));
}
@layer basic {
  .app-wrap {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;

    main {
      grid-column: 2;
      grid-row: 1;
      padding: var(--padding-sm);

      p {
        max-width: 75ch;
      }
      @media (max-width: 768px) {
        padding-top: var(--size-base);
      }
    }
  }
}
</style>
