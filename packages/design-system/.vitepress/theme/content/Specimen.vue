<script setup lang="ts">
import manifest from "@caido/tokens/tokens.json";
import { computed } from "vue";

type Entry = {
  tier: string;
  light?: string;
  modifiers?: Record<string, string>;
};

const tokens = (manifest as { tokens: Record<string, Entry> }).tokens;

const roles = computed(() =>
  Object.entries(tokens)
    .filter(
      ([name, entry]) => name.startsWith("text.") && entry.tier !== "primitive",
    )
    .map(([name, entry]) => ({
      role: name.slice("text.".length),
      size: entry.light ?? "",
      lineHeight: entry.modifiers?.["line-height"] ?? "",
      weight: entry.modifiers?.["font-weight"] ?? "",
    })),
);
</script>

<template>
  <ul data-ds class="flex flex-col gap-8">
    <li v-for="role in roles" :key="role.role" class="flex flex-col gap-3">
      <p class="flex flex-wrap items-baseline gap-3 font-mono text-caption">
        <span class="text-fg-secondary">text-{{ role.role }}</span>
        <span class="text-fg-muted">
          {{ role.size }} · line-height {{ role.lineHeight }} · weight
          {{ role.weight }}
        </span>
      </p>

      <p
        :style="{
          fontSize: role.size,
          lineHeight: role.lineHeight,
          fontWeight: role.weight,
        }"
        class="dot-grid-faint rounded border border-line-subtle px-4 py-3 text-fg-strong"
      >
        The quick brown fox jumps over the lazy dog
      </p>
    </li>
  </ul>
</template>
