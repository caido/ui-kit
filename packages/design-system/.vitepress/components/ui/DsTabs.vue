<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";

type TabItem = {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  dirty?: boolean;
  error?: boolean;
  count?: number;
};

const LABEL_CAP = 22;

const props = withDefaults(
  defineProps<{
    tabs?: TabItem[];
    variant?: "underline" | "enclosed" | "filled";
    size?: "sm" | "md" | "lg";
    orientation?: "horizontal" | "vertical";

    label?: string;
    modelValue?: string;
    closeable?: boolean;

    panels?: boolean;
  }>(),
  {
    tabs: () => [
      { id: "pretty", label: "Pretty" },
      { id: "raw", label: "Raw" },
      { id: "hex", label: "Hex" },
    ],
    variant: "underline",
    size: "md",
    orientation: "horizontal",
    label: "Views",
    closeable: false,
    panels: true,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", id: string): void;
  (event: "close", id: string): void;
}>();

const uid = useId();
const tabId = (id: string) => `dst-t-${uid}-${id}`;
const panelId = (id: string) => `dst-p-${uid}-${id}`;
const descId = (id: string) => `dst-d-${uid}-${id}`;

const description = (item: TabItem) => {
  const parts: string[] = [];
  if (item.count !== undefined) parts.push(`${item.count} items`);
  if (item.dirty === true) parts.push("unsaved changes");
  if (item.error === true) parts.push("contains an error");
  return parts.length === 0 ? undefined : parts.join(", ");
};

const items = ref<TabItem[]>([...props.tabs]);
const firstEnabled = items.value.find((item) => item.disabled !== true);
const selected = ref(
  props.modelValue ?? firstEnabled?.id ?? items.value[0]?.id ?? "",
);
const mounted = ref(new Set<string>([selected.value]));

const stripEl = ref<HTMLElement | undefined>(undefined);
const selectedIndex = computed(() =>
  items.value.findIndex((item) => item.id === selected.value),
);
const focusIndex = ref(Math.max(0, selectedIndex.value));

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined && value !== selected.value) {
      selected.value = value;
      mounted.value = new Set([...mounted.value, value]);
    }
  },
);

const tabElements = () => {
  const strip = stripEl.value;
  if (strip === undefined) return [];
  return [...strip.querySelectorAll<HTMLButtonElement>("[role='tab']")];
};

const moveFocus = (index: number) => {
  const count = items.value.length;
  if (count === 0) return;
  const next = (index + count) % count;
  focusIndex.value = next;
  tabElements()[next]?.focus();
};

const revealSelected = () => {
  const index = items.value.findIndex((item) => item.id === selected.value);
  const element = tabElements()[index];
  if (element === undefined) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    block: "nearest",
    inline: "nearest",
    behavior: reduced ? "auto" : "smooth",
  });
};

const activate = (item: TabItem) => {
  if (item.disabled === true) return;
  selected.value = item.id;
  mounted.value = new Set([...mounted.value, item.id]);
  emit("update:modelValue", item.id);
  requestAnimationFrame(revealSelected);
};

const close = (id: string) => {
  const index = items.value.findIndex((item) => item.id === id);
  if (index === -1) return;
  items.value = items.value.filter((item) => item.id !== id);
  emit("close", id);

  if (selected.value === id) {
    const next = items.value[Math.min(index, items.value.length - 1)];
    if (next !== undefined) activate(next);
  }

  const target = Math.max(0, Math.min(index, items.value.length - 1));
  focusIndex.value = target;
  if (items.value.length > 0) {
    void nextTick(() => tabElements()[target]?.focus());
  }
};

const isHorizontal = computed(() => props.orientation === "horizontal");

const onKeydown = (event: KeyboardEvent) => {
  const forward = isHorizontal.value ? "ArrowRight" : "ArrowDown";
  const backward = isHorizontal.value ? "ArrowLeft" : "ArrowUp";

  if (event.key === forward) {
    event.preventDefault();
    moveFocus(focusIndex.value + 1);
  } else if (event.key === backward) {
    event.preventDefault();
    moveFocus(focusIndex.value - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    moveFocus(0);
  } else if (event.key === "End") {
    event.preventDefault();
    moveFocus(items.value.length - 1);
  } else if (event.key === "Delete" && props.closeable) {
    event.preventDefault();
    const item = items.value[focusIndex.value];
    if (item !== undefined) close(item.id);
  }
};

const onFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget;
  const strip = stripEl.value;
  if (strip !== undefined && next instanceof Node && strip.contains(next))
    return;
  focusIndex.value = Math.max(0, selectedIndex.value);
};

const focusRing =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const rootClass = computed(() =>
  isHorizontal.value
    ? "relative grid w-full min-w-0 grid-cols-[minmax(0,1fr)]"
    : "relative flex w-full min-w-0 items-stretch",
);

const stripClass = computed(() => {
  const base = "flex min-w-0 gap-1 [scrollbar-width:thin]";
  const axis = isHorizontal.value
    ? "items-end overflow-x-auto"
    : "flex-none flex-col items-stretch";
  if (props.variant === "filled")
    return `${base} ${axis} rounded-md bg-inset p-1`;
  const rule = isHorizontal.value
    ? "border-0 border-b border-solid border-separator"
    : "border-0 border-e border-solid border-separator";
  return `${base} ${axis} ${rule}`;
});

const tabBase =
  "relative inline-flex flex-none items-center whitespace-nowrap bg-transparent " +
  "border border-solid border-transparent font-sans font-medium leading-none cursor-pointer " +
  `transition-colors duration-1 ease-standard motion-reduce:transition-none focus-visible:z-[1] ${focusRing}`;

