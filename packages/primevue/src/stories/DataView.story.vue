<script setup lang="ts">
import DataView from "primevue/dataview";
import { ref } from "vue";

const products = ref([
  {
    id: 1,
    name: "Product 1",
    price: 99.99,
    image: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 149.99,
    image: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    name: "Product 3",
    price: 79.99,
    image: "https://picsum.photos/300/200?random=3",
  },
  {
    id: 4,
    name: "Product 4",
    price: 199.99,
    image: "https://picsum.photos/300/200?random=4",
  },
]);
</script>

<template>
  <Story title="DataView">
    <Variant title="Grid">
      <DataView :value="products" layout="grid">
        <template #grid="slotProps">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="col-span-1 p-4 border border-surface-700 rounded-md"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full mb-3 rounded-md"
              />
              <div class="text-xl font-bold mb-2">{{ item.name }}</div>
              <div class="text-2xl text-primary">${{ item.price }}</div>
            </div>
          </div>
        </template>
      </DataView>
      <div class="text-gray-300 mt-2">Grid layout for product display</div>
    </Variant>

    <Variant title="List">
      <DataView :value="products" layout="list">
        <template #list="slotProps">
          <div class="flex flex-col gap-4 p-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="flex gap-4 p-4 border border-surface-700 rounded-md"
            >
              <img :src="item.image" :alt="item.name" class="w-48 rounded-md" />
              <div>
                <div class="text-xl font-bold mb-2">{{ item.name }}</div>
                <div class="text-2xl text-primary">${{ item.price }}</div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
      <div class="text-gray-300 mt-2">
        List layout for detailed product view
      </div>
    </Variant>
  </Story>
</template>
