<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  aspectRatio?: string | number
  width?: number
  height?: number
  maxW?: string | number
  maxH?: string | number
  crop?: boolean
  focus?: string
  loading?: 'lazy' | 'eager'
  sizes?: string
  preset?: string
  provider?: string
  modifiers?: Record<string, string>
  palette?: string
}>()
</script>

<template>
  <figure>
    <MediaImage v-bind="props"/>
    <figcaption v-if="$slots.default" class="desc">
      <slot mdc-unwrap="p" />
    </figcaption>
  </figure>
</template>

<style scoped>
figcaption {
  margin-top: var(--padding-xs);
}
</style>
