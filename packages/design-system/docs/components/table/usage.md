# Using table

How to build a grid, define its columns, bind a selection and drive it from script. For what the component decides, see [Overview](/components/table.md). For the props, the events and the DOM, see [Reference](/components/table/reference.md).

## Rendering a table

Three props are required: `label`, `items` and `itemHeight`. `label` becomes the accessible name on the grid and is never drawn, so write the same string a person would use for the region out loud.

```vue
<template>
  <div class="size-full">
    <CTable
      :label="$t('about.attributions.tableAriaLabel')"
      :items="libraries"
      :item-height="30"
    >
      <template #header-row>
        <CHeaderCell column-id="name" default-width="15rem">
          {{ $t("about.attributions.columns.library") }}
        </CHeaderCell>
        <CHeaderCell column-id="version" default-width="8rem">
          {{ $t("about.attributions.columns.version") }}
        </CHeaderCell>
      </template>
      <template #item-row="{ item }">
        <CItemCell column-id="name">{{ item.name }}</CItemCell>
        <CItemCell column-id="version">{{ item.version }}</CItemCell>
      </template>
    </CTable>
  </div>
</template>
```

Put the cells straight into the `item-row` slot. A wrapping container sits between `role="row"` and `role="gridcell"` and breaks the ownership the roles describe, which is the gap [Accessibility](/foundations/accessibility.md#a-table-is-a-grid) records.

## Matching a header cell to its cells

<Preview
  light="/examples/component-table-headercell-light.svg"
  dark="/examples/component-table-headercell-dark.svg"
  alt="A header cell with its padding bands, its sort caret box, the divider on its right edge and the grab strip of the resizer marked out, above a second cell aligned to the end with the caret on the left"
  caption="8px and 16px of padding, a 14px caret box, a 7px resizer with a 31px grab strip."
/>

`columnId` joins a header cell to its item cells. **A mismatched key renders a 50px column and reports nothing**, so take the key from a shared constant where one exists. The finding table passes `:column-id="FindingOrderBy.Title"`, which makes the column identifier and the sort field the same value.

`defaultWidth` is a starting width, never smaller than `minWidth`, and a drag on the resizer replaces it.

## Sizing the rows

`itemHeight` is a number of pixels. Read it from the tokens package rather than typing a row height.

```vue
<script setup lang="ts">
import { rowHeight } from "@caido/tokens";

const { fontSize } = useFont();
const itemHeight = computed(() => rowHeight(fontSize.value));
</script>

<template>
  <CTable
    [[:key]]="itemHeight"
    :label="$t('httpHistory.requestTable.tableAriaLabel')"
    :items="items"
    :item-height="itemHeight"
  />
</template>
```

The `:key` is the part that is easy to leave out. The virtual list reads `itemHeight` once, so without the key a table looks correct until somebody changes the interface text size.

## Sizing the table from its parent

The root fills its box and refuses layout attributes, so the wrapper is the one place a size takes effect.

<DoDont image="component-table-sizing">
  <template #do>
    <p>Put the layout utilities on a wrapper around the table, which is where all 17 call sites carry them.</p>
  </template>
  <template #dont>
    <p>Put them on the tag as well. A class is outside the forwarded allow-list, so the attribute is dropped and none of those utilities reaches the table.</p>
  </template>
</DoDont>

**Nothing reports the dropped class.** Typecheck, lint and the console all stay quiet, and the failure arrives as a panel that is the wrong height. [Components](/foundations/components/usage.md#laying-things-out) sets out where layout belongs.

## Binding a selection

`v-model:selection` both seeds the set and receives every change. A plain click replaces the set, a modifier click adds or removes a row, and a shift click extends a range from the first item in the set.

```vue
<template>
  <CTable
    v-model:selection="service.selectedRows"
    :label="$t('httpHistory.requestTable.tableAriaLabel')"
    :items="items"
    :item-height="itemHeight"
    :row-key-fn="(item, index) => item?.node.id ?? `empty-${index}`"
    @select="onSelect"
  />
</template>
```

Pass `rowKeyFn` whenever rows can arrive at the top of the set. The default returns the array index, which re-keys every row on a prepend.

Treat `select` as a notification of intent rather than as the selection itself, and read `selection` when the current set is what matters. [Table events](/components/table/reference.md#table-events) lists the clicks that change the set without emitting `select`.

## Sorting a column

Mark a header `sortable` and handle the `sort` event. The third click on the same column emits `undefined`.

```ts
import { Table } from "@proxy-frontend/components";
import { Ordering } from "@proxy-frontend/graphql";
import * as OrderingModel from "@proxy-frontend/types";
import { isAbsent } from "@proxy-frontend/utils";

const onSort = (state: Table.SortState) => {
  if (isAbsent(state)) {
    sitemapService.setOrder("id", Ordering.Desc);
    return;
  }

  const direction = OrderingModel.Ordering.from(state.direction);
  sitemapService.setOrder(state.columnId, direction);
};
```

Handle the absent case rather than narrowing it away, because the third click is the one that reaches it.

## Persisting column widths

`resize` fires once per gesture, on mouse release, and carries every width the table currently holds.

```vue
<template>
  <CTable
    :label="$t('httpHistory.requestTable.tableAriaLabel')"
    :items="items"
    :item-height="itemHeight"
    @resize="({ widths }) => resizeColumns(widths)"
  />
</template>
```

Feed the stored width back through `defaultWidth` on the next mount, as the shared `CTableHeaderRow` wrapper does.

## Showing loading and empty

<Preview
  light="/examples/component-table-presentation-light.svg"
  dark="/examples/component-table-presentation-dark.svg"
  alt="Three tables side by side showing skeleton rows, a centred empty state and a striped set of real rows"
  caption="One branch renders at a time, and during the first 300ms of loading none of them does."
/>

Set `isLoading` and a `loadingLabel`, and the table draws skeleton rows to fill its height. Fill `#empty` for the case where the data arrived and there is none.

```vue
<template>
  <CTable
    :label="$t('search.requestTable.tableAriaLabel')"
    :items="items"
    :item-height="itemHeight"
    :is-loading="isLoading"
    :loading-label="$t('generic.loading.requests')"
  >
    <template #empty>
      <TableEmpty />
    </template>
  </CTable>
</template>
```

**`loadingLabel` is announced rather than drawn.** The indicator waits 300ms before appearing, so a fast response shows no flash and a slow one starts with a blank body.

::: tip
The empty branch can appear for one frame on first paint, so keep the empty state calm enough that a single frame of it costs nothing.
:::

## Tailing a log

`defaultAutoscroll` takes `top`, `bottom` or `none`, and it sets the starting mode rather than locking it.

```vue
<template>
  <CTable
    :label="$t('projects.upgradeDialog.migrationLogs.tableAriaLabel')"
    :items="logs"
    :item-height="20"
    [[default-autoscroll]]="bottom"
  />
</template>
```

Scrolling rewrites the mode. Reaching the bottom arms tailing, reaching the top pins the first row, and stopping between the two keeps the top-most row in place when the data changes.

## Reordering rows by dragging

Pass an options object to `draggable` with the four callbacks [Table props](/components/table/reference.md#table-props) lists.

```vue
<template>
  <CTable
    v-model:selection="selection"
    :label="$t('replay.entrySettings.tableAriaLabel')"
    :items="items"
    :item-height="28"
    :row-key-fn="(item) => item.id"
    :draggable="draggableOptions"
  />
</template>
```

Pass a stable `rowKeyFn` alongside it, because it supplies the identity the drag reports back. **The prop is read once, during setup**, so a value that flips from `false` to an options object after mount never starts the drag.

## Driving the table from script

`Table.useInstance<T>()` builds the typed reference, and `ref="instance"` on the tag fills it. [Table instance](/components/table/reference.md#table-instance) lists its members.

```ts
import { Table } from "@proxy-frontend/components";

const instance = Table.useInstance<Maybe<RequestMetaFragment>>();

watch(index, (next) => {
  if (instance.value?.currentIndex !== next) instance.value?.scrollTo(next);
});
```

The table handles PageUp and PageDown on its own, with the platform modifier jumping to the last and first row. Row-by-row movement is left to the surrounding screen: `focus-changed` hands out the object that performs it, so wire next-row and previous-row movement to that object from whatever owns the keyboard.
