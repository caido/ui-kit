# Tag

A tag is the small chip that says what kind of thing a row is. `CTag` draws a caption-sized label inside a rounded fill, optionally with a glyph in front of it, and stops there: it declares no events, takes no focus and draws no hover, because a tag is read rather than used.

This page explains the model. [Usage](/components/tag/usage.md) shows how to label one and which colour axis to pick, and [Reference](/components/tag/reference.md) lists the props, the DOM it renders and what it forwards.

## What the tag decides for you

<Preview
  light="/examples/component-tag-default-light.svg"
  dark="/examples/component-tag-default-dark.svg"
  alt="Two chips side by side, one filled at severity info and one with no fill at all, each annotated with the severity that produced it"
  caption="A severity fills the chip. No severity leaves it unfilled."
/>

The shape is settled before a call site sees it. The label takes the caption role at weight 600, the corner is the single radius [space](/foundations/space.md#one-radius) sets, and the height is not written anywhere: it is the caption line box plus its padding, so it follows the text size setting without anybody maintaining a number.

The side padding is set in `rem` by the preset, so it also moves with the text setting while the vertical padding does not. [Space](/foundations/space/usage.md#writing-a-length-in-the-right-unit) owns the rule it departs from, and [Measurements](/components/tag/reference.md#measurements) gives the values.

## Two colour axes, and the second one wins

<Preview
  light="/examples/component-tag-severities-light.svg"
  dark="/examples/component-tag-severities-dark.svg"
  alt="Six chips in a row labelled secondary, success, info, warn, danger and contrast, each filled with the surface colour for that intent"
  caption="Each severity pairs a tinted surface with that intent's strong foreground."
/>

`severity` carries the six intents in the shared [vocabulary](/foundations/components/reference.md#the-vocabulary), with the pairs [Severity colours](/components/tag/reference.md#severity-colours) lists. `category` carries eight accents that rank nothing. An intent cannot be traded for another colour without changing what the interface means, and an accent can.

**Setting `category` suppresses `severity`**, so a tag carrying both renders the category alone.

<Preview
  light="/examples/component-tag-categories-light.svg"
  dark="/examples/component-tag-categories-dark.svg"
  alt="Eight chips in a single row, labelled amber, azure, fern, lime, magenta, rust, teal and violet, each filled and outlined in its own accent"
  caption="The eight accents, each drawing a fill, a line and a foreground from its own token group."
/>

A category also draws a 1 pixel border in its line colour, which makes it 2 pixels taller than a severity tag carrying the same word.

## The default paints nothing

**A tag with neither axis carries no background of its own**, and keeps the colour of the text around it. The project table uses that on purpose, setting a bold caption word beside a filled tag.

## Reserving a width is a separate job

<Preview
  light="/examples/component-tag-widths-light.svg"
  dark="/examples/component-tag-widths-dark.svg"
  alt="Four chips showing a labelled tag at the small width, an empty tag at the medium width, an empty tag at the small width and an icon-only tag, each annotated with its measured width"
  caption="48 pixels at small, 64 at medium, and an icon-only chip sized by its glyph."
/>

`width` pins the chip at 48 or 64 pixels and clips whatever does not fit. It exists for a toolbar that has to hold a row still while a value arrives, so the idle state renders a tag with an empty label and the success state fills it.

**A width-only tag is pinned at 24 pixels tall and stays there**, because an empty label leaves no line box to set a height. That matches a labelled tag only at the 14 pixel default. [Type](/foundations/type.md#what-the-text-size-setting-moves) covers what the setting moves.

## When a tag is not the answer

A tag is not a control. It cannot be reached from the keyboard, so anything a person is meant to press belongs in a [button](/components/button.md).

A tag is also not a signal that can stand on its own. A chip carrying a colour without a word fails the rule in [colour](/foundations/colour/usage.md#not-relying-on-colour-alone).

A long string is the third case, because the chip holds one line and cuts a sentence rather than wrapping it.

## What the closed API costs

A `class` or `style` on a `CTag` is dropped in silence, as [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes. On a tag that rules out a fill opacity, a margin and any width outside the two named values.

That is why the HTTP history success row draws its own chip for the request method, a span at `bg-category-azure-fill/50`, beside a `CTag` holding the status code. [Choosing between a tag and a span](/components/tag/usage.md#choosing-between-a-tag-and-a-span) covers when to do the same.
