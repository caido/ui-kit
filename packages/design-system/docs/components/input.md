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

**The id belongs to the field rather than to the wrapper.** It is generated when the caller passes none, and the label's `for` points at whichever it ended up being. The message, when there is one, gets an id derived from the field's and the field gets an `aria-describedby` pointing back at it. None of that is optional, and none of it is a prop.

Appearance is decided the same way. The component refuses `class`, `style` and a pass-through styling object, so the paint comes from the preset, from the classes the template itself writes for `multiline` and `readonly`, and from the application focus rule, rather than from anything a caller supplies. [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) explains why the refusal is structural rather than a convention reviewers have to enforce.

## The label is not optional

`label` is a required prop with no fallback, so omitting it fails typecheck rather than shipping a field a screen reader cannot name. All 41 call sites in the interface pass one.

**Hiding a label is a visual decision, never a structural one.** `hideLabel` swaps the label's class for `sr-only`, and the element, its text and its `for` association all stay in the DOM. Six inline table editors use it, where a visible label in every cell would be noise and the accessible name is composed from the row instead, and four workflow node fields use it because the node already carries the name.

There is no `aria-label` anywhere in the component. The accessible name always comes from the real `<label>`, which is the rule [accessibility](/foundations/accessibility/usage.md#naming-a-control) sets for every control.

## One component, two field kinds

`multiline` switches the rendered element between an `<input>` and a `<textarea>`. It is one boolean rather than two components, because everything around the field, the label wiring, the message gate and the attribute filter, is identical either way.

<Preview
  light="/examples/component-input-sizes-light.svg"
  dark="/examples/component-input-sizes-dark.svg"
  alt="Three fields side by side: small, large, and a three-row textarea"
  caption="Small and large are single-line sizes. The textarea takes its height from rows."
/>

**The two kinds do not resolve to the same drawing.** A single-line field rests on `line-default` and a textarea rests on `line-strong`, because the two presets write different tokens, so a textarea stacked under a row of inputs reads a step heavier than they do. The textarea also carries `resize-none` and no autogrow, so `rows` is the only thing that sets its height.

## Invalid is the only tonal state

There is no `severity` prop, and no success, warn, info or contrast appearance. The one colour decision the component makes is the boolean `invalid`, which turns the border to `line-danger` and, with a `message`, adds a 12px caption in `fg-danger` under the field. The border is the property [states](/foundations/states.md#a-state-owns-a-property) assigns to invalid, so the field composes with hover and focus rather than contesting them.

`message` is gated on `invalid` rather than rendering on its own, so a validation string cannot outlive the condition that produced it. The cost is that a caller who sets one flag without the other gets no message, no `aria-describedby`, and no warning that either is missing.

## When a text field is the right choice

Reach for it when the answer is free text the interface cannot enumerate: a project name, a host list, a key, a note. [Space](/foundations/space.md#sizes-are-not-spacing) calls that an affordance, sized for content that does not exist yet, and a field with spare room inside it is working correctly rather than wasting space.

Two shapes cover almost every call site. A form field inside a dialog takes a visible label and `fluid`, and often `multiline` with ten rows. An inline table editor takes `hideLabel` and `fluid`, and adds a `readonly` binding where the row can be locked.

## When it is not

A closed set of answers is a different control. Two options is a toggle or a pair of radios, a handful is a segmented control or a select, and a yes or no is a checkbox. Rendering a closed set as free text moves validation from the interface into the submit handler, where the user only meets it after committing.

A field that needs an icon, a unit, a prefix or a clear button is also outside this component. **The template contains no `<slot>` element of any kind.** Anything beside the field has to be a sibling outside the tag, which is what a settings form with helper text already does.

## What the refusal costs

Blocking `class` has a real price. Width cannot be set on the tag, so it comes from `fluid` or from a wrapper the caller controls. A field without `fluid` inside a flex row collapses to the input's intrinsic width, measured at **174px at a 14px root**, which is the failure the refusal makes easy to write and hard to see.

The same filter destroys a caller's `aria-describedby`, because the component binds its own afterwards. Extra descriptive text has to be folded into `message` rather than attached from outside.

Neither of these announces itself. A class on the tag compiles, typechecks, renders, and changes nothing at all, which is the shape [components](/foundations/components.md#almost-nothing-verifies-that-a-class-resolves) already names as the reason the contract exists.
