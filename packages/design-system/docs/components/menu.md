# Menu

A menu is a list of commands, one of which gets picked. Caido ships two wrappers for that job, and they share the shape of an item and very little else. `CMenu` draws a vertical list in the flow of the page, wherever the markup puts it. `CContextMenu` is the single right-click overlay for the whole application, mounted once in the shell and opened from anywhere.

This page explains what each one decides for you. [Usage](/components/menu/usage.md) shows how to build them, and [Reference](/components/menu/reference.md) lists the props, slots, attributes and the DOM they render.

## Two wrappers, two different jobs

| | `CMenu` | `CContextMenu` |
|---|---|---|
| Where it renders | In flow, where it is written | Portalled out to the document body |
| How it opens | It is already open | On a right-click, through `useContextMenu()` |
| How it takes items | The `model` prop | The event bus behind `useContextMenu()` |
| How many exist | One per place that needs a list | One, in the application shell |
| Nesting | A flat section with a heading | A flyout submenu at any level |
| Surface | Transparent and borderless | `surface-page` behind a 1px `line-default` border |

The wiring differs far enough that swapping one for the other is a rewrite rather than a substitution.

## The item object is the API

Both take an array of plain objects rather than markup per row. A `label`, an `icon` from the [icon vocabulary](/foundations/icons.md), a `command` and a `disabled` flag cover most rows, and `{ separator: true }` draws the rule between two groups.

**An item runs its own `command` when it is picked.** Neither wrapper declares an event, so there is no selection listener to attach and the callback lives on the row it belongs to. Assembling the array is therefore the whole of the work, which is why Caido builds those arrays in composables rather than in templates.

## One right-click menu for the application

`CContextMenu` is written once, beside the confirm dialog at the root of the application shell. It takes no props, exposes no slot, and renders nothing at all until somebody opens it.

Anything that needs a right-click menu reaches it through `useContextMenu()`, which returns `show` and `hide`. A table row, a sidebar entry or an editor hands `show` the mouse event and an array of items, and the shell draws the overlay at the pointer.

**Centralising it leaves a caller owning its items and nothing else.** Placement, dismissal, nesting, keyboard handling and stacking are settled in one file, and the fourteen files that assemble item arrays touch none of it.

<Preview
  light="/examples/component-menu-contextmenu-light.svg"
  dark="/examples/component-menu-contextmenu-dark.svg"
  alt="A context menu panel with four rows, one hovered, one destructive, and a separator between the second and third"
  caption="Icon, label and shortcut on each row. The separator comes from a group boundary rather than from a hand-placed item."
/>

## A CMenu cannot be an overlay

The library underneath can render the same list as a floating panel, and Caido closes that route: the flag that would do it is not one of the attributes a component forwards, and `CMenu` stops inheriting the rest, so nothing outside can set it.

A list that has to float goes inside something that already floats. The profile menu puts a `CMenu` inside a popover, and that is the pattern for the case.

## The surface belongs to whatever holds it

**A `CMenu` paints neither a background nor a border.** Its root overrides the raised surface the preset asks for, so one dropped onto an arbitrary parent shows whatever sits behind it. Both call sites place it on a surface deliberately, one inside a popover and one on the page surface of the settings column.

`CContextMenu` settles its own surface instead, because it opens over content it knows nothing about. It takes the page surface and the 1px border a floating surface takes, and it draws no shadow, because [the system defines none](/foundations/depth.md#there-are-no-shadows).

<Preview
  light="/examples/component-menu-sections-light.svg"
  dark="/examples/component-menu-sections-dark.svg"
  alt="A CMenu on a raised plate, with a section label above three rows, the second hovered and the third disabled"
  caption="The plate is supplied by the parent. The section label is a heading in the same list rather than a flyout."
/>

## When a menu is the wrong answer

A context menu opens on the element under the pointer, and nothing on screen says what is inside it. An action that lives only there is hard to find, so give it a visible control or a command as well, the way [accessibility](/foundations/accessibility/usage.md#giving-a-double-click-a-second-route) asks of a double-click.

**Does the choice stay on screen after it is made?** Then it is a value rather than a command, and a select is the right control. A menu row fires and closes, leaving nothing behind that says what was chosen.

## What it costs

Neither wrapper takes a size, a severity, a variant or a density. Rows come out at one height, **33 pixels in a `CMenu` and 32 in a `CContextMenu`** at the default text setting, and the states either one draws are focus, hover, active and disabled.

The attribute contract has a price here too. Presentation cannot be passed in from outside, so a class written on `CMenu` is dropped rather than applied, and the width and the surface have to come from a wrapper. [Usage](/components/menu/usage.md#placing-a-cmenu-inside-an-overlay) shows the arrangement that works.
