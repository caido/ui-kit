# Card

A card is the panel a workspace screen is built out of. `CCard` raises a region above the page background, gives it an optional header band and an optional footer line, and fills whatever box it is placed inside. It reaches 72 call sites in the interface, from the findings reporter list and the sitemap tree to the About screen, and it takes one prop, because the rest of what it does is decided rather than passed.

This page explains the model. [Usage](/components/card/usage.md) shows how to place one and what to put in it, and [Reference](/components/card/reference.md) lists the prop, the slots, the DOM it renders and what it forwards.

## What the card decides for you

<Preview
  light="/examples/component-card-default-light.svg"
  dark="/examples/component-card-default-dark.svg"
  alt="A card with a header band labelled Findings, a 4 pixel strip below it, two rows of body text and a footer holding a Close button, each region annotated with the value that sets it"
  caption="48px header, a 4px surface-page strip, a body with no padding, and a 1px line-subtle footer."
/>

The root paints `bg-surface-raised` with `text-fg-strong`, which is the floating position [depth](/foundations/depth.md#two-positions-not-a-ladder) names and the step that separates a panel from the page behind it. That choice is the whole reason to reach for this component rather than a `div`.

The root also carries `shadow-md` from the preset, and a card measured in the running interface reports a computed `box-shadow` of `none`. Nothing is broken there, because [depth](/foundations/depth.md#there-are-no-shadows) defines no shadow token. The root carries no border either. Depth asks a floating surface to take a [`line-default` edge](/foundations/depth.md#a-floating-surface-takes-a-border-as-well) as well as the step, and a card takes the step alone. **The surface step is the whole of a card edge.** A card laid directly on another raised surface has nothing left to separate it.

**The card contributes no padding to its body.** The preset gives a card 24 pixels of body padding and a 16 pixel gap, and `CCard` replaces both with an instruction to fill the parent, so the air inside a card belongs to whatever the caller puts there. Call sites write their own, which is why a toolbar card reads at 8 pixels and the About card reads at 16.

## The three regions and the strip between them

<Preview
  light="/examples/component-card-slots-light.svg"
  dark="/examples/component-card-slots-dark.svg"
  alt="Three cards side by side showing a card with a body only, a card with a header band, and a card with a header band and a footer line"
  caption="header and footer render only when a slot is supplied; the body renders unconditionally."
/>

A card is a column of at most three regions. The header sits at a fixed height with a 4 pixel band beneath it painted `surface-page`, the body takes the remaining height, and the footer sits under a 1 pixel `line-subtle` rule. The header and the footer are skipped entirely when their slots are absent, so a card used as a plain raised panel renders a single region.

**The 4 pixel band is a cut rather than a border.** Painting the page colour through the card makes the header read as a separate plate, and the same device draws the header row of a table and the tab list of a tab set. A header separated by a hairline instead would not match either of them.

## The header is 48 pixels and stays there

The header band is `h-12`, and the spacing scale is written in pixels, so that is 48 pixels regardless of the interface text setting. The text inside it scales while the band does not.

That is the split [type](/foundations/type.md#what-the-text-size-setting-moves) sets out, and it has a limit worth knowing before a design depends on it. A header holding a control taller than 48 pixels, or a label that wraps at a large text setting, overflows the band rather than growing it.

## When a card is the right container

A card is right when a region of the screen is a thing in its own right: a list beside a detail view, a tree beside an editor, a toolbar above a table. The test is whether the region has an identity a person would name, because the raised surface is a claim that it does.

It is also right when that region needs a titled band or a row of actions pinned under it, since the header and footer are the two positions the component already draws.

## When a well fits better than a card

`CWell` is the sibling container, and the difference is the surface. A well paints `surface-page` and separates its regions with 1 pixel `line-subtle` rules, so it marks out an area without raising it. A card raises.

Reach for a well for a quiet region nested inside something already raised, because two touching surfaces at the same step have no separation at all, in either appearance. [Depth](/foundations/depth.md#two-surfaces-that-touch-are-never-the-same-step) owns that rule, and a card placed directly inside another card is exactly that case.

A well also scrolls its own body, while a card leaves scrolling to whatever is placed in it. The header is where the two stop being interchangeable: a well parts its regions with a 1 pixel `line-subtle` rule where a card cuts a 4 pixel strip of page colour.

## What the closed API costs

A `class` on a `CCard` is dropped in silence, and so is `style`, because what reaches the root is an allow-list of four shapes rather than a list of things to block. That refusal is the contract [components](/foundations/components.md#the-api-cannot-leak-what-it-will-not-accept) describes, and here it removes the obvious escape, because a card carries no width prop and no height prop to offer instead.

**Sizing a card is therefore the parent's job.** The root is told to fill its box, so the box is the only place a size can be set, and a call site that reaches for `class="h-full"` gets a card that renders at content height with nothing reported.

## The corner the card does not share

The single radius is 6 pixels, written in pixels, and it does not move with the interface text setting. [Space](/foundations/space.md#one-radius) owns that rule.

**The card corner comes from the preset in rem rather than from the radius token.** Measured against a 16 pixel root it renders a 4 pixel corner, and against the interface default of 14 pixels it renders 3.5, so a card corner is smaller than the system radius and moves when somebody changes the text size, which the system radius does not. Anything set flush into a card corner is matching a value that shifts under it.
