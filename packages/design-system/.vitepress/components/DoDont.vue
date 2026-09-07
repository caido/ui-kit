<script setup lang="ts">
withDefaults(
  defineProps<{
    do?: string;

    dont?: string;

    mode?: "dark" | "light" | "page";

    align?: "center" | "start";
  }>(),
  { mode: "dark", align: "center" },
);
</script>

<template>
  <div class="dd">
    <section class="dd-col is-do">
      <div
        class="ds-scope dd-stage"
        :class="`al-${$props.align}`"
        :data-mode="$props.mode === 'page' ? undefined : $props.mode"
      >
        <slot name="do" />
      </div>
      <footer class="dd-foot">
        <span class="dd-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path
              d="M2.5 8.5l3.5 3.5 7.5-8"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="dd-body"
          ><b>Do</b>{{ $props.do ? " " + $props.do : "" }}</span
        >
      </footer>
    </section>

    <section class="dd-col is-dont">
      <div
        class="ds-scope dd-stage"
        :class="`al-${$props.align}`"
        :data-mode="$props.mode === 'page' ? undefined : $props.mode"
      >
        <slot name="dont" />
      </div>
      <footer class="dd-foot">
        <span class="dd-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path
              d="M4 4l8 8M12 4l-8 8"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="dd-body"
          ><b>Do not</b>{{ $props.dont ? " " + $props.dont : "" }}</span
        >
      </footer>
    </section>
  </div>
</template>

<style scoped>
.dd {
  display: grid;
  gap: 16px;
  margin: 24px 0;
}
@media (min-width: 800px) {
  .dd {
    grid-template-columns: 1fr 1fr;
  }
}

.dd-col {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}

.dd-stage {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 128px;
  padding: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.dd-stage.al-center {
  justify-content: center;
}
.dd-stage.al-start {
  align-items: flex-start;
  flex-direction: column;
}

.dd-foot {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px 14px;
  font-size: 14px;
  line-height: 1.5;
  background: var(--vp-c-bg-soft);
}
.dd-body b {
  font-weight: 600;
}
.dd-body b::after {
  content: ".";
}

.dd-mark {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 9999px;
  color: #ffffff;
}

.is-do .dd-mark {
  background: #1c7c2e;
}
.is-do .dd-body b {
  color: #146023;
}
.is-dont .dd-mark {
  background: #ab2c00;
}
.is-dont .dd-body b {
  color: #8e2400;
}

.dark .is-do .dd-body b {
  color: #7fc07f;
}
.dark .is-dont .dd-body b {
  color: #f0ad9e;
}
.dark .is-do .dd-mark {
  background: #2a8d3c;
}
.dark .is-dont .dd-mark {
  background: #c2400f;
}

@media print {
  .dd {
    grid-template-columns: 1fr 1fr;
    break-inside: avoid;
  }
}
</style>
