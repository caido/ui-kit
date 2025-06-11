<script setup lang="ts">
import Knob from "primevue/knob";
import { ref } from "vue";

const value = ref(60);
const valueStep = ref(40);
const valueReadonly = ref(50);
const valueDisabled = ref(70);
</script>

<template>
  <Story title="Knob">
    <Variant title="States">
      <div class="flex flex-wrap gap-8">
        <div class="flex flex-col items-center gap-2">
          <Knob v-model="value" />
          <span class="text-surface-300">Basic</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Knob v-model="valueStep" :step="10" />
          <span class="text-surface-300">Step: 10</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Knob v-model="valueReadonly" readonly />
          <span class="text-surface-300">Readonly</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Knob v-model="valueDisabled" disabled />
          <span class="text-surface-300">Disabled</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Knob v-model="value" :min="-50" :max="50" />
          <span class="text-surface-300">Min/Max</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Knob v-model="value" value-template="{value}%" />
          <span class="text-surface-300">Value Template</span>
        </div>
      </div>
    </Variant>
  </Story>
</template>
