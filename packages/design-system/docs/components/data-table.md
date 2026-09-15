---
outline: false
pageClass: wide
---

# Data table

The data table is the surface for scanning a record set, sorting it, and acting on a selection. `CTable` renders it inside a card, so the base a row paints on is the raised plane and not the page canvas. One row height token governs the geometry, and every row state paints inside that box as a stripe, a hover fill, a selection overlay or a highlight the user assigns.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### The working surface

Click a header to sort and a row to select. Meta-click toggles one row, shift-click takes a range, and dragging a header boundary resizes the column. Tab enters the grid, then the arrow keys move the cursor and carry the selection with it.

<Preview stack mode="page" title="Proxy history" note="grid, default density, 28px rows">
  <DsTable />
</Preview>

### Density

Three row heights, one table. Density is read from the shell, so the table and its toolbar move together.

<Preview stack title="Density ladder" note="24 / 28 / 32">
  <DsTable density="compact" preset="brief" label="Compact history" />
  <DsTable density="default" preset="brief" label="Default history" />
  <DsTable density="comfortable" preset="brief" label="Comfortable history" />
</Preview>

### Selection

Selection decides how a click behaves and what the grid announces. There is no selection column: the row is the target, so the column set is identical in all three.

<Preview stack title="None, single, multiple" note="no selection column in any of them">
  <DsTable preset="brief" selection="none" label="Static column set" />
  <DsTable preset="brief" selection="single" label="Single selection" />
  <DsTable preset="brief" selection="multiple" label="Multiple selection" />
</Preview>

### Row separation

The product ships the stripe and the rule together. In dark the rule is `--c-line-default`, which is the canvas value, so it reads as a dark seam against the raised card rather than as a line of its own colour.

<Preview stack title="Both, rule only, neither" note="the product ships the first">
  <DsTable preset="brief" label="Striped and ruled" />
  <DsTable preset="brief" :zebra="false" label="Ruled only" />
  <DsTable preset="brief" :zebra="false" separation="none" label="Neither" />
</Preview>

### Row states

Row 3 carries a row highlight and row 5 is non-actionable. Select a row and then hover it: the selection veil sits on a child above the cells, so it composites over the hover instead of replacing it.

Hover the highlighted row and nothing changes. The highlight is an opaque fill above the row, so it covers the hover the row paints underneath.

<Preview stack title="Highlighted, non-actionable, selected" note="hover composites under selection, and never over a highlight">
  <DsTable preset="brief" show-states label="Row state sample" />
</Preview>

### Loading

Initial load renders skeleton rows at the real row height. A refresh keeps the rows and puts the sweep in the header rule.

<Preview stack title="Initial load" note="skeleton bars at 8px">
  <DsTable preset="brief" status="loading" label="Loading history" />
</Preview>

<Preview stack title="Refresh" note="rows stay mounted">
  <DsTable preset="brief" status="refreshing" label="Refreshing history" />
</Preview>

### Empty and error

The empty block names the cause and offers the escape. The error block is one sentence and a retry.

<Preview stack title="Empty, the filter case" note="state the filter, give the unfiltered count">
  <DsTable preset="brief" status="empty" label="Empty history" />
</Preview>

<Preview stack title="Error" note="no stack trace in the primary message">
  <DsTable preset="brief" status="error" label="Failed history" />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DsTableColumn[]` | preset | Column model. Each column may set `width`, `numeric`, `mono`, `sortable`, `fixed`, `rowHeader`. |
| `rows` | `DsTableRow[]` | sample | Row model. `tag` paints the row-highlight fill, `nonActionable` marks it `aria-disabled`. |
| `preset` | `history` `brief` | `history` | Built-in column set used when `columns` is absent. |
| `density` | `compact` `default` `comfortable` | `default` | Row height 24, 28 or 32px. |
| `zebra` | boolean | `true` | The stripe on the odd phase. The product ships it on. |
| `separation` | `rule` `none` | `rule` | The 1px rule under each row. The product ships it on. |
| `selection` | `none` `single` `multiple` | `multiple` | How a click behaves, plus `aria-multiselectable`. No column of its own. |
| `status` | `ready` `loading` `refreshing` `empty` `error` | `ready` | Which body the surface renders. |
| `sortKey` | string | | Column key sorted at mount. |
| `sortDirection` | `ascending` `descending` | `ascending` | Direction at mount. |
| `label` | string | `Proxy history` | Accessible name of the grid. Required. |
| `emptyTitle` | string | | First line of the empty block. |
| `emptyBody` | string | | Second line, naming the cause and the count. |
| `emptyAction` | string | | Label of the recovery button. |
| `totalRows` | number | `0` | Data-set size, which under virtualisation is not the DOM count. |

Events: `sort`, `activate`, `recover`, `update:selected`.

### The card

`CTable` is a card holding the grid. The card is the boundary, so no row and no cell carries one of its own.

```html
<div class="flex w-full flex-col overflow-hidden rounded-sm bg-raised text-ink shadow-md">
  <div class="max-h-[340px] overflow-auto"></div>
  <div class="flex h-sm items-center justify-between border-t-2 border-line px-3 text-dense">3 selected of 12,480</div>
