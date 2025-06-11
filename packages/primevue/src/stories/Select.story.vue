<script setup lang="ts">
import Select from "primevue/select";
import { ref } from "vue";

const selectedOption = ref();

const options = [
  { label: "Australia", value: "AU" },
  { label: "Brazil", value: "BR" },
  { label: "China", value: "CN" },
  { label: "Denmark", value: "DK" },
  { label: "Egypt", value: "EG" },
  { label: "France", value: "FR" },
];

const groupedOptions = [
  {
    label: "Europe",
    items: [
      { label: "France", value: "FR" },
      { label: "Denmark", value: "DK" },
    ],
  },
  {
    label: "Asia",
    items: [
      { label: "China", value: "CN" },
      { label: "Japan", value: "JP" },
    ],
  },
];
</script>

<template>
  <Story title="Select">
    <Variant title="States">
      <div class="flex flex-col gap-4 w-[240px]">
        <Select
          v-model="selectedOption"
          placeholder="Default"
          :options="options"
          option-label="label"
          option-value="value"
        />

        <Select
          v-model="selectedOption"
          placeholder="Disabled"
          :options="options"
          option-label="label"
          option-value="value"
          disabled
        />

        <Select
          v-model="selectedOption"
          placeholder="Invalid"
          :options="options"
          option-label="label"
          option-value="value"
          invalid
        />

        <Select
          v-model="selectedOption"
          placeholder="Loading"
          :options="options"
          option-label="label"
          option-value="value"
          loading
        />

        <Select
          v-model="selectedOption"
          placeholder="With Clear"
          :options="options"
          option-label="label"
          option-value="value"
          show-clear
        />
      </div>
    </Variant>

    <Variant title="Groups">
      <div class="flex flex-col gap-4 w-[240px]">
        <Select
          placeholder="Select a Country"
          :options="groupedOptions"
          option-label="label"
          option-value="value"
          option-group-label="label"
          option-group-children="items"
        />
      </div>
    </Variant>

    <Variant title="Filter">
      <div class="flex flex-col gap-4 w-[240px]">
        <Select
          placeholder="Filter Enabled"
          :options="options"
          option-label="label"
          option-value="value"
          filter
        />
      </div>
    </Variant>
  </Story>
</template>
