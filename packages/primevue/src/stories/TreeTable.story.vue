<script setup lang="ts">
import Column from "primevue/column";
import type { TreeNode } from "primevue/treenode";
import TreeTable from "primevue/treetable";
import { ref } from "vue";

const size = ref<"large" | "normal" | "small">("normal");

const nodes = ref<TreeNode[]>([
  {
    key: "Electronics",
    data: { code: "E", name: "Electronics" },
    selectable: false,
    leaf: false,
    children: [
      {
        key: "E1",
        data: { code: "E1", name: "Laptop", price: 999.99, quantity: 50 },
        selectable: true,
        leaf: true,
      },
      {
        key: "E2",
        data: { code: "E2", name: "Smartphone", price: 699.99, quantity: 100 },
        selectable: true,
        leaf: true,
      },
      {
        key: "E3",
        data: { code: "E3", name: "Headphones", price: 199.99, quantity: 75 },
        selectable: true,
        leaf: true,
      },
      {
        key: "E4",
        data: { code: "E4", name: "Monitor", price: 299.99, quantity: 30 },
        selectable: true,
        leaf: true,
      },
      {
        key: "E5",
        data: { code: "E5", name: "Keyboard", price: 89.99, quantity: 120 },
        selectable: true,
        leaf: true,
      },
    ],
  },
]);

const selectedNodes = ref();
</script>

<template>
  <Story title="TreeTable">
    <Variant title="Basic">
      <TreeTable :value="nodes" table-style="min-width: 50rem" :size="size">
        <Column field="code" header="Code" expander></Column>
        <Column field="name" header="Name"></Column>
        <Column field="price" header="Price"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </TreeTable>
      <div class="text-gray-300 mt-2">Basic table with fixed columns</div>
    </Variant>

    <Variant title="Selection">
      <TreeTable
        v-model:selection-keys="selectedNodes"
        :value="nodes"
        meta-key-selection
        selection-mode="multiple"
        table-style="min-width: 50rem"
        :size="size"
      >
        <Column field="code" header="Code" expander></Column>
        <Column field="name" header="Name"></Column>
        <Column field="price" header="Price"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </TreeTable>
      <div class="text-gray-300 mt-2">
        Selected:
        {{ selectedNodes ? Object.keys(selectedNodes).join(", ") : "None" }}
      </div>
    </Variant>

    <template #controls>
      <HstSelect
        v-model="size"
        title="Size"
        :options="{
          small: 'Small',
          normal: 'Normal',
          large: 'Large',
        }"
      />
    </template>
  </Story>
</template>