</div>
```

### The grid and its header

Column tracks come from the column model, so they are the one value passed as a custom property.

```html
<div role="grid" aria-rowcount="12481" aria-colcount="6" aria-label="Proxy history" class="w-full">
  <div role="row" aria-rowindex="1" class="sticky top-0 z-20 box-border grid h-sm grid-cols-[var(--dst-cols)] border-b-2 border-line bg-header">
    <div role="columnheader" aria-sort="ascending" class="relative flex min-w-0 select-none items-center border-e border-line text-dense font-semibold text-ink">
      <button type="button" class="flex h-full w-full min-w-0 cursor-pointer items-center gap-2 border-0 bg-transparent px-3 text-inherit active:bg-pressed">
        <span class="truncate">Path</span>
        <i class="fas fa-caret-up w-[1em] shrink-0 text-center text-[12px] leading-none" aria-hidden="true"></i>
      </button>
      <span class="absolute inset-y-0 -end-1 z-10 w-2 cursor-col-resize touch-none"></span>
    </div>
  </div>
</div>
```

The header plane is its own token. `CTable` writes it `bg-chip dark:bg-surface-800`, which is a step above the card on Paper and equal to the card in dark, where the 2px rule carries the boundary alone.

An unsorted column shows no caret. The affordance is the pointer cursor and the press fill on the cell, and the caret appears only once the column is sorted.

### The row and its cells

The row owns height and the cell owns horizontal inset. The rule is a real border under `box-border`, so it is drawn inside the row box and the pitch stays exactly one row.

```html
<div role="row" aria-rowindex="2" aria-selected="false"
     class="relative box-border grid h-sm cursor-pointer grid-cols-[var(--dst-cols)] border-b border-line bg-row-zebra hover:bg-row-hover">
  <div role="rowheader" title="/api/token" class="relative flex min-w-0 items-center px-3 text-dense">
    <span class="truncate">/api/token</span>
  </div>
  <div role="gridcell" class="relative flex items-center justify-end px-3 text-dense tabular-nums">401</div>
  <div role="gridcell" class="relative flex items-center px-3 font-mono text-caption tabular-nums">12:04:03.007</div>
</div>
```

Cell inset is `px-2` at compact, `px-3` at default and `px-4` at comfortable. Row height is `h-xs`, `h-sm` and `h-md`.

The stripe is on the odd phase, and the phase is read from the set length rather than the raw index. A row arriving at the head of a live tail would otherwise repaint every row below it.

```ts
const isRowEven = (index: number) =>
  items.length % 2 === 0 ? index % 2 === 0 : index % 2 !== 0;
```

### State layers

`CTable` paints the stripe and hover on the row itself, and selection on a full-bleed child that also carries the rail. None of them adds height, so the pitch holds.

```html
<div data-is-selected="true"
     class="c-table__item-row relative flex min-w-fit cursor-pointer border-b-[0.1em] border-line hover:bg-[var(--c-plane-hover-row)] data-[is-even=false]:bg-[var(--c-table-stripe)] data-[is-even=false]:hover:bg-[var(--c-plane-hover-row)]">
  <div class="c-table__item-overlay"></div>
</div>
```

```css
[data-is-selected="true"] .c-table__item-overlay {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: var(--c-table-selection-overlay);
  border-left: 0.2rem solid hsl(var(--c-secondary-400));
  pointer-events: none;
}
```

The overlay carries `z-index: 1` while the cells are positioned at `auto`, so the veil is painted over the text as well as over the fill. Both ends of the contrast pair move together, which is why the selected row keeps its legibility.

Four tokens carry every row state, measured against the card the table sits on: `#FDFDFB` on Paper and `#30333B` in dark.

| Token | Paper | Dark |
|---|---|---|
| `--c-table-stripe` | `#FAF8F5`, one step under the card | `#353942`, one step over the card |
| `--c-plane-hover-row` | `rgb(34 31 27 / 0.06)`, a warm darken | `#25272D`, an opaque darken to the canvas value |
| `--c-table-selection-overlay` | `hsl(36deg 76% 33% / 0.14)`, a gold tint | `rgb(255 255 255 / 0.2)`, a white veil |
| `--c-secondary-400`, the rail | `#845712` | `#DAA049` |

Paper darkens to hover and tints gold to select, so a hovered selected row is visibly both. Dark darkens to hover instead, which is why the stripe appears to drop away on the odd phase.

Hover is painted on the row, so it replaces the stripe rather than compositing over it. Selection is painted on the child, so it composites over whatever the row settled on.

Press is not a row state. `--c-active-overlay` is painted on a sortable header cell only: `rgb(34 31 27 / 0.1)` on Paper, `rgb(0 0 0 / 0.15)` in dark.

### Row highlight

A user assigns one of nine highlights to a request. The chosen value is persisted in request metadata, so the literal `var(--c-highlight-color-*)` string is the row colour and that name can never be repointed at something else.

```css
.c-item-row {
  background-color: var(--row-color, transparent);
}

:root[data-mode="light"] .c-item-row {
  background-color: var(--row-color-light, transparent);
}
```

A token value passes through unchanged. A raw hex, persisted by an older client or by a plugin, was picked against a dark canvas, so Paper mixes it 70 percent toward the canvas.

`color-mix(in srgb, #BB3829, hsl(var(--c-plane-canvas)) 70%)` lands on `#E2B7AF`, where the page ink reads at 9.08:1 instead of the 3.35:1 the raw value would have given.

The nine fills have nine paired inks under `--c-highlight-swatch-*`. Those paint the context-menu glyph and never the row, because a fill pale enough to sit under body text is too pale to read as a 12px circle.

