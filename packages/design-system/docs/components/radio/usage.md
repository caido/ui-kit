# Using a radio

How to build a set of options and wire it to a model. For every prop, event and attribute, see [Reference](/components/radio/reference.md).

## Building a set of options

A set is several `CRadio` instances bound to one model. Each carries the value it selects and the words that name it, and both of those are required.

```vue
<template>
  <VStack :gap="2">
    <CRadio
      v-model="orientation"
      [[name="orientation"]]
      value="horizontal"
      label="Horizontal"
    />
    <CRadio
      v-model="orientation"
      [[name="orientation"]]
      value="vertical"
      label="Vertical"
    />
  </VStack>
</template>
```

Words written between the tags render nothing, because the label comes from the `label` prop. A model typed to start `undefined` fails typecheck, because `v-model` is required. Where the options come from a list, `v-for` builds the same set with the `name` written as a literal.

## Grouping the set for the keyboard

**Give every option in the set the same `name`.** The browser reads it to decide that several radios are one group, which makes the set a single tab stop and lets the arrow keys move the choice. Without it the choice stays exclusive, because the shared model re-renders the others unchecked, so the loss goes unnoticed with a mouse in hand.

<DoDont image="component-radio-name">
<template #do>
  <p>Pass the same <code>name</code> to every option, so the set is one tab stop and the arrow keys move the choice.</p>
</template>
<template #dont>
  <p>Rely on the shared model alone, which keeps exclusivity and leaves a keyboard user pressing Tab once per option.</p>
</template>
</DoDont>

## Spacing the options apart

**A `class` written on `CRadio` reaches nothing**, so a margin is dropped in silence. Put the gap on the parent, where [space](/foundations/space/usage.md#picking-a-rung) says it belongs. Rung 2 is the default between options in a set, and rung 4 where the rows need more air.

<DoDont image="component-radio-spacing">
<template #do>
  <p>Set the gap once on the stack around the options, so removing or reordering one changes nothing.</p>
</template>
<template #dont>
  <p>Write a margin on the radio itself, which typechecks, renders, and moves nothing.</p>
</template>
</DoDont>

## Matching the value to the model

**`value` is typed `unknown` rather than to the model's type, so a mismatch compiles.** With a string model, an option given `:value="1"` never appears checked, and clicking it writes a number into the model.

Keep the two in step by hand. Where the values come from a generated enum, annotate the model with that enum and take each `value` off it.

```vue
<template>
  <CRadio
    v-model="stack"
    name="network-stack"
    [[:value="SettingsNetworkStack.V1"]]
    label="HTTP/1"
  />
</template>
```

## Naming the set above it

**Each option names itself and the set does not.** Write a heading above it that reads as the question the options answer, immediately above the first option with rung 2 between them, so proximity carries what the markup cannot. Where the set fills a dialog, the dialog title does the same work.

## Disabling an option

`disabled` greys the option and stops it emitting `update:modelValue`.

```vue
<template>
  <CRadio v-model="format" value="p12" :disabled="true" label="PKCS 12" />
</template>
```

**Does the option exist and simply not apply right now?** Then disable it. Where the option would never apply, leave it out of the set instead. [States](/foundations/states/usage.md#choosing-between-read-only-and-disabled) covers the line between a disabled control and a read-only one.

## Hiding the label

`hide-label` adds `sr-only` to the label element. The element, its text and its `for` all stay, so the accessible name survives and the visible words go.

```vue
<template>
  <CRadio v-model="mode" value="raw" hide-label label="Raw" />
</template>
```

That leaves a 20 by 20 pointer target with nothing beside it, under the 24 by 24 floor [accessibility](/foundations/accessibility/usage.md#sizing-a-pointer-target) sets. Reserve it for a radio in a cell or a toolbar where a neighbouring column already carries the words.

## Reacting to a change

`update:modelValue` carries the `value` of the option that was activated. Where the write is all that matters, `v-model` alone is enough and no handler is needed.

```vue
<template>
  <CRadio
    v-model="sidebarPosition"
    :value="option.value"
    :label="option.label"
    [[@update:model-value="onSelectionChange"]]
  />
</template>
```

`@change`, `@focus` and `@blur` are forwarded as well. Avoid `@click`: it lands on the circle rather than the wrapper, and clicking the label fires it too through the synthetic click on the input.

## Passing identity through

`aria-*` attributes land on the input and `data-*` and listeners on the circle, the split [components](/foundations/components.md#forwarding-assumes-the-root-carries-the-semantics) describes. [Attribute forwarding](/components/radio/reference.md#attribute-forwarding) lists every shape.

**`form` passes the filter and associates nothing**, because it settles on a `<div>`. A radio submitted with a form elsewhere on the page needs a native input instead.
