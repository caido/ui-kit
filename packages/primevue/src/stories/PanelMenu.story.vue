<script setup lang="ts">
import PanelMenu from "primevue/panelmenu";
import { ref } from "vue";

const items = ref([
  {
    label: "File",
    icon: "fa-solid fa-file",
    items: [
      {
        label: "New",
        icon: "fa-solid fa-plus",
        command: () => {
          console.log("New file");
        },
      },
      {
        label: "Open",
        icon: "fa-solid fa-folder-open",
        command: () => {
          console.log("Open file");
        },
      },
      {
        label: "Save",
        icon: "fa-solid fa-save",
        command: () => {
          console.log("Save file");
        },
      },
      {
        separator: true,
      },
      {
        label: "Exit",
        icon: "fa-solid fa-sign-out-alt",
        command: () => {
          console.log("Exit application");
        },
      },
    ],
  },
  {
    label: "Edit",
    icon: "fa-solid fa-edit",
    items: [
      {
        label: "Undo",
        icon: "fa-solid fa-undo",
        command: () => {
          console.log("Undo action");
        },
      },
      {
        label: "Redo",
        icon: "fa-solid fa-redo",
        command: () => {
          console.log("Redo action");
        },
      },
      {
        separator: true,
      },
      {
        label: "Cut",
        icon: "fa-solid fa-cut",
        command: () => {
          console.log("Cut selection");
        },
      },
      {
        label: "Copy",
        icon: "fa-solid fa-copy",
        command: () => {
          console.log("Copy selection");
        },
      },
      {
        label: "Paste",
        icon: "fa-solid fa-paste",
        command: () => {
          console.log("Paste content");
        },
      },
    ],
  },
  {
    label: "View",
    icon: "fa-solid fa-eye",
    items: [
      {
        label: "Zoom In",
        icon: "fa-solid fa-search-plus",
        command: () => {
          console.log("Zoom in");
        },
      },
      {
        label: "Zoom Out",
        icon: "fa-solid fa-search-minus",
        command: () => {
          console.log("Zoom out");
        },
      },
      {
        label: "Reset Zoom",
        icon: "fa-solid fa-compress",
        command: () => {
          console.log("Reset zoom");
        },
      },
    ],
  },
  {
    label: "Help",
    icon: "fa-solid fa-question-circle",
    items: [
      {
        label: "Documentation",
        icon: "fa-solid fa-book",
        command: () => {
          console.log("Open documentation");
        },
      },
      {
        label: "About",
        icon: "fa-solid fa-info-circle",
        command: () => {
          console.log("Show about dialog");
        },
      },
    ],
  },
]);

const nestedItems = ref([
  {
    label: "Projects",
    icon: "fa-solid fa-project-diagram",
    items: [
      {
        label: "Frontend",
        icon: "fa-solid fa-code",
        items: [
          {
            label: "Vue.js",
            icon: "fa-solid fa-vuejs",
            command: () => {
              console.log("Vue.js project");
            },
          },
          {
            label: "React",
            icon: "fa-brands fa-react",
            command: () => {
              console.log("React project");
            },
          },
        ],
      },
      {
        label: "Backend",
        icon: "fa-solid fa-server",
        items: [
          {
            label: "Node.js",
            icon: "fa-brands fa-node-js",
            command: () => {
              console.log("Node.js project");
            },
          },
          {
            label: "Python",
            icon: "fa-brands fa-python",
            command: () => {
              console.log("Python project");
            },
          },
        ],
      },
    ],
  },
  {
    label: "Settings",
    icon: "fa-solid fa-cog",
    items: [
      {
        label: "General",
        icon: "fa-solid fa-sliders-h",
        command: () => {
          console.log("General settings");
        },
      },
      {
        label: "Security",
        icon: "fa-solid fa-shield-alt",
        command: () => {
          console.log("Security settings");
        },
      },
    ],
  },
]);

const simpleItems = ref([
  {
    label: "Dashboard",
    icon: "fa-solid fa-tachometer-alt",
    command: () => {
      console.log("Navigate to dashboard");
    },
  },
  {
    label: "Users",
    icon: "fa-solid fa-users",
    command: () => {
      console.log("Navigate to users");
    },
  },
  {
    label: "Reports",
    icon: "fa-solid fa-chart-bar",
    command: () => {
      console.log("Navigate to reports");
    },
  },
  {
    label: "Settings",
    icon: "fa-solid fa-cog",
    command: () => {
      console.log("Navigate to settings");
    },
  },
]);
</script>

<template>
  <Story title="PanelMenu">
    <Variant title="Default">
      <div class="card">
        <PanelMenu :model="items" />
      </div>
    </Variant>

    <Variant title="Simple Navigation">
      <div class="card">
        <PanelMenu :model="simpleItems" />
      </div>
    </Variant>

    <Variant title="Deep Nesting">
      <div class="card">
        <PanelMenu :model="nestedItems" />
      </div>
    </Variant>

    <Variant title="With Custom Styling">
      <div class="card">
        <PanelMenu
          :model="items"
          class="max-w-[300px] border-2 border-surface-200 rounded-lg shadow-lg"
        />
      </div>
    </Variant>

    <Variant title="Compact Layout">
      <div class="card">
        <PanelMenu
          :model="simpleItems"
          class="max-w-[250px] [&_.p-panelmenu-header-link]:py-2 [&_.p-panelmenu-header-link]:px-3 [&_.p-menuitem-link]:py-2 [&_.p-menuitem-link]:px-3"
        />
      </div>
    </Variant>
  </Story>
</template>