| Highlight | Paper fill | Page ink on it | Swatch ink | Dark fill |
|---|---|---|---|---|
| Red | `#FBD1CA` | 11.78:1 | `#A8301F` | `#BB3829` |
| Orange | `#F6C390` | 10.26:1 | `#8F4207` | `#A84F08` |
| Yellow | `#EEE183` | 12.29:1 | `#6B5600` | `#7C6400` |
| Green | `#A8DEAC` | 10.71:1 | `#0F6A01` | `#117B01` |
| Cyan | `#5ED8EA` | 9.76:1 | `#0A5C66` | `#0A6C78` |
| Blue | `#DBE8FC` | 13.25:1 | `#00478F` | `#004FAA` |
| Pink | `#F9ACCC` | 9.22:1 | `#992259` | `#B0286C` |
| Purple | `#EEC9FB` | 11.24:1 | `#7D186D` | `#931D80` |
| Gray | `#E0E3E7` | 12.74:1 | `#4B5563` | `#4B5563` |

The ordering was brute-forced to maximise the worst-case separation under simulated colour vision deficiency. Measured worst case across the nine: 9.0 CIE76 at normal vision, 7.9 under deuteranopia, 6.2 under protanopia.

The specimen above renders this with `bg-tag-row` and `text-tag-ink`, which the docs bind to `--c-highlight-color-red` and `--c-ink-strong`.

A highlight is a fill and nothing else. It carries no rail, because the rail belongs to selection, and no chip, because a chip would spend column width restating what the fill already says.

The fill is opaque and sits above the row, so it covers the hover the row paints underneath. A highlighted row does not visibly hover, and only the selection overlay lands on top of it.

### Focus ring

The system ring from [Accessibility](/foundations/accessibility), raised on the focused cell so the offset is not clipped by the next row.

```html
<div role="gridcell" tabindex="0"
     class="focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] focus-visible:z-10">
  /login
</div>
```

### Loading

```html
<span class="h-2 w-[62%] rounded-md bg-skeleton animate-pulse motion-reduce:animate-none"></span>

<span class="absolute -bottom-0.5 start-0 h-0.5 w-1/3 animate-sweep bg-accent motion-reduce:w-full motion-reduce:animate-none"></span>
```

The bar is `bg-skeleton`, the plane the preset paints skeletons on. `bg-inset` cannot do it: in dark that token resolves to the canvas itself and the bars disappear.

Reduced motion is a variant, not a media query: `motion-reduce:animate-none` on the sweep and `motion-reduce:transition-none` on the caret.

### Redlines

Values are compact / default / comfortable where density applies.

| Part | Height | Inset | Radius | Border | Type | Icon |
|---|---|---|---|---|---|---|
| Card | fills the pane | 0 around the grid | 4 | 0, `shadow-md` in both themes | | |
| Body row | 24 / 28 / 32 | 0 | 0 | 1 rule below, drawn inside the box | inherits | |
| Cell | fills the row | 8 / 12 / 16 | 0 | 0 | `text-dense` 14/18 | 16 |
| Mono cell | fills the row | 8 / 12 / 16 | 0 | 0 | `text-caption` 12/16 | |
| Header cell | = row height | 8 / 12 / 16 | 0 | 1 inline-end, except the last column | `text-dense` at 600 | 12 caret |
| Header rule | | | | 2 | | |
| Selection rail | = row height | | 0 | `0.2rem` inline-start | | |
| Focus ring | = row height | | 0 | 2, offset 2 | | |
| Resize handle | = row height | | 0 | 1 visual, 8 pointer | | |
| Toolbar | 36 / 40 / 44 | 8 / 12 / 16 | 0 | 1 rule below | `text-dense` | 16 |
| Status bar | = row height | 8 / 12 / 16 | 0 | 2 rule above | `text-dense` | 16 |
| Skeleton bar | 8 | | 6 | 0 | | |
| Empty block | 160 minimum | 64 inline, 32 block | 0 | 0 | `text-title` then `text-body` | 24 |

| Value | Rule | Source |
|---|---|---|
| Radius 0 on rows | A rounded corner clipped by the card edge renders as a notch. Rounding belongs to the card. | Full-bleed inside a resizable pane |
| Cell inset 8 / 12 / 16 | The density remap of the cell inset. 8 is the dense-cell step. | Carbon sets 16px column padding at its default size |
| Header inset equals cell inset | Label and value share a left edge, or the column reads as two columns. | |
| Header rule 2px | At 1px it disappears when a row scrolls under the sticky header. | Reserved width for invalid, selected, active and this rule |
| Header text 14px at 600 | Same size as the cell, so hierarchy comes from weight alone. | Ant holds 14px across all table sizes |
| Mono cell 12/16 | An ID, hash or base64 blob switches family and size. Row height holds. | Monospace cells align by column |
| Icon 16px | The icon ladder pairs a 16px box with 13 to 14px text. | Carbon uses 16px in its data table |
| Sort caret 12px | A directional glyph sits one step below the body icon. | Spectrum sets 12px icons against 14px text |
| Label to caret gap 8px | The caret is a second object in the cell, not a mark on the label. `CHeaderCell` sets `gap-2`. | |
| Card radius 4, shadow-md | The table is a card, so the card's own geometry is the table's frame. | `CCard` on the Classic preset |
| Selection rail | The thinnest width at which a 3:1 edge is read at a glance. `CTable` declares `0.2rem`. | SC 1.4.11 graphical object |
| Resize handle 8px hit | A 1px line with a 1px hit area is unhittable at pointer speed. | The same sash the splitter uses |
| Toolbar 36 / 40 / 44 | Moves with the row height. | Carbon pairs toolbar height to row size |
| Empty inset 64 / 32 | The one place a generous inset is correct, since no density trades against it. | |

