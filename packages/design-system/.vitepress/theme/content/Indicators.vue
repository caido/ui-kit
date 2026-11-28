<script setup lang="ts">
const INDICATORS = [
  {
    kind: "skeleton",
    name: "Skeleton",
    when: "The shape is already known",
  },
  {
    kind: "spinner",
    name: "Spinner",
    when: "The result has no shape yet",
  },
  {
    kind: "bar",
    name: "Progress bar",
    when: "There is a real numerator",
  },
];
</script>

<template>
  <div data-ds class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <section
      v-for="indicator in INDICATORS"
      :key="indicator.kind"
      class="flex flex-col overflow-hidden rounded border border-line-subtle bg-surface-raised"
    >
      <div
        class="dot-grid-faint flex h-24 items-center justify-center border-b border-line-subtle bg-surface-page px-4"
      >
        <div
          v-if="indicator.kind === 'skeleton'"
          class="flex w-full max-w-xs flex-col gap-2"
        >
          <div class="h-3 w-full animate-pulse rounded bg-surface-selected" />
          <div class="h-3 w-4/5 animate-pulse rounded bg-surface-selected" />
          <div class="h-3 w-3/5 animate-pulse rounded bg-surface-selected" />
        </div>

        <i
          v-else-if="indicator.kind === 'spinner'"
          class="fas fa-spinner animate-spin text-fg-muted icon-message"
          aria-hidden="true"
        />

        <div
          v-else
          class="flex w-full max-w-xs flex-col gap-2 rounded bg-surface-raised p-3"
        >
          <div
            class="flex items-center justify-between text-caption text-fg-muted"
          >
            <span>Downloading update</span>
            <span class="font-mono">60%</span>
          </div>
          <div class="h-3 w-full overflow-hidden rounded bg-surface-page">
            <div class="h-full w-3/5 rounded bg-fill-secondary" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1 p-4">
        <p class="text-body-strong text-fg-default">{{ indicator.name }}</p>
        <p class="text-caption text-fg-muted">{{ indicator.when }}</p>
      </div>
    </section>
  </div>
</template>
