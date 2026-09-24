<script setup lang="ts">
import { onScopeDispose, ref } from "vue";

const DELAY_MS = 300;
const FLOOR_MS = 500;

const RUNS = [
  { label: "Load in 150ms", duration: 150 },
  { label: "Load in 400ms", duration: 400 },
  { label: "Load in 1.5s", duration: 1500 },
];

const isLoading = ref(false);
const isGuarded = ref(false);
const ran = ref<number | undefined>(undefined);

let showTimer: number | undefined;
let hideTimer: number | undefined;
let doneTimer: number | undefined;
let shownAt = 0;

const clearTimers = () => {
  window.clearTimeout(showTimer);
  window.clearTimeout(hideTimer);
  window.clearTimeout(doneTimer);
  showTimer = undefined;
  hideTimer = undefined;
  doneTimer = undefined;
};

const settle = () => {
  if (!isGuarded.value) return;

  const remaining = FLOOR_MS - (Date.now() - shownAt);
  if (remaining <= 0) {
    isGuarded.value = false;
    return;
  }

  hideTimer = window.setTimeout(() => {
    isGuarded.value = false;
  }, remaining);
};

const run = (duration: number) => {
  clearTimers();
  isLoading.value = true;
  ran.value = duration;

  if (!isGuarded.value) {
    showTimer = window.setTimeout(() => {
      shownAt = Date.now();
      isGuarded.value = true;
    }, DELAY_MS);
  }

  doneTimer = window.setTimeout(() => {
    isLoading.value = false;
    window.clearTimeout(showTimer);
    settle();
  }, duration);
};

onScopeDispose(clearTimers);
</script>

<template>
  <div data-ds class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="option in RUNS"
        :key="option.duration"
        type="button"
        class="rounded border border-line-default bg-surface-raised px-3 py-2 text-body text-fg-default hover:bg-surface-hover"
        @click="run(option.duration)"
      >
        {{ option.label }}
      </button>
      <p class="text-caption text-fg-muted">
        {{
          ran === undefined
            ? "Pick a load and watch both panels"
            : `Last run ${ran}ms`
        }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <section
        class="flex flex-col overflow-hidden rounded border border-line-subtle bg-surface-raised"
      >
        <div
          role="status"
          aria-live="polite"
          :aria-busy="isGuarded"
          class="dot-grid-faint flex h-28 items-center justify-center border-b border-line-subtle bg-surface-page px-4"
        >
          <i
            v-if="isGuarded"
            class="fas fa-spinner animate-spin text-fg-muted icon-message"
            aria-hidden="true"
          />
          <p v-else-if="!isLoading" class="text-body text-fg-default">
            42 requests
          </p>
        </div>
        <div class="flex flex-col gap-1 p-4">
          <p class="text-body-strong text-fg-default">With the delay</p>
          <p class="text-caption text-fg-muted">
            Under 300ms nothing appears at all. Past it the indicator is held
            for 500ms, so the 400ms load runs on to 800ms rather than flicker.
          </p>
        </div>
      </section>

      <section
        class="flex flex-col overflow-hidden rounded border border-line-subtle bg-surface-raised"
      >
        <div
          role="status"
          aria-live="polite"
          :aria-busy="isLoading"
          class="dot-grid-faint flex h-28 items-center justify-center border-b border-line-subtle bg-surface-page px-4"
        >
          <i
            v-if="isLoading"
            class="fas fa-spinner animate-spin text-fg-muted icon-message"
            aria-hidden="true"
          />
          <p v-else class="text-body text-fg-default">42 requests</p>
        </div>
        <div class="flex flex-col gap-1 p-4">
          <p class="text-body-strong text-fg-default">Without it</p>
          <p class="text-caption text-fg-muted">
            Every load flashes an indicator, including the one that finishes
            before anybody could read it.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
