<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

const { projects } = defineProps<{
  projects: ProjectsCollectionItem[]
}>()

const route = useRoute()
const isNavOpen = ref(false)
const navContainer = useTemplateRef('navContainer')

watch(() => route.fullPath, () => {
  setTimeout(() => {
    isNavOpen.value = false
  }, 200)
})

const handleClickOutside = (event: MouseEvent) => {
  if (navContainer.value && !navContainer.value.contains(event.target as Node)) {
    isNavOpen.value = false
  }
}

watch(isNavOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="navContainer" class="nav-container">
    <button class="toggle-nav" @mousedown="isNavOpen = !isNavOpen">
      <Icon name="material-symbols:menu" />
    </button>
    <nav class="nav-links" :class="{ open: isNavOpen }">
      <NuxtLink to="/" class="logo">
        <div>Andrei Dureika</div>
      </NuxtLink>
      <NuxtLink
        v-for="project in projects"
        :key="project.path"
        :to="project.path"
        class="project-card">
        <div>{{ project.title }}</div>
        <div v-if="project.description">{{ project.description }}</div>
        <ContentImage
          v-if="project.image?.src"
          :src="project.image.src"
          :width="50"
          :height="50"
          aspect-ratio="1/1" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.nav-container {
  position: relative;
  grid-column: 1;
  grid-row: 1;
  z-index: 100;


  .toggle-nav {
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    background-color: var(--color-bg);
  }

  nav {
    width: min(100vw, 280px);
    position: sticky;
    top: 0;
    height: fit-content;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    background-color: var(--color-bg);
  }

  @media (max-width: 768px) {
    .toggle-nav {
      display: block;
    }

    nav {
      position: fixed;
      top: var(--size-base);
      left: -100%;
      transition: left 0.3s ease-in-out;

      &.open {
        left: 0;
      }
    }
  }
}
</style>
