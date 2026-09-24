# Table

`CTable` is the virtualised data grid behind the request lists, the finding list, the websocket streams and the migration log. A caller hands it a flat `items` array, a row height in pixels and the markup for two rows, and gets back virtualisation, grid semantics, selection, sorting, column resizing, scroll restoration, and the loading and empty presentations. It reaches 17 call sites in the interface, from the HTTP history grid to the About screen.

This page explains the model. [Usage](/components/table/usage.md) shows how to build one, and [Reference](/components/table/reference.md) lists the props, the events, the slots, the DOM it renders and what it forwards.

## What the table decides for you

<Preview
  light="/examples/component-table-default-light.svg"
  dark="/examples/component-table-default-dark.svg"
  alt="A table with a sticky header row of three column headers above three striped data rows, annotated with the 16 pixel cell padding, the 24 pixel row height, the 4 pixel rule under the header and the 1 pixel rule that closes a row"
  caption="A 36px header row closed by a 4px rule, then rows of 24px with the 1px rule inside that height."
/>

Virtualisation is the first decision, and it is not optional. `items` goes to a virtual list with an overscan of five rows, so a long dataset renders as the visible window plus a margin, while the wrapper reserves the height of the whole set so the scrollbar still reports the real length.

The semantics are the second. The scroll container carries `role="grid"`, takes its accessible name from the required `label` prop, and reports `aria-rowcount` against the dataset rather than against the rendered window. Rows carry `role="row"`, `aria-rowindex` and `aria-selected`, and cells carry `role="gridcell"` through `CItemCell`. [Accessibility](/foundations/accessibility.md#a-table-is-a-grid) owns that inventory and names the two places where it is still incomplete.

**The shell is a `CCard`, so a table arrives as a raised panel already.** The card contributes the `surface-raised` background, the 3.5px corner, the 48px band the `header` slot fills and the rule above the footer, which is why a table dropped into a layout needs no container of its own to read as a region. [Card](/components/card.md) covers the shell on its own terms.

## Three components, one grid

`CTable` draws the frame. `CHeaderCell` draws a column header, `CItemCell` draws a cell, and the two find each other through a `columnId` string carried on an injected context.

That string is the whole coupling. A header cell measures itself and writes its width into a record keyed by `columnId`, and each item cell reads its own width back out of the same record. **A cell whose `columnId` matches no header falls back to a literal 50px**, silently, which renders as a plausible column somebody has to notice rather than as an error anybody is told about.

Sorting lives on the same context. A header marked `sortable` toggles a state the table then emits, and the caller reorders the data. Neither cell component sorts anything itself, and neither one needs a reference to the other.

## The row height is a number, not a size

There is no `size` prop and no density vocabulary. `itemHeight` is a count of pixels, and the app-standard value comes from `rowHeight(fontSize)` in the tokens package, which resolves to **24px at the 14px interface default**. [Space](/foundations/space/usage.md#reading-a-spacing-value-from-script) sets out why that number is read from the package rather than repeated at the call site.

The number is load-bearing in six places: the virtual list row size, the inline height written on each row, the count of skeleton rows drawn while loading, the index the `scroll` event reports, the distance PageUp and PageDown travel, and the scroll arithmetic that turns an index into an offset, from `scrollTo` to the gap `scrollIntoView` leaves around a revealed row.

**The virtual list reads it once, during setup.** Raising the interface text size changes the rendered row height while the offsets inside the virtual list stay where they were, so the rows drift out of the scroller. Seven of the 17 call sites key the table on a value derived from the font size, so the remount rebuilds those offsets. Five more read the row height from the same setting and pass no key, which is where the drift is live. The last five pass a literal row height that no text size change moves.

## Row states stack rather than replace

<Preview
  light="/examples/component-table-rows-light.svg"
  dark="/examples/component-table-rows-dark.svg"
  alt="Six table rows showing the even row, the striped odd row, a hovered row, a selected row with a leading edge marker, a row that is both selected and hovered, and a row carrying a user colour under a hover wash"
  caption="Hover and selection are translucent washes, so a user colour survives underneath both."
/>

One row can be striped, hovered, selected and painted a colour the user chose, at the same time. The stripe is a background colour, the user colour is an inline background colour that replaces it, and hover and selection are `background-image` gradients layered over whatever the background already holds.

Selection adds a second signal at the leading edge, where the row's 2px transparent left border becomes `line-selected`. [States](/foundations/states.md#selected-takes-whatever-the-surface-has-spare) explains why identification moves to an edge on a surface whose background is already carrying data, and [what happens when states combine](/foundations/states.md#what-happens-when-states-combine) covers the layering rule the washes implement.

The stripe is computed against the length of `items` rather than against the row index alone, so prepending a row does not flip the parity of the rows below it. A live log gains rows at one end without the whole table changing colour.

## When a table is the right choice

A table is right when the rows are records of the same shape, the set is long enough that drawing all of it would cost something, and a person needs to select across it, sort it, or widen a column to read a value that is being clipped.

Those three conditions arrive together more often than not, which is why the request lists, the finding list and the stream lists all use it. A set of five settings rows meets none of them, and a card with its own markup is less machinery for the same picture.

## When something else fits better

Hierarchy is the clearest disqualifier. `CTable` takes a flat array and has no notion of a parent, a child or an expanded state, so a sitemap or a collection tree uses `CTree` instead.

A short list a person reorders by dragging, with no columns to resize and no sorting to do, is `CReorderableList`. `CTable` can reorder rows, and one call site does, yet the drag support arrives with the rest of the grid attached.

A placeholder shown before any data exists is `CTableRowsSkeleton` inside a bare `CCard`. It is a sibling rather than a slot, and three loading layouts use it to draw the shape of a table without mounting the virtual list at all.

## What the closed API costs

A `class` on a `CTable` is dropped in silence, and so is `style`, `role`, `title` and `tabindex`, because what reaches the root is an allow-list of four shapes rather than a list of things to block. [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes the contract, and the cost here is that the table has no width prop and no height prop to offer in exchange, so sizing belongs to the parent element.

**That failure is live in the interface today.** The migration log writes `class="flex-1 min-h-0 min-w-0 w-full select-text"` on its `CTable`, and none of those five utilities is applied to anything.

The second cost is quieter. The component declares a default slot and its template renders six named ones, `header`, `header-row`, `loading`, `empty`, `item-row` and `footer`, without rendering the default anywhere. Content written directly between the tags is discarded with nothing reported, and the declaration is what makes it look supported.
