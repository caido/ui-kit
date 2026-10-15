# Select

`CSelect` is the labelled dropdown. It owns a real `<label>`, the control itself and an optional validation message, and wires them together so a field nobody can name does not get shipped by accident. One boolean, `multiple`, decides whether the control underneath picks one value or several.

A second wrapper sits beside it. `CDropdown` is a thin pass-through with no label, no message, three render slots and no attribute filter at all. The two follow opposite rules, so which wrapper a screen needs is the first decision rather than a detail.

This page explains the model. [Usage](/components/select/usage.md) shows how to apply it, and [Reference](/components/select/reference.md) lists every prop, the DOM it renders and what it forwards.

## Two wrappers, opposite rules

| | `CSelect` | `CDropdown` |
|---|---|---|
| Label | A required prop, rendered as a real `<label for>` | None. The accessible name is written by hand as an `aria-label` |
| Validation message | A prop, gated on `invalid` | None |
| Slots | None | `value`, `option` and `footer` |
| A `class` from outside | Dropped before the render | Applied to the control |
| Option text | A key name on the option object | A function, or the `option` slot |
| Selecting several values | `multiple` | Not available |
| Call sites in the interface | 7 | 13 |

Anything needing a custom option row, a custom trigger, a footer or a width class goes through `CDropdown`. Anything that is a labelled field inside a form takes `CSelect`, because the wiring is the whole reason it exists.

## What the component decides for you

<Preview
  light="/examples/component-select-default-light.svg"
  dark="/examples/component-select-default-dark.svg"
  alt="A labelled select with its height, text inset and chevron block annotated beside it"
  caption="Label, 4px gap, trigger. The block measures 55px at the 14px root the application pins."
/>

**The id belongs to the control rather than to the wrapper.** It is generated when the caller passes none, and the label's `for` and the message id both follow it. None of that is a prop, and none of it is optional.

Appearance is settled the same way. The component refuses `class`, `style` and a pass-through styling object, so nothing written on the tag can paint it. [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) explains why that is structural rather than a convention.

## The visible label is not the spoken name

On a single select the combobox carries an `aria-label` holding the selected option or the placeholder, and that outranks the `<label for>`. **A screen reader announces the value, not the field.** With `multiple` set the order inverts, and the `<label for>` supplies the name in the ordinary way. [ARIA](/components/select/reference.md#aria) lists the exact cases.

The visible label still earns its place. It names the field on screen, it focuses the control when clicked, and it is what [accessibility](/foundations/accessibility/usage.md#naming-a-control) asks of a field.

## One boolean changes the element tree

<Preview
  light="/examples/component-select-multiple-light.svg"
  dark="/examples/component-select-multiple-dark.svg"
  alt="A single select above a multiple select, drawn at their true relative heights"
  caption="31px against 34px, and a 30px chevron block against a 48px one. Only the lower one paints an invalid border."
/>

`multiple` is not a display flag. It swaps the rendered control, the focusable element, the height, whether `invalid` paints anything and where the accessible name comes from. Markup written for one branch does not carry to the other.

**No call site in the interface sets it**, so the multi-choice branch ships unexercised by the application.

## Invalid paints nothing on a single select

An invalid single select resolves to exactly the border colour of a resting one, because of the order the preset classes land in. The multi-choice branch does turn red.

**The caption is what an invalid single select has to show for itself.** `message` renders in `fg-danger` under the control, gated on `invalid`, so a caller who sets one flag without the other gets a field that looks valid. That is the arrangement [colour](/foundations/colour/usage.md#not-relying-on-colour-alone) asks for anyway: a state drawn in colour alone is not drawn.

## Selection is carried by the fill alone

<Preview
  light="/examples/component-select-open-light.svg"
  dark="/examples/component-select-open-dark.svg"
  alt="An open select with three option rows: resting, selected and keyboard-focused"
  caption="Selected takes surface-selected, keyboard focus takes surface-hover. There is no tick and no leading icon."
/>

The component never asks the library for its checkmark, so the fill is the whole signal. The overlay is a floating surface with a border and no shadow, which is what [depth](/foundations/depth.md#a-floating-surface-takes-a-border-as-well) asks of anything that leaves the page. [Geometry](/components/select/reference.md#geometry) has the measurements.

## When a select is the right choice

A closed set of answers the interface can enumerate, where the chosen value stays on screen afterwards. Two answers is a toggle or a pair of radios. Three to five that all deserve to be visible at once is a [segmented control](/components/segmented.md). Beyond that, or for a set that grows with the data, this is the control.

**Is the chosen value still on screen after it is picked?** If it is not, the thing being built is a command, and a [menu](/components/menu.md) is the right answer. Free text the interface cannot enumerate belongs in a [text field](/components/input.md).

## When it is not

A list long enough that somebody would rather type than scroll is served badly here, because the search box `filter` adds opens blank and unfocused. A row that needs an icon, a second line, a colour or a count has no slot to go in, and that case is what `CDropdown` and its `option` slot are for.

## What the closed API costs

| Limit | Consequence |
|---|---|
| No slots | Options render as plain text through a key name |
| No clear control | A single select cannot be returned to nothing selected from the interface |
| No filter placeholder | The search box `filter` adds stays blank |
| A dropped `class` | Width comes from `fluid` or from a wrapper the caller owns |
| No locale | The empty list message is in English whatever the interface language is |

`size` also changes nothing in this build, as [Sizes](/components/select/reference.md#sizes) explains.
