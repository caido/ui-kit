<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

import { useActiveHeading } from "../composables/useActiveHeading.ts";

type Entry = {
  id: string;
  title: string;
  level: number;
};

const { page } = useData();

const entries = computed<Entry[]>(() =>
  (page.value.headers ?? [])
    .flatMap((header) => [header, ...(header.children ?? [])])
    .filter((header) => header.level === 2 || header.level === 3)
    .map((header) => ({
      id: header.slug,
      title: header.title,
      level: header.level,
    })),
);

const active = useActiveHeading(() => entries.value.map((entry) => entry.id));
</script>

<template>
  <nav
    v-if="entries.length > 0"
    aria-label="On this page"
    class="flex flex-col gap-2"
  >
    <p class="text-caption font-bold text-fg-muted uppercase">On this page</p>

    <ul class="flex flex-col border-l border-line-subtle">
      <li v-for="entry in entries" :key="entry.id">
        <a
          :href="`#${entry.id}`"
          :aria-current="entry.id === active ? 'location' : undefined"
          :class="entry.level === 3 ? 'pl-6' : 'pl-3'"
          class="-ml-px block border-l-2 border-transparent py-1 text-caption text-fg-muted transition hover:text-fg-default aria-[current=location]:border-l-line-selected aria-[current=location]:text-fg-default"
        >
          {{ entry.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>
