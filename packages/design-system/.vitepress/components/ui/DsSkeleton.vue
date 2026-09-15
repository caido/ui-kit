<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

import DsButton from "./DsButton.vue";

type Variant =
  | "text"
  | "block"
  | "row"
  | "spinner"
  | "progress-indeterminate"
  | "progress-determinate";

type TextRole = "body" | "body-dense" | "caption" | "title";
type Density = "dense" | "comfortable";
type SpinnerSize = "sm" | "md" | "lg";
type Phase = "idle" | "pending" | "loading" | "resolved";

const props = withDefaults(
  defineProps<{
    variant?: Variant;

    textRole?: TextRole;
    lines?: number;

    width?: string;
    height?: string;

    radius?: number;
    rows?: number;
    columns?: string[];
    density?: Density;
    size?: SpinnerSize;

    label?: string;

    hideLabel?: boolean;
    value?: number;
    max?: number;
    noun?: string;
    sheen?: boolean;
    demo?: boolean;
  }>(),
  {
    variant: "text",
    textRole: "body",
    lines: 3,
    width: "240px",
    height: "120px",
    radius: 6,
    rows: 4,
    density: "dense",
    size: "md",
    label: "Loading requests…",
    hideLabel: false,
    value: 142,
    max: 3180,
    noun: "requests",
    sheen: true,
    demo: false,
  },
);

const TEXT_CLASSES: Record<
  TextRole,
  { gap: string; line: string; bar: string }
> = {
  body: { gap: "gap-2", line: "h-[20px]", bar: "h-[8px]" },
  "body-dense": { gap: "gap-2", line: "h-[18px]", bar: "h-[8px]" },
  caption: { gap: "gap-1.5", line: "h-[16px]", bar: "h-[6px]" },
  title: { gap: "gap-2", line: "h-[24px]", bar: "h-[8px]" },
};

const ROW_CLASSES: Record<Density, { row: string; pad: string }> = {
  dense: { row: "h-sm", pad: "px-3 gap-x-3" },
  comfortable: { row: "h-md", pad: "px-4 gap-x-4" },
};

const MARK_CLASSES: Record<
  SpinnerSize,
  { box: string; ring: string; gap: string }
> = {
  sm: { box: "h-4 w-4 border-2 border-transparent", ring: "", gap: "gap-2" },
  md: { box: "h-6 w-6 border-2", ring: "border-inset", gap: "gap-3" },
  lg: {
    box: "h-8 w-8 border-[3px] motion-reduce:h-6 motion-reduce:w-6 motion-reduce:border-2",
    ring: "border-inset",
    gap: "gap-4",
  },
};

const SPINNER_LAYOUT: Record<SpinnerSize, string> = {
  sm: "flex items-center",
  md: "flex flex-col items-center justify-center",
  lg: "flex flex-col items-center justify-center",
};

const DEFAULT_COLUMNS = ["56px", "1fr", "48px", "72px"];

const REGION = "relative pointer-events-none";

const BAR =
  "block rounded-md bg-skeleton animate-pulse motion-reduce:animate-none";
const SHEEN =
  "pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r " +
  "from-transparent via-selected to-transparent animate-sheen motion-reduce:hidden";
const ROW = "grid box-border items-center border-t border-separator";

const text = computed(() => TEXT_CLASSES[props.textRole]);
const rowBox = computed(() => ROW_CLASSES[props.density]);
const markBox = computed(() => MARK_CLASSES[props.size]);
const cols = computed(() => props.columns ?? DEFAULT_COLUMNS);
const gridStyle = computed(() => ({
  gridTemplateColumns: cols.value.join(" "),
}));

const blockStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: `${props.radius}px`,
}));

const NUMBER = new Intl.NumberFormat("en-US");
const countText = computed(
  () =>
    `${NUMBER.format(props.value)} of ${NUMBER.format(props.max)} ${props.noun}`,
);
const percent = computed(() => Math.round((props.value / props.max) * 100));

