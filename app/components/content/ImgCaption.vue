<template>
  <figure :style="style">
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :style="{ aspectRatio: aspectRatio ? `${aspectRatio}` : undefined }"
      class="w-full h-auto">
    <figcaption v-if="$slots.default || caption" class="mt-2 text-sm text-gray-600">
      <slot name="caption" />
      <slot v-if="!$slots.caption" />
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  aspectRatio?: number
  caption?: string
  style?: string
}

defineProps<Props>()
</script>