### Height arithmetic

Padding is derived from the height token, per [How to read a spec](/how-to-read-a-spec). Cells carry 14/18, and that 18px line box is the whole density mechanism. Carbon ships the same idea as `bodyCompact01` beside `body01`.

| Density | Height | Line box | Border | Implied padding-block |
|---|---|---|---|---|
| compact | 24 | 18 | 0 | 3 |
| default | 28 | 18 | 0 | 5 |
| comfortable | 32 | 18 | 0 | 7 |

The odd values 3, 5 and 7 are correct. Spectrum's shipped vertical padding tokens are 2, 3, 4, 7, 10, 13, 15 and 19px.

The row sets the height with `items-center` and no block padding. The arithmetic exists to prove the box fits.

</template>

<template #usage>

### When to use

Use the table for set questions: "find the request where", "show every finding that". It is optimised for rows per screen and for scanning one field down a column.

It is not optimised for reading one record in depth. Put full detail in a paired panel, never in a taller row.

| Situation | Use instead | Why |
|---|---|---|
| Under five rows, never sorted | A stacked layout or a definition list | The chrome costs more than the data is worth |
| One record, many fields | A detail panel or a form | A two-column table is a key/value list in a grid |
| The set is hierarchical | The tree grid variant | Indentation alone conveys structure to sighted users only |
| Rows need their own layouts | A card list | Columns pay off only when every row fills every column |
| The task is reading a payload | The payload viewer | Rows must not wrap, and prose that cannot wrap is unreadable |
| Picking exactly one value | A select or combobox | A single-select table is a listbox with extra keys |
| A fixed comparison matrix | A static table | No virtualisation, no selection, no roving tabindex |

- **State the row count on the surface.** A virtualised table has no visible end, so a filtered nine looks like an unfiltered nine.
- **Never lay out a form or a toolbar as a table.** Grid semantics put every control behind arrow keys, so Tab stops reaching the next field.
- **Never add a column because the data exists.** Past roughly a dozen columns, horizontal scroll destroys the scanning advantage.
- **Never page a surface the user scans.** The answer sits on a page that is not loaded, so scanning becomes guessing.

### Anatomy

The surface has seven parts outside the row.

```
┌─ 1 ───────────────────────────────────────────────────────────────────┐
│  [ filter ]   [ bulk actions ]                     [ columns ▾ ]      │
├───────────────────────────────────────────────────────────────────────┤
│ 2  Method │ Host        │ Path      3▲│ Status │ Size ⋮4│ Time       │
╞═══════════════════════════════════════════════════════════════════════╡  5
│    GET    │ example.com │ /login      │  200   │ 1.2k │ 12:04:01     │
│    POST   │ example.com │ /api/token  │  401   │  318 │ 12:04:03     │
│   6  scroll container                                                 │
├───────────────────────────────────────────────────────────────────────┤
│ 7  3 selected of 12,480                                               │
└───────────────────────────────────────────────────────────────────────┘
```

| # | Part | What it is | Governed by |
|---|---|---|---|
| 1 | **Toolbar** | Filter, bulk actions, column picker. A paired surface, not part of the grid. | 36 / 40 / 44, on the shell density |
| 2 | **Header row** | One sticky row of column labels. | The row height token |
| 3 | **Sort indicator** | A caret in the header cell, on the sorted column. | 12px caret |
| 4 | **Resize handle** | A line straddling the column boundary. | 1px visual, 8px hit area |
| 5 | **Header rule** | The one structural line in the surface. | 2px at the separator token |
| 6 | **Viewport** | The scroll container. Owns overflow and the sticky context. | The table's own height |
| 7 | **Status bar** | Row count, selection count, live-tail state. Sits in the card footer. | The row height token, ruled at 2px |

The row itself has five.

```
  1     2            3
  ▎ ┌────────────┬───────────┬────────┬───────┬──────────────┐
  ▎ │ GET        │ /login    │ 200    │ 1.2k  │ 12:04:01.221 │
  ▎ └────────────┴───────────┴────────┴───────┴──────────────┘
    └── 4 state layer, full bleed over every cell ───────────┘
    ╌╌╌ 5 focus ring, drawn on the focused cell ╌╌╌╌╌╌╌╌╌╌╌╌╌╌
```

| # | Part | What it is | Governed by |
|---|---|---|---|
| 1 | **Selection rail** | The inline-start edge of the selection overlay. | `--c-secondary-400`, gold in both themes |
| 2 | **Body row** | The virtualised unit. Owns all height, takes no padding. | 24 / 28 / 32 |
| 3 | **Cell** | Owns all horizontal inset. Owns no vertical inset. | 8 / 12 / 16 |
| 4 | **State layer** | The stripe and the hover on the row, the selection on a child above the cells. | The stack below |
| 5 | **Focus ring** | Drawn on the focused cell, raised above the next row. | 2px at `--c-focus-ring`, offset 2 |

- **One owner per axis.** The cell owns inset and the row owns height, so a column changes its padding without moving the pitch.
- **The header row is one row tall.** Header and body share the token, so the sticky offset is exactly one row.
- **Never put padding on the row.** It lands twice at every cell boundary, so the outer columns end up inset differently.
- **Never nest a scroll container inside a cell.** A second scroll axis makes the virtualiser's height assumption false.
- **Never stack a second header row.** Two header levels change the roles, the sticky offset and the column arithmetic at once.

