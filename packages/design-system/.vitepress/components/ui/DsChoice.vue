<script setup lang="ts">
import { computed, ref, useId, watch, watchEffect } from "vue";

type Kind = "checkbox" | "radio" | "switch";
type Size = "sm" | "md";
type ChoiceOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
type Row = {
  key: string;
  value: string;
  label: string;
  description?: string;
  disabled: boolean;
  isParent: boolean;
};

const props = withDefaults(
  defineProps<{
    kind?: Kind;
    size?: Size;

    label?: string;

    description?: string;

    modelValue?: boolean;

    indeterminate?: boolean;
    disabled?: boolean;

    readonly?: boolean;

    invalid?: boolean;

    loading?: boolean;

    stateText?: boolean;

    ariaLabel?: string;

    options?: ChoiceOption[];

    groupLabel?: string;

    selected?: string[];

    error?: string;
    required?: boolean;

    inline?: boolean;

    parentLabel?: string;
  }>(),
  {
    kind: "checkbox",
    size: "md",
    modelValue: false,
    indeterminate: false,
    disabled: false,
    readonly: false,
    invalid: false,
    loading: false,
    stateText: false,
    required: false,
    inline: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [boolean];
  "update:selected": [string[]];
}>();

const uid = useId();
const groupName = `${uid}-name`;
const groupLabelId = `${uid}-glabel`;
const errorId = `${uid}-error`;
const descId = (index: number) => `${uid}-desc-${index}`;

const isGroup = computed(() => (props.options ?? []).length > 0);
const hasParent = computed(
  () =>
    isGroup.value &&
    props.kind === "checkbox" &&
    props.parentLabel !== undefined,
);

const single = ref(props.modelValue);
const singleMixed = ref(props.indeterminate);
const picked = ref<string[]>([...(props.selected ?? [])]);

watch(
  () => props.modelValue,
  (value) => {
    single.value = value;
  },
);
watch(
  () => props.indeterminate,
  (value) => {
    singleMixed.value = value;
  },
);
watch(
  () => props.selected,
  (value) => {
    const next = [...(value ?? [])];
    const same =
      next.length === picked.value.length &&
      next.every((item) => picked.value.includes(item));
    if (!same) picked.value = next;
  },
  { deep: true },
);

const rows = computed<Row[]>(() => {
  if (!isGroup.value) {
    return [
      {
        key: "single",
        value: "",
        label: props.label ?? "",
        description: props.description,
        disabled: props.disabled,
        isParent: false,
      },
    ];
  }

  const items = (props.options ?? []).map((option) => ({
    key: option.value,
    value: option.value,
    label: option.label,
    description: option.description,
    disabled: props.disabled || option.disabled === true,
    isParent: false,
  }));

  if (hasParent.value) {
    items.unshift({
      key: "parent",
      value: "",
      label: props.parentLabel ?? "",
      description: undefined,
      disabled: props.disabled,
      isParent: true,
    });
  }

  return items;
});

const selectableValues = computed(() =>
  (props.options ?? [])
    .filter((option) => option.disabled !== true)
    .map((option) => option.value),
);
const allSelected = computed(
  () =>
    selectableValues.value.length > 0 &&
    selectableValues.value.every((value) => picked.value.includes(value)),
);
const someSelected = computed(
  () => picked.value.length > 0 && !allSelected.value,
);

const isChecked = (row: Row) => {
  if (row.isParent) return allSelected.value;
  if (!isGroup.value) return single.value;
  return picked.value.includes(row.value);
};

const isMixed = (row: Row) => {
  if (props.kind !== "checkbox") return false;
  if (row.isParent) return someSelected.value;
  if (!isGroup.value) return singleMixed.value;
  return false;
};

const inputs = ref<HTMLInputElement[]>([]);
const setInput = (el: unknown, index: number) => {
  if (el instanceof HTMLInputElement) inputs.value[index] = el;
};

watchEffect(
  () => {
    rows.value.forEach((row, index) => {
      const el = inputs.value[index];
      if (el !== undefined) el.indeterminate = isMixed(row);
    });
  },
  { flush: "post" },
);

const commit = (next: string[]) => {
  picked.value = next;
  emit("update:selected", next);
};

const onChange = (row: Row) => {
  if (props.readonly) return;

  if (row.isParent) {
    commit(allSelected.value ? [] : [...selectableValues.value]);
    return;
  }

  if (!isGroup.value) {
    single.value = singleMixed.value ? true : !single.value;
    singleMixed.value = false;
    emit("update:modelValue", single.value);
    return;
  }

  if (props.kind === "radio") {
    commit([row.value]);
    return;
  }

  commit(
    picked.value.includes(row.value)
      ? picked.value.filter((value) => value !== row.value)
      : [...picked.value, row.value],
  );
};

const onClick = (event: MouseEvent) => {
  if (props.readonly) event.preventDefault();
};

const firstEnabled = computed(() =>
  rows.value.findIndex((row) => !row.disabled),
);
const anyChecked = computed(() => rows.value.some((row) => isChecked(row)));

const tabIndexFor = (row: Row, index: number) => {
  if (props.kind !== "radio" || !isGroup.value) return undefined;
  if (isChecked(row)) return 0;
  return !anyChecked.value && index === firstEnabled.value ? 0 : -1;
};

const onKeydown = (event: KeyboardEvent, index: number) => {
  if (props.kind !== "radio" || !isGroup.value) return;

  const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
  const back = event.key === "ArrowUp" || event.key === "ArrowLeft";
  if (!forward && !back) return;

  event.preventDefault();

  const total = rows.value.length;
  const step = forward ? 1 : -1;
  let next = index;
  for (let hop = 1; hop <= total; hop += 1) {
    const candidate = (index + step * hop + total * total) % total;
    if (!rows.value[candidate]?.disabled) {
      next = candidate;
      break;
    }
  }
  if (next === index) return;

  const row = rows.value[next];
  if (row === undefined) return;
  if (!props.readonly) commit([row.value]);
  inputs.value[next]?.focus();
};

const describedBy = (row: Row, index: number) => {
  const ids = [
    row.description !== undefined ? descId(index) : undefined,
    props.invalid && props.error !== undefined ? errorId : undefined,
  ].filter((id) => id !== undefined);
  return ids.length > 0 ? ids.join(" ") : undefined;
};

const itemBase =
  "relative flex items-start gap-2 rounded-sm transition-colors duration-1 ease-standard " +
  "motion-reduce:transition-none [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:items-center";
const itemSize = { sm: "min-h-[24px] py-[3px]", md: "min-h-[28px] py-1" };
const bareSize = {
  sm: "px-[5px] [@media(pointer:coarse)]:px-[14px]",
  md: "px-1 [@media(pointer:coarse)]:px-[14px]",
};
const slotSize = { sm: "h-[18px]", md: "h-5" };
const labelSize = { sm: "text-dense", md: "text-body" };

const boxBase =
  "relative box-border flex flex-none items-center justify-center border border-solid " +
  "transition duration-2 ease-standard motion-reduce:transition-none " +
  "peer-focus-visible:outline-none peer-focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "peer-focus-visible:outline-none peer-focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] peer-";
