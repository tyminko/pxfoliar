<script setup lang="ts">
import type { ProjectsCollectionItem, EventsCollectionItem } from '@nuxt/content'

const { projects, events } = defineProps<{
  projects: ProjectsCollectionItem[]
  events: EventsCollectionItem[]
}>()

const route = useRoute()
const isNavOpen = ref(false)
const navContainer = useTemplateRef('navContainer')
const isEventsOpen = ref(false)
const isProjectsOpen = ref(false)

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
      <button v-if="projects.length > 0" class="toggle-projects" @mousedown="isProjectsOpen = !isProjectsOpen">
        Works
      </button>
      <NavMenuItem v-for="project in projects" :key="project.path" :item="project" />
      <button v-if="events.length > 0" class="toggle-events" @mousedown="isEventsOpen = !isEventsOpen">
        Events
      </button>
      <NavMenuItem v-for="event in events" :key="event.path" :item="event" />
    </nav>
  </div>
</template>

<style scoped>
.nav-container {
  grid-column: 1;
  grid-row: 1;
  /* container-type: inline-size; */
  position: relative;
  z-index: 1000;

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
    /* padding: var(--padding-base); */
    /* display: grid;
    grid-template-columns: 1fr;
    gap: 0; */
    background-color: var(--color-bg);

    > * {
      padding-block: var(--padding-sm);
    }
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
