<script setup lang="ts">
import ColorPicker from "primevue/colorpicker";
import { ref } from "vue";

const color = ref("#103B66");
const inlineColor = ref("#103B66");
</script>

<template>
  <Story title="ColorPicker">
    <Variant title="Basic">
      <div class="flex flex-col gap-4">
        <ColorPicker v-model="color" />
        <div class="text-gray-300">Selected Color: {{ color }}</div>
      </div>
    </Variant>

    <Variant title="Inline">
      <div class="flex flex-col gap-4">
        <ColorPicker v-model="inlineColor" inline />
        <div class="text-gray-300">Selected Color: {{ inlineColor }}</div>
      </div>
    </Variant>

    <Variant title="Disabled">
      <ColorPicker v-model="color" disabled />
    </Variant>
  </Story>
</template>
