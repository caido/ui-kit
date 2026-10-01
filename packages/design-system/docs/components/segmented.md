# Segmented

`CSegmented` switches one value between a small set of choices that exclude each other, and it keeps the whole set on screen while it does. The Markdown and Raw switch in the header of a finding description is where it ships today. Underneath sits the component library's select button, rendered unstyled so the Caido preset decides how it looks, wrapped in a label that names the group.

This page explains the model. [Usage](/components/segmented/usage.md) shows how to apply it, and [Reference](/components/segmented/reference.md) lists the props, the DOM it renders and what it forwards.

## What the component settles

A call site supplies three things: a label, an array of options and a bound model. The geometry, the corners, the selected treatment, the 200 millisecond transition and the accessible name wiring are settled by the component and its preset.

<Preview
  light="/examples/component-segmented-default-light.svg"
  dark="/examples/component-segmented-default-dark.svg"
  alt="A two option segmented control with the first option selected, annotated with its horizontal and vertical padding and the radius of the group"
  caption="The shipped configuration: a hidden label and two options."
/>

**A segmented control shows the whole set without being opened.** That is what it buys over a select, and it is also what it costs: the options have to fit on a row that is usually carrying something else already.

The group is **31 pixels** tall, from a 29 pixel button inside a 1 pixel transparent border. With a visible label above it the whole component measures 51 pixels, and with the label hidden it measures 31, because a label hidden for assistive technology is positioned out of the flow and takes the 4 pixel gap with it.

## When a segmented control fits

**Is the set small, fixed and mutually exclusive?** Then this is the control. Two or three options, each labelled in a word or two, with a set that will not grow the next time the feature does.

It suits switching a view over switching a setting. The one shipped call site changes how a description renders, which is a choice a reader makes, sees the result of immediately, and reverses just as fast. Nothing is submitted and nothing is validated.

## When something else fits better

| Instead of | Reach for |
|---|---|
| A set that grows, or one running past four options | [Select](/components/select.md) |
| Switching between panels of content | [Tabs](/components/tabs.md) |
| One setting that reads as on and off | [Toggle](/components/toggle.md) |
| A choice inside a form where options need more than a word each | [Radio](/components/radio.md) |

Multiple selection is not available here. `multiple` is not a prop and it is not an attribute the component forwards, so the model holds a single value whatever the caller passes. A set that has to take more than one answer belongs in a select, which does declare that prop.

## The group carries the name

The label goes into a span that stays in the DOM, and the group points at it with `aria-labelledby`. Hiding the label swaps the styling class for `sr-only`, which removes it from the page and leaves the name in the accessibility tree.

**The label is text rather than a form label, so clicking it does nothing.** It has no `for` attribute and no element to point at, because the thing it names is a group of buttons rather than a single input. [Accessibility](/foundations/accessibility/usage.md#naming-a-control) owns the wider rule about which name wins.

## What the pattern costs

The rendered DOM is a group of toggle buttons, each reporting `aria-pressed`, rather than a set of radios. So each option is a separate tab stop and the arrow keys do nothing: four options cost four stops on the way through a toolbar.

**The selection cannot be cleared from inside the group.** Clicking the option that is already selected returns early and emits nothing, because the component fixes the underlying empty behaviour off. A model that starts on a value no option carries leaves nothing selected until something outside the group sets it.

Disabling is all or nothing. The `disabled` prop dims the whole group at 60 percent opacity and stops pointer events, and no single option can be turned off on its own. [States](/foundations/states/usage.md#dimming-only-what-is-disabled) owns what that dimming is allowed to cover.

A `class` passed to the component does not reach the DOM, and neither does `style` or a pass-through object. That is the [component contract](/foundations/components.md#presentation-is-blocked-identity-is-not) rather than anything particular to this control, and [Usage](/components/segmented/usage.md#sizing-the-control) shows what to write instead.

## One size and one colour scheme

There is no `size`, no `severity` and no `variant`. The type declares seven props, and it imports neither of the two shared unions, so both narrow to nothing here.

<Preview
  light="/examples/component-segmented-states-light.svg"
  dark="/examples/component-segmented-states-dark.svg"
  alt="Five copies of one segmented button showing the default, hover, selected, focus visible and disabled treatments"
  caption="The variation is per button and comes from the model rather than from a prop."
/>

What does vary is the state of each button. A selected button takes the raised surface as a rounded pill set 4 pixels off the left and top edges and 3 pixels off the right and bottom, and its label moves to the strong foreground. An unselected button keeps the page surface and the subtle foreground, and moves its label to the strong foreground on hover without touching the background. The focus ring comes from the interface wide focus rule rather than from the preset, which is why it matches the ring drawn elsewhere in the interface.
