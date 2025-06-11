<script setup lang="ts">
import Message from "primevue/message";
</script>

<template>
  <Story title="Message">
    <Variant title="States">
      <div class="flex flex-col gap-4">
        <Message severity="info">
          <span class="text-surface-300">Info message content</span>
        </Message>

        <Message severity="success">
          <span class="text-surface-300">Success message content</span>
        </Message>

        <Message severity="warn">
          <span class="text-surface-300">Warning message content</span>
        </Message>

        <Message severity="error">
          <span class="text-surface-300">Error message content</span>
        </Message>

        <Message severity="info" :closable="true">
          <span class="text-surface-300">Closable message content</span>
        </Message>

        <Message>
          <template #icon>
            <i class="fa-solid fa-bell"></i>
          </template>
          <span class="text-surface-300">Custom icon message</span>
        </Message>
      </div>
    </Variant>
  </Story>
</template>
