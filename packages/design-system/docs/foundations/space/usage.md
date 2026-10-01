# Using space

How to pick a rung and apply it. For the model behind these rules, see [Overview](/foundations/space.md). For every value, see [Reference](/foundations/space/reference.md).

## Picking a rung

Start from what the space is separating, not from how it looks.

**Is it inside one thing?** A gap between a thing and its own label takes rung 1. The padding inside a control is its own ladder, covered below.

**Is it between items in a group?** Rung 2 is the default, rung 3 where a row needs more air.

**Is it between groups?** Rung 4 inside a panel, rung 6 between clearly separate sections.

**Is it page level?** Rung 8 between sections of a page, rung 12 around an empty state or an illustration.

[Reference](/foundations/space/reference.md#the-rungs) lists every rung with its value and what it is for. If you are between two rungs, take the smaller one, because space added to a dense screen costs a row.

## Grouping with space

The gap between two things says whether they belong together. A label sits tight to its own field, and a wider gap separates one group from the next.

Use rung 1 or 2 inside a group, and rung 4 between groups. The difference has to be visible, or the grouping is not being communicated at all.

<DoDont image="grouping">
  <template #do>
    <p>A tight gap inside each group and a wider one between them. You can see which label belongs to which field without reading.</p>
  </template>
  <template #dont>
    <p>The same gap everywhere. The labels float between fields, and a reader has to work out the pairing from the words.</p>
  </template>
</DoDont>

This is the most common spacing mistake in a form, and it does not look broken. It just makes the screen slower to read.

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

Their `gap` and `padding` props accept only the rungs, so an off-ladder value fails typecheck rather than shipping.

Putting the space on the container also survives change. Margins on each child double where two meet, collapse where they do not, and have to be rewritten the moment the order changes or an item is removed.

## Padding a control versus spacing a layout

The air inside a control comes from a different ladder than the air between things. Reaching for a layout rung inside a small control is what makes it look inflated.

<DoDont image="padding">
  <template #do>
    <p>6px above and below the label. The control is the line box plus its padding, and no height is written on it.</p>
  </template>
  <template #dont>
    <p>A layout rung used as control padding. The control grows without the label needing it.</p>
  </template>
</DoDont>

Do not write the height either. The role sets the line box, the padding sets the rest, and the height is their sum at every text setting.

## Sizing a dialog

Dialogs take one of three widths rather than a number each.

Pick `max-w-dialog-sm` for a confirmation or a single field, `max-w-dialog-md` for a form with a short body, and `max-w-dialog-lg` for the widest forms. [Reference](/foundations/space/reference.md#dialog-widths) has the three widths.

They are fixed in pixels because a dialog is measured against the window rather than against the text inside it.

## Deciding whether a width is a rung at all

Before reaching for the ladder, work out which of the three a width is.

**Can you name the thing that sets it, and that thing's size?** Then it is a measurement, and it keeps the number that measurement gives. The naming is the test, and it has to be falsifiable.

**Is it sized for content that does not exist yet?** Then it is an affordance, like a form field. Measuring one and finding lots of spare room is not a reason to shrink it.

**Neither?** Then it is a rung, and it comes off the ladder.

Above the top of the ladder nothing is a rung. A 256px panel is a measurement whatever its class name looks like.

## Sizing an icon-only control

A button with an icon and no label has no label to widen it, so the component library fixes the width at 40 pixels rather than taking it off the ladder. The close control in a dialog is fixed in both axes, at 32 pixels square.

An icon-only button still takes its height from the type. A toolbar of icon buttons beside a text field keeps matching that field at every interface text setting, because both heights are a line box plus control padding. Set one of them from the spacing ladder instead and it stops moving while its neighbour keeps moving.

## Recognising what is not a rung

One more kind of value looks like spacing and is not, on top of the three widths above.

**An instruction is not a candidate for the scale.** Filling the parent and resetting to zero say what an element does, not how much room to leave, and roughly half of what looks like spacing in Caido is one of them.

## Reading a spacing value from script

Something that has to compute with a spacing value, like a virtual list needing its row height, reads it from the tokens package rather than repeating the number.

```ts
import { [[rowHeight]] } from "@caido/tokens";

const height = rowHeight(fontSize.value);
```

A number copied into script drifts the moment the token moves, and nothing reports it, because both places still hold a plausible value.

## Writing a length in the right unit

Write a length in the unit of its own axis. A spacing value in `rem` borrows whatever the type scale decides, now and in future, and the borrowing is invisible from both sides.

That is not theoretical. A border width written in `em` takes its size from whichever type role its element happens to carry, so the same border renders at two widths on two rows, and nothing about those elements changed to cause it.

## Writing a corner and a border

One radius, written `rounded`. `rounded-full` for dots, avatars and pills. `rounded-none` to remove it.

A sized corner such as `rounded-md` resolves to the same 6 pixels, because it is aliased for the component library, and a lint rule reports it at error if it reaches your markup. A `shadow-*` other than `shadow-none` is the silent case: it produces no CSS and reports nothing, so a shadow that did not appear is this rather than a specificity problem.

Border widths need nothing from this system. Write `border`, `border-2` or `border-4` and leave them alone.
