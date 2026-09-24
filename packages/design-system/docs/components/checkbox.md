# Checkbox

`CCheckbox` is the control for a setting that is on or off, and for one member of a set whose members are chosen independently of one another. It renders a 20 by 20 pixel box beside a label that it wires to the input itself, and it takes both a label and a model as required props.

This page explains the model. [Usage](/components/checkbox/usage.md) shows how to write one, and [Reference](/components/checkbox/reference.md) lists every prop, event and attribute.

## What the component settles

The box is 20 by 20 pixels with a 1 pixel border and the single 6 pixel [corner](/foundations/space.md#one-radius). The gap to the label is 8 pixels, rung 2, the default gap between things in a row. The label is set in the caption role, the [smaller of the two reading sizes](/foundations/type.md#the-line-between-caption-and-body), because a checkbox label sits inside a form rather than heading anything.

Checking paints the border and the fill from one token, `fill-secondary`, and the tick from `fg-on-secondary`, which is the pairing [colour](/foundations/colour/usage.md#putting-text-on-a-solid-fill) asks for and the component applies so that a caller never writes it. That amber is one value rather than a light and dark pair, so the checked box reads the same in both appearances.

<Preview
  light="/examples/component-checkbox-default-light.svg"
  dark="/examples/component-checkbox-default-dark.svg"
  alt="An unchecked checkbox labelled Requests above a checked checkbox labelled Responses, with the box measurements called out beneath"
  caption="Unchecked and checked. The checked fill and border come from the same token."
/>

**The label belongs to the control rather than sitting beside it.** The component generates an id, puts it on the input and points the label at it, so clicking the words toggles the box and assistive technology reads the words as the name. That is what [naming a control](/foundations/accessibility/usage.md#naming-a-control) asks for, met without a call site arranging it, and it is also what makes the pointer target wider than the 20 pixel box.

## One axis, and it is state

`CCheckboxProps` carries eleven fields and none of them is an appearance axis. There is no `size`, no `severity`, no `variant` and no `invalid`, so the shared [vocabulary](/foundations/components.md#the-vocabulary-is-shared-the-defaults-are-not) that `CButton` and `CTag` draw on is absent here rather than narrowed.

What varies instead is state: unchecked, checked, indeterminate, disabled, read-only, hover and focus. Two layout flags sit alongside those, `fluid` and `hideLabel`, and neither changes how the box is painted.

<Preview
  light="/examples/component-checkbox-states-light.svg"
  dark="/examples/component-checkbox-states-dark.svg"
  alt="Four 20 pixel checkboxes in a row labelled rest, hover checked, focus and disabled"
  caption="The four states that change the box. Focus is drawn on the box by the interface, not by the preset."
/>

**Hovering an unchecked box changes nothing.** The preset re-applies the border token the box already carries, so an unchecked checkbox offers the cursor as its hover feedback and the colour change arrives once the box is checked. Focus is the other state the preset leaves alone, because the interface [draws one indicator](/foundations/theme.md#the-preset-draws-no-focus-indicator) for every control rather than letting each one invent its own.

## Binary or group, decided by one prop

Whether `value` is present decides what the model means, and it is the decision that shapes the rest of a call site.

With no `value`, the checkbox is binary: the model holds `trueValue` when checked and `falseValue` when not, and those default to `true` and `false` without ruling out a string or any other pair. With a `value`, the checkbox is one member of a group: the model is an array, and checking appends while unchecking removes.

A group of checkboxes therefore shares one array rather than one boolean each, and nothing has to name the group for that to work.

## When a checkbox is the right choice

**A checkbox suits a change that waits for a confirming action.** It sits in a form beside a Create or a Save, and the value it holds takes effect when the form does.

It also suits a set of filters or sources where any number of the options can be on at once, which is the case a radio cannot express and a row of toggles overstates.

## When something else fits better

A setting that takes effect the moment it is switched is a `CToggle`, because a toggle promises the change has already happened and a checkbox does not. One choice out of several mutually exclusive ones is a `CRadio`, or a `CSegmented` where the options are few and worth keeping visible.

A choice that has to report an error of its own needs something else too, since there is no invalid state to turn on. A label that needs markup rather than a plain string is the third case, because the label prop takes text and the component exposes no slot to replace it.

## What the refusal costs

`CCheckbox` accepts no `class`, no `style` and no class-shaped prop under another name, which is the [contract](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) the layer sets. Six call sites in the interface pass a `label-class` anyway and three pass a `class`, and every one of those attributes is dropped before it reaches the page. Positioning a checkbox is therefore a job for the element around it.

Three behaviours cost something at the call site rather than in the markup.

**Indeterminate is a display, not a third value.** The prop draws a dash in place of the tick and reports a mixed state to assistive technology. A click resolves it in opposite directions in the two modes: binary sends the model to `trueValue`, and group removes the value from the array. Clearing the dash afterwards is the parent's work, because the component holds no state of its own to clear.

**Read-only looks exactly like enabled.** It blocks the change and alters nothing about the box, the cursor or the tab order, so a read-only checkbox needs a sentence nearby saying why it will not move. Disabled is the state with an appearance, and [states](/foundations/states/usage.md#choosing-between-read-only-and-disabled) sets out which of the two a situation calls for.

**The interior of an unchecked box is painted `surface-page` whatever sits behind it.** Inside a dialog or a card the box interior is a visibly different shade from its background, which is the same [step apart](/foundations/depth.md#two-surfaces-that-touch-are-never-the-same-step) that separates those two surfaces everywhere else, and there is no prop that changes it.
