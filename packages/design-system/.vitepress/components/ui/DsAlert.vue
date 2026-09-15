<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";

type Intent = "danger" | "warning" | "success" | "info" | "neutral";
type Form = "inline" | "toast" | "toaster";
type Size = "sm" | "md";

type Box = {
  id: number;
  intent: Intent;
  summary: string;
  detail?: string;
  actions: string[];
  dismissible: boolean;
  entering: boolean;
  leaving: boolean;
};

type Region = {
  key: string;
  role?: "status" | "alert";
  items: Box[];
};

const props = withDefaults(
  defineProps<{
    form?: Form;
    intent?: Intent;
    size?: Size;
    summary?: string;
    detail?: string;

    actions?: string[];

    loading?: boolean;
    dismissible?: boolean;
  }>(),
  {
    form: "inline",
    intent: "info",
    size: "md",
    summary: "Project saved",
    actions: () => [],
    loading: false,
    dismissible: true,
  },
);

const INTENTS: Record<Intent, { icon: string; ink: string; box: string }> = {
  danger: {
    icon: "fas fa-circle-exclamation",
    ink: "text-danger-ink",
    box: "bg-[color-mix(in_srgb,var(--c-danger-fg)_14%,var(--c-bg-raised))] border-[color-mix(in_srgb,var(--c-danger-fg)_55%,var(--c-bg-raised))]",
  },
  warning: {
    icon: "fas fa-triangle-exclamation",
    ink: "text-gold-ink",
    box: "bg-[color-mix(in_srgb,var(--c-gold-fg)_14%,var(--c-bg-raised))] border-[color-mix(in_srgb,var(--c-gold-fg)_55%,var(--c-bg-raised))]",
  },
  success: {
    icon: "fas fa-circle-check",
    ink: "text-success-ink",
    box: "bg-[color-mix(in_srgb,var(--c-success-fg)_14%,var(--c-bg-raised))] border-[color-mix(in_srgb,var(--c-success-fg)_55%,var(--c-bg-raised))]",
  },
  info: {
    icon: "fas fa-circle-info",
    ink: "text-info-ink",
    box: "bg-[color-mix(in_srgb,var(--c-info-fg)_14%,var(--c-bg-raised))] border-[color-mix(in_srgb,var(--c-info-fg)_55%,var(--c-bg-raised))]",
  },
  neutral: {
    icon: "",
    ink: "text-ink-muted",
    box: "bg-raised border-separator",
  },
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const CONTROL =
  "inline-flex cursor-pointer items-center justify-center rounded-sm border border-solid " +
  "bg-transparent text-ink transition-colors duration-1 ease-standard motion-reduce:transition-none " +
  "hover:bg-[var(--c-state-hover)] active:bg-[var(--c-state-pressed)] aria-disabled:cursor-default " +
  FOCUS_RING;

const SIZING =
  "h-sm gap-2 whitespace-nowrap px-2.5 text-body font-medium leading-none";

const ACTION = `${CONTROL} border-transparent ${SIZING}`;

const TRIGGER = `${CONTROL} border-control ${SIZING}`;

const ROOTS: Record<Form, string> = {
  inline: "w-full min-w-0 basis-full",
  toast: "inline-block",
  toaster:
    "relative w-full min-w-0 basis-full min-h-[392px] rounded-lg border border-solid border-separator bg-canvas p-4",
};

const BOX_FORM = {
  inline: {
    md: "border-l-4 min-h-xl py-3 pl-[13px] pr-4 transition-opacity duration-2 ease-standard motion-reduce:transition-none",
    sm: "border-l-4 min-h-md py-1.5 pl-[9px] pr-3 transition-opacity duration-2 ease-standard motion-reduce:transition-none",
  },
  toast:
    "min-h-xl min-w-[288px] max-w-[336px] px-4 py-3 shadow-lg transition-opacity duration-2 ease-standard motion-reduce:transition-none",
  toaster:
    "min-h-xl min-w-[288px] max-w-[336px] px-4 py-3 shadow-lg transition-all",
};

const COPY: Record<
  Exclude<Intent, "neutral">,
  { summary: string; detail?: string }
> = {
  success: { summary: "Project saved" },
  info: {
    summary: "42 requests exported",
    detail:
      "The archive is in the downloads panel and in the notification log.",
  },
  warning: {
    summary: "Response truncated at 2 MB",
    detail:
      "The body was larger than the render limit. The full response is in the log.",
  },
  danger: {
    summary: "Replay send failed",
    detail: "Connection refused by 10.0.0.14:8443.",
  },
};

const leaving = ref(false);
const dismissed = ref(false);

const staticBox = computed<Box>(() => ({
  id: 0,
  intent: props.intent,
  summary: props.summary,
  detail: props.detail,
  actions: props.actions,
  dismissible: props.dismissible,
  entering: false,
  leaving: leaving.value,
}));

const politeItems = ref<Box[]>([]);
const assertiveItems = ref<Box[]>([]);
const queue = ref<Box[]>([]);
const paused = ref(false);
const stackEl = ref<HTMLElement>();

const timers = new Map<number, number>();
let seq = 0;
let returnTo: HTMLElement | undefined;

const isPolite = (intent: Intent) => intent === "success" || intent === "info";

const durationFor = (box: Box) => {
  if (!isPolite(box.intent) || box.actions.length > 0) return 0;
  const words = `${box.summary} ${box.detail ?? ""}`
    .trim()
    .split(/\s+/u).length;
  return Math.max(5000, words * 300 + 2000);
};

const liveItems = () => [...politeItems.value, ...assertiveItems.value];

const liveCount = () => liveItems().length;

const pinnedCount = computed(
  () => liveItems().filter((box) => durationFor(box) === 0).length,
);

const listFor = (box: Box) =>
  isPolite(box.intent) ? politeItems : assertiveItems;

const clearTimer = (id: number) => {
  const handle = timers.get(id);
  if (handle !== undefined) {
    window.clearTimeout(handle);
    timers.delete(id);
  }
};

const arm = (box: Box) => {
  const duration = durationFor(box);
  if (duration === 0 || paused.value) return;
  timers.set(
    box.id,
    window.setTimeout(() => close(box.id), duration),
  );
};

const release = () => {
  while (queue.value.length > 0 && liveCount() < 3) {
    const next = queue.value.shift();
    if (next === undefined) return;
    admit(next);
  }
};

const admit = (box: Box) => {
  listFor(box).value.push(box);
  arm(box);
  nextTick(() => {
    window.requestAnimationFrame(() => {
      const live = liveItems().find((item) => item.id === box.id);
      if (live !== undefined) live.entering = false;
    });
  });
};

const remove = (id: number) => {
  politeItems.value = politeItems.value.filter((box) => box.id !== id);
  assertiveItems.value = assertiveItems.value.filter((box) => box.id !== id);
  release();
};

const close = (id: number) => {
  clearTimer(id);
  const box = liveItems().find((item) => item.id === id);
  if (box === undefined || box.leaving) return;
  box.leaving = true;
  window.setTimeout(() => remove(id), 200);
};

const raise = (intent: Exclude<Intent, "neutral">) => {
  seq += 1;
  const box: Box = {
    id: seq,
    intent,
    summary: COPY[intent].summary,
    detail: COPY[intent].detail,
    actions: [],
    dismissible: true,
    entering: true,
    leaving: false,
  };
  if (liveCount() >= 3) {
    queue.value.push(box);
    return;
  }
  admit(box);
};

const pause = () => {
  paused.value = true;
  for (const id of [...timers.keys()]) clearTimer(id);
};

const resume = () => {
  paused.value = false;
  for (const box of liveItems()) {
    if (!box.leaving) arm(box);
  }
};

const onPointerLeave = () => {
  if (stackEl.value?.contains(document.activeElement) === true) return;
  resume();
};

const onFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget;
  if (next instanceof Node && stackEl.value?.contains(next) === true) return;
  resume();
};

