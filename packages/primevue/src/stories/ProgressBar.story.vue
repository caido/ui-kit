<script setup lang="ts">
import ProgressBar from "primevue/progressbar";

const modes = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
];
</script>

<template>
  <Story title="ProgressBar">
    <Variant title="States">
      <div class="flex flex-col gap-4 w-[400px]">
        <div v-for="mode in modes" :key="mode.value">
          <ProgressBar :value="mode.value" />
        </div>
      </div>
    </Variant>

    <Variant title="Indeterminate">
      <div class="flex flex-col gap-4 w-[400px]">
        <ProgressBar mode="indeterminate" />
      </div>
    </Variant>

    <Variant title="Custom Label">
      <div class="flex flex-col gap-4 w-[400px]">
        <ProgressBar :value="40"> Loading files... (40%) </ProgressBar>
      </div>
    </Variant>
  </Story>
</template>
