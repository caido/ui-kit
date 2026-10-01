# Select reference

Every prop, event, attribute and measurement, for both wrappers. For the model, see [Overview](/components/select.md). For how to apply it, see [Usage](/components/select/usage.md).

Measurements are taken at a 14px root, which is what the application pins from the interface text size setting.

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `label` | `string` | yes | none | Text of the `<label>` bound to the control with `for`. On a single select it is not the accessible name |
| `options` | `unknown[]` | yes | none | One row per entry, in array order. An empty array renders the untranslated empty message |
| `hideLabel` | `boolean` | no | `false` | Swaps the label class from `text-fg-default` to `sr-only`. The element, its text and its `for` stay in the DOM |
| `optionLabel` | `string \| undefined` | no | `undefined` | Key of the option field holding its text. Unset stringifies the option |
| `optionValue` | `string \| undefined` | no | `undefined` | Key of the option field holding its value. Unset emits the option object |
| `optionGroupLabel` | `string \| undefined` | no | `undefined` | Key of the group field holding its heading. Turns the list into grouped mode |
| `optionGroupChildren` | `string \| undefined` | no | `undefined` | Key of the group field holding its rows. Passed together with `optionGroupLabel` |
| `placeholder` | `string \| undefined` | no | `undefined` | Shown in `fg-muted` when the model is null or undefined. Unset renders a non-breaking space |
| `multiple` | `boolean` | no | `false` | Swaps the single-choice control for the multi-choice one. Changes the element tree, the height and the ARIA wiring |
| `filter` | `boolean` | no | `false` | Adds a search box to the overlay header, matching on `contains` |
| `size` | `CSelectSize` | no | `"small"` | `small` or `large`. Neither value changes a pixel in this build |
| `fluid` | `boolean` | no | `false` | Adds `w-full` to the wrapper. The forwarded prop behind it paints nothing |
| `invalid` | `boolean` | no | `false` | Gates `message` and `aria-describedby`. Paints the border on `multiple` only |
| `message` | `string \| undefined` | no | `undefined` | Validation caption under the control. Renders only when `invalid` is also true |
| `disabled` | `boolean` | no | `false` | Adds the disabled fill, `opacity-disabled`, `select-none`, `pointer-events-none` and `cursor-default` |
| `modelValue` | `unknown` | no | `undefined` | Declared with a model definition, so `v-model` is the route in. Untyped in both directions |

The props type carries a generic parameter, and the component instantiates it without one, so `T` resolves to `unknown` and no inference flows from `options` to the model.

## Events

| Event | Declared | Payload |
|---|---|---|
| `update:modelValue` | yes | `unknown` |
| `change` | yes, as `[value: unknown]` | `{ originalEvent: Event, value: unknown }`, forwarded verbatim from the library |
| `focus`, `blur`, `show`, `hide`, `before-show`, `before-hide`, `filter` | no | The library payload. A template listener compiles to an `on[A-Z]` attribute and passes the filter |
| `selectall-change` | no | Unreachable. The component fixes the toggle-all control off |

## Slots

| Slot | Content |
|---|---|
| none | The template holds no slot element and the library control is rendered with no children, so its own `value`, `option`, `optiongroup`, `header`, `footer`, `empty`, `dropdownicon` and `chip` slots stay empty |

## Sizes

| Value | Label padding | Trigger height |
|---|---|---|
| `small` | 6px top and bottom, 8px left | 31px |
| `large` | 6px top and bottom, 8px left | 31px |

`CSelectSize` is `Extract<Size, "small" \| "large">`, so `medium` from the shared union is removed and passing it fails typecheck. The two accepted values render identically, because the library declares no size prop on either control, the preset reads it as undefined, and the value falls through to the DOM as a literal `size` attribute on a `div`.

## Severities

None. The component imports no severity union and declares no severity prop. The one tonal state is `invalid`, and on a single select it changes no pixel.

## DOM

Single select, with the library internal hidden spans left out.

| Position | Element | Notes |
|---|---|---|
| root | `<div>` | `flex flex-col gap-1 text-body`, plus `w-full` when `fluid`. Carries no caller attribute |
| 1 | `<label for>` | `text-fg-default`, or `sr-only` when `hideLabel` |
| 2 | `<div data-pc-name="select">` | The preset. Caller `data-*`, `aria-*`, `name` and `form` land here, as does the literal `size` attribute |
| 2.1 | `<span role="combobox">` | Carries the caller id, `tabindex`, and the label, value or placeholder text |
| 2.2 | `<div>` with a 14px chevron | The dropdown block |
| 3 | `<span id="{id}-message">` | `text-caption text-fg-danger`, when `invalid` and `message` are both set |

The overlay is portalled to the document body and exists only while open: an optional filter header, a scrolling list container, a `<ul role="listbox">`, one `<li role="option">` per row, and polite live regions for the row count and the current selection.

With `multiple` the root becomes `<div data-pc-name="multiselect">`, the focusable element becomes a readonly `<input role="combobox">` inside a visually hidden container, the visible text moves into two nested `<div>` elements, and each option row gains a 20px checkbox.

## ARIA

| Attribute | On | Written when |
|---|---|---|
| `for` | the label | always, including when `hideLabel` makes the label `sr-only` |
| `aria-describedby` | the library root `<div>` | `invalid` and `message` are both set |
| `aria-label` | the combobox, single select | a caller forwards one, or a value or a placeholder supplies the text. With none of the three it is undefined |
| `aria-label` | the combobox, `multiple` | a caller forwards one. The component passes none, so the `<label for>` supplies the name by default |
| `aria-invalid` | the combobox, `multiple` | `invalid` is true |
| `aria-invalid` | the combobox, single select | never. The library binds it on an editable branch this component does not use |