const toastNodes = () => [
  ...(stackEl.value?.querySelectorAll<HTMLElement>("[data-toast]") ?? []),
];

const focusNewest = () => {
  const newest = liveItems().sort((a, b) => b.id - a.id)[0];
  if (newest === undefined) return;
  returnTo =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : undefined;
  nextTick(() => {
    stackEl.value
      ?.querySelector<HTMLElement>(`[data-toast="${newest.id}"]`)
      ?.focus();
  });
};

const dismissToast = (id: number) => {
  const nodes = toastNodes();
  const index = nodes.findIndex((node) => node.dataset.toast === String(id));
  const next = nodes[index + 1] ?? nodes[index - 1];
  close(id);
  nextTick(() => {
    if (next !== undefined && next.isConnected) next.focus();
    else returnTo?.focus();
  });
};

const onBoxKeydown = (event: KeyboardEvent, id: number) => {
  if (props.form !== "toaster") return;
  event.stopPropagation();
  dismissToast(id);
};

const dismissStatic = () => {
  leaving.value = true;
  window.setTimeout(() => {
    dismissed.value = true;
    leaving.value = false;
  }, 110);
};

const restore = () => {
  dismissed.value = false;
};

const onDismiss = (id: number) => {
  if (props.form === "toaster") dismissToast(id);
  else dismissStatic();
};

onBeforeUnmount(() => {
  for (const id of [...timers.keys()]) clearTimer(id);
});

const regions = computed<Region[]>(() =>
  props.form === "toaster"
    ? [
        { key: "assertive", role: "alert", items: assertiveItems.value },
        { key: "polite", role: "status", items: politeItems.value },
      ]
    : [{ key: "static", items: dismissed.value ? [] : [staticBox.value] }],
);

