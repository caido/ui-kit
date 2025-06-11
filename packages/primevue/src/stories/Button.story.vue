<script setup lang="ts">
import Button from "primevue/button";

const severities = [
  undefined,
  "secondary",
  "success",
  "info",
  "warn",
  "danger",
  "contrast",
];
const sizes = ["small", undefined, "large"];
const iconPositions = ["left", "right", "top", "bottom"];
</script>

<template>
  <Story title="Button">
    <Variant title="States">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="severity in severities"
          :key="severity"
          class="flex flex-col gap-2"
        >
          <Button :severity="severity" label="Default" />
          <Button :severity="severity" label="Text" text />
          <Button :severity="severity" label="Outlined" outlined />
          <Button :severity="severity" label="Disabled" disabled />
          <Button :severity="severity" label="Loading" loading />
          <Button :severity="severity" label="Link" link />
          <Button :severity="severity" label="Raised" raised />
          <Button :severity="severity" label="Rounded" rounded />
        </div>
      </div>
    </Variant>

    <Variant title="Icons">
      <div class="flex flex-wrap gap-2">
        <div v-for="severity in severities" :key="severity">
          <div class="flex flex-col gap-2 items-center">
            <Button
              v-for="position in iconPositions"
              :key="position"
              :severity="severity"
              icon="fas fa-magnifying-glass"
              :icon-pos="position"
              :label="position"
            />
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="flex flex-wrap gap-2">
        <div v-for="severity in severities" :key="severity">
          <div class="flex flex-col gap-2 items-center">
            <div v-for="size in sizes" :key="size">
              <Button
                icon="fas fa-magnifying-glass"
                :severity="severity"
                :size="size"
              />
            </div>
            <div v-for="size in sizes" :key="size">
              <Button
                icon="fas fa-magnifying-glass"
                :severity="severity"
                :size="size"
                :label="size ?? 'default'"
              />
            </div>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Fluid">
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-2 items-center">
          <Button label="Normal width" />
          <Button label="Full width" fluid />
        </div>
      </div>
    </Variant>
  </Story>
</template>
