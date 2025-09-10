<script setup lang="ts">
import type { ProjectsCollectionItem, EventsCollectionItem } from '@nuxt/content'

const { item = null } = defineProps<{
  item?: ProjectsCollectionItem | EventsCollectionItem | null
}>()
const headerEl = ref<HTMLElement | null>(null)
let headerResizeObserver: ResizeObserver | null = null

function updateHeaderHeightVar() {
  if (!headerEl.value) return
  const { height } = headerEl.value.getBoundingClientRect()
  document.documentElement.style.setProperty('--header-h', `${height}px`)
}
onMounted(() => {
  updateHeaderHeightVar()
  headerResizeObserver = new ResizeObserver(() => updateHeaderHeightVar())
  if (headerEl.value) headerResizeObserver.observe(headerEl.value)
})
onBeforeUnmount(() => {
  if (headerResizeObserver) {
    headerResizeObserver.disconnect()
    headerResizeObserver = null
  }
})

const $img = useImage()
const ogImage = computed(() => $img.getImage(item?.image?.src || '', {
  modifiers: { width: 1200, height: 630, focus: 'auto' }
}))
useSeoMeta({
  title: item?.seo?.title || item?.title,
  description: item?.seo?.description || item?.description,
  ogImage: ogImage.value.url,
})
</script>

<template>
  <div class="page-wrapper">
    <header ref="headerEl">
      <h1>{{ item?.title }}</h1>
      <slot name="header-desc" />
    </header>
    <slot />
    <ContentRenderer v-if="item" :value="item" class="content" />
    <div v-else>
      <h1>Page Not Found</h1>
    </div>
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
    margin-bottom: var(--header-h-margin, var(--padding-xs));
    font-size: var(--font-size-h4);
  }
  @media (max-width: 768px) {
    padding-inline: var(--size-base);
  }
}
</style>
