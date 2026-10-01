# About the design system

This is the vocabulary Caido is built from: the names for colour, type, space and motion, the components those names assemble into, and the rules that keep a value from being written twice.

It exists because an interface that shows a request, a response and a match set on one screen cannot afford to be decided per screen. A colour picked in one panel and a colour picked in another are two decisions that will drift, and nobody notices until they sit side by side.

This page covers what the system holds, what it deliberately leaves out, and why. [For plugin authors](/get-started/plugins.md) covers what a plugin may rely on, and [For contributors](/get-started/contributing.md) covers how to change any of it.

## Two tiers, and nothing below them

The system publishes **<TokenCount of="total" /> tokens in two tiers, and there is no third**. <TokenCount of="primitive" /> are primitives, the raw steps of each ramp, named by position. <TokenCount of="semantic" /> are semantic, named by the job they do.

A semantic name is what anything outside the token package writes. `surface-raised` says where a colour goes, so it can follow the appearance and be checked for contrast. `palette.neutral.light.3` says only where a colour sits on a ramp, which is why nothing reads it directly.

There is no component tier. A token called `button-background` would name one caller rather than one job, and the second component that wanted the same colour would either reuse a name that lies about it or add a second name for the same value. **One value in two places is not one token.**

## What varies, and what does not

<TokenCount of="varying" /> tokens carry a different value in the light and dark appearances, and every one of them is a colour. That absolute is safe to state because the <TokenCount of="non-colour" /> non-colour semantic tokens were enumerated and none of them varies.

The other <TokenCount of="colour-fixed" /> colour tokens hold a single value in both appearances. They are the brand solids and the labels that land on them: a danger fill and the white that sits on it do not change when the appearance does, because the pairing has to keep its contrast either way.

A varying token is written once, carrying both values, and the browser picks. [Theme](/foundations/theme.md) explains the mechanism and the two root attributes it depends on.

## What it leaves out on purpose

Four omissions are decisions rather than gaps, and each one closes an argument that would otherwise repeat.

| Left out | What exists instead |
| --- | --- |
| A shadow scale | Nothing. The system publishes no shadow token at all, and depth is drawn with surface and line |
| A radius scale | One radius, 6px, written as a bare `rounded` |
| A letter-spacing scale | Nothing. The type roles set size, line height and weight, and no call site adjusts tracking |
| A component tier of tokens | Semantic names that any component may read |

The type, font, weight, line-height, tracking, radius and shadow namespaces are cleared before the roles are declared, so a name from any of them resolves to nothing the system chose. [Type](/foundations/type.md) covers what that means at a call site, because the failure is quieter than it sounds.

## The rules are code, not conventions

Eleven lint rules run at error across the interface, and they are the reason the vocabulary holds. They refuse a raw colour, a primitive token, a ramp step, an arbitrary value, an inline style and a style block, among others. [Enforcement](/guides/enforcement.md) lists each one, where it runs and what it cannot see.

Colour pairings are measured rather than reviewed. **<TokenCount of="pairings" /> pairings are checked in both appearances, and <TokenCount of="accepted-failures" /> failures are carried with a written reason each.** That list can only shrink: a pairing that starts passing fails the check until its entry is deleted. [Accessibility](/foundations/accessibility.md) covers the floors and where they come from.

## How this site is arranged

[Foundations](/foundations/) holds the decisions every component inherits, twelve topics, each with an explanation, a how-to and a reference. [Components](/components/) holds the fourteen pieces the interface is assembled from, with their props, events and slots. [Guides](/guides/) covers how the system changes over time.

A rule is written down once. Where a component page and a foundation page would both explain the same thing, the component page links to the foundation and does not restate it, so there is one place to correct when a value moves.
