# Button reference

Every prop, value and rendered attribute. For what the component is for, see [Overview](/components/button.md). For how to write one, see [Usage](/components/button/usage.md#writing-a-button). Measurements are given at the default interface text size of 14.

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `label` | `string` | Yes | none | The visible text, and the accessible name when `iconOnly` is set |
| `icon` | `string` | No | none | A FontAwesome class string rendered before the label. Replaced by the spinner while `loading` |
| `trailingIcon` | `string` | No | none | A FontAwesome class string rendered after the label. Left in place while `loading` |
| `iconOnly` | `boolean` | No | `false` | Drops the label text from the DOM and moves it to `aria-label` |
| `severity` | `CButtonSeverity` | No | `"contrast"` | Selects the fill, border and foreground tokens |
| `variant` | `CButtonVariant` | No | `"solid"` | Selects the emphasis treatment |
| `size` | `CButtonSize` | No | `"medium"` | Selects the label type role and the padding |
| `fluid` | `boolean` | No | `false` | Sets the width to 100 per cent of the parent content box |
| `loading` | `boolean` | No | `false` | Swaps the leading icon for a spinner and disables the button |
| `disabled` | `boolean` | No | `false` | Sets the native `disabled` attribute and the disabled treatment |
| `type` | `"button" \| "submit" \| "reset"` | No | `"button"` | The native button type |

## Events

The component declares no emits. Listeners arrive through the forwarded attributes and land on the native button, so the payload is the native event.

| Listener | Payload | Notes |
|---|---|---|
| `@click` | `MouseEvent` | Attached at 328 of the 371 call sites |
| `@click.stop` | `MouseEvent` | Modifiers survive forwarding, which a test pins |
| Any `on[A-Z]` listener | The native event | `@mousedown`, `@focus` and the rest forward the same way |

## Slots

The component renders no slot. Its children are fixed at an optional leading icon, an optional label span and an optional trailing icon, in that order, so a badge, a count pill or a shortcut chip cannot be placed inside a button.

## Severities

Seven values. `CButtonSeverity` is the shared `Severity` union plus `"primary"`, which this component adds.

| Severity | Solid fill and border | Solid foreground | Outlined and text foreground | Outlined border |
|---|---|---|---|---|
| `primary` | `--color-fill-primary` | `--color-fg-on-primary` | `--color-fg-primary` | `--color-fill-primary` |
| `contrast` | `--color-fill-neutral-subtle` | `--color-fg-on-neutral-subtle` | `--color-fg-muted` | `--color-line-default` |
| `secondary` | `--color-fill-secondary` | `--color-fg-on-secondary` | `--color-fg-secondary` | `--color-line-secondary` |
| `success` | `--color-fill-success-strong` | `--color-fg-on-success` | `--color-fg-success` | `--color-fill-success` |
| `info` | `--color-fill-info-strong` | `--color-fg-on-info` | `--color-fg-info` | `--color-fill-info` |
| `warn` | `--color-fill-warn-strong` | `--color-fg-on-warn` | `--color-fg-warn` | `--color-line-warn` |
| `danger` | `--color-fill-danger-strong` | `--color-fg-on-danger` | `--color-fg-danger` | `--color-fill-danger` |

The `fg-on-*` foregrounds are built against the fills in the second column, four of which carry the `-strong` step. [Colour](/foundations/colour/reference.md#measured-pairings) holds the measured pairings.

## Variants

| Variant | Background | Border | Hover |
|---|---|---|---|
| `solid` | The severity fill | 1 pixel, the colour of the fill | Fill and border move to their `-hover` step |
| `outlined` | Transparent | 1 pixel, the border token above | A background tint appears; the border does not change |
| `text` | Transparent | None. The border colour is transparent and carries no width | The same background tint as outlined |

## Geometry

| Size | Label size | Label line box | Padding | Gap |
|---|---|---|---|---|
| `small` | 12 | 14.5 | 6 top and bottom, 12 each side | 8 |
| `medium` | 14 | 17 | 8 top and bottom, 12 each side | 8 |
| `large` | 18 | 22 | 12 top and bottom, 16 each side | 8 |

Heights, in pixels:

| | `small` | `medium` | `large` |
|---|---|---|---|
| Labelled, solid or outlined | 28.5 | 35 | 48 |
| Labelled, text | 26.5 | 33 | 46 |
| Icon-only, solid or outlined | 26 | 32 | 44 |
| Icon-only, text | 24 | 30 | 42 |

An icon-only button is shorter because an icon box has a line height of 1 while a label box has a line height of normal. A text button is 2 pixels shorter and 2 pixels narrower than the other two variants, because it carries no border width. The label weight is 400 at all three sizes, and the padding is absolute pixels that do not move with the interface text setting.

Width is content driven: twice the side padding, plus twice the border width, plus the width of each child, plus 8 pixels for each gap between them. With `fluid`, the width is 100 per cent of the parent content box instead. The corner is 6 pixels on all four corners, at every size, variant and severity.

## States

| State | What changes | Value |
|---|---|---|
| Hover | Background, and the border on solid | Transitioned over 200ms on the standard curve |
| Active | A wash over the existing background | `--color-fg-strong` at 20 per cent |
| Focus | An outline drawn by the interface rather than by the component | 2 pixels of `--color-line-focus`, offset 2, on `:focus-visible` |
| Disabled | Opacity, pointer events, the native attribute | `--opacity-disabled` at 0.6, `pointer-events: none` |
| Loading | The disabled treatment, plus a spinner in place of the leading icon | `fas fa-spinner animate-spin` |

## The rendered element

One native `<button>`, with up to three children and no wrapper.

```html
<button type="button" class="c-button …" data-pc-name="button" data-p-severity="contrast">
  <i class="fas fa-plus" aria-hidden="true"></i>
  <span class="truncate">Save</span>
  <i class="fas fa-caret-down" aria-hidden="true"></i>
</button>
```

`data-p-severity` is absent when the severity is `primary`, which is translated away before it reaches the component library, so a selector written for `[data-p-severity="primary"]` matches nothing. The stable hooks are the `c-button` class, `[data-pc-name="button"]` and the scoped `data-v-` attribute the pressed wash is drawn on. The `pc<n>` attribute is a per-instance selector whose number moves with mount order.

## ARIA

| Attribute | When it is set | Value |
|---|---|---|
| `aria-label` | `iconOnly` is true | The `label` prop |
| `aria-hidden` | On each icon | `true` |
| `disabled` | `disabled` or `loading` is true | The native attribute, plus `data-p-disabled="true"` |

The component sets no `role`, no `aria-disabled`, no `aria-busy` or live region while loading, no `aria-pressed` and no `aria-expanded`.

## Forwarded attributes

The component sets `inheritAttrs: false` and binds one allow-list, `/^(data-|aria-|on[A-Z])|^(id|name|form)$/`.

| | Reaches the button |
|---|---|
| `data-*` | Yes |
| `aria-*` | Yes, except `aria-label`, which is overwritten after forwarding |
| `on[A-Z]` listeners | Yes |
| `id`, `name`, `form` | Yes |
| `class`, `style`, `title`, `tabindex`, `role` | No, dropped without a warning |
| A pass-through styling object | No |
| A class-shaped prop under another name | No |

Directives are a separate mechanism and do apply, which is why `v-tooltip` is the route to a tooltip and `title` is not.

