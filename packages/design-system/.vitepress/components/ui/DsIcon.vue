<script setup lang="ts">
type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
type IconTone =
  | "inherit"
  | "muted"
  | "faint"
  | "accent"
  | "danger"
  | "warning"
  | "success"
  | "info";

withDefaults(
  defineProps<{
    icon: string;

    size?: IconSize;

    fixedWidth?: boolean;

    label?: string;
    tone?: IconTone;
  }>(),
  { size: "sm", fixedWidth: false, tone: "inherit" },
);

const sizes: Record<IconSize, string> = {
  xs: "text-[0.75rem]",
  sm: "text-[1rem]",
  md: "text-[1.25rem]",
  lg: "text-[1.5rem]",
  xl: "text-[2rem]",
};

const tones: Record<IconTone, string> = {
  inherit: "",
  muted: "text-ink-muted",
  faint: "text-ink-faint",
  accent: "text-accent-ink",
  danger: "text-danger-ink",
  warning: "text-gold-ink",
  success: "text-success-ink",
  info: "text-info-ink",
};
</script>

<template>
  <i
    :class="[
      icon,
      sizes[size],
      tones[tone],
      fixedWidth && 'fa-fw',
      'inline-block shrink-0 leading-none',
    ]"
    :role="label === undefined ? undefined : 'img'"
    :aria-hidden="label === undefined ? 'true' : undefined"
    :aria-label="label"
  />
</template>
