<script setup lang="ts">
import { useAppearance } from "../composables/useAppearance.ts";

const { appearance, toggle } = useAppearance();
</script>

<template>
  <button
    type="button"
    :aria-label="`Switch to ${appearance === 'dark' ? 'light' : 'dark'} appearance`"
    class="flex h-(--control-default) cursor-pointer items-center gap-2 rounded bg-surface-page px-3 text-body text-fg-default transition hover:bg-surface-hover focus-visible:border-transparent focus-visible:outline-offset-0"
    @click="toggle"
  >
    <i
      :class="appearance === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"
      aria-hidden="true"
    />
    <span>Theme</span>
  </button>
</template>
