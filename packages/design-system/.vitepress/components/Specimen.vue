<script setup lang="ts">
defineProps<{ title?: string; note?: string }>();
</script>

<template>
  <div class="ds-specimen">
    <div v-if="title || note" class="ds-specimen-head">
      <span>{{ title }}</span>
      <span v-if="note" class="ds-ratio">{{ note }}</span>
    </div>
    <div class="ds-specimen-split">
      <div class="ds-scope" data-mode="dark"><slot /></div>
      <div class="ds-scope" data-mode="light"><slot /></div>
    </div>
  </div>
</template>