const stacked = (box: Box) =>
  (box.detail !== undefined && props.size !== "sm") || box.actions.length > 0;

const boxClass = (box: Box) => [
  "flex gap-2 rounded-md border border-solid text-ink",
  INTENTS[box.intent].box,
  stacked(box) ? "items-start" : "items-center",
  props.form === "inline" ? BOX_FORM.inline[props.size] : BOX_FORM[props.form],
  props.form === "toaster"
    ? toasterMotion(box)
    : box.leaving
      ? "opacity-0"
      : "opacity-100",
  props.form === "toaster" ? FOCUS_RING : "",
];

const toasterMotion = (box: Box) => {
  if (box.leaving)
    return "max-h-0 -mt-2 overflow-hidden opacity-0 duration-2 ease-exit";
  if (box.entering)
    return "max-h-60 translate-x-2 opacity-0 duration-3 ease-enter motion-reduce:translate-x-0";
  return "max-h-60 translate-x-0 opacity-100 duration-3 ease-enter";
};

const triggers: Exclude<Intent, "neutral">[] = [
  "success",
  "info",
  "warning",
  "danger",
];
</script>

<template>
  <div :class="ROOTS[form]">
    <div v-if="form === 'toaster'" class="flex flex-wrap items-center gap-2">
      <button
        v-for="trigger in triggers"
        :key="trigger"
        type="button"
        :class="TRIGGER"
        @click="raise(trigger)"
      >
        Raise {{ trigger }}
      </button>
      <button type="button" :class="TRIGGER" @click="focusNewest">
        Focus newest toast
      </button>
      <span class="text-caption font-medium tabular-nums text-ink-muted">
        {{ liveCount() }} live, {{ queue.length }} queued,
        {{ pinnedCount }} never expire{{ paused ? ", timers held" : "" }}
      </span>
    </div>

    <div
      ref="stackEl"
      :class="
        form === 'toaster'
          ? 'absolute bottom-4 right-4 flex flex-col items-end gap-2'
          : 'contents'
      "
      @mouseenter="form === 'toaster' && pause()"
      @mouseleave="form === 'toaster' && onPointerLeave()"
      @focusin="form === 'toaster' && pause()"
      @focusout="form === 'toaster' && onFocusOut($event)"
    >
      <div
        v-for="region in regions"
        :key="region.key"
        :role="region.role"
        :class="
          form === 'toaster' ? 'flex flex-col items-end gap-2' : 'contents'
        "
      >
        <div
          v-for="box in region.items"
          :key="box.id"
          :class="boxClass(box)"
          :data-toast="form === 'toaster' ? box.id : undefined"
          :tabindex="form === 'toaster' ? -1 : undefined"
          @keydown.esc="onBoxKeydown($event, box.id)"
        >
          <i
            v-if="box.intent !== 'neutral'"
            class="w-4 shrink-0 text-center text-[16px]"
            :class="[
              INTENTS[box.intent].icon,
              INTENTS[box.intent].ink,
              form === 'inline' && size === 'sm'
                ? 'leading-[18px]'
                : 'leading-5',
            ]"
            aria-hidden="true"
          />

          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div
              :class="[
                form === 'inline' && size === 'sm'
                  ? 'text-dense font-normal'
                  : 'text-body font-semibold',
                form === 'inline' ? '' : 'truncate',
              ]"
            >
              {{ box.summary }}
            </div>
            <div
              v-if="box.detail && size !== 'sm'"
              class="text-body font-normal"
              :class="[
                box.intent === 'neutral' ? 'text-ink-muted' : 'text-ink',
                form === 'inline' ? '' : 'line-clamp-3',
              ]"
            >
              {{ box.detail }}
            </div>
            <div
              v-if="box.actions.length > 0"
              class="mt-1 flex flex-wrap gap-2"
            >
              <button
                v-for="(action, index) in box.actions"
                :key="action"
                type="button"
                :class="ACTION"
                :aria-disabled="loading && index === 0 ? 'true' : undefined"
              >
                <span class="inline-flex h-[13px] w-[13px]" aria-hidden="true">
                  <span
                    v-if="loading && index === 0"
                    class="h-[13px] w-[13px] animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-[spin_1.4s_linear_infinite]"
                  />
                </span>
                {{ action }}
              </button>
            </div>
          </div>

          <button
            v-if="box.dismissible"
            type="button"
            :class="[
              CONTROL,
              'border-transparent',
              'ml-2 h-xs w-xs shrink-0',
              form === 'inline' && size === 'sm' ? '-my-[3px]' : '-my-0.5',
            ]"
            :aria-label="`Dismiss: ${box.summary}`"
            @click="onDismiss(box.id)"
          >
            <i
              class="fas fa-xmark text-[16px] leading-none"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>

    <button v-if="dismissed" type="button" :class="TRIGGER" @click="restore">
      Show the message again
    </button>
  </div>
</template>
