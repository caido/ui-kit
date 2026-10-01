# Using a radio

How to build a set of options and wire it to a model. For the model behind these rules, see [Overview](/components/radio.md). For every prop, event and attribute, see [Reference](/components/radio/reference.md).

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

`label` is a string prop and the template holds no slot, so words written between the tags render nothing at all. `v-model` is required rather than optional, so a model typed to start `undefined` fails typecheck even though the component renders that case unchecked without complaint.

Where the options come from a list, `v-for` builds the same set, with `:value` and `:label` taken off each entry and the `name` written as a literal.

## Grouping the set for the keyboard

**Give every option in the set the same `name`.** It reaches the `<input name>` attribute, which is what the browser reads to decide that several radios are one group.

Leave it off and each option becomes its own tab stop with the arrow keys inert, so reaching the third option costs three presses of Tab and choosing it costs a fourth press of Space. The choice stays exclusive either way, because the shared model re-renders the others unchecked, which is why the loss goes unnoticed with a mouse in hand.

<DoDont image="component-radio-name">
<template #do>
  <p>Pass the same <code>name</code> to every option, so the set is one tab stop and the arrow keys move the choice.</p>
</template>
<template #dont>
  <p>Rely on the shared model alone, which keeps exclusivity and leaves a keyboard user pressing Tab once per option.</p>
</template>
</DoDont>

## Spacing the options apart

**A `class` written on `CRadio` reaches nothing.** The component stops inheriting attributes, and `class` is not one of the four shapes the forwarding filter admits, so a margin is dropped in silence rather than reported.

Put the gap on the parent, where [space](/foundations/space/usage.md#picking-a-rung) says it belongs. Rung 2 is the default between options in a set, and rung 4 where the rows need more air.

<DoDont image="component-radio-spacing">
<template #do>
  <p>Set the gap once on the stack around the options, so removing or reordering one changes nothing.</p>
</template>
<template #dont>
  <p>Write a margin on the radio itself, which typechecks, renders, and moves nothing.</p>
</template>
</DoDont>

## Matching the value to the model

**`value` is typed `unknown` rather than to the model's type, so a mismatch compiles.**

With a model holding a string, an option given `:value="1"` cannot appear checked, because the equality test behind `checked` does not match, and clicking it writes a number into a string model. Nothing reports it.

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

**Each option names itself and the set does not.** Write a heading above it, and keep the words short enough to read as the question the options answer.

That heading is text rather than the set's accessible name, because there is no group element to attach it to. Where the set fills a dialog, the dialog title does the same work. Where it sits among other controls, keep it immediately above the first option with rung 2 between them, so proximity carries what the markup cannot.

## Disabling an option

`disabled` fills the circle with `surface-subtle`, dims the label with `opacity-disabled`, and stops `update:modelValue` being emitted.

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

`@change`, `@focus` and `@blur` reach the control through the listener branch of the forwarding filter. `@click` is the trap: it lands on the library root rather than on the wrapper, and clicking the label reaches it too, because the browser dispatches a synthetic click on the input that bubbles up through that root. Bind `@update:model-value` wherever the selection is what matters.

## Passing identity through

Four shapes reach the markup: `data-*`, `aria-*`, a listener, and the exact names `id`, `name` and `form`. The `aria-*` attributes land on the input and the rest land on the circle, which is the split [components](/foundations/components.md#forwarding-assumes-the-root-carries-the-semantics) describes. An `id` is taken by the component itself and written to both the input and the label's `for`.

`form` is the one worth knowing about. It passes the filter and then settles on a `<div>`, where it associates nothing, so a radio submitted with a form elsewhere on the page needs a native input instead.

Share one `name` across the set, keep `value` the same type as the model, and leave the gap between the options to the stack that holds them.