const tabSizes = {
  sm: "h-sm gap-1.5 px-2 text-body",
  md: "h-md gap-2 px-3 text-body",
  lg: "h-lg gap-2 px-4 text-body",
};

const tabShape = computed(() => {
  if (props.variant !== "enclosed") return "rounded-sm";
  return isHorizontal.value ? "-mb-px rounded-t-md" : "-me-px rounded-s-md";
});

const tabTone = (item: TabItem) => {
  if (item.disabled === true) return "cursor-not-allowed text-ink-faint";
  if (item.id !== selected.value) {
    return props.variant === "filled"
      ? "text-ink-muted hover:bg-subtle hover:text-ink"
      : "text-ink-muted hover:bg-inset hover:text-ink";
  }
  if (props.variant === "filled") return "bg-raised font-semibold text-ink";
  if (props.variant === "underline") return "font-semibold text-ink";
  return isHorizontal.value
    ? "bg-raised font-semibold text-ink border-separator border-b-[var(--c-bg-raised)]"
    : "bg-raised font-semibold text-ink border-separator border-e-[var(--c-bg-raised)]";
};

const indicatorClass = (item: TabItem) => {
  const base =
    "pointer-events-none absolute bg-accent transition-transform duration-3 ease-enter motion-reduce:transition-none";
  const on = item.id === selected.value;
  if (isHorizontal.value) {
    const edge =
      props.variant === "enclosed" ? "-top-px bottom-auto" : "-bottom-px";
    return `${base} inset-x-0 h-[2px] ${edge} ${on ? "[transform:scaleX(1)]" : "[transform:scaleX(0)]"}`;
  }
  const edge = props.variant === "enclosed" ? "-start-px end-auto" : "-end-px";
  return `${base} inset-y-0 w-[2px] ${edge} ${on ? "[transform:scaleY(1)]" : "[transform:scaleY(0)]"}`;
};

const countClass = (item: TabItem) =>
  "inline-flex h-4 min-w-[20px] flex-none items-center justify-center rounded-full bg-inset px-1.5 " +
  `text-caption font-medium tabular-nums ${item.id === selected.value ? "text-ink" : "text-ink-muted"}`;

const panelClass = computed(() => {
  if (!isHorizontal.value) return `min-w-0 flex-1 px-4 ${focusRing}`;
  return props.variant === "underline"
    ? `min-w-0 py-4 ${focusRing}`
    : `min-w-0 px-1 py-4 ${focusRing}`;
});
</script>

<template>
  <div :class="rootClass">
    <div
      ref="stripEl"
      role="tablist"
      :class="stripClass"
      :aria-label="label"
      :aria-orientation="orientation"
      @keydown="onKeydown"
      @focusout="onFocusOut"
    >
      <button
        v-for="(item, index) in items"
        :id="tabId(item.id)"
        :key="item.id"
        type="button"
        role="tab"
        :class="[tabBase, tabSizes[size], tabShape, tabTone(item)]"
        :aria-selected="item.id === selected"
        :aria-controls="mounted.has(item.id) ? panelId(item.id) : undefined"
        :aria-disabled="item.disabled === true ? true : undefined"
        :aria-describedby="
          description(item) === undefined ? undefined : descId(item.id)
        "
        :tabindex="index === focusIndex ? 0 : -1"
        :title="item.label.length > LABEL_CAP ? item.label : undefined"
        @click="activate(item)"
        @focus="focusIndex = index"
      >
        <i
          v-if="item.icon"
          :class="item.icon"
          aria-hidden="true"
          class="flex-none text-[16px] leading-none"
        />
        <span
          :data-label="item.label"
          class="inline-block max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap after:pointer-events-none after:invisible after:block after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-label)]"
        >
          {{ item.label }}
        </span>
        <i
          v-if="item.error === true"
          aria-hidden="true"
          class="fas fa-triangle-exclamation flex-none text-[12px] leading-none text-danger-ink"
        />
        <span
          v-else-if="item.count !== undefined"
          aria-hidden="true"
          :class="countClass(item)"
          >{{ item.count }}</span
        >
        <span
          v-if="item.dirty === true"
          aria-hidden="true"
          class="h-1.5 w-1.5 flex-none rounded-full bg-accent-ink"
        />
        <span
          v-if="closeable"
          aria-hidden="true"
          title="Close. Delete key on the keyboard."
          class="-me-1.5 inline-flex h-xs w-xs flex-none items-center justify-center rounded-sm text-ink-faint transition-colors duration-1 ease-standard motion-reduce:transition-none hover:bg-selected hover:text-ink"
          @click.stop="close(item.id)"
        >
          <i class="fas fa-xmark text-[13px] leading-none" />
        </span>
        <span
          v-if="variant !== 'filled'"
          aria-hidden="true"
          :class="indicatorClass(item)"
        />
      </button>
    </div>

    <div class="sr-only">
      <template v-for="item in items" :key="item.id">
        <span v-if="description(item) !== undefined" :id="descId(item.id)">{{
          description(item)
        }}</span>
      </template>
    </div>

    <template v-if="panels">
      <div
        v-for="item in items.filter((entry) => mounted.has(entry.id))"
        :id="panelId(item.id)"
        :key="item.id"
        role="tabpanel"
        :class="panelClass"
        :aria-labelledby="tabId(item.id)"
        :hidden="item.id !== selected"
        tabindex="0"
      >
        <slot :name="item.id">
          <p class="m-0 text-body text-ink-muted">
            {{ item.label }} panel. Real content mounts here on first
            activation.
          </p>
        </slot>
      </div>
    </template>
  </div>
</template>
