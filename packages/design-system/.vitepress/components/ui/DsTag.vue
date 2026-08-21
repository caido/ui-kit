<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

type Shape = "badge" | "tag" | "chip" | "counter";
type Intent = "neutral" | "info" | "success" | "warning" | "danger" | "accent";
type Emphasis = "soft" | "solid";
type Size = "counter" | "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    label?: string;
    shape?: Shape;
    intent?: Intent;
    emphasis?: Emphasis;
    size?: Size;

    icon?: string;

    expansion?: string;

    count?: number;

    values?: string[];
    selected?: boolean;
    disabled?: boolean;
    loading?: boolean;
    error?: boolean;
    readOnly?: boolean;
  }>(),
  {
    shape: "badge",
    intent: "neutral",
    emphasis: "soft",
    size: "md",
    selected: false,
    disabled: false,
    loading: false,
    error: false,
    readOnly: false,
  },
);

const emit = defineEmits<{
  remove: [value: string];
  "update:selected": [value: boolean];
}>();

const INTENT_ICON: Record<Intent, string> = {
  neutral: "",
  info: "fas fa-circle-info",
  success: "fas fa-check",
  warning: "fas fa-triangle-exclamation",
  danger: "fas fa-xmark",
  accent: "fas fa-star",
};

const SOFT: Record<Intent, string> = {
  neutral: "bg-inset border-control text-ink",
  info: "bg-[color-mix(in_srgb,var(--c-info-fg)_16%,var(--c-bg-canvas))] border-info-ink text-ink",
  success:
    "bg-[color-mix(in_srgb,var(--c-success-fg)_16%,var(--c-bg-canvas))] border-success-ink text-ink",
  warning:
    "bg-[color-mix(in_srgb,var(--c-gold-fg)_16%,var(--c-bg-canvas))] border-gold-ink text-ink",
  danger:
    "bg-[color-mix(in_srgb,var(--c-danger-fg)_16%,var(--c-bg-canvas))] border-danger-ink text-ink",
  accent:
    "bg-[color-mix(in_srgb,var(--c-accent-fg)_16%,var(--c-bg-canvas))] border-accent-ink text-ink",
};

const SOLID: Record<Intent, string> = {
  neutral: "bg-[var(--c-fg-muted)] border-[var(--c-fg-muted)] text-canvas",
  info: "bg-info-ink border-info-ink text-canvas",
  success: "bg-success-ink border-success-ink text-canvas",
  warning: "bg-gold-ink border-gold-ink text-canvas",
  danger: "bg-danger-ink border-danger-ink text-canvas",
  accent: "bg-accent border-accent text-ink-onsolid",
};

const GLYPH_INK: Record<Intent, string> = {
  neutral: "text-ink-muted",
  info: "text-info-ink",
  success: "text-success-ink",
  warning: "text-gold-ink",
  danger: "text-danger-ink",
  accent: "text-accent-ink",
};

const shell =
  "box-border inline-flex items-center justify-center align-middle " +
  "whitespace-nowrap text-caption font-semibold uppercase tracking-[0.04em]";

const sizeBox: Record<Size, string> = {
  counter: "min-h-[16px] min-w-[16px] rounded-full px-1",
  sm: "min-h-[20px] rounded-xs px-1.5",
  md: "min-h-xs gap-1 rounded-sm px-2",
  lg: "min-h-sm gap-1 rounded-sm px-3",
};

const sizePadY: Record<Size, string> = {
  counter: "py-0",
  sm: "py-px",
  md: "py-[3px]",
  lg: "py-[5px]",
};

const ring =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const glyphBox =
  "w-3 shrink-0 text-center text-[12px] leading-3 normal-case tracking-normal";

const removeBtn =
  "-my-1 inline-flex h-xs w-xs shrink-0 cursor-pointer items-center justify-center rounded-xs " +
  "border-0 bg-transparent p-0 text-[12px] leading-3 text-ink-muted " +
  "transition-colors duration-1 ease-standard motion-reduce:transition-none " +
  "hover:bg-[var(--c-state-hover)] hover:text-ink active:bg-[var(--c-state-pressed)] " +
  "aria-disabled:cursor-progress disabled:cursor-not-allowed disabled:text-ink-faint " +
  ring;

const resolvedSize = computed<Size>(() =>
  props.shape === "counter" ? "counter" : props.size,
);

const showsGlyph = computed(
  () => resolvedSize.value === "md" || resolvedSize.value === "lg",
);

const pressed = ref(props.selected);
watch(
  () => props.selected,
  (value) => {
    pressed.value = value;
  },
);

const toggle = () => {
  if (props.disabled) return;
  pressed.value = !pressed.value;
  emit("update:selected", pressed.value);
};

const glyph = computed(() => {
  if (!showsGlyph.value) return "";
  if (props.shape === "chip" && pressed.value) return "fas fa-check";
  if (props.shape === "tag" && props.error)
    return "fas fa-triangle-exclamation";
  if (props.icon !== undefined) return props.icon;
  if (props.shape === "tag") return "";
  return INTENT_ICON[props.intent];
});

const glyphInk = computed(() => {
  if (props.disabled) return "text-ink-faint";
  if (props.shape === "chip")
    return pressed.value ? "text-ink" : GLYPH_INK[props.intent];
  if (props.shape === "tag" && props.error) return "text-danger-ink";
  return props.emphasis === "solid" ? "text-current" : GLYPH_INK[props.intent];
});

const borderW = computed(() => {
  if (resolvedSize.value === "counter") return "border-0";
  return props.shape === "tag" && props.error
    ? "border-2 border-danger-ink"
    : "border";
});

const padY = computed(() =>
  props.shape === "tag" && props.error
    ? "py-0.5"
    : sizePadY[resolvedSize.value],
);

