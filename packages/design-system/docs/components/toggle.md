# Toggle

`CToggle` is the control for a setting that is on or off and takes effect the moment it moves. It renders a 40 by 24 pixel switch beside a label that it wires to the input itself, and it takes a label and a model as required props.

This page explains the model. [Usage](/components/toggle/usage.md) shows how to write one, and [Reference](/components/toggle/reference.md) lists every prop, event and attribute.

## What the component settles

The track is 40 by 24 pixels with a 1 pixel border, and the knob inside it is 16 pixels square and fully round. The corner is 16 pixels, written `rounded-2xl` by the preset and resolved through the [theme](/foundations/theme.md#it-is-written-in-class-names-not-in-custom-properties) restoring that name, which is more than half the height, so the ends draw as semicircles rather than as the single 6 pixel [corner](/foundations/space.md#one-radius) a rectangular surface takes.

The gap from the switch to the label is 8 pixels, rung 2, the default gap between things in a row. The label is set in the caption role, [the smaller of the two reading sizes](/foundations/type.md#the-line-between-caption-and-body), and it carries no colour class, so it takes the colour of the text around it.

<Preview
  light="/examples/component-toggle-default-light.svg"
  dark="/examples/component-toggle-default-dark.svg"
  alt="An off switch and an on switch side by side, each captioned with the model value it holds"
  caption="Off and on. Neither shows a visible label, which is how all nine call sites in the interface ship."
/>

**Switching on paints the track and the knob from one pairing.** `fill-secondary` fills the track and `fg-on-secondary` draws the knob, which is the pairing [colour](/foundations/colour/usage.md#putting-text-on-a-solid-fill) asks for, applied by the component rather than left to a call site. Both tokens are single values rather than light and dark pairs, so a switch that is on reads the same amber in both appearances. Off is `surface-subtle` behind a `line-strong` border, with the knob in `fill-neutral`.

<Preview
  light="/examples/component-toggle-anatomy-light.svg"
  dark="/examples/component-toggle-anatomy-dark.svg"
  alt="An off switch and an on switch at twice size, with the end inset at each and the knob's travel called out"
  caption="The knob travels 16 pixels. The inset at the two ends is not the same number."
/>

The knob sits 4 pixels below the top of the track in either state. **The end inset is 5 pixels when the switch is off and 3 pixels when it is on.** The offset that places the knob is measured from inside the 1 pixel border while the width of the track is measured outside it, and that 2 pixel difference is in the shipped control rather than in the drawing of it.

**The label belongs to the control rather than sitting beside it.** The component generates an id, puts it on the input and points the label at it, so clicking the words moves the switch and assistive technology reads them as the name. That is what [naming a control](/foundations/accessibility/usage.md#naming-a-control) asks for, met without a call site arranging it.

## State is the only axis

`CToggleProps` declares three fields: `label`, `hideLabel` and `disabled`. There is no `size`, no `severity`, no `variant` and no `invalid`, so the shared [vocabulary](/foundations/components.md#the-vocabulary-is-shared-the-defaults-are-not) is absent from the type rather than narrowed inside it, and the switch measures 40 by 24 pixels wherever it appears.

What varies instead is state: off, on, either of those hovered, disabled, and focused. Hovering swaps the track fill and moves nothing else: the off rows keep their `line-strong` border and the on rows carry none to keep. Focus is the state the preset leaves alone, because the interface [draws the one indicator](/foundations/theme.md#the-preset-draws-no-focus-indicator) itself, and on a control that hides its real input that indicator goes on the input's sibling, which is the arrangement [theme](/foundations/theme/usage.md#focusing-a-control-that-hides-its-input) sets out.

Moving the switch runs two animations rather than one. The track fades between fills over 200 milliseconds on the standard curve, and the knob slides over the same 200 milliseconds on the browser default curve, because the preset sets a duration on the knob and no timing function to go with it. Both sit over the 150 millisecond [state duration](/foundations/motion.md#two-durations) the rest of the interface moves on.

## When a toggle is the right choice

**A toggle says the change has already happened.** It belongs on a setting that applies as soon as it moves, and on a row in a table of things that are each either running or not. Of the nine call sites in the interface, five are a table row enabling one entry, three are a row in a settings or onboarding panel, and the last is a boolean property in the workflow editor.

The switch is also a comfortable target without anything being added around it. At 40 by 24 pixels it meets the 24 pixel floor [accessibility](/foundations/accessibility/usage.md#sizing-a-pointer-target) sets, and the label widens the target further wherever it is visible.

## When something else fits better

A value that waits for a Save or a Create is a `CCheckbox`, because a checkbox holds a value and a toggle reports a state. A pair that is not `true` and `false` is a checkbox as well: the toggle compares the model against literal `true`, and the props that would change that pair are refused by the layer contract.

A control that has to report a validation error needs something else again. The preset carries a danger branch for the track border, and no prop reaches it, so a toggle cannot be marked invalid, and `aria-invalid` reaches the input only where a call site forwards the attribute by hand.

More than two choices belongs in a `CSegmented` where the options are few and worth keeping visible, or a `CSelect` where they are not. A label that needs markup rather than a plain string is the last case, because the label prop takes text and the component renders no slot to replace it.

## What the refusal costs

`CToggle` accepts no `class`, no `style` and no pass-through object, which is the [contract](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) the layer sets. Its own spec pins the refusal with a `class`, a `labelClass` and a pass-through object set at once, and asserts that the class in all three reaches nothing on the page.

**The wrapper is a block level flex row.** It fills the width it is given and puts the switch at the leading edge of it, and `text-align` cannot move a flex item. Four of the five table call sites set `text-align: center` on a four rem column and get a left aligned switch with the slack on the right, which is a live result rather than a hypothetical one.

**A disabled toggle still offers its label to the pointer.** The switch itself takes `pointer-events: none` and dims to 0.6 opacity, and the label is a sibling of it that keeps `cursor: pointer` and a click that lands and does nothing. That is invisible in the interface today, because both call sites passing `disabled` also hide their labels.
