<script setup lang="ts">
import { withBase } from "vitepress";
import { computed, ref, watch } from "vue";

import { containsRoute, isGroup, type Item } from "../../navigation.ts";
import { useCurrentRoute } from "../composables/useCurrentRoute.ts";

const { item, depth } = defineProps<{
  item: Item;
  depth: number;
}>();

const path = useCurrentRoute();

const indent = computed(() => ["pl-1", "pl-4", "pl-8"][depth] ?? "pl-8");

const isCurrent = computed(
  () =>
    path.value === item.link ||
    item.tabs?.some((tab) => tab.link === path.value) === true,
);

const open = ref(isGroup(item) && containsRoute(item, path.value));

watch(path, (next) => {
  if (isGroup(item) && containsRoute(item, next)) open.value = true;
});

const toggle = () => {
  open.value = !open.value;
};
</script>

<template>
  <div class="flex flex-col">
    <div
      :class="[
        indent,
        isCurrent ? 'bg-surface-selected' : 'hover:bg-surface-hover',
      ]"
      class="mx-1 flex items-center rounded pr-2 transition"
    >
      <button
        v-if="isGroup(item)"
        type="button"
        :aria-expanded="open"
        :aria-label="open ? `Collapse ${item.text}` : `Expand ${item.text}`"
        :class="isCurrent ? 'text-fg-secondary' : 'text-fg-muted'"
        class="flex w-6 shrink-0 cursor-pointer items-center justify-center self-stretch rounded"
        @click="toggle"
      >
        <i
          :class="open ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
          aria-hidden="true"
          class="text-caption"
        />
      </button>
      <span v-else class="w-6 shrink-0" aria-hidden="true" />

      <a
        :href="withBase(item.link)"
        :aria-current="isCurrent ? 'page' : undefined"
        class="min-w-0 flex-1 truncate rounded py-1 text-body text-fg-default aria-[current=page]:text-fg-secondary"
        @click="open = true"
      >
        {{ item.text }}
      </a>
    </div>

    <div v-if="isGroup(item)" v-show="open" class="flex flex-col">
      <SidebarNode
        v-for="child in item.items"
        :key="child.link"
        :item="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>
