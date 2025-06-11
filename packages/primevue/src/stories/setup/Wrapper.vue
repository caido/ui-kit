<script lang="ts" setup>
import { type Story, type Variant } from "histoire";

defineProps<{
  story: Story;
  variant?: Variant;
}>();
</script>

<template>
  <div class="global-wrapper text-surface-100 bg-surface-900 rounded-md p-12">
    <slot />
  </div>
</template>
