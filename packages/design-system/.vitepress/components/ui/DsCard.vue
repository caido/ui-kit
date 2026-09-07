<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  useSlots,
  watch,
} from "vue";

type Variant = "panel" | "inset" | "selectable";
type SelectMode = "checkbox" | "radio";
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

const props = withDefaults(
  defineProps<{
    variant?: Variant;

    flush?: boolean;
    title?: string;
    subtitle?: string;

    headingLevel?: HeadingLevel;

    landmark?: boolean;

    dataSurface?: boolean;
    selectMode?: SelectMode;
    selected?: boolean;
    disabled?: boolean;
    loading?: boolean;
    error?: boolean;
  }>(),
  {
    variant: "panel",
    flush: false,
    headingLevel: 3,
    landmark: false,
    dataSurface: false,
    selectMode: "checkbox",
    selected: false,
    disabled: false,
    loading: false,
    error: false,
  },
);

const emit = defineEmits<{ "update:selected": [boolean] }>();

const slots = useSlots();
const RADIO_EVENT = "ds-card-radio-select";

const GEOMETRY =
  "[--dsc-inset:16px] [--dsc-stack:16px] [--dsc-bar:48px] [--dsc-head:72px] [--dsc-pad:11px] " +
  "data-[density=compact]:[--dsc-inset:12px] data-[density=compact]:[--dsc-stack:12px] " +
  "data-[density=compact]:[--dsc-bar:44px] data-[density=compact]:[--dsc-head:68px] " +
  "data-[density=compact]:[--dsc-pad:9px] " +
  "data-[density=comfortable]:[--dsc-inset:20px] data-[density=comfortable]:[--dsc-stack:20px] " +
  "data-[density=comfortable]:[--dsc-bar:52px] data-[density=comfortable]:[--dsc-head:76px] " +
  "data-[density=comfortable]:[--dsc-pad:13px] " +
  "[--dsc-r-bar:max(0px,calc(var(--dsc-radius)_-_var(--dsc-bw)))] " +
  "[--dsc-r-nested:max(0px,calc(var(--dsc-radius)_-_var(--dsc-inset)_-_var(--dsc-bw)))]";

const STATE_LAYER =
  "pointer-events-none absolute inset-0 bg-ink rounded-[var(--dsc-r-bar)] " +
  "transition-opacity duration-1 ease-standard motion-reduce:transition-none";

const uid = useId();
const titleId = `${uid}-title`;
const rootEl = ref<HTMLElement>();

const checked = ref(props.selected);
watch(
  () => props.selected,
  (next) => {
    checked.value = next;
  },
);

const isControl = computed(() => props.variant === "selectable");
const isRadio = computed(() => isControl.value && props.selectMode === "radio");
const inert = computed(() => props.disabled || props.loading);
const isStacked = computed(
  () => props.subtitle !== undefined && props.subtitle.length > 0,
);
const hasTitle = computed(
  () => props.title !== undefined && props.title.length > 0,
);
const hasHeader = computed(
  () =>
    hasTitle.value || slots.header !== undefined || slots.actions !== undefined,
);

const rootTag = computed(() => {
  if (isControl.value) return "div";
  return props.landmark ? "section" : "div";
});

const role = computed(() => {
  if (!isControl.value) return undefined;
  return isRadio.value ? "radio" : "checkbox";
});

const isRovingStop = ref(true);
const tabindex = computed(() => {
  if (!isControl.value) return undefined;
  if (!isRadio.value) return 0;
  return checked.value || isRovingStop.value ? 0 : -1;
});

const labelledBy = computed(() => {
  if (!hasTitle.value) return undefined;
  return isControl.value || props.landmark ? titleId : undefined;
});

const surface = computed(() => {
  if (props.variant === "inset")
    return "bg-inset border border-line [--dsc-bw:1px]";
  if (!isControl.value) return "bg-raised shadow-md border-0 [--dsc-bw:0px]";
  if (props.disabled) {
    return "bg-disabled text-ink-faint border border-separator cursor-not-allowed [--dsc-bw:1px]";
  }
  return [
    "bg-raised shadow-md border [--dsc-bw:1px]",
    props.loading ? "cursor-progress" : "cursor-pointer",
    props.error ? "border-danger-ink" : "",
    !props.error && checked.value ? "border-accent-ink" : "",
    !props.error && !checked.value ? "border-control" : "",
  ]
    .filter((part) => part.length > 0)
    .join(" ");
});

const emphasisTone = computed(() => {
  if (props.error) return "border-danger-ink";
  return "border-accent-ink";
});
const hasEmphasis = computed(
  () => isControl.value && !props.disabled && (props.error || checked.value),
);

const stateAlpha = computed(() => {
  if (!isControl.value || inert.value) return "opacity-0";
  if (checked.value) {
    return "opacity-[0.12] group-hover:opacity-[0.14] group-active:opacity-[0.14]";
  }
  return "opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.14]";
});

const focusRing = computed(() => {
  const shared =
    "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";
  if (props.flush) {
    return `${shared} focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]`;
  }
  return `${shared} focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]`;
});

const rootClass = computed(() => [
  "group relative flex flex-col p-0 border-solid font-sans text-body text-ink",
  "rounded-[var(--dsc-radius)]",
  GEOMETRY,
  props.flush
    ? "[--dsc-radius:0px] border-x-0"
    : "[--dsc-radius:var(--dsc-inherit-radius,4px)]",
  surface.value,
  focusRing.value,
]);

const ruleClass = computed(() =>
  props.variant === "inset"
    ? "border-b border-separator"
    : "border-b-2 border-line",
);