const boxSize = {
  checkbox: { sm: "h-[14px] w-[14px] rounded-xs", md: "h-4 w-4 rounded-xs" },
  radio: { sm: "h-3 w-3 rounded-full", md: "h-[14px] w-[14px] rounded-full" },
  switch: { sm: "h-[14px] w-6 rounded-full", md: "h-4 w-7 rounded-full" },
};
const checkSize = { sm: "text-[10px]", md: "text-[12px]" };
const barSize = { sm: "h-[2px] w-[7px]", md: "h-[2px] w-2" };
const knobSize = { sm: "h-2.5 w-2.5", md: "h-3 w-3" };
const knobTravel = {
  sm: "[transform:translateX(10px)]",
  md: "[transform:translateX(12px)]",
};

const itemState = (row: Row) => {
  if (row.disabled) return "cursor-not-allowed";
  if (props.readonly) return "cursor-default";
  return "cursor-pointer hover:bg-[var(--c-state-hover)] active:bg-[var(--c-state-pressed)]";
};

const boxTone = (row: Row) => {
  if (row.disabled) return "border-separator bg-disabled text-ink-faint";
  const set = isChecked(row) || isMixed(row);
  const fill = set
    ? "bg-accent"
    : props.kind === "switch"
      ? "bg-inset"
      : "bg-raised";
  const edge = props.invalid
    ? "border-danger-ink"
    : set
      ? "border-accent"
      : "border-control";
  return `${fill} ${edge} text-ink-onsolid`;
};

const knobTone = (row: Row) => {
  if (row.disabled) return "bg-ink-faint";
  return isChecked(row) ? "bg-ink-onsolid" : "bg-ink-muted";
};

