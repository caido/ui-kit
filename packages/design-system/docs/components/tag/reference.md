# Tag reference

Every prop, value, element and forwarded attribute on `CTag`. For what the component decides, see [Overview](/components/tag.md). For how to write one, see [Usage](/components/tag/usage.md).

Imported as `CTag` from `@proxy-frontend/components`, with the types `CTagSeverity`, `CTagCategory`, `CTagWidth` and `CTagProps`.

## Props

| Name | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `label` | `string \| number` | Yes | None | The text in the chip. An empty string renders an empty label element rather than no element |
| `icon` | `string` | No | Absent | The class string of one icon, drawn in front of the label |
| `severity` | `CTagSeverity` | No | Absent | Fills the chip from the intent ramp. Discarded when `category` is set |
| `category` | `CTagCategory` | No | Absent | Fills the chip from one accent group and adds a 1px border in that accent's line colour |
| `width` | `CTagWidth` | No | Absent | Pins the chip at a fixed width, with the label clipped to it |

## Events

| Name | Payload |
|---|---|
| None | The component declares no emits |

A listener written at the call site is forwarded as an attribute and fires from the root element.

## Slots

| Name | Rendered |
|---|---|
| None | The component passes no slot content down, so the text comes from `label` alone |

## Vocabulary

| Axis | Accepted | Default |
|---|---|---|
| `severity` | `contrast`, `secondary`, `success`, `info`, `warn`, `danger` | Absent |
| `category` | `amber`, `azure`, `fern`, `lime`, `magenta`, `rust`, `teal`, `violet` | Absent |
| `width` | `small`, `medium` | Absent |
| `variant` | Not accepted | |
| `size` | Not accepted | |

`CTagSeverity` is the shared `Severity` union unchanged, and `CTagWidth` is `Size` narrowed to its first two values. The shared axes are in [components](/foundations/components/reference.md#the-vocabulary).

## Severity colours

| Value | Background | Foreground |
|---|---|---|
| `secondary` | `bg-surface-hover` | `text-fg-default` |
| `success` | `bg-surface-success` | `text-fg-success-strong` |
| `info` | `bg-surface-info` | `text-fg-info-strong` |
| `warn` | `bg-surface-warn` | `text-fg-warn-strong` |
| `danger` | `bg-surface-danger` | `text-fg-danger-strong` |
| `contrast` | `bg-fill-neutral` | `text-fg-on-neutral` |
| Absent | None | None |

Each category writes three classes in place of those two: `bg-category-<name>-fill`, `border-category-<name>-line` and `text-category-<name>-fg`, alongside `border`. The tokens are in [colour](/foundations/colour/reference.md#category-accents).

## DOM and ARIA

| Depth | Element | Rendered | Attributes | Classes |
|---|---|---|---|---|
| 1 | `span` | Unconditionally | `data-pc-name="tag"`, `data-pc-section="root"` | `truncate`, the preset root classes, and `h-6`, `w-12`, `w-16`, `border` and the three category classes where those props apply |
| 2 | `span` | When `icon` is set | `data-pc-section="icon"` | The `icon` string, plus `mr-1 text-sm`, or plus `mr-0!` when the label is empty |
| 2 | `span` | Unconditionally | `data-pc-section="label"` | None |

The icon element is guarded, so a tag without one renders a comment placeholder in its position. The component sets `inheritAttrs: false` and `name: "CTag"`, and writes no `role` and no `aria-*` of its own, so an `aria-label` from the call site lands on the root at depth 1.

## Forwarded attributes

| Shape | Examples | Result |
|---|---|---|
| `data-*` | `data-testid`, `data-tour-step` | Reaches the root |
| `aria-*` | `aria-label`, `aria-describedby` | Reaches the root |
| `on` followed by a capital | `@click`, `@keydown` | Reaches the root |
| `id`, `name`, `form` | `id` | Reaches the root |
| `class`, `style` | `class="ml-2"` | Removed, with nothing reported |
| `title`, `role`, `tabindex` | `role="status"` | Outside the allow-list, so removed with the rest |

The filter is `useForwardedAttrs`, shared with the other components that refuse attributes, and `CTag` passes no `owns` list, so nothing is held back from the root. Directives are not attributes and are not filtered, so `v-tooltip` reaches the root the way it would on any element.

## Library sections

| Section | Preset class | Result |
|---|---|---|
| root | `text-xs font-bold inline-flex items-center justify-center py-1 rounded-md`, the side padding the preset sets in rem, and the background and foreground pair for the severity when one is set | Joined with the classes the component adds |
| icon | `mr-1 text-sm` | Replaced by `mr-0!` when an icon is set and the label is empty |
| value | `leading-normal` | Not applied, because the section the library renders for the text is named `label` |

With the `value` section unreached, the label takes its line box from `text-xs` on the root, which resolves to the caption role.

## Measurements

| Value | Where | Source |
|---|---|---|
| 24px | Height of a labelled tag at the 14px interface default | The 16px caption line box plus `py-1` twice |
| 21.72px | The same tag at the smallest text setting of 12 | The line box moves with the root |
| 26.27px | The same tag against a 16px root | The line box moves with the root |
| 35.42px | The same tag at the largest text setting of 24 | The line box moves with the root |
| 26px | Height of a category tag at the 14px default | The 1px border above and below |
| 24px | Height of a tag with an empty label and no icon | `h-6` |
| 48px | `width="small"` | `w-12` against `--spacing: 4px` |
| 64px | `width="medium"` | `w-16` against `--spacing: 4px` |
| 5.6px | Side padding at the 14px default | Set in `rem` by the preset |
| 6.4px | Side padding against a 16px root | Set in `rem` by the preset |
| 4px | Padding above and below the label | `py-1` |
| 4px | Gap between the glyph and the label | `mr-1` |
| 0px | The same gap when the label is empty | `mr-0!` |
| 6px | Corner | `rounded-md`, aliased to `--radius` |
| 600 | Label weight | `font-bold`, resolving to `--font-weight-bold` |
| 5.25 | Contrast of `text-fg-on-neutral` on `bg-fill-neutral`, in both appearances | `severity="contrast"` |

The text size setting is in [type](/foundations/type/reference.md#the-text-size-setting), and the contrast floors are in [colour](/foundations/colour.md#contrast-and-accessibility).

## Related components

| Component | Difference |
|---|---|
| `CButton` | Takes focus, fires an event and draws hover and active states, with `variant="text"` as its quietest form |
| `CToast` | Carries a severity of its own, chosen by which function is called rather than by a prop, and holds `error` where this one holds `danger` |

## Tests

| Assertion | Pinned value |
|---|---|
| A tag that reserves a width stays visible with an empty label | Computed `visibility` of `visible` |
| An icon-only tag drops the gap beside the glyph | The icon class contains `mr-0!` |
| A tag with a label keeps that gap | The icon class does not contain `mr-0!` |
