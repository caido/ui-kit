# Space

Space in Caido comes from one number. The base unit is **4 pixels**, and every gap, padding and margin is a multiple of it.

Those multiples are called rungs, and there are eight of them counting zero. Picking a rung is the whole job.

This page explains the model. [Usage](/foundations/space/usage.md) shows how to apply it, and [Reference](/foundations/space/reference.md) lists every rung with its value.

## What space is for

Space is not decoration and it is not leftover room. It is the main thing telling a reader which items belong together.

Two elements close together read as one group. The same two elements pushed apart read as unrelated, whatever the words say. So the gap you choose between a label and its field, or between one form group and the next, decides how the screen is understood before anybody reads it.

That is why the values come off a ladder rather than being typed per case. A gap that means *these belong together* has to be visibly smaller than a gap that means *these are separate things*, everywhere in the interface, or the signal stops working.

## The ladder

<SpacingScale />

Eight rungs. The steps stay single as far as rung 4 and widen above it. There is no rung 5, 7, 9, 10 or 11, because a ladder carrying every integer is not a ladder: at those sizes, two values one step apart are not a decision anybody can defend.

**Rungs 2 and 4 carry most of the work.** 8 pixels is the default gap between things in a row, and 16 pixels is the inner padding of a panel or a dialog. Treat those two as the working pair and the rest as deliberate exceptions.

## Where space comes from in a component

Every gap on a screen is either padding inside something or a gap between things. Naming which is which is most of the work.

<Preview
  light="/examples/anatomy-light.svg"
  dark="/examples/anatomy-dark.svg"
  alt="A card with its padding ring and the gap between its title and body marked, each labelled with the rung that sets it"
  caption="The padding belongs to the card. The gap belongs to the group inside it."
/>

The card sets its own padding once, on itself. The gap between the title and the body belongs to the group holding them, not to either item. Neither is written on the children, which is why removing an item or reordering them changes nothing.

## The grid is in pixels, and that is the point

The interface text size is a user setting from 12 to 24, and anything written in `rem` moves with it. A rung written that way would mean 3 pixels for one person and 6 for another, and a number that means two different things is not a rung.

So the grid is written in pixels and stays put. Raising the text size grows the text and the rows that hold it, without inflating the gaps around them.

That is the opposite of how [type](/foundations/type.md) works, and the split is deliberate. Type scales because reading it is the point. Space does not, because it is the distance between things rather than a thing anybody reads.

## Sizes are not spacing

A control height and a panel width answer a different question from how much air to leave between two things. They share a syntax, which is exactly why they get confused: a rule written for spacing looks like it covers sizing, and it does not.

A width is one of three things, and the third is the one that gets shrunk by mistake.

| | What it is | What changes it |
|---|---|---|
| **A rung** | Chosen from the ladder | The ladder changing |
| **A measurement** | Set by what has to fit inside it | The named thing inside it changing size |
| **An affordance** | Sized for content that does not exist yet | Nothing. It has no answer, and that is how you know |

A form field is the clear case of the third. It holds whatever somebody types, so no measurement settles it, and finding lots of spare room inside one is a reason to leave it alone rather than to shrink it.

The question that makes two people agree is **what would have to change for this number to change**. If you cannot name the thing, it is not a measurement.

## Control padding is its own ladder

Below rung 1 sit two half steps, 2 pixels and 6 pixels, and they carry the air inside a control rather than the space between things.

A grid governs the distance between two things. This is the distance between a control's edge and the text inside it, and it is set by what fits a line box rather than by what lines up with a neighbour.

A control that carries text writes no height. Write the type role and the padding, and the height is their sum, which means the control fits its label at every text setting without anybody maintaining a number.

## One radius

Every rectangular surface takes the same corner: **6 pixels**, written `rounded`.

There is no ladder here, because a second rung would encode a rule nobody could learn. The round shape stays `rounded-full`, for dots, avatars and pills, and that is a shape rather than a step.

Radius does not scale with the text setting either, and neither do border widths, the focus ring, or a dialog width.

**A sized corner is never written here.** `rounded-xs`, `rounded-sm`, `rounded-md` and `rounded-lg` are aliased onto the one radius so the component library keeps working, and a lint rule reports one in first party markup, at error. There are also no shadow tokens, so every `shadow-*` except `shadow-none` generates no CSS and reports nothing.

## The layout components carry the gap

Three components put space between things so you do not have to reach for margins: `Stack`, `HStack` and `VStack`. A fourth, `StackItem`, says whether one child grows or shrinks.

The `gap` and `padding` props on the three stacks accept the rungs and nothing else, so an off-ladder value fails typecheck rather than reaching a reviewer.

That guarantee stops at the primitives. A utility class like `p-5` still compiles, because the utilities come from the framework rather than from this system. The ladder is a rule everywhere and a type only there.
