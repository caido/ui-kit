<script setup lang="ts">
import { Content, useData } from "vitepress";
import { computed } from "vue";

import AppHeader from "./layout/AppHeader.vue";
import AppOutline from "./layout/AppOutline.vue";
import AppSidebar from "./layout/AppSidebar.vue";
import AppTabs from "./layout/AppTabs.vue";
import HomeHero from "./layout/HomeHero.vue";

const { page } = useData();

const isHome = computed(() => page.value.frontmatter.layout === "home");

const hasOutline = computed(
  () =>
    page.value.frontmatter.index !== true &&
    (page.value.headers ?? []).length > 0,
);
</script>

<template>
  <div class="min-h-dvh bg-surface-page">
    <AppHeader />

    <HomeHero v-if="isHome" />

    <div v-else class="flex items-start">
      <aside
        class="sticky top-(--header-height) hidden h-(--shell-height) w-64 shrink-0 overflow-y-auto border-r border-line-subtle bg-surface-raised md:block"
      >
        <AppSidebar />
      </aside>

      <main class="min-w-0 flex-1">
        <AppTabs />

        <article class="prose-doc px-8 py-8">
          <Content />
        </article>
      </main>

      <aside
        v-if="hasOutline"
        class="sticky top-(--header-height) hidden h-(--shell-height) w-60 shrink-0 overflow-y-auto border-l border-line-subtle px-4 py-6 xl:block"
      >
        <AppOutline />
      </aside>
    </div>
  </div>
</template>
