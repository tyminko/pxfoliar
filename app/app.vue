<script setup lang="ts">
// Fetch all projects
const { data: projects } = await useAsyncData('all-projects', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/projects/%')
    .all()
)
</script>

<template>
  <div class="app-wrap">
    <nav class="nav-links">
      <NuxtLink to="/" class="logo">
        Andrei Dureika
      </NuxtLink>
      <NuxtLink
        v-for="project in projects"
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
@layer base {
  .app-wrap {
    display: grid;
    grid-template-columns: min(100vw, 300px) 1fr;
    grid-template-rows: 1fr;

    header {
      grid-column: 1;
      grid-row: 1;
    }
    nav {
      grid-column: 1;
      grid-row: 1;
      position: sticky;
      top: 0;
      height: fit-content;
    }
    main {
      grid-column: 2;
      grid-row: 1;
    }
  }

}
</style>
