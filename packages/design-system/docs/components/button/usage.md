# Using the button

How to write a button and choose the three words that describe it. For the model behind those words, see [Overview](/components/button.md). For every prop and the DOM it renders, see [Reference](/components/button/reference.md).

## Writing a button

A button needs a label and a handler. The rest has a default that suits the majority of call sites.

```vue
<template>
  <CButton [[label="Save"]] @click="onSave" />
</template>
```

The label is the visible text and the accessible name at once. `@click` fires with the native `MouseEvent`, so `@click.stop` inside a clickable row stops the row from reacting. With nothing else written, the button is contrast, solid and medium, and submits no form.

## Choosing a severity

Pick the severity from what the command means, and let the colour follow.

**Is this the action the screen exists to perform?** Then `primary`, and one per region. A second primary button beside the first makes neither of them the answer.

**Does the action destroy something?** Then `danger`, whether it is a solid confirm in a dialog or a text button in a settings row.

**Is it an ordinary command?** Then `contrast`, which is the default and needs no writing.

`secondary`, `success`, `info` and `warn` are rare on buttons. Reach for one when the action is about that intent, not to tint a row.

## Choosing a variant

Variant is emphasis, and a region reads best with one step of it. A dialog footer takes a solid confirm and a text cancel. A toolbar takes text buttons throughout, because a strip of solid fills reads as a strip of primary actions.

```vue
<template>
  <div class="flex justify-end gap-2">
    <CButton label="Cancel" [[variant="text"]] @click="onCancel" />
    <CButton
      label="Delete all"
      severity="danger"
      :loading="isDeleting"
      @click="onDeleteAll"
    />
  </div>
</template>
```

The gap and the alignment live on the wrapper, because a button holds no margin of its own.

## Adding an icon

`icon` renders before the label and `trailingIcon` after it. Both are decorative, because the label already carries the name. [Icons](/foundations/icons/usage.md#writing-an-icon) owns the class string itself.

```vue
<template>
  <CButton label="New project" [[icon="fas fa-plus"]] severity="primary" @click="onCreate" />
</template>
```

An icon is worth adding when the glyph is the faster read, such as a plus for create. A row where every button has an icon stops the icons distinguishing anything.

A trailing caret marks a button that opens a menu. The button draws no menu state of its own, so pass `aria-expanded` and `aria-haspopup` from the call site.

```vue
<template>
  <CButton
    label="Export"
    [[trailing-icon="fas fa-caret-down"]]
    variant="outlined"
    :aria-expanded="isOpen"
    aria-haspopup="menu"
    @click="onOpen"
  />
</template>
```

## Building an icon-only button

Set `iconOnly` and keep writing the label. The label stops being drawn and becomes the accessible name instead, which is the naming rule [icons](/foundations/icons/usage.md#building-an-icon-only-control) already sets.

```vue
<template>
  <CButton
    [[v-tooltip.top="'Clear logs'"]]
    label="Clear logs"
    icon="fas fa-trash"
    icon-only
    size="small"
    variant="text"
    @click="onClear"
  />
</template>
```

Attach the tooltip with `v-tooltip`, because a `title` attribute is dropped. A tooltip is not a name in any case, which [accessibility](/foundations/accessibility.md#a-tooltip-is-not-a-name) explains.

::: tip
Always pass an `icon` with `iconOnly`. Nothing in the types requires one, and without it the button renders as an empty control that is still focusable.
:::

## Keeping a row of buttons aligned

Buttons in one row share a height when they share a size, a variant and whether they carry a label.

<DoDont image="component-button-alignment">
  <template #do>
    <p>One size and one variant across the row, with the labelled buttons kept together. The top and bottom edges line up.</p>
  </template>
  <template #dont>
    <p>A labelled button beside an icon-only one at the same size. The icon box is shorter than the label box, so the icon-only button sits 3 pixels short at medium.</p>
  </template>
</DoDont>

A text button is also 2 pixels shorter than a solid or outlined one. When a row needs both, give the container `items-center` and accept that the edges differ, or move the odd control out of the row. [Geometry](/components/button/reference.md#geometry) lists every height.

## Showing that a command is running

Set `loading` while the work is in flight. The button disables itself and a spinner takes the place of the leading icon.

<Preview
  light="/examples/component-button-loading-light.svg"
  dark="/examples/component-button-loading-dark.svg"
  alt="The same button drawn idle and loading, the loading state wider by the width of the spinner and its gap"
  caption="a spinner arrives even on a button that had no icon, and the button grows by 22 pixels at medium."
/>

**The spinner replaces the icon rather than joining it.** A button with no icon gains one, which is where the width jump comes from. When that shift matters, put the button in a fixed-width parent or set `fluid`.

Nothing is announced while loading, so a wait long enough to need words needs them elsewhere on the screen, which [feedback](/foundations/feedback/usage.md#announcing-a-wait) covers.

## Submitting a form

A button inside a form does nothing to that form until it is told to.

```vue
<template>
  <form @submit.prevent="onSubmit">
    <CInput v-model="name" label="Project name" />
    <CButton label="Create" severity="primary" [[type="submit"]] :loading="isCreating" />
  </form>
</template>
```

Leave the other buttons in that form on the default `type`, or the first one a reader presses submits it.

## Filling the width of a parent

```vue
<template>
  <CButton label="New session" severity="primary" [[fluid]] @click="onCreate" />
</template>
```

`fluid` fills the parent, which suits a sidebar column or a narrow panel. A free-standing button grows to fit its label, so a long label only truncates once something bounds the width.

## Naming a button for assistive technology

The label is the name in both forms: a labelled button is named by its text, and an `iconOnly` button by the label it no longer draws. **An `aria-label` passed from a call site is overwritten, so the rendered button carries none.** To change what a button is called, change the label.

Other `aria-*` attributes and any `data-*` attribute reach the button, which is how the onboarding tours find their targets. [Components](/foundations/components/usage.md#passing-identity-through-a-component) covers that route.

## Styling a button

Do not. A `class`, a `style` and the other attributes [Forwarded attributes](/components/button/reference.md#forwarded-attributes) lists are dropped without a warning.

When a button needs a shape the props do not describe, put the spacing on the parent, or add the prop to `CButton` so that every call site gains it.
