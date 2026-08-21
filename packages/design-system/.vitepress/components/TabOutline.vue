<script setup lang="ts">
import { useRoute } from "vitepress";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

import { tabHandle, tabRevision } from "../composables/pageTabs";

type Entry = { id: string; text: string; level: number };

const entries = ref<Entry[]>([]);
const activeId = ref("");
const route = useRoute();

const read = async () => {
  if (typeof document === "undefined") return;
  await nextTick();
  const handle = tabHandle.value;
  if (handle === undefined) {
    entries.value = [];
    return;
  }
  const panel = document.getElementById(handle.panelId);
  if (panel === null) {
    entries.value = [];
    return;
  }
  entries.value = [...panel.querySelectorAll<HTMLElement>("h2, h3")]

    .filter(
      (el) => el.id !== "" && el.querySelector("a.header-anchor") !== null,
    )
    .map((el) => ({
      id: el.id,
      text: (el.textContent ?? "").replace(/\u200b|#$/g, "").trim(),
      level: Number(el.tagName[1]),
    }));
  spy();
};

const spy = () => {
  if (entries.value.length === 0) return;
  const top = window.scrollY + 120;
  let current = entries.value[0].id;
  for (const entry of entries.value) {
    const el = document.getElementById(entry.id);
    if (el !== null && el.getBoundingClientRect().top + window.scrollY <= top) {
      current = entry.id;
    }
  }
  activeId.value = current;
};

watch([tabRevision, () => route.path], read, { immediate: true });
onMounted(() => {
  read();
  window.addEventListener("scroll", spy, { passive: true });
});
onUnmounted(() => window.removeEventListener("scroll", spy));

const hasEntries = computed(() => entries.value.length > 0);

const go = (id: string, event: MouseEvent) => {
  event.preventDefault();
  const el = document.getElementById(id);
  if (el === null) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 96,
    behavior: "smooth",
  });
  history.replaceState(null, "", `#${id}`);
};
</script>

<template>
  <nav
    v-if="hasEntries"
    aria-labelledby="tab-outline-label"
    class="ds-tab-outline"
  >
    <div id="tab-outline-label" class="ds-tab-outline-title">On this page</div>
    <ul class="ds-tab-outline-list">
      <li v-for="entry in entries" :key="entry.id">
        <a
          :href="`#${entry.id}`"
          :class="[
            'ds-tab-outline-link',
            {
              'is-active': entry.id === activeId,
              'is-nested': entry.level > 2,
            },
          ]"
          @click="go(entry.id, $event)"
        >
          {{ entry.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
