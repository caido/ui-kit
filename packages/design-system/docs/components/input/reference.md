# Input reference

Every prop, event, attribute and measurement. For the model, see [Overview](/components/input.md). For how to apply it, see [Usage](/components/input/usage.md).

Measurements are taken at a 14px root, which is what the application pins from the interface text size setting. At the 16px root of the unauthenticated screen the same three fields measure 33.5px, 45.5px and 62px.

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `label` | `string` | yes | none | Text of the `<label>` bound to the field with `for`. Omitting it is a type error |
| `hideLabel` | `boolean` | no | `false` | Swaps the label class from `text-fg-default` to `sr-only`. The element, its text and its `for` stay in the DOM |
| `placeholder` | `string \| undefined` | no | `undefined` | Bound to the native `placeholder`. Painted `placeholder:text-fg-muted` by both presets |
| `multiline` | `boolean` | no | `false` | Renders a `<textarea>` instead of an `<input>`, adds `resize-none`, binds `rows` and drops `type` |
| `rows` | `number` | no | `3` | Bound only when `multiline` is true. The one height control a textarea has |
| `size` | `CInputSize` | no | `"small"` | `small` or `large`. Changes single-line padding and height. Inert on a textarea |
| `fluid` | `boolean` | no | `false` | Adds `w-full` to the wrapper, and to the field on a single-line input only |
| `invalid` | `boolean` | no | `false` | Writes `aria-invalid`, swaps the border for `line-danger`, drops the hover border and gates `message` |
| `message` | `string \| undefined` | no | `undefined` | Validation caption under the field. Renders only when `invalid` is also true |
| `required` | `boolean` | no | `false` | Native `required`. Draws no asterisk and writes no `aria-required` |
| `disabled` | `boolean` | no | `false` | Native `disabled`. Adds the disabled fill, `opacity-disabled`, `select-none`, `pointer-events-none` and `cursor-default` |
| `readonly` | `boolean` | no | `false` | Native `readonly`, plus `border-transparent caret-transparent` written by the component |
| `type` | `CInputType` | no | `"text"` | Bound only when `multiline` is false |
| `modelValue` | `string` | no | `""` | Declared with `defineModel`, so `v-model` is the route in |

## Events

| Event | Payload |
|---|---|
| `update:modelValue` | `string` |

No other event is declared. A native listener reaches the field as a forwarded attribute instead.

## Slots

None. The template holds no `<slot>` element, the rendered field is given no children, and text written between the tags is discarded. There is no default, prefix, suffix, icon or message slot.

## Sizes

| Value | Padding | Field height | Block height |
|---|---|---|---|
| `small` | 6px vertical, 8px horizontal | 31px | 55px |
| `large` | 12px vertical, 14px horizontal | 43px | 67px |

`CInputSize` is `Extract<Size, "small" \| "large">`, so `medium` from the shared union is removed and passing it fails typecheck. On a textarea the value reaches the DOM as a bare `size` attribute and changes no pixel, because the library's textarea declares no `size` prop and the preset reads it as undefined.

## Severities

None. The component imports no `Severity` and declares no `severity` prop. The only tonal state is the boolean `invalid`, which paints `line-danger` and, with a message, `fg-danger` text. There is no success, warn, info or contrast appearance.

## Input types

`CInputType` is `"text" | "password" | "email" | "number" | "url"`. `search`, `tel`, `date` and `file` are not in the union. The prop is bound straight onto the library component and falls through onto the element, overriding the `type="text"` the library hardcodes in its own render. A `type` attribute written by a caller is dropped instead, because `type` matches no shape in the filter.

## DOM

| Position | Element | Class |
|---|---|---|
| root | `<div>` | `flex flex-col gap-1 text-body`, plus `w-full` when `fluid` |
| 1 | `<label :for="fieldId">` | `text-fg-default`, or `sr-only` when `hideLabel` |
| 2 | `<input>` or `<textarea>` | The preset, plus `resize-none` when `multiline` and `border-transparent caret-transparent` when `readonly` |
| 3 | `<span :id="${fieldId}-message">` | `text-caption text-fg-danger`, when `invalid` and `message` are both set |

