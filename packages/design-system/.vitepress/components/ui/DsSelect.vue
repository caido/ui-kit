<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";

type DsSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
};

type Props = {
  label: string;
  options?: DsSelectOption[];
  variant?: "single" | "filterable" | "multiple" | "native";
  size?: "sm" | "md" | "lg";
  modelValue?: string | string[];
  placeholder?: string;

  icon?: string;
  helpText?: string;
  errorText?: string;
  emptyText?: string;
  failedText?: string;
  filterPlaceholder?: string;
  width?: string;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  loading?: boolean;

  failed?: boolean;
  hideLabel?: boolean;
  initialOpen?: boolean;

  initialActive?: number;

  inlineOverlay?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  variant: "single",
  size: "md",
  placeholder: "Select an option",
  emptyText: "No options",
  failedText: "Could not load options",
  filterPlaceholder: "Filter",
  width: "220px",
  clearable: false,
  disabled: false,
  readOnly: false,
  invalid: false,
  required: false,
  loading: false,
  failed: false,
  hideLabel: false,
  initialOpen: false,
  initialActive: -1,
  inlineOverlay: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]];
  change: [value: string | string[]];
  retry: [];
}>();

const uid = useId();
const triggerId = `${uid}-trigger`;
const labelId = `${uid}-label`;
const listId = `${uid}-list`;
const helpId = `${uid}-help`;
const errorId = `${uid}-error`;
const optionId = (index: number) => `${uid}-opt-${index}`;

const toArray = (value: string | string[] | undefined) => {
  if (value === undefined) return [];
  return Array.isArray(value) ? [...value] : [value];
};

const selected = ref<string[]>(toArray(props.modelValue));
watch(
  () => props.modelValue,
  (value) => {
    selected.value = toArray(value);
  },
);

const open = ref(props.initialOpen);
const activeIndex = ref(
  props.initialOpen && props.initialActive < 0
    ? props.options.findIndex((option) =>
        toArray(props.modelValue).includes(option.value),
      )
    : props.initialActive,
);
const query = ref("");
const valueAtOpen = ref<string[]>([]);
const rootEl = ref<HTMLElement>();
const triggerEl = ref<HTMLButtonElement>();
const filterEl = ref<HTMLInputElement>();
const listEl = ref<HTMLElement>();

const isFilterable = computed(() => props.variant === "filterable");
const isMultiple = computed(() => props.variant === "multiple");
const isInert = computed(() => props.disabled || props.readOnly);

const visibleOptions = computed(() => {
  if (!isFilterable.value || query.value.trim() === "") return props.options;
  const needle = query.value.trim().toLowerCase();
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(needle),
  );
});

const groups = computed(() => {
  const out: {
    key: string;
    label?: string;
    items: { option: DsSelectOption; index: number }[];
  }[] = [];
  visibleOptions.value.forEach((option, index) => {
    const last = out[out.length - 1];
    if (last !== undefined && last.label === option.group) {
      last.items.push({ option, index });
      return;
    }
    out.push({
      key: `${uid}-g${out.length}`,
      label: option.group,
      items: [{ option, index }],
    });
  });
  return out;
});

const selectedOptions = computed(() =>
  props.options.filter((option) => selected.value.includes(option.value)),
);

const displayValue = computed(() => {
  if (selectedOptions.value.length === 0) return props.placeholder;
  if (selectedOptions.value.length === 1) return selectedOptions.value[0].label;
  return `${selectedOptions.value.length} selected`;
});

const hasValue = computed(() => selected.value.length > 0);
const showClear = computed(
  () =>
    props.clearable && hasValue.value && !isInert.value && !isMultiple.value,
);
const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.helpText !== undefined) ids.push(helpId);
  if (props.errorText !== undefined) ids.push(errorId);
  return ids.length === 0 ? undefined : ids.join(" ");
});

const listState = computed(() => {
  if (props.loading) return "loading";
  if (props.failed) return "failed";
  if (visibleOptions.value.length === 0) return "empty";
  return "ready";
});

const emptyMessage = computed(() =>
  isFilterable.value && query.value.trim() !== ""
    ? `No results for "${query.value.trim()}"`
    : props.emptyText,
);

const statusMessage = computed(() => {
  if (!open.value) return "";
  if (listState.value === "loading") return "Loading options";
  if (listState.value === "failed") return props.failedText;
  if (listState.value === "empty") return emptyMessage.value;
  const count = visibleOptions.value.length;
  return `${count} ${count === 1 ? "option" : "options"} available`;
});

