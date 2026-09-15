---
title: How to read a spec
---

# How to read a spec

Every component page answers three questions in three tabs, and every number on it carries the rule that produced it. This page shows where each of those lives.

Read a page for the rule and the [token file](#where-the-numbers-live) for the value. Prose explains, generated data decides.

## The three tabs

All thirteen component pages split into Examples, Code and Usage, in that order. The tab you need sits in the same place on every one.

| Tab | Answers | Holds |
|---|---|---|
| Examples | What does it look like? | Live components you can click, tab into and resize |
| Code | What do I type? | The props table, then copyable class strings |
| Usage | When do I reach for it? | When to use, sizing, states, accessibility, content |

Examples are real components, never screenshots. Each frame renders dark and light side by side. A variant that holds in one theme and fails in the other shows up without switching the page.

Code always opens with props and ends with class strings taken from the shipped component. Copy a class string as it stands: it names roles rather than hexes, so it resolves correctly in both themes.

Usage always opens with "When to use" and closes with "Content", with accessibility and states between them.

## Redline tables

Height is the token and padding is derived from it. Read a redline top down, not as a row of independent numbers. One chosen height fixes everything vertical through `height = line box + 2 x padding-block + 2 x border`.

That direction is why derived values look untidy. Select at `md` is 32px around a 20px line box with a 1px border, so padding-block is 5, and 5 is correct rather than rounded.

Redlines arrive in pairs of tables. The first gives the geometry per size or per part. The second gives one row per value, with its rule and named source.

| Table | Read it for |
|---|---|
| Geometry | The px to implement: height, inset, radius, border, icon |
| Value, rule, source | Why that px and not another, and which system it came from |

A number with no row in the second table is unfinished, not settled. State the px first and the class that produces it second, so the value survives a change of framework.

## Do and do not pairs

The two sides of a pair differ in exactly one thing. Find that difference before reading either caption, because the difference is the lesson and the captions only name it.

The caption on the wrong side says what breaks, not what the rule is. It states an observable cost: a row that reflows, a border that disappears, a label announced twice.

<DoDont do="Cancel drops to ghost, so one action reads as the answer." dont="Cancel is primary too. Nothing ranks, and the eye takes the left button.">
  <template #do>
    <DsButton variant="ghost" label="Cancel" />
    <DsButton variant="primary" label="Send request" />
  </template>
  <template #dont>
    <DsButton variant="primary" label="Cancel" />
    <DsButton variant="primary" label="Send request" />
  </template>
</DoDont>

Each side carries its own glyph, a tick or a cross, so the pair still reads when colour is removed.

## Semantic role tokens

A component names a role, never a numbered step. `bg-canvas` is legal and `bg-surface-900` is a defect, because a step number is theme-local.

Zero of the twelve neutral steps holds the same job in light and dark, per [Colour](/foundations/colour). Markup naming a step has written one theme into itself, and the second theme then has nothing left to override.

A role name states a job. `text-ink` is body ink, `text-ink-muted` is secondary text, `border-control` is the boundary of something you can operate.

Pick the role whose job matches, then check the ratio it measures against your surface. A guarantee quoted without its reference background is not a guarantee.

## Where the numbers live

`_tokens/tokens-canonical.json` is the authority. When a page and that file disagree, the file is right. A script solves the values and emits that file, while the prose around it is typed by hand.

| Looking for | Go to |
|---|---|
| A token's value and its job | [Colour](/foundations/colour), Reference tab |
| The contract a pair has to clear | [Accessibility](/foundations/accessibility) |
| Every gated pairing, unrounded | `_tokens/tokens-canonical-selftest.json` |
| What ships today against the spec | [What changed](/changelog) |

The build recomputes both formulas over every pairing and fails when a recomputed number differs from the published one. That gate currently covers 346 tokens and 2,051 pairings at zero failures.

Never round a value you copy out. A ratio quoted to one decimal hides a fail at the boundary, since 3.0 quoted is often 2.97 measured, and 2.97 fails SC 1.4.11.

## When something is not documented

Go to the foundation that owns the rule, not to a component page. Foundations define values and components consume them, so a conflict between the two resolves in favour of the foundation.

| Question | Owner |
|---|---|
| Colour, both ramps, per-step jobs | [Colour](/foundations/colour) |
| Type ramp, line height, measure | [Typography](/foundations/typography) |
| Space scale, control heights, density | [Spacing](/foundations/spacing) |
| Radius, borders, elevation, focus geometry | [Radius, borders, elevation](/foundations/radius-borders-elevation) |
| Duration, easing, reduced motion | [Motion](/foundations/motion) |
| Icon grid, sizing, pairing with text | [Iconography](/foundations/iconography) |
| Token tiers, naming, the role layer | [Tokens](/tokens) |
| What the codebase does today | [Current state](/implementation/current-state) |

If no foundation owns it, the value does not exist yet. Add it to the foundation that should own it, and cite the rule there. A number added straight to a component page gets reinvented at a different value on the next page.
