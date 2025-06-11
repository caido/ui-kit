<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { ref } from "vue";

const visible = ref(false);
const fullscreenVisible = ref(false);
</script>

<template>
  <Story title="Dialog">
    <Variant title="Basic">
      <div class="flex flex-col gap-2">
        <Button label="Show" @click="visible = true" />

        <Dialog v-model:visible="visible" header="Header">
          <p class="m-0 text-surface-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <template #footer>
            <Button label="Close" text @click="visible = false" />
            <Button label="Save" @click="visible = false" />
          </template>
        </Dialog>
      </div>
    </Variant>

    <Variant title="Fullscreen">
      <div class="flex flex-col gap-2">
        <Button label="Show" @click="fullscreenVisible = true" />

        <Dialog
          v-model:visible="fullscreenVisible"
          header="Header"
          :modal="true"
          :full-screen="true"
        >
          <p class="m-0 text-surface-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <template #footer>
            <Button label="Close" text @click="fullscreenVisible = false" />
            <Button label="Save" @click="fullscreenVisible = false" />
          </template>
        </Dialog>
      </div>
    </Variant>
  </Story>
</template>
