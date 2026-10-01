# Using checkbox

How to write a checkbox, bind it and hide the parts that do not apply. For what the component decides, see [Overview](/components/checkbox.md). For every prop and attribute, see [Reference](/components/checkbox/reference.md).

## Writing a checkbox

Two things are required and everything else has a default. Pass a `label` and bind a model.

```vue
<template>
  <CCheckbox [[v-model="isIntercepting"]] [[label="Intercept requests"]] />
</template>
```

**The model is required rather than optional.** It is declared with `required: true`, so a checkbox written without one warns at render rather than defaulting to unchecked. The label is a plain string and there is no slot to replace it, so text is the only thing that can go there.

## Binding something other than a boolean

A binary checkbox holds `trueValue` when checked and `falseValue` when not. Both default to `true` and `false`, and setting them turns the control into a two-way switch over any pair.

```vue
<template>
  <CCheckbox
    v-model="resolutionType"
    [[true-value="ip"]]
    [[false-value="upstream"]]
    :label="$t('settings.network.dns.create.useStaticIp')"
  />
</template>
```

Checked-ness here is strict equality against `trueValue`, so an object passed as the true value has to be the same reference rather than an equal one. Keep the pair to strings, numbers or booleans.

## Building a group from one array

**Passing a `value` is what switches the checkbox out of binary mode.** The model becomes an array, checking appends the value and unchecking removes it, and every member of the group binds the same array.

```vue
<template>
  <CCheckbox
    v-for="option in sourcesOptions"
    :key="option.value"
    v-model="selectedSources"
    [[:value="option.value"]]
    :label="option.name"
  />
</template>
```

The model has to be an array, because each update is built from the current one and unchecking filters it. There is no `binary` prop to set alongside this, and three call sites in the interface still pass one that goes nowhere. Presence is tested with `isPresent`, which counts `false` and `0` as present, so a falsy value switches the mode as surely as a string does.

## Deriving the checked state from elsewhere

Where the value lives in a store or is computed from a collection, bind it one way and handle the update.

```vue
<template>
  <CCheckbox
    [[:model-value="!column.isHidden"]]
    :label="column.label"
    [[@update:model-value="onToggleClick(column)"]]
  />
</template>
```

Fourteen of the interface call sites are written this way, and the shape reads the same as `v-model` to everything downstream.

## Showing a partial selection

A parent row over a list of children takes `indeterminate` while some of them are selected. The prop swaps the tick for a dash and tells assistive technology the state is mixed.

<Preview
  light="/examples/component-checkbox-indeterminate-light.svg"
  dark="/examples/component-checkbox-indeterminate-dark.svg"
  alt="An indeterminate checkbox showing a dash on an unchecked box, and the same checkbox after one click showing the dash on a filled amber box"
  caption="One click fills the box. The dash stays until the parent clears the prop."
/>

```vue
<template>
  <CCheckbox
    :model-value="isSelected"
    [[:indeterminate="hasPartialSelection"]]
    :label="collection.name"
    hide-label
    @update:model-value="onSelect"
  />
</template>
```

Clear the partial flag inside `onSelect`. **The component keeps no state of its own to clear.** A prop left true after a click paints the dash over a checked box, and the two indicators differ in size and colour because the dash comes from an icon rather than from the preset.

## Adding a description under a checkbox

`description` renders a caption paragraph below the row and points the input at it with `aria-describedby`. The prop is the only way to get the paragraph, and it overrides any `aria-describedby` passed as an attribute.

```vue
<template>
  <CCheckbox
    v-model="form.temporary"
    :label="$t('projects.createDialog.temporaryLabel')"
    [[:description="$t('projects.createDialog.temporaryDescription')"]]
  />
</template>
```

The paragraph is flush with the box rather than indented under the label text. Where the description has to line up with the label, write the paragraph in the parent and point at it with an `aria-describedby` of your own, which the component forwards to the input.

## Fitting the label to its row

**A long label cannot shorten itself without `fluid`.** The label carries nothing telling it to truncate, so it wraps or overflows instead. `fluid` puts `w-full` on the wrapper and `flex-1 min-w-0 truncate` on the label, which is what a checkbox sitting inside a flex row needs before the label can shrink at all. Reach for it in a table footer, a settings list or a menu, where the width belongs to the column rather than to the label, and see [truncating](/foundations/type/usage.md#truncating-and-when-not-to) for when shortening a string is the wrong answer.

```vue
<template>
  <CCheckbox v-model="isVisible" :label="column.label" [[fluid]] />
</template>
```

Where the name is already printed beside the box, as a tree row prints it, `hideLabel` clips the label rather than removing it. The accessible name survives and the row collapses to the width of the box, because `sr-only` positions the label absolutely and a gap applies only between items still in flow. The row measures 20 pixels rather than the 28 a surviving gap would give, so a column that has to line up with labelled rows above it carries the offset on the parent.

```vue
<template>
  <CCheckbox v-model="isSelected" :label="rule.name" [[hide-label]] />
</template>
```

## Positioning and styling a checkbox

**Nothing class-shaped survives the API.** A `class`, a `label-class`, an `input-class` and a pass-through object are all refused, and the component spec pins that refusal with all four set at once.

<DoDont image="component-checkbox-label">
<template #do>
<p>Pass the label and let the component set the caption role, which it already does.</p>
</template>
<template #dont>
<p>Pass a class-shaped prop. It is dropped before the page, and the six call sites already shipping one prove that nothing reports it.</p>
</template>
</DoDont>

Where a checkbox needs a gap, an alignment or a width around it, put that on the element holding it. `HStack` and `VStack` carry the gap for exactly this reason.

## Choosing between read-only and disabled

Disabled says the setting does not apply right now, and it dims the box and the label to show it. **Read-only carries no appearance here at all.** It blocks the change and leaves the box at full contrast, the cursor a pointer and the control in the tab order.

Use `disabled` when the setting does not apply, and when a value is fixed for a reason the person can act on, set `readonly` and write the reason in a sentence beside it.
