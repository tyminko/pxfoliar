<script setup lang="ts">
// Fetch all projects
const { data: projects } = await useAsyncData('all-projects', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/projects/%')
    .all()
)
const sortedProjects = computed(() => {
  return [...(projects.value ?? [])].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }))
});
</script>

<template>
  <div class="app-wrap">
    <nav class="nav-links">
      <NuxtLink to="/" class="logo">
        <div>Andrei Dureika</div>
      </NuxtLink>
      <NuxtLink
        v-for="project in sortedProjects"
        :key="project.path"
        :to="project.path"
        class="project-card">
        <div>{{ project.title }}</div>
        <div v-if="project.description">{{ project.description }}</div>
      </NuxtLink>
    </nav>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  --size-img-max-h: calc(100dvh - var(--size-base));
}
@layer base {
  .app-wrap {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;

    header {
      grid-column: 1;
      grid-row: 1;
    }
    nav {
      width: min(100vw, 300px);
      font-size: 1rem;
      grid-column: 1;
      grid-row: 1;
      position: sticky;
      top: 0;
      height: fit-content;
      padding: 1rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;

      @media (max-width: 768px) {
        position: absolute;
      }
    }
    main {
      grid-column: 2;
      grid-row: 1;

      p {
        max-width: 75ch;
      }
    }
  }

}
</style>
