<script setup lang="ts">
import manifest from "@caido/tokens/tokens.json";
import { computed, ref } from "vue";

import TokenValue from "./TokenValue.vue";

type Entry = {
  variable: string;
  tier: string;
  light?: string;
  dark?: string;
  varies?: boolean;
  modifiers?: Record<string, string>;
};

type Tier = "all" | "semantic" | "primitive";

type Row = {
  name: string;
  variable: string;
  tier: string;
  light: string;
  dark: string;
  varies: boolean;
  isColour: boolean;
  modifiers: string[];
  haystack: string;
};

type Group = {
  label: string;
  holds: (name: string) => boolean;
};

const tokens = (manifest as { tokens: Record<string, Entry> }).tokens;

const isNumbered = (name: string) => /\.\d+$/u.test(name);

const under =
  (...prefixes: string[]) =>
  (name: string) =>
    prefixes.some((prefix) => name.startsWith(prefix));

const groups: Group[] = [
  {
    label: "Surfaces",
    holds: (name) => under("color.surface.")(name) && !isNumbered(name),
  },
  { label: "Lines", holds: under("color.line.") },
  { label: "Fills", holds: under("color.fill.") },
  { label: "Foregrounds", holds: under("color.fg.") },
  { label: "Row highlights", holds: under("color.highlight.") },
  { label: "Workflow nodes", holds: under("color.workflow-node.") },
  { label: "Medals", holds: under("color.medal.") },
  { label: "Syntax", holds: under("color.syntax.") },
  { label: "Categories", holds: under("color.category.") },
  {
    label: "Other colours",
    holds: under("color.accent", "color.scrollbar", "color.vendor"),
  },
  { label: "Type", holds: under("text.", "font") },
  { label: "Space and shape", holds: under("spacing", "radius", "container") },
  { label: "Motion", holds: under("duration", "ease") },
  { label: "Depth", holds: under("z-index") },
  { label: "Icons", holds: under("icon") },
  { label: "State", holds: under("opacity") },
  {
    label: "Numbered scales",
    holds: (name) => under("color.")(name) && isNumbered(name),
  },
  { label: "Neutral ramp", holds: under("palette.neutral.") },
  { label: "Crimson ramp", holds: under("palette.crimson.") },
  { label: "Vermilion ramp", holds: under("palette.vermilion.") },
  { label: "Citron ramp", holds: under("palette.citron.") },
  { label: "Fern ramp", holds: under("palette.fern.") },
  { label: "Cerulean ramp", holds: under("palette.cerulean.") },
  { label: "Amber ramp", holds: under("palette.amber.") },
  { label: "Category ramps", holds: under("palette.category.") },
  { label: "Metals", holds: under("palette.metal.") },
  { label: "Vendor", holds: under("palette.vendor.") },
];

const rows: Row[] = Object.entries(tokens).map(([name, entry]) => {
  const modifiers = Object.entries(entry.modifiers ?? {}).map(
    ([property, value]) => `${property}: ${value}`,
  );

  return {
    name,
    variable: entry.variable,
    tier: entry.tier,
    light: entry.light ?? "",
    dark: entry.dark ?? "",
    varies: entry.varies === true,
    isColour: under("color.", "palette.")(name),
    modifiers,
    haystack: [name, entry.variable, entry.light, entry.dark, ...modifiers]
      .join(" ")
      .toLowerCase(),
  };
});

const counts = {
  all: rows.length,
  semantic: rows.filter((row) => row.tier === "semantic").length,
  primitive: rows.filter((row) => row.tier === "primitive").length,
};

const tiers: { value: Tier; label: string }[] = [
  { value: "all", label: `All ${counts.all}` },
  { value: "semantic", label: `Semantic ${counts.semantic}` },
  { value: "primitive", label: `Primitive ${counts.primitive}` },
];

const query = ref("");
const tier = ref<Tier>("all");

const terms = computed(() =>
  query.value
    .toLowerCase()
    .split(/\s+/u)
    .filter((term) => term !== ""),
);

const matched = computed(() =>
  rows
    .filter((row) => tier.value === "all" || row.tier === tier.value)
    .filter((row) => terms.value.every((term) => row.haystack.includes(term))),
);

const sections = computed(() => {
  const grouped = groups.map((group) => ({
    label: group.label,
    rows: matched.value.filter((row) => group.holds(row.name)),
  }));

  const placed = new Set(grouped.flatMap((section) => section.rows));
  const ungrouped = matched.value.filter((row) => !placed.has(row));

  return [...grouped, { label: "Everything else", rows: ungrouped }].filter(
    (section) => section.rows.length > 0,
  );
});
</script>

<template>
  <div data-ds class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <label class="relative flex-1 basis-64">
          <span class="sr-only">Search tokens</span>
          <i
            class="fas fa-magnifying-glass pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
            aria-hidden="true"
          />
          <input
            v-model="query"
            type="search"
            placeholder="Search by name, variable or value"
            class="w-full rounded border border-line-default bg-surface-raised py-2 pr-3 pl-8 text-body text-fg-default placeholder:text-fg-muted focus:border-line-focus focus:outline-none"
          />
        </label>

        <div class="flex gap-1" role="group" aria-label="Tier">
          <button
            v-for="option in tiers"
            :key="option.value"
            type="button"
            :aria-pressed="tier === option.value"
            class="rounded border border-line-default px-3 py-2 text-body text-fg-muted transition hover:text-fg-strong aria-pressed:border-line-selected aria-pressed:text-fg-strong"
            @click="tier = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <p class="text-caption text-fg-subtle">
        {{ matched.length }} shown across {{ sections.length }} groups
      </p>
    </div>

    <p v-if="sections.length === 0" class="text-body text-fg-muted">
      No token matches that search.
    </p>

    <section
      v-for="section in sections"
      :key="section.label"
      class="flex flex-col gap-2"
    >
      <h3 class="text-heading text-fg-strong">
        {{ section.label }}
        <span class="text-caption text-fg-subtle">
          {{ section.rows.length }}
        </span>
      </h3>

      <table class="w-full table-fixed">
        <thead>
          <tr>
            <th class="w-1/2">Token</th>
            <th class="w-1/4">Light</th>
            <th class="w-1/4">Dark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in section.rows" :key="row.name">
            <td>
              <code>{{ row.name }}</code>
              <span class="block text-caption text-fg-muted">
                {{ row.variable }}
              </span>
              <span
                v-for="modifier in row.modifiers"
                :key="modifier"
                class="block text-caption text-fg-subtle"
              >
                {{ modifier }}
              </span>
            </td>
            <td>
              <TokenValue :value="row.light" :swatch="row.isColour" />
            </td>
            <td>
              <span v-if="!row.varies" class="text-caption text-fg-subtle">
                same
              </span>
              <TokenValue v-else :value="row.dark" :swatch="row.isColour" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
