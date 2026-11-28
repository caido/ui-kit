# Card reference

Every prop, slot, element and forwarded attribute on `CCard`. For what the component decides, see [Overview](/components/card.md). For how to place one, see [Usage](/components/card/usage.md).

Imported as `CCard` from `@proxy-frontend/components`.

## Props

| Name | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `padded` | `boolean` | No | `false` | Adds `p-4` to the body region. The header and footer regions are unaffected |

## Slots

| Name | Rendered | Wrapper classes |
|---|---|---|
| `default` | Unconditionally | `flex-1 min-h-0`, plus `p-4` when `padded` is set |
| `header` | When the slot is supplied | `border-b-4 border-surface-page h-12 flex items-center` |
| `footer` | When the slot is supplied | `border-t border-line-subtle` |

The header and footer wrappers are guarded by `v-if`, so an absent slot renders no element and no rule.

## Events

| Name | Payload |
|---|---|
| None | The component declares no emits |

A listener passed at the call site is forwarded as an attribute and fires from the root element.

## Vocabulary

| Axis | Accepted |
|---|---|
| `severity` | Not accepted |
| `variant` | Not accepted |
| `size` | Not accepted |
| `width` | Not accepted |

The shared axes in [components](/foundations/components/reference.md#the-vocabulary) do not apply to this component. Sizing comes from the parent element.

## DOM and ARIA

| Depth | Element | Attributes | Classes |
|---|---|---|---|
| 1 | `div` | `data-pc-name="card"`, `data-pc-section="root"` | `size-full flex flex-col shadow-md bg-surface-raised text-fg-strong`, with the 0.25rem corner the preset writes |
| 2 | `div` | `data-pc-section="body"` | `size-full` |
| 3 | `div` | `data-pc-section="content"` | `size-full` |
| 4 | `div` | None | `size-full flex flex-col` |
| 5 | `div` | None | The header, body and footer wrappers listed under Slots, in that order |

The component sets `inheritAttrs: false` and `name: "CCard"`. It writes no `role` and no `aria-*` of its own, so an `aria-*` attribute from the call site lands on the root at depth 1 and nothing is redirected inwards.

## Forwarded attributes

| Shape | Examples | Result |
|---|---|---|
| `data-*` | `data-testid`, `data-tour-step` | Reaches the root |
| `aria-*` | `aria-label`, `aria-describedby` | Reaches the root |
| `on` followed by a capital | `@click`, `@keydown` | Reaches the root |
| `id`, `name`, `form` | `id` | Reaches the root |
| `class`, `style` | `class="h-full"` | Removed, with nothing reported |
| `title`, `tabindex`, `role` | `role="region"` | Outside the allow-list, so removed with the rest |

The filter is `useForwardedAttrs`, shared with the other components that refuse attributes. `CCard` passes no `owns` list, so nothing is held back from the root. Directives are not attributes and are not filtered, so `v-tooltip` on a `CCard` reaches the root.

## Library sections

| Section | Preset class | Class after `CCard` applies its own |
|---|---|---|
| root | `flex flex-col shadow-md bg-surface-raised text-fg-strong`, with a 0.25rem corner | The same, with `size-full` added |
| body | `flex flex-col gap-4 p-6` | `size-full` |
| content | `p-0` | `size-full` |
| header, caption, title, subtitle, footer | Defined in the preset | Not rendered, because `CCard` passes only the content slot down |

The pass-through merge spreads the component value over the preset value, so a section named by both keeps the component value alone.

## Measurements

| Value | Where | Source |
|---|---|---|
| 48px | Header band height | `h-12` against `--spacing: 4px` |
| 4px | Strip under the header | `border-b-4 border-surface-page` |
| 1px | Rule above the footer | `border-t border-line-subtle` |
| 16px | Body padding when `padded` is set | `p-4` |
| 0 | Body padding by default | No padding class on the body wrapper |
| 3.5px | Corner at the 14px interface default | The 0.25rem corner the preset writes |
| 4px | Corner measured against a 16px root | The 0.25rem corner the preset writes |
| `none` | Computed `box-shadow` on a rendered card | `shadow-md`, with no shadow token defined to resolve it |

The system radius of 6px is in [space](/foundations/space/reference.md#radius). The surface step behind the card is in [depth](/foundations/depth.md#two-positions-not-a-ladder).

## Related components

| Component | Difference |
|---|---|
| `CWell` | Paints `surface-page` rather than `surface-raised`, separates its regions with 1px `line-subtle` rules, and scrolls its own body |
| `CDialog` | A raised surface that floats over the page, with its own widths and a close control |

## Tests

| Assertion | Pinned value |
|---|---|
| The header carries the same strip as a table header | `border-bottom-width` of 4px, and a colour matching `border-b-4 border-surface-page` |
| The header height | 48px |
| The footer rule | `border-top-width` of 1px |
