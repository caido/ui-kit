<script setup lang="ts">
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";

const severities = [
  undefined,
  "secondary",
  "success",
  "info",
  "warn",
  "help",
  "danger",
];
const sizes = ["small", undefined, "large"];
</script>

<template>
  <Story title="ButtonGroup">
    <Variant title="Severities">
      <div class="flex flex-col gap-4">
        <div v-for="severity in severities" :key="severity">
          <ButtonGroup>
            <Button label="Left" :severity="severity" />
            <Button label="Middle" :severity="severity" />
            <Button label="Right" :severity="severity" />
          </ButtonGroup>
        </div>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="flex flex-col gap-4">
        <div v-for="size in sizes" :key="size">
          <ButtonGroup>
            <Button label="Left" :size="size" />
            <Button label="Middle" :size="size" />
            <Button label="Right" :size="size" />
          </ButtonGroup>
        </div>
      </div>
    </Variant>

    <Variant title="With Icons">
      <ButtonGroup>
        <Button icon="fas fa-chart-line" />
        <Button icon="fas fa-bookmark" />
        <Button icon="fas fa-search" />
      </ButtonGroup>
    </Variant>
  </Story>
</template>
