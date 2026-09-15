---
outline: false
pageClass: wide
---

# Card and surface

A card is a bounded surface that wraps one group of content in one elevation level, one radius, one inset and one border role. Reach for it only when the boundary is what says where the group ends.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Variants

Three of them. `panel` is `CCard`, one plane above the canvas. `inset` is `CWell`, the recess below it. `selectable` is a panel that is also a control.

<Preview stack title="Variants" note="panel · inset · selectable, all at radius 4">
  <DsCard title="Match and replace">
    <p>One plane above the canvas. No border on the root: the surface step and shadow-md carry the separation.</p>
  </DsCard>
  <DsCard variant="inset">
    <p>The recess below that plane, inside a 1px boundary.</p>
  </DsCard>
  <DsCard variant="selectable" title="Blind SSRF">
    <p>A panel that is a control, so its boundary takes the control role.</p>
  </DsCard>
</Preview>

### When a card is correct

A plain region first, the same content as a card second. Delete the box, and if nothing but decoration goes with it, there was never a card there.

<Preview stack title="Plain region beside a card" note="the box has to earn its border">
  <div class="text-body text-ink">
    <p class="!m-0 !mb-2 text-title font-semibold">Proxy status</p>
    <p class="!m-0 !text-body">Listening on 127.0.0.1:8080. Nothing here groups against a sibling, so the box would be decoration.</p>
  </div>
  <DsCard title="Proxy status">
    <p>Listening on 127.0.0.1:8080. A sibling card sits beside this one, so the boundary is what says where the group ends.</p>
  </DsCard>
</Preview>

### Header, body and footer

The root carries no padding at all. Each zone owns its own inset, which is what lets the header and footer rules run corner to corner.

<Preview stack title="Header, body and footer" note="header 48 · body inset 16 · footer 48">
  <DsCard title="Match and replace rules">
    <template #actions>
      <DsButton icon="fas fa-chevron-down" label="Collapse section" icon-only size="sm" variant="ghost" />
    </template>
    <p>Three rules are active on this project.</p>
    <template #footer>
      <DsButton label="Cancel" size="sm" />
      <DsButton label="Save" variant="primary" size="sm" />
    </template>
  </DsCard>
</Preview>

### Bar header and stacked header

A subtitle turns the bar into a stack, because a fixed bar height stops being valid at two lines.

<Preview stack title="Bar header and stacked header" note="48 tall · 72 tall">
  <DsCard title="Findings">
    <p>Bar form. One line, vertically centred in a fixed 48.</p>
  </DsCard>
  <DsCard title="Findings" subtitle="Reviewed by two people">
    <p>Stacked form. 72 = 11 + 24 + 4 + 20 + 11 + 2.</p>
  </DsCard>
</Preview>

### Nested radius

The recess is 16px inside a 4px corner, so it derives to 0. The button floats in the middle of the body, is not concentric, and keeps the control radius.

<Preview stack title="Nested radius, derived" note="root 4 · inset region 0 · floating button 6">
  <DsCard title="Response body">
    <DsCard variant="inset">
      <p class="text-code">HTTP/1.1 200 OK</p>
    </DsCard>
    <div>
      <DsButton label="Copy to Replay" size="sm" />
    </div>
  </DsCard>
</Preview>

### Density

Density moves the bar height, the inset and the stack gap. The radius, the rule width, the type role and the icon step do not move.

<Preview stack title="Density" note="compact 44 / 12 · default 48 / 16 · comfortable 52 / 20">
  <DsCard data-density="compact" title="Compact">
    <p>Bar 44, inset 12.</p>
  </DsCard>
  <DsCard title="Default">
    <p>Bar 48, inset 16.</p>
  </DsCard>
  <DsCard data-density="comfortable" title="Comfortable">
    <p>Bar 52, inset 20.</p>
  </DsCard>
</Preview>

### Data surface and flush

A data surface hands its inset to the cells. A flush card fills a splitter pane, so it drops the radius and the pane-edge borders.

<Preview stack title="Data surface body and flush modifier" note="body inset 0 · radius 0">
  <DsCard title="HTTP history" data-surface>
    <div class="text-dense">
      <div class="flex gap-3 px-4 py-1.5"><span>200</span><span>GET /api/user</span></div>
      <div class="flex gap-3 bg-subtle px-4 py-1.5"><span>403</span><span>GET /api/admin</span></div>
    </div>
  </DsCard>
  <DsCard flush title="Pane card">
    <p>Radius 0, no border on the pane edges. Focus it: the indicator moves inside and takes 3px.</p>
  </DsCard>
