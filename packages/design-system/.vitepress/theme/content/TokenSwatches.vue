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

const { prefix } = defineProps<{ prefix: string }>();

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
      name: name.replace(/^color\./u, ""),
      light: entry.light ?? "",
      dark: entry.varies === true ? (entry.dark ?? "") : (entry.light ?? ""),
    })),
);
</script>

<template>
  <table data-ds class="w-full table-fixed">
    <thead>
      <tr>
        <th class="w-1/2">Token</th>
        <th class="w-1/4">Light</th>
        <th class="w-1/4">Dark</th>
      </tr>
    </thead>
    <tbody>
      <!-- eslint-disable design/no-inline-style -- each bar paints the one token its row documents, which is a value the class list cannot name -->
      <tr v-for="row in rows" :key="row.name">
        <td>
          <code class="font-mono text-caption">{{ row.name }}</code>
        </td>
        <td>
          <span
            :style="{ background: row.light }"
            class="block h-6 w-full rounded border border-line-subtle"
            aria-hidden="true"
          />
        </td>
        <td>
          <span
            :style="{ background: row.dark }"
            class="block h-6 w-full rounded border border-line-subtle"
            aria-hidden="true"
          />
        </td>
      </tr>
      <!-- eslint-enable design/no-inline-style -->
    </tbody>
  </table>
</template>
