# Colour reference

The colour tokens a screen reaches for, and the ramps behind them. For what these names mean, see [Overview](/foundations/colour.md#the-four-roles). For how to choose between them, see [Usage](/foundations/colour/usage.md#picking-a-token).

## Surface tokens

Backgrounds. The page, a raised panel, a hovered row.

<TokenSwatches prefix="color.surface" />

## Line tokens

Borders and dividers.

<TokenSwatches prefix="color.line" />

## Fill tokens

Blocks that are entirely one colour, like a solid button or a status meter.

<TokenSwatches prefix="color.fill" />

Primary, secondary and neutral need no `-strong` variant, because each clears 4.5 with its own `fg-on-*` label: white on primary at 7.55, near-black on secondary at 7.55, and black on neutral at 5.25.

In the light appearance, three of the text-free status fills fall short of the 3.0 floor and are recorded as accepted exceptions: warn at 2.80 and success at 2.85 against a subtle track, and info at 2.50 against the page. `fill-danger` is not registered as a pairing.

## Foreground tokens

Text and icons.

<TokenSwatches prefix="color.fg" />

## What each step holds

Each step is named for its leading job and keeps that name in both themes. A step can carry a second token where the ramp runs short: step 6 is the subtle border and the disabled surface, and steps 7 and 8 are also the subtle neutral fill and its hover.

| Step | Job |
|---|---|
| 1 | App background |
| 2 | Subtle background |
| 3 | Raised surface |
| 4 | Hover |
| 5 | Selected |
| 6 | Subtle border |
| 7 | Border |
| 8 | Strong border |
| 9 | Solid |
| 10 | Solid hover |
| 11 | Muted text |
| 12 | Subtle text |
| 13 | Body text |
| 14 | Strong text |

Steps 13 and 14 extend a common twelve step scale with two text steps.

Step 8, the strong border, is the step closest to the page that still clears the 3 to 1 floor from WCAG criterion 1.4.11. It measures 3.16 in light and 3.11 in dark, where step 7 measures 2.06 and 2.04.

## Neutral ramp

Fourteen steps, shown in both themes. The neutral is anchored separately in each appearance, because a grey has no brand to hold, and its colour intensity peaks at step 8 in light and step 6 in dark.

<SwatchPair family="neutral" jobs />

## Intent ramps

Six ramps carry the intents, twelve steps each.

An intent ramp has to serve all four roles from twelve steps, so it doubles up: steps 9 and 10 are its solid fills, and steps 11 and 12 are its borders and its text at once. The strong fills take 11 and 12 in light and 7 and 6 in dark, because the label on them is white in both and each appearance moves away from white in its own direction.

### Crimson, the primary intent

<SwatchPair family="crimson" />

### Amber, the secondary intent

<SwatchPair family="amber" />

### Vermilion, the danger intent

<SwatchPair family="vermilion" />

### Citron, the warn intent

<SwatchPair family="citron" />

### Fern, the success intent

<SwatchPair family="fern" />

### Cerulean, the info intent

<SwatchPair family="cerulean" />

## Row highlights

The nine colours a user can mark a table row with. The dark set is the one Caido has always shipped and is preserved exactly. The light set is solved from it rather than invented, so each light value reaches the separation its own dark twin achieves at the same hue.

<TokenSwatches prefix="color.highlight" />

[`fg-strong`](/foundations/colour/usage.md#putting-text-on-a-highlighted-row) is the only foreground measured against all nine, worst 4.54 in dark and 5.90 in light.

## Category accents

Eight colours that carry no severity, for separating one category from another without ranking them. Each carries a fill, a line and a foreground, and the foreground is measured against the page, the raised surface and the subtle surface.

<TokenSwatches prefix="color.category" />

## Workflow node categories

<TokenSwatches prefix="color.workflow-node" />

`workflow-node-fg` is not a category. It is the glyph drawn on top of one, and it holds the same value in both appearances. It clears the 3 to 1 floor on all eight node tiles, worst 3.38, where `fg-strong` fails all four dark tiles and `fg-default` clears one of the eight.

## Medal colours

First, second and third. Approved against `surface-raised` rather than the page, because that is where a medal is drawn. The hue is fixed in both themes and the light values are darkened: canonical bronze measures 2.43 against the light raised surface, and the shipped value reaches 6.10.

<TokenSwatches prefix="color.medal" />

## Measured pairings

A sample of the measured pairings. [Contrast and accessibility](/foundations/colour.md#contrast-and-accessibility) covers which are approved and why.

<ContrastPair foreground="fg-default" background="surface-page" />
<ContrastPair foreground="fg-subtle" background="surface-raised" />

## Every token

[All tokens](/foundations/tokens/all.md) is the searchable list of every name in the system, with the value behind it in both themes.
