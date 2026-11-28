# About the design system

This is the vocabulary Caido is built from: the names for colour, type, space and motion, the components those names assemble into, and the rules that keep a value from being written twice.

It exists because an interface that shows a request, a response and a match set on one screen cannot afford to be decided per screen. A colour picked in one panel and a colour picked in another are two decisions that will drift, and nobody notices until they sit side by side.

[For plugin authors](/get-started/plugins.md) covers what a plugin may rely on, and [For contributors](/get-started/contributing.md) covers how to change any of it.

## Two tiers, and nothing below them

The system publishes **<TokenCount of="total" /> tokens in two tiers, and there is no third**: <TokenCount of="primitive" /> primitives named by their position on a ramp, and <TokenCount of="semantic" /> semantic tokens named by the job they do. Anything outside the token package writes the semantic name. [Two tiers](/foundations/tokens.md#two-tiers) explains the split.

There is no component tier. A token called `button-background` would name one caller rather than one job, and the second component that wanted the same colour would either reuse a name that lies about it or add a second name for the same value. **One value in two places is not one token.**

## What varies, and what does not

<TokenCount of="varying" /> tokens carry a different value in the light and dark appearances, and every one of them is a colour. The other <TokenCount of="colour-fixed" /> colour tokens hold one value in both: a danger fill and the white that sits on it do not change, because the pairing has to keep its contrast either way.

[Theme](/foundations/theme.md) explains how the browser picks between the two values.

## What it leaves out on purpose

These omissions are decisions rather than gaps, and each one closes an argument that would otherwise repeat.

| Left out | What exists instead |
| --- | --- |
| A shadow scale | Nothing. Depth is drawn with surface and line |
| A radius scale | One radius, 6px, written as a bare `rounded` |
| A letter-spacing scale | Nothing. The type roles set size, line height and weight |

The stock framework names for these scales still look valid in markup. [Cleared namespaces](/foundations/tokens/reference.md#cleared-namespaces) lists what each one resolves to.

## The rules are code, not conventions

Eleven lint rules run at error across the interface, refusing a raw colour, a primitive token, an arbitrary value and an inline style, among others. [Enforcement](/guides/enforcement.md) lists each one and what it cannot see.

Colour pairings are measured rather than reviewed: **<TokenCount of="pairings" /> pairings are checked in both appearances, and <TokenCount of="accepted-failures" /> failures are carried with a written reason each.** [Accessibility](/foundations/accessibility.md) covers the floors.

## How this site is arranged

[Foundations](/foundations/) holds the decisions every component inherits, twelve topics, each with an explanation, a how-to and a reference. [Components](/components/) holds the fourteen pieces the interface is assembled from, with their props, events and slots. [Guides](/guides/) covers how the system changes over time.

::: tip
A rule is written down once. A component page links to the foundation that owns a rule rather than restating it.
:::
