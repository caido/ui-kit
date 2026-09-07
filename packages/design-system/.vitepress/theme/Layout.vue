<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

import TabOutline from "../components/TabOutline.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      <TabOutline />
    </template>
  </Layout>
</template>
