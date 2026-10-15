# Toggle

`CToggle` is the control for a setting that is on or off and takes effect the moment it moves. It renders a 40 by 24 pixel switch beside a label that it wires to the input itself, and it takes a label and a model as required props.

This page explains the model. [Usage](/components/toggle/usage.md) shows how to write one, and [Reference](/components/toggle/reference.md) lists every prop, event and attribute.

## What the component settles

The track is 40 by 24 pixels with a round knob inside it. Its corner is more than half its height, so the ends draw as semicircles rather than as the single [corner](/foundations/space.md#one-radius) a rectangular surface takes. The label sits 8 pixels away in the caption role and takes the colour of the text around it. [Geometry](/components/toggle/reference.md#geometry) has every measurement.

<Preview
  light="/examples/component-toggle-default-light.svg"
  dark="/examples/component-toggle-default-dark.svg"
  alt="An off switch and an on switch side by side, each captioned with the model value it holds"
  caption="Off and on. Neither shows a visible label, which is how all nine call sites in the interface ship."
/>

**Switching on paints the track and the knob from one pairing**, `fill-secondary` behind `fg-on-secondary`, which is what [colour](/foundations/colour/usage.md#putting-text-on-a-solid-fill) asks for. A switch that is on reads the same amber in both appearances. [Colours](/components/toggle/reference.md#colours) lists every state.

<Preview
  light="/examples/component-toggle-anatomy-light.svg"
  dark="/examples/component-toggle-anatomy-dark.svg"
  alt="An off switch and an on switch at twice size, with the end inset at each and the knob's travel called out"
  caption="The knob travels 16 pixels. The inset at the two ends is not the same number."
/>

**The end inset is 5 pixels when the switch is off and 3 pixels when it is on.** That difference is in the shipped control rather than in the drawing of it.

**The label belongs to the control rather than sitting beside it.** The component pairs the label to the input, so clicking the words moves the switch and assistive technology reads them as the name, as [naming a control](/foundations/accessibility/usage.md#naming-a-control) asks.

## State is the only axis

There is no `size`, no `severity`, no `variant` and no `invalid`, so the shared [vocabulary](/foundations/components.md#the-vocabulary-is-shared-the-defaults-are-not) is absent from the type and the switch measures 40 by 24 pixels wherever it appears.

What varies instead is state: off, on, either of those hovered, disabled, and focused. Hovering swaps the track fill and moves nothing else. Focus is drawn by the interface rather than the preset, on the input's sibling, as [theme](/foundations/theme/usage.md#focusing-a-control-that-hides-its-input) sets out.

The track and the knob animate over 200 milliseconds on different curves, both longer than the [state duration](/foundations/motion.md#two-durations) the rest of the interface moves on.

## When a toggle is the right choice

**A toggle says the change has already happened.** It belongs on a setting that applies as soon as it moves, and on a row in a table of things that are each either running or not. Of the nine call sites in the interface, five are a table row enabling one entry, three are a row in a settings or onboarding panel, and the last is a boolean property in the workflow editor.

At 40 by 24 pixels the switch meets the target floor [accessibility](/foundations/accessibility/usage.md#sizing-a-pointer-target) sets without anything added around it, and a visible label widens the target further.

## When something else fits better

A value that waits for a Save or a Create is a `CCheckbox`, because a checkbox holds a value and a toggle reports a state. A pair that is not `true` and `false` is a checkbox as well, as [Binding a value that is not true or false](/components/toggle/usage.md#binding-a-value-that-is-not-true-or-false) explains.

A toggle cannot be marked invalid, so a control that has to report a validation error needs something else. More than two choices belongs in a `CSegmented` where the options are few, or a `CSelect` where they are not. A label that needs markup is the last case, because the label prop takes plain text.

## What the refusal costs

`CToggle` accepts no `class`, no `style` and no pass-through object, which is the [contract](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) the layer sets.

**The wrapper is a block level flex row**, so `text-align` cannot centre the switch. Four of the five table call sites set `text-align: center` and get a left aligned switch today. [Placing a toggle in a row](/components/toggle/usage.md#placing-a-toggle-in-a-row) shows the fix.

**A disabled toggle still offers its label to the pointer**, with a click that lands and does nothing. Both call sites passing `disabled` hide their labels, so it does not show today.