### Variants

The WAI-ARIA Authoring Practices publishes three role families for tabular data and no fourth.

| Variant | Role | Use it when |
|---|---|---|
| Static | `role="table"` | The row count is small, known and unchanging. If a row can be clicked, it is not this. |
| Grid | `role="grid"` | The default. Every history, result, finding, rule and session list. |
| Tree grid | `role="treegrid"` | The hierarchy is real data structure, such as a sitemap. Never for visual grouping. |

Modifiers combine freely with grid and tree grid. They never appear in a component name.

| Modifier | Values | Rule |
|---|---|---|
| Density | compact / default / comfortable | Read from the shell. Never a per-table prop. |
| Separation | zebra / rule / none | The product ships the stripe and the rule together. Paper's rule reads at 1.97:1 on the card, dark's at 1.18:1. |
| Selection | none / single / multiple | Drives `aria-multiselectable` and what a click does. Never a column. |
| Pinned columns | leading / trailing | Same row height, same state layer. A paint concern, not a layout variant. |

The product stripes every table. The A List Apart striping studies found no accuracy gain on ordinary tables and put the benefit in wide ones, so the stripe earns its place on a history and not on a four column settings list.

- **Pick the variant from the role the content needs,** then apply modifiers. The role is a contract with assistive technology.
- **Never put `role="grid"` on a static table.** Grid semantics promise cell navigation, and an unkept promise is worse than `role="table"`.
- **Never fake hierarchy with indentation inside a grid.** Without `aria-level` and `aria-expanded` the structure reaches nobody else.

### Sizing

Row height is the only size axis. There is no small, medium and large table, only one table at three densities read from the shell.

| Density | Height | Rule | Reference |
|---|---|---|---|
| compact | **24** | The hard floor, satisfying SC 2.5.8 and SC 1.4.12 together. | Carbon `xs` data table is 24px |
| default | **28** | The proxy-history height, one step below Carbon `sm`. | Between Carbon `xs` and `sm` |
| comfortable | **32** | The desktop control height, so an unmodified control lines up in a row. | Carbon `sm`, Spectrum, Primer, Ant |

24 is a floor, not a preference. It is where SC 2.5.8 and SC 1.4.12 meet, and [Spacing](/foundations/spacing) holds that floor against every density step.

28 is the honest middle for a keyboard-driven security tool. Below it a 16px status glyph no longer fits with air around it, above it the screen loses rows. VS Code tree rows are 22px and Ant's small table is roughly 38px.

Every step is 4px, matching Material's additive density interval.

<DoDont
  align="start"
  do="Truncate the long path so every row keeps one height."
  dont="The wrapped cell grows the row and breaks the scroll index.">
  <template #do>
    <div class="w-full rounded-sm bg-raised text-ink">
      <div class="box-border flex h-sm items-center border-b border-line px-3 text-dense"><span class="truncate">/api/token?redirect=https://example.com/very/long/path</span></div>
      <div class="box-border flex h-sm items-center border-b border-line px-3 text-dense"><span class="truncate">/app.js</span></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full rounded-sm bg-raised text-ink">
      <div class="box-border flex min-h-sm items-center border-b border-line px-3 text-dense"><span>/api/token?redirect=https://example.com/very/long/path</span></div>
      <div class="box-border flex h-sm items-center border-b border-line px-3 text-dense"><span class="truncate">/app.js</span></div>
    </div>
  </template>
</DoDont>

- **Derive cell padding from the height token** and accept 3, 5 and 7px as the implied values.
- **Never give the table its own density prop.** A table at one density beside a toolbar at another breaks the shared baseline.

### Virtualisation

Virtualisation is a constraint on the geometry, not an optimisation applied afterwards. Four rules make the geometry legal.

1. **The virtualiser's item height is the token the CSS uses.** Read it from one source rather than computing it.
2. **Nothing inside a row wraps or grows.** Row height is a constant in `floor(scrollTop / itemHeight)`, so a wrapped cell breaks the index.
3. **Row pitch does not change with state.** Zebra, hover, selection, rail and ring all paint inside the row box.
4. **Height is integral at every density and DPR.** All three heights are even, so boundaries land on whole device pixels at 1x, 1.5x, 2x and 3x.

### States

A row's painted colour is one base fill plus at most two state layers, applied in a fixed order.

```
base fill        card  |  zebra stripe  |  row highlight
  + hover        pointer only, painted on the row, replaces the base fill
  + selection    persistent, painted on a child above the cells
focus ring       drawn on the focused cell, never composited into the fill
```

On Paper hover is an alpha of the page ink, per [Colour](/foundations/colour), so one value reads on a plain row, a striped row and any of the nine highlights. Selection is deliberately not neutral: it is the gold accent at 14 percent, which is what tells it apart from hover.

Solid per-state fills would need a token for every intersection of nine highlights, two zebra phases, hover and selection. The intersections nobody enumerated are the ones that ship failing.

Measured against the card the table sits on, `#FDFDFB` on Paper and `#30333B` in dark:

| Layer | Paper composite | Delta | Dark composite | Delta |
|---|---|---|---|---|
| Zebra alternate | `#FAF8F5` | 1.04:1 | `#353942` | 1.09:1 |
| Hover | `#F0F0EE` | 1.12:1 | `#25272D` | 1.18:1 |
| Hover on the stripe | `#EDEBE8` | 1.17:1 | `#25272D` | 1.18:1 |
| Selection | `#EEE7DB` | 1.20:1 | `#595C62` | 1.88:1 |
| Selection plus hover | `#E3DCCF` | 1.34:1 | `#515257` | 1.62:1 |

