<script setup lang="ts">
import type { PagesCollectionItem } from '@nuxt/content'

const route = useRoute()
const slug = route.params.slug as string

const { data: page } = await useAsyncData(slug, () =>
  queryCollection('pages')
    .where('path', '=', `/${slug}`)
    .first()
)
const pageData = computed(() => {
  if (slug !== 'cv') { return page.value }
  const title = page.value?.title?.toLocaleLowerCase() !== slug
    ? page.value?.title
    : useAppConfig().global.name ?? slug
  return {
    ...page.value,
    title,
  } as PagesCollectionItem
})
</script>

<template>
  <PageContent :item="pageData" :class="slug">
    <template #header-desc>
      <div class="desc">{{ page?.description }}</div>
    </template>
  </PageContent>
</template>

<style>
.page-wrapper.cv {
  .content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--padding-base);

    & > * {
      grid-column: 1 / -1;
      &:is(ul, ol) {
        display: grid;
        grid-template-columns: subgrid;
        gap: var(--padding-base);
      }
    }
    & > :is(h2, h3) {
      grid-column: 2 / -1;
      margin-block: var(--padding-base);
    }
  }
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

  h2, h3, p {
    margin: 0;
  }

  li:has( > h3 + ul) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    gap: var(--padding-base);

    h3 {
      justify-self: end;
    }

    li {
      list-style: none;
      max-width: 95ch;
      text-wrap: balance;
      &:not(:last-child) {
        margin-bottom: var(--padding-sm);
      }
    }
  }
}
</style>