</Preview>

### Selectable states

Hover and press the first card, then tab into the column. Selection carries a 2px accent boundary, never the tint alone.

<Preview stack title="Selectable states" note="default · selected · error · disabled">
  <DsCard variant="selectable" title="Default">
    <p>Hover and press me.</p>
  </DsCard>
  <DsCard variant="selectable" selected title="Selected">
    <p>Tint plus a 2px accent boundary.</p>
  </DsCard>
  <DsCard variant="selectable" error title="Error">
    <p>Only inside an invalid group.</p>
  </DsCard>
  <DsCard variant="selectable" disabled title="Disabled">
    <p>Not available for interaction.</p>
  </DsCard>
</Preview>

### Choose exactly one

A radio group needs no wrapper component. Arrow keys move focus and check as they go, and they wrap at both ends.

<Preview stack title="Radio group" note="role=radiogroup · Space checks · arrows move, check and wrap">
  <div role="radiogroup" aria-label="Workflow template" class="flex w-full flex-col gap-3">
    <DsCard variant="selectable" select-mode="radio" selected title="Blank">
      <p>Start with one trigger node.</p>
    </DsCard>
    <DsCard variant="selectable" select-mode="radio" title="Convert">
      <p>Decode, transform, re-encode.</p>
    </DsCard>
    <DsCard variant="selectable" select-mode="radio" title="Match and replace">
      <p>Rewrite matching requests.</p>
    </DsCard>
  </div>
</Preview>

### Loading

Loading replaces the body content and leaves the header, the footer and the height alone, so nothing reflows when the content lands.

<Preview stack title="Loading" note="skeleton body · header and footer stay · aria-busy on the body">
  <DsCard loading title="Findings">
    <template #footer>
      <DsButton label="Export" size="sm" />
    </template>
  </DsCard>
  <DsCard variant="selectable" loading title="Installing plugin" />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `panel` `inset` `selectable` | `panel` | Elevation level, or a panel that is a control. |
| `flush` | boolean | `false` | Fills a splitter pane: radius 0, no border on the pane edges. |
| `title` | string | | The name of the group. Renders the header. |
| `subtitle` | string | | One line of qualifying detail. Turns the bar header into a stack. |
| `headingLevel` | `2` to `6` | `3` | Heading level only. Size always comes from the type role. |
| `landmark` | boolean | `false` | Renders a `section` with an accessible name, exposing a `region`. |
| `dataSurface` | boolean | `false` | Body inset goes to zero because the cells carry it. |
| `selectMode` | `checkbox` `radio` | `checkbox` | Group semantics for a `selectable` card. |
| `selected` | boolean | `false` | Checked state. Also emits `update:selected`. |
| `disabled` | boolean | `false` | Not available for interaction. |
| `loading` | boolean | `false` | Skeleton body, `aria-busy`, and `aria-disabled` on a control. |
| `error` | boolean | `false` | A 2px danger boundary. Only inside an invalid group. |

### Slots

| Slot | What goes in it |
|---|---|
| default | The body content. |
| `header` | Replaces the title and subtitle block. |
| `actions` | Icon-only controls at the end of the header bar. |
| `footer` | Actions only. Never prose. |

### Class strings

These are the classes the component applies. They work unchanged in the product.

```html

<div class="flex flex-col p-0 rounded-sm bg-raised shadow-md text-body text-ink">
  <div class="flex h-xl items-center justify-between gap-2 border-b-2 border-line pl-4 pr-2 rounded-t-sm">
    <h3 class="text-title font-semibold">Findings</h3>
  </div>
  <div class="flex flex-col gap-4 overflow-hidden p-4">Three rules are active.</div>
  <div class="flex min-h-xl items-center justify-end gap-2 border-t-2 border-line p-2 rounded-b-sm">
    Save
  </div>
</div>
```

```html

<div class="flex flex-col rounded-sm border border-line bg-inset text-body text-ink">
  <div class="border-b border-separator pl-4 pr-4 rounded-t-[3px]">Presets</div>
  <div class="p-4"></div>
</div>

<div class="relative rounded-sm border border-accent-ink bg-raised shadow-md">
  <span class="pointer-events-none absolute -inset-px rounded-sm border-2 border-accent-ink"></span>
</div>
```

