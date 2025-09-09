<script setup lang="ts">
import type { ProjectsCollectionItem, EventsCollectionItem } from '@nuxt/content'

const { projects, events } = defineProps<{
  projects: ProjectsCollectionItem[]
  events: EventsCollectionItem[]
}>()

const route = useRoute()
const isNavOpen = ref(false)
const navContainer = useTemplateRef('navContainer')
const navLinks = useTemplateRef('navLinks')
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

const scrollToStickyHeader = async (event: MouseEvent) => {
  const container = navLinks.value as HTMLElement | null
  if (!container) return
  const header = (event.currentTarget as HTMLElement)?.closest('.sticky-header') as HTMLElement | null
  if (!header) return
  // Wait for any DOM changes from the click (like expanding/collapsing sections)
  await nextTick()
  const computedTop = parseFloat(getComputedStyle(header).top || '0') || 0
  const headerHeight = header.offsetHeight
  // Find the first non-sticky element after this header
  let firstContent: HTMLElement | null = header.nextElementSibling as HTMLElement | null
  while (firstContent && firstContent.classList.contains('sticky-header')) {
    firstContent = firstContent.nextElementSibling as HTMLElement | null
  }
  // If no content after header, fall back to aligning the header itself
  const targetElement = firstContent ?? header
  // Compute absolute Y position of target within the scroll container using rects
  const containerRect = container.getBoundingClientRect()
  const targetRect = targetElement.getBoundingClientRect()
  const absoluteTop = (targetRect.top - containerRect.top) + container.scrollTop
  const desiredOffsetInsideContainer = computedTop + headerHeight
  const targetScrollTop = Math.max(0, absoluteTop - desiredOffsetInsideContainer)
  container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
}
</script>

<template>
  <div ref="navContainer" class="nav-container">
    <button class="toggle-nav" @mousedown="isNavOpen = !isNavOpen">
      <Icon name="material-symbols-light:menu" />
    </button>
    <nav ref="navLinks" class="nav-links" :class="{ open: isNavOpen }">
      <div class="sticky-header">
        <NuxtLink to="/cv" class="logo">
          <div>Andrei Dureika</div>
        </NuxtLink>
      </div>
      <div class="sticky-header">
        <button
          v-if="projects.length > 0"
          class="toggle-projects ac-1"
          @mousedown="(e) => { isProjectsOpen = !isProjectsOpen; scrollToStickyHeader(e) }">
          Works
        </button>
      </div>
      <NavMenuItem
        v-for="project in projects"
        :key="project.path"
        :item="project"
        class="ac-1" />
      <div class="sticky-header ac-2">
        <button
          v-if="events.length > 0"
          class="toggle-events"
          @mousedown="(e) => { isEventsOpen = !isEventsOpen; scrollToStickyHeader(e) }">
          Events
        </button>
      </div>
      <NavMenuItem
        v-for="event in events"
        :key="event.path"
        :item="event"
        class="ac-2"/>
      <div class="sticky-header ac-3">
        <button
          v-if="events.length > 0"
          class="toggle-events"
          @mousedown="(e) => { isEventsOpen = !isEventsOpen; scrollToStickyHeader(e) }">
          Publications
        </button>
      </div>
      <NavMenuItem
        v-for="event in events"
        :key="event.path"
        :item="event"
        class="ac-3" />
    </nav>
  </div>
</template>

<style scoped>
.nav-container {
  grid-column: 1;
  grid-row: 1;
  position: sticky;
  top: 0;
  z-index: 1000;

  .toggle-nav {
    position: fixed;
    top: 0.3rem;
    left: 0;
    display: none;
    background-color: var(--color-bg);
    width: var(--size-base);
    height: var(--size-base);
    padding: 0;
  }

  .logo {
    display: flex;
    align-items: center;
    padding: var(--padding-base);
    padding-block: var(--padding-sm);
    min-height: var(--size-base);
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    width: fit-content;
    background: var(--color-bg);
    box-shadow: 0 0 3px 3px var(--color-bg);
    border-radius: 999px;

    &.ac-2 {
      color: var(--color-accent-2)
    }
    &.ac-3 {
      color: var(--color-accent-3)
    }
  }
  :nth-child(1 of .sticky-header) {
    top: 0;
  }
  :nth-child(2 of .sticky-header) {
    top:var(--size-base);
  }
  :nth-child(3 of .sticky-header) {
    top: calc(var(--size-base) * 2);
  }
  :nth-child(4 of .sticky-header) {
    top: calc(var(--size-base) * 3);
  }
  :nth-last-child(1 of .sticky-header) {
    bottom: 0;
  }
  :nth-last-child(2 of .sticky-header) {
    bottom: calc(var(--size-base) * 1);
  }

  nav {
    position: sticky;
    top: 0;
    width: min(100vw, 280px);
    height: fit-content;
    max-height: 100dvh;
    overflow: auto;
    overscroll-behavior: contain;
    background-color: color-mix(in oklch, var(--color-bg), transparent 10%);
    backdrop-filter: blur(10px);
    padding-bottom: calc(var(--size-base) / 2);
    padding-top: var(--padding-sm);

    > *:not(.sticky-header) {
      display: block;
      padding: var(--padding-base);
      padding-block: var(--padding-sm);
      min-height: var(--size-base);
    }

    .logo {
      display: flex;
      align-items: center;
    }

    button {
      padding-inline: var(--padding-base);
    }

    a:not(:active, .router-link-exact-active) {
      color: var(--color-text);
      &:hover {
        color: var(--color-accent-1);
        &.ac-2 {
          color: var(--color-accent-2)
        }
        &.ac-3 {
          color: var(--color-accent-3)
        }
      }
    }

    .router-link-exact-active {
      position: relative;
      font-variation-settings: 'wght' 700;
    }
  }

  @media (max-width: 768px) {
    .toggle-nav {
      display: block;
    }

    nav {
      position: fixed;
      max-height: calc(100dvh - var(--size-base));
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
