---
outline: false
pageClass: wide
---

# Tag, badge and chip

A badge reports a state the system derived, and a tag holds a value the user typed and can take away. The label carries the meaning, so colour is always the second cue and never the only one.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Status badges

Six intents. Each coloured one ships a required FontAwesome glyph, so the five states stay separable in greyscale and under all three dichromacies.

<Preview title="Intent, soft emphasis" note="label 6.60:1 min, dark gold fill">
  <DsTag label="Neutral" />
  <DsTag label="Queued" intent="info" />
  <DsTag label="Passed" intent="success" />
  <DsTag label="Expired" intent="warning" />
  <DsTag label="Dropped" intent="danger" />
  <DsTag label="Beta" intent="accent" />
</Preview>

The five silhouettes are a circled letter, a check, a triangle, a cross and a star. Read the row in greyscale and the states are still separable, which is why the glyph is required.

The soft fill is the intent ink mixed 16 percent into the canvas. That lands every chromatic fill between 1.20:1 and 1.34:1 against the page, close to where each family's own 200 rung sits.

### Solid emphasis

Soft is the default because badges arrive in quantity inside virtualised rows. Solid is rationed to counters and to one attention badge per view.

<Preview title="Solid emphasis and counters" note="text on fill 4.74:1 min">
  <DsTag label="New" intent="accent" emphasis="solid" />
  <DsTag label="Dropped" intent="danger" emphasis="solid" />
  <DsTag shape="counter" :count="3" emphasis="solid" />
  <DsTag shape="counter" :count="12" intent="accent" emphasis="solid" />
  <DsTag shape="counter" :count="248" intent="danger" emphasis="solid" />
</Preview>

A count above 99 renders as `99+`. Three digits double the badge width, and the exact number stops being actionable well before that.

### Sizes

Four sizes on one fixed 16px line box.

<Preview title="Sizes" note="16 / 20 / 24 / 28">
  <DsTag shape="counter" :count="7" emphasis="solid" />
  <DsTag label="Cached" intent="info" size="sm" />
  <DsTag label="Cached" intent="info" size="md" />
  <DsTag label="Cached" intent="info" size="lg" />
</Preview>

The `sm` badge carries no glyph, the one place the spec forbids it. A 12px glyph inside a 20px box leaves no room for the label, so an `sm` badge may only take a label that names its own state.

### HTTP method tags

A method is a classification with no judgement attached, so every method is neutral.

<Preview title="HTTP method tags">
  <DsTag label="GET" />
  <DsTag label="POST" />
  <DsTag label="PUT" />
  <DsTag label="PATCH" />
  <DsTag label="DELETE" />
  <DsTag label="OPTIONS" size="sm" />
</Preview>

Colouring `DELETE` red would say the request failed, which is a different fact carried by a different badge.

### Status code badges

An abbreviated label ships a visually hidden expansion, so a screen reader hears "Server error" rather than the three characters.

<Preview title="Status class badges">
  <DsTag label="2xx" intent="success" expansion="Success" />
  <DsTag label="3xx" intent="warning" expansion="Redirect" />
  <DsTag label="4xx" intent="warning" expansion="Client error" />
  <DsTag label="5xx" intent="danger" expansion="Server error" />
  <DsTag label="Timeout" intent="danger" />
</Preview>

### Status code chips

A chip keeps the neutral fill even when it carries an intent, because a bar of coloured fills competes with the table it filters.

<Preview title="Filter bar" note="toggle with Space or Enter">
  <DsTag shape="chip" label="2xx" intent="success" selected />
  <DsTag shape="chip" label="3xx" intent="warning" />
  <DsTag shape="chip" label="4xx" intent="warning" />
  <DsTag shape="chip" label="5xx" intent="danger" />
  <DsTag shape="chip" label="All" disabled />
</Preview>

The selected chip swaps its glyph for a check, which is the non-colour cue SC 1.4.1 requires. State travels on `aria-pressed`, never on a changed accessible name.

### Removable tags

One tab stop, arrow keys inside, and a 24 by 24 remove target. Reload the page to bring removed tags back.

<Preview title="Tag list, removable" note="one tab stop">
  <DsTag shape="tag" :values="['scope: prod', 'X-Api-Key', 'session=abc', 'utm_source']" />
</Preview>

Removal is real. Focus moves to the next remove control, then to the previous one if the tag was last, then to the list itself. The value is announced in a polite live region.