Colours are role classes, never hex. `bg-raised`, `border-line` and `border-separator` resolve per theme, so the same markup is correct in light and dark.

### Geometry, default density

| Part | Height | Padding-inline | Padding-block | Radius |
|---|---|---|---|---|
| `root` | auto | **0** | **0** | **4** |
| `header`, bar | **48**, fixed | **16**, **8** on the actions side | **0**, the bar centres | **4** on the top corners |
| `header`, stacked | **72** minimum | as above | **11** top and bottom | **4** on the top corners |
| `body` | auto | **16** | **16** | 0 |
| `body`, data surface | auto | **0** | **0** | 0 |
| `footer` | **48** minimum | **8** | **8** | **4** on the bottom corners |

| Part | Border | Type role | Gap |
|---|---|---|---|
| `root`, `panel` | none. Surface step plus `shadow-md` | n/a | n/a |
| `root`, `inset` | 1px `line` on all four sides | n/a | n/a |
| `root`, `selectable` | 1px `control`, 2px `accent` when selected | n/a | n/a |
| `header`, bar | 2px `line` on `block-end`, 1px `separator` inside a well | `title` 16/24/600 | 8 between actions |
| `header`, stacked | as above | `title` plus `body` | 4 between the two lines |
| `body` | none | `body` 14/20 | 16 between children |
| `body`, data surface | none | `dense` 14/18 | 0 |
| `footer` | 2px `line` on `block-start`, 1px inside a well | `body` 14/20 | 8 between buttons |

| Token | Value | Where the value comes from |
|---|---|---|
| radius `sm` | 4 | The container radius. The preset gives Card `rounded-[0.25rem]`. |
| panel inset | 16 | The default-density panel inset. |
| icon `sm` | 16 | Carbon: 16px and 20px icons are balanced against 14px and 16px text. |
| bar height | 48 | `CCard` sets `h-12` on its header, rule included. |

### Elevation

The Classic preset gives Card `shadow-md` with no theme branch, so the same drop shadow ships in light and dark. What changes with the theme is the surface underneath: `surface-0` on `surface-100` in light, `surface-800` on `surface-900` in dark.

Nothing glows. The preset emits no shadow utility inside a `dark:` branch anywhere, so a dark card is read by its lighter surface and its rules, and a light card by the same shadow over paper.

</template>

<template #usage>

### When to use

Use a card when the adjacency of the content carries meaning: a settings section, a rule definition, a plugin entry, a request summary, a stat block.

The grouping has to survive being read out of context. Ask what is lost when the box is deleted, and drop the card when the answer is nothing.

| Situation | Use instead | Why the card is wrong |
|---|---|---|
| The region fills a splitter pane edge to edge | The `flush` modifier | A clipped corner renders as a notch, and the splitter already separates those edges. |
| The content is a table, tree or virtualised list | `dataSurface` | The container inset and the cell inset stack, and every row loses width. |
| The surface floats over content whose colour it cannot predict | Menu, popover, tooltip or Dialog | Those carry dismissal, focus trapping and placement. A card has none of it. |
| The only thing wanted is separation between two groups | 16px or 24px of stack | Atlassian: raised elevations create noise when a border or white space would do. |
| There would be exactly one card on the page | Nothing. Put the content on the page | It groups nothing and spends an inset on every axis. |
| The message is transient or advisory | Toast or inline Message | A card has no severity axis, no dismissal and no live-region semantics. |
| The whole box is one click target that opens a view | Button, link or list row | A card wrapping a button has a different keyboard contract from a button wrapping a card. |
| The box holds a read-only recess: a payload, a code block, a diff | The `inset` variant | A second panel inside a panel spends a third plane the system does not have. |

<DoDont
  align="start"
  do="The body inset drops to zero, so rows start at the cell inset."
  dont="Container and cell insets stack, so the first column starts 32px in.">
  <template #do>
    <DsCard data-surface title="HTTP history" class="w-full">
      <div class="text-dense">
        <div class="flex gap-3 px-4 py-1.5"><span>200</span><span>GET /api/user</span></div>
        <div class="flex gap-3 bg-subtle px-4 py-1.5"><span>403</span><span>GET /api/admin</span></div>
      </div>
    </DsCard>
  </template>
  <template #dont>
    <DsCard title="HTTP history" class="w-full">
      <div class="text-dense">
        <div class="flex gap-3 px-4 py-1.5"><span>200</span><span>GET /api/user</span></div>
        <div class="flex gap-3 bg-subtle px-4 py-1.5"><span>403</span><span>GET /api/admin</span></div>
      </div>
    </DsCard>
  </template>
