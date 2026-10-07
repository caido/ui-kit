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

::: tip
This site refers to every token by its token name.
:::

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

Which side it picks is set once, on the root element, as [Appearance](/foundations/tokens/reference.md#appearance) shows. A component names a token and never checks the theme itself.

**If you find yourself checking the theme in a component, the token you need probably exists already.**

## Why stock utility names are not safe to write

Seven Tailwind namespaces, such as `--text-*` and `--radius-*`, are cleared before the tokens are declared. Caido then aliases the common names back onto its own values, so the component preset keeps rendering.

**A stock name in Caido markup therefore resolves to a role nobody chose.** `text-lg` comes out at the heading role, and `rounded-md` at the single radius. A name that is not aliased, such as `shadow-md`, matches nothing at all and fails without a warning.

[Cleared namespaces](/foundations/tokens/reference.md#cleared-namespaces) lists all seven and what replaces each.

## How pairings are checked

Whenever one token lands on another, that combination is a pairing. Each listed pairing is measured in both appearances against a contrast floor, as [Contrast rules](/foundations/tokens/reference.md#contrast-rules) sets out.

**A pairing that is not listed is not checked.** Putting an existing foreground on an existing background does not mean the combination has been measured. If you invent a combination, measure it.

## Names are public API

Plugin authors write these class names in their own source, and Caido cannot rewrite them.

So a token name is a published interface rather than an internal detail. Names are not renamed or removed without warning, and anything on its way out keeps resolving while it is deprecated.

A token's value carries no such promise, and it is not meant to. The value moves when the system improves, which is the reason for naming it in the first place. Write the name, and do not copy the value it resolves to today.
