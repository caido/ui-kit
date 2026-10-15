<script setup lang="ts">
import Swatches from "./Swatches.vue";

const { family, jobs = false } = defineProps<{
  family: string;
  jobs?: boolean;
}>();

const boxes = [
  { theme: "light" as const, label: "Light", scheme: "scheme-light" },
  { theme: "dark" as const, label: "Dark", scheme: "scheme-dark" },
];
</script>

<template>
  <div data-ds class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div
      v-for="box in boxes"
      :key="box.theme"
      :class="box.scheme"
      class="flex flex-col gap-3 rounded border border-line-subtle bg-surface-page p-4"
    >
      <p class="text-body-strong text-fg-strong">{{ box.label }}</p>
      <Swatches :family="family" :theme="box.theme" :jobs="jobs" />
    </div>
  </div>
</template>
