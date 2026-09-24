# Tabs reference

The props, events, slots, rendered DOM and forwarded attributes of `CTabs` and `CTab`. For what each is for, see [Overview](/components/tabs.md). For how to apply them, see [Usage](/components/tabs/usage.md).

Both are imported from `@proxy-frontend/components`, alongside the `CTabsItem` and `CTabsProps` types.

## CTabs props

| Name | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `items` | `CTabsItem<T>[]` | Yes | none | One tab button and one panel per entry, in array order |
| `indicator` | `boolean` | No | `true` | Picks the class on the active bar section |
| `value` | `T` | Yes | none | Two-way. Holds the `id` of the active item |

`T` is a generic parameter constrained to `string`, defaulting to `string`. `value` is declared with `defineModel<T>("value", { required: true })`, so the template has to supply it.

## CTabsItem

| Field | Type | Required | Used for |
|---|---|---|---|
| `id` | `T` | Yes | The tab value, the panel value, and the panel slot name |
| `label` | `string` | No | The fallback content of the shared `tab` slot, and nothing else |

## CTabs events

| Name | Template | Payload | Timing |
|---|---|---|---|
| `update:value` | `@update:value` | `T` | Emitted by the model, proxied from the library |
| `tabClick` | `@tab-click` | `T`, the `id` of the clicked item | After the model has changed |
| `tabMouseDown` | `@tab-mouse-down` | `T`, the `id` of the item | On mousedown, bound with `.stop` |

The library merges its own click handler ahead of the forwarded one, which is why the model has already moved by the time `tabClick` runs. The `.stop` modifier means a mousedown on a tab does not reach an ancestor.

## CTabs slots

| Name | Rendered | Scope | Fallback content |
|---|---|---|---|
| `tab-<id>` | Per item, checked first | `{ active }` | None |
| `tab` | Per item with no `tab-<id>` slot | `{ active, item }` | `item.label` |
| `<id>` | Per item panel, checked first | None | None |
| `panel` | Per item panel with no `<id>` slot | `{ item }` | None |
| default | Not rendered. The template has no unnamed slot | | |

`active` arrives as `undefined`. The library renders a tab body with no scope properties unless the tab is asked to render as a child, and `CTabs` does not ask.

## CTab props

| Name | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `isSelected` | `boolean` | Yes | none | Writes `data-is-selected`, and adds `border-line-selected!` to the chip |
| `label` | `string` | Yes | none | The value of the label, and the seed of the field while renaming |
| `icon` | `string` | No | `undefined` | Renders an `i` with the resolved icon classes and `mr-2` |
| `isEditable` | `boolean` | No | `false` | Two-way. Writes `data-is-editable`, and swaps the label for a field |

`isSelected` does not change the background or the foreground of either inner button.

## CTab events

| Name | Template | Payload | Timing |
|---|---|---|---|
| `update:isEditable` | `@update:is-editable` | `boolean` | Emitted by the model |
| `select` | `@select` | `MouseEvent` | On click of the label button, and on any mousedown whose button is not the left one |
| `rename` | `@rename` | `string`, the new name | On blur or Enter, after a 10ms debounce, and only when the value changed |
| `close` | `@close` | None | On click of the close button |

## CTab slots

| Name | Rendered | Scope | Position |
|---|---|---|---|
| `prefix` | When the slot is supplied | None | Between the icon and the label, inside a wrapper with `mr-1` |
| default | Not rendered. The template has no unnamed slot | | |

## Vocabulary

| Axis | `CTabs` | `CTab` |
|---|---|---|
| `size` | Not accepted | Not accepted |
| `severity` | Not accepted | Not accepted |
| `variant` | Not accepted | Not accepted |
| `disabled` | Not accepted | Not accepted |

