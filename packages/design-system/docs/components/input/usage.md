# Using input

How to put a text field on a screen and wire it up. For what the component decides, see [Overview](/components/input.md). For every prop and attribute, see [Reference](/components/input/reference.md).

## Adding a field to a form

Three props cover the common case: a model, a label and `fluid`. Everything else already has the right default.

```vue
<template>
  <CInput
    id="host"
    v-model="form.host"
    [[:label]]="$t('settings.upstreamProxy.form.host.label')"
    placeholder="caido.io"
    fluid
  />
</template>
```

`label` is required, so a field with no accessible name fails typecheck. `fluid` is what makes the wrapper fill its parent, and all 41 call sites in the interface pass it. Group several fields with a stack and take the gap off the [space ladder](/foundations/space/usage.md#picking-a-rung); the 4px gap between a label and its own field is already inside the component.

## Hiding the label in a table cell

A visible label in every row is repetition, but the name still has to reach a screen reader. `hideLabel` keeps the `<label>`, its text and its `for` association, and takes it out of the visual flow.

```vue
<template #editor="{ data, field }">
  <CInput
    v-model="data[field]"
    :label="$t('projects.table.nameEditorAriaLabel', { name: data.name })"
    [[hide-label]]
    fluid
  />
</template>
```

**Compose the hidden label from the row so it is unique.** Six of the ten hidden-label call sites do this, and each interpolates the record's own name, because a table of thirty fields all called "Name" is a worse outcome than no label at all.

Hiding the label also removes the 4px gap above the field, since an `sr-only` element leaves the flex flow. The block shrinks from 55px to 31px, which is what makes it fit a row.

## Choosing a field kind and a size

`multiline` swaps the `<input>` for a `<textarea>`, and `rows` is the only height control the textarea has. Set them together, because `rows` is bound as `undefined` when `multiline` is false.

<Preview
  light="/examples/component-input-sizes-light.svg"
  dark="/examples/component-input-sizes-dark.svg"
  alt="A small field, a large field and a three-row textarea compared side by side"
  caption="Large moves padding from 6/8 to 12/14 and the height from 31px to 43px."
/>

```vue
<template>
  <CInput
    id="hosts"
    v-model="form.hosts"
    :label="$t('settings.upstreamProxy.form.hosts.label')"
    multiline
    [[:rows]]="10"
    fluid
  />
</template>
```

All 16 multiline call sites pass ten rows, which measures 154px. Match that unless the field holds something shorter than a host list. Do not reach for a drag handle or autogrow either: the component writes `resize-none` and never passes the library's autogrow prop, so the height a caller sets is the height that ships.

`size` takes `small`, the default, or `large`. The shared `medium` is removed from the union, so passing it is a type error rather than a silent fallback. No call site passes `size` at all, so treat the default as the answer unless a specific screen argues otherwise. **On a textarea the prop does nothing**, because the library's textarea declares no `size` prop and the preset reads it as undefined.

## Showing a validation message

`message` renders under the field and points the field's `aria-describedby` at it, but only when `invalid` is true as well. The two flags move together or neither has any effect.

<DoDont image="component-input-message">
  <template #do>
    <p>Set <code>invalid</code> and <code>message</code> together. The border turns to <code>line-danger</code>, the caption appears, and the field is described by it.</p>
  </template>
  <template #dont>
    <p>Pass <code>message</code> on its own. The text is dropped from the DOM, no <code>aria-describedby</code> is written, and the field looks exactly like a valid one.</p>
  </template>
</DoDont>

```vue
<template>
  <CInput
    id="url"
    v-model="form.url"
    :label="$t('settings.aiProviders.form.url.label')"
    :invalid="[[isTouched && !isUrlValid]]"
    :message="isUrlValid ? undefined : $t('settings.aiProviders.form.url.error')"
    required
    fluid
  />
</template>
```

Gate `invalid` on something the user has done rather than on emptiness alone. `required` passes through to the native attribute and draws nothing of its own, but **an empty required field matches the CSS `:invalid` selector before anybody types**, and the preset's `invalid:hover:border-line-danger` outranks the ordinary hover border on specificity. A new form will therefore paint red under the pointer while the `invalid` prop is still false.

## Setting the width

Width cannot come from a class on the tag. The component sets `inheritAttrs: false` and its allow-list drops `class`, `style` and a pass-through styling object, so a utility written there typechecks, renders and changes nothing.

<DoDont image="component-input-width">
  <template #do>
    <p>Put the width on a wrapper you own, and let <code>fluid</code> stretch the field inside it.</p>
  </template>
  <template #dont>
    <p>Write the width class on <code>CInput</code>. It is filtered out before the render, so the field keeps its intrinsic 174px.</p>
  </template>
</DoDont>

```vue
<template>
  <div [[class="w-56"]]>
    <CInput id="port" v-model="form.port" :label="$t('form.port')" fluid />
  </div>
</template>
```

Inside a block parent the wrapper already fills the width, because it is `flex flex-col` and the field stretches on the cross axis. The collapse bites inside a flex row, which is where it is hardest to spot.

## Disabling versus making a field read only

The two look similar and behave differently, so pick by what the user is allowed to do.

<Preview
  light="/examples/component-input-states-light.svg"
  dark="/examples/component-input-states-dark.svg"
  alt="Six fields showing resting, hover, focus, invalid, disabled and read-only"
  caption="Disabled fills the surface and dims it. Read-only erases the border and the caret without moving a pixel."
/>

| | Border | Background | Focusable | Selectable |
|---|---|---|---|---|
| `disabled` | `line-default` | `surface-disabled` at 0.6 | no | no |
| `readonly` | transparent | `surface-page` | yes | yes |

Use `disabled` when the field is unavailable and the value is not worth reading. Put the explanation on a wrapper, because `disabled` adds `pointer-events-none` and a tooltip on the field itself will not fire.

**A read-only field stays in the tab order and keeps its text selectable.** Use it when the value matters but cannot be edited here. It reads as plain text, which suits a table cell and misleads in a form, where it will be taken for a label. Three of the four read-only call sites are inline table editors and the fourth is a preprocessor option, and all four bind the prop to whether editing is enabled at all.

## Passing an identity attribute or a listener

The filter admits four shapes: `data-*`, `aria-*`, an `on[A-Z]` listener, and the three exact names `id`, `name` and `form`. They are bound to the field rather than to the wrapper.

```vue
<template>
  <CInput
    v-model="getData(data).name"
    :label="$t('environment.variables.ariaLabel.name', { name: data.name })"
    hide-label
    fluid
    [[@blur]]="onVariableSave(data)"
  />
</template>
```

That is the whole event surface beyond `v-model`. A native listener arrives as a forwarded attribute, so `@blur`, `@focus`, `@input` and `@keydown` all reach the field without the component declaring any of them.

Do not attach an `aria-describedby` this way. The component binds its own after the forwarded attributes, so a caller's value is overwritten when there is a message and removed when there is not.

## Putting something beside the field

There are no slots. Text written between the tags is discarded, and no icon, unit, prefix or clear control can go inside. Render helper text as a sibling after the component, which is what a settings form with helper text already does.

```vue
<template>
  <VStack :gap="2">
    <CInput id="alias" v-model="form.alias" :label="$t('form.alias.label')" fluid />
    [[<small class="text-fg-muted">{{ $t("form.alias.helper") }}</small>]]
  </VStack>
</template>
```

Reserve that for text that is always visible. When the text is a validation error, use `message` with `invalid` instead, so the wiring to `aria-describedby` comes for free.

## Leaving the focus indicator alone

The preset draws no ring on a text field. The indicator comes from an application rule that gives a focused element a 2px `line-focus` outline, then pulls it onto the boundary for an `input` and a `textarea` by turning the border transparent and the offset to zero. Nothing about that is a prop, and the height does not change when it fires.

Write no focus class on or around the field, and read [theme](/foundations/theme.md#the-preset-draws-no-focus-indicator) before changing anything near it.
