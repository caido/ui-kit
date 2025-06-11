<script setup lang="ts">
import Carousel from "primevue/carousel";
import { ref } from "vue";

const products = ref([
  { name: "Product 1", image: "https://picsum.photos/300/200?random=1" },
  { name: "Product 2", image: "https://picsum.photos/300/200?random=2" },
  { name: "Product 3", image: "https://picsum.photos/300/200?random=3" },
  { name: "Product 4", image: "https://picsum.photos/300/200?random=4" },
  { name: "Product 5", image: "https://picsum.photos/300/200?random=5" },
  { name: "Product 6", image: "https://picsum.photos/300/200?random=6" },
]);
</script>

<template>
  <Story title="Carousel">
    <Variant title="Basic">
      <div class="w-full">
        <Carousel :value="products" :num-visible="3" :num-scroll="1">
          <template #item="slotProps">
            <div class="p-4">
              <div class="mb-3">
                <img
                  :src="slotProps.data.image"
                  :alt="slotProps.data.name"
                  class="w-full shadow-md"
                />
              </div>
              <div class="text-center">
                <h4 class="mb-1">{{ slotProps.data.name }}</h4>
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div class="w-full">
        <Carousel
          :value="products"
          :num-visible="3"
          :num-scroll="1"
          orientation="vertical"
          class="h-[500px]"
        >
          <template #item="slotProps">
            <div class="p-4">
              <div class="mb-3">
                <img
                  :src="slotProps.data.image"
                  :alt="slotProps.data.name"
                  class="w-full shadow-md"
                />
              </div>
              <div class="text-center">
                <h4 class="mb-1">{{ slotProps.data.name }}</h4>
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </Variant>
  </Story>
</template>
