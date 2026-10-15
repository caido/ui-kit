# Dialog reference

Every prop, event, slot and rendered element, with what each one carries. For what a dialog is for, see [Overview](/components/dialog.md). For how to open one, see [Usage](/components/dialog/usage.md).

`CDialog` is exported from `@proxy-frontend/components`.

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `visible` | `boolean` | Yes | None | A two-way model, written `v-model:visible`. Whether the dialog is open |
| `title` | `string` | Yes | None | The accessible name of the dialog, and the header text when the header slot is not filled |
| `width` | `small`, `medium`, `large` | No | Absent, which shrinks the dialog to fit its content | The maximum width |
| `closable` | `boolean` | No | `true` | Whether the close button, the Escape key and the click on the scrim are available |
| `maximizable` | `boolean` | No | `false` | Adds a second header button that fills the window. No call site in the interface sets it |

## Events

| Event | Payload | Declared by the component |
|---|---|---|
| `update:visible` | `boolean` | Yes, by the model |
| `show` | None | No. It arrives as a listener and is forwarded |
| `hide` | None | No. It arrives as a listener and is forwarded |
| `after-hide` | None | No. It arrives as a listener and is forwarded |
| `maximize` | `Event` | No. Reachable when `maximizable` is true |
| `unmaximize` | `Event` | No. Reachable when `maximizable` is true |
| `dragstart`, `dragend` | `Event` | No, and unreachable. Dragging is switched off |

## Slots

| Slot | Renders into | Notes |
|---|---|---|
| default | The content region | Scrolls when it runs out of room |
| `header` | The left of the header band | Replaces the title text. The accessible name still comes from `title` |
| `footer` | The footer band | When the slot is absent the footer element is not rendered, and the bottom corners move to the content region |
| `container`, `closeicon`, `maximizeicon` | Nothing | Not exposed. The component declares three templates and passes no others |

## Widths

| Value | Class | Cap | Rendered width |
|---|---|---|---|
| Absent | None | None | Shrinks to fit, up to `100vw - 32px` |
| `small` | `w-full max-w-dialog-sm` | 400px | `min(100vw - 32px, 400px)` |
| `medium` | `w-full max-w-dialog-md` | 600px | `min(100vw - 32px, 600px)` |
| `large` | `w-full max-w-dialog-lg` | 800px | `min(100vw - 32px, 800px)` |

There is no `severity` prop and no `size` prop. `width` is the shared size union under another name, as [the vocabulary](/foundations/components/reference.md#the-vocabulary) records.

## Attributes

| Passed | Reaches the dialog |
|---|---|
| `data-*` | Yes |
| `aria-*` | Yes, except `aria-label`, which the `title` prop overrides |
| A listener | Yes |
| `id`, `name`, `form` | Yes |
| `class` | No |
| `style` | No |
| A pass-through attribute such as `pt:content:class` | No |

The component sets `inheritAttrs` to false and forwards through one allow-list, which is the filter [Components](/foundations/components/reference.md#what-the-api-accepts) describes for the layer.

## Fixed behaviour

| Setting | Value |
|---|---|
| Modal | True, so focus is trapped and the scrim is painted |
| Draggable | False |
| Escape closes | Follows `closable` |
| Click on the scrim closes | Follows `closable` |
| Close button appearance | `contrast` severity, outlined, set as a module constant a caller cannot reach |
| Scroll behind the dialog | Not blocked. The library asks the body to stop scrolling on every modal dialog, and it asks with a class that has no rule in the shipped stylesheets |
| Render target | The end of `document.body` |
| Stacking | An inline z-index on the scrim rather than a class. The library counts up from the modal base the application sets to the `z-floating` value of [100](/foundations/depth/reference.md#the-layers), so the first dialog paints at 101 and a later overlay sits above it |

## Rendered elements

| Element | Marker | Carries |
|---|---|---|
| `div` | `data-pc-section="mask"` | The fixed full-window scrim, 16px of inset, and the centring of the dialog |
| `div` | `role="dialog"`, `data-pc-section="root"` | Background, radius, maximum height and the width class |
| `span` twice | `data-pc-section="firstfocusableelement"`, `lastfocusableelement` | The focus trap sentinels, hidden from assistive technology |
| `div` | `data-pc-section="header"` | The header slot or the title, and the header actions |
| `div` | `data-pc-section="headeractions"` | The maximise button when `maximizable` is set, then the close button when `closable` |
| `button` | `data-pc-group-section="headericon"` | A 14px glyph filled with the current colour |
| `div` | `data-pc-section="content"` | The default slot, scrolling on the vertical axis |
| `div` | `data-pc-section="footer"` | The footer slot, when that slot is filled |

## ARIA

| Attribute | Value | Set by |
|---|---|---|
| `role` | `dialog` | The component library |
| `aria-modal` | `true` | The component library, from the fixed modal setting |
| `aria-label` | The `title` prop | The component, bound after the forwarded attributes, so it wins |
| `aria-labelledby` | An identifier ending `_header` | The component library. The element that would carry that identifier is never rendered, so the name comes from `aria-label` |
| `aria-label` on the close button | `Close` | The library locale default. It is outside the translation layer and stays in English |

## Geometry

| Part | Value |
|---|---|
| Scrim inset | 16px |
| Root radius | 6px on all four corners |
| Root maximum height | 90vh |
| Frame | 1px on each edge, assembled from the three regions and the bottom edge of the root |
| Header padding | 16px on all sides |
| Header height with `closable` | 64px, set by the 32px close button |
| Header height with `closable` false | 56px, set by the 24px title line box |
| Content padding | 0 top, 16px left, right and bottom |
| Footer padding | 0 top, 16px left, right and bottom |
| Footer gap | 8px |
| Header action gap | 4px |
| Close and maximise button | 32px square, 6px radius, 1px border, 14px glyph |
| Title role | `text-title`, which renders at 18px on a 24px line at weight 600 |

## Colour

| Part | Token |
|---|---|
| Dialog background | `surface-page` |
| Footer background | `surface-page` |
| Every border | `line-default` |
| Header, content and footer text | `fg-default` |
| Header button glyph | `fg-muted` |
| Header button hover background | `fg-strong` at 15 per cent |
| Scrim | Black at 40 per cent |

## What does not paint

| Written on the element | Effect |
|---|---|
| `shadow-lg` on the root | None. The shadow scale is cleared, and no rule for the class ships |
| The transition wrapper around the root | None. No matching enter or leave rules ship, so there is no animation |
| `transition-all duration-300` on the scrim | None. The scrim is mounted and unmounted rather than transitioned |
| `has-[.mask-active]:bg-transparent` on the scrim | None. The selector needs a `mask-active` descendant, and the drawer preset rather than the dialog preset is what adds one |
| `!top-0 !left-0` when maximised | None. The root is not positioned |
| The preset section for the title | None. The element it targets is never rendered, so the title class comes from the component itself |