Neither imports the shared unions in [components](/foundations/components/reference.md#the-vocabulary). The inner buttons of a `CTab` are fixed at `severity="contrast" size="small" outlined` and the default severity, and the caller's classes then set the surfaces, leaving the preset's `text-fg-muted` as the label colour.

## CTabs DOM and ARIA

| Depth | Element | Attributes | Classes |
|---|---|---|---|
| 1 | `div` | `data-pc-name="tabs"`, `data-pc-section="root"`, plus the forwarded attributes | `flex flex-col h-full min-h-0 flex flex-col` |
| 2 | `div` | `data-pc-name="tablist"`, `data-pc-section="root"` | `relative flex` |
| 3 | `div` | `data-pc-section="content"` | `overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain overscroll-y-auto [&::-webkit-scrollbar]:hidden grow bg-surface-raised` |
| 4 | `div` | `data-pc-section="tablist"`, `role="tablist"`, `aria-orientation="horizontal"` | `relative flex border-b-4 border-surface-page` |
| 5 | `button` | `role="tab"`, `type="button"`, `id`, `aria-selected`, `aria-controls`, `tabindex`, `data-p-active`, `data-p-disabled="false"` | The preset tab classes |
| 5 | `span` | `data-pc-section="activebar"`, `role="presentation"`, `aria-hidden="true"` | `z-raised block absolute h-1 -bottom-1 bg-fill-secondary`, or `hidden` |
| 2 | `div` | `data-pc-name="tabpanels"`, `data-pc-section="root"`, `role="presentation"` | `flex-1 min-h-0 p-0!`, then the preset `bg-surface-raised text-fg-strong outline-0` and a padding of 15.75px with 12.25px at the top |
| 3 | `div` | `data-pc-name="tabpanel"`, `role="tabpanel"`, `id`, `aria-labelledby`, `tabindex="0"`, `data-p-active` | `size-full` |

The indicator carries an inline `width` and `left` in pixels, written from the active tab's outer width and offset. Each panel is rendered and the inactive ones are hidden with `display: none`, because no lazy flag is passed. The previous and next scroll buttons in the preset need a scrollable flag that is never passed, so they are absent.

`CTabs` writes no ARIA of its own. The roles, the selection state, the roving tabindex, the generated identifiers and the arrow, Home, End, Enter and Space handling come from the library. An `aria-label` forwarded from a call site lands at depth 1 rather than on the element at depth 4, so it does not name the tab list.

## CTab DOM and ARIA

| Depth | Element | Attributes | Classes |
|---|---|---|---|
| 1 | `div` | `data-is-selected`, `data-is-editable`, a `dblclick` handler, plus every inherited attribute and listener | None |
| 2 | `span` | `data-pc-name="buttongroup"`, `role="group"` | `border-line-selected!` while selected, then `border border-line-subtle rounded flex items-stretch`, then the preset group classes |
| 3 | `button` | `data-pc-name="button"`, `type="button"` | `px-2! bg-surface-page! border-line-subtle ring-0! border-none flex-1`, then the preset small contrast outlined classes, whose `text-fg-muted` is the only text colour on the element |
| 4 | `i` | `aria-hidden="true"` | The resolved icon classes, plus `mr-2`. Rendered when `icon` is set |
| 4 | `div` | None | `mr-1 inline-flex items-center shrink-0 leading-none`. Rendered when `prefix` is filled |
| 4 | `div` | `size="small"`, which is undeclared and renders as a literal attribute | `truncate` |
| 5 | `span` | None | `px-1 whitespace-nowrap`, holding the label while the chip is not being renamed |
| 5 | `div` | None | `relative`, wrapping the field while renaming |
| 6 | `span` | None | `invisible px-1 whitespace-nowrap`, sizing the wrapper from the draft value |
| 6 | `input` | `name="label"`, `autocomplete="off"` | `absolute top-0 left-0 w-full h-full px-1 text-caption rounded bg-surface-page overflow-hidden text-ellipsis`, focused and selected when it opens |
| 3 | `button` | `data-pc-name="button"`, `type="button"`, `aria-label="Close"` | `w-8 self-stretch transition bg-surface-page hover:bg-surface-page! text-fg-subtle hover:text-fg-secondary border-none rounded-e`, then the preset default classes |
| 4 | `span` | `data-pc-section="icon"` | `fas fa-xmark text-base leading-4 mx-0` |
| 4 | `span` | `data-pc-section="label"` | `duration-200 font-medium truncate invisible w-0`, holding a single space |

`CTab` supplies one ARIA value of its own, the close button's `aria-label`, taken from the `packages.components.cTab.close` message. The icon carries `aria-hidden` from `CIcon`, and the button group carries `role="group"` from the library. The root has no `role` and no `aria-selected`, so a strip of chips is not a tab list and carries no keyboard path to rename.

## Forwarded attributes

| Shape | `CTabs` | `CTab` |
|---|---|---|
| `data-*` | Reaches the container at depth 1 | Reaches the root |
| `aria-*` | Reaches the container at depth 1 | Reaches the root |
| `on` followed by a capital | Reaches the container at depth 1 | Reaches the root |
| `id`, `name`, `form` | Reaches the container at depth 1 | Reaches the root |
| `class`, `style` | Removed, with nothing reported | Reaches the root |
| `title`, `tabindex`, `role` | Removed, with nothing reported | Reaches the root |

`CTabs` sets `inheritAttrs: false` and filters through `useForwardedAttrs`, whose pattern is `/^(data-|aria-|on[A-Z])|^(id|name|form)$/`. A forwarded `id` also seeds the generated tab and panel identifiers.

`CTab` sets only a name, so `inheritAttrs` keeps its default of true and the root takes whatever the call site writes. The two behave in opposite ways, and the three chip call sites depend on the forwarding.

## Library sections

| Section | Preset class | Class after the component applies its own |
|---|---|---|
| tabs root | `flex flex-col` | The attribute class `flex flex-col h-full min-h-0` followed by the preset class |
| tablist content | `overflow-x-auto … grow bg-surface-raised` | Unchanged |
| tablist tabList | `relative flex border-solid border-b border-line-default` | Replaced by `relative flex border-b-4 border-surface-page` |
| tablist activeBar | `z-10 block absolute bg-fill-primary-hover`, 1px tall and pulled 1px below the row | Replaced by the indicator class, or by `hidden` |
| tablist prevButton, nextButton | Defined in the preset | Not rendered |
| tabpanels root | `bg-surface-raised text-fg-strong outline-0`, padded 15.75px with 12.25px at the top | The attribute class `flex-1 min-h-0 p-0!` followed by the preset class |

A class written as a pass-through section replaces the preset value, because the merge spreads one object over the other. A class written as an attribute is concatenated ahead of the preset class instead, which is why the tabs root and the panels area carry both.

## Measurements

Taken at the 14 pixel interface default, against `--spacing: 4px` and a radius of 6px.

| Value | Where | Source |
|---|---|---|
| 56px | Height of the tab row | 53px button, less 1px pull-back, plus the 4px band |
| 53px | Height of a tab button | `py-4` either side of a 20px line box, plus a 1px bottom border |
| 15.75px | Padding either side of a tab label | The preset padding of 1.125rem against a 14px root |
| 31.5px | Width of a tab with no label and no slot | The two paddings alone |
| 6px | Top corners of a tab button | `rounded-t-md`, aliased onto the one radius |
| 4px | Band under the tab row | `border-b-4 border-surface-page` |
| 4px | Height of the indicator | `h-1`, offset `-bottom-1`, on the `raised` layer |
| 0 | Padding inside the panels area | `p-0!` overriding the preset padding |
| 200ms | Transition on a tab button | `transition-all duration-200` in the preset |
| 32px | Height of a chip | A 30px button inside a 1px border |
| 40px | Width of the chip close button | The preset `w-10`, which the stylesheet orders after `w-8` |
| 12px | Chip label and icon | `text-sm`, which resolves to the caption role |
| 8px | Gap after a chip icon | `mr-2` |
| 4px | Gap after a chip prefix | `mr-1` |

The one radius is in [space](/foundations/space/reference.md#radius), the `raised` layer in [depth](/foundations/depth.md#layering-is-ten-names), and the durations the system does define in [motion](/foundations/motion.md#two-durations).

## Contrast

Computed from the rendered sRGB of each token pair.

| Pair | Dark | Light |
|---|---|---|
| `fg-secondary` on `surface-raised`, the active tab label | 6.21 | 4.58 |
| `fg-default` on `surface-raised`, an inactive tab label | 7.48 | 8.90 |
| `fg-strong` on `surface-raised`, panel text | 10.35 | 13.40 |
| `line-secondary` on `surface-raised`, the active underline | 6.21 | 4.58 |
| `fill-secondary` on `surface-page`, the indicator | 6.47 | 2.14 |
| `fg-muted` on `surface-page`, a chip label | 5.58 | 5.56 |
| `fg-subtle` on `surface-page`, the chip close glyph | 6.58 | 6.91 |
| `line-selected` on `surface-page`, a selected chip border | 7.47 | 5.51 |
| `line-subtle` on `surface-page`, a resting chip border | 1.66 | 1.67 |

`fill-secondary` is a single value with no light and dark pair, which is why the indicator drops to 2.14 in light. It is one of three cues rather than the only one.

## Call sites

| Component | Feature | What it exercises |
|---|---|---|
| `CTabs` | Plugins | Items with no `label`, both `tab-<id>` slots, and both events |
| `CTabs` | Plugin store detail | Translated labels, panel slots guarded against the model |
| `CTabs` | Automate session settings | Four labelled items, a sizing wrapper, `tabMouseDown` alone |
| `CTab` | Replay tab strip | `is-editable`, a `prefix` slot, a forwarded `data-` attribute and a forwarded context menu listener |
| `CTab` | Automate session tab | An `icon`, and a forwarded `data-` attribute |
| `CTab` | Automate entry tab | The plainest chip, with no icon and no prefix |

Nothing in Caido passes `indicator`, uses the shared `tab` slot, or uses the shared `panel` slot.
