<script setup lang="ts">
import Image from "primevue/image";
</script>

<template>
  <Story title="Image">
    <Variant title="Basic">
      <Image
        src="https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg"
        alt="Image"
        width="250"
      />
    </Variant>

    <Variant title="Preview">
      <Image
        src="https://primefaces.org/cdn/primevue/images/galleria/galleria2.jpg"
        alt="Image"
        width="250"
        preview
      />
    </Variant>
  </Story>
</template>
