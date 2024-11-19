<script lang="ts" setup>
import { Story, Variant } from 'histoire'

defineProps<{
  story: Story
  variant?: Variant
}>()
</script>

<template>
  <div
    class="global-wrapper"
    style="padding: 0.25rem; border: solid 1px rgba(0, 0, 0, 0.05);"
  >
    <slot />
  </div>
</template>
