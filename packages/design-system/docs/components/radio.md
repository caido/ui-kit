# Radio

A radio picks one option out of a set where the options exclude each other and the whole set is worth showing at once. `CRadio` is one option rather than the set: a circle, a label, a value, and a model shared with the other options beside it.

The component is thin on purpose. Five props and one model, no size axis, no severity axis, no slots. What it does settle is the part that is easy to get wrong by hand. The template renders a `<label>` element on every pass and wires it to the input through `for` and `id`, so the words are part of the control rather than text sitting near it.

This page explains the model. [Usage](/components/radio/usage.md) shows how to build a set, and [Reference](/components/radio/reference.md) lists the props, events and the markup it renders.

## When a radio is the right control

Three questions settle it, and the third is the one that gets skipped.

| Question | Yes | No |
|---|---|---|
| Does choosing one option unchoose the others | A radio or a select | A [checkbox](/components/checkbox.md) per option |
| Are the options worth reading side by side | A radio | A [select](/components/select.md), which hides them until asked |
| Is the set short and settled | A radio | A select, which survives a list that grows |

Three to five options is the band where a radio earns the vertical space it takes. Under three, a [toggle](/components/toggle.md) or a [segmented control](/components/segmented.md) says the same thing in one row. Over five, the set stops being scannable at a glance.

A radio also commits to holding an answer. Clicking the option that is already selected fires no change event, so nothing is emitted and the choice cannot be cleared by clicking it a second time. A set that starts with nothing chosen therefore needs a model that can hold a value none of the options carries.

## What the component decides for you

<Preview
  light="/examples/component-radio-default-light.svg"
  dark="/examples/component-radio-default-dark.svg"
  alt="An unchecked radio above a selected one, with the twenty pixel circle, the twelve pixel dot and the eight pixel gap to the label marked"
  caption="One geometry, one gap, and a label that is part of the hit target."
/>

Three numbers and one type role are fixed, and none of the four is a prop. The circle is **20 by 20 pixels**, the dot inside it is 12 by 12, the gap from the circle to its label is **8 pixels**, and the label is set in the caption role that [type](/foundations/type.md#the-line-between-caption-and-body) defines.

That gap is the one piece of spacing the component owns. The distance from one option to the next, and from the set to the heading above it, belongs to the parent, which is the rule [space](/foundations/space.md#the-layout-components-carry-the-gap) sets. The component holds the caller to it by refusing a `class` outright, the contract [components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes.

The identifier is the other quiet decision. An `id` is generated per instance and used twice, once on the input and once as the label's `for`, so an accessible name exists without a caller writing one. Supplying an `id` replaces the generated one on both sides together.

## The set is not a group

A radio set holds together because the options share a model. Nothing in the markup says so.

**No `role="radiogroup"` is written anywhere in the interface.** A search for that role across the component layer and the interface returns nothing, so assistive technology meets a run of unrelated radios rather than one choice of three, and the heading above the set is ordinary text rather than the set's name.

The native half of grouping is available and has to be asked for. Giving every option the same `name` puts them in one browser radio group, which turns the set into a single tab stop and lets the arrow keys move the choice. Seven of the eleven call sites in the interface leave it out. Exclusivity survives that, because the shared model re-renders the others unchecked, but the keyboard behaviour does not.

## States rather than variants

<Preview
  light="/examples/component-radio-states-light.svg"
  dark="/examples/component-radio-states-dark.svg"
  alt="Five radios in a row showing the default, hover, focus-visible, checked and disabled states"
  caption="Five painted states, and no axis to pick from."
/>

There is no `size` prop and no `severity` prop, so neither of the shared unions applies here. What the component varies over is state: checked against unchecked, enabled against disabled, with hover and keyboard focus painted over either.

Hover is narrower than it looks. The preset writes three hover rules for an unchecked radio. One repaints the dot, which is hidden in that state and so paints nothing, and the other two both set a border colour, where the later rule in the stylesheet wins. The border of the circle is what moves.

Those rules key on the pointer being over the circle rather than over the pair, so crossing the label changes nothing even though clicking the label selects the option.

Disabled dims the label with `opacity-disabled` and fills the circle with `surface-subtle`, the division of labour [states](/foundations/states.md#a-state-owns-a-property) sets out. The text cursor is the one loose end: the label keeps a pointer cursor while the circle correctly takes a default one.

## What the colours cost in dark mode

**The checked circle measures 1.98 to 1 against the page in dark mode.** The unchecked border measures 2.06 light and 2.04 dark. Both sit under the 3 to 1 that a non-text identifier owes, which [colour](/foundations/colour.md#contrast-and-accessibility) explains.

That is survivable in a settings panel, where the label carries the meaning and the set holds two or three rows. It is not survivable as the sole difference between two rows in a dense list, and [colour](/foundations/colour/usage.md#not-relying-on-colour-alone) covers the second signal such a case needs.

## The focus ring comes from outside the preset

**The preset writes no focus style for a radio at all.** The circle on screen is painted beside an input at zero opacity, so an outline on the focused element would paint nothing anybody could see.

A stylesheet in the interface supplies the rule instead, drawing a 2 pixel ring at a 2 pixel offset on the focused input's siblings, which is the geometry the ordinary focus rule uses. [Theme](/foundations/theme.md#the-preset-draws-no-focus-indicator) owns that contract. Rendered outside that stylesheet, a radio has no visible focus indicator.

## There is no invalid appearance

Validation has no look here. `invalid` is not a prop, and it is not one of the attributes the component forwards, so the danger border the preset carries cannot be reached through `CRadio`.

A message about a missing or wrong choice belongs beside the heading that names the set rather than beside any one option. [Reference](/components/radio/reference.md#attribute-forwarding) lists what else is dropped on the way in.
