<script setup lang="ts">
import Chip from "primevue/chip";
</script>

<template>
  <Story title="Chip">
    <Variant title="Basic">
      <div class="flex gap-2">
        <Chip label="Basic" />
        <Chip label="Text Only" />
        <Chip label="Custom Style" class="bg-primary text-white" />
      </div>
    </Variant>

    <Variant title="Icons">
      <div class="flex gap-2">
        <Chip label="Apple" icon="fa-brands fa-apple" />
        <Chip label="Facebook" icon="fa-brands fa-facebook" />
        <Chip label="Google" icon="fa-brands fa-google" />
      </div>
    </Variant>

    <Variant title="Image">
      <div class="flex gap-2">
        <Chip
          label="Amy Elsner"
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        />
        <Chip
          label="Asiya Javayant"
          image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
        />
        <Chip
          label="Onyama Limba"
          image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
        />
      </div>
    </Variant>

    <Variant title="Removable">
      <div class="flex gap-2">
        <Chip label="Removable Chip" removable />
        <Chip
          label="Removable Chip with Icon"
          icon="fa-solid fa-user"
          removable
        />
      </div>
    </Variant>
  </Story>
</template>
