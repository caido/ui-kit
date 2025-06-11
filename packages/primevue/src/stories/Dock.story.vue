<script setup lang="ts">
import Dock from "primevue/dock";

const items = [
  {
    label: "Finder",
    icon: "fa-solid fa-folder",
    class: "text-surface-300",
  },
  {
    label: "App Store",
    icon: "fa-brands fa-app-store",
    class: "text-surface-300",
  },
  {
    label: "Photos",
    icon: "fa-solid fa-image",
    class: "text-surface-300",
  },
  {
    label: "Trash",
    icon: "fa-solid fa-trash",
    class: "text-surface-300",
  },
];
</script>

<template>
  <Story title="Dock">
    <Variant title="Basic">
      <div class="h-[300px] relative">
        <Dock :model="items" position="bottom" />
      </div>
    </Variant>

    <Variant title="Position Top">
      <div class="h-[300px] relative">
        <Dock :model="items" position="top" />
      </div>
    </Variant>

    <Variant title="Position Left">
      <div class="h-[300px] relative">
        <Dock :model="items" position="left" />
      </div>
    </Variant>

    <Variant title="Position Right">
      <div class="h-[300px] relative">
        <Dock :model="items" position="right" />
      </div>
    </Variant>
  </Story>
</template>
