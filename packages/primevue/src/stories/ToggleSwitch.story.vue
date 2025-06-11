<script setup lang="ts">
import ToggleSwitch from "primevue/toggleswitch";
import { ref } from "vue";

const checked = ref(false);
const checked2 = ref(true);
</script>

<template>
  <Story title="ToggleSwitch">
    <Variant title="States">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="checked" />
          <span class="text-surface-300">Default unchecked</span>
        </div>

        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="checked2" />
          <span class="text-surface-300">Default checked</span>
        </div>

        <div class="flex items-center gap-2">
          <ToggleSwitch disabled />
          <span class="text-surface-300">Disabled unchecked</span>
        </div>

        <div class="flex items-center gap-2">
          <ToggleSwitch :model-value="true" disabled />
          <span class="text-surface-300">Disabled checked</span>
        </div>

        <div class="flex items-center gap-2">
          <ToggleSwitch invalid />
          <span class="text-surface-300">Invalid state</span>
        </div>
      </div>
    </Variant>
  </Story>
</template>
