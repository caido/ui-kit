# Using accessibility

How to pick an element, name it, and reach it without a pointer. For the model behind these rules, see [Overview](/foundations/accessibility.md). For every criterion and role, see [Reference](/foundations/accessibility/reference.md).

## Picking the element

Ask what the thing does, then write the element that already does it.

**Does it perform an action?** That is a `button`, even when it looks like a row, a tile or a chevron.

**Does it go somewhere?** That is an `a` with an `href`, which gets middle-click, open-in-new-tab and the status bar for free.

**Does it introduce a section?** That is a heading element, in an order that does not skip levels, styled by a [type role](/foundations/type.md#a-role-is-visual-the-element-is-structural) rather than identified by one.

The two controls below carry the same border, padding and text. Only one of them can show where the keyboard is.

<DoDont>
<template #do-example>
  <button type="button" tabindex="-1" aria-hidden="true" class="flex items-center gap-2 rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default outline outline-2 outline-offset-2 outline-line-focus">
    <i class="fas fa-trash" aria-hidden="true"></i>
    <span>Delete</span>
  </button>
</template>
<template #do>
  <p>A real control, so it takes focus and answers <kbd>Enter</kbd>. The ring is painted here to stand in for the one a browser draws on focus, which costs a real button nothing.</p>
</template>
<template #dont-example>
  <div aria-hidden="true" class="flex items-center gap-2 rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default">
    <i class="fas fa-trash" aria-hidden="true"></i>
    <span>Delete</span>
  </div>
</template>
<template #dont>
  <p>A container with a click handler, so it takes no focus and answers no key. There is no ring to draw.</p>
</template>
</DoDont>

## Naming a control

Every interactive control needs a name, and the component layer turns a missing one into a compile error rather than a review comment.

```vue
<template>
  <CInput [[label="Hostname"]] placeholder="example.com" />
  <CButton [[label="Delete request"]] icon="fas fa-trash" icon-only />
</template>
```

`label` is required on `CInput`, `CSelect`, `CCheckbox`, `CRadio`, `CToggle`, `CSegmented` and `CButton`, so a control built from one of those with no name does not build. `CAutoComplete` and `CDropdown` take no `label` prop, so a name on either is written by hand as an `aria-label`, and `CSearchBar` sets its own. On an input, `hide-label` hides the words and keeps the name. On a button, `icon-only` does the same job.

Neither a placeholder nor a tooltip is a name. A placeholder disappears as soon as somebody types, and a tooltip names its own container while setting nothing on the control.

## Sizing a pointer target

A pointer target is at least **24 by 24 CSS pixels**, from criterion 2.5.8. The floor is in CSS pixels, so it does not relax when somebody lowers their interface text size, which is exactly when a derived height shrinks under it.

<DoDont>
<template #do-example>
  <div class="flex items-center gap-3">
    <span class="flex size-6 items-center justify-center rounded border border-line-selected text-fg-default">
      <i class="fas fa-xmark" aria-hidden="true"></i>
    </span>
    <span class="font-mono text-caption text-fg-muted">24 x 24</span>
  </div>
</template>
<template #do>
  <p>The glyph stays small and the target around it clears the floor, so the control is easy to hit without looking heavier.</p>
</template>
<template #dont-example>
  <div class="flex items-center gap-3">
    <span class="flex size-4 items-center justify-center rounded border border-line-danger text-fg-default">
      <i class="fas fa-xmark text-caption" aria-hidden="true"></i>
    </span>
    <span class="font-mono text-caption text-fg-muted">16 x 16</span>
  </div>
</template>
<template #dont>
  <p>The target is the glyph, so it shrinks with the icon and lands under the floor at every text setting.</p>
</template>
</DoDont>

It applies to targets only. A tag, a status dot and a row that is not itself clickable keep shrinking.

## Revealing something on hover

[States](/foundations/states/usage.md#making-everything-clickable-reachable) covers why a hover-only row action is unreachable. Hiding it with `visibility` or `display` makes it worse: that takes it out of the tab order entirely, so focus can never reach it to reveal it.

Pair every mouse event with its focus equivalent, and reveal with opacity rather than visibility so the control stays focusable while it is faint.

## Giving a double-click a second route

Double-click has no keyboard equivalent, so it is an accelerator rather than an action. Whatever it does has to be reachable another way, usually a context menu or a visible control in the same row.

That second route needs a name of its own. A rename reachable only through an unnamed icon button is not reachable.

## Keeping focus in reading order

Focus moves in DOM order, so a layout that reorders things visually leaves the keyboard walking the screen in an order nobody can see. Reorder the markup rather than the presentation, and keep a positive `tabindex` out of it: it jumps ahead of everything that has none, which reorders the whole page rather than the one control.

Focus also has to stay somewhere visible. If an action removes the element that had focus, send focus somewhere deliberate, because focus left on a removed element falls to the body and the next tab starts from the top.

## Leaving the focus ring alone

You do not write it, and the one thing you must not do is take it away. [States](/foundations/states/usage.md#never-removing-the-focus-outline) covers why it fails silently when you do.

If a ring sits in the wrong place rather than being unwanted, move it with an offset.

## Not trusting a green build

The lint rules catch a click handler with no key handler, an element that cannot take focus, and a control with no label, all at error. What they do not look at is a click handler on a component: that is skipped entirely, whatever it says.

So a container carrying `@click="row.open"` passes every check in the repository while being unreachable by keyboard, and so does any click handler you move onto a component to tidy the template. A `@mouseover` is the exception among handlers: that is still checked on a component. The name check also reaches `CDropdown`, because the lint configuration names it.

Tab to anything you have built out of a container before you believe the build. If the keyboard cannot reach it, nothing the linter said about it matters.
