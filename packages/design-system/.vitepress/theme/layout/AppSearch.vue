<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref } from "vue";

import { loadSearchBox } from "../searchBox.js";

const SearchBox = defineAsyncComponent(loadSearchBox);

const open = ref(false);

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    open.value = true;
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <button
    type="button"
    aria-label="Search"
    class="flex h-(--control-default) w-64 cursor-pointer items-center gap-2 rounded bg-surface-page px-3 text-body text-fg-muted transition hover:bg-surface-hover focus-visible:border-transparent focus-visible:outline-offset-0"
    @click="open = true"
  >
    <i class="fas fa-magnifying-glass" aria-hidden="true" />
    <span class="flex-1 text-left">Search</span>
    <kbd
      class="flex items-center gap-1 rounded bg-surface-subtle px-1 text-caption text-fg-muted"
    >
      <span>⌘</span>
      <span>K</span>
    </kbd>
  </button>

  <SearchBox v-if="open" @close="open = false" />
</template>
