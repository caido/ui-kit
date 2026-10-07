# Input

`CInput` is the single-line and multi-line text field. It owns three things at once: a `<label>`, the field itself, and an optional validation message, and it wires them together with `for`, `id` and `aria-describedby` so an unlabelled field cannot be shipped by accident.

This page explains the model. [Usage](/components/input/usage.md) shows how to apply it, and [Reference](/components/input/reference.md) lists every prop, the DOM it renders and what it forwards.

## What the component decides for you

A text field is three elements pretending to be one, and the wiring between them is where accessible forms usually break. `CInput` takes that wiring away from the caller.

<Preview
  light="/examples/component-input-default-light.svg"
  dark="/examples/component-input-default-dark.svg"
  alt="A labelled text field with its height, padding and corner radius annotated beside it"
  caption="Label, 4px gap, field. The whole block measures 55px at the 14px root the application pins."
/>

**The id belongs to the field rather than to the wrapper.** It is generated when the caller passes none, the label's `for` points at it, and the message, when there is one, is attached with `aria-describedby`. None of that is a prop.

Appearance is decided the same way. The component refuses `class`, `style` and a pass-through styling object, which [components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) explains.

## The label is not optional

`label` is required, so omitting it fails typecheck rather than shipping a field a screen reader cannot name. The accessible name always comes from the real `<label>`, never from `aria-label`, which is the rule [accessibility](/foundations/accessibility/usage.md#naming-a-control) sets for every control.

**Hiding a label is a visual decision, never a structural one.** `hideLabel` keeps the element, its text and its `for` association in the DOM. Inline table editors use it, where a visible label in every cell would be noise, and so do workflow node fields, where the node already carries the name.

## One component, two field kinds

`multiline` switches the rendered element between an `<input>` and a `<textarea>`. It is one boolean rather than two components, because the label wiring, the message gate and the attribute filter are identical either way.

<Preview
  light="/examples/component-input-sizes-light.svg"
  dark="/examples/component-input-sizes-dark.svg"
  alt="Three fields side by side: small, large, and a three-row textarea"
  caption="Small and large are single-line sizes. The textarea takes its height from rows."
/>

**The two kinds do not resolve to the same drawing.** A textarea rests on a stronger border than a single-line field, so a textarea stacked under a row of inputs reads a step heavier. It also cannot be resized or grow, so `rows` is the only thing that sets its height.

## Invalid is the only tonal state

There is no `severity` prop. The one colour decision the component makes is the boolean `invalid`, which turns the border to `line-danger` and, with a `message`, adds a danger caption under the field. The border is the property [states](/foundations/states.md#a-state-owns-a-property) assigns to invalid, so it composes with hover and focus rather than contesting them.

`message` renders only while `invalid` is true, so a validation string cannot outlive the condition that produced it. [Usage](/components/input/usage.md#showing-a-validation-message) shows the two set together.

## When a text field is the right choice

Reach for it when the answer is free text the interface cannot enumerate: a project name, a host list, a key, a note. [Space](/foundations/space.md#sizes-are-not-spacing) calls that an affordance, sized for content that does not exist yet, so spare room inside a field is correct.

Two shapes cover almost every call site: a form field in a dialog with a visible label, and an inline table editor with `hideLabel`. Both take `fluid`.

## When it is not

A closed set of answers is a different control. Two options is a toggle or a pair of radios, a handful is a segmented control or a select, and a yes or no is a checkbox. Free text for a closed set moves validation into the submit handler, where the user only meets it after committing.

A field that needs an icon, a unit, a prefix or a clear button is also outside this component, because **it has no slots**. Anything beside the field is a sibling outside the tag.

## What the refusal costs

Blocking `class` has a real price. Width comes from `fluid` or from a wrapper the caller controls, and a field without `fluid` inside a flex row collapses to its intrinsic width. A caller's `aria-describedby` is also overwritten, so extra description has to go through `message`.

Neither of these announces itself. A class on the tag compiles, typechecks, renders and changes nothing, which is why [components](/foundations/components.md#almost-nothing-verifies-that-a-class-resolves) treats the contract as necessary.