const headClass = computed(() => {
  const shared = [
    "relative z-10 flex justify-between gap-2 border-0 border-solid",
    ruleClass.value,
    "rounded-t-[var(--dsc-r-bar)]",
    "pl-[var(--dsc-inset)]",
    slots.actions === undefined ? "pr-[var(--dsc-inset)]" : "pr-2",
  ].join(" ");
  if (isStacked.value) {
    return `${shared} items-start min-h-[var(--dsc-head)] py-[var(--dsc-pad)]`;
  }
  return `${shared} items-center h-[var(--dsc-bar)] flex-none`;
});

const footClass = computed(() => {
  const rule =
    props.variant === "inset"
      ? "border-t border-separator"
      : "border-t-2 border-line";
  return [
    "relative z-10 flex flex-none items-center justify-end gap-2 border-0 border-solid",
    rule,
    "min-h-[var(--dsc-bar)] p-2 rounded-b-[var(--dsc-r-bar)]",
  ].join(" ");
});

const bodyClass = computed(() => {
  const shared = "relative z-10 flex flex-col overflow-hidden [&_p]:!m-0";
  if (props.dataSurface) {
    return `${shared} p-0 gap-0 text-dense [&_p]:!leading-[18px] [--dsc-inherit-radius:var(--dsc-r-bar)]`;
  }
  return `${shared} p-[var(--dsc-inset)] gap-[var(--dsc-stack)] [&_p]:!leading-[20px] [--dsc-inherit-radius:var(--dsc-r-nested)]`;
});

const subtitleTone = computed(() =>
  isControl.value && props.disabled ? "text-inherit" : "text-ink-muted",
);

const BAR =
  "block rounded-md bg-skeleton animate-pulse motion-reduce:animate-none";

const radios = () => {
  const groupEl = rootEl.value?.closest('[role="radiogroup"]');
  if (groupEl === null || groupEl === undefined) return [];
  return Array.from(groupEl.querySelectorAll<HTMLElement>('[role="radio"]'));
};

const setChecked = (next: boolean) => {
  checked.value = next;
  emit("update:selected", next);
  if (next && isRadio.value && rootEl.value !== undefined) {
    rootEl.value.dispatchEvent(
      new CustomEvent(RADIO_EVENT, { bubbles: true, detail: { id: uid } }),
    );
  }
};

const activate = () => {
  if (!isControl.value || inert.value) return;
  if (isRadio.value) {
    if (!checked.value) setChecked(true);
    return;
  }
  setChecked(!checked.value);
};

const move = (step: number) => {
  const list = radios().filter(
    (el) => el.getAttribute("aria-disabled") !== "true",
  );
  const here = rootEl.value === undefined ? -1 : list.indexOf(rootEl.value);
  if (here === -1 || list.length === 0) return;
  const target = list[(here + step + list.length) % list.length];
  target?.focus();
  target?.click();
};

const onKeydown = (event: KeyboardEvent) => {
  if (!isControl.value || inert.value) return;
  if (event.key === " ") {
    event.preventDefault();
    activate();
    return;
  }
  if (!isRadio.value) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    move(1);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    move(-1);
  }
};

const onGroupSelect = (event: Event) => {
  const source = (event as CustomEvent<{ id: string }>).detail;
  if (source.id !== uid) checked.value = false;
};

let groupEl: Element | undefined;

onMounted(() => {
  if (!isRadio.value) return;
  groupEl = rootEl.value?.closest('[role="radiogroup"]') ?? undefined;
  groupEl?.addEventListener(RADIO_EVENT, onGroupSelect);
  const list = radios();
  const anyChecked = list.some(
    (el) => el.getAttribute("aria-checked") === "true",
  );
  isRovingStop.value = !anyChecked && list[0] === rootEl.value;
});

onBeforeUnmount(() => {
  groupEl?.removeEventListener(RADIO_EVENT, onGroupSelect);
});
</script>

<template>
  <component
    :is="rootTag"
    ref="rootEl"
    :class="rootClass"
    :role="role"
    :tabindex="tabindex"
    :aria-checked="isControl ? String(checked) : undefined"
    :aria-disabled="isControl && inert ? 'true' : undefined"
    :aria-invalid="isControl && error ? 'true' : undefined"
    :aria-labelledby="labelledBy"
    @click="activate"
    @keydown="onKeydown"
  >
    <span
      v-if="isControl"
      aria-hidden="true"
      :class="[STATE_LAYER, stateAlpha]"
    />
    <span
      v-if="hasEmphasis"
      aria-hidden="true"
      :class="[
        'pointer-events-none absolute -inset-px z-20 border-2 border-solid rounded-[var(--dsc-radius)]',
        emphasisTone,
      ]"
    />

    <header v-if="hasHeader" :class="headClass">
      <slot name="header">
        <div class="flex min-w-0 flex-col justify-center gap-1">
          <component
            :is="`h${headingLevel}`"
            :id="titleId"
            class="!m-0 !border-0 !p-0 !text-title overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-inherit"
          >
            {{ title }}
          </component>
          <p v-if="isStacked" :class="['!m-0 !text-body', subtitleTone]">
            {{ subtitle }}
          </p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="flex flex-none items-center gap-2">
        <slot name="actions" />
      </div>
    </header>

    <div :class="bodyClass" :aria-busy="loading ? 'true' : undefined">
      <template v-if="loading">
        <span
          class="absolute h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]"
        >
          Loading
        </span>
        <span
          v-for="bar in ['w-full', 'w-[76%]', 'w-[48%]']"
          :key="bar"
          aria-hidden="true"
          :class="[BAR, 'h-[14px]', bar]"
        />
      </template>
      <slot v-else />
    </div>

    <footer v-if="$slots.footer" :class="footClass">
      <slot name="footer" />
    </footer>
  </component>
</template>
