---
outline: false
pageClass: wide
---

# Split pane

A split pane divides one region into sibling panels and puts a draggable boundary between them. Use it only when both panels stay useful while the user works in the other one.

The product has no split-pane component of its own. Every split in proxy-frontend is PrimeVue `Splitter` and `SplitterPanel`, run unstyled and painted by the @caido/primevue Classic preset. Everything below is that pairing.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Layout

`layout` is PrimeVue's name for the axis. Horizontal puts panels side by side, vertical stacks them. The product passes it on every splitter.

<Preview title="Layout" note="horizontal, then vertical" stack>
  <DsSplitPane layout="horizontal" :panels="[{ label: 'Request', lines: ['GET /api/v1/session', 'host: caido.io'] }, { label: 'Response', lines: ['200 OK', 'content-length: 1428'] }]" />
  <DsSplitPane layout="vertical" :panels="[{ label: 'History', lines: ['GET /api/v1/session', 'POST /api/v1/login'] }, { label: 'Request', lines: ['GET /api/v1/session'] }]" />
</Preview>

### Sizes and floors

`size` and `minSize` are percentages of the container, not pixels. Drag either boundary into its floor: the move is refused, so the boundary stops dead.

<Preview title="Sizes and floors" note="size 25 and 75, minSize 40" stack>
  <DsSplitPane layout="horizontal" :panels="[{ label: 'Sitemap', size: 25, lines: ['caido.io', 'api.caido.io'] }, { label: 'Requests', size: 75, minSize: 40, lines: ['GET /api/v1/session', 'POST /api/v1/login'] }]" />
</Preview>

### Three panels

A splitter takes any number of panels and draws one gutter between each neighbouring pair. Findings ships three across one splitter.

<Preview title="Three panels, one splitter" note="minSize 12 on each" mode="page" stack>
  <DsSplitPane
    layout="horizontal"
    stage="lg"
    :panels="[
      { label: 'Description', minSize: 12, lines: ['Reflected XSS', 'Reporter: Active scan'] },
      { label: 'Request', minSize: 12, lines: ['GET /search?q=1', 'host: caido.io'] },
      { label: 'Response', minSize: 12, lines: ['200 OK', 'content-type: text/html'] }
    ]" />
</Preview>

### Persistence

Give the splitter a `stateKey` and the sizes survive a reload. Drag this one, refresh the page, and it comes back where you left it.

<Preview title="Persisted to localStorage" note="splitter.docs.persisted" mode="page" stack>
  <DsSplitPane
    layout="horizontal"
    state-key="splitter.docs.persisted"
    state-storage="local"
    :panels="[
      { label: 'Navigation', size: 30, minSize: 15, lines: ['HTTP History', 'Search', 'Findings'] },
      { label: 'Content', size: 70, minSize: 25, lines: ['GET /api/v1/session', '200 OK, 1.4 kB'] }
    ]" />
</Preview>

### Keyboard

Tab to a handle and hold an arrow key. Each press moves 5px and a held key repeats every 40ms. Left and Right on a horizontal splitter, Up and Down on a vertical one.

<Preview title="Arrow keys, 5px per press" note="held key repeats at 40ms" mode="page" stack>
  <DsSplitPane
    layout="horizontal"
    stage="lg"
    :panels="[
      { label: 'Sidebar', size: 30, minSize: 15, lines: ['Scopes', 'Filters', 'Workflows'] },
      { label: 'Editor', size: 70, minSize: 25, lines: ['GET /api/v1/session HTTP/1.1', 'host: caido.io', 'accept: */*'] }
    ]" />
</Preview>

### Nesting

A splitter goes straight inside a panel. It carries no border and no background, so nesting adds a boundary and nothing else. Sitemap nests three levels this way.

<Preview title="Nested, alternating layout" note="outer horizontal, inner vertical" mode="page" stack>
  <DsSplitPane
    layout="horizontal"
    stage="lg"
    :panels="[
      { label: 'Sitemap', size: 25, lines: ['caido.io', 'api.caido.io'] },
      { size: 75, minSize: 40 }
    ]">
    <template #panel-1>
      <DsSplitPane
        layout="vertical"
        nested
        :panels="[
          { label: 'Requests', lines: ['GET /api/v1/session', 'POST /api/v1/login'] },
          { label: 'Response', lines: ['200 OK', 'content-length: 1428'] }
        ]" />
    </template>
  </DsSplitPane>
</Preview>

</template>

<template #code>

### Props

