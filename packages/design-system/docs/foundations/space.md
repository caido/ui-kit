# Space

Space in Caido comes from one number. The base unit is **4 pixels**, and every gap, padding and margin is a multiple of it.

Those multiples are called rungs, and there are eight of them counting zero. Picking a rung is the whole job.

This page explains the model. [Usage](/foundations/space/usage.md) shows how to apply it, and [Reference](/foundations/space/reference.md) lists every rung with its value.

## What space is for

Space is the main thing telling a reader which items belong together. Two elements close together read as one group, and the same two pushed apart read as unrelated, whatever the words say.

That is why the values come off a ladder rather than being typed per case. A gap that means *these belong together* has to be visibly smaller than a gap that means *these are separate things*, everywhere in the interface, or the signal stops working.

## The ladder

<SpacingScale />

The steps stay single as far as rung 4 and widen above it. The missing rungs are left out on purpose: at those sizes, two values one step apart are not a decision anybody can defend.

**Rungs 2 and 4 carry most of the work.** 8 pixels is the default gap between things in a row, and 16 pixels is the inner padding of a panel or a dialog. Treat the rest as deliberate exceptions.

## Where space comes from in a component

Every gap on a screen is either padding inside something or a gap between things.

<Preview
  light="/examples/anatomy-light.svg"
  dark="/examples/anatomy-dark.svg"
  alt="A card with its padding ring and the gap between its title and body marked, each labelled with the rung that sets it"
  caption="The padding belongs to the card. The gap belongs to the group inside it."
/>

Neither is written on the children, which is why removing or reordering an item changes nothing.

## The grid is in pixels, and that is the point

The interface text size is a user setting, and anything written in `rem` moves with it. A rung written that way would mean 3 pixels for one person and 6 for another, and a number that means two different things is not a rung.

So the grid stays put in pixels while the text and the rows that hold it grow. That is the opposite of how [type](/foundations/type.md) works, on purpose: type scales because reading it is the point, and space is the distance between things rather than a thing anybody reads.

## Sizes are not spacing

A control height and a panel width answer a different question from how much air to leave between two things. They share a syntax, which is why a rule written for spacing looks like it covers sizing when it does not.

A width is one of three things, and the third is the one that gets shrunk by mistake.

| | What it is | What changes it |
|---|---|---|
| **A rung** | Chosen from the ladder | The ladder changing |
| **A measurement** | Set by what has to fit inside it | The named thing inside it changing size |
| **An affordance** | Sized for content that does not exist yet | Nothing. It has no answer, and that is how you know |

The question that makes two people agree is **what would have to change for this number to change**. [Deciding whether a width is a rung at all](/foundations/space/usage.md#deciding-whether-a-width-is-a-rung-at-all) applies it.

## Control padding is its own ladder

Below rung 1 sit two half steps, 2 pixels and 6 pixels. They carry the air between a control's edge and its text, which is set by what fits a line box rather than by what lines up with a neighbour.

A control that carries text writes no height. The height is the type role plus the padding, so the control fits its label at every text setting.

## One radius

Every rectangular surface takes the same corner: **6 pixels**, written `rounded`. A second rung would encode a rule nobody could learn. The round shape stays `rounded-full`, for dots, avatars and pills, and that is a shape rather than a step.

Radius does not scale with the text setting either, and neither do border widths, the focus ring, or a dialog width. Sized corners and shadows are not written at all, as [What not to write](/foundations/space/reference.md#what-not-to-write) sets out.

## The layout components carry the gap

`Stack`, `HStack` and `VStack` put space between things so you do not have to reach for margins. A fourth, `StackItem`, says whether one child grows or shrinks.

Their `gap` and `padding` props accept the rungs and nothing else, so an off-ladder value fails typecheck. That guarantee stops at the components: a utility class like `p-5` still compiles, because the utilities come from the framework. **The ladder is a rule everywhere and a type only there.**
