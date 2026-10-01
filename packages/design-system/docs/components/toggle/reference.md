# Toggle reference

Every prop, event and attribute `CToggle` accepts, and what it renders. For what the component decides, see [Overview](/components/toggle.md). For how to write one, see [Usage](/components/toggle/usage.md).

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `modelValue` | `boolean` | Yes | none | The state, bound with `v-model` or with `:model-value` and a handler. Declared with `required: true`, so an omitted model warns at render |
| `label` | `string` | Yes | none | The text of the label, and the accessible name. Interpolated as text, with no slot to replace it |
| `hideLabel` | `boolean` | No | `false` | Adds `sr-only` to the label. The text stays in the accessibility tree and the pairing to the input is unchanged |
| `disabled` | `boolean` | No | `false` | Disables the input, dims the switch and the label, and suppresses both hover rules |

`id` is an attribute rather than a prop. A string is taken as the input id and as the label `for`, and anything else is ignored in favour of a generated one.

`trueValue`, `falseValue`, `invalid`, `readonly`, `tabindex`, `inputClass`, `inputStyle`, `ariaLabel` and `ariaLabelledby` belong to the component library underneath and are not part of this API. The switch is on when the model is the literal `true`.

## Events

| Event | Payload | Declared |
|---|---|---|
| `update:modelValue` | `boolean`, the opposite of the current state | Yes |
| `change` | The native `Event`, emitted after the model update | No, forwarded as a listener |
| `focus` | `FocusEvent` | No, forwarded as a listener |
| `blur` | `FocusEvent` | No, forwarded as a listener |
| `click`, and any other listener | The native event, delivered on the outer element of the switch rather than on the input | No, forwarded as a listener |

A forwarded listener is untyped at the call site, so an undeclared event reaches the component library without appearing in editor completion. A disabled switch emits nothing at all: the change handler returns before emitting, a disabled input cannot take focus, and the outer element takes no pointer events.

## Slots

None. The component renders no slot of its own, so text written between its tags is discarded and the label has to go through the prop.

## Axes

None. `size`, `severity`, `variant` and `invalid` are absent from `CToggleProps` rather than narrowed inside it, so the switch is 40 by 24 pixels in every state, and the danger branch the preset carries for the track border cannot be reached through this wrapper.

## Attributes

The component sets `inheritAttrs: false` and binds an allow-list of `data-*`, `aria-*`, a listener, and the three names `id`, `name` and `form`, which is the layer contract in [What the API accepts](/foundations/components/reference.md#what-the-api-accepts).

| Passed | Destination |
|---|---|
| `data-*` | The outer element of the switch |
| A listener | Consumed as an event where the component library declares one, otherwise the outer element of the switch |
| `aria-*` | The input, merged after the attributes the component library binds, so a passed `aria-label` replaces the label as the accessible name |
| `id` | The input id, and the label `for` |
| `name`, `form` | The outer element of the switch, where neither has an effect |
| `class`, `style`, `pt`, `labelClass`, and any other name outside the allow-list, such as `trueValue`, `invalid`, `readonly`, `tabindex` or `ariaLabel` | Dropped |

## DOM

```
div          the wrapper, display flex, items centred, 8px gap
  div        the outer element of the switch, 40 by 24,
             carrying data-p-checked and data-p-disabled
    input    type=checkbox, role=switch, absolute, opacity 0, class peer
    div      the track, filling the outer element, its ::before drawing the knob
      div    the handle, with no class and nothing painting it
  label      for the input id, caption role, sr-only under hideLabel
```

The preset defines a class for the outer element, the track and the input only, so the handle stays empty and the knob that moves is the track's `::before`.

## ARIA

| Attribute | Set by the component |
|---|---|
| The accessible name | The label, paired to the input by `for` and `id` |
| `role` | `switch`, on the input |
| `aria-checked` | `true` or `false`, matching the model |
| `aria-label`, `aria-labelledby` | Absent unless a caller forwards a kebab-case attribute |
| `aria-invalid` | Absent unless a caller forwards a kebab-case attribute, since the invalid prop underneath cannot be reached |
| `aria-describedby` | Absent unless a caller forwards a kebab-case attribute. The description branch of the shared composable is unused here |
| `tabindex` | Absent, since the name sits outside the allow-list and the prop underneath cannot be reached, so the input keeps its native tab position |

## Geometry

Pixel values below are at the default interface text setting of 14. The switch does not move with that setting and the label does.

| Part | Value |
|---|---|
| Track | 40 by 24 pixels, 1 pixel border, corner 16 pixels from `rounded-2xl`, which the interface theme restores |
| Knob | 16 by 16 pixels, fully round, 4 pixels below the outer top edge in both states |
| Knob inset and travel | 5 pixels from the left edge when off, 3 pixels from the right edge when on, 16 pixels of travel between them |
| Gap, switch to label | 8 pixels, out of the layout under `hideLabel` |
| Wrapper | Display flex, block level, 24 pixels tall, as wide as its parent |
| Label | Caption role, 12 pixel type on a 16 pixel line, weight 400, no colour of its own |
| Track transition | 200ms on colour, over the 150ms [state duration](/foundations/motion.md#two-durations), on the standard curve |
| Knob transition | 200ms on the initial `ease` curve, since the preset sets a duration on the pseudo-element and no timing function |
| Reduced motion | The interface resets `transition` on elements and pseudo-elements, so the knob jumps and the fill changes at once |
| Disabled | 0.6 opacity, and `pointer-events: none` on the switch rather than on the label |
| Focus indicator | A 2 pixel `line-focus` outline at a 2 pixel offset, drawn on the track by the interface stylesheet, outer bounds 48 by 32 |

## Colours

| State | Track fill | Border | Knob |
|---|---|---|---|
| Off | `surface-subtle` | `line-strong` | `fill-neutral` |
| Off, hovered | `surface-hover` | `line-strong` | `fill-neutral` |
| On | `fill-secondary` | `transparent` | `fg-on-secondary` |
| On, hovered | `fill-secondary-hover` | `transparent` | `fg-on-secondary` |

A hover row is reached through `peer-hover` on the track, driven by the transparent input covering the whole switch, so anywhere on the switch counts. Disabled draws whichever of the two resting rows applies at 0.6 opacity and suppresses both hover rows. `fill-secondary` and `fg-on-secondary` are single values rather than light and dark pairs, so a switch that is on renders the same amber in both appearances.

## Measured contrast

Computed from the token values, converted to sRGB and put through the WCAG 2 formula. The floors are in [accessibility](/foundations/accessibility.md#aa-is-the-target-not-the-measurement).

| Pairing | Light | Dark |
|---|---|---|
| The knob on the off track | 3.43 | 3.48 |
| The knob on the off hovered track | 2.81 | 2.83 |
| The knob on the on track | 7.55 | 7.55 |
| The knob on the on hovered track | 6.22 | 7.92 |
| The border on the off track | 2.93 | 2.91 |
| The border on the page surface | 3.17 | 3.11 |
