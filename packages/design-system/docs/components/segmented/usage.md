# Using segmented

How to render a segmented control, name it, size it and read what it writes. For the props and the rendered DOM, see [Reference](/components/segmented/reference.md).

## Rendering the control

Three things are required: a `label`, an `options` array, and a `v-model`. One button is rendered per entry in `options`, in array order.

```vue
<script setup lang="ts">
import { CSegmented } from "@proxy-frontend/components";
import { ref } from "vue";

const mode = ref<"markdown" | "raw">("markdown");

const modeOptions = [
  { label: "Markdown", value: "markdown" },
  { label: "Raw", value: "raw" },
];
</script>

<template>
  <CSegmented
    v-model="mode"
    label="Description view"
    [[option-label="label"]]
    [[option-value="value"]]
    :options="modeOptions"
  />
</template>
```

There is no default slot. Option text comes from `options` and `option-label`, and children passed to the component render nothing at all.

## Naming the group

The `label` is the accessible name of the whole group, so it names the question rather than either answer. "Description view" is the name; "Markdown" and "Raw" are the options.

Hide it with `hide-label` where the surrounding markup already asks the question, which is what the finding description header does. The text stays in the DOM and stays the name.

**What would a screen reader announce if the heading beside it were not there?** If the answer is a bare pair of button labels, show the label rather than hiding it.

## Binding the model

A writable computed over a store works the same way a plain ref does. A computed with only a getter refuses the write, so declare both a getter and a setter.

**Set `option-value` whenever an option is an object.** Without it, the emitted value becomes the whole option object, compared deeply against the model rather than by a key.

Check the field named by `option-value` against the type of the model by hand, because `options` stays `unknown[]` and a mismatch passes the typecheck.

## Sizing the control

A `class` on the component is dropped before it reaches the DOM. Size the parent, then let `fluid` fill it.

<DoDont image="component-segmented-width">
  <template #do>
    <p>Put the width on a parent element and let <code>fluid</code> share it between the buttons.</p>
  </template>
  <template #dont>
    <p>Put a width class on the component, where the forwarded attribute allow-list drops it.</p>
  </template>
</DoDont>

`fluid` adds a full width class to the wrapper and makes each button an equal share of the row. In a 400 pixel parent, two buttons measure 199 pixels each instead of **101 pixels and 62 pixels**.

<Preview
  light="/examples/component-segmented-fluid-light.svg"
  dark="/examples/component-segmented-fluid-dark.svg"
  alt="A fluid segmented control filling a 400 pixel parent, and the same control overflowing a 120 pixel parent"
  caption="Equal shares down to the widest label, and no further."
/>

Equal shares stop at the content, because no button shrinks below its own label. In a 120 pixel container the same pair keeps its 101 and 62 pixels and overflows, so shorten the labels rather than the container.

## Choosing the parent

The wrapper is a column flex container, so the group box stretches to whatever the parent gives it even when `fluid` is false. The border is transparent, so a stretched box looks identical to a snug one until something is measured.

<DoDont image="component-segmented-parent">
  <template #do>
    <p>Place it in a flex row, such as an <code>HStack</code>, where the group keeps its content width.</p>
  </template>
  <template #dont>
    <p>Place it in a plain block parent, where the group box spreads and the buttons do not.</p>
  </template>
</DoDont>

::: tip
`fluid` decides how the buttons share the width. The parent decides how wide the box is.
:::

## Disabling the group

`disabled` applies to the whole group, and there is no per option disabling to reach for. When one choice is unavailable for a reason somebody could act on, keep the buttons live and say why beside them, or move to a [select](/components/select.md), which carries a message of its own.

## Reacting to a selection

Watch the model. The group emits `update:modelValue` with the resolved option value, and that is the event the component declares.

```vue
<script setup lang="ts">
import { watch } from "vue";

watch(mode, (next) => {
  [[persistDescriptionMode(next)]];
});
</script>
```

A `@change` listener also fires on the same click, but nothing in the component's own types says so. Treat it as an accident of the wiring rather than as part of the contract.

**A caller that needs an empty state has to keep it outside the group**, because clicking the selected option emits nothing.

## Showing an invalid selection

The preset has an invalid style, and this component has no route to it. Draw the error in the surrounding markup instead: a message under the group, wired the way [feedback](/foundations/feedback/usage.md) sets out. When the message has to be announced, put the live region on the element that owns the field rather than on the group.
