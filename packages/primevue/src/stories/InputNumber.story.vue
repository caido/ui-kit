<script setup lang="ts">
import InputNumber from "primevue/inputnumber";
import { ref } from "vue";

const value = ref(42);
const percentValue = ref(50);
const currencyValue = ref(100);
</script>

<template>
  <Story title="InputNumber">
    <Variant title="States">
      <div class="flex flex-col gap-4 w-[240px]">
        <InputNumber v-model="value" placeholder="Basic" />

        <InputNumber
          v-model="percentValue"
          placeholder="Percentage"
          suffix="%"
        />

        <InputNumber
          v-model="currencyValue"
          placeholder="Currency"
          mode="currency"
          currency="USD"
        />

        <InputNumber placeholder="Disabled" disabled />

        <InputNumber placeholder="Invalid" invalid />

        <InputNumber placeholder="Min/Max" :min="0" :max="100" />

        <InputNumber placeholder="Step" show-buttons button-layout="horizontal">
          <template #incrementbuttonicon>
            <i class="fa-solid fa-plus"></i>
          </template>
          <template #decrementbuttonicon>
            <i class="fa-solid fa-minus"></i>
          </template>
        </InputNumber>
      </div>
    </Variant>
  </Story>
</template>
