# Using icons

How to write an icon, label it, and size it. For the model behind these rules, see [Overview](/foundations/icons.md). For the sizes and component API, see [Reference](/foundations/icons/reference.md).

## Writing an icon

Pass the glyph name. Older names resolve to their current ones automatically, which happens only when the name goes through the prop rather than onto an element as a class.

```vue
<template>
  <CIcon icon="[[fas fa-bug]]" />
</template>
```

## Labelling an icon

This is the decision that matters, and it has exactly two cases.

**The icon sits beside a text label.** It is decorative. Pass no label, and the component hides it from assistive technology so the words are not read twice.

**The icon stands alone.** It is the only thing saying what this is. Pass a label, and the component gives it a role and an accessible name.

<DoDont>
<template #do>

```vue
<template>
  <button>
    <CIcon icon="fas fa-trash" />
    Delete
  </button>
  <button>
    <CIcon icon="fas fa-trash" [[label="Delete"]] />
  </button>
</template>
```

The first is decorative beside its label. The second is alone, so it carries the name.

</template>
<template #dont>

```vue
<template>
  <button>
    <CIcon icon="fas fa-trash" [[label="Delete"]] />
    Delete
  </button>
  <button>
    <CIcon icon="fas fa-trash" />
  </button>
</template>
```

The first reads "Delete Delete". The second is a button with no name at all.

</template>
</DoDont>

## Building an icon-only control

An icon-only button needs **two** things, and neither replaces the other.

**An accessible name**, or the control does not exist for anyone using a screen reader.

**A tooltip**, or a sighted person has no way to learn what the glyph means.

They are two requirements with two different reasons. A tooltip is not an accessible name: the tooltip directive names its own container and sets nothing on the control but a data attribute, so a control with a tooltip and no label is still nameless.

For a button, `CButton` carries the first: `label` is required, and `icon-only` moves it onto the button rather than into the words.

```vue
<template>
  <CButton icon="fas fa-trash" [[label="Delete request"]] [[icon-only]] />
</template>
```

Its pointer target also needs to be at least 24 by 24 CSS pixels, from [criterion 2.5.8](/foundations/accessibility/usage.md#sizing-a-pointer-target). Nothing enforces that, so check it on a small control.

## Sizing an icon

Most of the time, write no size.

An icon beside text inherits the size of that text, which is what keeps the pair together when somebody changes their interface text setting.

<DoDont>
<template #do-example>
  <p class="flex items-center gap-2 text-fg-default"><i class="fas fa-bug" aria-hidden="true"></i> Finding</p>
  <p class="flex items-center gap-2 text-caption text-fg-muted"><i class="fas fa-bug" aria-hidden="true"></i> Finding</p>
</template>
<template #do>
  <p>No size written. Each icon matches the text it sits with, at body and at caption.</p>
</template>
<template #dont-example>
  <p class="flex items-center gap-2 text-fg-default"><i class="fas fa-bug text-title" aria-hidden="true"></i> Finding</p>
  <p class="flex items-center gap-2 text-caption text-fg-muted"><i class="fas fa-bug text-title" aria-hidden="true"></i> Finding</p>
</template>
<template #dont>
  <p>A size written on the icon. It matches neither line, and it holds that one step whatever the text beside it does.</p>
</template>
</DoDont>

For a glyph standing alone with no text beside it, take a rung:

```vue
<template>
  <CIcon icon="fas fa-folder-open" [[size="message"]] />
</template>
```

Do not invent a size between the two. There is no rung there, and a glyph that fits neither is measured against the shape around it rather than against the ladder.

## Choosing which icon

**Check the meaning already exists.** The [vocabulary](/foundations/icons/reference.md#the-vocabulary) lists the glyphs the interface has settled on, so if something already means "finding", use that glyph rather than a second one that also looks like a finding.

**Do not borrow a single-purpose icon.** A bug means a finding. It does not mean an error somewhere else, even though the shape would fit.

**Shapes are reusable.** An arrow, a chevron, a circle and a globe are named after how they look, so the same one doing several jobs is correct rather than drift.

## Deciding not to use an icon

If you are struggling to find a clear icon for every row in a menu or a list, that is a sign the icons are not earning their place.

An icon nobody can read is noise on a screen that is already dense, and a row of them costs more attention than the words would have. Drop the icons and let the words carry the row.
