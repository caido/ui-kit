<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { type Group, isGroup, navigation } from "../../navigation";

type Card = { key: string; text: string; link: string; blurb: string; icon: string };
type Section = { title: string; intro: string; items: Card[] };

const ENTRIES: Record<string, { blurb: string; icon: string }> = {
  about: {
    blurb:
      "What the system covers, what it deliberately leaves out, and the reasoning behind both.",
    icon: "fa-book",
  },
  plugins: {
    blurb:
      "Build a plugin that reads as part of Caido, using the same tokens the interface uses.",
    icon: "fa-puzzle-piece",
  },
  contributing: {
    blurb:
      "Add or change a token, a component or a rule, and the gates a change has to clear.",
    icon: "fa-code",
  },
};

const ONWARD: Card[] = [
  {
    key: "foundations",
    text: "Foundations",
    link: "/foundations/",
    blurb:
      "Twelve topics holding the decisions every component inherits, each with a model, the rules that follow and the values it publishes.",
    icon: "fa-layer-group",
  },
  {
    key: "components",
    text: "Components",
    link: "/components/",
    blurb:
      "The fourteen pieces the interface is assembled from, with the props they take, the states they own and the markup they render.",
    icon: "fa-sliders",
  },
  {
    key: "guides",
    text: "Guides",
    link: "/guides/",
    blurb:
      "How the system changes over time: theming, what a release promises, what the rules catch, and moving markup onto it.",
    icon: "fa-bookmark",
  },
];

const sections = computed<Section[]>(() => {
  const group = navigation.find(
    (item): item is Group => isGroup(item) && item.link === "/get-started",
  );

  const start = (group?.items ?? []).flatMap((item) => {
    const key = item.link.split("/").pop() ?? "";
    const entry = ENTRIES[key];
    if (entry === undefined) return [];
    return [{ key, text: item.text, link: item.link, ...entry }];
  });

  return [
    {
      title: "Start here",
      intro:
        "Three ways in, depending on what you are here to do. Each one is short, and none of them assumes you have read the others.",
      items: start,
    },
    {
      title: "Then the rest of it",
      intro:
        "The reference the three pages above point into. A rule is written down once, so a page that would restate one links to it instead.",
      items: ONWARD,
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
      <h2 class="text-title text-fg-strong">{{ section.title }}</h2>
      <p class="text-body text-fg-subtle">{{ section.intro }}</p>

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