const publish = () => {
  const value = isMultiple.value
    ? [...selected.value]
    : (selected.value[0] ?? "");
  emit("update:modelValue", value);
  emit("change", value);
};

const scrollActiveIntoView = async () => {
  await nextTick();
  if (activeIndex.value < 0 || listEl.value === undefined) return;
  const el = listEl.value.querySelector(`#${optionId(activeIndex.value)}`);
  if (el instanceof HTMLElement) el.scrollIntoView({ block: "nearest" });
};

const setActive = (index: number, follow = false) => {
  const count = visibleOptions.value.length;
  if (count === 0) {
    activeIndex.value = -1;
    return;
  }
  activeIndex.value = Math.min(Math.max(index, 0), count - 1);

  if (follow && props.variant === "single") {
    const option = visibleOptions.value[activeIndex.value];
    if (option !== undefined && option.disabled !== true) {
      selected.value = [option.value];
      publish();
    }
  }
  void scrollActiveIntoView();
};

const focusTrigger = () => {
  void nextTick(() => triggerEl.value?.focus());
};

const openList = (landing: "selected" | "first" | "last") => {
  if (isInert.value || open.value) return;
  valueAtOpen.value = [...selected.value];
  query.value = "";
  open.value = true;
  const count = visibleOptions.value.length;
  if (count === 0) {
    activeIndex.value = -1;
  } else if (landing === "last") {
    activeIndex.value = count - 1;
  } else if (landing === "first") {
    activeIndex.value = 0;
  } else {
    const found = visibleOptions.value.findIndex((option) =>
      selected.value.includes(option.value),
    );
    activeIndex.value = found === -1 ? 0 : found;
  }
  void scrollActiveIntoView();
  if (isFilterable.value) void nextTick(() => filterEl.value?.focus());
};

const closeList = (restoreFocus = true) => {
  if (!open.value) return;
  open.value = false;
  activeIndex.value = -1;
  query.value = "";
  if (restoreFocus) focusTrigger();
};

const cancel = () => {
  selected.value = [...valueAtOpen.value];
  publish();
  closeList();
};

const commit = (index: number) => {
  const option = visibleOptions.value[index];
  if (option === undefined || option.disabled === true) return;
  if (isMultiple.value) {
    selected.value = selected.value.includes(option.value)
      ? selected.value.filter((value) => value !== option.value)
      : [...selected.value, option.value];
    publish();
    return;
  }
  selected.value = [option.value];
  publish();
  closeList();
};

const clear = () => {
  selected.value = [];
  publish();
  focusTrigger();
};

