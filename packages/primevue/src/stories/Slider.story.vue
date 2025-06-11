<script setup lang="ts">
import Slider from "primevue/slider";
import { ref } from "vue";

const value = ref(50);
const rangeValue = ref([20, 80]);
const stepValue = ref(10);
</script>

<template>
  <Story title="Slider">
    <Variant title="States">
      <div class="flex flex-col gap-6 w-[320px]">
        <div class="flex flex-col gap-2">
          <span>Basic</span>
          <Slider v-model="value" />
          <span class="text-xs text-surface-400">Value: {{ value }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <span>Range</span>
          <Slider v-model="rangeValue" range />
          <span class="text-xs text-surface-400">Value: {{ rangeValue }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <span>Step = 10</span>
          <Slider v-model="stepValue" :step="10" />
          <span class="text-xs text-surface-400">Value: {{ stepValue }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <span>Disabled</span>
          <Slider :model-value="30" disabled />
        </div>
        <div class="flex flex-col gap-2">
          <span>Invalid</span>
          <Slider :model-value="70" invalid />
        </div>
      </div>
    </Variant>
  </Story>
</template>
