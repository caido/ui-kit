<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Panel = {
  label?: string;
  lines?: string[];

  size?: number;

  minSize?: number;
};

const props = withDefaults(
  defineProps<{
    layout?: "horizontal" | "vertical";
    panels?: Panel[];

    step?: number;

    stateKey?: string;
    stateStorage?: "local" | "session";

    stage?: "sm" | "md" | "lg";

    nested?: boolean;
  }>(),
  {
    layout: "horizontal",
    panels: () => [
      {
        label: "Requests",
        lines: ["GET /api/v1/session", "GET /assets/app.js"],
      },
      { label: "Response", lines: ["200 OK", "content-length: 1428"] },
    ],
    step: 5,
    stateKey: undefined,
    stateStorage: "session",
    stage: "md",
    nested: false,
  },
);

const GUTTER = 4;

const REPEAT = 40;

const rootEl = ref<HTMLElement | undefined>(undefined);
const resizing = ref(false);
const sizes = ref<number[]>(
  props.panels.map((panel) => panel.size ?? 100 / props.panels.length),
);

const isHorizontal = computed(() => props.layout === "horizontal");
const gutterCount = computed(() => props.panels.length - 1);

const storage = () => {
  if (props.stateKey === undefined || typeof window === "undefined")
    return undefined;
  return props.stateStorage === "local"
    ? window.localStorage
    : window.sessionStorage;
};

const save = () => {
  const store = storage();
  if (store === undefined || props.stateKey === undefined) return;
  store.setItem(props.stateKey, JSON.stringify(sizes.value));
};

const restore = () => {
  const store = storage();
  if (store === undefined || props.stateKey === undefined) return;
  const raw = store.getItem(props.stateKey);
  if (raw === null) return;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length !== props.panels.length) return;
  if (!parsed.every((value) => typeof value === "number")) return;
  sizes.value = parsed;
};

const measure = () => {
  const el = rootEl.value;
  if (el === undefined) return 0;
  return isHorizontal.value ? el.clientWidth : el.clientHeight;
};

const commit = (index: number, prev: number, next: number) => {
  if (prev > 100 || prev < 0 || next > 100 || next < 0) return;
  const prevMin = props.panels[index]?.minSize;
  if (prevMin !== undefined && prevMin > prev) return;
  const nextMin = props.panels[index + 1]?.minSize;
  if (nextMin !== undefined && nextMin > next) return;
  const updated = [...sizes.value];
  updated[index] = prev;
  updated[index + 1] = next;
  sizes.value = updated;
};

const basis = (index: number) =>
  `calc(${sizes.value[index] ?? 0}% - ${gutterCount.value * GUTTER}px)`;

let activeIndex = 0;
let startPos = 0;
let startPrev = 0;
let startNext = 0;

const pointerPos = (event: PointerEvent) =>
  isHorizontal.value ? event.pageX : event.pageY;

const onPointerdown = (event: PointerEvent, index: number) => {
  if (event.button !== 0) return;
  event.preventDefault();
  activeIndex = index;
  startPos = pointerPos(event);
  startPrev = sizes.value[index] ?? 0;
  startNext = sizes.value[index + 1] ?? 0;
  resizing.value = true;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
};

const onPointermove = (event: PointerEvent) => {
  if (!resizing.value) return;
  const total = measure();
  if (total <= 0) return;
  const delta = ((pointerPos(event) - startPos) * 100) / total;
  commit(activeIndex, startPrev + delta, startNext - delta);
};

const onPointerup = (event: PointerEvent) => {
  if (!resizing.value) return;
  const el = event.currentTarget as HTMLElement;
  if (el.hasPointerCapture(event.pointerId))
    el.releasePointerCapture(event.pointerId);
  resizing.value = false;
  save();
};

let timer: number | undefined = undefined;

const stepFor = (event: KeyboardEvent) => {
  if (isHorizontal.value) {
    if (event.key === "ArrowLeft") return -props.step;
    if (event.key === "ArrowRight") return props.step;
    return undefined;
  }
  if (event.key === "ArrowUp") return -props.step;
  if (event.key === "ArrowDown") return props.step;
  return undefined;
};

