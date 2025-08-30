<template>
  <figure>
    <slot />
    <figcaption v-if="$slots.default">
      <slot name="caption" mdc-unwrap="p" />
    </figcaption>
  </figure>
</template>
