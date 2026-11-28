<script setup lang="ts">
import { computed } from "vue";

const { icons } = defineProps<{
  icons: string;
}>();

const names = computed(() =>
  icons
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== ""),
);
</script>

<template>
  <ul data-ds class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    <li
      v-for="name in names"
      :key="name"
      class="flex items-start gap-3 rounded bg-surface-raised p-3"
    >
      <i
        :class="`fas ${name}`"
        aria-hidden="true"
        class="mt-0.5 shrink-0 text-fg-default"
      />
      <code class="break-all text-caption text-fg-muted">{{ name }}</code>
    </li>
  </ul>
</template>