const GATE = 400;
const MIN_VISIBLE = 500;

const DEMO_ROWS = [
  {
    method: "GET",
    path: "/api/v1/users",
    status: "200",
    tone: "text-success-ink",
    size: "1.2 kB",
  },
  {
    method: "POST",
    path: "/api/v1/login",
    status: "302",
    tone: "text-info-ink",
    size: "840 B",
  },
  {
    method: "GET",
    path: "/api/v1/session",
    status: "200",
    tone: "text-success-ink",
    size: "412 B",
  },
  {
    method: "DELETE",
    path: "/api/v1/tokens/9",
    status: "204",
    tone: "text-ink-muted",
    size: "0 B",
  },
];

const phase = ref<Phase>("idle");
const message = ref("");
const shownAt = ref(0);
const timers = ref<ReturnType<typeof setTimeout>[]>([]);

const clearTimers = () => {
  timers.value.forEach(clearTimeout);
  timers.value = [];
};

const resolveNow = () => {
  phase.value = "resolved";
  message.value = `${DEMO_ROWS.length} ${props.noun} loaded`;
};

const start = (duration: number) => {
  clearTimers();
  phase.value = "pending";
  message.value = "";
  timers.value.push(
    setTimeout(() => {
      phase.value = "loading";
      shownAt.value = Date.now();
      message.value = props.label;
    }, GATE),
  );
  timers.value.push(
    setTimeout(() => {
      const held =
        phase.value === "loading" ? Date.now() - shownAt.value : MIN_VISIBLE;
      const hold = Math.max(0, MIN_VISIBLE - held);
      if (hold === 0) {
        resolveNow();
        return;
      }
      timers.value.push(setTimeout(resolveNow, hold));
    }, duration),
  );
};

const reset = () => {
  clearTimers();
  phase.value = "idle";
  message.value = "";
};

const isBusy = computed(
  () => phase.value === "pending" || phase.value === "loading",
);

onBeforeUnmount(clearTimers);
</script>

