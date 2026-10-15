<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { type Group, isGroup, navigation } from "../../navigation";

type Card = { key: string; text: string; link: string; blurb: string };

const BLURBS: Record<string, string> = {
  button:
    "A single command, described by what it means, how much emphasis it takes and what size it is.",
  card: "A raised panel with an optional header and footer, filling whatever box it is placed inside.",
  checkbox:
    "A setting that is on or off, or one member of a set chosen independently of the rest.",
  dialog:
    "An interruption that covers the window and hands it back once one question has an answer.",
  input:
    "A label, a field and a validation message, wired together so none of them goes missing.",
  menu: "A list of commands, drawn in the flow of a page or opened over it by a right click.",
  radio:
    "One option out of a set whose members exclude each other and are all worth showing.",
  segmented:
    "A switch between a few choices that keeps every one of them on screen.",
  select:
    "A labelled dropdown for one value or several, beside the thinner pass-through wrapper.",
  table:
    "A virtualised grid, with selection, sorting, resizing and the empty state already settled.",
  tabs: "A switch across a fixed set of panels, and the separate chip used for a working list.",
  tag: "The small chip naming what kind of thing a row is, read rather than operated.",
  toast: "The column a message lands in once the work behind it has finished.",
  toggle:
    "A setting that is on or off which takes effect the moment the switch moves.",
};

const GROUPS = [
  {
    title: "Surfaces",
    intro:
      "A screen starts with the region its content sits in. These three settle where that region ends, what floats above the page and what stays in it, and how a long list of rows is drawn, so a layout is built out of named containers rather than out of bare elements carrying borders and padding of their own.",
    keys: ["card", "dialog", "table"],
  },
  {
    title: "Commands and navigation",
    intro:
      "Something on a screen has to be pressed. These three cover the control that runs a single command, the list a command is picked from, and the strip that decides which panel is showing, and each of them owns its geometry, its states and its keyboard behaviour rather than leaving a call site to describe them.",
    keys: ["button", "menu", "tabs"],
  },
  {
    title: "Controls",
    intro:
      "A value somebody sets needs a control shaped like the value. These six cover free text, one choice out of many, one choice out of a few, and the two ways a setting that is on or off is drawn, and each one holds its own geometry, its own states and whatever labelling its value needs rather than leaving a screen to assemble a control out of parts.",
    keys: ["input", "select", "checkbox", "radio", "toggle", "segmented"],
  },
  {
    title: "Status",
    intro:
      "Some parts of an interface report rather than ask. One labels a row with the kind of thing it is and takes no focus at all, and the other is where messages land once the work behind them has finished, so what happened is told in one voice rather than in whatever the nearest screen invents.",
    keys: ["tag", "toast"],
  },
];

const slug = (link: string) => link.replace("/components/", "");

const cards = computed(() => {
  const group = navigation.find(
    (item): item is Group => isGroup(item) && item.link === "/components",
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
              :src="withBase(`/examples/card-component-${card.key}-light.svg`)"
              alt=""
              aria-hidden="true"
              class="h-24 w-full border-b border-line-subtle bg-surface-page object-contain dark:hidden"
            />
            <img
              :src="withBase(`/examples/card-component-${card.key}-dark.svg`)"
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
