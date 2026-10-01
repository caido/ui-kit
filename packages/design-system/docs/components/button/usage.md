# Using the button

How to write a button and choose the three words that describe it. For the model behind those words, see [Overview](/components/button.md). For every prop and the DOM it renders, see [Reference](/components/button/reference.md).

## Writing a button

A button needs a label and a handler. The rest has a default that suits the majority of call sites.

```vue
<template>
  <CButton [[label="Save"]] @click="onSave" />
</template>
```

The label is required rather than optional, and it is the visible text and the accessible name at once. A `@click` listener is forwarded straight to the native button and fires with the raw `MouseEvent`, so modifiers work as they do on any element: `@click.stop` inside a clickable row stops the row from reacting. With nothing else written, that button is contrast, solid and medium, and its `type` is `button`, so it submits no form by accident.

## Choosing a severity

Pick the severity from what the command means, and let the colour follow.

**Is this the action the screen exists to perform?** Then `primary`, and one per region. A second primary button beside the first makes neither of them the answer.

**Does the action destroy something?** Then `danger`, whether it is a solid confirm in a dialog or a text button in a settings row.

**Is it an ordinary command?** Then `contrast`, which is the default and needs no writing.

`secondary`, `success`, `info` and `warn` exist because the vocabulary is shared, and they are rare on buttons. Reach for one when the action is genuinely about that intent, rather than to tint a row.

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

`icon` takes a FontAwesome class string and renders before the label; `trailingIcon` renders after it. Both are decorative and hidden from assistive technology, because the label already carries the name. [Icons](/foundations/icons/usage.md#writing-an-icon) owns the class string itself.

```vue
<template>
  <CButton label="New project" [[icon="fas fa-plus"]] severity="primary" @click="onCreate" />
</template>
```

An icon is worth adding when the glyph is the faster read: a plus for create, a trash for delete. Giving a whole row of buttons an icon each stops the icons distinguishing anything, so spend them on the commands that earn one.

A trailing caret marks a button that opens a menu rather than running a command on the spot, and six of the seven trailing icons in the interface are that caret. The button draws no state of its own for that menu, so pass `aria-expanded` and `aria-haspopup` from the call site; both reach the native button, because anything starting `aria-` is forwarded.

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

Attach the tooltip with the `v-tooltip` directive. A `title` attribute is filtered out before it reaches the button and renders nothing, and a tooltip is not a name in any case, which [accessibility](/foundations/accessibility.md#a-tooltip-is-not-a-name) explains. Pass an `icon` as well: nothing in the types stops `iconOnly` from being set on a button with no icon, and the result is an empty control that stays focusable and clickable.

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

The same trap catches a row of mixed variants: a text button is 2 pixels shorter than a solid or outlined one, because it carries no border width. When a row genuinely needs both, give the container `items-center` and accept that the edges differ, or move the odd control out of the row.

## Showing that a command is running

Set `loading` while the work is in flight. The button disables itself and a spinner takes the place of the leading icon.

<Preview
  light="/examples/component-button-loading-light.svg"
  dark="/examples/component-button-loading-dark.svg"
  alt="The same button drawn idle and loading, the loading state wider by the width of the spinner and its gap"
  caption="a spinner arrives even on a button that had no icon, and the button grows by 22 pixels at medium."
/>

**The spinner replaces the icon rather than joining it.** A button with `icon="fas fa-floppy-disk"` shows a spinner in place of the disk, and a button with no icon at all gains one, which is where the width jump comes from. When that shift matters, put the button in a fixed-width parent or set `fluid`.

The spinner is drawn for the eye only. Nothing is announced, so a wait long enough to need words needs them somewhere else on the screen, which [feedback](/foundations/feedback/usage.md#announcing-a-wait) covers.

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

`fluid` sets the width to 100 per cent of the parent content box, which is what a button in a sidebar column or a narrow panel wants. Constraining the width is also what makes a long label truncate: a free-standing button grows to fit its label however long it is, so the ellipsis arrives once something bounds the button and not before.

## Naming a button for assistive technology

The label is the name in both forms: a labelled button is named by its text, and an `iconOnly` button is named by the label it no longer draws. An `aria-label` passed from a call site does not survive on a labelled button. It reaches the component and is then overwritten with nothing, so the rendered button carries no `aria-label` at all. Three call sites pass one today, and none of the three names its button. To change what a button is called, change the label.

`aria-description`, `aria-describedby`, `aria-expanded`, `aria-haspopup` and `aria-controls` are unaffected, as is any `data-*` attribute, which is how the onboarding tours find their targets. [Components](/foundations/components/usage.md#passing-identity-through-a-component) covers that route.

## Styling a button

Do not. A `class`, a `style`, a pass-through object and a class-shaped prop under another name are each refused, and the refusal is silent: the attribute is dropped inside the wrapper with no warning and no visual hint.

When a button needs a shape the props do not describe, put the spacing on the parent, or add the prop to the component so that every call site gains it. Write the change in `CButton` rather than at the call site.
