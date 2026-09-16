<script setup lang="ts">
import { withBase } from "vitepress";

const { doLight, doDark, dontLight, dontDark, alt } = defineProps<{
  doLight: string;
  doDark: string;
  dontLight: string;
  dontDark: string;
  alt: string;
}>();

const sides = [
  {
    kind: "do" as const,
    label: "Do",
    icon: "fas fa-circle-check",
    tone: "text-fg-success",
    edge: "border-t-line-success",
    light: doLight,
    dark: doDark,
  },
  {
    kind: "dont" as const,
    label: "Do not",
    icon: "fas fa-circle-xmark",
    tone: "text-fg-danger",
    edge: "border-t-line-danger",
    light: dontLight,
    dark: dontDark,
  },
];
</script>

<template>
  <div data-ds class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <section
      v-for="side in sides"
      :key="side.kind"
      :class="side.edge"
      class="flex flex-col overflow-hidden rounded border border-t-2 border-line-subtle bg-surface-raised"
    >
      <div class="border-b border-line-subtle">
        <img
          :src="withBase(side.light)"
          :alt="alt"
          class="w-full dark:hidden"
        />
        <img
          :src="withBase(side.dark)"
          :alt="alt"
          class="hidden w-full dark:block"
        />
      </div>

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
