<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { type Group, isGroup, navigation } from "../../navigation";

type Card = { key: string; text: string; link: string; blurb: string };

const BLURBS: Record<string, string> = {
  tokens:
    "What a value is called, and why you write the name rather than the value.",
  colour:
    "What a colour means before it is picked, and where each one is allowed to go.",
  type: "What a piece of text is for, which settles its size, height and weight.",
  space:
    "Which gap says two things belong together, and what is not a gap at all.",
  depth:
    "Whether a surface floats, and what it sits above, kept as separate questions.",
  icons:
    "How a glyph is sized, coloured and named, and when it needs a label of its own.",
  motion:
    "How fast a thing moves, what may move at all, and what stops when somebody asks.",
  states: "Which property each state owns, so that several at once still read.",
  feedback: "Which indicator a wait takes, and what is said once it ends.",
  accessibility:
    "The target every page is held to, and which rules a machine checks.",
  theme:
    "Where a component's default look comes from before any screen asks for one.",
  components: "Where the rules stop being advice and become a type.",
};

const GROUPS = [
  {
    title: "Values",
    intro:
      "Nothing in Caido writes a raw value. These pages set the names you write instead, and the fixed set of steps each name offers, so that a colour, a type role, a gap or a glyph is chosen from a ladder rather than decided per case.",
    keys: ["tokens", "colour", "type", "space", "depth", "icons"],
  },
  {
    title: "Behaviour",
    intro:
      "Movement and change say something, so they are chosen rather than styled. These pages settle how fast a thing moves, how a component shows which state it is in, and what the interface says to somebody who is waiting.",
    keys: ["motion", "states", "feedback"],
  },
  {
    title: "Contracts",
    intro:
      "A rule that only a person can follow is a rule that drifts. These pages cover the places where the system binds instead: the floor every screen has to clear, the published preset a component draws from, and the API that refuses what it cannot check.",
    keys: ["accessibility", "theme", "components"],
  },
];

const slug = (link: string) => link.replace("/foundations/", "");

const cards = computed(() => {
  const group = navigation.find(
    (item): item is Group => isGroup(item) && item.link === "/foundations",
  );

  const byKey = new Map<string, Card>(
    (group?.items ?? []).map((item) => {
      const key = slug(item.link);
      return [
        key,
        { key, text: item.text, link: item.link, blurb: BLURBS[key] ?? "" },
      ];
    }),
  );

  return GROUPS.map((section) => ({
    ...section,
    items: section.keys.flatMap((key) => {
      const card = byKey.get(key);
      return card === undefined ? [] : [card];
    }),
  }));
});
</script>

<template>
  <div data-ds class="flex flex-col gap-12">
    <section
      v-for="section in cards"
      :key="section.title"
      class="flex flex-col gap-4"
    >
      <h2 class="text-title text-fg-strong">{{ section.title }}</h2>
      <p class="text-body text-fg-subtle">{{ section.intro }}</p>

      <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <li v-for="card in section.items" :key="card.key" class="flex">
          <a
            :href="withBase(card.link)"
            class="flex flex-1 flex-col overflow-hidden rounded border border-line-subtle bg-surface-raised transition hover:border-line-default hover:bg-surface-hover hover:no-underline"
          >
            <img
              :src="withBase(`/examples/topic-${card.key}-light.svg`)"
              alt=""
              aria-hidden="true"
              class="h-24 w-full border-b border-line-subtle bg-surface-page object-contain dark:hidden"
            />
            <img
              :src="withBase(`/examples/topic-${card.key}-dark.svg`)"
              alt=""
              aria-hidden="true"
              class="hidden h-24 w-full border-b border-line-subtle bg-surface-page object-contain dark:block"
            />

            <span class="flex flex-1 flex-col gap-2 p-6">
              <span class="text-heading text-fg-strong">{{ card.text }}</span>
              <span class="min-h-18 text-body text-fg-subtle">{{
                card.blurb
              }}</span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
