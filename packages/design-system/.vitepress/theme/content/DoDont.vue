<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { useAppearance } from "../composables/useAppearance";

const { image = "" } = defineProps<{ image?: string }>();

const { appearance } = useAppearance();

const drawing = (kind: "do" | "dont") =>
  image === ""
    ? ""
    : withBase(`/examples/${image}-${kind}-${appearance.value}.svg`);

const sides = computed(() => [
  {
    kind: "do" as const,
    label: "Do",
    icon: "fas fa-circle-check",
    tone: "text-fg-success",
    edge: "border-t-line-success",
    src: drawing("do"),
  },
  {
    kind: "dont" as const,
    label: "Do not",
    icon: "fas fa-circle-xmark",
    tone: "text-fg-danger",
    edge: "border-t-line-danger",
    src: drawing("dont"),
  },
]);
</script>

<template>
  <div
    data-ds
    class="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-[auto_auto]"
  >
    <section
      v-for="side in sides"
      :key="side.kind"
      :class="side.edge"
      class="flex min-w-0 flex-col overflow-hidden rounded border border-t-2 border-line-subtle bg-surface-raised md:row-span-2 md:grid md:grid-rows-subgrid"
    >
      <img
        v-if="side.src !== ''"
        :src="side.src"
        alt=""
        class="w-full border-b border-line-subtle bg-surface-page"
      />

      <div
        v-if="$slots[`${side.kind}-example`] !== undefined"
        class="dot-grid-faint flex min-w-0 flex-1 flex-col items-center justify-center gap-2 border-b border-line-subtle bg-surface-page p-8"
      >
        <slot :name="`${side.kind}-example`" />
      </div>

      <div class="flex min-w-0 flex-col gap-3 p-4">
        <p :class="side.tone" class="flex items-center gap-2 text-body-strong">
          <i :class="side.icon" aria-hidden="true" />
          <span>{{ side.label }}</span>
        </p>
        <div class="flex min-w-0 flex-col gap-2 text-body text-fg-default">
          <slot :name="side.kind" />
        </div>
      </div>
    </section>
  </div>
</template>