The specimen mirrors PrimeVue's API as the product uses it. `panels` stands in for the `SplitterPanel` children.

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | `horizontal` `vertical` | `horizontal` | The flex axis. Horizontal puts panels side by side. |
| `panels` | `Panel[]` | two panels | One entry per `SplitterPanel`. |
| `step` | number | `5` | Pixels moved per arrow key press. |
| `stateKey` | string | | Namespaced key, `splitter.<area>.<part>`. Omit and the split forgets. |
| `stateStorage` | `local` `session` | `session` | PrimeVue's default is session. The product always passes local. |
| `stage` | `sm` `md` `lg` | `md` | Stage height, so a specimen has a definite size across the split axis. |
| `nested` | boolean | `false` | Renders inside a parent panel: no stage height, no size of its own. |

A `Panel` carries `label`, `lines`, `size` and `minSize`. Both sizes are percentages of the container.

### Geometry

Everything in the gutter comes from the preset. There is no CSS of ours anywhere in it.

| Part | Value | Source |
|---|---|---|
| Track | 4px | PrimeVue's `gutterSize` default. The product never overrides it. |
| Track fill | transparent in both themes | Preset: `bg-transparent dark:bg-transparent`. |
| Handle | 2px across, 40px along | Preset: `!w-[2px] !h-10`, flipped on a vertical splitter. |
| Handle fill | `bg-surface-700` | One class, no dark variant, so it resolves per theme. |
| Handle radius | `rounded-md` | The preset rounds the handle, not the track. |
| Handle inset | 1px each side | Preset `m-[1px]`. 2 plus 1 plus 1 is the 4px track. |
| Splitter radius | `rounded-md` | On the root, where nothing is painted, so it never shows. |
| Border | none | The splitter draws no border and no background at any depth. |

The track is the drag target, not the handle. All 4px of it takes the pointer down, along the full length of the boundary.

### Class strings

These are the classes the preset emits. They work unchanged in the product.

```html

<div class="bg-transparent text-surface-700 dark:text-surface-0/80 rounded-md"
     style="display: flex; flex-wrap: nowrap">

<div class="grow" style="flex-basis: calc(25% - 4px)">
```

The gutter is a transparent track wrapping one small handle.

```html

<div class="flex items-center justify-center shrink-0 bg-transparent dark:bg-transparent
            transition-all duration-200 cursor-col-resize">

  <div class="z-20 bg-surface-700 rounded-md m-[1px] !w-[2px] !h-10
              transition-all duration-200
              focus:outline-none focus:outline-offset-0
              focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]">
</div>
```

On a vertical splitter the cursor becomes `cursor-row-resize` and the handle becomes `!h-[2px] !w-10`. Nothing else changes.

Colours are role classes, never hex. `bg-surface-700` resolves per theme, so the same markup is correct in light and dark.

### Product usage

Every splitter in the app follows one shape. This is findings, trimmed.

```html
<Splitter layout="vertical" class="size-full min-w-0"
          state-storage="local" :state-key="LayoutStateKey.Findings.Root">
  <SplitterPanel class="min-h-10">…</SplitterPanel>
  <SplitterPanel class="min-h-0 min-w-0" :min-size="12">…</SplitterPanel>
</Splitter>
```

`LayoutStateKey` is a typed constant map in `@proxy-frontend/types`. Its value type is `splitter.${string}.${string}`, so a key that is not namespaced does not compile.

</template>

<template #usage>

### When to use

Reach for a split pane only when both panels stay useful while the other is being worked in. That is the one property no other container gives you.

| Situation | Use instead |
|---|---|
| One region should be visible at a time | Tabs |
| The secondary region is consulted briefly and dismissed | Popover, or a drawer |
| The secondary region blocks the primary task until answered | Dialog |
| The boundary never moves and stores nothing | `Divider`, which is a separate component |
| The regions reflow by width with no fixed relationship | Grid or flow layout with container queries |
| The content is a single scrolling column | No split. A scroll container has no determinate cross-axis size |

<DoDont
  do="Tabs give each alternative view the full width."
  dont="A split halves both views, so every row is cut off.">
  <template #do>
    <DsTabs label="Exchange" :tabs="[{ id: 'req', label: 'Request' }, { id: 'res', label: 'Response' }]" />
  </template>
  <template #dont>
    <DsSplitPane layout="horizontal" stage="sm" :panels="[{ label: 'Request', lines: ['GET /api/v1/session'] }, { label: 'Response', lines: ['200 OK, 1.4 kB'] }]" />
  </template>
</DoDont>

| Rule | Why |
|---|---|
| Convert a split to tabs when one panel sits at its floor. | The user already decided. The layout charges a gutter and a focus stop to keep saying so. |
| Give the payload panel the larger share. | A response body should grow with the window. A navigation tree should not. |
| Use `Divider` when the boundary never moves. | A splitter that cannot move still takes a tab stop and still writes a record. |
| Never add a split to make a screen look configurable. | Each one adds a persisted record, a focus stop and a floor that eventually conflicts. |
| Never put a split inside a scrolling region. | Flex bases resolve against a definite size, and a scroll container has none in the scroll axis. |

