# Toast reference

The prop, the slot, the message payload and every rendered element, with what each one carries. For what a toast is for, see [Overview](/components/toast.md). For how to mount one, see [Usage](/components/toast/usage.md).

`CToast` and `useToast` are exported from `@proxy-frontend/components`.

## Props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `group` | `string` | No | Absent | Which messages this host draws. A host with no group draws messages that carry no group, and a host with a group draws only messages carrying that same string |

There is no `size` prop, no `severity` prop and no `position` prop. Variation reaches a toast through the message rather than through the element.

## Events

| Event | Payload | Declared by the component |
|---|---|---|
| `close` | `{ message }` | No. It arrives as a listener and is bound onto the element underneath. It fires on a click of the close control, and when the three message cap removes the oldest |
| `life-end` | `{ message }` | No. It arrives the same way, and fires when a message reaches the end of its `life` |

The component binds its own `close` handler as well, which removes the message from the count it keeps.

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `message` | `{ message }` | Replaces the icon, the title and the detail for every message this host draws. The close control remains. Nothing wraps the content, so it sets its own width behaviour |
| default | None | Does not exist. Content written between the tags is never rendered |
| `container`, `messageicon`, `icon`, `closeicon` | None | Not exposed. The component forwards one template and passes no others |

## Severities

| Severity | Background | Text | Detail | Icon |
|---|---|---|---|---|
| `info` | `surface-toast-info` | `fg-info-strong` | `fg-strong` | Information circle |
| `success` | `surface-toast-success` | `fg-success-strong` | `fg-strong` | Check |
| `warn` | `surface-toast-warn` | `fg-warn-strong` | `fg-strong` | Warning triangle |
| `error` | `surface-toast-danger` | `fg-danger-strong` | `fg-strong` | Times circle |
| `secondary` | `surface-raised` | `fg-default` | `fg-strong` | None |
| `contrast` | `fill-neutral-subtle` | `fg-on-neutral-subtle` | `fg-on-neutral-subtle` | None |
| Absent | None, so the message is transparent | Inherited | `fg-strong` | None, though the space for one is still reserved |

