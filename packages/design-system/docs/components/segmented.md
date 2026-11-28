# Segmented

`CSegmented` switches one value between a small set of choices that exclude each other, and it keeps the whole set on screen while it does. The Markdown and Raw switch in the header of a finding description is where it ships today. Underneath sits the component library's select button, styled by the Caido preset and wrapped in a label that names the group.

This page explains the model. [Usage](/components/segmented/usage.md) shows how to apply it, and [Reference](/components/segmented/reference.md) lists the props, the DOM it renders and what it forwards.

## What the component settles

A call site supplies three things: a label, an array of options and a bound model. The geometry, the selected treatment and the accessible name wiring are settled by the component and its preset.

<Preview
  light="/examples/component-segmented-default-light.svg"
  dark="/examples/component-segmented-default-dark.svg"
  alt="A two option segmented control with the first option selected, annotated with its horizontal and vertical padding and the radius of the group"
  caption="The shipped configuration: a hidden label and two options."
/>

**A segmented control shows the whole set without being opened.** That is what it buys over a select, and it is also what it costs: the options have to fit on a row that is usually carrying something else already. [Geometry](/components/segmented/reference.md#geometry) has the measurements.

## When a segmented control fits

**Is the set small, fixed and mutually exclusive?** Then this is the control: two or three options, each labelled in a word or two, with a set that will not grow.

It suits switching a view over switching a setting. The shipped call site changes how a description renders, a choice a reader sees the result of immediately and reverses just as fast.

## When something else fits better

| Instead of | Reach for |
|---|---|
| A set that grows, or one running past four options | [Select](/components/select.md) |
| Switching between panels of content | [Tabs](/components/tabs.md) |
| One setting that reads as on and off | [Toggle](/components/toggle.md) |
| A choice inside a form where options need more than a word each | [Radio](/components/radio.md) |

The model holds a single value, since `multiple` is neither a prop nor forwarded. A set that takes more than one answer belongs in a select.

## The group carries the name

The label goes into a span that the group points at with `aria-labelledby`. Hiding it removes it from the page and leaves the name in the accessibility tree.

**The label is text rather than a form label, so clicking it does nothing**, because the thing it names is a group of buttons rather than a single input. [Accessibility](/foundations/accessibility/usage.md#naming-a-control) owns the wider rule about which name wins.

## What the pattern costs

The rendered DOM is a group of toggle buttons, each reporting `aria-pressed`, rather than a set of radios. So each option is a separate tab stop and the arrow keys do nothing.

**The selection cannot be cleared from inside the group.** Clicking the selected option emits nothing, so an empty state has to be set from outside.

Disabling is all or nothing: no single option can be turned off on its own. [States](/foundations/states/usage.md#dimming-only-what-is-disabled) owns what that dimming is allowed to cover.

A `class` passed to the component does not reach the DOM, which is the [component contract](/foundations/components.md#presentation-is-blocked-identity-is-not). [Usage](/components/segmented/usage.md#sizing-the-control) shows what to write instead.

## One size and one colour scheme

There is no `size`, no `severity` and no `variant`.

<Preview
  light="/examples/component-segmented-states-light.svg"
  dark="/examples/component-segmented-states-dark.svg"
  alt="Five copies of one segmented button showing the default, hover, selected, focus visible and disabled treatments"
  caption="The variation is per button and comes from the model rather than from a prop."
/>

What does vary is the state of each button. A selected button draws a raised pill behind a strong label, and an unselected one keeps a subtle label that strengthens on hover. The focus ring is the one drawn everywhere else in the interface. [States](/components/segmented/reference.md#states) lists the token behind each.