### Anatomy

A splitter has three structural parts. There is no header, no toolbar and no collapse control anywhere in it.

| # | Part | What it is | Required |
|---|---|---|---|
| 1 | Splitter | Owns the axis, the panel list and the state key. Sets `layout`. | Yes |
| 2 | Panel | A region with a percentage `size` and an optional `minSize`. | Two or more |
| 3 | Gutter | A 4px transparent track holding one 2px handle. Drawn between neighbours. | Automatic |

The gutter carries no label, no grip glyph, no chevron and no menu. It is a track and a handle.

| Rule | Why |
|---|---|
| Put `min-h-0 min-w-0` on every panel. | A flex item's automatic minimum is its content, so one unbroken URL sets the floor. |
| Let the whole 4px track take the pointer, not the 40px handle. | The handle marks the boundary. Restricting the grab to it would cost most of the length. |
| Never place a control inside the gutter. | A 24px button in a 4px track swallows the drag target. |
| Never let a panel draw its own border against the gutter. | The seam then reads as three lines and the track becomes a frame. |
| Never nest a bordered box inside a panel that is already a card. | The splitter contributes no chrome, so every border you add is one you own. |

### Sizing

Sizes are percentages of the container. PrimeVue writes them as `flex-basis: calc(N% - Gpx)`, where G is the gutter allowance for the whole splitter.

| Value | Meaning | Product examples |
|---|---|---|
| `size` | Starting share, as a percentage. Defaults to an equal split. | 15 and 85, 25 and 75, 30 and 70 |
| `minSize` | Floor, as a percentage of the container. | 12 on each findings panel, 40 on the sitemap request area |
| `min-h-0` `min-w-0` | The flexbox floor, set as a class on the panel. | On nearly every panel in the app |
| `min-h-10` | A pixel floor for a panel that must keep a row visible. | The findings table panel |

A drag that would break a floor is refused rather than clamped, so the boundary stops dead. That is PrimeVue's `validateResize`, and it is why a floor feels like a wall.

<DoDont
  do="Floors hold each panel at the share it declared."
  dont="With no floor a drag squeezes a panel to nothing.">
  <template #do>
    <DsSplitPane layout="horizontal" stage="sm" :panels="[{ label: 'Navigation', size: 30, minSize: 20, lines: ['HTTP History', 'Findings'] }, { label: 'Content', size: 70, minSize: 30, lines: ['GET /api/v1/session'] }]" />
  </template>
  <template #dont>
    <DsSplitPane layout="horizontal" stage="sm" :panels="[{ label: 'Navigation', size: 30, lines: ['HTTP History', 'Findings'] }, { label: 'Content', size: 70, lines: ['GET /api/v1/session'] }]" />
  </template>
</DoDont>

| Rule | Why |
|---|---|
| Declare `minSize` on any panel whose content stops working when narrow. | Without it the only floor is zero, and zero is reachable by one drag. |
| Set a floor on both sides of a boundary that matters. | A floor on one panel still lets the other be crushed from the far side. |
| Never read `minSize` as pixels. | It is a percentage, so 12 is 154px on a 1280px window and 460px on a 4K one. |
| Never rely on content to stop a drag. | `min-w-0` is what makes the panel shrinkable, and it is set on nearly every panel. |

### States

The preset gives the gutter three states and no more. There is no hover treatment: the cursor is the only hover feedback, which is why the handle is painted at rest.

| State | Track | Handle |
|---|---|---|
| Default | transparent | 2px by 40px, `--c-gutter-handle`, `rounded-md` |
| Hover | transparent | unchanged. Only the cursor changes, to col-resize or row-resize |
| Resizing | transparent | unchanged. The splitter takes `data-p-resizing` |
| Focus-visible | transparent | a 1px accent ring around the handle |

Disabled, loading, error, read-only and selected have no meaning here. A splitter that cannot move is a `Divider`, a layout has no validity, and a gutter holds no chosen value.

| Rule | Why |
|---|---|
| Keep the handle painted at rest. | With no hover treatment it is the only thing that says the boundary moves. |
| Keep the track transparent. | The panels' own surfaces already separate them. A filled track adds a third plane. |
| Reinstate `user-select: none` for the length of a drag. | PrimeVue's own stylesheet specifies it, and unstyled mode drops the rule. |
| Never animate the drag. | A transition on flex-basis makes the boundary lag the pointer. |
| Never add a glow to the handle in dark. | The preset emits no shadow utilities in its dark branch, anywhere. |

### Nesting

Nesting is the normal case, not an exception. Sitemap nests three deep and findings two.

