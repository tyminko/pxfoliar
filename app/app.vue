<script setup lang="ts">
// Fetch all projects
const { data: projects } = await useAsyncData('all-projects', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/projects/%')
    .all()
)
</script>

<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/" class="logo">
          Andrei Dureika
        </NuxtLink>
      </nav>
    </header>
    <nav class="nav-links">
      <NuxtLink
        v-for="project in projects"
        :key="project.path"
        :to="project.path"
        class="project-card">
        <h3>{{ project.title }}</h3>
        <div v-if="project.description">{{ project.description }}</div>
      </NuxtLink>
    </nav>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
