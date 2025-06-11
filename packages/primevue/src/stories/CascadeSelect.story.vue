<script setup lang="ts">
import CascadeSelect from "primevue/cascadeselect";
import { ref } from "vue";

const selectedCity = ref();
const countries = ref([
  {
    name: "Australia",
    code: "AU",
    states: [
      {
        name: "New South Wales",
        cities: [
          { cname: "Sydney", code: "A-SY" },
          { cname: "Newcastle", code: "A-NE" },
        ],
      },
      {
        name: "Queensland",
        cities: [
          { cname: "Brisbane", code: "A-BR" },
          { cname: "Townsville", code: "A-TO" },
        ],
      },
    ],
  },
  {
    name: "United States",
    code: "US",
    states: [
      {
        name: "California",
        cities: [
          { cname: "Los Angeles", code: "US-LA" },
          { cname: "San Diego", code: "US-SD" },
        ],
      },
      {
        name: "Florida",
        cities: [
          { cname: "Miami", code: "US-MI" },
          { cname: "Orlando", code: "US-OR" },
        ],
      },
    ],
  },
]);
</script>

<template>
  <Story title="CascadeSelect">
    <Variant title="Basic">
      <CascadeSelect
        v-model="selectedCity"
        :options="countries"
        option-label="cname"
        option-group-label="name"
        :option-group-children="['states', 'cities']"
        placeholder="Select a City"
      />
    </Variant>

    <Variant title="Invalid">
      <CascadeSelect
        v-model="selectedCity"
        :options="countries"
        option-label="cname"
        option-group-label="name"
        :option-group-children="['states', 'cities']"
        placeholder="Select a City"
        invalid
      />
    </Variant>

    <Variant title="Disabled">
      <CascadeSelect
        v-model="selectedCity"
        :options="countries"
        option-label="cname"
        option-group-label="name"
        :option-group-children="['states', 'cities']"
        placeholder="Select a City"
        disabled
      />
    </Variant>
  </Story>
</template>
