<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: page } = await useAsyncData(slug, () =>
  queryCollection('pages')
    .where('path', '=', `/${slug}`)
    .first()
)
</script>

<template>
  <PageContent :item="page">
    <template #header-desc>
      <div class="desc">{{ page?.description }}</div>
    </template>
  </PageContent>
</template>
