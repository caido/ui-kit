<script setup lang="ts">
import { withBase } from "vitepress";

const {
  light,
  dark = "",
  alt,
  caption = "",
} = defineProps<{
  light: string;
  dark?: string;
  alt: string;
  caption?: string;
}>();
</script>

<template>
  <figure
    data-ds
    class="flex flex-col overflow-hidden rounded bg-surface-raised"
  >
    <div class="p-4">
      <img
        :src="withBase(light)"
        :alt="alt"
        :class="dark === '' ? '' : 'dark:hidden'"
        class="w-full"
      />
      <img
        v-if="dark !== ''"
        :src="withBase(dark)"
        :alt="alt"
        class="hidden w-full dark:block"
      />
    </div>

    <figcaption
      v-if="caption !== ''"
      class="border-t border-line-subtle px-4 py-2 text-caption text-fg-muted"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
