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
}>()

const isLoaded = ref(false)
const showPlaceholder = ref(true)
const imgRef = useTemplateRef('imgRef')

const $img = useImage()
const provider = computed(() => props.provider ?? $img.options.provider)
const preset = computed(() => props.preset ?? $img.options.presets?.default?.preset ?? 'default')
const defaultSizes = computed(() => $img.options.presets?.[preset.value]?.sizes ?? 'sm:100vw md:100vw lg:100vw')
const imageSizes = computed(() =>
  $img.getSizes(props.src, {
    sizes: defaultSizes.value,
    width: props.width,
    height: props.height,
    preset: preset.value,
    provider: provider.value,
  })
)
const resolvedSrc = computed(() => imageSizes.value.src)
const resolvedSrcset = computed(() => imageSizes.value.srcset)

watch(resolvedSrc, () => {
  isLoaded.value = false
  showPlaceholder.value = true
  nextTick(checkImageLoaded)
})

const TRANS_DUR = 300 // 0.3s
const PLACEHOLDER_DELAY = 0.1
const LOADING_SHOW_DELAY = 500 // Only show loading indicator after 500ms

const cssVars = computed(() => ({
  '--trans-dur': `${TRANS_DUR}ms`,
  '--placeholder-delay': `${TRANS_DUR * PLACEHOLDER_DELAY}ms`,
  '--loading-show-delay': `${LOADING_SHOW_DELAY}ms`,
}))

function onImageLoad() {
  isLoaded.value = true
  // Remove placeholder after its transition completes
  setTimeout(() => {
    showPlaceholder.value = false
  }, TRANS_DUR * PLACEHOLDER_DELAY)
}

onMounted(() => {
  checkImageLoaded()
})

const aspectRatio = computed(() => {
  const raw = props.aspectRatio
  if (!raw || raw === 'auto') {
    if (props.width && props.height) {
      return props.width / props.height
    }
    return undefined
  }
  if (typeof raw === 'number') {
    return raw > 0 ? raw : undefined
  }
  const str = String(raw).trim()
  const numeric = Number(str)
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric
  }
  // split pairs: "16/9", "4:3", "1x1" (ignore spaces)
  const s = str.replace(/\s+/g, '').toLowerCase().replace(/×/g, 'x')
  const [wStr, hStr] = s.split(/[/:x]/)
  const w = parseFloat(wStr ?? '')
  const h = parseFloat(hStr ?? '')
  if (!w || !h) {
    return undefined
  }
  return w / h
})

const sizes = computed(() => {
  if (props.sizes) {
    return props.sizes
  }
  if (aspectRatio.value) {
    const w = stringSize(props.maxW ?? '100vw')
    const h = stringSize(props.maxH ?? '100vh')
    return `min(${w}, ${h} * ${aspectRatio.value})`
  }
  return defaultSizes.value
})

function stringSize(s: string | number) {
  return (typeof s === 'number') ? `${s}px` : s
}
function checkImageLoaded() {
  if (imgRef.value?.complete && imgRef.value?.naturalWidth > 0) {
    isLoaded.value = true
  }
}
</script>

<template>
  <figure :style="{ '--ar': aspectRatio, ...cssVars }">
    <div
      class="image-wrap"
      :class="{ 'image-loaded': isLoaded, 'show-placeholder': showPlaceholder }">
      <div v-if="!isLoaded" class="loading-indicator">
        <span class="dots" />
      </div>
      <img
        ref="imgRef"
        :src="resolvedSrc"
        :srcset="resolvedSrcset"
        :sizes="sizes"
        :width="width"
        :height="height"
        :alt="alt"
        :loading="loading"
        :style="{ '--ar': aspectRatio }"
        @load="onImageLoad">
    </div>
    <figcaption v-if="$slots.default">
      <slot mdc-unwrap="p" />
    </figcaption>
  </figure>
</template>

<style scoped>
.image-wrap {
  position: relative;
  width: min(100%, 100vh * var(--ar));
  aspect-ratio: var(--ar, auto);

  &.show-placeholder::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 1;
    transition: opacity var(--trans-dur) ease-in-out;
    transition-delay: var(--placeholder-delay);
    /* Placeholder gradient 4 x 4 */
    --gr-r: 50%; /* a point gradient radius */
    --gr-c: 20%; /* a point inner radius of solid color */
    --gr-c1: 0%; /* a point inner radius of solid color. special case for central points */
    background:
      /* central 2x2 points, drawn on top of the other gradients */
      radial-gradient(ellipse at 33.33% 33.33%, var(--c5) var(--gr-c1), transparent var(--gr-r)),
      radial-gradient(ellipse at 66.66% 33.33%, var(--c6) var(--gr-c1), transparent var(--gr-r)),
      radial-gradient(ellipse at 33.33% 66.66%, var(--c9) var(--gr-c1), transparent var(--gr-r)),
      radial-gradient(ellipse at 66.66% 66.66%, var(--c10) var(--gr-c1), transparent var(--gr-r)),
      /* top row points */
      radial-gradient(ellipse at 0 0, var(--c0) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 33.33% 0, var(--c1) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 66.66% 0, var(--c2) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 100% 0, var(--c3) var(--gr-c), transparent var(--gr-r)),
      /* second row edge points */
      radial-gradient(ellipse at 0 33.33%, var(--c4) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 100% 33.33%, var(--c7) var(--gr-c), transparent var(--gr-r)),
      /* third row edge points */
      radial-gradient(ellipse at 0 66.66%, var(--c8) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 100% 66.66%, var(--c11) var(--gr-c), transparent var(--gr-r)),
      /* bottom row points */
      radial-gradient(ellipse at 0 100%, var(--c12) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 33.33% 100%, var(--c13) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 66.66% 100%, var(--c14) var(--gr-c), transparent var(--gr-r)),
      radial-gradient(ellipse at 100% 100%, var(--c15) var(--gr-c), transparent var(--gr-r));
  }

  img {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    z-index: 1;
    transition: opacity var(--trans-dur) ease-in-out;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: var(--font-size-sm, 0.875rem);
    user-select: none;
    z-index: 2;
    opacity: 0;
    animation: loading-show var(--loading-show-delay) linear forwards;
    .dots {
      display: inline-block;
      font-family: monospace;
      opacity: 0.8;
      width: 3ch;
      &::after {
        content: "•\00a0\00a0";
        animation: loading-dots 1s infinite linear;
      }
    }
  }

  &.image-loaded.show-placeholder::before {
    opacity: 0;
  }

  &.image-loaded img {
    opacity: 1;
  }

  &.image-loaded .loading-indicator {
    opacity: 0;
    transition: opacity var(--trans-dur) ease-in-out;
  }
}

@keyframes loading-show {
  0%, 99.99% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes loading-dots {
  0%, 16.66% {
    content: "•\00a0\00a0";
  }
  16.66%, 33.33% {
    content: "••\00a0";
  }
  33.33%, 50% {
    content: "•••";
  }
  50%, 66.66% {
    content: "\00a0••";
  }
  66.66%, 83.33% {
    content: "\00a0\00a0•";
  }
  83.33%, 100% {
    content: "\00a0\00a0\00a0";
  }
}
</style>
