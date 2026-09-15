<script setup lang="ts">
import { computed, ref, useId } from "vue";

type Variant = "text" | "multiline" | "search" | "masked";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    label: string;
    variant?: Variant;
    size?: Size;
    placeholder?: string;

    help?: string;

    error?: string;
    prefix?: string;
    suffix?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;

    invalid?: boolean;
    loading?: boolean;
    maxlength?: number;
    rows?: number;
    autocomplete?: string;
    hideLabel?: boolean;
  }>(),
  {
    variant: "text",
    size: "md",
    required: false,
    disabled: false,
    readonly: false,
    invalid: false,
    loading: false,
    rows: 3,
    hideLabel: false,
  },
);

const value = defineModel<string>({ default: "" });

const uid = useId();
const fieldId = `dsi-${uid}`;
const helpId = `${fieldId}-help`;
const errorId = `${fieldId}-error`;

const field = ref<HTMLInputElement | HTMLTextAreaElement>();
const revealed = ref(false);

const isMultiline = computed(() => props.variant === "multiline");
const isSearch = computed(() => props.variant === "search");
const isMasked = computed(() => props.variant === "masked");

const inputType = computed(() => {
  if (isSearch.value) return "search";
  if (isMasked.value) return revealed.value ? "text" : "password";
  return "text";
});

const hasClear = computed(
  () =>
    isSearch.value &&
    value.value.length > 0 &&
    !props.disabled &&
    !props.readonly,
);

const showCounter = computed(() => {
  if (props.maxlength === undefined) return false;
  return props.maxlength <= 40 || value.value.length >= props.maxlength * 0.8;
});

const boxSizes: Record<Size, string> = {
  sm: "min-h-sm px-2",
  md: "min-h-md px-3",
  lg: "min-h-lg px-4",
};

const iconFont: Record<Size, string> = {
  sm: "text-[16px]",
  md: "text-[16px]",
  lg: "text-[20px]",
};
const iconBox: Record<Size, string> = { sm: "w-4", md: "w-4", lg: "w-5" };
const buttonInsets: Record<Size, string> = {
  sm: "-me-1",
  md: "-me-2",
  lg: "-me-3",
};

const boxBase =
  "flex items-center gap-3 rounded-md border cursor-text " +
  "transition-colors duration-1 ease-standard motion-reduce:transition-none " +
  "has-[:focus-visible]:outline-none " +
  "has-[:focus-visible]:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const boxTone = computed(() => {
  if (props.disabled)
    return "bg-disabled border-control cursor-default select-none pointer-events-none";
  if (props.readonly) return "bg-inset border-separator";
  if (props.invalid) return "bg-raised border-danger-ink";
  return "bg-raised border-control hover:border-ink-muted";
});

const fieldBase =
  "grow min-w-0 m-0 p-0 appearance-none border-0 bg-transparent font-sans font-normal text-ink outline-none " +
  "placeholder:text-ink-faint placeholder:opacity-100 selection:bg-selected selection:text-ink " +
  "[&::-webkit-search-cancel-button]:appearance-none " +
  "disabled:cursor-default disabled:text-ink-faint disabled:placeholder:text-ink-faint";

const buttonBase =
  "flex-none inline-flex h-6 w-6 items-center justify-center rounded-full border-0 bg-transparent " +
  "cursor-pointer transition-colors duration-1 ease-standard motion-reduce:transition-none " +
  "enabled:hover:bg-inset enabled:hover:text-ink aria-pressed:text-ink " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] disabled:cursor-default disabled:text-ink-faint";

const mutedInk = computed(() =>
  props.disabled ? "text-ink-faint" : "text-ink-muted",
);

const slotBase = computed(() => [
  "pointer-events-none flex-none inline-flex items-center justify-center leading-none",
  mutedInk.value,
  isMultiline.value && "self-start",
]);

const focusField = (event: MouseEvent) => {
  if (event.target === event.currentTarget) field.value?.focus();
};

const clear = () => {
  value.value = "";
  field.value?.focus();
};

