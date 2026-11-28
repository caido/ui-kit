<script setup lang="ts">
import { withBase } from "vitepress";

import AppearanceToggle from "./AppearanceToggle.vue";
import AppSearch from "./AppSearch.vue";

const socials = [
  {
    label: "Caido on Discord",
    icon: "fa-brands fa-discord",
    href: "https://links.caido.io/discord",
  },
  {
    label: "Caido on X",
    icon: "fa-brands fa-x-twitter",
    href: "https://x.com/caidoio",
  },
  {
    label: "Caido on GitHub",
    icon: "fa-brands fa-github",
    href: "https://github.com/caido/caido",
  },
];
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-(--header-height) items-center justify-between gap-4 border-b border-line-subtle bg-surface-raised px-4"
  >
    <a
      :href="withBase('/')"
      class="flex items-center gap-2 text-body-strong text-fg-strong"
    >
      <!-- eslint-disable design/no-arbitrary-value -- the mark is set against the label beside it, so its height is that label's line box and has to move with the text setting -->
      <img
        :src="withBase('/logo.svg')"
        alt=""
        aria-hidden="true"
        class="h-[1lh] w-auto"
      />
      <!-- eslint-enable design/no-arbitrary-value -->
      <span>Design System</span>
    </a>

    <div class="flex shrink-0 items-center gap-4">
      <nav aria-label="Sections" class="flex items-center gap-1">
        <a
          :href="withBase('/design-system')"
          class="flex h-(--control-default) items-center rounded px-3 text-body text-fg-default transition hover:bg-surface-hover"
        >
          Design system
        </a>
      </nav>

      <AppSearch />
      <AppearanceToggle />

      <div class="hidden h-6 w-px bg-line-subtle lg:block" aria-hidden="true" />

      <nav
        aria-label="Caido elsewhere"
        class="hidden items-center gap-1 lg:flex"
      >
        <a
          v-for="social in socials"
          :key="social.href"
          :href="social.href"
          target="_blank"
          rel="noreferrer"
          :aria-label="social.label"
          :title="social.label"
          class="flex size-(--control-default) items-center justify-center rounded text-fg-muted transition hover:bg-surface-hover hover:text-fg-default"
        >
          <i :class="social.icon" aria-hidden="true" />
        </a>
      </nav>
    </div>
  </header>
</template>
