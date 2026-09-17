# Colour palette

The raw colours the tokens resolve to. Every value in Caido comes from one of these ramps.

You should not need this page to build something. Reach for a token name instead, and let it pick the value. [All tokens](/foundations/tokens/all.md) lists every name with the value behind it.

This page is here for when you want to see a whole ramp at once, or understand why a value is what it is.

## What a step is

A ramp is a row of numbered slots, and each number is a job rather than a brightness.

Caido follows the twelve step scale from Radix Colors, where the position in the ramp tells you what the colour is for. Step 3 is the raised surface in both themes. That makes it a dark grey in the dark theme and a light grey in the light theme. Nothing reads a step because of how light it is. It reads it because of what that step is for.

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

The slots group into four bands. Steps 1 to 5 are backgrounds, 6 to 8 are borders, 9 and 10 are solid fills where 10 is the hover of 9, and 11 upward are text.

Steps 13 and 14 are ours. Radix stops at twelve, and the six intent ramps here stop there too. The neutral runs to fourteen because Caido uses four separate text greys, and twelve slots leave too large a jump between the last text step and white.

Step 8 is worth knowing on its own. It is the strongest border, and its value is set at the darkest point that still clears the 3 to 1 contrast floor that borders have to pass, from WCAG 2.2 criterion 1.4.11.

## Neutrals

Fourteen steps, shown in both themes. A step holds the same job in each, so what carries across is the position rather than the value.

<SwatchPair family="neutral" jobs />

## Intents

Six ramps carry the intents. Each has twelve steps, so it stops after two text weights instead of four. The slots hold the same jobs as the neutrals above.

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

## How the values are built

The ramps are generated rather than picked by hand.

They are built in OKLCH, a colour space where lightness matches what the eye sees. In HSL it does not. A yellow and a blue can claim the same lightness and differ twentyfold in how bright they look, so every HSL ramp has to be corrected by eye, and the correction breaks the moment the hue changes.

Colour intensity follows a measured curve rather than a straight line. It peaks at the solid step and falls away at both ends, which is what makes twelve slots read as one family instead of twelve unrelated colours.

When a generated value falls outside what a screen can show, intensity is reduced until it fits. Lightness and hue are left alone, because lightness carries the job and hue carries the identity.

## Adding a colour

Each ramp is anchored on a colour Caido already shipped. That colour sits at step 9 in both themes, and the rest of the ramp is derived around it, which is why the brand looks the same in light and dark.

A dark ramp climbs from the app background up to the text steps. A light ramp descends. The job at each slot is identical in both, so what carries across is the position, never the value.
