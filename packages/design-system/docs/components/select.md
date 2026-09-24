# Select

`CSelect` is the labelled dropdown. It owns three elements at once: a real `<label>`, the control itself, and an optional validation message, and it wires them together with `for`, `id` and `aria-describedby` so a field nobody can name does not get shipped by accident. One boolean, `multiple`, decides whether the control underneath picks one value or several.

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

Anything needing a custom option row, a custom trigger, a footer or a width class goes through `CDropdown`, because `CSelect` renders none of those. Anything that is a labelled field inside a form takes `CSelect`, because the wiring is the whole reason it exists.

## What the component decides for you

<Preview
  light="/examples/component-select-default-light.svg"
  dark="/examples/component-select-default-dark.svg"
  alt="A labelled select with its height, text inset and chevron block annotated beside it"
  caption="Label, 4px gap, trigger. The block measures 55px at the 14px root the application pins."
/>

**The id belongs to the control rather than to the wrapper.** It is generated when the caller passes none, the label's `for` points at whichever it ended up being, and the message, when there is one, takes an id derived from it. None of that is a prop, and none of it is optional.

Clicking the label focuses the control either way. With `multiple` the `for` target is a real input and the browser does it; on a single select the target is a `<span>`, so the library binds a click listener to the matching label instead.

Appearance is settled the same way. The component refuses `class`, `style` and a pass-through styling object, so nothing written on the tag can paint it, and its own tests pin all three refusals. [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) explains why that is structural rather than a convention reviewers have to police.

## The visible label is not the spoken name

On a single select the accessible name comes from the library rather than from the `<label>`. The combobox carries an `aria-label` holding the text of the selected option, or the placeholder when nothing is selected, and an `aria-label` outranks a `<label for>` association. A screen reader announces the value, not the field. The `<label>` wins back the name in one case: a select with no value and no placeholder leaves the `aria-label` undefined.

**That inverts when `multiple` is set.** The multi-choice control leaves its `aria-label` undefined, so the `<label for>` supplies the name in the ordinary way.

The visible label still earns its place. It names the field on screen, it focuses the control when clicked, and it is what [accessibility](/foundations/accessibility/usage.md#naming-a-control) asks of a field. Treat the announcement as something to listen to rather than something the prop has settled.

## One boolean changes the element tree

<Preview
  light="/examples/component-select-multiple-light.svg"
  dark="/examples/component-select-multiple-dark.svg"
  alt="A single select above a multiple select, drawn at their true relative heights"
  caption="31px against 34px, and a 30px chevron block against a 48px one. Only the lower one paints an invalid border."
/>

`multiple` is not a display flag. It swaps the rendered control, the focusable element, the resting height, the width of the chevron block, whether `invalid` paints anything and where the accessible name comes from. Markup written for one branch does not carry to the other.

**No call site in the interface sets it.** Seven screens use `CSelect` and all seven leave it false, so the multi-choice branch, the filter header, the validation message and both size values ship unexercised by the application.

## Invalid paints nothing on a single select

The preset keeps `border-line-strong` in the class list unconditionally and adds `border-line-danger` beside it, and the strong line is emitted later in the generated stylesheet, so it wins in either attribute order. Measured on a live control, an invalid single select resolves to exactly the border colour of a resting one. The multi-choice branch does turn red, because its preset writes the border on the negated test instead.

**The caption is what an invalid single select has to show for itself.** `message` renders as a 12px line in `fg-danger` under the control, gated on `invalid`, so a caller who sets one flag without the other gets a field that looks valid and reads as valid.

Until the preset changes, colour carries nothing here, which is the arrangement [colour](/foundations/colour/usage.md#not-relying-on-colour-alone) asks for anyway: a state that is drawn in colour alone is not drawn.

## Selection is carried by the fill alone

<Preview
  light="/examples/component-select-open-light.svg"
  dark="/examples/component-select-open-dark.svg"
  alt="An open select with three option rows: resting, selected and keyboard-focused"
  caption="Selected takes surface-selected, keyboard focus takes surface-hover. There is no tick and no leading icon."
/>

Rows are 30px tall on 8px by 12px of padding. The component never asks the library for its checkmark, so the fill is the whole signal, and a selected row that also has keyboard focus takes the hover fill with the stronger text.

The overlay is a floating surface with a 1px `line-default` border and no shadow at all, which is what [depth](/foundations/depth.md#a-floating-surface-takes-a-border-as-well) asks of anything that leaves the page. Its minimum width is pinned to the trigger, and the list scrolls past **196px**.

## When a select is the right choice

A closed set of answers the interface can enumerate, where the chosen value stays on screen afterwards. Two answers is a toggle or a pair of radios. Three to five that all deserve to be visible at once is a [segmented control](/components/segmented.md). Beyond that, or for a set that grows with the data, this is the control.

**Is the chosen value still on screen after it is picked?** If it is not, the thing being built is a command rather than a value, and a [menu](/components/menu.md) is the right answer. Free text the interface cannot enumerate belongs in a [text field](/components/input.md).

## When it is not

A list long enough that somebody would rather type than scroll is served badly here. `filter` adds a search box, and the placeholder for that box is not exposed, so it opens blank and unfocused.

A row that needs an icon, a second line, a colour or a count is also outside this component, because there is no slot to put one in. That case is what `CDropdown` and its `option` slot are for.

## What the closed API costs

| Limit | Consequence |
|---|---|
| No slots | Options render as plain text through a key name |
| No clear control | A single select cannot be returned to nothing selected from the interface |
| No filter placeholder | The search box `filter` adds stays blank |
| A dropped `class` | Width comes from `fluid` or from a wrapper the caller owns |

Two props also change nothing. `size` accepts `small` and `large`, and the library declares no size prop on either control, so both values ship as a bare attribute on a `div`. `fluid` adds `w-full` to the wrapper, which is the part that works; the prop forwarded behind it paints nothing, because the application runs the library unstyled.

The empty list message is untranslated. Nothing sets the library locale, so a select with no options reads "No available options" in English whatever the interface language is set to.
