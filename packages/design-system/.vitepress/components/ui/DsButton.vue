<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    variant?: "primary" | "secondary" | "ghost";

    danger?: boolean;
    size?: "sm" | "md" | "lg";

    icon?: string;
    iconOnly?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    variant: "secondary",
    size: "md",
    danger: false,
    loading: false,
    disabled: false,
    iconOnly: false,
  },
);

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent " +
  "font-medium leading-none cursor-pointer transition duration-1 ease-standard " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-ink-faint disabled:border-transparent";

const sizes = {
  sm: "h-sm px-2.5 text-body",
  md: "h-md px-3 text-body",
  lg: "h-lg px-4 text-title",
};

const iconSizes = { sm: "w-sm px-0", md: "w-md px-0", lg: "w-lg px-0" };

const variants = {
  primary: "bg-accent text-ink-onsolid enabled:hover:brightness-110",
  secondary: "bg-transparent text-ink border-control enabled:hover:bg-inset",
  ghost:
    "bg-transparent text-ink-muted enabled:hover:bg-inset enabled:hover:text-ink",
};

const dangerVariants = {
  primary:
    "bg-[var(--c-danger-fg)] text-ink-onsolid enabled:hover:brightness-110",
  secondary:
    "bg-transparent text-danger-ink border-danger-ink enabled:hover:bg-inset",
  ghost: "bg-transparent text-danger-ink enabled:hover:bg-inset",
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    :aria-label="iconOnly ? label : undefined"
    :aria-busy="loading || undefined"
    :class="[
      base,
      sizes[size],
      (danger ? dangerVariants : variants)[variant],
      iconOnly && iconSizes[size],
    ]"
  >
    <span
      v-if="loading"
      aria-hidden="true"
      class="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-[spin_1.4s_linear_infinite]"
    />
    <i
      v-else-if="icon"
      :class="icon"
      aria-hidden="true"
      class="text-[13px] leading-none"
    />
    <span v-if="!iconOnly">{{ label }}</span>
  </button>
</template>
