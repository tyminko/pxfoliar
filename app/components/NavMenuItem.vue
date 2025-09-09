<script setup lang="ts">
import type { ProjectsCollectionItem, EventsCollectionItem } from '@nuxt/content'

type navigationMeta = {
  title: string
  description: string
  icon: string
}

const { item } = defineProps<{
  item: ProjectsCollectionItem | EventsCollectionItem
}>()

const to = computed(() => item.path ?? '/')
const description = computed(() => (item.navigation as navigationMeta)?.description ?? item.description ?? '')
</script>

<template>
  <NuxtLink :to="to" class="nav-item-card">
    <div class="title-container">
      <div>{{ item.title }}</div>
      <div v-if="item.description" class="desc">{{ description }}</div>
    </div>
  </NuxtLink>

</template>

<style scoped>
@layer components {
  .nav-item-card {
    position: relative;
    display: block;
    padding: var(--padding-base);

    .title-container {
      overflow: hidden;
    }

    .desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