const tone = computed(() => {
  if (props.disabled) return "bg-disabled border-separator text-ink-faint";
  if (props.shape === "tag" && props.error) return "bg-inset text-ink";
  return (props.emphasis === "solid" ? SOLID : SOFT)[props.intent];
});

const chipTone = computed(() => {
  if (props.disabled)
    return "cursor-not-allowed bg-disabled border-separator text-ink-faint";
  return [
    pressed.value ? "bg-selected" : "bg-inset",
    "cursor-pointer border-control text-ink",
    "hover:bg-gradient-to-r hover:from-[var(--c-state-hover)] hover:to-[var(--c-state-hover)]",
    "active:bg-gradient-to-r active:from-[var(--c-state-pressed)] active:to-[var(--c-state-pressed)]",
  ].join(" ");
});

const counterText = computed(() => {
  const value = props.count ?? 0;
  return value > 99 ? "99+" : String(value);
});

const items = ref<string[]>([]);
const activeIndex = ref(0);
const announcement = ref("");
const listEl = ref<HTMLUListElement>();

watch(
  () => [props.values, props.label] as const,
  ([values, label]) => {
    items.value =
      values !== undefined ? [...values] : label !== undefined ? [label] : [];
    activeIndex.value = 0;
  },
  { immediate: true },
);

const removable = computed(() => !props.readOnly && !props.disabled);

const controls = () =>
  Array.from(
    listEl.value?.querySelectorAll<HTMLButtonElement>("button[data-remove]") ??
      [],
  );

const focusAt = async (index: number) => {
  await nextTick();
  const list = controls();
  if (list.length === 0) {
    listEl.value?.focus();
    return;
  }
  const clamped = Math.min(Math.max(index, 0), list.length - 1);
  activeIndex.value = clamped;
  list[clamped]?.focus();
};

const remove = (index: number) => {
  if (!removable.value || props.loading) return;
  const value = items.value[index];
  if (value === undefined) return;
  items.value.splice(index, 1);
  announcement.value = `${value} removed`;
  emit("remove", value);
  void focusAt(index);
};

const onListKeydown = (event: KeyboardEvent) => {
  const count = controls().length;
  if (count === 0) return;
  switch (event.key) {
    case "ArrowRight":
      event.preventDefault();
      void focusAt(Math.min(activeIndex.value + 1, count - 1));
      break;
    case "ArrowLeft":
      event.preventDefault();
      void focusAt(Math.max(activeIndex.value - 1, 0));
      break;
    case "Home":
      event.preventDefault();
      void focusAt(0);
      break;
    case "End":
      event.preventDefault();
      void focusAt(count - 1);
      break;
    case "Delete":
    case "Backspace":
      event.preventDefault();
      remove(activeIndex.value);
      break;
    case "Escape":
      event.preventDefault();
      listEl.value?.focus();
      break;
  }
};
</script>

<template>
  <div v-if="shape === 'tag'" class="relative">
    <ul
      ref="listEl"
      tabindex="-1"
      :class="[
        'flex flex-wrap items-center gap-x-2 gap-y-1 !m-0 !list-none !p-0',
        ring,
      ]"
      @keydown="onListKeydown"
    >
      <li
        v-for="(value, index) in items"
        :key="value"
        :class="[
          shell,
          sizeBox[resolvedSize],
          padY,
          borderW,
          tone,
          '!m-0',
          removable && 'pe-0.5',
        ]"
      >
        <i
          v-if="glyph"
          :class="[glyph, glyphBox, glyphInk]"
          aria-hidden="true"
        />
        <span
          :title="value"
          class="block max-w-[24ch] overflow-hidden text-ellipsis font-medium normal-case tracking-normal [unicode-bidi:isolate]"
          >{{ value }}</span
        >
        <button
          v-if="removable"
          type="button"
          data-remove
          :class="removeBtn"
          :tabindex="index === activeIndex ? 0 : -1"
          :aria-label="`Remove ${value}`"
          :aria-disabled="loading || undefined"
          @focus="activeIndex = index"
          @click="remove(index)"
        >
          <i
            v-if="loading"
            class="fas fa-spinner animate-spin motion-reduce:animate-[spin_1.4s_linear_infinite]"
            aria-hidden="true"
          />
          <i v-else class="fas fa-xmark" aria-hidden="true" />
        </button>
        <button
          v-else-if="disabled"
          type="button"
          disabled
          :class="removeBtn"
          :aria-label="`Remove ${value}`"
        >
          <i class="fas fa-xmark" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <span class="sr-only" role="status" aria-live="polite">{{
      announcement
    }}</span>
  </div>

  <button
    v-else-if="shape === 'chip'"
    type="button"
    :aria-pressed="pressed"
    :disabled="disabled"
    :class="[shell, sizeBox[resolvedSize], padY, borderW, chipTone, ring]"
    @click="toggle"
  >
    <i v-if="glyph" :class="[glyph, glyphBox, glyphInk]" aria-hidden="true" />
    <span class="block">{{ label }}</span>
    <span v-if="expansion" class="sr-only">{{ expansion }}</span>
  </button>

  <span
    v-else-if="shape === 'counter'"
    :class="[shell, sizeBox.counter, padY, borderW, tone]"
  >
    <span class="block tracking-normal lining-nums tabular-nums">{{
      counterText
    }}</span>
  </span>

  <span v-else :class="[shell, sizeBox[resolvedSize], padY, borderW, tone]">
    <i v-if="glyph" :class="[glyph, glyphBox, glyphInk]" aria-hidden="true" />
    <span class="block">{{ label }}</span>
    <span v-if="expansion" class="sr-only">{{ expansion }}</span>
  </span>
</template>
