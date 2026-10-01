# State reference

Every state, the property it owns and the token it uses. For the model, see [Overview](/foundations/states.md). For how to apply it, see [Usage](/foundations/states/usage.md).

## What each state owns

| State | Property | Token | Notes |
|---|---|---|---|
| Rest | | | The surface the component sits on |
| Hover | `background-color` | `surface-hover` | A wash where the surface carries data |
| Active | `background-image` | `fg-strong` at 20% | A wash over what is already there, so it composes with hover |
| Selected | varies by surface | see below | |
| Current | varies by surface | see below | Same treatment as selected |
| Focus | `outline` | `line-focus` | 2px, applied on `:focus-visible` for the whole interface. Offset 2px, or 0 on a bordered input, or minus 2px inside a composite widget |
| Invalid | `border-color` | `line-danger` | |
| Disabled | `opacity` | `opacity-disabled` | `0.6`, multiplies whatever is beneath |
| Locked | `color` and an icon | | A lock glyph and its tooltip |
| Loading | the content | | A skeleton or a spinner |
| Read-only | nothing | | Behaviour only |

## The states drawn

<div data-ds class="dot-grid-faint grid grid-cols-2 gap-3 rounded border border-line-subtle bg-surface-page p-6 md:grid-cols-3">
  <div class="flex flex-col gap-2">
    <span class="font-mono text-caption text-fg-muted">rest</span>
    <div class="inline-flex self-start rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default">Send</div>
  </div>
  <div class="flex flex-col gap-2">
    <span class="font-mono text-caption text-fg-muted">hover</span>
    <div class="inline-flex self-start rounded border border-line-subtle bg-surface-hover px-3 py-2 text-fg-default">Send</div>
  </div>
  <div class="flex flex-col gap-2">
    <span class="font-mono text-caption text-fg-muted">active</span>
    <div class="inline-flex self-start rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default" style="background-image: linear-gradient(color-mix(in srgb, var(--color-fg-strong) 20%, transparent), color-mix(in srgb, var(--color-fg-strong) 20%, transparent))">Send</div>
  </div>
  <div class="flex flex-col gap-2">
    <span class="font-mono text-caption text-fg-muted">focus</span>
    <div class="inline-flex self-start rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default outline-2 outline-offset-2 outline-line-focus">Send</div>
  </div>
  <div class="flex flex-col gap-2">
    <span class="font-mono text-caption text-fg-muted">invalid</span>
    <div class="inline-flex self-start rounded border border-line-danger bg-surface-raised px-3 py-2 text-fg-default">Send</div>
  </div>
  <div class="flex flex-col gap-2">
    <span class="font-mono text-caption text-fg-muted">disabled</span>
    <div class="inline-flex self-start rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default opacity-disabled">Send</div>
  </div>
</div>

Each one changes a different property, which is why any two of them can be true at once and still both be visible.

## Selected, by surface

| Surface | Identifier | Emphasis |
|---|---|---|
| Tree row | `line-selected`, a leading edge | `fg-strong` at 20%, as a wash |
| Tab | `line-selected`, on the tab border | `fg-secondary` |
| Sidebar item | `surface-selected` | `fg-secondary` |
| Table row | `line-selected`, a leading edge | `fg-strong` at 20%, as a wash |
| Menu item | `surface-selected` | `fg-strong` |

Where the background is already carrying a stripe or a colour somebody set, identification moves to an edge, and a tab moves it to an edge as well, because its border sits on the boundary with the panel it opens. Where the background is free otherwise, it carries the selection itself.

## Measured contrast

`line-selected` as an identifier, against the system surfaces a row can be:

| Behind it | Light | Dark |
|---|---|---|
| `surface-page` | 5.49 | 7.47 |
| `surface-subtle` | 5.07 | 6.97 |
| `surface-raised` | 4.58 | 6.21 |
| `surface-hover` | 4.16 | 5.67 |
| `surface-selected` | 3.81 | 5.17 |

The worst case among those is 3.81 light and 5.17 dark, both clear of the 3 to 1 an identifier owes. A colour somebody set is outside that set and is not measured here, which is why a selected row carries the wash as well as the edge.

`surface-selected` on its own measures 1.44 light and 1.44 dark against the page. On a sidebar item and a menu item, where it is the identifier, the step up in text colour carries selection with it.

## The wash

| Use | Value |
|---|---|
| Hover on a surface that carries data | `surface-hover` at 75% |
| Selected on a surface that carries data | `fg-strong` at 20% |

It is translucent so whatever is underneath, including a colour somebody set, stays visible. It composes as a layer rather than replacing the background, which is what lets hover and a user's colour both be true at once.

## Timing

| | Duration |
|---|---|
| Hover, press, focus | `duration-state`, 150ms |

A state has to feel immediate. Anything longer reads as lag rather than as feedback. See [Motion](/foundations/motion.md).

## Read-only against disabled

| | Contrast | Focusable | Selectable | Submitted with a form | Means |
|---|---|---|---|---|---|
| Read-only | Full | Yes | Yes | Yes | You may read this, not change it |
| Disabled | Dimmed | No | Not on a form control | No | This does not apply right now |

## What not to write

| Avoid | Instead |
|---|---|
| Two co-occurring states on one property | Give each its own property |
| An opacity on anything but disabled | The property that state owns |
| Removing the focus outline | An offset, if it sits wrong |
| `select-none` on a disabled row or panel | Leave selection on, so it can be read and copied |
| A click handler on a plain container | A real control, or a role with a tab stop and key handling |
| Dimming a read-only field | Nothing. Read-only has no appearance |
