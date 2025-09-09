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
  <PageContent :item="page" :class="slug">
    <template #header-desc>
      <div class="desc">{{ page?.description }}</div>
    </template>
  </PageContent>
</template>

<style>
.project-page.cv {
  h2, h3 {
    font-size: var(--font-size-body);
    font-variation-settings: "wght" 700;
    a:not(:hover, :focus-visible, :active) {
      color: inherit;
    }
  }
  h2 {
    font-size: var(--font-size-h5);
  }

  li:has( > h3 + ul) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--padding-base);
    margin-bottom: var(--padding-base);


    li {
      list-style: none;
      margin-bottom: var(--padding-sm);
    }
  }
}
</style>
