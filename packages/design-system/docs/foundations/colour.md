# Colour

Colour in Caido carries meaning. It separates a panel from the page behind it, marks a destructive action, and tells you which request in a table you are looking at.

Because it carries meaning, you do not pick it by eye. You pick a [token](/foundations/tokens.md) that says what the colour is for.

This page explains the model. [Usage](/foundations/colour/usage.md) shows how to apply it, and [Reference](/foundations/colour/reference.md) lists the tokens and the ramps behind them.

## Three kinds of colour

**Neutral** colours build the interface itself. Backgrounds, panels, borders, body text. They carry no meaning on their own, and most of what you see on screen is neutral.

**Intent** colours say something. There are six, and each one has a single job: primary for the main action, danger for something destructive, warn for something risky, success for something that worked, info for something neutral worth noticing, and secondary for the brand accent.

**Accents** carry no status and are not neutral either. They appear where a user picks a colour for their own content, or where colour separates one category from another without ranking them. Row highlights, category colours, workflow node kinds and medals are all accents.

This is why request methods are not colour coded. Nine verbs in a table whose rows already carry the user's own highlight colours would put two unrelated colour systems on one surface, and the method is already written in the row.

The [test between an intent and an accent](/foundations/colour/usage.md#choosing-between-an-intent-and-an-accent) is whether the colour could be swapped for another without changing what the interface means. A failed request is red because red means failure, so that is an intent. Three rows a user tagged in different colours would survive red and blue trading places, so that is an accent.

## What a step is

Every colour in Caido comes from a ramp, and a ramp is a row of numbered slots where [each number is a job, not a brightness](/foundations/tokens.md#what-a-step-is). Step 3 is the raised surface in both themes, which makes it a light grey in one and a dark grey in the other.

What this page adds is which job each slot holds for colour. On the neutral ramp they group into four bands:

| Steps | Band |
|---|---|
| 1 to 5 | Backgrounds |
| 6 to 8 | Borders, and the quiet neutral fill |
| 9 and 10 | Solid fills, where 10 is the hover of 9 |
| 11 upward | Text |

The neutral ramp runs to fourteen steps. The six intent ramps stop at twelve and map onto the roles differently, because twelve slots have to serve all four.

[Reference](/foundations/colour/reference.md#what-each-step-holds) lists what every step holds.

## The four roles

Four roles cover the general-purpose colour tokens, and the role tells you where the colour is allowed to go. The accents sit outside them and carry their own names, because what picks the colour is a user or a category rather than the job it does on screen.

| Role | Applies to |
|---|---|
| [`surface`](/foundations/colour/reference.md#surface-tokens) | Backgrounds. The page, a raised panel, a hovered row |
| [`line`](/foundations/colour/reference.md#line-tokens) | Borders and dividers |
| [`fill`](/foundations/colour/reference.md#fill-tokens) | Blocks that are entirely one colour, like a solid button or a status meter |
| [`fg`](/foundations/colour/reference.md#foreground-tokens) | Text and icons |

[Usage](/foundations/colour/usage.md#picking-a-token) turns the four into a question to ask when the role is not obvious.

## Emphasis steps

Inside a role, tokens step from subtle to strong. The step you choose says how much attention the element deserves.

For text, `fg-muted` is for something barely worth reading, `fg-subtle` for supporting text, `fg-default` for body text, and `fg-strong` for text that needs weight.

The same idea runs through the other roles. `line-subtle` separates things that belong together, and `line-strong` marks a boundary that has to be noticed on its own.

Reaching for the strongest step everywhere removes the hierarchy that emphasis exists to create. [Reference](/foundations/colour/reference.md#foreground-tokens) lists every step in each role.

## Why text on a fill is different

Text sitting on a `fill` does not take an `fg` step. It takes a separate `fg-on-*` token.

The reason is that the colour which reads on a solid is decided by that solid, not by the text ladder. Each `fg-on-*` value is calculated against its own fill and against that fill's hover, so a single label stays legible while the button is hovered.

[Usage](/foundations/colour/usage.md#putting-text-on-a-solid-fill) shows how to write the pair.

## Interaction states have their own tokens

A colour that changes on hover has a `-hover` twin rather than a calculation. `fill-primary` is hovered by `fill-primary-hover`, and `surface-hover` is the hovered row.

Every fill and the row surface have a twin, so there is no reason to lighten or darken one. The hover step is a step on the same ramp, chosen so it moves in the direction that reads as a change in each theme: a solid lightens on hover in the dark theme and darkens in the light one, which a single filter cannot do. The link colour has no twin and is brightened on hover, which is the exception the ladder has not caught up with rather than a second way of doing it.

## The focus ring

Keyboard focus is one token, `line-focus`, and it is gold in both appearances: a light gold on dark, a dark gold on light.

It is drawn as an outline with an offset rather than a border or a shadow, so it takes no space in the layout and follows the corner radius. A control that draws its own boundary hides that boundary while focused, because two lines with a gap between them read as a halo rather than as focus.

Both its width and its offset are in pixels rather than `rem`. A user can scale the interface text, and a focus ring that shrinks with the text stops being a focus ring.

## Links

An inline link inside a sentence takes `fg-link`. The link components draw no underline at rest and add one on `:focus-visible`, so a link in running prose is separated by colour alone until it is focused. That is a gap against this topic's own rule on colour as the only signal rather than a decision.

## Light and dark

Every token is defined in both appearances, and the generator refuses to emit when one is missing. You write one name, and where the two values differ the theme decides which appears. Where they are the same the token holds one value, which is itself a decision rather than an oversight.

A step keeps its job across both themes rather than its lightness, so the markup never changes between them. If you find yourself checking the theme in a component, the token you need probably exists already.

## How the values are built

The ramps follow a stated method rather than being picked by eye. The values themselves are committed in the token source, each written to as many decimal places as it needs, so a colour change is visible in a diff.

They are built in OKLCH, a colour space where lightness matches what the eye sees. In HSL it does not. A yellow and a blue can both claim 50 percent lightness in HSL and still differ almost thirteenfold in measured luminance, so every HSL ramp has to be corrected by eye, and the correction breaks the moment the hue changes.

Colour intensity follows a measured curve rather than a straight line. On an intent ramp it peaks at the solid step and falls away at both ends, which is what makes those twelve slots read as one family rather than twelve unrelated colours. The neutral peaks lower, at step 8 in light and step 6 in dark.

When a value would fall outside what a screen can show, intensity is reduced until it fits. Lightness and hue are left alone, because lightness carries the job and hue carries the identity.

Each intent ramp is anchored on a colour Caido already shipped. That colour sits at step 9 and holds one value in both themes, and the rest is derived around it, which is why the brand looks the same in light and dark. The neutral is anchored separately in each appearance, because a grey has no brand to hold.

## Contrast and accessibility

WCAG 2.2 level AA is the contrast target rather than a claim of conformance. The pairings that sit below a floor today are recorded as accepted exceptions, which [Accessibility](/foundations/accessibility.md#aa-is-the-target-not-the-measurement) sets against the rest of the system.

The text floor is 4.5 to 1, from criterion 1.4.3.

The floor for anything that is not text is 3.0 to 1, from criterion 1.4.11, and it applies only when colour is the only thing identifying it. A button with a visible label is identified by that label, so the rule does not apply to its fill.

A pairing is a foreground on a surface, and <TokenCount of="pairings" /> of them are checked in both appearances on every validation run. [Tokens](/foundations/tokens.md#how-pairings-are-checked) covers how, and the part that matters here is that a pairing nobody listed is a pairing nobody measured.

Which surfaces a foreground is approved for is part of the rule. Text on a page or a panel can use any foreground. Text on a component background, such as a hovered or selected row, uses `fg-default` or `fg-strong` only, because those surfaces sit higher up the ramp and the muted steps run out of room against them.

[Usage](/foundations/colour/usage.md#measuring-an-unchecked-pairing) covers how to measure a pairing the system does not already check.
