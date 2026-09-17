<script setup lang="ts">
import { withBase } from "vitepress";
import { computed } from "vue";

import { useAppearance } from "../composables/useAppearance";

const { image } = defineProps<{ image: string }>();

const { appearance } = useAppearance();

const sides = computed(() => [
  {
    kind: "do" as const,
    label: "Do",
    icon: "fas fa-circle-check",
    tone: "text-fg-success",
    edge: "border-t-line-success",
    src: withBase(`/examples/${image}-do-${appearance.value}.svg`),
  },
  {
    kind: "dont" as const,
    label: "Do not",
    icon: "fas fa-circle-xmark",
    tone: "text-fg-danger",
    edge: "border-t-line-danger",
    src: withBase(`/examples/${image}-dont-${appearance.value}.svg`),
  },
]);
</script>

<template>
  <div data-ds class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <section
      v-for="side in sides"
      :key="side.kind"
      :class="side.edge"
      class="flex flex-col overflow-hidden rounded border border-t-2 border-line-subtle bg-surface-raised"
    >
      <img
        :src="side.src"
        alt=""
        class="w-full border-b border-line-subtle bg-surface-page"
      />

      <div class="flex flex-col gap-3 p-4">
        <p :class="side.tone" class="flex items-center gap-2 text-body-strong">
          <i :class="side.icon" aria-hidden="true" />
          <span>{{ side.label }}</span>
        </p>
        <div class="flex flex-col gap-2 text-body text-fg-default">
          <slot :name="side.kind" />
        </div>
      </div>
    </section>
  </div>
</template>
