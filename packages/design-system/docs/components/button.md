# Button

A button runs a command. `CButton` is the button Caido is built from, at 371 call sites reaching from a dialog confirm to a toolbar icon, and it takes three words to describe one: a severity for what the command means, a variant for how much emphasis it carries, and a size for the density of the row it sits in. The label is required, a leading icon and a trailing icon are optional, and the rest of the shape belongs to the component.

This page explains the model. [Usage](/components/button/usage.md) shows how to choose those three words, and [Reference](/components/button/reference.md) lists the props, the DOM it renders and what it forwards.

## What the button decides for you

<Preview
  light="/examples/component-button-default-light.svg"
  dark="/examples/component-button-default-dark.svg"
  alt="A solid medium button labelled Save, drawn in the primary severity, annotated with 8 pixels of vertical padding, 12 pixels of horizontal padding and a 1 pixel border"
  caption="contrast, solid and medium are the defaults. 187 call sites name contrast, and 11 more take it by saying nothing."
/>

A severity picks a fill and the foreground built to sit on that fill, which is the pairing rule [colour](/foundations/colour.md#why-text-on-a-fill-is-different) sets and the button applies so a caller never writes it. The corner is the single radius [space](/foundations/space.md#one-radius) describes, 6 pixels at every size and in every variant. The air inside is fixed pixels rather than a step that moves: 6 above and below with 12 each side at small, 8 and 12 at medium, 12 and 16 at large. No height is written, so the height is the line box of the label plus that padding, and a button keeps matching the field beside it when somebody changes the interface text size.

Two states are drawn for you as well. The pressed state is a wash of `--color-fg-strong` at 20 per cent laid over whatever fill the button already carries, so it works on a solid button and on a transparent one without a second rule. The focus indicator belongs to the interface rather than to the button, and it is drawn on `:focus-visible` only, so a mouse click leaves no outline behind.

**The default type is `button`.** That is the opposite of the platform default, and it is what keeps a button inside a form from submitting it. A confirm has to ask for `type="submit"` in writing.

## Three variants and one order of emphasis

<Preview
  light="/examples/component-button-variants-light.svg"
  dark="/examples/component-button-variants-dark.svg"
  alt="Solid, outlined and text buttons on one row, the text button drawn without a box because it carries neither fill nor border"
  caption="solid fills, outlined draws the edge, text draws neither."
/>

The three variants are an emphasis order rather than three looks. Solid is the command a screen wants pressed, outlined is the alternative beside it, and text is the action that has to stay reachable without competing for attention. A dialog with one confirm and one cancel is the shape this was built for: solid on the confirm, text on the cancel.

**A text button is 2 pixels shorter and 2 pixels narrower than its solid twin.** Text carries a transparent border colour with no width, while solid and outlined carry a real 1 pixel border. Measured at medium, solid renders 35 pixels tall and text renders 33, so a row mixing the two does not share a height.

## Seven severities and the one that differs

<Preview
  light="/examples/component-button-severities-light.svg"
  dark="/examples/component-button-severities-dark.svg"
  alt="The seven severities drawn as solid medium buttons, each labelled with its own severity name"
  caption="four of the seven fill from a -strong token; primary, secondary and contrast do not."
/>

| Severity | What it says |
|---|---|
| `contrast` | A command with no particular weight. The default, and the majority of call sites |
| `primary` | The one action a screen exists to perform |
| `danger` | Destructive, and usually hard to undo |
| `secondary` | A muted alternative beside a stronger action |
| `success`, `info`, `warn` | An action whose meaning matches an intent colour. Rare on a button |

**`primary` is the value the button adds to the shared vocabulary.** The six severities [components](/foundations/components.md#the-vocabulary-is-shared-the-defaults-are-not) lists are the set the library shares, and the button extends that set with one more for the single action a screen is about. Choosing a severity is a claim about meaning rather than about colour, so a destructive confirm takes `danger` because deleting is destructive, not because red suits the dialog.

## The sizes paint three type roles

<Preview
  light="/examples/component-button-sizes-light.svg"
  dark="/examples/component-button-sizes-dark.svg"
  alt="Small, medium and large buttons on a shared baseline, each annotated with its label font size"
  caption="12, 14 and 18 pixels at the default interface size, all three at weight 400."
/>

Size moves the type and the padding together. Small renders its label at the caption size, medium at the body size and large at the title size, so picking a size is picking how loud the label reads as much as how much room the control takes.

**`large` reaches two screens in the interface, both of them onboarding.** A dense screen takes `small`, a form or a dialog takes `medium`, and large belongs to a splash where one action is the whole point of the view. The padding is written in absolute pixels and does not move with the interface text setting, while the label does, so a reader on a larger text size gets a taller button with the same 12 pixels at the sides. [Type](/foundations/type.md#what-the-text-size-setting-moves) owns that split.

## When a button is the right control

A button is right when the thing it does happens now and happens once: save, delete, export, send, open a menu. The press is the whole interaction, and afterwards the screen is different.

Three neighbouring cases are not that. Something that changes a mode and stays changed is a toggle or a segmented control, because a button gives a reader nothing to read a current state from. Something that goes somewhere rather than doing something is a link, and a link dressed as a button still loses middle click, the context menu and the status bar preview. Something that picks one value out of several is a select or a radio group, whatever the row of buttons looks like.

## What the closed API costs

A `class` on a `CButton` is dropped in silence, along with `style`, `title`, `tabindex` and `role`. That refusal is the contract [components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes, and for this component it is pinned by three tests: a `class`, a pass-through styling object and a class-shaped prop under another name are each refused.

There is also no default slot. The children are fixed at an optional leading icon, the label and an optional trailing icon, so a badge, a count pill or a keyboard shortcut chip cannot be put inside a button.

**Those two refusals are the price of a button that looks the same everywhere.** A component that accepted a class would accept a request it cannot check, and a misspelt utility reads in a template exactly like one that works. When a design genuinely needs a shape the button does not have, the answer is a new prop on the component rather than a class at the call site.
