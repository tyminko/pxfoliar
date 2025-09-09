<script setup lang="ts">
import type { ProjectsCollectionItem, EventsCollectionItem } from '@nuxt/content'
const route = useRoute()
const { data: projects } = await useAsyncData<ProjectsCollectionItem[]>('all-projects', () =>
  queryCollection('projects')
    .where('path', 'LIKE', '/projects/%')
    .all()
)
const { data: events } = await useAsyncData<EventsCollectionItem[]>('all-events', () =>
  queryCollection('events')
    .where('path', 'LIKE', '/events/%')
    .all()
)
const sortedProjects = computed<ProjectsCollectionItem[]>(() => {
  return [...(projects.value ?? [])].sort((a, b) => {
    const aPath = a.path.split('/').pop() ?? ''
    const bPath = b.path.split('/').pop() ?? ''
    return aPath.localeCompare(bPath, undefined, { numeric: true })
  })
})
const sortedEvents = computed<EventsCollectionItem[]>(() => {
  const toTimestamp = (value?: string): number => {
    if (!value) return Number.POSITIVE_INFINITY
    const time = new Date(value).getTime()
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
  }
  const getEventTime = (event: EventsCollectionItem): number => {
    const start = toTimestamp(event.startDate)
    if (Number.isFinite(start)) return start
    return toTimestamp(event.endDate)
  }
  return [...(events.value ?? [])].sort((a, b) => getEventTime(a) - getEventTime(b))
})
const nextPostRoute = computed<string | null>(() => {
  const currentPath = route.path
  // Only handle these sections; otherwise return null
  if (!/^\/(projects|events|publications)\//.test(currentPath)) return null
  const combined: Array<{ path: string }> = [
    ...((sortedProjects.value ?? []) as Array<{ path: string }>),
    ...((sortedEvents.value ?? []) as Array<{ path: string }>),
    // Add publications when available
  ]
  if (combined.length === 0) return null
  const currentIndex = combined.findIndex(item => item.path === currentPath)
  if (currentIndex === -1) return null
  const nextIndex = (currentIndex + 1) % combined.length
  const nextItem = combined[nextIndex]
  return nextItem?.path ?? null
})

const curColorClass = computed(() => {
  const currentPath = route.path
  if (currentPath.startsWith('/projects/')) return 'ac-1'
  if (currentPath.startsWith('/events/')) return 'ac-2'
  if (currentPath.startsWith('/publications/')) return 'ac-3'
  return ''
})
</script>

<template>
  <div class="app-wrap">
    <NavMenu :projects="sortedProjects" :events="sortedEvents" />
    <main>
      <NuxtPage :class="curColorClass"/>
    </main>
    <footer>
      <NuxtLink
        v-if="nextPostRoute"
        :to="nextPostRoute"
        class="next-post-link"
        :class="curColorClass"
        :title="nextPostRoute.replace(/^\/|\/$/g, '')">
        <Icon name="material-symbols-light:navigate-next" />
      </NuxtLink>
    </footer>
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
  footer {
    position: fixed;
    bottom: var(--padding-xs);
    right: var(--padding-xs);
    z-index: 100;
    .next-post-link {
      display: flex;
      width: var(--size-base);
      height: var(--size-base);
      background-color: var(--color-background);
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--color-bg);
      &::after {
        border-radius: inherit;
      }
    }
  }
  button, a {
    --_icon-size: 2rem;
    &.next-post-link {
      --_icon-size: 3rem;
    }
    .iconify:only-child {
      width: var(--_icon-size);
      height: var(--_icon-size);
    }
  }
}
</style>
