# Using a menu

How to build each of the two menus and wire it up. For what they decide for you, see [Overview](/components/menu.md). For every prop, slot and attribute, see [Reference](/components/menu/reference.md).

## Choosing between the two menus

Start from how the list is opened, because that settles which wrapper it is. A list opened by a right-click is a `CContextMenu`, and it is not rendered by the caller at all. A list already on screen, inside a panel or a popover, is a `CMenu` with a `model`.

**Does the action have a route other than right-click?** If it does not, add one before adding the menu row, because a right-click on its own is an accelerator rather than an action.

## Opening a context menu from a row

Reach the shared overlay with `useContextMenu()` and hand `show` the event and the items.

```vue
<script setup lang="ts">
import { useContextMenu } from "@proxy-frontend/components";

const contextMenu = useContextMenu();

const onContextMenu = (event: MouseEvent) => {
  contextMenu.show(event, [
    { label: "Copy URL", icon: "fas fa-copy", command: () => copyUrl() },
    { label: "Rename", icon: "fas fa-pen", command: () => rename() },
  ]);
};
</script>

<template>
  <div [[@contextmenu="onContextMenu"]]>{{ row.host }}</div>
</template>
```

`show` calls `preventDefault` and `stopPropagation` for you, and positions the panel from the pointer coordinates on that same event. Pass the real event through rather than a synthetic one, or the panel opens in the wrong place. Call `contextMenu.hide()` when whatever the menu acts on disappears while it is open.

## Grouping items and separating groups

Build the array with `createContextMenu`, which takes groups rather than a flat list.

```ts
import { createContextMenu } from "@proxy-frontend/components";

const items = createContextMenu([
  requestRowContextMenu.getItems(requests),
  [{ label: "Rename", icon: "fas fa-pen", command: () => rename() }],
  deleteItems,
]);
```

**`createContextMenu` drops empty groups before it inserts the separators.** A group that filters down to nothing leaves no stray rule behind, which is what makes a menu assembled from several composables safe to merge. Write `{ separator: true }` by hand only inside a `CMenu`, which has no helper of its own.

## Marking a destructive item

Colour a destructive row through the item's `style`, because an item is data rather than markup and no class can reach it.

```ts
{
  label: "Delete",
  icon: "fas fa-trash",
  style: { color: "var(--color-fg-danger)" },
  command: () => remove(),
}
```

That is the supported escape hatch rather than a raw colour, since the value is still a token read the way [theme](/foundations/theme/usage.md#reaching-a-token-where-a-class-cannot) describes. Keep the style to colour: the library applies it to the row element, and `CContextMenu` applies it again to the line inside.

## Showing a keyboard shortcut

`CContextMenu` draws a shortcut in the trailing box, in `fg-subtle`, to the left of the caret.

```ts
{
  label: "Send to Replay",
  shortcut: () => getShortcut(Commands.Replay.SendToReplay),
  command: () => sendToReplay(),
}
```

**`shortcut` is a function returning a string or `undefined`, not a string.** A plain string throws while the row renders, because the template calls the field. The trailing box is drawn whether or not the field is set, so a row without a shortcut reserves the same 8 pixels as a row with one.

## Adding a submenu

Nest items under `items` in a context menu and the library draws a flyout with a caret on the parent row.

<Preview
  light="/examples/component-menu-submenu-light.svg"
  dark="/examples/component-menu-submenu-dark.svg"
  alt="A context menu whose second row is active and opens a flyout panel of two rows to its right"
  caption="The flyout is fit-content wide up to 300px, positioned against the parent row once the panel has been measured."
/>

**An item with an empty `items` array draws a caret and opens nothing.** The caret comes from the raw array, which is truthy when empty, while the flyout needs a non-empty one. Omit the field until there is something to put in it. A first-level flyout taller than 384 pixels takes a scroll of its own, so a long list of collections stays inside the window.

## Building a CMenu

`model` is the only prop, it is required, and it accepts items and sections in the same array.

```ts
import { CMenu, type CMenuSection, type MenuItem } from "@proxy-frontend/components";

const model: MenuItem[] = [
  { label: "Settings", command: () => router.push("/settings") },
  { separator: true },
  { label: "Pricing", url: "https://caido.io/pricing", target: "_blank" },
];
```

```vue
<CMenu :model="model" [[aria-label="Account"]] />
```

An item carrying a `url` renders as a link, and one carrying a `command` runs it. `aria-label` and `aria-labelledby` are forwarded onto the list element that carries the menu role, so a menu with no visible heading still has a name.

## Sectioning a CMenu

An entry with its own `items` becomes a heading followed by its children as siblings in the same list.

```ts
const model: (MenuItem | CMenuSection<MenuItem>)[] = [
  { label: "Proxy", items: [{ label: "History", command: () => open("history") }] },
  { label: "Project", items: [{ label: "Backups", command: () => open("backups") }] },
];
```

The heading is flat rather than a flyout, drawn at regular weight with no padding of its own. Reach for a `CContextMenu` where the children need tucking away until the parent is pointed at.

## Placing a CMenu inside an overlay

**A class written on `CMenu` does not reach the DOM.** The component stops inheriting attributes, and `class` fails the allow-list `/^(data-|aria-|on[A-Z])|^(id|name|form)$/` that decides what is forwarded, so the width and the surface belong to a wrapper.

<DoDont image="component-menu-styling">
  <template #do>
    <p>Wrap the menu in the floating surface and style that. The popover carries the width, the padding reset and the raised background.</p>
  </template>
  <template #dont>
    <p>Write the width and a shadow on the menu itself. The attributes are dropped, the panel renders unchanged, and nothing reports it.</p>
  </template>
</DoDont>

## Replacing the row a CMenu draws

The `#item` slot replaces the anchor the library would render, and hands back the props carrying the preset classes.

```vue
<CMenu :model="model">
  <template #item="{ item, label, props: { action, label: labelProps } }">
    <a v-bind="action" @mousedown.stop="run(item)">
      <span v-bind="labelProps">{{ label }}</span>
    </a>
  </template>
</CMenu>
```

`action` arrives carrying `tabindex="-1"` and `aria-hidden`, because the accessible name sits on the row element outside the slot. A second interactive control inside that anchor is hidden from assistive technology, so keep the slot to one activation target. The rule against interaction handlers on a static element cannot read a role that arrives through `v-bind`, which is why the settings menu disables it on that line.

The slot also receives an `icon` entry at runtime that the declared type leaves out, so reading it fails typecheck. Render the icon from `item.icon` instead.

Give each row its own `command`, hand `show` the untouched event, and leave the shared overlay alone.
