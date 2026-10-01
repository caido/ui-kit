# Tokens

A token is a name that stands for a value. You write the name, and the system decides the value.

Colour, type steps, spacing rungs and durations in Caido come from one. A raw value is not written in Caido markup, because it cannot follow the theme, cannot be checked for contrast, and cannot be changed in one place. `design/no-raw-color` reports one as an error, and the handful that stand, such as a third-party brand mark, each carry a written reason.

This page explains the model. [Usage](/foundations/tokens/usage.md) shows how to find and write one, [Reference](/foundations/tokens/reference.md) covers the rules and grammar, and [All tokens](/foundations/tokens/all.md) is the searchable list of every name.

## One token, three spellings

The same token looks different depending on where you meet it. All three refer to one thing.

| Spelling | Looks like | Where you meet it |
|---|---|---|
| Token name | `color.surface.page` | the token source, and this site |
| CSS variable | `--color-surface-page` | the generated stylesheet, and anything using `var()` |
| Utility class | `bg-surface-page` | what you write in markup |

The token name is the one this site uses when talking about the system. The utility class is the one you write day to day.

## Two tiers

There are <TokenCount of="total" /> tokens, and they divide into two tiers that do different jobs.

| Tier | Namespace | Count | What it holds |
|---|---|---|---|
| Primitive | `palette.*` | <TokenCount of="primitive" /> | A raw value, at one position on one ramp |
| Semantic | `color.*`, `text.*`, `z-index.*` and the rest | <TokenCount of="semantic" /> | A name that says what the value is for |

**You write semantic names.** Primitives exist so that semantic names have something to point at, and nothing in first-party markup names one directly. `design/no-primitive-token` reports a primitive in Caido markup as an error, and the ramps stay published so that a plugin can read them.

A semantic token holds a pointer rather than a value. `color.surface.page` is `{palette.neutral.light.1}` in the light theme and `{palette.neutral.dark.1}` in the dark one. Changing what step 1 is changes the page background everywhere, in one edit.

## How a name is built

A semantic colour name has three parts, read left to right. Outside colour the role segment is usually dropped, so `text.body` and `z-index.base` have two.

```
color  .  surface  .  page
  │          │         │
  │          │         └─ which one
  │          └─────────── where it is allowed to go
  └────────────────────── which property family
```

**The namespace says which family of properties the token belongs to.** `color` covers colour, `text` covers type, `spacing` and `container` cover size, `duration` and `ease` cover motion, and `z-index` covers depth.

**The role says where the value may be used.** Four roles carry the colours that pair with each other: `surface`, `line`, `fill` and `fg`. A value approved for one of them is not approved for another. The other colour groups put a subject in that segment instead, as `color.syntax.string` and `color.highlight.red` do.

**The name distinguishes one token in that role from the others.** It does so by emphasis (`subtle`, `default`, `strong`), by meaning (`danger`, `success`), or by naming the place it belongs, as `color.surface.page` does.

A ramp primitive has four parts instead, because a primitive is a position rather than a purpose:

```
palette  .  neutral  .  light  .  1
   │           │          │       │
   │           │          │       └─ step
   │           │          └───────── appearance
   │           └──────────────────── family
   └──────────────────────────────── namespace
```

## What a step is

A ramp is a row of numbered slots. **Each number is a job rather than a brightness.**

Step 3 is the raised surface. In the light theme that makes it a light grey, and in the dark theme a dark grey. It is step 3 in both. A step is chosen for what it is for rather than for how light it is.

This is what lets one semantic name work in both themes. The name points at a slot, the slot holds a job, and the appearance decides the value.