### Tag states

<Preview title="Tag states">
  <DsTag shape="tag" :values="['read only']" read-only />
  <DsTag shape="tag" :values="['removing']" loading />
  <DsTag shape="tag" :values="['bad value']" error />
  <DsTag shape="tag" :values="['field disabled']" disabled />
</Preview>

- **Read-only.** Keeps full text contrast and drops the remove control.
- **Loading.** Keeps focus and sets `aria-disabled`, so a keyboard user is not thrown out mid-removal.
- **Error.** Adds a triangle as well as a border colour, so the failure survives greyscale.
- **Disabled.** Reduces contrast and leaves the tab order.

### Verbatim values

Case is preserved exactly. The uppercase rule applies to the system enum and never to a user value.

<Preview title="Verbatim values, truncated at 24ch">
  <DsTag shape="tag" :values="['X-Api-Key', 'Content-Security-Policy-Report-Only', 'user=%7B%22id%22%3A1%7D']" />
</Preview>

### Row highlights

Nine fills mark a request row, and the same nine appear as coloured dots in the menu that sets them. They are not intents: a highlight is a mark the user chose, so it never stands in for a state the system derived.

The token name is stored data. Caido persists the literal string `--c-highlight-color-red` in request metadata, so a fill can never be renamed or re-pointed at something legible, whatever a theme needs.

Dark ships one value per colour and it does both jobs. Paper cannot, because a fill pale enough to sit under body ink is far too pale to read as a dot, so `--c-highlight-swatch-*` was split off as a second set the fills feed nothing into.

<Swatches
  caption="Paper row fills. The row keeps body ink, so every fill stays inside 1.07:1 to 1.54:1 of the canvas."
  :tokens="[
    { name: '--c-highlight-color-red', hex: '#FBD1CA', job: 'row fill' },
    { name: '--c-highlight-color-orange', hex: '#F6C390', job: 'row fill' },
    { name: '--c-highlight-color-yellow', hex: '#EEE183', job: 'row fill' },
    { name: '--c-highlight-color-green', hex: '#A8DEAC', job: 'row fill' },
    { name: '--c-highlight-color-cyan', hex: '#5ED8EA', job: 'row fill' },
    { name: '--c-highlight-color-blue', hex: '#DBE8FC', job: 'row fill' },
    { name: '--c-highlight-color-pink', hex: '#F9ACCC', job: 'row fill' },
    { name: '--c-highlight-color-purple', hex: '#EEC9FB', job: 'row fill' },
    { name: '--c-highlight-color-gray', hex: '#E0E3E7', job: 'row fill' },
  ]" />

<Swatches
  caption="Paper swatch foregrounds. Icon-weight, so each one clears 5.86:1 on the canvas."
  :tokens="[
    { name: '--c-highlight-swatch-red', hex: '#A8301F', job: 'dot and icon' },
    { name: '--c-highlight-swatch-orange', hex: '#8F4207', job: 'dot and icon' },
    { name: '--c-highlight-swatch-yellow', hex: '#6B5600', job: 'dot and icon' },
    { name: '--c-highlight-swatch-green', hex: '#0F6A01', job: 'dot and icon' },
    { name: '--c-highlight-swatch-cyan', hex: '#0A5C66', job: 'dot and icon' },
    { name: '--c-highlight-swatch-blue', hex: '#00478F', job: 'dot and icon' },
    { name: '--c-highlight-swatch-pink', hex: '#992259', job: 'dot and icon' },
    { name: '--c-highlight-swatch-purple', hex: '#7D186D', job: 'dot and icon' },
    { name: '--c-highlight-swatch-gray', hex: '#4B5563', job: 'dot and icon' },
  ]" />

<Swatches
  caption="Dark, unchanged. One value per colour: the swatch token points at the fill."
  :tokens="[
    { name: '--c-highlight-color-red', hex: '#BB3829', job: 'row fill and dot' },
    { name: '--c-highlight-color-orange', hex: '#A84F08', job: 'row fill and dot' },
    { name: '--c-highlight-color-yellow', hex: '#7C6400', job: 'row fill and dot' },
    { name: '--c-highlight-color-green', hex: '#117B01', job: 'row fill and dot' },
    { name: '--c-highlight-color-cyan', hex: '#0A6C78', job: 'row fill and dot' },
    { name: '--c-highlight-color-blue', hex: '#004FAA', job: 'row fill and dot' },
    { name: '--c-highlight-color-pink', hex: '#B0286C', job: 'row fill and dot' },
    { name: '--c-highlight-color-purple', hex: '#931D80', job: 'row fill and dot' },
    { name: '--c-highlight-color-gray', hex: '#4B5563', job: 'row fill and dot' },
  ]" />

