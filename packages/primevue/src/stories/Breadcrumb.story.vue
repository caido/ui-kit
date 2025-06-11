<script setup lang="ts">
import Breadcrumb from "primevue/breadcrumb";

const items = [
  { label: "Computer", to: "/" },
  { label: "Notebook", to: "/" },
  { label: "Gaming", to: "/" },
  { label: "ROG", to: "/" },
];

const home = { icon: "fas fa-home", to: "/" };
</script>

<template>
  <Story title="Breadcrumb">
    <Variant title="Default">
      <Breadcrumb :model="items" :home="home" />
    </Variant>
  </Story>
</template>
