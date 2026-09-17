<script setup lang="ts">
import manifest from "@caido/tokens/tokens.json";
import { computed } from "vue";

type Entry = {
  variable: string;
  tier: string;
  light?: string;
  dark?: string;
  varies?: boolean;
};

const { prefix } = defineProps<{
  prefix: string;
}>();

const tokens = (manifest as { tokens: Record<string, Entry> }).tokens;

const prefixes = computed(() =>
  prefix
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== ""),
);

const rows = computed(() =>
  Object.entries(tokens)
    .filter(([, entry]) => entry.tier !== "primitive")
    .filter(([name]) => !/\.\d+$/u.test(name))
    .filter(([name]) => prefixes.value.some((part) => name.startsWith(part)))
    .map(([name, entry]) => ({
      name,
      light: entry.light ?? "",
      dark: entry.dark ?? "",
      varies: entry.varies === true,
      isColour: name.startsWith("color."),
    })),
);
</script>

<template>
  <table data-ds class="w-full table-fixed">
    <thead>
      <tr>
        <th class="sticky top-(--header-height) w-1/2 bg-surface-page">
          Token
        </th>
        <th class="sticky top-(--header-height) w-1/4 bg-surface-page">
          Light
        </th>
        <th class="sticky top-(--header-height) w-1/4 bg-surface-page">Dark</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name">
        <td>
          <code>{{ row.name }}</code>
        </td>
        <td>
          <span class="flex items-center gap-2 overflow-x-auto">
            <span
              v-if="row.isColour"
              :style="{ background: row.light }"
              class="size-4 shrink-0 rounded border border-line-subtle"
              aria-hidden="true"
            />
            <code class="text-caption whitespace-nowrap text-fg-muted">
              {{ row.light }}
            </code>
          </span>
        </td>
        <td>
          <span v-if="!row.varies" class="text-caption text-fg-subtle"
            >same</span
          >
          <span v-else class="flex items-center gap-2 overflow-x-auto">
            <span
              v-if="row.isColour"
              :style="{ background: row.dark }"
              class="size-4 shrink-0 rounded border border-line-subtle"
              aria-hidden="true"
            />
            <code class="text-caption whitespace-nowrap text-fg-muted">
              {{ row.dark }}
            </code>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
