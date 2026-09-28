<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const { text, block = false } = defineProps<{
  text: string;
  block?: boolean;
}>();

const copied = ref(false);

let clear: number | undefined = undefined;

const copy = async () => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return;
  }

  copied.value = true;
  window.clearTimeout(clear);
  clear = window.setTimeout(() => {
    copied.value = false;
  }, 1200);
};

onBeforeUnmount(() => {
  window.clearTimeout(clear);
});
</script>

<template>
  <button
    type="button"
    :aria-label="`Copy ${text}`"
    :class="block ? 'flex w-full' : 'inline-flex max-w-full'"
    class="group -mx-1 cursor-pointer items-center gap-1.5 rounded px-1 text-left align-middle transition hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none"
    @click="copy"
  >
    <span class="min-w-0 flex-1"><slot /></span>

    <i
      :class="
        copied
          ? 'fas fa-check text-fg-success'
          : 'fas fa-copy invisible text-fg-muted group-hover:visible group-focus-visible:visible'
      "
      class="shrink-0 text-caption"
      aria-hidden="true"
    />
  </button>
</template>
