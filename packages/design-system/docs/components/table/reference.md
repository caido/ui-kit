# Table reference

Every prop, event, slot, element and measurement across `CTable`, `CHeaderCell` and `CItemCell`. For the model, see [Overview](/components/table.md). For how to build one, see [Usage](/components/table/usage.md).

Imported as `CTable`, `CHeaderCell` and `CItemCell` from `@proxy-frontend/components`, which also exposes the same three under the `Table` namespace alongside `SortState`, `LayoutState`, `TableContext`, `TableInstanceRef` and `useInstance`.

Measurements are taken at a 14px root, which is what the application pins from the interface text size setting.

## Table props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `label` | `string` | yes | none | Accessible name written as `aria-label` on the scroll container. Never drawn |
| `items` | `T[]` | yes | none | The dataset. Entries may be absent at runtime, and an absent entry draws a full-size skeleton instead of the row slot |
| `itemHeight` | `number` | yes | none | Row height in pixels. Read once by the virtual list, and reactively for the drawn height |
| `selection` | `T[]` | no | `[]` | A model, so `v-model:selection` both seeds and receives. The default factory returns a new array |
| `isLoading` | `boolean` | no | `false` | Writes `aria-busy` and `data-is-loading`, gates the loading branch, and suspends scroll bookkeeping |
| `loadingLabel` | `string` | no | `""` | Announced in a visually hidden live region while the indicator is visible |
| `rowKeyFn` | `(item: T, index: number) => string \| number` | no | index | Supplies `:key`, `data-id` and the drag identity. The default returns the array index |
| `rowColorFn` | `(item: T) => Maybe<string>` | no | `undefined` | Return value is written to the row's inline `backgroundColor`. Any CSS colour string, with no token validation |
| `defaultAutoscroll` | `"top" \| "bottom" \| "none"` | no | `"none"` | The starting scroll mode. Scrolling rewrites it |
| `draggable` | `false \| DraggableOptions<T, U>` | no | `false` | Row reordering. Read once during setup rather than watched |

`DraggableOptions` holds four callbacks: `onDragStart`, `onDragOver`, `onDragStop` and `isDraggable`. The drag binds to `.c-table__item-row` with a 10px activation distance, and a row whose `isDraggable` returns false cancels the drag at start.

## Table events

| Event | Payload | Fires |
|---|---|---|
| `update:selection` | `T[]` | On every change the component makes to the set |
| `select` | `Maybe<T>` | On a plain click, on a modifier click that adds a row, and on keyboard or programmatic selection. A modifier click that removes a row and a range click with an anchor are both silent |
| `sort` | `SortState` | On a click on a sortable header. The cycle is `asc`, `desc`, `undefined` |
| `resize` | `LayoutState` | On mouse release at the end of a resize gesture, not during it |
| `scroll` | `number` | On a change to `floor(scrollTop / itemHeight)`, throttled at 100ms |
| `focus-changed` | `(table: Table, focused: boolean)` | On `focusin` and `focusout` on the root |

Row selection is bound to `mousedown` rather than to `click`, so it settles before a context menu opens. `SortState` is `Maybe<{ columnId: string; direction: "asc" \| "desc" }>`. `LayoutState` is `{ widths: Record<string, string> }`. `Table` is the movement object: `selectNext`, `selectPrev`, `selectPageDown`, `selectPageUp`, `selectFirst`, `selectLast`, each returning nothing.

## Table slots

| Name | Slot props | Rendered |
|---|---|---|
| `header` | none | When supplied, as the card header band |
| `header-row` | none | When supplied, in a sticky wrapper at the top of the scroll container |
| `item-row` | `{ item: NonNullable<T> }` | Per visible row, skipped when the entry is absent |
| `loading` | none | Inside the loading indicator, replacing the default skeleton rows |
| `empty` | none | When the rendered window is empty and `isLoading` is false |
| `footer` | none | When supplied, under a 1px rule at the bottom of the card |
| default | none | Declared in the slot types and rendered nowhere. Content between the tags is discarded |

Supplying `header-row` adds one to `aria-rowcount` and shifts each row's `aria-rowindex` from 1-based to 2-based.

## Table instance

| Member | Signature |
|---|---|
| `scrollTo` | `(index: number) => Promise<number>` |
| `currentIndex` | `number` |
| `select` | `(item: Maybe<T>) => void`, which emits `select` without writing to the model |
| `selectNext`, `selectPrevious` | `() => void`, moving within the rendered window |
| `selectFirst`, `selectLast` | `() => void`, moving within the whole dataset |
| `selectPageUp`, `selectPageDown` | `() => void`, moving by the visible row count |