| Measurement | Paper | Dark |
|---|---|---|
| Fill against the canvas | 1.07:1 to 1.54:1 | 1.92:1 to 2.74:1 |
| Body ink on the fill | 9.22:1 min, on pink | 4.55:1 min, on green |
| Dot on the canvas | 5.86:1 min, on red | 1.92:1 min, on blue |

The paper set was not picked by eye. A luminance ladder was laid down first, then the nine hues were brute-forced over their orderings to maximise the worst-case separation under simulated dichromacy, following Viénot 1999.

| Vision | Worst-case CIE76 |
|---|---|
| Normal | 9.0 |
| Deuteranopia | 7.9 |
| Protanopia | 6.2 |

The set that this one replaced measured 2.4 in the worst case, which is below the threshold at which two fills read as the same mark.

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | | The badge, chip or single tag text. |
| `shape` | `badge` `tag` `chip` `counter` | `badge` | Selects the contract, and with it the role and keyboard map. |
| `intent` | `neutral` `info` `success` `warning` `danger` `accent` | `neutral` | Semantic tone. Every coloured intent adds its required glyph. |
| `emphasis` | `soft` `solid` | `soft` | Solid is for counters and one attention badge per view. |
| `size` | `sm` `md` `lg` | `md` | Height 20, 24 or 28px. Counters are always 16px. |
| `icon` | string | | FontAwesome class overriding the intent glyph, for example `fas fa-clock`. |
| `expansion` | string | | Visually hidden expansion for an abbreviated label. |
| `count` | number | | Counter value. Anything above 99 renders as `99+`. |
| `values` | string[] | | Tag list values, rendered verbatim. |
| `selected` | boolean | `false` | Chip only. Sets `aria-pressed` and swaps the glyph for a check. |
| `disabled` | boolean | `false` | Tag and chip only. Leaves the tab order. |
| `loading` | boolean | `false` | Tag only. Spinner in the remove control, focus retained. |
| `error` | boolean | `false` | Tag only. Adds a 2px danger border and a triangle. |
| `readOnly` | boolean | `false` | Tag only. Drops the remove control, keeps full contrast. |

### Events

| Event | Payload | Fired when |
|---|---|---|
| `remove` | the removed value | A tag's remove control is activated. |
| `update:selected` | the new pressed state | A chip is toggled. |

### Class strings

These are the classes the component applies. They work unchanged in the product.

```html

<span class="box-border inline-flex items-center justify-center align-middle whitespace-nowrap text-caption font-semibold uppercase tracking-[0.04em] min-h-xs gap-1 rounded-sm px-2 py-[3px] border bg-[color-mix(in_srgb,var(--c-info-fg)_16%,var(--c-bg-canvas))] border-info-ink text-ink">
  <i class="fas fa-circle-info w-3 shrink-0 text-center text-[12px] leading-3 normal-case tracking-normal text-info-ink" aria-hidden="true"></i>
  Cached
</span>

<span class="box-border inline-flex items-center justify-center align-middle whitespace-nowrap text-caption font-semibold uppercase tracking-[0.04em] min-h-xs gap-1 rounded-sm px-2 py-[3px] border bg-inset border-control text-ink">
  POST
</span>

<button type="button" aria-pressed="false" class="box-border inline-flex items-center justify-center align-middle whitespace-nowrap text-caption font-semibold uppercase tracking-[0.04em] min-h-xs gap-1 rounded-sm px-2 py-[3px] border cursor-pointer bg-inset border-control text-ink hover:bg-[var(--c-state-hover)] active:bg-[var(--c-state-pressed)]">
  <i class="fas fa-triangle-exclamation w-3 shrink-0 text-center text-[12px] leading-3 normal-case tracking-normal text-gold-ink" aria-hidden="true"></i>
  4xx
</button>

<span class="box-border inline-flex items-center justify-center align-middle whitespace-nowrap text-caption font-semibold uppercase tracking-[0.04em] min-h-[16px] min-w-[16px] rounded-full px-1 py-0 border-0 bg-accent text-ink-onsolid">
  <span class="tracking-normal lining-nums tabular-nums">12</span>
</span>
```

