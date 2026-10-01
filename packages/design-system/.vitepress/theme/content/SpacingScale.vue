<script setup lang="ts">
type Rung = {
  rung: number;
  use: string;
};

const rungs: Rung[] = [
  { rung: 0, use: "Removing space" },
  { rung: 1, use: "An icon against its label, a badge against its text" },
  { rung: 2, use: "Items in a row, the inner padding of a control" },
  { rung: 3, use: "Menu rows, list rows, toolbars" },
  { rung: 4, use: "Groups inside a panel, the padding of a card or dialog" },
  { rung: 6, use: "Separate sections" },
  { rung: 8, use: "Sections within a page" },
  { rung: 12, use: "Page level, empty states, around an illustration" },
];
</script>

<template>
  <table data-ds class="w-full">
    <thead>
      <tr>
        <th>Rung</th>
        <th>Class</th>
        <th>Pixels</th>
        <th>Size</th>
        <th>Used for</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in rungs" :key="item.rung">
        <td class="font-mono text-caption text-fg-muted">
          {{ item.rung }}
        </td>
        <td>
          <code>gap-{{ item.rung }}</code>
        </td>
        <td class="font-mono text-caption text-fg-muted">
          {{ item.rung * 4 }}px
        </td>
        <td>
          <span
            class="block h-4 bg-fill-secondary"
            :style="{ width: `${item.rung * 4}px` }"
            aria-hidden="true"
          />
        </td>
        <td class="text-caption text-fg-subtle">{{ item.use }}</td>
      </tr>
    </tbody>
  </table>
</template>
