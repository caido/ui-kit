# Checkbox reference

Every prop, event and attribute `CCheckbox` accepts, and what it renders. For what the component decides, see [Overview](/components/checkbox.md). For how to write one, see [Usage](/components/checkbox/usage.md).

## Props

The component is generic over `T`, which defaults to `boolean`.

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `modelValue` | `T` | Yes | none | The value, bound with `v-model` or with `:model-value` and a handler. In group mode it has to be an array |
| `label` | `string` | Yes | none | The text of the label, and the accessible name. Plain text, with no slot to replace it |
| `hideLabel` | `boolean` | No | `false` | Clips the label to a single pixel and leaves it in the accessibility tree. The label is positioned absolutely, so the row collapses to the width of the box and the 8 pixel gap goes with it |
| `fluid` | `boolean` | No | `false` | Fills the available width and allows the label to truncate |
| `value` | `unknown` | No | `undefined` | Switches the control into group mode. Tested with `isPresent`, so `false` and `0` count as present |
| `trueValue` | `unknown` | No | `true` | Binary mode. Compared with strict equality for checked-ness, and emitted when checking |
| `falseValue` | `unknown` | No | `false` | Binary mode. Emitted when unchecking |
| `description` | `string` | No | `undefined` | Renders a caption paragraph below the row and points `aria-describedby` at it |
| `indeterminate` | `boolean` | No | `false` | Draws a dash in place of the tick and reports a mixed state. Does not set the native indeterminate property |
| `disabled` | `boolean` | No | `false` | Disables the input, dims the box and the label, and suppresses every hover rule |
| `readonly` | `boolean` | No | `false` | Blocks the change in script. Renders identically to an enabled checkbox |
| `name` | `string` | No | `undefined` | Lands on the input as its name attribute |

`id` is an attribute rather than a prop. A string is taken as the input id, and anything else is ignored in favour of a generated one.

## Events

| Event | Payload | Declared |
|---|---|---|
| `update:modelValue` | `T`. In binary mode `trueValue` or `falseValue`, in group mode a new array | Yes |
| `change` | The native `Event` | No, forwarded as a listener |
| `focus` | `FocusEvent` | No, forwarded as a listener |
| `blur` | `FocusEvent` | No, forwarded as a listener |
| `update:indeterminate` | `boolean`, emitted once when a click clears the internal mixed state | No, forwarded as a listener |
| `click`, and any other listener | The native event, delivered on the root element rather than on the input | No, forwarded as a listener |

A forwarded listener is untyped at the call site, so an undeclared event reaches the component library without appearing in editor completion.

## Slots

None. The component renders no slot of its own, so text written between its tags is discarded and the label has to go through the prop.

## Axes

None. `size`, `severity`, `variant` and `invalid` are absent from the type rather than narrowed, so the box is 20 by 20 pixels in every state and the danger branches the preset carries cannot be reached through this wrapper.

## Attributes

The component sets `inheritAttrs: false` and binds an allow-list of `data-*`, `aria-*`, a listener, and the three names `id`, `name` and `form`, which is the layer contract in [What the API accepts](/foundations/components/reference.md#what-the-api-accepts).

| Passed | Destination |
|---|---|
| `data-*` | The root element |
| A listener | The root element |
| `aria-*` | The input |
| `id` | The input id, and the label `for` |
| `name` | The input, through the declared prop |
| `form` | The root element, where it has no effect |
| `class`, `style`, `pt`, `labelClass`, `inputClass` | Dropped |
| `binary`, `variant`, `tabindex`, `required` | Dropped |

## DOM

```
div          the wrapper, 4px column gap, w-full under fluid
  div        the row, 8px gap, items centred
    div      the root, 20 by 20, carrying data-p-checked, data-p-indeterminate and data-p-disabled
      input  type=checkbox, absolute, opacity 0, class peer
      div    the painted box, holding the tick or the dash
    label    for the input id, caption role, sr-only under hideLabel
  p          the description, rendered only when the prop is set
```

## ARIA

| Attribute | Set by the component |
|---|---|
| The accessible name | The label, paired to the input by `for` and `id` |
| `aria-describedby` | Only when `description` is set, pointing at the paragraph |
| `aria-checked` | Set to `mixed` while the control is internally indeterminate |
| `aria-hidden` | On the dash icon, which carries no label of its own |
| `role` | None. The native input carries the implicit checkbox role |
| `aria-invalid` | Never emitted |
| `tabindex` | Never emitted, so the input keeps its native tab position |

## Geometry

Pixel values below are at the default interface text setting of 14. Spacing and the box do not move with that setting, and the type and the tick do.

| Part | Value |
|---|---|
| Box | 20 by 20 pixels, 1 pixel border, 6 pixel radius |
| Gap, box to label | 8 pixels |
| Gap, row to description | 4 pixels |
| Height | 20 pixels, or 40 with a one-line description |
| Label | Caption role, 12 pixel type on a 16 pixel line, weight 400 |
| Description | Caption role, in `fg-subtle` |
| Tick | 0.875rem square, 12.25 pixels at the default setting |
| Dash | Inherited font size and inherited colour, since the preset icon styling does not reach it |
| Transition | 200ms on colour, over the 150ms [state duration](/foundations/motion.md#two-durations), on the standard curve |
| Focus indicator | A 2 pixel `line-focus` outline at a 2 pixel offset, drawn on the box |

## Colours

| State | Border | Fill |
|---|---|---|
| Unchecked | `line-default` | `surface-page` |
| Unchecked, hover | `line-default`, the token it already carries | `surface-page` |
| Checked | `fill-secondary` | `fill-secondary` |
| Checked, hover | `fill-secondary-hover` | `fill-secondary-hover` |
| Indeterminate | `line-default` | `surface-page` |

Disabled draws whichever pair applies at 0.6 opacity, and read-only draws it unchanged. `fill-secondary` and `fg-on-secondary` are single values rather than light and dark pairs, so a checked box renders the same amber in both appearances.

## Measured contrast

Computed from the token values, converted to sRGB and put through the WCAG 2 formula. The floors are in [accessibility](/foundations/accessibility.md#aa-is-the-target-not-the-measurement).

| Pairing | Light | Dark |
|---|---|---|
| The tick on the checked fill | 7.55 | 7.55 |
| The tick on the checked hover fill | 6.22 | 7.92 |
| The unchecked border on the page surface | 2.06 | 2.04 |
| The unchecked border on a raised surface | 1.72 | 1.70 |