The remove control inside a tag, at its 24 by 24 target:

```html
<button type="button" aria-label="Remove X-Api-Key" class="-my-1 inline-flex h-xs w-xs shrink-0 cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent p-0 text-[12px] leading-3 text-ink-muted transition-colors duration-1 ease-standard hover:bg-[var(--c-state-hover)] hover:text-ink focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] motion-reduce:transition-none">
  <i class="fas fa-xmark" aria-hidden="true"></i>
</button>
```

The hover and pressed layers are overlays, `--c-hover-overlay` and `--c-active-overlay` in the product, composited over whichever plane sits behind the control.

Colours are role classes, never hex. `border-danger-ink` resolves per theme, so the same markup is correct in light and dark.

</template>

<template #usage>

### When to use

Decide first whether the label came from the system or the user. That one question selects badge against tag, and with it the role, the keyboard map, the truncation policy and the case policy.

| Shape | Who writes the label | Interactive | Carries intent colour |
|---|---|---|---|
| **Badge** | The system, from a closed enum | No | Yes |
| **Tag** | The user, verbatim | One remove control | No, neutral only |
| **Chip** | The system, from a closed enum | Toggles selection | Neutral fill, glyph only |
| **Counter** | The system | No | Yes, solid |

In Caido a badge is the HTTP method on a history row, the status class on a response, the severity on a finding. A tag is a scope label or a header name in a rule. A chip is a response-class filter above a table.

### Use something else when

| Situation | Use instead | Why |
|---|---|---|
| The label triggers an action or a navigation | Chip, Button or Link | A badge has no role, no focus ring and no keyboard contract. |
| The value runs past roughly 24 characters | A table cell, or a definition row | A badge that wraps has stopped being a token. |
| More than three sit on one object | A column, or a `+N` overflow | Past three, the badges bury the row's own content. |
| The state demands attention right now | Toast, or an inline banner | A badge is ambient. It does not announce and it does not queue. |
| The count belongs to a control | Counter, inside the control's accessible name | A loose number beside a button reads as unrelated text. |
| The user must edit the value | A text input with tag tokens | A tag is add or remove only. |
| The user chose the mark themselves | A row highlight | Highlights are user data, badges are derived state. |

<DoDont
  do="Cap a row at three badges plus a +N overflow."
  dont="Six badges bury the row's own content.">
  <template #do>
    <DsTag label="POST" />
    <DsTag label="4xx" intent="warning" expansion="Client error" />
    <DsTag label="Cached" intent="info" />
    <DsTag label="+3" />
  </template>
  <template #dont>
    <DsTag label="POST" />
    <DsTag label="4xx" intent="warning" expansion="Client error" />
    <DsTag label="Cached" intent="info" />
    <DsTag label="Replayed" intent="info" />
    <DsTag label="Beta" intent="accent" />
    <DsTag label="Dropped" intent="danger" />
  </template>
</DoDont>

### Intent

Six intents. Not five, not twelve. The count is forced by the colour system, which ships five chromatic families beside a 14-rung neutral ladder, each family gated for contrast against every surface a badge lands on.

| Intent | Glyph | Meaning | Example |
|---|---|---|---|
| `neutral` | none | Classification with no judgement attached | Methods, content types, user tags, counts |
| `info` | circled letter | A state the system chose, notable but not actionable | Queued, cached, replayed, imported |
| `success` | check | A completed or passing state | 2xx classes, passed checks, applied rules |
| `warning` | triangle | A degraded state the user may want to resolve | 3xx and 4xx classes, expired sessions |
| `danger` | cross | A failed or destructive state | 5xx classes, critical findings, dropped requests |
| `accent` | star | The one state the product itself highlights | New, unread, beta. One per view |

A seventh intent would need a sixth chromatic family, and an ungated family cannot meet the contrast floors below. Adobe Spectrum ships the same five semantics under different names: neutral, informative, positive, negative, notice.

Each intent is anchored on one rung, and which rung is decided by the contrast budget rather than by taste. Warning is the clearest case: the gold a Caido user recognises is `--c-secondary-300`, which measures 2.00:1 on paper and can therefore only ever be a fill.