let typeBuffer = "";
let typeTimer: ReturnType<typeof setTimeout> | undefined;
const typeAhead = (char: string) => {
  if (typeTimer !== undefined) clearTimeout(typeTimer);
  typeBuffer += char.toLowerCase();
  typeTimer = setTimeout(() => {
    typeBuffer = "";
  }, 500);
  const count = visibleOptions.value.length;
  if (count === 0) return;
  const start = activeIndex.value < 0 ? 0 : activeIndex.value;
  for (let step = 1; step <= count; step += 1) {
    const index = (start + step) % count;
    if (
      visibleOptions.value[index].label.toLowerCase().startsWith(typeBuffer)
    ) {
      setActive(index, true);
      return;
    }
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (isInert.value) return;
  const key = event.key;

  if (!open.value) {
    if (key === "ArrowDown" || key === "Enter") {
      event.preventDefault();
      openList("selected");
    } else if (key === "ArrowUp") {
      event.preventDefault();
      openList("last");
    } else if (key === "Home") {
      event.preventDefault();
      openList("first");
    } else if (key === "End") {
      event.preventDefault();
      openList("last");
    } else if (key === "Escape" && props.clearable && hasValue.value) {
      event.preventDefault();
      clear();
    } else if (
      key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      if (isFilterable.value) {
        openList("selected");
        return;
      }
      event.preventDefault();
      openList("selected");
      typeAhead(key);
    }
    return;
  }

  if (key === "ArrowDown") {
    event.preventDefault();
    setActive(activeIndex.value + 1, true);
  } else if (key === "ArrowUp") {
    event.preventDefault();
    setActive(activeIndex.value - 1, true);
  } else if (key === "Home") {
    event.preventDefault();
    setActive(0, true);
  } else if (key === "End") {
    event.preventDefault();
    setActive(visibleOptions.value.length - 1, true);
  } else if (key === "PageDown") {
    event.preventDefault();
    setActive(activeIndex.value + 10, true);
  } else if (key === "PageUp") {
    event.preventDefault();
    setActive(activeIndex.value - 10, true);
  } else if (key === "Enter") {
    event.preventDefault();
    commit(activeIndex.value);
  } else if (key === "Escape") {
    event.preventDefault();
    cancel();
  } else if (key === "Tab") {
    if (!isMultiple.value) commit(activeIndex.value);
    closeList(false);
  } else if (key === " ") {
    if (isMultiple.value) {
      event.preventDefault();
      commit(activeIndex.value);
    } else if (!isFilterable.value) {
      event.preventDefault();
      commit(activeIndex.value);
    }
  } else if (
    !isFilterable.value &&
    key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    typeAhead(key);
  }
};

const onTriggerClick = () => {
  if (isInert.value) return;
  if (open.value) closeList();
  else openList("selected");
};

const onOptionClick = (index: number) => {
  commit(index);
  if (!isMultiple.value) return;
  if (isFilterable.value) filterEl.value?.focus();
  else triggerEl.value?.focus();
};

const onNativeChange = (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  selected.value = target.value === "" ? [] : [target.value];
  publish();
};

const onDocumentPointerDown = (event: PointerEvent) => {
  const target = event.target;
  if (!(target instanceof Node) || rootEl.value === undefined) return;
  if (rootEl.value.contains(target)) return;

  const landedOnControl =
    target instanceof Element &&
    target.closest("button, a, input, select, textarea, [tabindex]") !== null;
  closeList(!landedOnControl);
};

let observer: IntersectionObserver | undefined;
watch(open, (value) => {
  if (typeof document === "undefined") return;
  if (value) {
    document.addEventListener("pointerdown", onDocumentPointerDown, true);
    if (
      typeof IntersectionObserver !== "undefined" &&
      triggerEl.value !== undefined
    ) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => !entry.isIntersecting)) closeList(false);
        },
        { threshold: 0 },
      );
      observer.observe(triggerEl.value);
    }
    return;
  }
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
  observer?.disconnect();
  observer = undefined;
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("pointerdown", onDocumentPointerDown, true);
  }
  observer?.disconnect();
  if (typeTimer !== undefined) clearTimeout(typeTimer);
});

const focusRing =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const focusRingInvalid =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const motion =
  "transition-colors duration-1 ease-standard motion-reduce:transition-none";

const sizes = {
  sm: {
    row: "min-h-sm",
    pad: "pl-2 pr-1.5",
    nativePad: "pl-2 pr-[30px]",
    minWidth: "min-w-[56px]",
    iconBox: "w-4 h-4",
    glyph: "text-[12px]",
    lead: "text-[16px]",
    clearAt: "right-[30px]",
    chevronAt: "right-1.5",
    clearGap: "mr-6",
    list: "max-h-[min(336px,50vh)]",
  },
  md: {
    row: "min-h-md",
    pad: "pl-3 pr-2.5",
    nativePad: "pl-3 pr-[34px]",
    minWidth: "min-w-[64px]",
    iconBox: "w-4 h-4",
    glyph: "text-[12px]",
    lead: "text-[16px]",
    clearAt: "right-[34px]",
    chevronAt: "right-2.5",
    clearGap: "mr-6",
    list: "max-h-[min(384px,50vh)]",
  },
  lg: {
    row: "min-h-lg",
    pad: "pl-4 pr-3.5",
    nativePad: "pl-4 pr-[42px]",
    minWidth: "min-w-[80px]",
    iconBox: "w-5 h-5",
    glyph: "text-[14px]",
    lead: "text-[20px]",
    clearAt: "right-[42px]",
    chevronAt: "right-3.5",
    clearGap: "mr-7",
    list: "max-h-[min(480px,50vh)]",
  },
};

const box = computed(() => sizes[props.size]);

const triggerBase =
  "w-full items-center gap-2 rounded-sm border border-solid text-left text-body font-normal " +
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-ink-faint disabled:border-separator";