Understanding SC 1.4.11 says author-supplied hover treatments need not identify the state, so the hover delta itself has no floor. The text is not exempt. Every foreground must clear 4.5:1 against the composited fill, which is what the user sees.

The dark selected row is the tight one. The veil lands on the ink as well as on the fill, giving `#D2D2D2` on `#595C62`, which measures 4.45:1 and misses the floor for body text by a hair.

#### One ink, nine fills

Paper's highlight fills are pale bands, so the page ink `#221F1B` clears 9.22:1 on the worst of them and no row needs an ink of its own. That is why the nine were re-derived rather than lightened from the dark set.

The muted ink is the trap. `#665C52` measures 3.67:1 on pink and 4.08:1 on orange, so five of the nine put muted metadata under 4.5:1, and red falls from 4.69:1 to 3.59:1 once selection and hover land on it.

Dark has the same trap without the highlights. Muted metadata on a dark selected row measures 2.79:1 once the white veil lands on both the fill and the ink.

Validate every foreground against the fill plus every layer that can land on it, never against the fill alone and never against the canvas.

<DoDont
  align="start"
  do="Metadata keeps the page ink, which clears all nine fills."
  dont="Metadata goes muted, which fails on five of nine fills.">
  <template #do>
    <div class="w-full rounded-sm bg-raised">
      <div class="flex h-sm items-center gap-4 bg-tag-row px-3 text-dense text-tag-ink"><span>/api/token</span><span class="ml-auto tabular-nums">401</span><span class="font-mono text-caption tabular-nums">12:04:03.007</span></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full rounded-sm bg-raised">
      <div class="flex h-sm items-center gap-4 bg-tag-row px-3 text-dense text-tag-ink"><span>/api/token</span><span class="ml-auto tabular-nums">401</span><span class="font-mono text-caption tabular-nums text-ink-muted">12:04:03.007</span></div>
    </div>
  </template>
</DoDont>

#### The row state matrix

| State | Base fill | Layer | Foreground | Rail | Ring |
|---|---|---|---|---|---|
| Default | card | none | ink, metadata muted | none | none |
| Zebra alternate | `--c-table-stripe` | none | as default | none | none |
| Hover | card | `--c-plane-hover-row` replaces the base | as default | none | none |
| Selected, blurred | as above | `--c-table-selection-overlay` | veiled with the fill | gold at `--c-secondary-400` | none |
| Selected plus hover | hover fill | selection over it | veiled with the fill | rail | none |
| Current row | as above | unchanged | as default | unchanged | 2px ring, on the cell |
| Highlighted | one of the nine fills | selection only, never hover | **page ink, all of it** | only when selected | as above |
| Loading, initial | card | none | skeleton bars at inset | none | none |
| Loading, refresh | unchanged | unchanged | unchanged | sweep in the header rule | unchanged |
| Empty | card | none | title at ink, body muted, glyph faint | none | on the action only |
| Error | card | none | message at danger ink 5.53:1, body muted | none | on the retry only |
| Non-actionable | as above | no hover | muted | none | still focusable |

Press is missing from the list on purpose. A row has no pressed state in the product, because selection lands on mousedown and there is nothing left for a press fill to say. `--c-active-overlay` belongs to the sortable header cell.

Selected means "in the selection set" and is carried by fill plus rail. Current means "where the keyboard cursor is" and is carried by the ring. In a multi-select table the cursor moves without the selection changing.

<DoDont
  align="start"
  do="Selection carries the fill and the gold rail, the cursor carries the ring."
  dont="Selection carries the fill and the gold rail, and so does the cursor.">
  <template #do>
    <div class="w-full rounded-sm bg-raised text-ink">
      <div class="relative flex h-sm items-center gap-4 bg-row-selected px-3 text-dense"><span class="absolute inset-y-0 start-0 w-[0.2rem] bg-gold-ink"></span><span>/login</span><span class="ml-auto">selected</span></div>
      <div class="flex h-sm items-center gap-4 px-3 text-dense outline outline-2 -outline-offset-2 outline-[var(--c-focus-ring)]"><span>/api/token</span><span class="ml-auto">cursor</span></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full rounded-sm bg-raised text-ink">
      <div class="relative flex h-sm items-center gap-4 bg-row-selected px-3 text-dense"><span class="absolute inset-y-0 start-0 w-[0.2rem] bg-gold-ink"></span><span>/login</span><span class="ml-auto">selected</span></div>
      <div class="relative flex h-sm items-center gap-4 bg-row-selected px-3 text-dense"><span class="absolute inset-y-0 start-0 w-[0.2rem] bg-gold-ink"></span><span>/api/token</span><span class="ml-auto">cursor</span></div>
    </div>
  </template>
</DoDont>

#### States that do not apply

| State | Verdict | Do this instead |
|---|---|---|
| **Disabled** | Not a row state. A row is data, not a control. | Mark it `aria-disabled`, keep it focusable, disable the actions. |
| **Read-only** | The default, not a state. | Treat an editable cell as a field inside a cell, with its own matrix. |
| **Error, per row** | Not a row state. It spends the nine-fill channel the user owns. | Put the failure in a status column, plus a status ink on that cell. |
| **Indeterminate** | Not a row state. It belongs to a checkbox, and no row carries one. | Put the partial state in the toolbar's select-all control. |
| **Visited** | Never. Rows are records, not links. | Nothing. In-app history leaks nothing useful. |

