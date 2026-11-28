<script setup lang="ts">
import manifest from "@caido/tokens/tokens.json";
import { computed } from "vue";

import { type Appearance, useAppearance } from "../composables/useAppearance";

type Entry = { variable: string; tier: string; light?: string; dark?: string };

const {
  family,
  theme = undefined,
  label = "",
  jobs = false,
} = defineProps<{
  family: string;
  theme?: Appearance;
  label?: string;
  jobs?: boolean;
}>();

const { appearance } = useAppearance();

const shown = computed(() => theme ?? appearance.value);

const tokens = (manifest as { tokens: Record<string, Entry> }).tokens;

const shared = [
  "App background",
  "Subtle background",
  "Raised surface",
  "Hover",
  "Selected",
  "Subtle border",
  "Border",
  "Strong border",
  "Solid",
  "Solid hover",
];

const jobOf = (step: number, total: number) =>
  shared[step - 1] ??
  (total === 14
    ? ["Muted text", "Subtle text", "Body text", "Strong text"][step - 11]
    : ["Muted text", "Text"][step - 11]) ??
  "";

const lightnessOf = (value: string | undefined) => {
  const match = /oklch\(\s*([\d.]+)/u.exec(value ?? "");
  return match?.[1] === undefined ? 0 : Number(match[1]);
};

const steps = computed(() => {
  const found = Object.entries(tokens)
    .filter(([name]) =>
      new RegExp(`^palette\\.${family}\\.${shown.value}\\.\\d+$`, "u").test(
        name,
      ),
    )
    .map(([name, entry]) => ({
      step: Number(name.split(".")[3]),
      variable: entry.variable,
      dim: lightnessOf(entry[shown.value]) > 0.62,
    }))
    .sort((a, b) => a.step - b.step);

  return found.map((entry) => ({
    ...entry,
    job: jobOf(entry.step, found.length),
  }));
});
</script>

<template>
  <div data-ds class="flex min-w-0 flex-1 flex-col gap-2">
    <p v-if="label !== ''" class="text-body-strong text-fg-strong">
      {{ label }}
    </p>

    <ul class="flex flex-col overflow-hidden rounded border border-line-subtle">
      <!-- eslint-disable design/no-primitive-token -- a palette step is a raw value with no semantic partner, and the label sitting on it has to read against that one step rather than against a surface the system names -->
      <li
        v-for="entry in steps"
        :key="entry.step"
        :style="{
          background: `var(${entry.variable})`,
          color: entry.dim
            ? 'var(--palette-neutral-dark-1)'
            : 'var(--palette-neutral-dark-14)',
        }"
        class="flex items-center justify-between gap-4 px-3 py-2"
      >
        <code class="font-mono text-caption">{{ entry.step }}</code>
        <span v-if="jobs" class="text-caption">{{ entry.job }}</span>
      </li>
      <!-- eslint-enable design/no-primitive-token -->
    </ul>
  </div>
</template>