`Table.useInstance<T>()` returns the typed ref, and `Table.TableInstanceRef<T>` is its type.

## Header cell props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `columnId` | `string` | yes | none | The key under which the width is stored and read, and the identifier the `sort` event carries |
| `sortable` | `boolean` | no | `false` | Adds a pointer cursor, `role="button"`, a tab stop, Enter and Space handling, and `aria-sort` |
| `align` | `"start" \| "end"` | no | `"start"` | Flips the inner wrapper between `flex-row` and `flex-row-reverse`, moving the sort caret to the other side |
| `noResize` | `boolean` | no | `false` | Removes the resizer element and the 1px right divider |
| `defaultWidth` | `string` | no | `"4rem"` | Starting width. Resolved on mount to `max(defaultWidth, the width the cell collapses to)`, which `minWidth` pins |
| `minWidth` | `string` | no | `"4rem"` | Written to the inline `min-width` |

## Item cell props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `columnId` | `string` | yes | none | The key the width is read under. An unknown key resolves to `50px` |
| `align` | `"start" \| "end"` | no | `"start"` | Adds `text-right` at `end`. The flex direction is unchanged |

Both cell components inject the table context with optional chaining, so rendering either outside a `CTable` makes sorting and resizing inert, sets every cell to `50px`, and throws nothing.

## Vocabulary

| Axis | Accepted |
|---|---|
| `size` | Not accepted by any of the three components |
| `severity` | Not accepted by any of the three components |
| `variant` | Not accepted by any of the three components |
| `align` | `start` or `end`, on the two cell components |