<Swatches
  caption="Paper anchors. The rejected gold sits first, then the six a badge is allowed to draw ink with."
  :tokens="[
    { name: '--c-secondary-300', hex: '#DAA049', job: '2.00:1, fills only, never text' },
    { name: '--c-surface-900', hex: '#221F1B', job: 'neutral, 14.23:1 on the canvas' },
    { name: '--c-info-400', hex: '#2F677F', job: 'info, 5.41:1 on the canvas' },
    { name: '--c-success-400', hex: '#246B28', job: 'success, 5.67:1 on the canvas' },
    { name: '--c-secondary-400', hex: '#845712', job: 'warning, 5.43:1 on the canvas' },
    { name: '--c-danger-400', hex: '#B12F1B', job: 'danger, 5.53:1 on the canvas' },
    { name: '--c-primary-500', hex: '#A1213F', job: 'accent, 6.49:1 on the canvas' },
  ]" />

Dark keeps the rungs it always had, and none of them moved. Every alias a badge reads carries a dark value byte-identical to the literal it replaced, so the light theme cost the dark theme nothing.

<DoDont
  do="Spend accent on one badge per view."
  dont="Two accent badges cancel out and mark nothing.">
  <template #do>
    <DsTag label="Beta" intent="accent" />
    <DsTag label="Queued" intent="info" />
  </template>
  <template #dont>
    <DsTag label="Beta" intent="accent" />
    <DsTag label="New" intent="accent" />
  </template>
</DoDont>

<DoDont
  do="Keep an HTTP method neutral. It carries no judgement."
  dont="Red DELETE reads as a failed request, not a method.">
  <template #do>
    <DsTag label="DELETE" />
  </template>
  <template #dont>
    <DsTag label="DELETE" intent="danger" />
  </template>
</DoDont>

Never map an intent to a colour at the call site. A call site that picks green has bound the meaning to a hue a colour-blind user cannot read.

### Sizing

Four sizes on one fixed 16px line box. The badge type role is 12px, and 16px is the smallest box on the 4px grid that clears Arial's content area at that size.

| Size | Height | Padding block / inline | Radius | Glyph |
|---|---|---|---|---|
| `counter` | 16 | 0 / 4 | full | none |
| `sm` | 20 | 1 / 6 | 2 | forbidden |
| `md` (default) | 24 | 3 / 8 | 4 | 12 |
| `lg` | 28 | 5 / 12 | 4 | 12 |

Height arithmetic, `height = line box + (2 x padding-block) + (2 x border)`:

```
counter   16 = 16 + (2 x 0) + (2 x 0)
sm        20 = 16 + (2 x 1) + (2 x 1)
md        24 = 16 + (2 x 3) + (2 x 1)
lg        28 = 16 + (2 x 5) + (2 x 1)
```

Padding-block is derived from the height token and the line box, never designed. It is whatever centres the text, so odd values are correct.

| Value | Rule | Evidence |
|---|---|---|
| Height 24, `md` | The dense floor, and the smallest removable tag | Carbon extra-small, Primer extra-small control at 1.5rem, Spectrum `component-height-75: 24px` |
| Height 28, `lg` | Lines up with the toolbar controls beside it | Primer small control at 1.75rem |
| Height 20, `sm` | Fits inside a 24px virtualised row | A 24px badge would touch the row's top and bottom edges |
| Height 16, counter | The counter floor | Material 3 `md-comp-badge large-size: 16px` |
| Radius 2 and 4 | Radius scales with the box: 20px and below take 2, 24 and 28 take 4 | Spectrum raises `corner-radius-small` from 3px to 6px across its sizes |
| Counter radius full | The counter is a pill, not a rounded box | At 16px tall a 4px corner reads as a rounding error |
| Remove control radius 2 | Concentric arcs: inner radius is the outer radius minus the 2px inset | Reusing 4px makes the arcs non-concentric and the corner reads as pinched |
| Focus ring radius 6 | The same formula outward: control radius plus ring offset | Keeps the ring concentric with the control it marks |
| Border 1px, fixed across emphasis | The only part whose contrast survives a hovered or selected row | A badge must not change width when its intent changes |
| Counter border 0 | A solid fill carries its own 3:1 | 1px would consume 12.5 percent of a 16px box |
| Glyph 12px | The sanctioned exception to the 16 / 20 / 24 icon ladder | A 16px glyph in a 24px box outweighs a 12px label. Spectrum and Primer both ship 12px glyphs |
| Gap 4px | A glyph belongs to its own label more tightly than a badge to its neighbours | Tag-to-tag gap is 8px, with a 4px wrapping row gap |
| Tag max-width `24ch` | Authored in `ch`, because the UI font size is user-adjustable | A px cap clips more text at every step the user increases it |
| Counter min-width 16 | Equal to its height | One digit renders as a circle, two stretch into a pill, with no second token |

