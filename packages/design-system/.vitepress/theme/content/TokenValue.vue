<script setup lang="ts">
import CopyText from "./CopyText.vue";

const { value, swatch } = defineProps<{ value: string; swatch: boolean }>();
</script>

<template>
  <span class="flex items-center gap-2 overflow-x-auto">
    <span
      v-if="swatch"
      :style="{ background: value }"
      class="size-4 shrink-0 rounded border border-line-subtle"
      aria-hidden="true"
    />
    <CopyText :text="value">
      <code class="text-caption whitespace-nowrap text-fg-muted">
        {{ value }}
      </code>
    </CopyText>
  </span>
</template>
