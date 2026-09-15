---
outline: false
pageClass: wide
---

# Menu and context menu

A menu is a list of actions performed on a known object. If the thing chosen is stored rather than executed it is a select, and if it is a destination it is a link.

<script setup>
const rowMenu = [
  {
    items: [
      { id: "copy-url", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      { id: "replay", label: "Send to Replay", icon: "fas fa-paper-plane", shortcut: "⌘R" },
      { id: "scope", label: "Add to scope", icon: "fas fa-circle-plus" },
    ],
  },
  {
    items: [
      {
        id: "copy-as",
        label: "Copy as",
        icon: "fas fa-file-export",
        submenu: [
          { id: "as-curl", label: "cURL", icon: "fas fa-terminal" },
          { id: "as-raw", label: "HTTP request", icon: "fas fa-file-code" },
          { id: "as-fetch", label: "Fetch", icon: "fas fa-code" },
          { id: "as-python", label: "Python requests", icon: "fas fa-cube" },
        ],
      },
      { id: "save", label: "Save to file…", icon: "fas fa-floppy-disk", shortcut: "⇧⌘S" },
      { id: "compare", label: "Compare", icon: "fas fa-code-compare", disabled: true },
    ],
  },
  {
    items: [{ id: "delete", label: "Delete request", icon: "fas fa-trash", shortcut: "⌫", destructive: true }],
  },
];

const roleMenu = [
  {
    items: [
      { id: "r-open", label: "Open in new tab", icon: "fas fa-arrow-up-right-from-square" },
      { id: "r-rename", label: "Rename…", icon: "fas fa-pen" },
    ],
  },
  {
    label: "Display",
    items: [
      { id: "r-wrap", label: "Word wrap", role: "menuitemcheckbox", checked: true, shortcut: "⌥Z" },
      { id: "r-hidden", label: "Hidden headers", role: "menuitemcheckbox", checked: false },
    ],
  },
  {
    label: "Body view",
    items: [
      { id: "r-pretty", label: "Pretty", role: "menuitemradio", checked: true },
      { id: "r-raw", label: "Raw", role: "menuitemradio" },
      { id: "r-hex", label: "Hex", role: "menuitemradio" },
    ],
  },
];

const stateMenu = [
  {
    items: [
      { id: "s-default", label: "Default item", icon: "fas fa-circle" },
      { id: "s-shortcut", label: "With shortcut", icon: "fas fa-circle", shortcut: "⌘K" },
      { id: "s-checked", label: "Selected item", role: "menuitemcheckbox", checked: true },
      { id: "s-disabled", label: "Unavailable item", icon: "fas fa-circle", disabled: true },
    ],
  },
  {
    items: [{ id: "s-danger", label: "Delete project", icon: "fas fa-trash", destructive: true }],
  },
];

const shortMenu = [
  {
    items: [
      { id: "d-copy", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      { id: "d-replay", label: "Send to Replay", icon: "fas fa-paper-plane", shortcut: "⌘R" },
      { id: "d-scope", label: "Add to scope", icon: "fas fa-circle-plus" },
    ],
  },
];

const subMenu = [
  {
    items: [
      { id: "t-copy", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      {
        id: "t-copy-as",
        label: "Copy as",
        icon: "fas fa-file-export",
        submenu: [
          { id: "t-curl", label: "cURL", icon: "fas fa-terminal" },
          { id: "t-raw", label: "HTTP request", icon: "fas fa-file-code" },
          { id: "t-fetch", label: "Fetch", icon: "fas fa-code" },
          { id: "t-python", label: "Python requests", icon: "fas fa-cube" },
        ],
      },
      {
        id: "t-send-to",
        label: "Send to",
        icon: "fas fa-share",
        submenu: [
          { id: "t-replay", label: "Replay" },
          { id: "t-automate", label: "Automate" },
          { id: "t-intercept", label: "Intercept" },
        ],
      },
    ],
  },
];

const groupedMenu = [
  {
    items: [
      { id: "g-copy", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      { id: "g-replay", label: "Send to Replay", icon: "fas fa-paper-plane", shortcut: "⌘R" },
      { id: "g-scope", label: "Add to scope", icon: "fas fa-circle-plus" },
    ],
  },
  {
    items: [
      { id: "g-save", label: "Save to file…", icon: "fas fa-floppy-disk", shortcut: "⇧⌘S" },
      { id: "g-compare", label: "Compare", icon: "fas fa-code-compare" },
    ],
  },
  {
    items: [{ id: "g-delete", label: "Delete request", icon: "fas fa-trash", shortcut: "⌫", destructive: true }],
  },
];

const flatMenu = [
  {
    items: [
      { id: "f-copy", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      { id: "f-replay", label: "Send to Replay", icon: "fas fa-paper-plane", shortcut: "⌘R" },
      { id: "f-scope", label: "Add to scope", icon: "fas fa-circle-plus" },
      { id: "f-save", label: "Save to file…", icon: "fas fa-floppy-disk", shortcut: "⇧⌘S" },
      { id: "f-compare", label: "Compare", icon: "fas fa-code-compare" },
      { id: "f-delete", label: "Delete request", icon: "fas fa-trash", shortcut: "⌫", destructive: true },
    ],
  },
];

const dangerLastMenu = [
  {
    items: [
      { id: "k-copy", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      { id: "k-replay", label: "Send to Replay", icon: "fas fa-paper-plane", shortcut: "⌘R" },
    ],
  },
  {
    items: [{ id: "k-delete", label: "Delete request", icon: "fas fa-trash", shortcut: "⌫", destructive: true }],
  },
];

const dangerFirstMenu = [
  {
    items: [{ id: "b-delete", label: "Delete request", icon: "fas fa-trash", shortcut: "⌫", destructive: true }],
  },
  {
    items: [
      { id: "b-copy", label: "Copy URL", icon: "fas fa-copy", shortcut: "⌘C" },
      { id: "b-replay", label: "Send to Replay", icon: "fas fa-paper-plane", shortcut: "⌘R" },
    ],
  },
];

const shortLabelMenu = [
  {
    items: [
      { id: "sl-copy", label: "Copy URL", icon: "fas fa-copy" },
      { id: "sl-replay", label: "Send to Replay", icon: "fas fa-paper-plane" },
      { id: "sl-delete", label: "Delete request", icon: "fas fa-trash", destructive: true },
    ],
  },
];

const longLabelMenu = [
  {
    items: [
      { id: "ll-copy", label: "Copy this request's URL to the clipboard", icon: "fas fa-copy" },
      { id: "ll-replay", label: "Send this request over to the Replay tab", icon: "fas fa-paper-plane" },
      { id: "ll-delete", label: "Delete this request from the history", icon: "fas fa-trash", destructive: true },
    ],
  },
];

const toggleMenu = [
  {
    label: "Display",
    items: [
      { id: "tg-wrap", label: "Word wrap", role: "menuitemcheckbox", checked: true, shortcut: "⌥Z" },
      { id: "tg-hidden", label: "Hidden headers", role: "menuitemcheckbox", checked: false },
    ],
  },
];

const flipMenu = [
  {
    label: "Display",
    items: [
      { id: "fl-wrap", label: "Disable word wrap", icon: "fas fa-circle", shortcut: "⌥Z" },
      { id: "fl-hidden", label: "Show hidden headers", icon: "fas fa-circle" },
    ],
  },
];
</script>

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Surfaces

Three surfaces and no more: the context menu, the menu-button menu, and the submenu. The context menu renders open here so it can be read without a right-click.

<Preview title="Context menu, rendered open" note="panel radius 6px, item 2px, inset 4px">
  <DsMenu label="Actions for request 41" :groups="rowMenu" />
</Preview>

<Preview title="Menu button" note="opens on Enter, Space, Down or Up">
  <DsMenu surface="button" trigger-label="Actions" label="Actions for request 41" :groups="rowMenu" />
</Preview>

### Item roles

Three interactive roles, fixed by WAI-ARIA. A checkbox item keeps the menu open so several can be flipped, a radio item closes it.

<Preview title="Action, toggle, choice" note="group labels shown only where grouping is not evident">
  <DsMenu label="View options" :groups="roleMenu" />
</Preview>

### States

Disabled items stay in the focus order. Destructive items change ink only, never a fill.

<Preview title="Default, selected, disabled, destructive" note="hover and focus share one state layer">
  <DsMenu label="Project actions" :groups="stateMenu" />
</Preview>

### Density

The three panels below are the only item heights the system ships.

<Preview title="Compact" note="item height 24px">
  <DsMenu density="compact" label="Compact menu" :groups="shortMenu" />
</Preview>

<Preview title="Default" note="item height 28px">
  <DsMenu label="Default menu" :groups="shortMenu" />
</Preview>

<Preview title="Comfortable" note="item height 32px, padding-inline 12px">
  <DsMenu density="comfortable" label="Comfortable menu" :groups="shortMenu" />
</Preview>

### Submenus

Depth one only. Dwell on a parent to open it.

<Preview title="Submenu, depth 1" note="overlaps the parent panel by 4px">
  <DsMenu label="Request actions" :groups="subMenu" />
</Preview>

### Keyboard

Open this one and drive it. Every key in the contract works here.

<Preview title="The whole keyboard model" mode="page">
  <DsMenu surface="button" trigger-label="Request actions" label="Actions for request 41" :groups="rowMenu" />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | | Names the object the menu acts on. Becomes the panel's `aria-label`. |
| `groups` | `DsMenuGroup[]` | | Ordered groups. A separator is drawn between them. |
| `density` | `compact` `default` `comfortable` | `default` | Item height 24, 28 or 32px. Bind it to the global density mode. |
| `surface` | `inline` `button` | `inline` | `button` ships the trigger and its open and close behaviour. |
| `triggerLabel` | string | `Actions` | Trigger text, used when `surface` is `button`. |

### Item and group types

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique within the menu. Used for focus and type-ahead. |
| `label` | string | The action, verb first. Also the item's accessible name. |
| `icon` | string | FontAwesome class, for example `fas fa-copy`. Rendered `aria-hidden`. |
| `shortcut` | string | The literal binding, right-aligned in tabular numerals. |
| `role` | `menuitem` `menuitemcheckbox` `menuitemradio` | Defaults to `menuitem`. |
| `checked` | boolean | Initial state for a checkbox or radio item. |
| `disabled` | boolean | Stays focusable and announced, and cannot be activated. |
| `destructive` | boolean | Ink change only. Action items in the last group. |
| `submenu` | `DsMenuItem[]` | Depth one. A submenu item may not carry its own submenu. |
| `group.label` | string | Optional heading. Gives the group `role="group"` and a matching label. |

### Panel geometry

| Property | Value | Source |
|---|---|---|
| Padding | 4px | Spectrum ships `popover-padding: 8px` at a 16px root, the same proportion here. |
| Radius | 6px, `rounded-md` | The container radius shared by cards, popovers, menus and tooltips. |
| Item radius | 2px, `rounded-xs` | Concentric arcs: `r_inner = max(0, R - p)` = `6 - 4`. |
| Border | 1px `border-control` | A menu floats over unknown content. SC 1.4.11 sets 3:1 on both sides. |
| Elevation | `shadow-md`, the same in both themes | The preset emits no dark shadow, so in dark the border and the surface carry the panel. |
| min-inline-size | 176px | One 16px step below Spectrum's smallest field width of 192px. |
| max-inline-size | 320px | Roughly 45 characters after the 32px label origin and 8px trailing inset. |
| max-block-size | `min(60vh, 100vh - 16px)` | Past this the panel scrolls. More than 60vh of items is a list. |
| Separator | 1px rule, 4px above and below | A 9px band. Never expressed as extra margin. |
| Group label row | Item height, 12 / 16 at weight 600 | APCA's font matrix does not admit 12px at weight 400. |

### Item geometry

| Part | Size | Rule |
|---|---|---|
| Item box | 24 / 28 / 32px | The whole activation target. Height is a token, never a font consequence. |
| Leading rail | 16px, fixed | Holds the icon or the check glyph. Reserved even when empty. |
| Label | 14 / line-height 1 | First glyph sits 32px from the panel's inner edge. |
| Shortcut hint | 12 / 16, tabular | Right-aligned. Present only when a binding exists. |
| Trailing rail | 16px | Holds the submenu caret, `fas fa-caret-right`. Reserved per group, not per panel. |

Label origin is arithmetic, not taste: padding-inline 8px + rail 16px + gap 8px = 32px. Spectrum ships the same number as `menu-item-edge-to-content-not-selected-medium`, so checking an item never shifts its text.

The rail is fixed at 16px because FontAwesome Solid glyphs are drawn in a 512-unit em with advance widths from 448 to 512. A column of icons aligns only inside a fixed-width box.

### Class strings

These are the classes the component applies, unchanged from the product.

```html

<div role="menu" aria-label="Actions for request 41"
     class="min-w-[176px] max-w-[320px] rounded-md border border-control bg-raised p-1 shadow-md">
```

```html

<div role="menuitem" tabindex="-1"
     class="flex min-h-sm items-center gap-2 rounded-xs px-2 text-body font-medium leading-none text-ink">
  <span class="flex h-[16px] w-[16px] flex-none items-center justify-center text-code text-ink-muted">
    <i class="fas fa-copy" aria-hidden="true"></i>
  </span>
  <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">Copy URL</span>
  <span class="ml-[20px] flex-none text-caption tabular-nums text-ink-muted" aria-hidden="true">⌘C</span>
</div>
```

```html

<div role="separator" class="my-1 h-px bg-separator"></div>
<div role="menuitem" tabindex="-1" class="… text-danger-ink">Delete request</div>
<div role="menuitem" tabindex="-1" aria-disabled="true" class="… cursor-not-allowed text-ink-faint">Compare</div>
```

Item height is `min-h-xs`, `min-h-sm` or `min-h-md` with `items-center` and no block padding.

The state layer is the surface's own ink at a fixed alpha, so the cue survives on every surface a menu lands on.

```html

class="hover:bg-[color-mix(in_srgb,var(--c-fg-default)_10%,transparent)]
       active:bg-[color-mix(in_srgb,var(--c-fg-default)_14%,transparent)]"
```

The item focus ring is 3px and inset, unlike every other control in the system.

```html
class="focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]
       focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]"
```

Elevation is one `shadow-md` and nothing else. A menu never carries a tinted halo, because the preset ships no dark shadow at all and a light-tinted blur in dark reads as a glow rather than as depth.

Colours are role classes, never hex. `bg-raised` and `text-danger-ink` resolve per theme, so the same markup is correct in light and dark.

</template>

<template #usage>

### When to use

Use a menu to answer "what can I do to this?" for an object the user has already identified: a request row, a project, a plugin, a tab. The invocation names the object, so no item has to name it again.

Three properties follow.

- **Transient.** It opens, one item is chosen or it is dismissed, and it closes, so nothing inside may hold unsaved state.
- **Commits on activation.** No Apply, no Cancel, no confirmation step inside the panel.
- **A superset.** The context menu lists every action on the object, and the toolbar lists the frequent subset.

### Use something else when

| Situation | Use instead | Why |
|---|---|---|
| The list holds values to store | [Select](/components/select) or listbox | A menu changes state on activation. A select holds a value until submit. |
| There are two choices | Toggle, checkbox, or two buttons | Carbon: do not use a dropdown when there are two options. |
| The panel needs a form or a preview | Popover | Two focusable children in one row break the roving tabindex model. |
| More than about 15 items | Command palette | At 28px per item, 15 items is 420px of vertical travel. |
| The item goes to a destination | Link, tab, or sidebar entry | A `menuitem` hands the browser no destination. |
| The action is app-scoped, not object-scoped | Toolbar button | It has no object, so a context menu has nothing to anchor it to. |
| The panel would carry progress or an error | Inline alert or toast | A menu reporting progress holds focus with nothing operable in it. |

### Context menu against toolbar

Scope decides the surface, and frequency decides whether the action is also on the toolbar.

**Every object-scoped action appears in that object's context menu.** The context menu is the only place a user can enumerate what an object supports, and an incomplete enumeration is not trustworthy.

**Nothing is menu-only for keyboard users.** Every item is also reachable through a shortcut, a toolbar control, or the command palette, because right-click is a pointer gesture and WCAG 2.2 SC 2.1.1 is Level A.

### Grouping

<DoDont
  do="Split the items into groups of two to five, divided by a rule."
  dont="A flat block hides where the destructive item begins.">
  <template #do>
    <DsMenu label="Actions for request 41" :groups="groupedMenu" />
  </template>
  <template #dont>
    <DsMenu label="Actions for request 41" :groups="flatMenu" />
  </template>
</DoDont>

A menu carries at most four groups. Never two consecutive separators, and never a separator as the first or last child of a panel. Item order is fixed at design time, because a menu is operated by muscle memory after the second use.

### Destructive actions

<DoDont
  do="Put the destructive item alone in the last group."
  dont="Delete sits first, one Enter from the opening highlight.">
  <template #do>
    <DsMenu label="Actions for request 41" :groups="dangerLastMenu" />
  </template>
  <template #dont>
    <DsMenu label="Actions for request 41" :groups="dangerFirstMenu" />
  </template>
</DoDont>

Danger is ink only, never a fill, and the background stays neutral in hover, focus and pressed. `--c-danger-fg` measures 5.930:1 in light and 6.206:1 in dark against the selected state layer over `--c-bg-raised`, above the system's 4.59:1 text floor.

An action that cannot be undone opens a confirmation dialog and carries a trailing ellipsis. The menu is not the confirmation.

### Labels

<DoDont
  do="Name the action verb first, in four words or fewer."
  dont="Sentence labels truncate and cut the word that tells them apart.">
  <template #do>
    <DsMenu label="Actions for request 41" :groups="shortLabelMenu" />
  </template>
  <template #dont>
    <DsMenu label="Actions for request 41" :groups="longLabelMenu" />
  </template>
</DoDont>

<DoDont
  do="Name the thing; the check mark carries the state."
  dont="A flipped label contradicts the state it announces.">
  <template #do>
    <DsMenu label="View options" :groups="toggleMenu" />
  </template>
  <template #dont>
    <DsMenu label="View options" :groups="flipMenu" />
  </template>
</DoDont>

### Sizing

One ladder, driven by the global density mode. There is no per-instance size prop, because two item heights on one screen is a defect with a settings screen in front of it.

| Density | Item height | padding-inline | Radius | Type |
|---|---|---|---|---|
| Compact | 24px | 8px | 2px | 14 / 1 / 500 |
| Default | 28px | 8px | 2px | 14 / 1 / 500 |
| Comfortable | 32px | 12px | 2px | 14 / 1 / 500 |

The tallest inline box in an item is the 16px icon rail, not the 14px label.

```
height = line box + 2 x padding-block + 2 x border
compact       24 = 16 + 2 x 4 + 2 x 0
default       28 = 16 + 2 x 6 + 2 x 0
comfortable   32 = 16 + 2 x 8 + 2 x 0
```

Nothing goes below 24px. WCAG 2.2 SC 2.5.8 Target Size (Minimum) is met at 24 x 24 CSS px, and its Understanding document illustrates the criterion with menu items: Figure 8 passes at 24 CSS px and fails the same menu at 18 CSS px.

Items stack at zero separation, so the spacing exception is unavailable.

Type does not change with density. Changing font-size per density multiplies the contrast pairs to verify and makes text jump between a menu and the button that opened it.

### Positioning and dismissal

| Behaviour | Rule |
|---|---|
| Context menu anchor | The pointer position, or the focused object when opened from the keyboard. |
| Menu-button anchor | Trigger's inline start, offset 4px so the panel clears the trigger's focus ring. |
| Collision | Flip on the block axis, then shift on the inline axis, then clamp with 8px viewport margin. |
| Overflow | The panel scrolls internally. No scroll arrows and no fade masks. |
| Dismissal | Escape, item activation, outside pointer-down, a scroll of the region, or window blur. |
| Outside click | The dismissing pointer-down is consumed and does not activate what is beneath it. |

Dismissing a menu over a request list must not also select a row or press a delete button that happened to sit under the pointer.

### Submenus

Depth one. A menu may open a submenu, and a submenu may not, because every level adds a pointer path that can be lost and a Left Arrow unwind to track.

| Behaviour | Value | Basis |
|---|---|---|
| Open on dwell | 150ms | Atlassian's published dropdown entrance duration. |
| Close after leave | 300ms grace | Twice the open delay, so an overshoot is not punished. |
| Diagonal tolerance | Safe triangle | From Ben Kamens' analysis of the Amazon mega dropdown. |
| Placement, inline | Overlaps the parent panel by 4px | Shortens the pointer path. |
| Placement, block | First item at the parent item's block start minus 4px | Lands under the pointer's arrival point. |

Windows exposes a 400ms dwell through `SPI_GETMENUSHOWDELAY`, tuned for a menu bar crossed by accident. A menu opened by right-click has already declared intent, so 150ms is the value here.

A submenu holds three items or more. Below three, promote the items into the parent behind a separator, because a dwell delay plus a direction change costs more than the space saved.

### States

At most one item in the open menu stack is highlighted, and moving the pointer over an item moves DOM focus to it. Hover and keyboard focus are the same state, so they take the same layer, and `:focus-visible` is what separates them.

| State | Item background | Label | Leading icon | Shortcut hint |
|---|---|---|---|---|
| Default | none | `--c-fg-default` | `--c-fg-icon` | `--c-fg-muted` |
| Hover | focus layer, 10% | `--c-fg-default` | `--c-fg-icon` | `--c-fg-muted` |
| Focus-visible | focus layer plus a 3px inset ring | `--c-fg-default` | `--c-fg-icon` | `--c-fg-muted` |
| Pressed | pressed layer, 14% | `--c-fg-default` | `--c-fg-icon` | `--c-fg-muted` |
| Selected | none | `--c-fg-default` | check glyph in `--c-fg-default` | `--c-fg-muted` |
| Submenu open | focus layer, held while the child is open | `--c-fg-default` | `--c-fg-icon` | caret `--c-fg-icon` |
| Disabled | none, in every interaction | `--c-fg-disabled` | `--c-fg-disabled` | `--c-fg-disabled` |
| Destructive | none, or the focus layer on hover | `--c-fg-danger` | `--c-fg-danger` | `--c-fg-muted` |

Loading, error, read-only and indeterminate do not apply. A menu is built from a known item set at open time, carries no input, and holds no value to protect. For a mixed selection, ship explicit "Enable" and "Disable" actions rather than a third state that Enter cannot resolve.

### Accessibility

| Element | Role | Required attributes |
|---|---|---|
| Panel | `menu` | `aria-label` naming the object, or `aria-labelledby` on the trigger |
| Action item | `menuitem` | `tabindex="-1"`, or `0` on the active item |
| Toggle item | `menuitemcheckbox` | `aria-checked="true"` or `"false"` |
| Choice item | `menuitemradio` | `aria-checked`, inside a `role="group"` |
| Separator | `separator` | Not focusable. Horizontal is the default inside a vertical menu |
| Submenu parent | `menuitem` | `aria-haspopup="menu"` and `aria-expanded` |
| Trigger | `button` | `aria-haspopup="menu"` and `aria-expanded` |
| Unavailable item | any of the three | `aria-disabled="true"`, and it stays in the focus order |

An item's accessible name comes from its own text. An icon inside an item is `aria-hidden="true"` and contributes nothing, and an item with no visible label is an icon button in the wrong container.

#### Keyboard

From the WAI-ARIA Authoring Practices, Menu and Menubar pattern.

| Key | Behaviour |
|---|---|
| Enter | Activates the item and closes the menu. On a submenu parent, opens it and focuses the first item. |
| Space | Same as Enter for an action. Toggles a checkbox or radio item, and a checkbox leaves the menu open. |
| Down Arrow | Moves focus to the next item, wrapping from the last to the first. |
| Up Arrow | Moves focus to the previous item, wrapping from the first to the last. |
| Right Arrow | On a submenu parent, opens it and focuses the first item. Otherwise no effect. |
| Left Arrow | Inside a submenu, closes it and returns focus to the parent item. |
| Home / End | Moves focus to the first or the last item. |
| Printable character | Moves focus to the next item whose label starts with it. Repeats cycle through matches. |
| Escape | Closes the menu holding focus and returns focus to the parent item or the trigger. |
| Tab | Closes the whole menu stack and moves to the next element in the page tab sequence. |

Invocation, which the APG does not cover:

| Key | Behaviour |
|---|---|
| Shift + F10 | Opens the context menu for the focused object, anchored to it, focus on the first item. |
| Menu key | Same as Shift + F10, where the keyboard has the key. |
| Enter, Space, Down | Opens a menu button with focus on the first item. |
| Up Arrow | Opens a menu button with focus on the last item. |

At least one keyboard invocation is mandatory on every object that has a context menu.

#### Focus

Focus is real, not simulated. Items carry `tabindex="-1"`, the active item carries `tabindex="0"`, and DOM focus moves with the highlight. On close, focus returns to the element the menu opened from.

The menu is not modal and needs no inert background, but it consumes arrow keys and Escape while open. The panel keeps 8px of viewport margin so the focused item's ring is never clipped, which is what SC 2.4.11 Focus Not Obscured asks for.

The item ring is 3px and inset. SC 2.4.13's Understanding document states the inset case directly: an inset indicator "would need to be at least 3px thick to pass". A 2px ring at 2px offset would bleed 4px outside the item box, where the panel inset clips it and the row above collides with it.

#### Contrast floors

| Part | Floor | Basis |
|---|---|---|
| Item label, on every state layer | 4.5:1 | SC 1.4.3. At 14px nothing here qualifies as large text. |
| Shortcut hint and group label | 4.5:1, weight 600 for the label | SC 1.4.3, plus the APCA font matrix at 12px. |
| Leading icon paired with a label | 3:1 | SC 1.4.11. The label carries the meaning. |
| Check indicator | 4.5:1 | Sole visual carrier of checked state. A missed check is a wrong answer. |
| Panel border, both sides | 3:1 | SC 1.4.11 says adjacent colours, plural. A menu floats over unknown content. |
| Focus indicator | 3:1 focused against unfocused | SC 2.4.13, over an area at least that of a 2px perimeter. |
| Disabled item | exempt | The criteria exempt components not available for interaction. |

Express every state layer as the surface's own ink at a fixed alpha, never as a fixed colour, and never use `opacity-*` on a disabled item. A fixed hex tuned against the canvas composites to about 1.00:1 on a raised panel, and opacity gives one item a different ratio on every surface it lands on.

Disabled items stay focusable, so a keyboard user learns the action exists and is unavailable rather than that it does not exist.

### Content

| Rule | Detail |
|---|---|
| Sentence case | "Send to Replay", not "Send To Replay". |
| Verb first | An item is an action: "Copy URL", "Delete project", "Add to scope". |
| Length | Four words or fewer, under 24 characters. A longer label describes a workflow. |
| Ellipsis | An item that opens a dialog ends in a single ellipsis character. |
| Toggle labels never flip | "Word wrap", never alternating "Enable" and "Disable". `aria-checked` carries state. |
| Destructive labels name the object | "Delete request", not "Delete". |
| Multi-select labels carry the count | "Delete 12 requests" for a selection, "Delete request" for one. |
| No object repetition | The invocation already named the object. |
| No terminal punctuation | An item is a label, not a sentence. |
| No help text | An item is one line. An explanation belongs in a dialog or a popover. |
| Shortcut hints are literal | The platform's own modifiers, in tabular numerals so they form a column. |

The APG states the ellipsis rule for the analogous case: append an ellipsis to labels that launch dialogs, for example "Save as…".

The shortcut hint is 12px spot text, and this system's rule is that 12px text never carries information found nowhere else. The hint qualifies, because the binding it shows is also published in the keyboard reference.

</template>

</PageTabs>