</DoDont>

### Variants

The ladder stops at three planes. IBM Carbon publishes exactly three layer tokens above the page background, and in its White theme `layer-03` resolves back to the same value as `layer-01`.

A fourth step has no lightness headroom left that does not eat the contrast budget the text needs. The count is bounded from the interaction side too: a container is inert or it is a control, and there is no third state.

Severity is not a variant, because a red boundary plus a red inline message encodes the fact twice and the boundary is the one that cannot say why. Emphasis is not a variant either, because `raised` means in transit: a drag ghost or a sticky header. Size is a density response.

<DoDont
  align="start"
  do="A nested recess uses the inset variant and reads darker."
  dont="A nested panel repeats the fill, so nothing separates the two.">
  <template #do>
    <DsCard title="Response body" class="w-full">
      <DsCard variant="inset">
        <p class="text-code">HTTP/1.1 200 OK</p>
      </DsCard>
    </DsCard>
  </template>
  <template #dont>
    <DsCard title="Response body" class="w-full">
      <DsCard>
        <p class="text-code">HTTP/1.1 200 OK</p>
      </DsCard>
    </DsCard>
  </template>
</DoDont>

### Sizing

The header rule is subtracted from the bar, never added to it. `CCard` sets `h-12` on the header and draws the 2px rule inside it, so a 48px header sits level with a 48px toolbar beside it.

The bar is a fixed height, not a minimum, so a taller control inside it cannot push it out of alignment with its neighbours. A 32px `md` control centres with 7px of clearance, and a 24px title line box centres with 11px.

| Token | compact | default | comfortable | Invariant? |
|---|---|---|---|---|
| Bar height, header and footer | **44** | **48** | **52** | no |
| Panel inset, body and header padding | **12** | **16** | **20** | no |
| Stack gap between body children | **12** | **16** | **20** | no |
| Radius | 4 | 4 | 4 | **yes** |
| Rule width under the header | 2 | 2 | 2 | **yes** |
| Type role `title` | 16/24 | 16/24 | 16/24 | **yes** |
| Icon step | 16 | 16 | 16 | **yes** |

The arithmetic holds at every step because the ladder is additive at 4px, matching `@material/density`'s 4px interval and its `value = default + scale * interval`:

```
compact      44 = 2 + 5 + 32 + 5
default      48 = 2 + 7 + 32 + 7
comfortable  52 = 2 + 9 + 32 + 9
```

A card responds to density only when it holds a data surface or is paired with one in the same pane. Angular Material documents the same carve-out: task-based and pop-up components stay constant. A user compressing a results table wants more rows, not a tighter Confirm button.

### Nested corners

Corners are derived, never chosen: `r_inner = max(0, R_outer - p)`, where `p` is the inset between the two corners plus the parent's border width.

| Nested element | `R_outer` | `p` | `r_inner` |
|---|---|---|---|
| Header or footer fill inside a `panel`, which has no root border | 4 | **0** | **4** |
| Header or footer fill inside an `inset` well, behind its 1px border | 4 | **1** | **3** |
| An `inset` region spanning the full body inset | 4 | 16 + 0 = **16** | **0** |
| A full-width row inside the body | 4 | **16** | **0** |
| A button floating in the middle of the body | not concentric | n/a | keeps **6** |
| Focus ring at `outline-offset: 2px` | 4 | **-2** | **6** |

The formula binds only where the corners are concentric. Two concentric rounded rectangles separated by a constant band have corner arcs whose radii differ by exactly that band. Set the inner radius too high and the band pinches at 45 degrees, too low and it balloons at the corner while staying constant along the edges.

Never square off a button floating in the middle of a body. It is not concentric with the card corner, so the formula never applied to it. That is the most common overcorrection.

### States

| State | `panel` | `inset` | `selectable` |
|---|---|---|---|
| default | yes | yes | yes |
| hover, pressed, focus-visible | **no** | **no** | yes |
| selected, selected plus hover | **no** | **no** | yes |
| disabled | **no** | **no** | yes |
| loading | yes | yes | yes |
| error | **no** | **no** | yes, inside an invalid group |
| read-only | **not applicable** | **not applicable** | **not applicable** |

