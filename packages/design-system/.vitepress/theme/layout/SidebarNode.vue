<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { isGroup, type Item } from "../../navigation.ts";
import { useCurrentRoute } from "../composables/useCurrentRoute.ts";

const { item, depth } = defineProps<{
  item: Item;
  depth: number;
}>();

const path = useCurrentRoute();

const indent = computed(() => ["pl-2", "pl-3", "pl-6"][depth] ?? "pl-6");

const isCurrent = computed(
  () =>
    path.value === item.link ||
    item.tabs?.some((tab) => tab.link === path.value) === true,
);
</script>

<template>
  <div class="flex flex-col gap-px">
    <a
      v-if="isGroup(item)"
      :href="withBase(item.link)"
      :aria-current="isCurrent ? 'page' : undefined"
      :class="indent"
      class="mx-2 rounded py-1 pr-2 text-caption font-bold text-fg-muted uppercase transition hover:bg-surface-hover hover:text-fg-default aria-[current=page]:text-fg-secondary"
    >
      {{ item.text }}
    </a>

    <a
      v-else
      :href="withBase(item.link)"
      :aria-current="isCurrent ? 'page' : undefined"
      :class="indent"
      class="mx-2 truncate rounded py-1 pr-2 text-body text-fg-default transition hover:bg-surface-hover aria-[current=page]:bg-surface-selected aria-[current=page]:text-fg-secondary"
    >
      {{ item.text }}
    </a>

    <SidebarNode
      v-for="child in isGroup(item) ? item.items : []"
      :key="child.link"
      :item="child"
      :depth="depth + 1"
    />
  </div>
</template>