const textTone = (row: Row) => (row.disabled ? "text-ink-faint" : "text-ink");
const mutedTone = (row: Row) =>
  row.disabled ? "text-ink-faint" : "text-ink-muted";
</script>

<template>
  <div
    :class="isGroup ? 'block' : 'inline-flex'"
    :role="isGroup ? (kind === 'radio' ? 'radiogroup' : 'group') : undefined"
    :aria-labelledby="
      isGroup && groupLabel !== undefined ? groupLabelId : undefined
    "
    :aria-required="isGroup && required ? 'true' : undefined"
  >
    <span
      v-if="isGroup && groupLabel !== undefined"
      :id="groupLabelId"
      class="mb-2 block text-[13px] font-medium leading-[18px] text-ink"
    >
      {{ groupLabel
      }}<span v-if="required" class="ms-1 text-danger-ink" aria-hidden="true"
        >*</span
      >
    </span>

    <div
      :class="
        inline
          ? 'flex flex-row flex-wrap items-start gap-4'
          : 'flex flex-col items-start gap-1'
      "
    >
      <label
        v-for="(row, index) in rows"
        :key="row.key"
        :class="[
          itemBase,
          itemSize[size],
          itemState(row),
          row.label === '' && bareSize[size],
          hasParent && !row.isParent && 'ps-6',
        ]"
      >
        <span
          :class="[
            'relative flex flex-none items-center justify-center',
            slotSize[size],
            '[@media(pointer:coarse)]:h-6',
          ]"
        >
          <input
            :ref="(el) => setInput(el, index)"
            class="peer absolute inset-0 m-0 cursor-[inherit] p-0 opacity-0"
            :type="kind === 'radio' ? 'radio' : 'checkbox'"
            :role="kind === 'switch' ? 'switch' : undefined"
            :name="kind === 'radio' && isGroup ? groupName : undefined"
            :value="row.value"
            :checked="isChecked(row)"
            :disabled="row.disabled"
            :tabindex="tabIndexFor(row, index)"
            :aria-label="row.label === '' ? ariaLabel : undefined"
            :aria-disabled="readonly ? 'true' : undefined"
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-busy="kind === 'switch' && loading ? 'true' : undefined"
            :aria-describedby="describedBy(row, index)"
            @click="onClick"
            @change="onChange(row)"
            @keydown="onKeydown($event, index)"
          />

          <span
            aria-hidden="true"
            :class="[boxBase, boxSize[kind][size], boxTone(row)]"
          >
            <i
              v-if="kind === 'checkbox' && isChecked(row) && !isMixed(row)"
              :class="['fas fa-check leading-none', checkSize[size]]"
            />
            <span
              v-else-if="kind === 'checkbox' && isMixed(row)"
              :class="['rounded-full bg-current', barSize[size]]"
            />
            <span
              v-else-if="kind === 'radio' && isChecked(row)"
              class="h-1.5 w-1.5 rounded-full bg-current"
            />
            <span
              v-if="kind === 'switch'"
              :class="[
                'absolute left-px top-px rounded-full transition duration-2 ease-standard motion-reduce:transition-none',
                knobSize[size],
                knobTone(row),
                isChecked(row) && knobTravel[size],
              ]"
            />
          </span>
        </span>

        <span v-if="row.label !== ''" class="flex min-w-0 flex-col gap-1">
          <span :class="[labelSize[size], 'font-normal', textTone(row)]">{{
            row.label
          }}</span>
          <span
            v-if="row.description !== undefined"
            :id="descId(index)"
            :class="['text-caption', mutedTone(row)]"
            aria-hidden="true"
          >
            {{ row.description }}
          </span>
        </span>

        <span
          v-if="kind === 'switch' && stateText"
          :class="[
            'min-w-[20px] self-center text-caption font-medium',
            mutedTone(row),
          ]"
          aria-hidden="true"
        >
          {{ isChecked(row) ? "On" : "Off" }}
        </span>
        <span
          v-if="kind === 'switch' && loading"
          aria-hidden="true"
          class="h-3 w-3 flex-none animate-spin self-center rounded-full border-2 border-current border-t-transparent text-ink-muted motion-reduce:animate-[spin_1.4s_linear_infinite]"
        />
      </label>
    </div>

    <span
      v-if="invalid && error !== undefined"
      :id="errorId"
      class="mt-1 block text-caption text-danger-ink"
    >
      {{ error }}
    </span>
  </div>
</template>