const triggerShell = computed(() => [
  triggerBase,
  motion,
  box.value.row,
  box.value.minWidth,
  props.invalid ? focusRingInvalid : focusRing,
  props.invalid
    ? "border-danger-ink shadow-[inset_0_0_0_1px_var(--c-danger-fg)]"
    : "border-control",
  props.readOnly
    ? "cursor-default bg-transparent border-separator text-ink"
    : "cursor-pointer bg-raised text-ink",
  !isInert.value && "hover:bg-inset active:bg-selected",
  !props.readOnly && open.value && "bg-inset",
]);

const triggerClass = computed(() => [
  triggerShell.value,
  box.value.pad,
  "flex",
]);
const nativeClass = computed(() => [triggerShell.value, box.value.nativePad]);

const optionClass = (index: number, option: DsSelectOption) => [
  "flex items-center gap-2 rounded-xs px-2 text-ink",
  motion,
  box.value.row,
  option.disabled === true
    ? "cursor-not-allowed text-ink-faint"
    : "cursor-pointer",

  option.disabled !== true &&
  selected.value.includes(option.value) &&
  index === activeIndex.value
    ? "bg-[color-mix(in_srgb,var(--c-bg-selected)_88%,var(--c-fg-default))]"
    : option.disabled !== true && selected.value.includes(option.value)
      ? "bg-selected"
      : option.disabled !== true && index === activeIndex.value
        ? "bg-inset"
        : "bg-transparent",
];

const messageClass = computed(() => [
  "flex items-center gap-2 px-2 text-ink-muted",
  box.value.row,
]);

const inlineActionClass =
  "cursor-pointer rounded-sm border border-solid border-control bg-transparent px-1.5 py-0.5 " +
  "text-[13px] font-medium text-ink hover:bg-inset " +
  focusRing;

const spinnerClass = computed(() => [
  "flex-none animate-spin rounded-full border-2 border-solid border-current border-t-transparent",
  "motion-reduce:animate-[spin_1.4s_linear_infinite]",
  box.value.iconBox,
]);
</script>

