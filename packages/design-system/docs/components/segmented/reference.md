# Segmented reference

Every prop, event and rendered attribute, with what it resolves to. For the model, see [Overview](/components/segmented.md). For how to apply it, see [Usage](/components/segmented/usage.md).

Measured values are taken inside the interface, where the root font size comes from a setting that defaults to 14.

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `modelValue` | `T` | yes | none | The selected value, bound with `v-model`. A call site without it raises a missing prop warning |
| `label` | `string` | yes | none | The accessible name of the group. Rendered into a span that the group references |
| `options` | `unknown[]` | yes | none | One button per entry, in array order. An empty array renders the group box with no buttons |
| `hideLabel` | `boolean` | no | `false` | Swaps the label span class from `text-caption` to `sr-only`. The text stays in the DOM |
| `optionLabel` | `string` | no | `undefined` | The field of an option holding its text. Unset uses the option itself, which stringifies an object |
| `optionValue` | `string` | no | `undefined` | The field of an option holding its value. Unset emits the option object and compares it deeply |
| `fluid` | `boolean` | no | `false` | Makes the wrapper full width and gives each button an equal share of the row |
| `disabled` | `boolean` | no | `false` | Disables the buttons in the group. There is no per option equivalent |

The generic parameter defaults to `string`. It is inferred from the bound model rather than from `options`, which is instantiated as `unknown[]`.

## Events

| Event | Payload | Declared |
|---|---|---|
| `update:modelValue` | `T`, the resolved option value | Yes, through the model definition |
| `change` | `{ event: Event, value: T }` | No. A listener passes the forwarded attribute filter and reaches the control underneath, which declares the emit |

Clicking the option that is already selected returns before either event, because the underlying empty behaviour is fixed off.

## Slots

| Slot | Content |
|---|---|
| none | The template holds no slot element, and the control underneath is rendered self closing, so its own option slot stays empty. Children passed to the component render nothing |

## Sizes and severities

| Axis | Accepted |
|---|---|
| `size`, `severity`, `variant` | Not props. Neither of the two shared unions is imported |
| `fluid` | `false`, `true` |
| `hideLabel` | `false`, `true` |

## Geometry

| Part | Value |
|---|---|
| Wrapper | Column flex container, 4px gap, full width when `fluid` |
| Label span | Caption role: 12px text on a 16px line box at a 14px root, weight 400, colour inherited from the call site |
| Group box | 1px transparent border, 6px radius, 31px tall, no padding, no background |
| Group width | Content width plus 2px in a flex parent, and the parent width in a block parent |
| Button box | 29px tall, from 6px of vertical padding and a 17px line box. 16px of horizontal padding |
| Button border | Width 0. The group sets the border style to none |
| Button radii | 6px on the outer corners of the first and last buttons, 0 on the inner ones |
| Button label | 14px inherited, weight 500, line height normal, centred |
| Selection pill | 4px from the left and top, 3px from the right and bottom, 4px radius, behind the label |
| Transition | All properties, 200ms |
| Component height | 51px with a visible label, 31px with a hidden one |

The pill offsets come from the 4px spacing step, while its size subtracts half a rem, which is 7px at a 14px root. That leaves the pill 22px tall in a 29px button and 94px wide in the 101px Markdown button.

## States

| State | Property | Token |
|---|---|---|
| Button surface, any state | `background-color` | `surface-page` |
| Selected | `color` and the pill fill | `fg-strong` over `surface-raised` |
| Unselected | `color`, transparent pill | `fg-subtle` |
| Hover, unselected and enabled | `color`, leaving the background alone | `fg-strong` |
| Focus visible | `outline`, 2px at 2px offset | `line-focus`, from the interface wide focus rule |
| Disabled, whole group | `opacity`, pointer events, cursor | `opacity-disabled`, resolving to 0.6 |
| Invalid | Unreachable. The preset branch exists, and neither a prop nor an attribute reaches it | |

## Rendered DOM

```html
<div class="flex flex-col gap-1">
  <span id="{id}-label" class="text-caption">Description view</span>
  <div id="{id}" role="group" aria-labelledby="{id}-label">
    <button type="button" aria-pressed="true" data-p-checked="true">
      <span><span>Markdown</span></span>
    </button>
    <button type="button" aria-pressed="false" data-p-checked="false">
      <span><span>Raw</span></span>
    </button>
  </div>
</div>
```

## ARIA

| Attribute | Element | Value |
|---|---|---|
| `role="group"` | Group div | Fixed by the control underneath |
| `aria-labelledby` | Group div | The id of the label span |
| `id` | Group div | The caller's `id` attribute when it is a string, otherwise a generated id |
| `id` | Label span | The group id followed by `-label` |
| `aria-pressed` | Each button | Whether that option equals the model |
| `disabled` | Each button | The `disabled` prop |
| `data-p-checked`, `data-p-disabled`, `data-pc-name`, `data-pc-section` | Buttons, group and inner spans | Stamped by the component library from the state and the section |

Absent from the output: `role="radiogroup"`, `role="radio"`, `aria-checked`, a managed `tabindex`, and `aria-disabled` on the group. Each button is a native tab stop and the arrow keys are unhandled.

## Attributes

| Attribute | Outcome |
|---|---|
| `data-*`, `aria-*`, `name`, `form` | Forwarded to the group div |
| `aria-labelledby` | Forwarded, then overwritten by the component's own binding |
| `on[A-Z]` listeners | Forwarded to the control underneath |
| `id` | Taken by the component and used as the group id and the stem of the label id |
| `class`, `style`, `pt`, `unstyled` | Dropped. Attribute inheritance is off and the filter admits none of them |
| `invalid`, `multiple`, `dataKey`, `optionDisabled` | Dropped. None is a prop of this component |

The filter is the shared allow-list described in [component reference](/foundations/components/reference.md#what-the-api-accepts).
