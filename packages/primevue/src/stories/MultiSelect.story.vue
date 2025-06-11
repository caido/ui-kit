<script setup lang="ts">
import MultiSelect from "primevue/multiselect";
import { ref } from "vue";

const selectedCities = ref();
const selectedGroupedCities = ref();

const cities = [
  { name: "New York", code: "NY" },
  { name: "London", code: "LDN" },
  { name: "Paris", code: "PRS" },
  { name: "Tokyo", code: "TK" },
];

const groupedCities = [
  {
    label: "North America",
    items: [
      { name: "New York", code: "NY" },
      { name: "Chicago", code: "CHI" },
    ],
  },
  {
    label: "Europe",
    items: [
      { name: "London", code: "LDN" },
      { name: "Paris", code: "PRS" },
    ],
  },
];
</script>

<template>
  <Story title="MultiSelect">
    <Variant title="States">
      <div class="flex flex-col gap-4 w-[240px]">
        <MultiSelect
          v-model="selectedCities"
          :options="cities"
          option-label="name"
          placeholder="Select Cities"
        />

        <MultiSelect
          v-model="selectedGroupedCities"
          :options="groupedCities"
          option-label="name"
          option-group-label="label"
          option-group-children="items"
          placeholder="Grouped Cities"
        />

        <MultiSelect
          :options="cities"
          option-label="name"
          placeholder="Disabled"
          disabled
        />

        <MultiSelect
          :options="cities"
          option-label="name"
          placeholder="Invalid"
          invalid
        />

        <MultiSelect
          v-model="selectedCities"
          :options="cities"
          option-label="name"
          placeholder="With Filter"
          filter
        />
      </div>
    </Variant>
  </Story>
</template>
