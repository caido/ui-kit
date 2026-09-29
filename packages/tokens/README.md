# @caido/tokens

The design tokens behind Caido's interface: its colours, sizes, fonts and timings. They ship as CSS variables, Tailwind classes and a small TypeScript API.

```sh
pnpm add @caido/tokens
```

## Getting started

If all you need is the tokens, one import is enough:

```css
@import "@caido/tokens/tokens.css";
```

Most of the time you will just use a class:

```html
<div class="bg-surface-page text-fg-default border border-line-default rounded">
  <p class="text-title text-fg-subtle">Nothing here yet</p>
  <p class="text-fg-muted">Proxy some traffic to get started.</p>
</div>
```

When a class will not do, read the variable directly:

```css
.panel {
  background: var(--color-surface-raised);
  color: var(--color-fg-default);
}
```

From TypeScript you can read the values that cannot live in CSS, and a type listing every token name:

```ts
import {
  dimensions,
  icons,
  layers,
  resolveIcon,
  typeSteps,
} from "@caido/tokens";
import type { TokenName } from "@caido/tokens";
```

## The font

The Inter font has its own stylesheet. Import it from JavaScript, not from CSS:

```ts
import "@caido/tokens/fonts.css";
```

Your bundler only copies the font file when it comes through a JavaScript import. From a CSS `@import`, the file goes missing and the text falls back to Arial without any error.

## Light and dark

Each colour token holds a light and a dark value. To switch, set one attribute on the root element:

```ts
document.documentElement.dataset.appearance = "light"; // or "dark"
```

You rarely need Tailwind's `dark:` variant, because the tokens already change with the appearance.

## Two kinds of token

The palette holds raw values, such as a shade of blue. Its names start with `--palette-`.

Semantic tokens name a job, such as the default text colour or a card border. They are the ones to use: they come with Tailwind classes and follow the appearance. The palette can change at any time.

## What the package exports

| Import                       | What you get                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `@caido/tokens`              | The `TokenName` type, dimensions, icon sizes, layers, type steps and `resolveIcon`                     |
| `@caido/tokens/tokens.css`   | Every token as a custom property, plus the Tailwind theme                                              |
| `@caido/tokens/fonts.css`    | The Inter font                                                                                         |
| `@caido/tokens/tokens.json`  | A list of every token with its tier and its light and dark value, for tools that generate from the set |
| `@caido/tokens/legacy.css`   | Older `--c-*` names, kept for compatibility                                                            |
| `@caido/tokens/primevue.css` | PrimeVue `--p-*` names, kept for compatibility. Needs `legacy.css`                                     |

Do not build anything new on `legacy.css` or `primevue.css`. They will be removed.

## Versioning

Token names are a public contract, because plugins and themes depend on them. Values are not: a colour can be adjusted in a minor release as long as the token keeps the same job.

A release is breaking only when a name or an export is removed, or a name starts to mean something else.

A name is never removed without warning. It is deprecated first, keeps working for at least one release, and is marked `deprecated` in `tokens.json`. If it has a replacement, the codemod can update your code:

```sh
pnpm --filter @caido/tokens codemod ./src           # show what would change
pnpm --filter @caido/tokens codemod ./src --write   # apply it
```

## Working on the tokens

Tokens are defined in the JSON files under `src/tokens`. Everything in `src/__generated__` is built from them, so never edit it by hand. After changing a token, regenerate and commit both.

```sh
mise tokens:generate   # rebuild the CSS, types and manifest
mise tokens:test       # run the generator's tests
mise tokens:contrast   # check colour pairs against the contrast floor
```

The build stops on mistakes, such as a token missing from one appearance or an alias that points nowhere, and names the token at fault.

Contrast is checked for every colour pair in `src/tokens/pairings.json`. A pair that falls short must be listed in `contrast-accepted.json` with a reason.

When releasing, bump the version, then run `mise tokens:contract` to record the published names.