<template>
  <div
    ref="rootEl"
    class="flex flex-col gap-1.5 text-left text-body"
    :style="{ width }"
  >
    <label
      :id="labelId"
      :for="triggerId"
      :class="[hideLabel ? 'sr-only' : 'text-[13px] font-medium text-ink']"
    >
      {{ label
      }}<span v-if="required" class="ml-1 text-danger-ink" aria-hidden="true"
        >*</span
      >
    </label>

    <div v-if="variant === 'native'" class="relative block">
      <select
        :id="triggerId"
        :class="[nativeClass, 'block appearance-none']"
        :disabled="disabled"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        :value="selected[0] ?? ''"
        @change="onNativeChange"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <span
        aria-hidden="true"
        :class="[
          'pointer-events-none absolute top-1/2 inline-flex [transform:translateY(-50%)] items-center justify-center',
          box.iconBox,
          box.chevronAt,
          invalid ? 'text-danger-ink' : 'text-ink-muted',
        ]"
      >
        <i class="fas fa-chevron-down" :class="box.glyph" />
      </span>
    </div>

    <div v-else class="relative block">
      <button
        :id="triggerId"
        ref="triggerEl"
        type="button"
        :class="triggerClass"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-autocomplete="variant === 'filterable' ? 'list' : 'none'"
        :aria-activedescendant="
          open && activeIndex >= 0 && !isFilterable
            ? optionId(activeIndex)
            : undefined
        "
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
        :aria-busy="loading || undefined"
        :aria-disabled="loading || undefined"
        :aria-readonly="readOnly || undefined"
        :disabled="disabled"
        @click="onTriggerClick"
        @keydown="onKeydown"
      >
        <i
          v-if="icon"
          :class="[icon, box.lead]"
          aria-hidden="true"
          class="flex-none leading-none"
        />
        <span
          :class="[
            'min-w-0 flex-1 truncate',
            hasValue ? '' : 'text-ink-muted',
            disabled && 'text-ink-faint',
            showClear && box.clearGap,
          ]"
          >{{ displayValue }}</span
        >
        <span v-if="loading" aria-hidden="true" :class="spinnerClass" />
        <span
          v-else-if="!readOnly"
          aria-hidden="true"
          :class="[
            'inline-flex flex-none items-center justify-center transition-transform duration-2 ease-standard motion-reduce:transition-none',
            box.iconBox,
            open && '[transform:rotate(180deg)]',
            invalid
              ? 'text-danger-ink'
              : disabled
                ? 'text-ink-faint'
                : 'text-ink-muted',
          ]"
        >
          <i class="fas fa-chevron-down" :class="box.glyph" />
        </span>
      </button>

      <button
        v-if="showClear"
        type="button"
        aria-label="Clear selection"
        :class="[
          'absolute top-1/2 inline-flex [transform:translateY(-50%)] cursor-pointer items-center justify-center',
          'rounded-xs border-0 bg-transparent p-0 text-ink-muted hover:text-ink',
          box.iconBox,
          box.clearAt,
          focusRing,
        ]"
        @click="clear"
      >
        <i class="fas fa-xmark" :class="box.glyph" aria-hidden="true" />
      </button>

      <div
        v-if="open"
        :class="[
          'z-30 w-max min-w-full max-w-[480px] rounded-md border border-solid border-control bg-raised p-1 shadow-lg',
          inlineOverlay
            ? 'static mt-1'
            : 'absolute left-0 top-[calc(100%+4px)]',
        ]"
      >
        <div
          v-if="isFilterable"
          class="-mx-1 -mt-1 mb-1 border-0 border-b border-solid border-separator p-1"
        >
          <input
            ref="filterEl"
            v-model="query"
            type="text"
            :class="[
              'w-full rounded-sm border border-solid border-control bg-canvas px-2 text-body text-ink',
              'placeholder:text-ink-muted',
              box.row,
              focusRing,
            ]"
            :placeholder="filterPlaceholder"
            :aria-label="`Filter ${label}`"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            :aria-controls="listId"
            :aria-activedescendant="
              activeIndex >= 0 ? optionId(activeIndex) : undefined
            "
            @keydown="onKeydown"
            @input="setActive(0)"
          />
        </div>

        <div
          :id="listId"
          ref="listEl"
          role="listbox"
          :aria-labelledby="labelId"
          :aria-multiselectable="isMultiple || undefined"
          tabindex="-1"
          :class="['overflow-y-auto', box.list]"
        >
          <div v-if="listState === 'loading'" :class="messageClass">
            <span aria-hidden="true" :class="spinnerClass" />
            <span>Loading options</span>
          </div>

          <div
            v-else-if="listState === 'failed'"
            :class="[messageClass, 'text-danger-ink']"
          >
            <i
              class="fas fa-triangle-exclamation flex-none text-[12px]"
              aria-hidden="true"
            />
            <span>{{ failedText }}</span>
            <button
              type="button"
              :class="inlineActionClass"
              @click="emit('retry')"
            >
              Retry
            </button>
          </div>

          <div v-else-if="listState === 'empty'" :class="messageClass">
            <span>{{ emptyMessage }}</span>
            <button
              v-if="isFilterable && query.trim() !== ''"
              type="button"
              :class="inlineActionClass"
              @click="query = ''"
            >
              Clear filter
            </button>
          </div>

          <template v-else>
            <div
              v-for="group in groups"
              :key="group.key"
              :role="group.label ? 'group' : 'presentation'"
              :aria-label="group.label"
            >
              <div
                v-if="group.label"
                :class="[
                  'flex items-center px-2 text-caption font-semibold uppercase tracking-[0.04em] text-ink-muted',
                  box.row,
                ]"
              >
                {{ group.label }}
              </div>
              <div
                v-for="item in group.items"
                :id="optionId(item.index)"
                :key="item.option.value"
                :class="optionClass(item.index, item.option)"
                role="option"
                :aria-selected="selected.includes(item.option.value)"
                :aria-disabled="item.option.disabled || undefined"
                :aria-posinset="item.index + 1"
                :aria-setsize="visibleOptions.length"
                @mousedown.prevent
                @click="onOptionClick(item.index)"
                @mousemove="setActive(item.index)"
              >
                <span
                  class="inline-flex w-4 flex-none justify-center text-accent-ink"
                  aria-hidden="true"
                >
                  <i
                    v-if="selected.includes(item.option.value)"
                    class="fas fa-check text-[12px]"
                  />
                </span>
                <span class="min-w-0 truncate">{{ item.option.label }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <p v-if="helpText" :id="helpId" class="m-0 text-caption text-ink-muted">
      {{ helpText }}
    </p>
    <p v-if="errorText" :id="errorId" class="m-0 text-caption text-danger-ink">
      {{ errorText }}
    </p>
    <span class="sr-only" role="status" aria-live="polite">{{
      statusMessage
    }}</span>
  </div>
</template>
