<script setup lang="ts">
import BlockUI from "primevue/blockui";
import Button from "primevue/button";
import { ref } from "vue";

const blocked = ref(false);

const toggle = () => {
  blocked.value = !blocked.value;
};
</script>

<template>
  <Story title="BlockUI">
    <Variant title="Default">
      <div class="flex flex-col gap-4">
        <div>
          <Button :label="blocked ? 'Unblock' : 'Block'" @click="toggle" />
        </div>

        <BlockUI :blocked="blocked">
          <div class="w-full surface-card p-4 border-round shadow-2">
            <p class="mt-0 mb-4 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <Button label="Button" />
          </div>
        </BlockUI>
      </div>
    </Variant>

    <Variant title="Full Screen">
      <Button :label="blocked ? 'Unblock' : 'Block'" @click="toggle" />
      <BlockUI :blocked="blocked" full-screen>
        <p class="mt-0 mb-4 text-lg text-gray-300">Full screen is blocked</p>
      </BlockUI>
    </Variant>
  </Story>
</template>
