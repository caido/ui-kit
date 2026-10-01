<script setup lang="ts">
import { computed } from "vue";

const {
  rung,
  label = "",
  blocks = 3,
} = defineProps<{
  rung: number;
  label?: string;
  blocks?: number;
}>();

const pixels = computed(() => rung * 4);

const caption = computed(() => (label === "" ? `gap-${rung}` : label));
</script>

<template>
  <figure data-ds class="flex w-full flex-col gap-2">
    <div class="flex w-full items-stretch">
      <template v-for="block in blocks" :key="block">
        <div class="h-10 flex-1 bg-surface-raised" />
        <div
          v-if="block < blocks"
          class="h-10 shrink-0 bg-fill-secondary"
          :style="{ width: `${pixels}px` }"
          :aria-label="`${pixels} pixels of space`"
        />
      </template>
    </div>

    <figcaption class="flex items-center gap-2 font-mono text-caption">
      <span class="h-2 w-2 shrink-0 bg-fill-secondary" aria-hidden="true" />
      <span class="text-fg-muted">{{ caption }}</span>
      <span class="text-fg-subtle">{{ pixels }}px</span>
    </figcaption>
  </figure>
</template>
