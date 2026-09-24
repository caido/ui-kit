# Tag

A tag is the small chip that says what kind of thing a row is. `CTag` draws a caption-sized label inside a rounded fill, optionally with a glyph in front of it, and stops there: it declares no events, takes no focus and draws no hover, because a tag is read rather than used. It reaches 26 call sites across 18 files, from the status code in the intercept toolbar to the read-only marker in the project table.

This page explains the model. [Usage](/components/tag/usage.md) shows how to label one and which colour axis to pick, and [Reference](/components/tag/reference.md) lists the props, the DOM it renders and what it forwards.

## What the tag decides for you

<Preview
  light="/examples/component-tag-default-light.svg"
  dark="/examples/component-tag-default-dark.svg"
  alt="Two chips side by side, one filled at severity info and one with no fill at all, each annotated with the severity that produced it"
  caption="A severity fills the chip. No severity leaves it unfilled."
/>

The shape is settled before a call site sees it. The label takes the caption role at weight 600, the corner is the single 6 pixel radius [space](/foundations/space.md#one-radius) sets for every rectangular surface, and the height of a labelled tag is not written anywhere: it is the caption line box plus the padding above and below it. That sum is 24 pixels at the 14 pixel interface default and 35.42 at the largest text setting, without anybody maintaining a number.

**The side padding moves with the text setting and the vertical padding does not.** The preset writes that padding in rem, so it measures 5.6 pixels at the default root and 6.4 against a 16 pixel one, while `py-1` holds at 4 in both. The side padding is the one piece of the tag's spacing set in `rem`, and [space](/foundations/space/usage.md#writing-a-length-in-the-right-unit) owns the rule it departs from.

## Two colour axes, and the second one wins

<Preview
  light="/examples/component-tag-severities-light.svg"
  dark="/examples/component-tag-severities-dark.svg"
  alt="Six chips in a row labelled secondary, success, info, warn, danger and contrast, each filled with the surface colour for that intent"
  caption="Each severity pairs a tinted surface with that intent's strong foreground."
/>

`severity` carries the six values in the shared [vocabulary](/foundations/components/reference.md#the-vocabulary), and each one pairs a tinted surface with that intent's strong foreground. The exception is `contrast`, which paints the solid neutral fill and puts the fixed dark foreground on it.

`category` carries eight accents that rank nothing: amber, azure, fern, lime, magenta, rust, teal and violet. The test for which axis a colour belongs to is in [colour](/foundations/colour/usage.md#choosing-between-an-intent-and-an-accent). An intent cannot be traded for another colour without changing what the interface means, and an accent can.

**Setting `category` suppresses `severity`.** The container passes no severity down to the component library once a category is present, so a tag carrying both renders the category alone. One of the two call sites that set a category passes a severity beside it, and that severity changes nothing.

<Preview
  light="/examples/component-tag-categories-light.svg"
  dark="/examples/component-tag-categories-dark.svg"
  alt="Eight chips in a single row, labelled amber, azure, fern, lime, magenta, rust, teal and violet, each filled and outlined in its own accent"
  caption="The eight accents, each drawing a fill, a line and a foreground from its own token group."
/>

A category also draws a 1 pixel border in its line colour, which no severity does, and that border makes a category tag 2 pixels taller than a severity tag carrying the same word. The tokens behind the eight are listed under [category accents](/foundations/colour/reference.md#category-accents).

## The default paints nothing

**A tag with neither axis carries no background of its own.** The preset picks a colour by matching the severity against seven branches, an absent severity matches none of them, and the chip keeps the colour of the text around it. Three of the 26 call sites render exactly that, all of them in the project table, where a bold caption word standing beside a filled tag is the point rather than an oversight.

## Reserving a width is a separate job

<Preview
  light="/examples/component-tag-widths-light.svg"
  dark="/examples/component-tag-widths-dark.svg"
  alt="Four chips showing a labelled tag at the small width, an empty tag at the medium width, an empty tag at the small width and an icon-only tag, each annotated with its measured width"
  caption="48 pixels at small, 64 at medium, and an icon-only chip sized by its glyph."
/>

`width` pins the chip at 48 or 64 pixels and clips whatever does not fit, which is the one place a tag stops sizing to its content. It exists for a toolbar that has to hold a row still while a value arrives, so the idle state renders a tag with an empty label and the success state fills it.

**A width-only tag is pinned at 24 pixels tall and stays there.** An empty label leaves no line box to set a height, so the container writes `h-6`, and 24 is what a labelled tag happens to measure at the 14 pixel default. At the smallest text setting the placeholder is the taller of the two, and at the largest it is more than 11 pixels shorter. [Type](/foundations/type.md#what-the-text-size-setting-moves) covers what the setting moves and what it leaves alone.

## When a tag is not the answer

A tag is not a control. The preset root carries no hover, active or focus class, and `tabindex` sits outside the allow-list, so the span cannot be reached from the keyboard and anything a person is meant to press belongs in a [button](/components/button.md) instead.

A tag is also not a signal that can stand on its own. The chip carries a word, and a chip carrying a colour alone fails the rule in [colour](/foundations/colour/usage.md#not-relying-on-colour-alone) for anybody who cannot separate two hues.

A long string is the third case. `truncate` on the root sets `whitespace-nowrap`, so a sentence stretches the chip until something constrains it and is then cut rather than wrapped.

## What the closed API costs

A `class` on a `CTag` is dropped in silence, and so is `style`, because the root takes an allow-list of four shapes rather than a list of things to block. [Components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes that contract, and on a tag it removes the fill opacity, the gap to a neighbour and any width outside the two named values.

**One toolbar draws its own chip rather than reaching for a tag.** The HTTP history success row writes a span at `bg-category-azure-fill/50` for the request method, a half-opacity fill no prop offers, and sets it beside a `CTag` holding the status code. The two read as the same shape, and one of the two is not the component.
