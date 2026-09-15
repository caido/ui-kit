<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;

    mode?: "both" | "dark" | "light" | "page";

    center?: boolean;

    stack?: boolean;

    spread?: boolean;

    note?: string;
  }>(),
  { mode: "both", center: false, stack: false, spread: false },
);
</script>

<template>
  <div class="pv">
    <div v-if="title || note" class="pv-head">
      <span class="pv-title">{{ title }}</span>
      <span v-if="note" class="pv-note">{{ note }}</span>
    </div>

    <div v-if="mode === 'both'" class="pv-split">
      <div
        class="ds-scope pv-stage"
        :class="{ 'is-center': center, 'is-stack': stack, 'is-spread': spread }"
        data-mode="dark"
      >
        <slot />
      </div>
      <div
        class="ds-scope pv-stage"
        :class="{ 'is-center': center, 'is-stack': stack, 'is-spread': spread }"
        data-mode="light"
      >
        <slot />
      </div>
    </div>

    <div
      v-else
      class="ds-scope pv-stage"
      :class="{ 'is-center': center, 'is-stack': stack, 'is-spread': spread }"
      :data-mode="mode === 'page' ? undefined : mode"
    >
      <slot />
    </div>

    <details v-if="$slots.code" class="pv-code">
      <summary>Code</summary>
      <slot name="code" />
    </details>
  </div>
</template>

<style scoped>
.pv {
  margin: 22px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}
.pv-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.pv-title {
  font-size: 13px;
  font-weight: 600;
}
.pv-note {
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  padding: 2px 8px;
  border-radius: 9999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.pv-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.pv-split > * + * {
  border-left: 1px solid var(--vp-c-divider);
}

.pv-stage {
  position: relative;
  padding: 28px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-height: 84px;
}
.pv-stage.is-center {
  justify-content: center;
}

.pv-stage.is-spread {
  justify-content: space-between;
  gap: 32px;
  align-items: flex-start;
}
.pv-stage.is-spread > * {
  flex: 1 1 0;
  min-width: 0;
}
.pv-stage.is-stack {
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
}
.pv-stage.is-stack > * {
  width: 100%;
  max-width: none;
}

.pv-code {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.pv-code > summary {
  cursor: pointer;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  list-style: none;
}
.pv-code > summary::-webkit-details-marker {
  display: none;
}
.pv-code > summary::before {
  content: "› ";
  display: inline-block;
  transition: transform 110ms;
}
.pv-code[open] > summary::before {
  transform: rotate(90deg);
}
.pv-code :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
}

@media (max-width: 720px) {
  .pv-split {
    grid-template-columns: 1fr;
  }
  .pv-split > * + * {
    border-left: 0;
    border-top: 1px solid var(--vp-c-divider);
  }
}
@media print {
  .pv-code {
    display: none;
  }
  .pv {
    break-inside: avoid;
  }
}
</style>