`role="combobox"`, `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"`, `role="option"`, `aria-selected`, `aria-setsize`, `aria-posinset` and the live regions all come from the library.

`aria-describedby` is bound to the library root rather than to the focusable element, so the element a keyboard reaches has no description, and the component's own test reads the attribute off that root.

## Attributes

The filter is the single expression `/^(data-|aria-|on[A-Z])|^(id|name|form)$/`, minus `id`, which the component consumes. `defineOptions` sets `inheritAttrs: false`.

| Shape | Result |
|---|---|
| `data-*` | bound to the library control, which merges it onto its own root |
| `aria-*` | bound to the library control, which merges it onto its own root. `aria-label` and `aria-labelledby` are declared props there, so each is read as a prop and written onto the combobox instead |
| `on[A-Z]` listener | bound to the library control |
| `name`, `form` | bound to the library control, which puts them on a `div`, where they do nothing |
| `id` | consumed, then used as the combobox id and the label `for` target |
| `aria-describedby` | deleted. The component binds its own after the forwarded set, and an undefined value removes the key |
| `class`, `style`, `pt` | dropped. Nothing reaches the DOM. Three tests pin these |
| any other name | dropped |

## Geometry

| Part | Single | Multiple |
|---|---|---|
| Wrapper gap | 4px | 4px |
| Trigger height | 31px | 34px |
| Border and radius | 1px `line-strong`, 6px | 1px `line-strong`, 6px |
| Text inset from the trigger edge | 9px | 9px |
| Chevron block | 30px wide | 48px wide |
| Option row | 30px | 36px |
| Block with a label | 55px | 58px |
| Block with a hidden label | 31px | 34px |
| Block with a label and a message | 75px | not measured |

| Overlay part | Value |
|---|---|
| Surface | `surface-page` behind a 1px `line-default` border, radius 6px |
| Shadow | none. The preset puts `shadow-md` on the overlay, and that class computes to `box-shadow: none` in the running application |
| Minimum width | the outer width of the trigger, set inline when it opens |
| List cap | 196px, set inline by the library and beating the preset class |
| List padding | 4px around the list. The rows step 4px apart on a single select and 2px on `multiple` |
| Option padding | 8px top and bottom, 12px left and right, radius 6px |
| Group heading | 36px tall, `fg-muted`, weight 600 |
| Filter header | 8px top, 8px left and right on a single select and 16px on `multiple` |

## Colour

| State | Border | Background | Text |
|---|---|---|---|
| resting | `line-strong` | `surface-page` | `fg-strong` |
| hover, single | `fill-secondary` | `surface-page` | `fg-strong` |
| hover, multiple | `line-strong`, unchanged | `surface-page` | `fg-strong` |
| placeholder showing | `line-strong` | `surface-page` | `fg-muted` |
| invalid, single | `line-strong`, unchanged | `surface-page` | `fg-strong` |
| invalid, multiple | `line-danger` | `surface-page` | `fg-strong` |
| disabled | `line-strong` | `surface-disabled` at 0.6 | `fg-strong` through the opacity |
| `multiple` with an empty array bound | `line-strong` | `surface-page` | transparent |

| Overlay row | Background | Text |
|---|---|---|
| resting | none | `fg-default` |
| keyboard focus | `surface-hover` | `fg-default` |
| selected | `surface-selected` | `fg-strong` |
| focused and selected | `surface-hover` | `fg-strong` |
| empty message | none | `fg-strong` |

Colour changes run through a 200ms transition on both triggers.

## CDropdown

A separate wrapper over the same library control, with no label, no message and no attribute filter.

| Prop | Type | Required | Default |
|---|---|---|---|
| `options` | `T[]` | yes | none |
| `modelValue` | `NonNullable<T> \| undefined \| null` | yes | none |
| `optionLabel` | `((option: T) => string) \| undefined` | no | `undefined` |
| `optionDisabled` | `((option: T) => boolean) \| undefined` | no | `undefined` |
| `dataKey` | `string \| undefined` | no | `undefined` |
| `filter` | `boolean` | no | `false` |
| `filterPlaceholder` | `string \| undefined` | no | `undefined` |

| Slot | Payload |
|---|---|
| `value` | `{ value: T, placeholder: string }` |
| `option` | `{ option: T, index: number }` |
| `footer` | none |

| Event | Payload |
|---|---|
| `update:modelValue` | `NonNullable<T>` |

The generic parameter is declared on the script block, so `T` is inferred from the call site here. Attribute inheritance is left on and the single root is the library control, so `class`, `placeholder`, `disabled`, `checkmark`, `aria-label` and a pass-through styling object all reach it without being declared. There is no `label` prop, no `message`, no `invalid`, no `size` and no multi-choice mode.

## Call sites

| `CSelect`, counted by parsing each opening tag | Call sites |
|---|---|
| `label`, `options` | 7 |
| `fluid`, `optionLabel`, `optionValue` | 6 |
| `placeholder`, `id` | 4 |
| `hideLabel` | 3 |
| `disabled`, `change`, the option group pair | 1 |
| `multiple`, `filter`, `size`, `invalid`, `message` | 0 |

| `CDropdown`, counted the same way | Call sites |
|---|---|
| `options` | 13 |
| `optionLabel`, `aria-label` written by hand | 12 |
| `class` | 11 |
| A slot | 6 |
| `placeholder` and `disabled`, neither declared | 4 |
| `filter` | 3 |
| `checkmark`, undeclared | 2 |
| `dataKey`, `filterPlaceholder`, a pass-through styling object | 1 |

`CSelect` has a spec file of eight cases. `CDropdown` has none.
