# Menu reference

Every prop, event, slot, attribute and measured value on the two menu wrappers. For what each one is for, see [Overview](/components/menu.md#two-wrappers-two-different-jobs). For how to build one, see [Usage](/components/menu/usage.md#choosing-between-the-two-menus).

Values were measured at the default interface text size, where the root is 14px.

## CMenu props

| Prop | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `model` | `(T \| CMenuSection<T>)[]`, `T extends MenuItem` | Yes | None | The rows, in order. An entry carrying an `items` array becomes a section, and an empty array still draws the heading |

`CMenuProps<T>` declares that one field. `CMenuSection<T>` is `Omit<MenuItem, "items"> & { items: T[] }`.

## CContextMenu props

`CContextMenu` declares no props and no defaults. Items arrive through the event bus behind `useContextMenu()`, and the single instance in the application shell is written with no attributes.

## Item fields

Fields the library reads from an entry in `model`, and from an entry passed to `show`.

| Field | Type | Effect |
|---|---|---|
| `label` | `string` or `() => string` | The row text, and the accessible name on the row element |
| `icon` | `string` | Icon class names, drawn before the label |
| `command` | `({ originalEvent, item }) => void` | Runs when the row is picked |
| `disabled` | `boolean` or `() => boolean` | Blocks pointer events and sets `aria-disabled` |
| `visible` | `boolean` or `() => boolean` | A value of `false` removes the row |
| `separator` | `boolean` | Draws a rule instead of a row |
| `url`, `target` | `string` | Renders the row as a link, in `CMenu` only |
| `items` | An array of items | A flat section in `CMenu`, a flyout in `CContextMenu` |
| `class`, `style` | `string`, an object | Applied to the row element by the library |
| `shortcut` | `() => string \| undefined` | Trailing text, read by `CContextMenu` only |

`ContextMenuItem` also intersects `Record<string, unknown>`, so a misspelled field passes typecheck and does nothing.

## Events

| Name | Payload | Notes |
|---|---|---|
| `command` on the item | `{ originalEvent: Event, item: MenuItem }`, with `id` as well in `CMenu` | Not a Vue event. The callback belongs to the row |
| `focus` | `FocusEvent` | Forwarded rather than declared, emitted by the list element |
| `blur` | `FocusEvent` | Forwarded rather than declared |
| `show`, `hide` | None | Declared by the library and fired from the overlay transition. `CContextMenu` fires them as the overlay opens and closes, and a `CMenu` in flow never runs that transition |
| `before-show`, `before-hide` | None | Declared by the library, reached through `CContextMenu` only |

Neither wrapper declares an emit of its own, so a row reports itself through its `command`.

## Slots

| Slot | Component | Props | Notes |
|---|---|---|---|
| `start` | `CMenu` | None | Renders above the list, in a wrapper the preset leaves unstyled |
| `item` | `CMenu` | `item`, `label`, `props` | `props` carries `action`, `label` and, at runtime only, `icon` |
| Default | Neither | None | Children written between the tags are discarded |
| `end`, `submenulabel`, `submenuheader`, `itemicon`, `submenuicon` | Neither | None | Supported by the library, not forwarded by either wrapper |

`CContextMenu` fills the item slot itself and does not expose it.

## Sizes and severities

| Axis | Accepted |
|---|---|
| `size`, `severity`, `variant`, density | Neither wrapper declares any of them |

The states either one draws are focus, hover, active and disabled, all set by the library from its own context rather than by a caller.

## Attributes

| Attribute | `CMenu` | `CContextMenu` |
|---|---|---|
| `data-*` | Forwarded to the root element | Applied to the root element |
| `aria-*` | Forwarded, with `aria-label` and `aria-labelledby` landing on the list | Applied to the root element, apart from those two, which the library takes as props |
| `on[A-Z]` listeners | Forwarded to the root element | Applied to the root element |
| `id`, `name`, `form` | Forwarded, and `id` overrides the generated root id | Applied to the root element |
| `class`, `style` | Dropped | Applied to the root element |
| Library props such as `popup`, `appendTo`, `tabindex` | Dropped | Reach the library component, which consumes the ones it declares |

`CMenu` sets `inheritAttrs: false` and forwards what matches `/^(data-|aria-|on[A-Z])|^(id|name|form)$/`. Its own root classes are fixed in the template. `CContextMenu` inherits attributes and binds them a second time, so an attribute written on it lands twice.

## DOM and ARIA

| Element | Section | Role and attributes |
|---|---|---|
| `div` | `root` | Rendered in flow by `CMenu`, which carries the generated id here, and at the document body by `CContextMenu`, which carries it on the list instead |
| `div` | `start` | Present in `CMenu` only when the slot is given |
| `ul` | `list`, `rootList` | `role="menu"` in `CMenu`, `role="menubar"` with `aria-orientation="vertical"` in `CContextMenu`, `tabindex="0"`, `aria-activedescendant`, `aria-label`, `aria-labelledby` |
| `li` | `item` | `role="menuitem"`, `aria-label`, `aria-disabled`, `data-p-focused`, `data-p-disabled`, and in `CContextMenu` also `aria-haspopup`, `aria-expanded`, `aria-level`, `aria-setsize`, `aria-posinset`, `data-p-active` |
| `div` | `itemContent` | Carries the click and pointer handlers and the row background |
| `a` | `itemLink` | `href`, `target`, `tabindex="-1"`. Drawn by `CMenu` only when the item slot is absent, and the slot receives the same props plus `aria-hidden` |
| `li` | `submenuLabel` | `role="none"`, one per `CMenu` section |
| `ul` | `submenu` | `role="menu"`, `aria-labelledby`, in `CContextMenu` only |
| `li` | `separator` | `role="separator"` |

## Geometry

| Part | `CMenu` | `CContextMenu` |
|---|---|---|
| Panel minimum width | 175px | 175px |
| Panel padding | 4px | 4px |
| Panel radius | 6px | 6px |
| Panel border | None | 1px `line-default` |
| Panel background | Transparent | `surface-page` |
| Shadow | None | None |
| Row height | 33px | 32px |
| Gap between rows | 2px, and none above the first | 4px, and none above the first |
| Row radius | 4px | 4px |
| Row padding | 8px and 12px | 6px and 16px |
| Gap after the icon | 8px | 8px |
| Section label | 20px tall, regular weight, no padding | Not applicable |
| Flyout | Not applicable | Fit-content up to 300px, scrolling past 384px |
| Layer | In flow | An inline z-index seeded from the floating layer, 101 for the first overlay opened |

The two row gaps differ in the list around them. The `CMenu` list is a block container, where the 2px margin below one row and the 2px margin above the next collapse into one, and the `CContextMenu` list is a flex column, where the same two margins add up.

## What not to write

| Do not write | Why | Write instead |
|---|---|---|
| A `class` or a `style` on `CMenu` | Both are dropped before they reach the DOM | A class on the wrapper that holds the menu |
| `popup` on `CMenu` | It is dropped, so the list stays in flow | A popover around the menu |
| `<CContextMenu>` with content inside | There is no default slot, so the content is discarded | `useContextMenu().show(event, items)` |
| A second `CContextMenu` | The shell already mounts the one instance | The handle returned by `useContextMenu()` |
| `items: []` on an item | It draws a caret that opens nothing | No `items` field at all |
| `shortcut: "Ctrl K"` | The field is a function | `shortcut: () => "Ctrl K"` |
| `props.icon` in the `CMenu` item slot | It exists at runtime but not in the declared type | `item.icon` |
