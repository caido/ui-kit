<script setup lang="ts">
import { computed, ref } from "vue";

import groups from "../data/tokens.json";

type Token = { name: string; light: string; dark: string; desc: string };
type Group = { group: string; tokens: Token[] };

const all = groups as Group[];
const total = all.reduce((n, g) => n + g.tokens.length, 0);

const query = ref("");

const matched = computed<Group[]>(() => {
  const terms = query.value.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return all;
  return all
    .map((g) => ({
      group: g.group,
      tokens: g.tokens.filter((t) => {
        const haystack = `${t.name} ${t.desc}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      }),
    }))
    .filter((g) => g.tokens.length > 0);
});

const shown = computed(() =>
  matched.value.reduce((n, g) => n + g.tokens.length, 0),
);
const isHex = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

function copy(value: string) {
  if (typeof navigator !== "undefined" && "clipboard" in navigator) {
    void navigator.clipboard.writeText(value);
  }
}
</script>

<template>
  <div class="my-7">
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-[260px] flex-1">
        <i
          class="fas fa-magnifying-glass pointer-events-none absolute text-caption text-ink-faint"
          style="left: 12px; top: 50%; margin-top: -6px; line-height: 1"
          aria-hidden="true"
        />
        <input
          v-model="query"
          type="search"
          aria-label="Search for tokens"
          placeholder="Search for tokens"
          class="h-lg w-full rounded-md border border-control bg-inset pl-9 pr-3 text-body text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]"
        />
      </div>
      <p class="m-0 text-caption text-ink-muted" aria-live="polite">
        {{
          shown === total ? `${total} tokens` : `${shown} of ${total} tokens`
        }}
      </p>
    </div>

    <p
      v-if="shown === 0"
      class="mt-6 rounded-md bg-inset p-4 text-body text-ink-muted"
    >
      No token matches that. Try a property segment such as <code>bg</code>,
      <code>fg</code> or <code>border</code>.
    </p>

    <section v-for="group in matched" :key="group.group" class="mt-8">
      <h3 class="m-0 text-title font-semibold text-ink">{{ group.group }}</h3>

      <div class="mt-3 overflow-x-auto rounded-md border border-separator">
        <div class="min-w-[720px]">
          <div
            class="grid grid-cols-[minmax(210px,1.1fr)_108px_108px_minmax(220px,1.6fr)] gap-3 border-b border-separator bg-inset px-3 py-2 text-caption font-semibold text-ink-muted"
          >
            <span>Token</span>
            <span>Light</span>
            <span>Dark</span>
            <span>What it is for</span>
          </div>

          <div
            v-for="token in group.tokens"
            :key="token.name"
            class="grid grid-cols-[minmax(210px,1.1fr)_108px_108px_minmax(220px,1.6fr)] items-center gap-3 border-b border-separator px-3 py-2 last:border-b-0 hover:bg-selected"
          >
            <button
              type="button"
              class="cursor-pointer truncate border-0 bg-transparent p-0 text-left text-code text-ink"
              :title="`Copy ${token.name}`"
              @click="copy(token.name)"
            >
              {{ token.name }}
            </button>

            <span class="flex items-center gap-2 text-code text-ink-muted">
              <span
                v-if="isHex(token.light)"
                class="h-4 w-4 shrink-0 rounded-xs border border-separator"
                :style="{ backgroundColor: token.light }"
              />
              <span class="truncate">{{ token.light }}</span>
            </span>

            <span class="flex items-center gap-2 text-code text-ink-muted">
              <span
                v-if="isHex(token.dark)"
                class="h-4 w-4 shrink-0 rounded-xs border border-separator"
                :style="{ backgroundColor: token.dark }"
              />
              <span class="truncate">{{ token.dark }}</span>
            </span>

            <span class="text-dense text-ink-muted">{{ token.desc }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
