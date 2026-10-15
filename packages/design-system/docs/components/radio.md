# Radio

A radio picks one option out of a set where the options exclude each other and the whole set is worth showing at once. `CRadio` is one option rather than the set: a circle, a label, a value, and a model shared with the other options beside it.

The component is thin on purpose, with no size axis, no severity axis and no slots. What it does settle is the part that is easy to get wrong by hand: it always renders a `<label>` wired to the input, so the words are part of the control rather than text sitting near it.

This page explains the model. [Usage](/components/radio/usage.md) shows how to build a set, and [Reference](/components/radio/reference.md) lists the props, events and the markup it renders.

## When a radio is the right control

| Question | Yes | No |
|---|---|---|
| Does choosing one option unchoose the others | A radio or a select | A [checkbox](/components/checkbox.md) per option |
| Are the options worth reading side by side | A radio | A [select](/components/select.md), which hides them until asked |
| Is the set short and settled | A radio | A select, which survives a list that grows |

Three to five options is the band where a radio earns the vertical space it takes. Under three, a [toggle](/components/toggle.md) or a [segmented control](/components/segmented.md) says the same thing in one row. Over five, the set stops being scannable at a glance.

A radio also commits to holding an answer. Clicking the selected option again does not clear it, so a set that starts with nothing chosen needs a model that can hold a value none of the options carries.

## What the component decides for you

<Preview
  light="/examples/component-radio-default-light.svg"
  dark="/examples/component-radio-default-dark.svg"
  alt="An unchecked radio above a selected one, with the twenty pixel circle, the twelve pixel dot and the eight pixel gap to the label marked"
  caption="One geometry, one gap, and a label that is part of the hit target."
/>

The circle, the dot, the gap to the label and the caption role of the label are all fixed, and none of them is a prop. [Geometry](/components/radio/reference.md#geometry) has the measurements.

**The gap to the label is the one piece of spacing the component owns.** The distance between options belongs to the parent, as [space](/foundations/space.md#the-layout-components-carry-the-gap) sets out, and the component holds the caller to it by refusing a `class`, the contract [components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes.

An `id` is generated per instance and written to both the input and the label's `for`, so an accessible name exists without a caller writing one.

## The set is not a group

A radio set holds together because the options share a model. Nothing in the markup says so.

**No `role="radiogroup"` is written anywhere in the interface**, so assistive technology meets a run of unrelated radios rather than one choice, and the heading above the set is ordinary text rather than its name.

The native half of grouping has to be asked for by giving every option the same `name`, which [Usage](/components/radio/usage.md#grouping-the-set-for-the-keyboard) covers. Seven of the eleven call sites in the interface leave it out.

## States rather than variants

<Preview
  light="/examples/component-radio-states-light.svg"
  dark="/examples/component-radio-states-dark.svg"
  alt="Five radios in a row showing the default, hover, focus-visible, checked and disabled states"
  caption="Five painted states, and no axis to pick from."
/>

There is no `size` prop and no `severity` prop. What the component varies over is state: checked against unchecked, enabled against disabled, with hover and keyboard focus painted over either. [Colour by state](/components/radio/reference.md#colour-by-state) lists what each one paints.

Disabled dims the label and fills the circle, the division of labour [states](/foundations/states.md#a-state-owns-a-property) sets out.

## What the colours cost in dark mode

**The checked circle measures 1.98 to 1 against the page in dark mode**, and the unchecked border sits near 2 to 1 in both appearances. Both are under the 3 to 1 that a non-text identifier owes, which [colour](/foundations/colour.md#contrast-and-accessibility) explains.

That is survivable in a settings panel, where the label carries the meaning. It is not survivable as the sole difference between two rows in a dense list, and [colour](/foundations/colour/usage.md#not-relying-on-colour-alone) covers the second signal such a case needs.

## The focus ring comes from outside the preset

**The preset writes no focus style for a radio at all**, because the visible circle sits beside an input at zero opacity. A stylesheet in the interface draws the ring on the focused input's siblings instead, and [theme](/foundations/theme.md#the-preset-draws-no-focus-indicator) owns that contract. Rendered outside that stylesheet, a radio has no visible focus indicator.

## There is no invalid appearance

`invalid` is not a prop and is not forwarded, so the danger border the preset carries cannot be reached through `CRadio`. A message about a missing or wrong choice belongs beside the heading that names the set. [Reference](/components/radio/reference.md#attribute-forwarding) lists what else is dropped on the way in.
