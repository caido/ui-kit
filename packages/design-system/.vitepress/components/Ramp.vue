<script setup lang="ts">
import { computed } from "vue";

import ramps from "../data/ramps.json";

const props = withDefaults(
  defineProps<{
    family: string;

    theme?: "light" | "dark" | "both";
  }>(),
  { theme: "both" },
);

type Step = { step: number; hex: string; job: string };
const data = ramps as Record<string, Record<string, Step[]>>;

const rows = computed(() => {
  const fam = data[props.family] ?? {};
  const themes = props.theme === "both" ? ["light", "dark"] : [props.theme];
  return themes
    .map((t) => ({ theme: t, steps: fam[t] ?? [] }))
    .filter((r) => r.steps.length);
});

function ink(hex: string) {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const Y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return Y > 0.36 ? "#25272D" : "#FFFFFF";
}

function copy(v: string) {
  if (typeof navigator !== "undefined" && "clipboard" in navigator)
    void navigator.clipboard.writeText(v);
}
</script>

<template>
  <div class="my-6 flex flex-col gap-5">
    <div v-for="row in rows" :key="row.theme">
      <p
        class="mb-2 text-caption font-semibold uppercase tracking-wider text-ink-faint"
      >
        {{ family }} · {{ row.theme }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="s in row.steps"
          :key="s.step"
          type="button"
          class="group relative flex h-[76px] min-w-[74px] flex-1 cursor-pointer flex-col justify-end rounded-md border border-separator p-2 text-left transition duration-1 ease-standard hover:scale-[1.03] focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] motion-reduce:hover:scale-100"
          :style="{ backgroundColor: s.hex, color: ink(s.hex) }"
          :title="s.job"
          @click="copy(s.hex)"
        >
          <span class="text-caption font-semibold leading-none">{{
            s.step
          }}</span>
          <span class="mt-1 font-mono text-[10px] leading-none opacity-80">{{
            s.hex
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
