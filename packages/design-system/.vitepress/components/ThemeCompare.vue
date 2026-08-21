<script setup lang="ts">
import { ref } from "vue";

withDefaults(defineProps<{ dark?: string; light?: string; alt?: string }>(), {
  dark: "/_images/dark.png",
  light: "/_images/light.png",
  alt: "Caido HTTP History in both themes",
});

const split = ref(50);
</script>

<template>
  <figure class="my-7">
    <div
      class="relative isolate select-none overflow-hidden rounded-lg border border-separator"
    >
      <img :src="light" :alt="alt" class="block w-full" draggable="false" />
      <img
        :src="dark"
        alt=""
        aria-hidden="true"
        draggable="false"
        class="absolute inset-0 block w-full"
        :style="{ clipPath: `inset(0 calc(100% - ${split}%) 0 0)` }"
      />

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_0_0_/_0.35)]"
        :style="{ left: `calc(${split}% - 1px)` }"
      >
        <span
          class="absolute flex items-center justify-center rounded-full bg-white text-[#221F1B] shadow-[0_0_0_1px_rgb(0_0_0_/_0.3),0_2px_10px_rgb(0_0_0_/_0.3)]"
          style="
            width: 40px;
            height: 40px;
            left: 1px;
            top: 50%;
            margin-left: -20px;
            margin-top: -20px;
          "
        >
          <i class="fas fa-left-right text-[13px] leading-none" />
        </span>
      </div>

      <input
        v-model="split"
        type="range"
        min="0"
        max="100"
        aria-label="Reveal the dark or the light theme"
        class="absolute inset-0 z-30 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] focus-visible:-outline-offset-2"
      />
    </div>
  </figure>
</template>

<style scoped>
@media print {
  input[type="range"] {
    display: none;
  }
  img[aria-hidden="true"] {
    position: static;
    clip-path: none;
    margin-top: 8px;
  }
}
</style>
