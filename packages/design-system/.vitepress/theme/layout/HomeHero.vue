<script setup lang="ts">
import { withBase } from "vitepress";
import { ref } from "vue";

const field = ref<HTMLElement>();

const onPointerMove = (event: PointerEvent) => {
  const element = field.value;
  if (element === undefined) return;

  const box = element.getBoundingClientRect();
  element.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
  element.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
  element.style.setProperty("--glow-opacity", "1");
};

const onPointerLeave = () => {
  field.value?.style.setProperty("--glow-opacity", "0");
};

const decisions = [
  {
    name: "text-display",
    value: "clamp(42px, 7vw, 84px)",
    reason:
      "Draws the headline above. The one step this site adds to the scale.",
  },
  {
    name: "fg-secondary",
    value: "amber 11",
    reason:
      "Paints the single amber word. Colour is a signal here, never decoration.",
  },
  {
    name: "line-subtle",
    value: "neutral 6",
    reason:
      "Rules this band off the field. A floating panel takes a heavier line.",
  },
  {
    name: "spacing",
    value: "4px",
    reason: "The grid all of this sits on. Pixels, so a rung never moves.",
  },
];
</script>

<template>
  <section class="flex h-(--shell-height) flex-col overflow-hidden">
    <div
      ref="field"
      class="dot-grid pointer-glow flex flex-1 flex-col justify-end overflow-hidden px-(--page-gutter) py-8 lg:py-12"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <div
        aria-hidden="true"
        class="logo-reveal pointer-events-none absolute inset-0 flex items-start justify-center"
      >
        <img :src="withBase('/logo.svg')" alt="" class="home-mark" />
      </div>

      <div class="relative flex flex-col items-start gap-4 lg:gap-6">
        <h1 class="max-w-display text-display text-fg-strong">
          Every decision has a
          <span class="text-fg-secondary">name</span>.
        </h1>

        <a
          :href="withBase('/design-system')"
          class="flex h-(--control-large) items-center gap-2 rounded bg-fill-primary px-6 text-body-strong text-fg-on-primary transition hover:bg-fill-primary-hover"
        >
          <span>Get started</span>
          <i class="fas fa-arrow-right" aria-hidden="true" />
        </a>
      </div>
    </div>

    <dl
      aria-label="Decisions on this page"
      class="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line-subtle bg-surface-subtle px-(--page-gutter) py-6 sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-4"
    >
      <div
        v-for="entry in decisions"
        :key="entry.name"
        class="flex flex-col gap-1"
      >
        <dt class="flex items-baseline gap-2 font-mono text-caption">
          <span class="text-fg-secondary">{{ entry.name }}</span>
          <span class="text-fg-muted">{{ entry.value }}</span>
        </dt>
        <dd class="text-body text-fg-default">{{ entry.reason }}</dd>
      </div>
    </dl>
  </section>
</template>