<template>
  <div v-if="demo" class="relative w-full">
    <div class="mb-3 flex items-center gap-2">
      <DsButton
        variant="primary"
        size="sm"
        icon="fas fa-play"
        label="Load (1.4s)"
        :disabled="isBusy"
        @click="start(1400)"
      />
      <DsButton
        variant="secondary"
        size="sm"
        icon="fas fa-bolt"
        label="Load (120ms)"
        :disabled="isBusy"
        @click="start(120)"
      />
      <DsButton
        variant="ghost"
        size="sm"
        icon="fas fa-rotate-left"
        label="Reset"
        @click="reset"
      />
      <span class="ml-1 text-caption tabular-nums text-ink-faint">{{
        phase
      }}</span>
    </div>

    <div
      class="overflow-hidden rounded-md border border-separator bg-raised"
      :aria-busy="isBusy || undefined"
    >
      <div
        :class="[
          ROW,
          rowBox.row,
          rowBox.pad,
          'border-t-0 bg-subtle text-caption text-ink-muted',
        ]"
        :style="gridStyle"
        aria-hidden="true"
      >
        <span>Method</span><span>Path</span><span>Status</span><span>Size</span>
      </div>

      <template v-if="phase === 'resolved'">
        <div
          v-for="r in DEMO_ROWS"
          :key="r.path"
          :class="[ROW, rowBox.row, rowBox.pad]"
          :style="gridStyle"
        >
          <span class="truncate font-mono text-code text-ink">{{
            r.method
          }}</span>
          <span class="truncate font-mono text-code text-ink">{{
            r.path
          }}</span>
          <span class="truncate font-mono text-code" :class="r.tone">{{
            r.status
          }}</span>
          <span class="truncate font-mono text-code text-ink">{{
            r.size
          }}</span>
        </div>
      </template>

      <div v-else class="relative overflow-hidden">
        <div
          v-for="n in DEMO_ROWS.length"
          :key="n"
          :class="[ROW, rowBox.row, rowBox.pad]"
          :style="gridStyle"
        >
          <template v-if="phase === 'loading'">
            <span
              v-for="i in cols.length"
              :key="i"
              :class="[BAR, 'h-[8px] w-full']"
              aria-hidden="true"
            />
          </template>
        </div>
        <span
          v-if="phase === 'loading' && sheen"
          :class="SHEEN"
          aria-hidden="true"
        />
      </div>
    </div>

    <p class="mt-2 text-caption text-ink-faint">
      Gate 400ms, minimum visible 500ms. The 120ms load paints nothing at all.
    </p>
    <span class="sr-only" role="status">{{ message }}</span>
  </div>

  <div
    v-else-if="variant === 'text'"
    :class="[
      REGION,
      text.gap,
      'flex w-full max-w-[320px] flex-col overflow-hidden',
    ]"
    aria-busy="true"
  >
    <span
      v-for="n in lines"
      :key="n"
      :class="['flex items-center', text.line]"
      aria-hidden="true"
    >
      <span
        :class="[BAR, text.bar, lines > 1 && n === lines ? 'w-3/5' : 'w-full']"
      />
    </span>
    <span v-if="sheen" :class="SHEEN" aria-hidden="true" />
    <span class="sr-only" role="status">{{ label }}</span>
  </div>

  <div
    v-else-if="variant === 'block'"
    :class="[
      REGION,
      'overflow-hidden bg-skeleton animate-pulse motion-reduce:animate-none',
    ]"
    :style="blockStyle"
    aria-busy="true"
  >
    <span v-if="sheen" :class="SHEEN" aria-hidden="true" />
    <span class="sr-only" role="status">{{ label }}</span>
  </div>

  <div
    v-else-if="variant === 'row'"
    :class="[REGION, 'w-full overflow-hidden']"
    aria-busy="true"
  >
    <div
      v-for="n in rows"
      :key="n"
      :class="[ROW, rowBox.row, rowBox.pad, 'first:border-t-0']"
      :style="gridStyle"
    >
      <span
        v-for="i in cols.length"
        :key="i"
        :class="[BAR, 'h-[8px] w-full']"
        aria-hidden="true"
      />
    </div>
    <span v-if="sheen" :class="SHEEN" aria-hidden="true" />
    <span class="sr-only" role="status">{{ label }}</span>
  </div>

  <div
    v-else-if="variant === 'spinner'"
    :class="[REGION, SPINNER_LAYOUT[size], markBox.gap]"
    aria-busy="true"
  >
    <span
      v-if="hideLabel"
      :class="[
        'rounded-full border-t-ink-muted animate-spin',
        markBox.box,
        markBox.ring,
      ]"
      role="progressbar"
      :aria-label="label"
      :aria-valuetext="label"
    />
    <span
      v-else
      :class="[
        'rounded-full border-t-ink-muted animate-spin',
        markBox.box,
        markBox.ring,
      ]"
      aria-hidden="true"
    />
    <span v-if="!hideLabel" class="text-body text-ink-muted" role="status">{{
      label
    }}</span>
  </div>

  <div
    v-else-if="variant === 'progress-indeterminate'"
    class="relative h-[2px] w-full overflow-hidden bg-separator"
    role="progressbar"
    :aria-label="label"
    :aria-valuetext="label"
  >
    <span
      class="block h-full w-1/4 bg-accent animate-sweep motion-reduce:w-full motion-reduce:animate-none"
    />
  </div>

  <div v-else class="flex w-full max-w-[320px] flex-col gap-1">
    <span class="text-caption text-ink">{{ countText }}</span>
    <div
      class="h-[4px] overflow-hidden rounded-md bg-skeleton"
      role="progressbar"
      :aria-label="`Loading ${noun}`"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="value"
      :aria-valuetext="countText"
    >
      <span
        class="block h-full rounded-xs bg-accent transition-[width] duration-4 ease-standard motion-reduce:transition-none"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
