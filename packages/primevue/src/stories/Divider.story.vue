<script setup lang="ts">
import Divider from "primevue/divider";
</script>

<template>
  <Story title="Divider">
    <Variant title="Horizontal">
      <div class="flex flex-col gap-4">
        <p class="text-surface-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <Divider />

        <p class="text-surface-300">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div class="flex align-center">
        <p class="text-surface-300">Lorem ipsum dolor sit amet</p>

        <Divider layout="vertical" />

        <p class="text-surface-300">Ut enim ad minim veniam</p>

        <Divider layout="vertical" />

        <p class="text-surface-300">Quis nostrud exercitation</p>
      </div>
    </Variant>

    <Variant title="With Content">
      <div class="flex flex-col gap-4">
        <p class="text-surface-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <Divider align="center">
          <span class="px-3 text-surface-300">OR</span>
        </Divider>

        <p class="text-surface-300">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </Variant>
  </Story>
</template>
