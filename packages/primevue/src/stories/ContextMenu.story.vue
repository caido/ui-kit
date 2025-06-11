<script setup lang="ts">
import ContextMenu from "primevue/contextmenu";
import { ref } from "vue";

const items = [
  {
    label: "File",
    icon: "fa-regular fa-file",
    items: [
      {
        label: "New",
        icon: "fa-solid fa-plus",
        items: [
          {
            label: "Document",
            icon: "fa-regular fa-file",
          },
          {
            label: "Image",
            icon: "fa-regular fa-image",
          },
        ],
      },
      {
        label: "Open",
        icon: "fa-regular fa-folder-open",
      },
      {
        separator: true,
      },
      {
        label: "Exit",
        icon: "fa-solid fa-power-off",
      },
    ],
  },
  {
    label: "Edit",
    icon: "fa-solid fa-pencil",
    items: [
      {
        label: "Copy",
        icon: "fa-regular fa-copy",
      },
      {
        label: "Delete",
        icon: "fa-solid fa-trash",
      },
    ],
  },
];

const refMenu = ref();
</script>

<template>
  <Story title="ContextMenu">
    <Variant title="Basic">
      <div class="card flex justify-center">
        <ContextMenu ref="refMenu" :model="items" />
        <div
          class="w-full h-40 border border-surface-200 rounded-md flex items-center justify-center"
          @contextmenu.stop.prevent="refMenu.show($event)"
        >
          Right click to show context menu
        </div>
      </div>
    </Variant>
  </Story>
</template>
