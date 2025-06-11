<script setup lang="ts">
import InputText from "primevue/inputtext";

const sizes = ["small", undefined, "large"];
</script>

<template>
  <Story title="InputText">
    <Variant title="States">
      <div class="flex flex-col gap-4 w-[240px]">
        <InputText placeholder="Default" />
        <InputText placeholder="Disabled" disabled />
        <InputText placeholder="Invalid" invalid />
        <InputText placeholder="With value" value="Input value" />
        <InputText placeholder="Read only" readonly />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="flex flex-col gap-4 w-[240px]">
        <div v-for="size in sizes" :key="size">
          <InputText :size="size" :placeholder="size ?? 'default'" />
        </div>
      </div>
    </Variant>

    <Variant title="Fluid">
      <div class="flex flex-col gap-4">
        <div>
          <InputText placeholder="Normal width" />
        </div>
        <InputText placeholder="Full width" class="w-full" />
      </div>
    </Variant>
  </Story>
</template>
