<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { type Group, isGroup, navigation } from "../../navigation";

type Card = { key: string; text: string; link: string; blurb: string; icon: string };
type Section = { title: string; intro: string; items: Card[] };

const ENTRIES: Record<string, { blurb: string; icon: string }> = {
  theming: {
    blurb:
      "Redefine what the semantic tokens hold, and everything drawn from them follows without a theme API.",
    icon: "fa-eye",
  },
  governance: {
    blurb:
      "What a version promises, how long a name survives after it is deprecated, and who decides.",
    icon: "fa-medal",
  },
  enforcement: {
    blurb:
      "The eleven rules that run at error, what each one rejects, and the gaps none of them can see.",
    icon: "fa-filter",
  },
};

const sections = computed<Section[]>(() => {
  const group = navigation.find(
    (item): item is Group => isGroup(item) && item.link === "/guides",
  );

  return [
    {
      title: "",
      intro: "",
      items: (group?.items ?? []).flatMap((item) => {
        const key = item.link.split("/").pop() ?? "";
        const entry = ENTRIES[key];
        if (entry === undefined) return [];
        return [{ key, text: item.text, link: item.link, ...entry }];
      }),
    },
  ];
});
</script>
<template>
  <div data-ds class="flex flex-col gap-12">
    <section
      v-for="section in sections"
      :key="section.title"
      class="flex flex-col gap-4"
    >
      <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <li v-for="card in section.items" :key="card.key" class="flex">
          <a
            :href="withBase(card.link)"
            class="flex flex-1 flex-col gap-2 rounded border border-line-subtle bg-surface-raised p-5 transition hover:border-line-default hover:bg-surface-hover hover:no-underline"
          >
            <span class="flex items-center gap-2">
              <i
                :class="`fas ${card.icon}`"
                aria-hidden="true"
                class="text-fg-muted"
              />
              <span class="text-heading text-fg-strong">{{ card.text }}</span>
            </span>

            <span class="text-body text-fg-subtle">{{ card.blurb }}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