const nudge = (index: number, pixels: number) => {
  const total = measure();
  if (total <= 0) return;
  const prevPx = ((sizes.value[index] ?? 0) / 100) * total;
  const nextPx = ((sizes.value[index + 1] ?? 0) / 100) * total;
  commit(
    index,
    ((prevPx + pixels) * 100) / total,
    ((nextPx - pixels) * 100) / total,
  );
};

const stopRepeat = () => {
  if (timer === undefined) return;
  window.clearInterval(timer);
  timer = undefined;
  save();
};

const onKeydown = (event: KeyboardEvent, index: number) => {
  const pixels = stepFor(event);
  if (pixels === undefined) return;
  event.preventDefault();
  nudge(index, pixels);
  if (timer !== undefined) return;
  timer = window.setInterval(() => nudge(index, pixels), REPEAT);
};

onMounted(restore);
onBeforeUnmount(stopRepeat);

const valueNow = (index: number) => Math.round(sizes.value[index] ?? 0);
const valueMin = (index: number) =>
  Math.round(props.panels[index]?.minSize ?? 0);
const valueMax = (index: number) =>
  Math.round(
    (sizes.value[index] ?? 0) +
      (sizes.value[index + 1] ?? 0) -
      (props.panels[index + 1]?.minSize ?? 0),
  );

const stageHeight = { sm: "h-[180px]", md: "h-[220px]", lg: "h-[280px]" };

const rootClass = computed(() => [
  "flex min-h-0 min-w-0 flex-nowrap rounded-md bg-transparent text-ink",
  isHorizontal.value ? "flex-row" : "flex-col",
  props.nested ? "size-full grow" : `w-full ${stageHeight[props.stage]}`,
  resizing.value
    ? `select-none ${isHorizontal.value ? "cursor-col-resize" : "cursor-row-resize"}`
    : "",
]);

const panelClass = "flex min-h-0 min-w-0 grow overflow-hidden";

const trackClass = computed(() => [
  "flex shrink-0 grow-0 basis-[4px] items-center justify-center bg-transparent",
  "touch-none transition-all duration-200",
  isHorizontal.value ? "cursor-col-resize" : "cursor-row-resize",
]);

const handleClass = computed(() => [
  "z-20 m-px rounded-md bg-gutter-handle transition-all duration-200",
  "focus:outline-none focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]",
  isHorizontal.value ? "h-lg w-[2px]" : "h-[2px] w-lg",
]);

const cardClass =
  "flex size-full min-h-0 min-w-0 flex-col overflow-hidden rounded-sm bg-raised shadow-md";
const cardHeadClass =
  "flex h-xl flex-none items-center whitespace-nowrap border-b-2 border-separator px-3 " +
  "text-body font-semibold text-ink";
</script>

<template>
  <div ref="rootEl" :class="rootClass">
    <template v-for="(panel, index) in panels" :key="index">
      <div :class="panelClass" :style="{ flexBasis: basis(index) }">
        <slot :name="`panel-${index}`">
          <div :class="cardClass">
            <div :class="cardHeadClass">{{ panel.label }}</div>
            <div class="min-h-0 flex-1 overflow-auto p-3">
              <div
                v-for="line in panel.lines"
                :key="line"
                class="mb-1.5 whitespace-nowrap text-code text-ink-muted last:mb-0"
              >
                {{ line }}
              </div>
            </div>
          </div>
        </slot>
      </div>

      <div
        v-if="index < gutterCount"
        :class="trackClass"
        @pointerdown="onPointerdown($event, index)"
        @pointermove="onPointermove"
        @pointerup="onPointerup"
        @pointercancel="onPointerup"
      >
        <div
          :class="handleClass"
          role="separator"
          tabindex="0"
          :aria-orientation="isHorizontal ? 'vertical' : 'horizontal'"
          :aria-label="panel.label"
          :aria-valuenow="valueNow(index)"
          :aria-valuemin="valueMin(index)"
          :aria-valuemax="valueMax(index)"
          @keydown="onKeydown($event, index)"
          @keyup="stopRepeat"
          @blur="stopRepeat"
        />
      </div>
    </template>
  </div>
</template>
