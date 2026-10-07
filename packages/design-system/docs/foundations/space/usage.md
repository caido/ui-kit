# Using space

How to pick a rung and apply it. For the model behind these rules, see [Overview](/foundations/space.md). For every value, see [Reference](/foundations/space/reference.md).

## Picking a rung

Start from what the space is separating, not from how it looks.

**Is it inside one thing?** A gap between a thing and its own label takes rung 1. The padding inside a control is [its own ladder](/foundations/space/usage.md#padding-a-control-versus-spacing-a-layout).

**Is it between items in a group?** Rung 2 is the default, rung 3 where a row needs more air.

**Is it between groups?** Rung 4 inside a panel, rung 6 between clearly separate sections.

**Is it page level?** Rung 8 between sections of a page, rung 12 around an empty state or an illustration.

If you are between two rungs, take the smaller one, because space added to a dense screen costs a row. [The rungs](/foundations/space/reference.md#the-rungs) lists every value.

## Grouping with space

Use rung 1 or 2 inside a group, and rung 4 between groups. The difference has to be visible, or the grouping is not being communicated at all.

<DoDont image="grouping">
  <template #do>
    <p>A tight gap inside each group and a wider one between them. You can see which label belongs to which field without reading.</p>
  </template>
  <template #dont>
    <p>The same gap everywhere. The labels float between fields, and a reader has to work out the pairing from the words.</p>
  </template>
</DoDont>

::: tip
The same gap everywhere is the most common spacing mistake in a form. It does not look broken, it just makes the screen slower to read.
:::

## Staying on the ladder

An off-ladder value is invisible in isolation. It only shows up next to something that is on the ladder.

<SpacingRow :rung="4" />
<SpacingRow :rung="5" label="gap-5" />

`gap-5` compiles, because the utilities come from the framework. The ladder is what stops you writing it.

## Spacing with the layout components

`HStack` and `VStack` put the gap on the container, so it belongs to the group rather than to each child.

```vue
<template>
  <VStack [[:gap="4"]]>
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
    />
  </VStack>
</template>
```

Putting the space on the container also survives change. Margins on each child double where two meet, collapse where they do not, and have to be rewritten when the order changes.

## Padding a control versus spacing a layout

The air inside a control comes from [its own ladder](/foundations/space.md#control-padding-is-its-own-ladder). Reaching for a layout rung inside a small control is what makes it look inflated.

<DoDont image="padding">
  <template #do>
    <p>6px above and below the label. The control is the line box plus its padding, and no height is written on it.</p>
  </template>
  <template #dont>
    <p>A layout rung used as control padding. The control grows without the label needing it.</p>
  </template>
</DoDont>

## Sizing a dialog

Dialogs take one of three widths rather than a number each: `max-w-dialog-sm`, `max-w-dialog-md` or `max-w-dialog-lg`. [Dialog widths](/foundations/space/reference.md#dialog-widths) says which fits what.

They are fixed in pixels because a dialog is measured against the window rather than against the text inside it.

## Deciding whether a width is a rung at all

Before reaching for the ladder, work out which of [the three](/foundations/space.md#sizes-are-not-spacing) a width is.

**Can you name the thing that sets it, and that thing's size?** Then it is a measurement, and it keeps the number that measurement gives.

**Is it sized for content that does not exist yet?** Then it is an affordance, like a form field. Measuring one and finding lots of spare room is not a reason to shrink it.

**Neither?** Then it is a rung, and it comes off the ladder.

Above the top of the ladder nothing is a rung. A 256px panel is a measurement whatever its class name looks like.

## Sizing an icon-only control

A button with an icon and no label has no label to widen it, so the component library fixes the width at 40 pixels rather than taking it off the ladder. The close control in a dialog is fixed in both axes, at 32 pixels square.

An icon-only button still takes its height from the type, so a toolbar of icon buttons keeps matching the text field beside it at every text setting. Set its height from the spacing ladder instead and it stops moving while its neighbour keeps moving.

## Recognising what is not a rung

**An instruction is not a candidate for the scale.** Filling the parent and resetting to zero say what an element does, not how much room to leave, and roughly half of what looks like spacing in Caido is one of them.

## Reading a spacing value from script

Something that has to compute with a spacing value, like a virtual list needing its row height, reads it from the tokens package rather than repeating the number.

```ts
import { [[rowHeight]] } from "@caido/tokens";

const height = rowHeight(fontSize.value);
```

A number copied into script drifts the moment the token moves, and nothing reports it, because both places still hold a plausible value.

## Writing a length in the right unit

Write a length in the unit of its own axis. A spacing value in `rem` borrows whatever the type scale decides, and the borrowing is invisible from both sides. A border width written in `em`, for example, renders at two widths on two rows that carry different type roles.

## Writing a corner and a border

Write `rounded` for a corner, `rounded-full` for dots, avatars and pills, and `rounded-none` to remove it. For borders, write `border`, `border-2` or `border-4`.

A sized corner such as `rounded-md` is reported at error. A `shadow-*` other than `shadow-none` produces no CSS, so a shadow that did not appear is this rather than a specificity problem. [What not to write](/foundations/space/reference.md#what-not-to-write) lists both.
