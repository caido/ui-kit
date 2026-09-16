<script setup lang="ts">
import { useRoute, withBase } from "vitepress";
import { computed } from "vue";

import { tabsForRoute } from "../../navigation.ts";

const route = useRoute();

const path = computed(() =>
  route.path.replace(/index\.html$/u, "").replace(/\.html$/u, ""),
);

const tabs = computed(() => tabsForRoute(path.value));
</script>

<template>
  <nav
    v-if="tabs !== undefined"
    aria-label="Page"
    class="-mb-px flex gap-1 border-b border-line-subtle"
  >
    <a
      v-for="tab in tabs"
      :key="tab.link"
      :href="withBase(tab.link)"
      :aria-current="tab.link === path ? 'page' : undefined"
      class="-mb-px border-b-2 border-transparent px-3 py-2 text-body text-fg-muted transition hover:text-fg-default aria-[current=page]:border-b-line-selected aria-[current=page]:text-fg-default"
    >
      {{ tab.text }}
    </a>
  </nav>
</template>
