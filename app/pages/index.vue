<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

let projectsRef = useNuxtData<ProjectsCollectionItem[]>('all-projects').data

if (!projectsRef?.value || projectsRef.value.length === 0) {
  const { data } = await useAsyncData<ProjectsCollectionItem[]>(
    'all-projects',
    () => queryCollection('projects').order('path', 'ASC').all()
  )
  projectsRef = data
}

if (import.meta.client) {
  const firstPath = projectsRef?.value?.[0]?.path
  if (typeof firstPath === 'string' && firstPath.length > 0) {
    await navigateTo(firstPath, { replace: true })
  }
}
</script>

<template>
  <div>
    Redirecting…
  </div>

</template>