The failing case is spelled `error` here and `danger` in the shared severity vocabulary that [Components](/foundations/components/reference.md#the-vocabulary) records. A message sent with `danger` falls into the last row.

## Message payload

| Key | Type | Meaning |
|---|---|---|
| `severity` | One of the six names above | Picks the surface, the text colour and the icon. Absent leaves the surface and the text colour unset, and reserves the icon space without an icon |
| `summary` | `string` | The title line. The composable takes it from the message catalogue |
| `detail` | `string` | The body line. The composable takes it from the call |
| `life` | `number` | Milliseconds before the message removes itself. Absent leaves the message until it is dismissed |
| `group` | `string` | Routes the message to the host carrying the same string |
| `closable` | `boolean` | `false` removes the close control and the container around it. The default is `true` |
| `styleClass` | `string` | A class on the message element, and one of the two routes a class has into a toast |
| `contentStyleClass` | `string` | A class on the content row, and the other route |

## Measured contrast

| Pairing | Light | Dark |
|---|---|---|
| `fg-info-strong` on `surface-toast-info` | 8.20 | 4.54 |
| `fg-success-strong` on `surface-toast-success` | 7.61 | 5.07 |
| `fg-warn-strong` on `surface-toast-warn` | 8.06 | 4.83 |
| `fg-danger-strong` on `surface-toast-danger` | 7.96 | 5.16 |
| `fg-default` on `surface-raised` | 8.90 | 7.48 |
| `fg-on-neutral-subtle` on `fill-neutral-subtle` | 9.44 | 7.32 |
| `fg-strong` on the four toast surfaces | 11.36 to 12.40 | 6.26 to 7.42 |
| `fg-on-info` on `surface-toast-info` | 1.40 | 7.51 |

## The composable

| Call | Severity | Title | Lifetime |
|---|---|---|---|
| `notifyError(message, options)` | `error` | Error | None, so it waits to be dismissed |
| `notifyWarning(message, options)` | `warn` | Warning | None, so it waits to be dismissed |
| `notifyInfo(message, options)` | `info` | Info | 3000ms plus 333ms per word, floored at 4000 and capped at 12000 |
| `notifySuccess(message, options)` | `success` | Success | The same calculation |

`options` carries one key, `duration`, in milliseconds, which replaces the lifetime above. `secondary` and `contrast` are outside the composable and reachable only by pushing a message onto the bus directly.

## Attributes

| Passed | Reaches the column |
|---|---|
| `data-*` | Yes |
| `aria-*` | Yes |
| A listener | Yes |
| `id`, `name`, `form` | Yes |
| `class` | No |
| `style` | No |
| `position`, `pt`, `closeIcon`, `closeButtonProps`, `breakpoints`, `baseZIndex` | No. They are props of the element underneath, and the component neither declares nor forwards them |

The component sets `inheritAttrs` to false and forwards through one allow-list, which is the filter [Components](/foundations/components/reference.md#what-the-api-accepts) describes for the layer.

## Fixed behaviour

| Setting | Value |
|---|---|
| Position | `bottom-center`, written inside the component |
| Render target | The end of `document.body`, from the mounted hook onwards |
| Stacking layer | An inline `z-index`, written when the first message enters and seeded from [the floating layer](/foundations/depth/reference.md#the-layers) at 100, so the rendered value is 101 or higher. The root carries no layer class |
| Visible at once | 3, counted in one module-level array shared by every caller of the composable |
| Eviction | The oldest is removed when a fourth arrives |
| Messages pushed onto the bus directly | Outside that count, so neither evicted nor counted |
| Pass-through | The component supplies its own, which merges with the preset. One written at a call site is dropped by the attribute filter |

## Rendered elements

| Element | Marker | Carries |
|---|---|---|
| `div` | `data-pc-name="toast"`, `data-pc-section="root"` | The fixed position, the 384px width and the 6px corner |
| `div` | None | The transition group holding the messages |
| `div` | `data-pc-section="message"` | Background, text colour, corner, bottom margin and the backdrop blur |
| `div` | `data-pc-section="messagecontent"` | The 12px padding and the row of icon, text and close control |
| `svg` or `span` | `data-pc-section="messageicon"` | The severity glyph, or zero width for `secondary` and `contrast` |
| `div` | `data-pc-section="messagetext"` | The body role, the left gutter and the growth of the text column |
| `span` | `data-pc-section="summary"` | The title, at weight 500 |
| `div` | `data-pc-section="detail"` | The message text, at the caption role |
| `div` | `data-pc-section="buttoncontainer"` | The close control |
| `button` | `data-pc-section="closebutton"` | A 28px circle holding a 14px glyph |
| `svg` | `data-pc-section="closeicon"` | The 14px cross, sized by the icon defaults rather than by the preset |

## ARIA

| Attribute | Value | Set by |
|---|---|---|
| `role` on a message | `alert` for `error` and `warn`, `status` otherwise | The pass-through, which wins over the library default of `alert` |
| `aria-live` on a message | `assertive` for `error` and `warn`, `polite` otherwise | The same pass-through, and the reason an info toast waits its turn |
| `aria-atomic` on a message | `true` | The component library |
| `aria-label` on the close control | `Close` | The library locale default. It sits outside the translation layer and stays in English |
| `autofocus` on the close control | Present | The component library. There is no route to remove it |
| `aria-hidden` on each glyph | `true` | The icon component, because neither glyph is labelled |
| The root and the transition group | No role and no live region | Neither element is announced |

[Feedback](/foundations/feedback/reference.md#toast-politeness) carries the same politeness table alongside the other indicators.

## Geometry

| Part | Value |
|---|---|
| Column | Fixed, 20px above the bottom edge, centred by a 50 per cent translation |
| Column width | 384px, independent of the text size setting |
| Message corner | 6px, with no border and no shadow |
| Message bottom margin | 16px, which the lowest message keeps, so the visible gap to the edge is 36px |
| Message backdrop | A 10px blur |
| Content padding | 12px on all four sides |
| Icon | 15.75px square, 8px to its right |
| Gutter between icon and text | 16px, from the 8px on each side |
| Text column | The body role at 14px, growing to fill the row |
| Title | Weight 500, on its own line |
| Detail | The caption role at 12px on a 16px line, 8px below the title |
| Close control | 28px square, fully rounded, transparent until hover |
| Message height | 65px with a detail. 52px without one, because the 28px close control sets the floor once the text column drops below it |

Those rem based figures are the ones the authenticated application renders, where the root size follows the interface text setting and defaults to 14. The login page mounts its host outside that provider, so the icon renders at 18px and the detail at 13.71px there. The pixel based figures hold in both. [Type](/foundations/type/reference.md#the-text-size-setting) covers the setting itself.

## Motion

| Phase | Written | Rendered |
|---|---|---|
| Enter | Opacity and a half height translation over 300ms | The opacity alone. The translation is applied through the `translate` property, which the transition does not name, so the message arrives in place |
| Leave | A 450ms height collapse with opacity and margin | All properties over 150ms. The durations are written inside the property list, which is not valid, so the list is dropped and the default duration applies |

[Motion](/foundations/motion/reference.md#what-animates) carries the two durations the system does recognise.

## What does not apply

| Written | Effect |
|---|---|
| `class` or `style` on the element | None. Both are dropped by the attribute filter before the element underneath is reached |
| Content between the tags | None. There is no default slot, and the element underneath reads five named templates |
| `position` on the element | None. It is fixed to `bottom-center` inside the component |
| A pass-through on the element | None. The component supplies its own |
| `severity: "danger"` on a message | No background and no text colour, because the preset compares against `error` |
| A ripple on the close control | None. The directive is attached and the setting that enables it is off |
| The theme rules that would pull the close control out of the box | None. The preset is running unstyled, so no rule for them ships |