Hold one badge size across a row or a filter bar. Mixed sizes read as ranked importance that the data never claimed.

### States

Interactive state lives on the remove control and on the chip. A badge is static text in a box, so hover, press, focus, disabled and selected all describe something it cannot do.

| State | Tag container | Remove control | Chip |
|---|---|---|---|
| **default** | `bg-inset`, `border-control`, `text-ink` | glyph `text-ink-muted` | as tag |
| **hover** | not applicable | Hover overlay, and the glyph darkens to `text-ink` | Hover overlay over the chip fill |
| **pressed** | not applicable | Pressed overlay | Pressed overlay |
| **focus-visible** | list only, one ring | 1px ring, no offset | 1px ring on the container |
| **disabled** | `bg-disabled`, `border-separator`, `text-ink-faint` | native `disabled` | as tag |
| **loading** | unchanged | spinner, `aria-disabled`, focus retained | not applicable |
| **error** | 2px danger border plus a triangle | unchanged | not applicable |
| **selected** | not applicable | not applicable | `bg-selected` plus a check glyph |

The glyph darkening on hover is not decoration. `text-ink-muted` rests at 4.79:1 on paper and 4.74:1 in dark, but on the dark hover plane it falls to 2.73:1, so the class flips to `text-ink` and recovers 5.08:1.

Loading uses `aria-disabled`, never `disabled`, which drops the element from the tab order and loses the keyboard user's position. GitHub Primer states the same contract: spinner, `aria-disabled`, focus preserved.

<DoDont
  do="Keep a read-only tag's text at full contrast."
  dont="Greying it out hides a value the user must read.">
  <template #do>
    <DsTag shape="tag" :values="['scope: prod']" read-only />
  </template>
  <template #dont>
    <DsTag shape="tag" :values="['scope: prod']" disabled />
  </template>
</DoDont>

Never build the disabled state from opacity. Opacity multiplies against whatever sits behind the tag and lands at a different contrast on a canvas, a card and a selected row.

### Accessibility

| Part | Role | Required ARIA |
|---|---|---|
| Badge | none, it is text | none |
| Badge with an abbreviated label | none | The expansion in visually hidden text |
| Counter attached to a control | none | The number inside the control's accessible name |
| Decorative glyph | none | `aria-hidden="true"` |
| Tag list | `list`, a `<ul>` | none. A roving `tabindex` makes it one tab stop |
| Remove control | `button` | Name "Remove {value}", plus `aria-disabled` while loading |
| Chip | `button` | `aria-pressed="true"` or `"false"` |
| Removal announcement | `status`, polite | One shared region per list, not one per tag |

A badge takes no role at all. `role="status"` would make it a live region, so every re-render of a virtualised table would announce itself.

A chip is a toggle button, so the WAI-ARIA Authoring Practices rule applies verbatim: the accessible name must not change when the state changes. Renaming "4xx" to "4xx selected" duplicates what `aria-pressed` already says.

The tag list is a composite widget, so it is one tab stop with arrow keys inside, per the APG. Twenty tags would otherwise cost twenty `Tab` presses to cross.

| Key | Context | Action |
|---|---|---|
| `Tab` | Outside the list | Moves into the list, onto the last-focused remove control |
| `Shift + Tab` | Inside the list | Moves out of the list to the previous tab stop |
| `Right` / `Left` | Inside the list | Moves to the next or previous remove control. Does not wrap |
| `Home` / `End` | Inside the list | Moves to the first or last remove control |
| `Space` / `Enter` | Remove control, chip | Activates the button, per the APG Button pattern |
| `Delete` / `Backspace` | Remove control focused | Removes the tag |
| `Escape` | Inside the list | Moves focus off the remove control and onto the list itself |

Removing a tag destroys the focused element, so focus is placed by hand: the next remove control, then the previous one, then the list itself. Focus must never fall to `<body>`, because the next `Tab` then restarts from the top of the document.