<DoDont
  do="Alternating layout gives each boundary its own axis."
  dont="Two horizontal boundaries look alike and move different panels.">
  <template #do>
    <DsSplitPane layout="horizontal" stage="sm" :panels="[{ label: 'Tree', size: 30, lines: ['caido.io'] }, { size: 70 }]">
      <template #panel-1>
        <DsSplitPane layout="vertical" nested :panels="[{ label: 'Request', lines: ['GET /api/v1/session'] }, { label: 'Response', lines: ['200 OK'] }]" />
      </template>
    </DsSplitPane>
  </template>
  <template #dont>
    <DsSplitPane layout="horizontal" stage="sm" :panels="[{ label: 'Tree', size: 30, lines: ['caido.io'] }, { size: 70 }]">
      <template #panel-1>
        <DsSplitPane layout="horizontal" nested :panels="[{ label: 'Request', lines: ['GET /api/v1/session'] }, { label: 'Response', lines: ['200 OK'] }]" />
      </template>
    </DsSplitPane>
  </template>
</DoDont>

| Rule | Why |
|---|---|
| Let the nested splitter stay borderless and transparent. | The preset gives it `flex grow border-0`, so depth costs one gutter and nothing else. |
| Alternate the layout at each level. | Two boundaries on the same axis look alike and move different panels. |
| Give every level its own state key under the parent's namespace. | `splitter.sitemap.root` and `splitter.sitemap.requests` are separate records. |
| Never wrap a nested splitter in a card. | The panel already sits on the canvas, so the card would frame a frame. |

### Persistence

One record per splitter: the array of panel percentages, JSON, under the state key.

| Rule | Why |
|---|---|
| Pass `state-storage="local"`. | PrimeVue defaults to session, so a layout would be forgotten on every launch. |
| Take the key from `LayoutStateKey`, never a literal. | Its type is `splitter.${string}.${string}`, so an unnamespaced key does not compile. |
| Write on resize end, never on move. | A 120Hz drag would write 120 records per second, which reads as a stuck boundary. |
| Store percentages, which is what the product does. | The panels keep their ratio when the window changes size, with no recalculation. |
| Never key on panel index alone. | Adding a panel then silently reassigns every saved size to the wrong region. |

### Accessibility

`role="separator"` with `tabindex="0"` makes the boundary a widget. WAI-ARIA 1.2 classifies `separator` as a standalone widget role when focusable, and a document-structure role when not.

| Key | Action |
|---|---|
| Left, Right | Moves a horizontal splitter, 5px per press. |
| Up, Down | Moves a vertical splitter, 5px per press. |
| Held arrow | Repeats every 40ms until the key is released. |

Arrows are the whole map. There is no Home, End, Page Up, Page Down, Enter or Escape, because a panel cannot collapse and a drag has nothing to revert to.

| Attribute | Value |
|---|---|
| `aria-valuenow` | The preceding panel's size as a percentage, rounded to an integer. |
| `aria-valuemin` | That panel's `minSize`, or 0. |
| `aria-valuemax` | The pair's combined share less the following panel's floor. |
| `aria-orientation` | The orientation of the boundary line, which is perpendicular to `layout`. |
| `aria-label` | The preceding panel's name, and nothing more. |

| Rule | Why |
|---|---|
| Keep every gutter in DOM order between its panels. | Tab traversal then follows the visual layout. |
| Recompute the value bounds as the container changes. | A static `aria-valuemin="0"` promises a position the widget will refuse. |
| Name a gutter after the panel it controls. | The role is announced already, so "Resize sidebar splitter" reads as a splitter twice. |
| Never use `role="slider"` because the value model looks similar. | A slider's value is data, a splitter's value is layout, and the two are announced differently. |
| Never mirror drag position into a live region. | A 120Hz drag emits roughly 120 announcements per second and floods the speech queue. |

### Where this specimen differs from what ships

The visual, the sizing and the key map are the product's. Five things are corrected, and each one is a defect in the shipped component rather than a design choice.

| Shipped | Here | Why |
|---|---|---|
| `role="separator"` on the track, `tabindex="0"` on the handle | Both on the handle | A focusable element with no role announces as a plain group. |
| `aria-orientation` set to `layout` | Set to the boundary's own axis | A vertical layout draws a horizontal line, so it should report horizontal. |
| No `aria-valuemin`, `aria-valuemax` or `aria-label` | All three present | A value with no bounds and no name cannot be acted on. |
| One `prevSize` shared by every gutter in a splitter | Per gutter | With three panels both boundaries otherwise announce the same number. |
| Separate mouse and touch listeners | Pointer events | The touch path calls a method that does not exist, so touchend throws. |

</template>

</PageTabs>
