# Card

A card is the panel a workspace screen is built out of. `CCard` raises a region above the page background, gives it an optional header band and an optional footer line, and fills whatever box it is placed inside. It takes one prop, because the rest of what it does is decided rather than passed.

This page explains the model. [Usage](/components/card/usage.md) shows how to place one and what to put in it, and [Reference](/components/card/reference.md) lists the prop, the slots, the DOM it renders and what it forwards.

## What the card decides for you

<Preview
  light="/examples/component-card-default-light.svg"
  dark="/examples/component-card-default-dark.svg"
  alt="A card with a header band labelled Findings, a 4 pixel strip below it, two rows of body text and a footer holding a Close button, each region annotated with the value that sets it"
  caption="48px header, a 4px surface-page strip, a body with no padding, and a 1px line-subtle footer."
/>

The root paints `bg-surface-raised` with `text-fg-strong`, the floating position [depth](/foundations/depth.md#two-positions-not-a-ladder) names. That step is the whole reason to reach for this component rather than a `div`.

The root carries no border, and its preset shadow resolves to nothing because [depth](/foundations/depth.md#there-are-no-shadows) defines no shadow token. Depth asks a floating surface for a [`line-default` edge](/foundations/depth.md#a-floating-surface-takes-a-border-as-well) as well, but a card takes the step alone. **The surface step is the whole of a card edge.** A card laid directly on another raised surface has nothing left to separate it.

**The card contributes no padding to its body.** It replaces the preset padding and gap with an instruction to fill the parent, so the air inside belongs to whatever the caller puts there.

## The three regions and the strip between them

<Preview
  light="/examples/component-card-slots-light.svg"
  dark="/examples/component-card-slots-dark.svg"
  alt="Three cards side by side showing a card with a body only, a card with a header band, and a card with a header band and a footer line"
  caption="header and footer render only when a slot is supplied; the body renders unconditionally."
/>

A card is a column of at most three regions. The header sits at a fixed height with a 4 pixel `surface-page` band beneath it, the body takes the remaining height, and the footer sits under a 1 pixel `line-subtle` rule.

**The 4 pixel band is a cut rather than a border.** Painting the page colour through the card makes the header read as a separate plate, the same device that draws the header row of a table and the tab list of a tab set.

## The header is 48 pixels and stays there

The header band is 48 pixels regardless of the interface text setting, while the text inside it scales. That is the split [type](/foundations/type.md#what-the-text-size-setting-moves) sets out, and it has a limit: a control taller than 48 pixels, or a label that wraps at a large text setting, overflows the band rather than growing it.

## When a card is the right container

A card is right when a region of the screen is a thing in its own right: a list beside a detail view, a tree beside an editor, a toolbar above a table. The test is whether the region has an identity a person would name, because the raised surface is a claim that it does.

## When a well fits better than a card

`CWell` is the sibling container, and the difference is the surface. A well paints `surface-page` and parts its regions with 1 pixel `line-subtle` rules, so it marks out an area without raising it. It also scrolls its own body, while a card leaves scrolling to its content.

Reach for a well for a quiet region inside something already raised, because two touching surfaces at the same step have no separation at all. [Depth](/foundations/depth.md#two-surfaces-that-touch-are-never-the-same-step) owns that rule, and a card placed directly inside another card is exactly that case.

## What the closed API costs

A `class` or `style` on a `CCard` is dropped in silence, which is the contract [components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes. A card has no width or height prop either.

**Sizing a card is therefore the parent's job.** The root fills its box, so the box is the only place a size can be set, as [Usage](/components/card/usage.md#sizing-a-card-from-its-parent) shows.

## The corner the card does not share

The single radius [space](/foundations/space.md#one-radius) defines is 6 pixels, and it does not move with the interface text setting.

**The card corner comes from the preset in rem rather than from the radius token.** It is smaller than the system radius, 3.5 pixels at the interface default, and it moves when the text size changes. [Measurements](/components/card/reference.md#measurements) lists both values.
