<script setup lang="ts">
import InputMask from "primevue/inputmask";
import { ref } from "vue";

const value = ref("");
const phoneValue = ref("");
const dateValue = ref("");
</script>

<template>
  <Story title="InputMask">
    <Variant title="States">
      <div class="flex flex-col gap-4 w-[240px]">
        <InputMask v-model="value" mask="99-999999" placeholder="Basic" />

        <InputMask
          v-model="phoneValue"
          mask="(999) 999-9999"
          placeholder="Phone Number"
        />

        <InputMask v-model="dateValue" mask="99/99/9999" placeholder="Date" />

        <InputMask mask="99-999999" placeholder="Disabled" disabled />

        <InputMask mask="99-999999" placeholder="Invalid" invalid />
      </div>
    </Variant>
  </Story>
</template>
