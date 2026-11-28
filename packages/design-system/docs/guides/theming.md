# Theming

A theme is a set of colour values. Redefine what the semantic tokens hold and every component, utility class and editor surface follows, because none of them holds a colour of its own. There is no theme API and no component to override.

::: tip
[Theme](/foundations/theme.md) covers the component preset, which is a different layer and is not what a theme changes.
:::

## What a theme overrides

The semantic tier, and only that: <TokenCount of="semantic" /> tokens, each named for a job, such as `color.fg.default` for ordinary text. The published manifest lists them.

```ts
import manifest from "@caido/tokens/tokens.json";

const semantic = Object.entries(manifest.tokens).filter(
  ([, token]) => token.tier === "semantic",
);
```

Each entry gives the custom property to redefine, its value in each appearance, and whether the two differ.

## What a theme leaves alone

**The palette.** Repainting a `--palette-*` entry moves every job that happens to share it, which is how a slightly warmer grey turns into an unreadable disabled state. That is a fork, not a theme.

**The compatibility layer.** The legacy and plugin sheets are not part of the system and [will go](/get-started/plugins.md#if-your-plugin-was-written-before-this).

**Everything that is not colour.** Type, space, radius, depth and motion are the same in every theme. A theme that changes the grid unit is a different interface.

## Whether your override wins

Caido imports `tokens.css` **outside every layer**, so the token block beats the component library's own stylesheet loaded before it. Unlayered declarations beat layered ones whatever the layer order, which cuts both ways.

A plain stylesheet loaded after Caido's own wins, because it is unlayered too and comes later. No stronger selector and no `!important` is needed.

```css
:root {
  --color-surface-page: oklch(0.21 0.02 265);
  --color-fg-default: oklch(0.93 0.01 265);
}
```

**A stylesheet a plugin ships cannot override a token.** Plugin CSS is injected in the `c-plugin` layer, and a layered declaration loses to an unlayered one however specific it is. [Your CSS and the cascade](/get-started/plugins.md#your-css-and-the-cascade) covers what a plugin can style.

## Covering both appearances

A token whose value differs between the appearances is a `light-dark()` pair, and a theme should write one too.

```css
:root {
  --color-surface-page: light-dark(oklch(0.98 0.01 265), oklch(0.21 0.02 265));
}
```

<TokenCount of="varying" /> of the <TokenCount of="total" /> tokens need a pair, and the manifest's `varies` field says which. **A theme that gives a varying token a single value silently drops one appearance**, for that one job only, which is why it survives a quick look.

## What a theme owes

The [contrast floors](/foundations/tokens/reference.md#contrast-rules) apply to a theme exactly as to the system's own colours. The system measures its <TokenCount of="pairings" /> pairings from inside the package, which a theme cannot do, so **whoever writes the theme measures it**: move a foreground, and check it against each surface the pairing list puts it on.