const onEscape = (event: KeyboardEvent) => {
  if (isSearch.value && value.value.length > 0) {
    event.stopPropagation();
    clear();
  }
};
</script>

<template>
  <div class="w-full max-w-full">
    <div class="flex items-baseline justify-between gap-3">
      <label
        :for="fieldId"
        :class="['text-body font-medium', mutedInk, hideLabel && 'sr-only']"
      >
        {{ label
        }}<span v-if="required" class="ms-1 text-danger-ink"
          >*<span class="sr-only"> required</span></span
        >
      </label>
      <span
        v-if="showCounter"
        role="status"
        :class="['text-caption tabular-nums', mutedInk]"
      >
        {{ value.length }}/{{ maxlength }}
      </span>
    </div>

    <div class="mb-2 mt-1 min-h-[16px]">
      <p :id="helpId" :class="['m-0 text-caption empty:hidden', mutedInk]">
        {{ help }}
      </p>
      <p :id="errorId" class="m-0 text-caption text-danger-ink empty:hidden">
        {{ invalid ? error : "" }}
      </p>
    </div>

    <div
      :class="[
        boxBase,
        boxSizes[size],
        boxTone,
        isMultiline && 'items-stretch py-2',
      ]"
      @mousedown="focusField"
    >
      <span
        v-if="isSearch"
        aria-hidden="true"
        :class="[slotBase, iconBox[size], iconFont[size]]"
      >
        <i class="fas fa-magnifying-glass" />
      </span>
      <span
        v-else-if="$slots.prefix || prefix"
        :class="[slotBase, 'whitespace-nowrap text-body']"
      >
        <slot name="prefix">{{ prefix }}</slot>
      </span>

      <textarea
        v-if="isMultiline"
        :id="fieldId"
        ref="field"
        v-model="value"
        :class="[fieldBase, 'min-h-[60px] resize-y text-body']"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :aria-describedby="`${helpId} ${errorId}`"
        :aria-invalid="invalid || undefined"
        :aria-busy="loading || undefined"
      />
      <input
        v-else
        :id="fieldId"
        ref="field"
        v-model="value"
        :class="[fieldBase, 'text-body leading-none']"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :aria-describedby="`${helpId} ${errorId}`"
        :aria-invalid="invalid || undefined"
        :aria-busy="loading || undefined"
        @keydown.esc="onEscape"
      />

      <span
        v-if="$slots.suffix || suffix"
        :class="[slotBase, 'whitespace-nowrap text-body']"
      >
        <slot name="suffix">{{ suffix }}</slot>
      </span>

      <button
        v-if="isMasked"
        type="button"
        :class="[buttonBase, buttonInsets[size], iconFont[size], mutedInk]"
        :aria-pressed="revealed"
        :aria-label="revealed ? 'Hide value' : 'Show value'"
        :disabled="disabled"
        @click="revealed = !revealed"
      >
        <i
          :class="revealed ? 'fas fa-eye-slash' : 'fas fa-eye'"
          aria-hidden="true"
        />
      </button>

      <button
        v-if="hasClear"
        type="button"
        :class="[buttonBase, buttonInsets[size], iconFont[size], mutedInk]"
        aria-label="Clear search"
        @click="clear"
      >
        <i class="fas fa-xmark" aria-hidden="true" />
      </button>

      <span
        v-if="loading"
        aria-hidden="true"
        :class="[slotBase, iconBox[size], iconFont[size]]"
      >
        <i
          class="fas fa-spinner animate-spin motion-reduce:animate-[spin_1.4s_linear_infinite]"
        />
      </span>
      <span
        v-else-if="invalid"
        aria-hidden="true"
        :class="[
          'pointer-events-none flex-none inline-flex items-center justify-center leading-none text-danger-ink',
          iconBox[size],
          iconFont[size],
          isMultiline && 'self-start',
        ]"
      >
        <i class="fas fa-circle-exclamation" />
      </span>
    </div>
  </div>
</template>