| Part | Criterion | Measured |
|---|---|---|
| Label on its own fill | SC 1.4.3 sets 4.5:1, and 12px semibold misses the large-text exemption | 10.92:1 min on paper, 6.60:1 min in dark |
| Solid fill under its own text | The same 4.5:1, since the label is still 12px semibold | 5.41:1 min on paper, 4.74:1 min in dark |
| Border, against the canvas | SC 1.4.11, the badge boundary is a meaningful graphic | 5.41:1 to 6.49:1 on paper, 3.97:1 to 6.54:1 in dark |
| Glyph inside a badge | SC 1.4.11, not 1.4.3: the glyph is `aria-hidden` and duplicates the label | 4.31:1 min on paper, 3.31:1 min in dark |
| Remove control glyph, resting | SC 1.4.3, it is the control's only visible content | 4.79:1 on paper, 4.74:1 in dark |
| Focus ring | SC 1.4.11 and SC 2.4.13 are separate measurements and both apply | 14.23:1 on paper, on the outer band; 12.46:1 in dark, on the inner |
| Disabled tag ink | SC 1.4.3 exempts it. The exemption permits illegibility, the system does not | 4.62:1 on paper, 3.38:1 in dark |
| Selected chip | SC 1.4.1 Use of Color, Level A, requires a non-colour cue | The check glyph is the cue |

Two figures in that table are known limits rather than passes. The soft glyph reaches only 3.31:1 in dark on accent, and solid accent under `text-ink-onsolid` reaches 3.14:1, both because `--c-primary-500` in dark is a fixed literal the light theme was forbidden to move.

Neither limit strands a reader, because the glyph repeats the label and the solid accent badge is rationed to one per view. Use the soft emphasis when an accent badge has to be read at a glance in dark.

The focus ring is themed rather than fixed. A single value that satisfied both themes would have to clear a near-white canvas and a near-black one, so the token is resolved per theme instead.

The remove control is 24 by 24 CSS px, meeting SC 2.5.8 outright rather than through the spacing exception. In a wrapping filter bar that exception is unavailable, because neighbouring tags sit within 24px of each other. That is why a removable tag is never smaller than `md`.

<DoDont
  do="Name the state in the label, colour second."
  dont="A bare dot says nothing in greyscale or to a screen reader.">
  <template #do>
    <DsTag label="Dropped" intent="danger" />
  </template>
  <template #dont>
    <span class="inline-block h-3 w-3 rounded-full bg-danger-ink"></span>
  </template>
</DoDont>

Never put the two most consequential opposed states on red and green alone. That is the one axis colour-blind users cannot resolve, which is why GitHub ships themes that move it to orange and blue.

### Content

| Rule | Why |
|---|---|
| **Badge labels are a closed enum**, 12 characters at most | Past 12 characters an uppercase label becomes a wall |
| **Badge labels are uppercase** with `0.04em` tracking | Uppercase removes word-shape recognition, affordable because the label is short |
| **Never uppercase a user value** | Header names, cookies, hostnames and hashes are case-sensitive bytes |
| **Tags are verbatim**: no trimming, case folding or Unicode normalisation | Silent rewriting is a correctness bug in a tool whose purpose is faithful traffic |
| **Isolate bidirectional text** in a tag | A right-to-left value otherwise reorders the text around it, which here is an attack surface |
| **No sentences, no verbs, no trailing punctuation** | A badge names a state: "Dropped", not "Request was dropped" |
| **Numerals are tabular** | Lining tabular figures stop a column of counters from jittering as values change |
| **Localise state words, never protocol tokens** | "Draft" translates. `GET`, `4xx` and `HTTP/2` do not, in any locale |
| **Truncate tags, never badges** | A badge label is an enum you control. One that does not fit is wrong |
| **Truncate a URL in the middle** | The discriminating bytes in `/api/v2/users/1234/profile` sit in the middle |
| **Reserve tracking headroom**: ship `0.04em`, leaving `0.08em` | SC 1.4.12 lets a user stylesheet add `0.12em`, and badges are the most width-constrained text |

<DoDont
  do="Render a user value exactly as the traffic carried it."
  dont="Uppercasing X-Api-Key makes it a different byte string.">
  <template #do>
    <DsTag shape="tag" :values="['X-Api-Key']" />
  </template>
  <template #dont>
    <DsTag shape="tag" :values="['X-API-KEY']" />
  </template>
</DoDont>

Write badge labels as the shortest unambiguous noun: "Cached", "Dropped", "Beta", "5xx". Keep one state on one string and one intent, product-wide.

Never use `title` as the only recovery for a truncated tag. It does not appear on touch, does not appear on keyboard focus, and is not reliably announced.

</template>

</PageTabs>
