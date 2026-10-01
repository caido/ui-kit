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
    class="sticky top-(--header-height) z-10 -mb-px flex gap-1 border-b border-line-subtle bg-surface-page px-8"
  >
    <a
      v-for="tab in tabs"
      :key="tab.link"
      :href="withBase(tab.link)"
      :aria-current="tab.link === path ? 'page' : undefined"
      class="-mb-px border-b-2 border-transparent px-3 py-3 text-body text-fg-subtle transition hover:text-fg-strong aria-[current=page]:border-b-line-selected aria-[current=page]:text-body-strong aria-[current=page]:text-fg-strong"
    >
      {{ tab.text }}
    </a>
  </nav>
</template>
