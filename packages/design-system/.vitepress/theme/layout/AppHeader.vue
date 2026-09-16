<script setup lang="ts">
import { withBase } from "vitepress";

import AppearanceToggle from "./AppearanceToggle.vue";
import AppSearch from "./AppSearch.vue";
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

    <div class="flex items-center gap-4">
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
    </div>
  </header>
</template>