A hover response is a promise that something will happen on click. A static container makes no such promise, so a hover tint on it is a phantom affordance, and every later hover cue is trusted less.

Read-only never applies, because read-only describes a value the user can read but not edit, and a card holds no value. Mark the fields read-only instead, which keeps them at full contrast.

State layers composite the theme's on-colour over the surface at a fixed alpha. The alpha ladder is one ramp and the colour flips with the theme, because an overlay's effect is proportional to the distance between the overlay and the base. White at 8 percent over a light surface measures 1.015:1.

| Layer | α | Light | Dark |
|---|---|---|---|
| hover | 0.08 | 1.161:1 | 1.260:1 |
| focus | 0.10 | 1.207:1 | 1.326:1 |
| selected | 0.12 | 1.261:1 | 1.406:1 |
| pressed | 0.14 | 1.309:1 | 1.498:1 |
| dragged | 0.16 | 1.363:1 | 1.577:1 |

Selected plus hover is its own decided value, not an accident of stacking. Carbon ships `layer-selected-01`, `layer-selected-hover-01` and `layer-selected-disabled` as three separate tokens. Compositing hover on top of selected instead lands at α 0.20, past the ladder's solved ceiling of 0.16, where the deepest ink tokens drop below the 4.590:1 text floor.

<DoDont
  align="start"
  do="Selection adds a 2px accent boundary that clears 3:1."
  dont="Tint alone measures 1.261:1, a fifth of the 3:1 required.">
  <template #do>
    <DsCard variant="selectable" selected title="Active scan" class="w-full">
      <p>Sends probe requests.</p>
    </DsCard>
  </template>
  <template #dont>
    <div class="relative w-full rounded-sm border border-solid border-control bg-raised shadow-md text-body text-ink">
      <span class="pointer-events-none absolute inset-0 rounded-sm bg-ink opacity-[0.12]"></span>
      <div class="relative z-10 flex h-xl items-center border-0 border-b-2 border-solid border-line px-4 text-title font-semibold">Active scan</div>
      <div class="relative z-10 p-4">Sends probe requests.</div>
    </div>
  </template>
</DoDont>

The border steps from 1px to 2px rather than only changing colour, so the cue survives greyscale and a laptop panel viewed at an angle. WCAG 2.2 SC 1.4.11 asks 3:1 for anything identifying the state of a component. The step is drawn as a ring over the border box, so selecting a card never moves it by a pixel.

Loading keeps the header, the footer and the height, so nothing in the surrounding layout reflows. The body carries `aria-busy="true"`, so the state reaches the accessibility tree and not only the pixels. A loading control takes `aria-disabled` and a no-op handler, never the `disabled` attribute. Primer: avoid disabling buttons because it makes them inaccessible to keyboard users.

Skeleton bars use the product's own treatment, `bg-surface-200 dark:bg-surface-700` under `animate-pulse`, which is what keeps them visible against both canvases. Motion stops under `prefers-reduced-motion: reduce`.

### Accessibility

A `panel` or `inset` card is a `div`. It gets no role, no `tabindex` and no ARIA. Promote it to `section` with `landmark` only when the group is a destination a user navigates to, because a page of eight landmarks is worse than none.

Heading level and heading size are independent axes. The level comes from document structure, which is SC 1.3.1, and the size comes from the type role. Coupling them produces either a skipped level or a wrong size, depending on where the card was dropped.

| Group semantics | Role | Required ARIA |
|---|---|---|
| Choose exactly one | `radio` inside a `radiogroup` | `aria-checked`, roving `tabindex`, a labelled group |
| Choose any number | `checkbox` | `aria-checked`, `tabindex="0"` on every card |
| Activate to navigate or open | A real `a` or `button` around the title only | Native semantics, nothing added |

A card that is a control contains no other interactive element. Nested interactive content is invalid, and the inner control is unreachable because the outer element consumes the focus stop. If the design needs both, make the title a link and leave the card inert.

| Key | Action |
|---|---|
| `Tab` | Moves into and out of a radio group, landing on the checked radio or the first one. |
| `Space` | Checks the focused radio, or toggles the focused checkbox. |
| `Right`, `Down` | Moves focus to and checks the next radio. Wraps to the first. |
| `Left`, `Up` | Moves focus to and checks the previous radio. Wraps to the last. |