The neutral ramp runs to fourteen steps and the six intent ramps stop at twelve. [Colour](/foundations/colour/reference.md#what-each-step-holds) lists what each step holds and how the two differ.

## How a token resolves to a value

<TokenCount of="varying" /> of the <TokenCount of="total" /> tokens hold a different value in each theme. The other <TokenCount of="fixed" /> hold one value in both.

A token that varies is emitted as a `light-dark()` pair, and the browser picks a side based on the `color-scheme` property:

```css
--color-surface-page: light-dark(oklch(0.9746 0.014 70), oklch(0.2732 0.0115 271));
```

Which side it picks is set in one place, on the root element:

| Root | `color-scheme` | Result |
|---|---|---|
| no attribute | `light dark` | follows the operating system |
| `data-appearance="light"` | `light` | always light |
| `data-appearance="dark"` | `dark` | always dark |

Nothing below the root sets that property. A component names a token rather than the appearance, and needs no second class name for the other theme. The code editor is the exception on record: it picks light or dark from its own facet rather than from a custom property, so it reads the resolved mode off the root. **If you find yourself checking the theme in a component, the token you need probably exists already.**

## Why stock utility names are not safe to write

Seven namespaces are deliberately emptied before the tokens are declared:

```css
--text-*: initial;
--font-*: initial;
--font-weight-*: initial;
--leading-*: initial;
--tracking-*: initial;
--radius-*: initial;
--shadow-*: initial;
```

Emptying a namespace removes the stock utilities keyed to it, so `text-lg`, `text-sm`, `font-semibold` and `rounded-lg` lose the values the framework gave them. Caido then aliases those names back onto its own values, because the shipped component preset writes them in its own markup and would otherwise render unstyled.

**A stock name written in Caido markup therefore resolves to a role nobody chose.** `text-lg` comes out at the heading role, `text-sm` at caption, `font-semibold` at 600, and `rounded-md` at the single radius. `design/no-preset-scale` reports twelve of these names as an error and gives the replacement to write, which is what keeps the alias available to the preset rather than to first-party markup.

A name the theme block does not refill fails the other way, and that failure is quieter. It does not fall back to a default, does not warn, and does not appear in any error. `tracking-wide` and `shadow-md` match no utility, so the element renders at whatever it inherited and the mistake stays invisible until somebody measures it.

The namespaces are cleared on purpose. A component picks a type role rather than a font size, so the system refills most of these namespaces with the names it does support. [Type](/foundations/type.md) and [Space](/foundations/space.md) cover what replaced them, and [Reference](/foundations/tokens/reference.md#cleared-namespaces) lists each one against its replacement.

Shadow is the one cleared and left without a replacement, so the depth names from `shadow-2xs` to `shadow-2xl` match nothing, while `shadow-none` and the shadow colour utilities keep working. The system publishes one radius token, which is why the corner to write is the bare `rounded`. The theme block still hands `rounded-xl` through `rounded-4xl` fixed values of 12px, 16px, 24px and 32px, and those four sit outside the twelve names the rule reports, so they paint a corner nobody chose and nothing flags it.

**The colour namespace is not cleared.** Stock colours like `bg-red-500` still render, and they are still wrong because a fixed colour cannot follow the theme, but they fail by looking wrong rather than by doing nothing.

## How pairings are checked

Whenever one token lands on another, that combination is a pairing. <TokenCount of="pairings" /> of them are listed in the token source, and a contrast script measures each one in both appearances. That script is run on its own rather than as part of the build.

| Usage | Floor | Pairings | What it covers |
|---|---|---|---|
| `text` | 4.5 | 142 | Anything a person reads |
| `identifier` | 3.0 | 22 | Colour that is the only thing identifying a control |
| `focus` | 3.0 | 5 | The focus ring against what sits behind it |

The comparison reads the unrounded ratio, so 4.48 fails. <TokenCount of="accepted-failures" /> pairings are recorded as accepted exceptions, each naming the appearance it applies to and why the fix belongs elsewhere.

The part that matters when you build something new is short. **A pairing that is not listed is not checked.** Putting an existing foreground on an existing background does not mean the combination has been measured, only that both tokens exist. If you invent a combination, measure it.

## Names are public API

Plugin authors write these class names in their own source, and Caido cannot rewrite them.

So a token name is a published interface rather than an internal detail. Names are not renamed or removed without warning, and anything on its way out keeps resolving while it is deprecated.

A token's value carries no such promise, and it is not meant to. The value moves when the system improves, which is the reason for naming it in the first place. Write the name, and do not copy the value it resolves to today.
