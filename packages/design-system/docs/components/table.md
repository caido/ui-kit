# Table

`CTable` is the virtualised data grid behind the request lists, the finding list, the websocket streams and the migration log. A caller hands it a flat `items` array, a row height in pixels and the markup for two rows, and gets back virtualisation, grid semantics, selection, sorting, column resizing, scroll restoration, and the loading and empty presentations.

This page explains the model. [Usage](/components/table/usage.md) shows how to build one, and [Reference](/components/table/reference.md) lists the props, the events, the slots, the DOM it renders and what it forwards.

## What the table decides for you

<Preview
  light="/examples/component-table-default-light.svg"
  dark="/examples/component-table-default-dark.svg"
  alt="A table with a sticky header row of three column headers above three striped data rows, annotated with the 16 pixel cell padding, the 24 pixel row height, the 4 pixel rule under the header and the 1 pixel rule that closes a row"
  caption="A 36px header row closed by a 4px rule, then rows of 24px with the 1px rule inside that height."
/>

Virtualisation is not optional. A long dataset renders as the visible window plus a margin, while the wrapper reserves the height of the whole set so the scrollbar still reports the real length.

The scroll container is a `role="grid"` named by the required `label` prop, and its row count reports the dataset rather than the rendered window. [ARIA](/components/table/reference.md#aria) lists every role, and [Accessibility](/foundations/accessibility.md#a-table-is-a-grid) names the two places where the inventory is still incomplete.

**The shell is a `CCard`, so a table arrives as a raised panel already**, with its header band and footer rule, and needs no container of its own. [Card](/components/card.md) covers the shell.

## Three components, one grid

`CTable` draws the frame. `CHeaderCell` draws a column header, `CItemCell` draws a cell, and the two find each other through a `columnId` string carried on an injected context.

That string is the whole coupling. A header cell writes its width under its `columnId`, and each item cell reads its width back under the same key. **A cell whose `columnId` matches no header falls back to a literal 50px**, silently, which renders as a plausible column rather than as an error.

Sorting lives on the same context. A header marked `sortable` toggles a state the table emits, and the caller reorders the data.

## The row height is a number, not a size

There is no `size` prop and no density vocabulary. `itemHeight` is a count of pixels, and the app-standard value comes from `rowHeight(fontSize)` in the tokens package, which resolves to **24px at the 14px interface default**. [Space](/foundations/space/usage.md#reading-a-spacing-value-from-script) sets out why that number is read from the package. The same number drives the skeleton row count, the `scroll` event index, PageUp and PageDown, and every index to offset calculation.

**The virtual list reads it once, during setup.** Raising the interface text size changes the drawn row height while the offsets inside the virtual list stay where they were, so the rows drift out of the scroller. Keying the table on the row height rebuilds the offsets, as [Sizing the rows](/components/table/usage.md#sizing-the-rows) shows. Five call sites read the row height from the setting and pass no key, which is where the drift is live today.

## Row states stack rather than replace

<Preview
  light="/examples/component-table-rows-light.svg"
  dark="/examples/component-table-rows-dark.svg"
  alt="Six table rows showing the even row, the striped odd row, a hovered row, a selected row with a leading edge marker, a row that is both selected and hovered, and a row carrying a user colour under a hover wash"
  caption="Hover and selection are translucent washes, so a user colour survives underneath both."
/>

One row can be striped, hovered, selected and painted a colour the user chose, at the same time. The stripe and the user colour are background colours, and hover and selection are gradients layered over them. Selection also turns the row's leading edge `line-selected`, for the reason [States](/foundations/states.md#selected-takes-whatever-the-surface-has-spare) gives.

The stripe is computed against the length of `items` rather than the row index alone, so a live log that gains rows at the top does not change colour all the way down.

## When a table is the right choice

A table is right when the rows are records of the same shape, the set is long enough that drawing all of it would cost something, and a person needs to select across it, sort it, or widen a column. A set of five settings rows meets none of these, and a card with its own markup is less machinery.

## When something else fits better

`CTable` takes a flat array and has no notion of a parent or an expanded state, so a sitemap or a collection tree uses `CTree`. A short list a person reorders by dragging, with no columns to resize, is `CReorderableList`. A placeholder shown before any data exists is `CTableRowsSkeleton` inside a bare `CCard`. [Related components](/components/table/reference.md#related-components) sets out the differences.

## What the closed API costs

A `class` on a `CTable` is dropped in silence, along with `style`, `role`, `title` and `tabindex`. [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes the contract. The table has no width or height prop in exchange, so **sizing belongs to the parent element.** The migration log writes five layout utilities on its `CTable` today, and none of them is applied.

Content written directly between the tags is also discarded with nothing reported, because the table renders only its six named slots. [Table slots](/components/table/reference.md#table-slots) lists them.
