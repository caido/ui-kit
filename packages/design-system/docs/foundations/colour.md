# Colour

Colour in Caido carries meaning. It separates a panel from the page behind it, marks a destructive action, and tells you which request in a table you are looking at.

Because it carries meaning, you do not pick it by eye. You pick a [token](/foundations/tokens.md) that says what the colour is for.

This page explains the model. [Usage](/foundations/colour/usage.md) shows how to apply it, and [Reference](/foundations/colour/reference.md) lists the tokens and the ramps behind them.

## Three kinds of colour

**Neutral** colours build the interface itself: backgrounds, panels, borders, body text. They carry no meaning on their own, and most of what you see on screen is neutral.

**Intent** colours say something. There are six, and each has a single job: primary for the main action, danger for something destructive, warn for something risky, success for something that worked, info for something neutral worth noticing, and secondary for the brand accent.

**Accents** carry no status and are not neutral either. They appear where a user picks a colour for their own content, or where colour separates categories without ranking them, as row highlights, category colours, workflow node kinds and medals do.

This is why request methods are not colour coded. The rows already carry the user's own highlight colours, and the method is already written in the row.

To tell an intent from an accent, ask whether the colour could be swapped without changing what the interface means. [Choosing between an intent and an accent](/foundations/colour/usage.md#choosing-between-an-intent-and-an-accent) works through the test.

## What a step is

Every colour comes from a ramp, and [each step on a ramp is a job, not a brightness](/foundations/tokens.md#what-a-step-is). Step 3 is the raised surface in both themes, which makes it a light grey in one and a dark grey in the other.

On the neutral ramp the low steps are backgrounds, the middle steps are borders, steps 9 and 10 are solid fills, and the top steps are text. [What each step holds](/foundations/colour/reference.md#what-each-step-holds) lists every step, and how the twelve step intent ramps differ.

## The four roles

Four roles cover the general-purpose colour tokens, and the role tells you where the colour is allowed to go. The accents sit outside them, because what picks an accent is a user or a category rather than its job on screen.

| Role | Applies to |
|---|---|
| [`surface`](/foundations/colour/reference.md#surface-tokens) | Backgrounds. The page, a raised panel, a hovered row |
| [`line`](/foundations/colour/reference.md#line-tokens) | Borders and dividers |
| [`fill`](/foundations/colour/reference.md#fill-tokens) | Blocks that are entirely one colour, like a solid button or a status meter |
| [`fg`](/foundations/colour/reference.md#foreground-tokens) | Text and icons |

## Emphasis steps

Inside a role, tokens step from subtle to strong. The step you choose says how much attention the element deserves.

For text, `fg-muted` is for something barely worth reading, `fg-subtle` for supporting text, `fg-default` for body text, and `fg-strong` for text that needs weight. In the same way, `line-subtle` separates things that belong together, and `line-strong` marks a boundary that has to be noticed on its own.

Reaching for the strongest step everywhere removes the hierarchy that emphasis exists to create.

## Why text on a fill is different

Text sitting on a `fill` does not take an `fg` step. It takes a separate `fg-on-*` token.

The colour that reads on a solid is decided by that solid, not by the text ladder. Each `fg-on-*` value is calculated against its own fill and that fill's hover, so a label stays legible while the button is hovered. [Usage](/foundations/colour/usage.md#putting-text-on-a-solid-fill) shows how to write the pair.

## Interaction states have their own tokens

A colour that changes on hover has a `-hover` twin rather than a calculation. `fill-primary` is hovered by `fill-primary-hover`, and `surface-hover` is the hovered row.

The twin is a step on the same ramp, so a solid lightens on hover in the dark theme and darkens in the light one, which a single filter cannot do. The link colour is the one exception still waiting for a twin, and is brightened on hover instead.

## The focus ring

Keyboard focus is one token, `line-focus`, and it is gold in both appearances: a light gold on dark, a dark gold on light.

It is drawn as an outline with an offset, so it takes no space in the layout and follows the corner radius. A control that draws its own boundary hides that boundary while focused, because two lines with a gap between them read as a halo rather than as focus.

Its width and offset are in pixels rather than `rem`, because a focus ring that shrinks with the user's text size stops being a focus ring.

## Links

An inline link inside a sentence takes `fg-link`. The link components add an underline only on `:focus-visible`, so a link in running prose is separated by colour alone until it is focused. That is a known gap against [not relying on colour alone](/foundations/colour/usage.md#not-relying-on-colour-alone), not a decision.

## Light and dark

Every token is defined in both appearances, and the generator refuses to emit when one is missing. Where the two values are the same, the token holds one value on purpose.

A step keeps its job across both themes, so the markup never changes between them. [How a token resolves to a value](/foundations/tokens.md#how-a-token-resolves-to-a-value) covers the mechanism.

## How the values are built

The ramps follow a stated method rather than being picked by eye, and the values are committed in the token source so a colour change is visible in a diff.

They are built in OKLCH, a colour space where lightness matches what the eye sees. In HSL a yellow and a blue can both claim 50 percent lightness and still differ almost thirteenfold in measured luminance.

Colour intensity follows a measured curve that peaks at the solid step and falls away at both ends, which is what makes a ramp read as one family. Where a value would fall outside what a screen can show, only intensity is reduced, because lightness carries the job and hue carries the identity.

Each intent ramp is anchored at step 9 on a colour Caido already shipped, holding one value in both themes, which is why the brand looks the same in light and dark.

## Contrast and accessibility

WCAG 2.2 level AA is the contrast target rather than a claim of conformance. [Accessibility](/foundations/accessibility.md#aa-is-the-target-not-the-measurement) covers the pairings recorded as accepted exceptions.

Text needs 4.5 to 1, from criterion 1.4.3. Anything that is not text needs 3.0 to 1, from criterion 1.4.11, but only when colour is the only thing identifying it. A button with a visible label is identified by that label, so the rule does not apply to its fill.

<TokenCount of="pairings" /> pairings are measured in both appearances, as [Contrast rules](/foundations/tokens/reference.md#contrast-rules) sets out. **A pairing nobody listed is a pairing nobody measured.**

Which surfaces a foreground is approved for is part of the rule. Text on a page or a panel can use any foreground. Text on a component background, such as a hovered or selected row, uses `fg-default` or `fg-strong` only, because the muted steps run out of room against those higher surfaces. [Measuring an unchecked pairing](/foundations/colour/usage.md#measuring-an-unchecked-pairing) covers anything else.