Row density comes from the numeric `itemHeight` rather than from a named size. The shared axes are in [components](/foundations/components/reference.md#the-vocabulary).

## DOM

| Depth | Element | Notes |
|---|---|---|
| 1 | `div` | `w-full h-full flex`, `tabindex="-1"`, PageUp and PageDown handlers, focus handlers, forwarded attributes. No role |
| 2 | `CCard` | Three library divs, the card root, body and content, each filling its box |
| 3 | `div` | `size-full flex flex-col`, holding the optional header band, the body wrapper and the optional footer band |
| 4 | `div` | `flex-1 min-h-0`, the card body wrapper |
| 5 | `div` | `w-full h-full flex flex-col overflow-x-auto`, the horizontal scroller and the drag root |
| 6 | `div` | `role="grid"`, with the vertical scrolling supplied by the virtual list |
| 7 | `div` | `role="row"`, `aria-rowindex="1"`, sticky at the top, holding `header-row` |
| 7 | `div` | `role="status"`, `aria-live="polite"`, `sr-only`, carrying `loadingLabel` |
| 7 | `div` | `role="presentation"` for the loading branch and for the empty branch |
| 7 | `div` | `role="rowgroup"`, sized and offset by the virtual list |
| 8 | `div` | `class="c-table__item-row"`, `role="row"`, with `aria-rowindex`, `data-id`, `data-is-even`, `data-is-selected`, `data-is-draggable` and inline height and background colour |

`CHeaderCell` renders a `div` with `role="columnheader"`, `data-sortable`, `data-resizable`, `data-align` and `data-is-resizing`, wrapping an inner flex container, an ellipsised label box, an optional caret box and an optional resizer. `CItemCell` renders a `div` with `role="gridcell"`, `data-column-id` and `data-align`, wrapping an ellipsised content box.

## ARIA

| Attribute | Set by | Value |
|---|---|---|
| `role="grid"` | The component | On the vertical scroll container |
| `aria-label` | The caller, through `label` | Supplied through the required prop rather than as an attribute |
| `aria-rowcount` | The component | `items.length`, plus one when `header-row` is supplied |
| `aria-busy` | The component | Mirrors `isLoading` |
| `role="row"` and `aria-rowindex` | The component | On the header wrapper and on each rendered row |
| `aria-selected` | The component | Mirrors membership of the selection set |
| `role="rowgroup"` | The component | On the virtual list wrapper |
| `role="presentation"` | The component | On the loading and empty wrappers |
| `role="status"` and `aria-live="polite"` | The component | On the hidden loading announcer |
| `role="columnheader"` and `aria-sort` | `CHeaderCell` | `aria-sort` is absent when the column is not sortable, `none` when sortable and unsorted |
| `role="gridcell"` | `CItemCell` | On the cell root |
| `role="button"` and `tabindex="0"` | `CHeaderCell` | On the inner wrapper, when `sortable` |

## Forwarded attributes

| Shape | On `CTable` | On `CHeaderCell` and `CItemCell` |
|---|---|---|
| `data-*`, `aria-*` | Reaches the root | Reaches the root |
| `on` followed by a capital | Reaches the root | Reaches the root |
| `id`, `name`, `form` | Reaches the root | Reaches the root |
| `class`, `style` | Removed, with nothing reported | Reaches the root, with `class` merged into the component class |
| `title`, `role`, `tabindex` | Removed with the rest | Reaches the root |

`CTable` sets `inheritAttrs: false` and filters through `useForwardedAttrs`, whose pattern is `/^(data-|aria-|on[A-Z])|^(id|name|form)$/`. Neither cell component declares `defineOptions`, so both keep the framework default of inheriting attributes and neither filters anything. The migration log writes a `class` on its `CTable` today, and none of it is applied.

## Measurements

| Value | Where | Source |
|---|---|---|
| 24px | Row height at the 14px interface default | `rowHeight(fontSize)` from the tokens package |
| 4px | Rule under the sticky header row, and under the card header band | `border-b-4 border-surface-page` |
| 1px | Rule under each row, and the divider on a resizable header cell | `border-b` and `border-r`, both `surface-page` |
| 2px | Leading edge on a row, transparent until selected | `border-l-2`, then `border-l-line-selected` |
| 36px | Header cell height | 8px padding, a 20px line box, 8px padding |
| 40px | Header row including its rule | 36px plus `border-b-4` |
| 48px | Card header band, when the `header` slot is supplied | `h-12` in `CCard` |
| 16px | Horizontal padding in a header cell and in an item cell | `px-4` against `--spacing: 4px` |
| 8px | Vertical padding in a header cell, and the gap before the caret | `py-2` and `gap-2` |
| 14px | Caret box width, and the height of a skeleton bar | A one em box in the header cell, and `height="1rem"` on the skeleton, at a 14px root |
| 7px | Visible resizer width | Half an em, measured against the header text rather than against the grid |
| 31px | Resizer grab area | 7px plus `-ml-2` and `-mr-4` |
| 50px | Cell width when `columnId` matches no header | The literal fallback in the cell |
| 56px | Default header width and default minimum width, at a 14px root | `4rem`, which is also the floor the mount-time measurement returns |
| 5 | Overscan rows above and below the window | The virtual list options |
| 10px | Pointer travel before a drag starts | The drag options |
| 300ms | Delay before the loading indicator appears | The shared delayed loading composable |
| 500ms | Minimum time the indicator stays once shown | The same composable |
| 100ms | Scroll event throttle | The scroll composable |

## Tokens

| Token | Used for |
|---|---|
| `--color-surface-raised` | Card background and the sticky header row background |
| `--color-surface-subtle` | The row stripe and the skeleton fill |
| `--color-surface-page` | The rule under each row, the divider between header cells, and the 4px rules under the header band and the header row |
| `--color-surface-hover` | Mixed at 75% into the hover wash |
| `--color-fg-strong` | Body text from the card, and mixed at 20% into the selection wash |
| `--color-fg-default` | Header cell text |
| `--color-line-selected` | The 2px leading edge on a selected row |
| `--color-line-subtle` | The rule above the footer |
| `--z-index-sticky` | The sticky header row |
| `--z-index-raised` | The resizer |

`bg-black/15`, painted while a sortable header is active, and `border-l-transparent` on the row are the two colours across the three files that come from a utility rather than from a token. The card corner is 3.5px at the 14px interface default, set by the preset and covered in [card](/components/card/reference.md#measurements).

## Related components

| Component | Difference |
|---|---|
| `CTree` | Hierarchical rather than flat, with expansion state. `CTable` takes a flat array |
| `CReorderableList` | Drag ordering without columns, sorting or virtualisation |
| `CTableRowsSkeleton` | A placeholder drawn inside a bare `CCard` before the table mounts. Its one prop is `rows`, defaulting to 24 |
| `CCard` | The shell `CTable` renders into, with its own header band and footer rule |

## Tests

| Assertion | Pinned value |
|---|---|
| The rule under the sticky header row | `border-bottom-width` of 4px, `position` of `sticky`, `top` of `0px` |
| The grid carries the label it was given | `aria-label` equal to the `label` prop |
| The row count is the dataset | `aria-rowcount` of 50 for 50 items |
| PageUp and PageDown suppress the browser scroll | `defaultPrevented` is true |
| The platform modifier jumps to an end | Mod and PageDown select the last item, Mod and PageUp select the first |
| Focus reports both directions | `focus-changed` fires with true on `focusin` and false on `focusout` |