The `disabled` attribute removes a row from the tab order and from the interaction model, so its values stop being readable and copyable.

#### Loading, in three cases

The indicator per case comes from [Skeleton and loading](/components/skeleton-loading). What the table adds is geometry.

1. **Initial load.** Skeleton rows at exactly the row height, with 8px bars at each column's width, and `aria-busy` on the grid. Occupy the real geometry or the surface reflows when data lands.
2. **Refresh.** Keep every row on screen and sweep a 2px bar through the header rule. Never blank the body, never swap rows for skeletons, never dim the table.
3. **Live append.** No spinner, because rows arrive at the tail. A live tail needs the pause control [Motion](/foundations/motion) requires under SC 2.2.2, and auto-scroll stops when the user scrolls away.

#### Empty, in three cases

Never ship one generic "No data". The three empties have three causes and three recoveries.

| Cause | Message shape | Recovery |
|---|---|---|
| Nothing has happened yet | State what produces rows here | The action that starts producing them |
| A filter excludes everything | State the filter and the unfiltered count | Clear the filter |
| The fetch failed | State what failed, without a stack trace | Retry |

The empty block replaces the body only. The header row, the column set and the toolbar stay, because they are the controls the user needs to escape.

#### Sort affordances

| Sub-state | Treatment |
|---|---|
| Not sortable | No caret, no press fill, no pointer cursor. |
| Sortable, unsorted | No caret. The affordance is the pointer cursor and the press fill on the cell. |
| Sorted | A persistent 12px caret at the default ink, plus `aria-sort` on the header cell. |
| Multi-column | Each header shows its caret plus a 1-based ordinal at caption size. Past three columns, use a dialog. |

Exactly one column carries `aria-sort` in a single-sort table. Omit the attribute elsewhere rather than writing `aria-sort="none"` on every header.

- **Composite hover over selection rather than replacing it,** so a hovered selected row is visibly both.
- **Validate every foreground against the composited fill,** including selection over hover over a highlight. That triple is the worst case.
- **Turn transitions off on row hover in any table over a thousand rows.** Hover fires on every pointer move, so the cost is paid continuously.
- **Never use `transition-all` on a row.** It animates background, shadow, width and height together across a virtualised list.

### Accessibility

| Attribute | Where | Requirement |
|---|---|---|
| `role="grid"` | Root | Promises cell navigation. Do not use it without the keyboard model below. |
| `role="row"` | Row | Required on every rendered row, header included. |
| `role="columnheader"` | Header cell | Required. Its accessible name is the column label. |
| `role="gridcell"` | Body cell | Required. Use `role="rowheader"` on the cell that names the record. |
| `aria-rowcount` | Root | Mandatory under virtualisation. The data-set total, or `-1` when unknown. |
| `aria-rowindex` | Every row | Mandatory under virtualisation. 1-based, header row is index 1. |
| `aria-colcount`, `aria-colindex` | Root, cell | Required when columns can be hidden or virtualised. |
| `aria-multiselectable` | Root | Required when selection is multiple. |
| `title` | Any truncatable cell | Required. A truncated value with no title is unreadable. |
| `aria-selected` | Row | Required on every row when selection is on. Absent is not false. |
| `aria-sort` | Sorted header only | On the cell, not on the button inside it. |
| `aria-busy` | Root | During initial load and during a refresh. |
| `aria-disabled` | Row | For a non-actionable row. Never the `disabled` attribute. |
| `aria-level`, `aria-expanded` | Row, tree grid only | Required on every row of a tree grid, with `aria-posinset` and `aria-setsize`. |

The sortable header's clickable element is a real `<button>` inside the `columnheader`. A header cell with a click handler and no button has no role that announces as activatable.

#### Keyboard

From the WAI-ARIA Authoring Practices Grid pattern. All of it is required in grid and tree grid, and none of it applies to a static table.

| Key | Action | At the edge |
|---|---|---|
| Right Arrow | Moves focus one cell right. | Focus stays on the right-most cell. |
| Left Arrow | Moves focus one cell left. | Focus stays on the left-most cell. |
| Down Arrow | Moves focus one cell down. | Focus stays on the bottom cell. |
| Up Arrow | Moves focus one cell up. | Focus stays on the top cell. |
| Page Down | Moves down the number of visible rows, scrolling. | Focus stays on the last row. |
| Page Up | Moves up the same number of rows. | Focus stays on the first row. |
| Control + Page Down | Jumps to the last row. `CTable` binds this. | |
| Control + Page Up | Jumps to the first row. | |
| Home | Moves to the first cell in the focused row. | |
| End | Moves to the last cell in the focused row. | |
| Control + Home | Moves to the first cell in the first row. | |
| Control + End | Moves to the last cell in the last row. | |
| Shift + Space | Selects the focused row. | |
| Control + A | Selects all rows. | |
| Shift + Arrow | Extends the selection to the row the cursor lands on. | |
| Enter | Activates the row's primary action. | |

A bare Up or Down Arrow carries the selection with the cursor, which is what `selectNext` and `selectPrevious` do in the product. Left and Right move the cursor across the row and leave the selection alone.

Pointer selection is the same model. A click selects one row, meta-click toggles one without emptying the set, and shift-click takes the range from the anchor. A right-click inside the selection keeps it, because the context menu acts on the whole set.

