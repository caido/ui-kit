<script setup lang="ts">
import Badge from "primevue/badge";
import Button from "primevue/button";
</script>

<template>
  <Story title="Badge">
    <Variant title="Numbers">
      <div class="flex gap-4">
        <Badge value="2" />
        <Badge value="8" severity="success" />
        <Badge value="4" severity="info" />
        <Badge value="12" severity="warn" />
        <Badge value="3" severity="danger" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="flex gap-4">
        <Badge value="2" size="small" />
        <Badge value="4" />
        <Badge value="6" size="large" />
        <Badge value="8" size="xlarge" />
      </div>
    </Variant>

    <Variant title="Button Badges">
      <div class="flex gap-4">
        <Button label="Emails" badge="8" />
        <Button label="Messages" badge="12" severity="danger" />
        <Button label="Notifications" badge="4" severity="info" />
      </div>
    </Variant>
  </Story>
</template>
