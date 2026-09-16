<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

import { useAppearance } from "../composables/useAppearance.ts";
import { useContrast } from "../composables/useContrast.ts";

const {
  foreground,
  background,
  floor = 4.5,
} = defineProps<{
  foreground: string;
  background: string;
  floor?: number;
}>();

const { appearance } = useAppearance();

const sample = ref<HTMLElement>();
const { ratio, measure } = useContrast(sample);

watch(appearance, () => {
  void nextTick(measure);
});

const passes = computed(
  () => ratio.value !== undefined && ratio.value >= floor,
);
</script>

<template>
  <div data-ds class="flex flex-col gap-3 rounded bg-surface-raised p-4">
    <p
      ref="sample"
      :style="{
        color: `var(--color-${foreground})`,
        background: `var(--color-${background})`,
      }"
      class="rounded px-3 py-2 text-body"
    >
      {{ foreground }} on {{ background }}
    </p>

    <p class="flex items-center gap-3 font-mono text-caption">
      <span :class="passes ? 'text-fg-success' : 'text-fg-danger'">
        {{ ratio === undefined ? "measuring" : ratio.toFixed(2) }}
      </span>
      <span class="text-fg-muted">floor {{ floor.toFixed(1) }}</span>
      <span
        v-if="ratio !== undefined"
        :class="passes ? 'text-fg-success' : 'text-fg-danger'"
      >
        {{ passes ? "passes" : "fails" }}
      </span>
    </p>
  </div>
</template>