There is no `Enter` binding on either pattern. A card that also activates on `Enter` is emulating a button while telling a screen reader user it is a radio.

| Focus rule | Why |
|---|---|
| Every ring is `:focus-visible`, never `:focus`. | `:focus` fires on pointer press, leaving a ring that reads as selection. |
| The ring is a 1px band on the border box, no offset. | Matches the shipped preset geometry, `focus:ring-1` with `focus:outline-offset-0`. |
| Ring radius is 4 + 2 = 6, derived by `outline-offset`. | A pseudo-element ring does not derive it, so its corners cut into the card. |
| A flush card takes the inset indicator: 3px at offset -3. | It cannot spend 4px outside its border box. SC 2.4.13 needs 3px inset to pass. |
| Clipping lives on the body. The root never clips. | `overflow: hidden` on the root clips the ring of the first and last focusable child. |

A one-tone ring would have to satisfy `Y >= 3(Yb + 0.05) - 0.05` and `Y <= (Yb + 0.05)/3 - 0.05` at once, and that intersection is empty.

| Part | Pair | Floor | Criterion |
|---|---|---|---|
| `title` and body text | ink on raised | **4.590:1** | SC 1.4.3. Body type is 14px, so the large-text carve-out applies to nothing. |
| `subtitle`, metadata, counts | muted ink on raised | **4.590:1** | SC 1.4.3. Muted is not exempt; it is text. |
| Header and footer rule | line on raised | **exempt** | SC 1.4.11 exempts a divider. Target APCA Lc 15 for discernibility. |
| `selectable` boundary | control on raised **and** on canvas | **3.060:1** | SC 1.4.11. Score the token against every surface it can meet. |
| Selected indicator | accent on raised | **3.060:1** | SC 1.4.11 state indicator. The tint at 1.406:1 does not qualify. |
| Focus ring | best of two against the surface below | **3.060:1** | SC 1.4.11 and SC 2.4.13 |
| Header action icons | icon on raised | **3.060:1**, or **4.590:1** with status | Carbon: status icons pass the same ratio as typography. |
| Disabled card | any | **exempt** | SC 1.4.11 exempts components not available for interaction. |

### Content

| Slot | Rule | Consequence of breaking it |
|---|---|---|
| `title` | Sentence case, no terminal punctuation, one line. Truncate with an ellipsis, never wrap. | A wrapping title turns a bar header into a stack, and the height changes as the splitter is dragged. |
| `subtitle` | One line that qualifies the title. Never repeats it, never carries the only instruction. | The only instruction ends up at muted contrast in the line users skip. |
| Header count or status | Type role `caption` at 12/16, muted, in the form "3 of 47". | Below 12px, APCA treats the size as unsafe for fluent reading. |
| `body` | Prose at 14/20. Data surfaces at 14/18. Long-form at 16/24, in onboarding and doc panes only. | Chrome set in the long-form role reads as content, and the hierarchy collapses. |
| `body`, empty | One line saying what would be here, plus at most one action. Never an empty box. | An empty bordered box reads as a loading failure, and users wait for nothing. |
| `footer` | Actions only. Never prose, never a legal notice, never a link into the body. | Prose under a rule reads as a caption, and it is the last thing scanned. |
| `footer` order | The primary action sits outermost, at the end of the reading direction. | Two primaries means the card is asking two questions. |
| `actions` | Icon-only, labelled, three at most. Above three, collapse to an overflow menu. | Four unlabelled glyphs in a 48px bar push the title into truncation. |

<DoDont
  align="start"
  do="One primary action, sitting outermost in the footer."
  dont="Two primaries, so nothing says which one is the default.">
  <template #do>
    <DsCard title="Match and replace" class="w-full">
      <p>Three rules are active.</p>
      <template #footer>
        <DsButton label="Save and close" size="sm" variant="ghost" />
        <DsButton label="Save" variant="primary" size="sm" />
      </template>
    </DsCard>
  </template>
  <template #dont>
    <DsCard title="Match and replace" class="w-full">
      <p>Three rules are active.</p>
      <template #footer>
        <DsButton label="Save and close" variant="primary" size="sm" />
        <DsButton label="Save" variant="primary" size="sm" />
      </template>
    </DsCard>
  </template>
</DoDont>

Carbon on footer order: for button groups, the primary button is positioned on the outside of the set, while the secondary button is positioned inside.

</template>

</PageTabs>
