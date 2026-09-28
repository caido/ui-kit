<script setup lang="ts">
import { useData } from "vitepress";
import { computed, nextTick, onMounted, ref, watch } from "vue";

import { type ThemeConfig } from "../../navigation.ts";
import { useCurrentRoute } from "../composables/useCurrentRoute.ts";

import SidebarNode from "./SidebarNode.vue";

const { theme } = useData<ThemeConfig>();

const items = computed(() => theme.value.navigation);

const nav = ref<HTMLElement>();

const path = useCurrentRoute();

const revealCurrent = async () => {
  await nextTick();

  const element = nav.value;
  if (element === undefined) return;

  const rail = element.parentElement;
  const current = element.querySelector<HTMLElement>('a[aria-current="page"]');
  if (rail === null || current === null) return;

  const railBox = rail.getBoundingClientRect();
  const box = current.getBoundingClientRect();
  if (box.top >= railBox.top && box.bottom <= railBox.bottom) return;

  rail.scrollTop += box.top - railBox.top - (railBox.height - box.height) / 2;
};

onMounted(revealCurrent);

watch(path, revealCurrent);
</script>

<template>
  <nav ref="nav" aria-label="Site" class="flex flex-col gap-6 py-4">
    <SidebarNode
      v-for="item in items"
      :key="item.link"
      :item="item"
      :depth="0"
    />
  </nav>
</template>
