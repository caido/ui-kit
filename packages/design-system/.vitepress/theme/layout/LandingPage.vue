<script setup lang="ts">
import { withBase } from "vitepress";
import { ref } from "vue";

import { useReveal } from "../composables/useReveal";
import { useSearch } from "../composables/useSearch";

const { openSearch } = useSearch();
const { register } = useReveal();

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

const pillars = [
  {
    token: "foundations",
    title: "Foundations",
    description:
      "Tokens, colour, type, space and motion. The decisions every component inherits.",
    link: "/foundations",
  },
  {
    token: "components",
    title: "Components",
    description:
      "The pieces the interface is built from, with the props they take and the rules they hold.",
    link: "/components",
  },
  {
    token: "guides",
    title: "Guides",
    description:
      "Theming, governance and enforcement. How the system stays honest over time.",
    link: "/guides",
  },
];

const paths = [
  {
    title: "About the design system",
    description:
      "What the system covers, what it deliberately leaves out, and the reasoning behind both.",
    link: "/get-started/about",
  },
  {
    title: "For plugin authors",
    description:
      "Build a plugin that reads as part of Caido, using the same tokens the interface uses.",
    link: "/get-started/plugins",
  },
  {
    title: "For contributors",
    description:
      "Add or change a token, a component or a rule, and record why the value moved.",
    link: "/get-started/contributing",
  },
];
</script>

<template>
  <div>
    <section
      ref="field"
      class="dot-grid pointer-glow relative overflow-hidden border-b border-line-subtle"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <div
        class="app-shot-fade pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden pl-20 lg:block"
      >
        <img
          :src="withBase('/images/app-light.png')"
          alt="The Caido interface, showing proxy history with a request and response"
          class="app-shot mt-10 block dark:hidden"
        />
        <img
          :src="withBase('/images/app-dark.png')"
          alt=""
          aria-hidden="true"
          class="app-shot mt-10 hidden dark:block"
        />
      </div>

      <div
        class="relative flex flex-col gap-12 px-(--page-gutter) py-16 lg:py-24"
      >
        <div class="flex flex-col items-start gap-6 lg:w-1/2">
          <h1 class="text-display text-fg-strong">
            Explore our
            <span class="whitespace-nowrap">
              <span class="text-fg-secondary">design</span> system
            </span>
          </h1>

          <p class="max-w-measure text-body text-fg-subtle">
            Build Caido interfaces from decisions that already have names.
            Tokens, foundations and components that hold in light and dark.
          </p>

          <button
            type="button"
            class="flex h-(--control-large) cursor-pointer items-center gap-3 rounded bg-fill-primary px-6 text-body-strong text-fg-on-primary transition hover:bg-fill-primary-hover"
            @click="openSearch"
          >
            <i class="fas fa-magnifying-glass" aria-hidden="true" />
            <span>Search the design system</span>
          </button>
        </div>
      </div>
    </section>

    <section
      :ref="register"
      class="reveal flex flex-col gap-8 px-(--page-gutter) py-16"
    >
      <h2 class="text-title text-fg-strong">One vocabulary, end to end</h2>

      <ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <li v-for="pillar in pillars" :key="pillar.token" class="flex">
          <a
            :href="withBase(pillar.link)"
            class="flex flex-1 flex-col gap-3 rounded border border-line-subtle bg-surface-raised p-6 transition hover:border-line-default hover:bg-surface-hover"
          >
            <span class="font-mono text-caption text-fg-secondary">
              {{ pillar.token }}
            </span>
            <span class="text-heading text-fg-strong">{{ pillar.title }}</span>
            <span class="text-body text-fg-subtle">
              {{ pillar.description }}
            </span>
          </a>
        </li>
      </ul>
    </section>

    <section
      :ref="register"
      class="reveal dot-grid-faint flex flex-col gap-8 border-t border-line-subtle bg-surface-subtle px-(--page-gutter) py-16"
    >
      <h2 class="text-title text-fg-strong">Get started</h2>

      <ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <li v-for="path in paths" :key="path.link" class="flex">
          <a
            :href="withBase(path.link)"
            class="flex flex-1 flex-col gap-2 rounded border border-line-subtle bg-surface-raised p-6 transition hover:border-line-default hover:bg-surface-hover"
          >
            <span class="text-heading text-fg-strong">{{ path.title }}</span>
            <span class="text-body text-fg-subtle">{{ path.description }}</span>
          </a>
        </li>
      </ul>

      <div>
        <a
          :href="withBase('/guides')"
          class="inline-flex h-(--control-large) items-center gap-2 rounded border border-line-default px-6 text-body-strong text-fg-strong transition hover:bg-surface-hover"
        >
          <span>Explore all guides</span>
          <i class="fas fa-arrow-right" aria-hidden="true" />
        </a>
      </div>
    </section>
  </div>
</template>
