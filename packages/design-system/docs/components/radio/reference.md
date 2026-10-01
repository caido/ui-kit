# Radio reference

Every prop, event and attribute `CRadio` accepts, and the markup it renders. For the model, see [Overview](/components/radio.md). For how to apply it, see [Usage](/components/radio/usage.md).

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `modelValue` | `T`, defaulting to `string` | Yes | | Bound with `v-model`. Checked where it is not null and equals `value`, so `undefined` and `null` both render unchecked |
| `label` | `string` | Yes | | The words beside the circle, rendered as the text of the `<label>` |
| `value` | `unknown` | Yes | | The value this option selects. Typed `unknown` rather than to the model's type |
| `name` | `string` | No | `undefined` | The native radio group key, written to `<input name>` |
| `hideLabel` | `boolean` | No | `false` | Adds `sr-only` to the label, keeping its text and its `for` |
| `disabled` | `boolean` | No | `false` | Sets `<input disabled>` and adds `opacity-disabled` to the label |

`T` types the model alone. The declaration is `defineModel<T>({ required: true })`, so a model typed `T | undefined` fails typecheck.

## Events

| Event | Payload | Declared on the component |
|---|---|---|
| `update:modelValue` | `T`, the `value` of the option activated | Yes, through `defineModel` |
| `change` | `Event` | No, arriving through the listener branch of the forwarding filter |
| `focus` | `FocusEvent` | No, same route as `change` |
| `blur` | `FocusEvent` | No, same route as `change` |

`update:modelValue` is not emitted while `disabled`, and not emitted when the activated option is already checked, since the browser fires no change event in that case.

## Slots

The template holds no `<slot>` element of any kind, so content written between the tags renders nothing. The label comes from the `label` prop.

## Sizes and severities

`size`, `severity`, `variant` and `invalid` are not props here, and none of them is forwardable, so the preset branch for an invalid radio cannot fire. The component varies over state rather than over an axis: checked, unchecked, hover, focus-visible and disabled.

## Markup

```html
<div class="flex items-center gap-2">
  <div data-pc-name="radiobutton" data-pc-section="root" data-p-checked data-p-disabled>
    <input data-pc-section="input" type="radio" id value name checked disabled />
    <div data-pc-section="box"><div data-pc-section="icon"></div></div>
  </div>
  <label for="[id of the input]">[label]</label>
</div>
```

| Element | Job |
|---|---|
| Wrapper `div` | Holds the circle and the label 8 pixels apart, and receives nothing from the caller |
| Library root `div` | The 20 by 20 box carrying forwarded `data-*`, listeners and `form` |
| `input` | The real control, at zero opacity, filling the root |
| Box `div` | The circle on screen, 20 by 20, `rounded-full` |
| Icon `div` | The dot, 12 by 12, empty |
| `label` | Rendered on every pass, carrying `for` against the input's `id` |

## Accessibility

| | Value |
|---|---|
| Role | The implicit `radio` of `<input type="radio">` |
| Accessible name | The native `for` association with the rendered label |
| `id` | Generated per instance, or the caller's `id` when one is passed |
| `role="radiogroup"` | Not written by the component and not written at any call site |
| `aria-labelledby`, `aria-label`, `aria-invalid` | Absent by default, since the component passes none of them and `invalid` cannot be reached, though a forwarded `aria-*` attribute lands on the input |
| Group behaviour | Native, and present where the options share a `name` |
| Pointer target | 20 by 20 for the circle, plus the label where it is visible |

## Attribute forwarding

| Shape | Where it lands |
|---|---|
| `id` | Taken by the component, used on the input and on the label's `for` |
| `aria-*` | The `input` |
| `data-*` | The library root `div` |
| `on[A-Z]` listeners | The library root `div`, which is the circle rather than the wrapper |
| `name` | Passed as a prop, reaching `<input name>` |
| `form` | The library root `div`, where it associates nothing |

The filter is the pattern `/^(data-|aria-|on[A-Z])|^(id|name|form)$/` and the component sets `inheritAttrs: false`, so `class`, `style`, `pt`, `labelClass`, `title`, `tabindex`, `role`, `readonly`, `binary`, `variant`, `inputClass` and `inputStyle` reach no element. A test in the component layer pins that for `class`, `labelClass` and `pt`.

## Geometry

| | Value |
|---|---|
| Circle | 20 by 20 pixels |
| Dot | 12 by 12 pixels |
| Gap from circle to label | 8 pixels |
| Circle border | 1 pixel, `rounded-full` |
| Label type | `text-caption`, rendering 12 pixels over 16 at the interface default |
| Focus ring | 2 pixels at a 2 pixel offset, 28 pixels across at its outer edge |
| Transition | 200ms on the border and the dot, from the preset rather than the motion tokens |

The circle, the dot and the gap come off `--spacing`, which is 4 pixels and holds still at every interface text setting. The label is the part that moves, since a type role is written in `rem`.

## Colour by state

| State | Circle border | Circle fill | Dot |
|---|---|---|---|
| Unchecked | `line-default` | none | hidden |
| Unchecked, hovered | `line-strong` | none | hidden |
| Checked | `fill-primary` | `fill-primary` | `surface-page` |
| Disabled, unchecked | `line-default` | `surface-subtle` | hidden |
| Disabled, checked | `line-default` | `surface-subtle` | `fill-neutral` |

Hovering a checked circle changes nothing, since the preset gates its hover rules on the option being unchecked. The label takes no colour class of its own and inherits `fg-strong` from the interface root, with `opacity-disabled` at `0.6` over it while disabled.

## Measured contrast

Computed from the resolved token values rather than quoted from the accepted pairings file.

| Pairing | Light | Dark |
|---|---|---|
| Checked circle against the page | 7.00 | 1.98 |
| Dot against the checked circle | 7.00 | 1.98 |
| Unchecked border against the page | 2.06 | 2.04 |
| Hovered border against the page | 3.16 | 3.11 |
| Disabled dot against `surface-subtle` | 3.43 | 3.49 |
| Disabled border against `surface-subtle` | 1.91 | 1.90 |
| Label against the page | 16.08 | 12.45 |
| Label at `opacity-disabled`, flattened | 4.43 | 5.45 |
| Focus ring against the page | 10.72 | 8.90 |

## What not to write

| Avoid | Instead |
|---|---|
| A `class` or a margin on the component | The gap on the parent stack |
| A set whose options carry no shared `name` | The same `name` on each of them |
| A `value` of a different type from the model | The same type on both, checked by hand |
| Text between the tags | The `label` prop |
| `@click`, or a `form` expecting an association | `@update:model-value`, and a native input where a form association matters |
| Selection as the sole difference between two rows | A second signal beside the circle |
