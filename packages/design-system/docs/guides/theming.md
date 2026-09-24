# Theming

A theme here is a set of colour values, not a set of rules. Redefine what the semantic tokens hold and every component, utility class and editor surface follows, because none of them holds a colour of its own.

That is the whole mechanism. There is no theme API to implement and no component to override. [Theme](/foundations/theme.md) covers the preset those components are drawn with, which is a different layer and is not what a theme changes.

## What a theme overrides

The semantic tier, and only that. There are <TokenCount of="semantic" /> semantic tokens, every one of them a job rather than a value: `color.surface.page` is the page behind everything, `color.fg.default` is ordinary text, `color.line.default` is an ordinary border.

The published manifest lists them, and the ones that matter are the entries whose tier is semantic.

```ts
import manifest from "@caido/tokens/tokens.json";

const semantic = Object.entries(manifest.tokens).filter(
  ([, token]) => token.tier === "semantic",
);
```

Each entry gives the custom property to redefine, its value in each appearance, and whether the two differ.

## What a theme leaves alone

**The palette.** `--palette-*` names hold values and name no jobs. A theme that repaints the palette is not a theme, it is a fork: the semantic tokens point at palette entries, so moving one moves every job that happens to share it, which is how a slightly warmer grey turns into an unreadable disabled state. [Tokens](/foundations/tokens.md) covers why the two tiers are separate.

**The compatibility layer.** `legacy.css` and `primevue.css` carry names the interface is migrating off. They are not part of the system and they will go.

**Everything that is not colour.** Type, space, radius, depth and motion carry density and rhythm rather than palette, so they are the same in every theme. A theme that changes the grid unit is a different interface, not a different theme.

## Whether your override wins

This is the part that decides if a theme works at all, and it is a cascade question rather than a CSS one.

The token declarations are **unlayered**. Caido imports `tokens.css` outside every layer, deliberately, so the token block beats the component library's own stylesheet loaded before it. Unlayered declarations beat layered ones no matter what the layer order says, which has one consequence in each direction.

A plain stylesheet loaded after Caido's own wins, because it is unlayered too and comes later, so no stronger selector and no `!important` is needed.

```css
:root {
  --color-surface-page: oklch(0.21 0.02 265);
  --color-fg-default: oklch(0.93 0.01 265);
}
```

**A stylesheet a plugin ships cannot override a token.** Plugin CSS is injected wrapped in the `c-plugin` layer, and a layered declaration loses to an unlayered one however specific it is. Raising specificity does not help, because specificity is only compared within a layer. [For plugin authors](/get-started/plugins.md) covers what a plugin can style and what it cannot.

## Covering both appearances

A token whose value differs between the two appearances is emitted as a `light-dark()` pair, and the browser picks using `color-scheme`. A theme should do the same, so one declaration serves both.

```css
:root {
  --color-surface-page: light-dark(oklch(0.98 0.01 265), oklch(0.21 0.02 265));
}
```

The manifest says which tokens need a pair: <TokenCount of="varying" /> of the <TokenCount of="total" /> carry a different value in each appearance and the rest hold one value in both. Read the `varies` field rather than guessing.

**A theme that gives a varying token a single value silently drops one appearance.** Nothing errors. The interface renders a dark value on a light page for that one job, and only for that one job, which is why it survives a quick look.

## What a theme owes

A theme is a colour decision, so the floors apply to it exactly as they apply to the system's own colours: 4.5 to 1 for text, and 3 to 1 for anything that is the only thing identifying a control or a state. [Accessibility](/foundations/accessibility.md) covers where those numbers come from.

The system records every place a colour lands on another in its pairing list and measures all <TokenCount of="pairings" /> of them in both appearances. A theme cannot run that check from outside the package, so the obligation moves to whoever wrote the theme: move a foreground, and check it against the surfaces it lands on. The pairing list names which those are.

A theme that has not been measured is a theme that is illegible for somebody.