For a tree grid, Right Arrow expands a collapsed row, Left Arrow collapses an expanded one, and Left Arrow on a leaf moves to the parent row.

Page Up and Page Down move by the number of visible rows, which is `floor(viewportHeight / rowHeight)`. A hard-coded page size is wrong at every density and every window size.

#### Focus

- **Roving tabindex.** Exactly one element carries `tabindex="0"`. Tab enters the grid and Tab leaves it, and arrow keys move within it.
- **Focus survives virtualisation.** Keep the focused node mounted, or restore focus by row index on remount. Focus landing on `<body>` strands the keyboard user.
- **Focus survives re-sort and re-filter.** Focus follows the record. If the record leaves the set, focus goes to the nearest surviving row.
- **New rows never steal focus.** A live-tailing table appends without moving the cursor.

#### Contrast floors

| Part | Floor | Rule |
|---|---|---|
| Cell text | **4.5:1** against the composited row fill | SC 1.4.3, measured against what is painted |
| Metadata text | **4.5:1** against every fill it can land on | SC 1.4.3. Selected and zebra rows both count |
| Column header | **4.5:1** | SC 1.4.3. It is text |
| Sort caret, status glyphs | **3:1** | SC 1.4.11, graphical object needed for comprehension |
| Selection rail | **3:1** against the row fill and the card | Gold measures 5.10:1 and 6.15:1 on Paper, 2.91:1 and 5.48:1 in dark |
| Highlight fill | none | Decorative. The gated value is the page ink on it, worst case 9.22:1 |
| Focus ring | **3:1** between focused and unfocused, 2px perimeter | SC 2.4.13 |
| Zebra stripe | none | Decorative. Against the card, Paper measures 1.04:1 and dark 1.09:1 |
| Rules and separators | none | Decorative. Target APCA Lc 15 for discernibility |
| Skeleton bar | none | It carries no content |

The dark rail is the one measurement that misses. Gold on the selected fill reads 2.91:1, because the white veil lifts the fill towards the rail. It clears 5.48:1 on an unselected row and on the card.

Colour is never the only cue, and in a table the tint is the one channel the user reassigns freely.

The cheapest redundant stack runs in this order: a text label in its own column, then an icon with a different silhouette, then a rail, then the row fill. Reach for the fill last.

### Content

Column headers are sentence case, one to three words, no trailing colon. A header is a noun phrase naming the column's value, never a sentence or a question.

The unit lives in the header and the number lives in the cell: `Size (KB)`, not the unit repeated 12,480 times. That buys back cell width and keeps the column sortable as a number.

A header is required even when it is visually hidden. A column with no accessible name is a column a screen-reader user cannot identify.

| Content | Rule | Why |
|---|---|---|
| Status, bytes, duration, count | Right-aligned tabular figures | Proportional digits jitter, so the eye cannot compare rows |
| IDs, hashes, hex, base64 | Monospace at 12/16 | Switch the family, not the row height |
| Text | Left-aligned at 14/18 | The left edge is what text scanning uses |
| Anything | Never centred | Centring destroys the left edge and the right edge at once |
| Absent value | A single hyphen at the faint ink | An empty cell is ambiguous with a rendering failure |
| Zero | The literal `0`, never blank | Blank reads as absent |
| Timestamps | One form per column, never mixed | A relative time puts the absolute value in the cell's `title` |
| Booleans | An icon with a distinct silhouette, plus a name | Never an empty cell for false |

<DoDont
  align="start"
  do="Right-aligned tabular figures line up down the column."
  dont="Centred numbers align on nothing, so no two rows compare.">
  <template #do>
    <div class="w-full rounded-sm bg-raised text-dense text-ink">
      <div class="grid h-sm grid-cols-[1fr_88px] items-center px-3 tabular-nums"><span>/login</span><span class="text-right">1204</span></div>
      <div class="grid h-sm grid-cols-[1fr_88px] items-center px-3 tabular-nums"><span>/api/token</span><span class="text-right">318</span></div>
      <div class="grid h-sm grid-cols-[1fr_88px] items-center px-3 tabular-nums"><span>/app.js</span><span class="text-right">84210</span></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full rounded-sm bg-raised text-dense text-ink">
      <div class="grid h-sm grid-cols-[1fr_88px] items-center px-3 tabular-nums"><span>/login</span><span class="text-center">1204</span></div>
      <div class="grid h-sm grid-cols-[1fr_88px] items-center px-3 tabular-nums"><span>/api/token</span><span class="text-center">318</span></div>
      <div class="grid h-sm grid-cols-[1fr_88px] items-center px-3 tabular-nums"><span>/app.js</span><span class="text-center">84210</span></div>
    </div>
  </template>
</DoDont>

Cells never wrap, and every cell that can truncate carries a `title` with the full value. A truncated hostname with no `title` is an unanswerable question. [Typography](/foundations/typography) owns the truncation idiom.

Truncate the least informative end. A URL path truncates at the start so the filename survives, and a host truncates at the end so the registrable domain survives.

Row count reads `N of M` with the locale's thousands separator. Selection reads `N selected`, and says so when N is the loaded set rather than the full set.

Bulk-action labels state the count: `Delete 12 requests`. A bare `Delete` beside a selection of twelve is the most expensive ambiguity on the surface.

Empty and error copy is one sentence for the cause and one for the recovery, both sentence case. Name what failed, and put any error code on a second line at caption size so it can be copied.

</template>

</PageTabs>
