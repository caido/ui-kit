<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

import { type ThemeConfig } from "../../navigation.ts";

import SidebarNode from "./SidebarNode.vue";

const { theme } = useData<ThemeConfig>();

const items = computed(() => theme.value.navigation);
</script>

<template>
  <nav aria-label="Site" class="flex flex-col py-2">
    <SidebarNode
      v-for="item in items"
      :key="item.link"
      :item="item"
      :depth="0"
    />
  </nav>
</template>
