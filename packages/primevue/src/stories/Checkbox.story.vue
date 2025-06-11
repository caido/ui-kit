<script setup lang="ts">
import Checkbox from "primevue/checkbox";
import { ref } from "vue";

const checked = ref(false);
const cities = ref([]);

const cityOptions = [
  { name: "New York", code: "NY" },
  { name: "London", code: "LDN" },
  { name: "Paris", code: "PRS" },
  { name: "Tokyo", code: "TK" },
];
</script>

<template>
  <Story title="Checkbox">
    <Variant title="Basic">
      <div class="flex flex-col gap-4">
        <div class="flex items-center">
          <Checkbox v-model="checked" :binary="true" />
          <label class="ml-2 text-gray-300">{{
            checked ? "Checked" : "Unchecked"
          }}</label>
        </div>
      </div>
    </Variant>

    <Variant title="Multiple">
      <div class="flex flex-col gap-3">
        <div
          v-for="city of cityOptions"
          :key="city.code"
          class="flex items-center"
        >
          <Checkbox v-model="cities" :value="city" :name="city.code" />
          <label class="ml-2 text-gray-300">{{ city.name }}</label>
        </div>
        <div class="text-gray-300">Selected Cities: {{ cities }}</div>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div class="flex flex-col gap-3">
        <div class="flex items-center">
          <Checkbox :model-value="true" disabled />
          <label class="ml-2 text-gray-300">Checked Disabled</label>
        </div>
        <div class="flex items-center">
          <Checkbox :model-value="false" disabled />
          <label class="ml-2 text-gray-300">Unchecked Disabled</label>
        </div>
      </div>
    </Variant>

    <Variant title="Invalid">
      <div class="flex items-center">
        <Checkbox v-model="checked" :binary="true" invalid />
        <label class="ml-2 text-gray-300">Invalid State</label>
      </div>
    </Variant>
  </Story>
</template>
