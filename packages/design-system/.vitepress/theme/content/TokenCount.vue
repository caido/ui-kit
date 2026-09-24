<script setup lang="ts">
import manifest from "@caido/tokens/tokens.json";
import { computed } from "vue";

import acceptedFile from "../../../../tokens/src/tokens/contrast-accepted.json";
import pairingsFile from "../../../../tokens/src/tokens/pairings.json";

type Entry = { tier: string; varies?: boolean };

const { of } = defineProps<{ of: string }>();

const entries = Object.entries(
  (manifest as { tokens: Record<string, Entry> }).tokens,
);

const semantic = entries.filter(([, entry]) => entry.tier === "semantic");
const colour = semantic.filter(([name]) => name.startsWith("color."));

const counts: Record<string, number> = {
  total: entries.length,
  primitive: entries.filter(([, entry]) => entry.tier === "primitive").length,
  semantic: semantic.length,
  varying: entries.filter(([, entry]) => entry.varies === true).length,
  fixed: entries.filter(([, entry]) => entry.varies !== true).length,
  colour: colour.length,
  "colour-fixed": colour.filter(([, entry]) => entry.varies !== true).length,
  "non-colour": semantic.length - colour.length,
  pairings: (pairingsFile as { pairings: unknown[] }).pairings.length,
  "accepted-failures": (acceptedFile as { accepted: unknown[] }).accepted.length,
  appearances: 2,
};

const count = computed(() => {
  const found = counts[of];
  if (found === undefined)
    throw new Error(
      `unknown token count "${of}": expected one of ${Object.keys(counts).join(", ")}`,
    );
  return found;
});
</script>

<template>{{ count }}</template>