The root carries no id, no role and no ARIA. The field id is the caller's `id` attribute when it is a string, and Vue's `useId` otherwise. The class attribute on the field lists each preset class twice, because the library merges two paths that resolve to the same preset.

## ARIA

| Attribute | On | Written when |
|---|---|---|
| `for` | label | always, including when `hideLabel` makes the label `sr-only` |
| `aria-invalid` | field | `invalid` is true |
| `aria-describedby` | field | `invalid` and `message` are both set |
| `aria-label` | nowhere | never. The accessible name comes from the `<label>` |
| `aria-required` | nowhere | never. `required` reaches the DOM as the native attribute only |
| `role` | nowhere | never |

`aria-describedby` is bound after the forwarded attributes, so it overwrites a caller's value when there is a message and removes the attribute when there is not.

## Attributes

The filter is the single expression `/^(data-|aria-|on[A-Z])|^(id|name|form)$/`, applied by `useForwardedAttrs` through `useControlAttrs`. `defineOptions` sets `inheritAttrs: false`, so nothing from the caller reaches the root element.

| Shape | Result |
|---|---|
| `data-*` | bound to the field |
| `aria-*` | bound to the field |
| `on[A-Z]` listener | bound to the field |
| `name`, `form` | bound to the field |
| `id` | consumed, then bound to the field and to the label `for` |
| `class`, `style`, `pt` | dropped. Nothing reaches the DOM |
| any other name | dropped |

`onUpdate:modelValue` matches the listener shape but never double-forwards, because Vue strips a declared emit from the attribute bag before the filter sees it. The spec pins the three named drops.

## Geometry

| Part | Value |
|---|---|
| Root gap | 4px, `gap-1` |
| Root type | 14px on a 20px line box, weight 400 |
| Label line box | 20px |
| Hidden label | 1px square, absolute, clipped, out of flow |
| Field radius | 6px |
| Field border | 1px, at every state including `readonly` |
| Single-line content box | 17px, floored to one line box by the browser |
| Textarea row | 14px, so the height is `rows` multiplied by 14 plus 14 |
| Message | 12px on a 16px line box |
| Intrinsic width without `fluid` | 174px |

| Configuration | Field | Block |
|---|---|---|
| default | 31px | 55px |
| `hideLabel` | 31px | 31px |
| `invalid` with `message` | 31px | 75px |
| `size="large"` | 43px | 67px |
| `multiline` with `rows="3"` | 56px | 80px |
| `multiline` with `rows="10"` | 154px | 178px |

## Colour

| State | Border | Background | Text |
|---|---|---|---|
| resting, single-line | `line-default` | `surface-page` | `fg-strong` |
| resting, multiline | `line-strong` | `surface-page` | `fg-strong` |
| hover | `line-strong` | `surface-page` | `fg-strong` |
| focus-visible | transparent | `surface-page` | `fg-strong` |
| invalid | `line-danger` | `surface-page` | `fg-strong` |
| disabled | `line-default` | `surface-disabled` at 0.6 | `fg-strong` through the opacity |
| readonly | transparent | `surface-page` | `fg-strong` |
| placeholder showing | as resting | `surface-page` | `fg-muted` |

Colour changes run through `transition-colors duration-200`. The resting difference between the two field kinds comes from the presets: the inputtext preset writes `border-line-default` and the textarea preset writes `border-line-strong`.

The preset draws no focus ring beyond `focus:z-10`. An application stylesheet gives a focused element a 2px `line-focus` outline at a 2px offset, then pulls it onto the boundary for an `input` and a `textarea` by setting the border colour to transparent and the offset to zero.

## Call sites

Counted by parsing each tag to its closing bracket, across the application package and the workflow editor package.

| Prop | Call sites |
|---|---|
| `label`, `fluid` | 41 |
| `v-model` | 40 |
| `id` | 32 |
| `placeholder` | 30 |
| `multiline`, `rows` | 16 |
| `hideLabel` | 10 |
| `required`, `disabled` | 6 |
| `invalid`, `readonly` | 4 |
| `@blur`, `type` | 2 |
| `size`, `message`, `class` | 0 |

One workflow node field passes no `v-model`, so the model stays at the empty default. Each of the 16 multiline call sites passes `rows="10"`.
