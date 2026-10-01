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

Put the cells straight into the `item-row` slot. Wrapping them in a container puts a plain element between `role="row"` and `role="gridcell"`, which breaks the ownership the roles describe. The shared row wrapper and the About screen both do this today, and they are why [accessibility](/foundations/accessibility.md#a-table-is-a-grid) records the gap.

## Matching a header cell to its cells

<Preview
  light="/examples/component-table-headercell-light.svg"
  dark="/examples/component-table-headercell-dark.svg"
  alt="A header cell with its padding bands, its sort caret box, the divider on its right edge and the grab strip of the resizer marked out, above a second cell aligned to the end with the caret on the left"
  caption="8px and 16px of padding, a 14px caret box, a 7px resizer with a 31px grab strip."
/>

`columnId` is the join. The header cell measures itself, writes a width under that key, and each item cell reads the width back out under the same key.

**A mismatched key renders a 50px column and reports nothing.** Take the key from a shared constant where one exists: the finding table passes `:column-id="FindingOrderBy.Title"`, which makes the column identifier and the sort field the same value.

`defaultWidth` is a starting width rather than a fixed one. On mount the cell measures the width it collapses to, which the inline `min-width` pins at `4rem` by default, and writes `max(defaultWidth, that floor)` as its own width. A drag on the resizer replaces the value.

## Sizing the rows

`itemHeight` is a number of pixels. Read it from the tokens package rather than typing a row height, so a change to the type ramp moves the tables that read it together.

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

The `:key` is the part that is easy to leave out. The virtual list captures `itemHeight` once during setup, so a later change moves the drawn row height while the scroll offsets stay where they were. Keying the table on the value remounts it and rebuilds the offsets. Leave the key off and a table looks correct until somebody changes the interface text size.

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

**Nothing reports the dropped class.** Typecheck passes, lint passes, the console stays quiet, and the failure arrives as a panel that is the wrong height. [Components](/foundations/components/usage.md#laying-things-out) sets out where layout belongs when a component refuses to carry it.

## Binding a selection

`selection` is a model, so `v-model:selection` both seeds the set and receives every change. The component owns the click handling underneath: a plain click replaces the set, a modifier click adds or removes a row, and a shift click extends a range from the first item in the set.

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

Pass `rowKeyFn` whenever rows can arrive at the top of the set. The default returns the array index, which re-keys every row on a prepend and throws away the DOM reuse virtualisation exists for.

Treat `select` as a notification of intent rather than as the selection itself. A modifier click that removes a row emits nothing, and the exposed `select` method emits without writing to the model, so read `selection` when the current set is what matters. A modifier click also cannot empty the set, because the removal branch is guarded on more than one row being selected, and a right click on an already selected row leaves the set alone so a context menu opens against the whole selection.

## Sorting a column

Mark a header `sortable` and handle the `sort` event. The cycle runs ascending, then descending, then unsorted, so the third click on the same column emits `undefined`.

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

Handle the absent case rather than narrowing it away. `Table.SortState` is a `Maybe`, so a handler typed to a bare direction compiles against it by assertion, and the third click is the one that reaches it.

## Persisting column widths

`resize` fires once per gesture, on mouse release, and carries a record of every width the table currently holds. There is no stream of widths during the drag, so a handler writing to storage is called once per column a person drags.

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

Feed the stored width back through `defaultWidth` on the next mount, which is what the shared `CTableHeaderRow` wrapper does for each column it is handed.

## Showing loading and empty

<Preview
  light="/examples/component-table-presentation-light.svg"
  dark="/examples/component-table-presentation-dark.svg"
  alt="Three tables side by side showing skeleton rows, a centred empty state and a striped set of real rows"
  caption="One branch renders at a time, and during the first 300ms of loading none of them does."
/>

Set `isLoading` and give it a `loadingLabel`, and the table draws enough skeleton rows to fill its own height. Fill `#empty` for the case where the data arrived and there is none.

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

**`loadingLabel` is announced rather than drawn**, and it reaches the announcer while the indicator is on screen. The indicator waits 300ms before appearing and stays for at least 500ms after loading ends, which suppresses a flash on a fast response at the cost of a blank body during that first 300ms. The empty branch can also appear for one frame on first paint, because emptiness is measured against the rendered window rather than against `items`, so keep the empty state calm enough that a single frame of it costs nothing.

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

Scrolling rewrites the mode as it goes. Reaching the bottom arms tailing, reaching the top arms pinning to the first row, and stopping anywhere between the two restores the previously top-most row when the data changes. A table started at `none` therefore begins tailing as soon as somebody scrolls to the end.

## Reordering rows by dragging

Pass an options object to `draggable` with four callbacks: `onDragStart`, `onDragOver`, `onDragStop` and `isDraggable`. Rows for which `isDraggable` returns false cancel the drag when it starts.

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

Pass a stable `rowKeyFn` alongside it, because the same function supplies the identity the drag reports back in `onDragStop`. Build the options once and leave the binding alone afterwards. **The prop is read a single time, during setup**, so a value that flips from `false` to an options object after mount leaves the drag machinery unstarted.

## Driving the table from script

`Table.useInstance<T>()` builds the typed reference, and `ref="instance"` on the tag fills it. The instance exposes `scrollTo`, `currentIndex`, `select` and the six movement methods.

```ts
import { Table } from "@proxy-frontend/components";

const instance = Table.useInstance<Maybe<RequestMetaFragment>>();

watch(index, (next) => {
  if (instance.value?.currentIndex !== next) instance.value?.scrollTo(next);
});
```

The table handles two keys on its own, PageUp and PageDown, with the platform modifier jumping to the last and first row. Row-by-row movement is left open on purpose, and `focus-changed` hands out the object that performs it, so wire next-row and previous-row movement to that object from whatever owns the keyboard in the surrounding screen.
