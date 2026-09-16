<script setup lang="ts">
import manifest from "@caido/tokens/tokens.json";
import { computed } from "vue";

type Entry = { variable: string; tier: string };

const { family, label = "" } = defineProps<{
  family: string;
  label?: string;
}>();

const tokens = (manifest as { tokens: Record<string, Entry> }).tokens;

const steps = computed(() =>
  Object.entries(tokens)
    .filter(([name]) =>
      new RegExp(`^color\\.${family}\\.\\d+$`, "u").test(name),
    )
    .map(([name, entry]) => ({
      step: name.split(".")[2] ?? "",
      variable: entry.variable,
    }))
    .sort((a, b) => Number(a.step) - Number(b.step)),
);
</script>

<template>
  <div data-ds class="flex flex-col gap-2">
    <p v-if="label !== ''" class="text-body-strong text-fg-strong">
      {{ label }}
    </p>

    <ul class="flex w-full flex-row gap-3">
      <li
        v-for="entry in steps"
        :key="entry.step"
        class="flex min-w-0 flex-1 flex-col gap-2"
      >
        <span
          :style="{ background: `var(${entry.variable})` }"
          class="h-16 w-full rounded border border-line-subtle"
          aria-hidden="true"
        />
        <code class="text-caption text-fg-muted">{{ entry.step }}</code>
      </li>
    </ul>
  </div>
</template>
