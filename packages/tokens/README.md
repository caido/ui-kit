# @caido/tokens

The design tokens Caido's interface is built from, and the generator that turns the token source into CSS and TypeScript.

## Install

```sh
pnpm add @caido/tokens
```

## Use

### The stylesheet

Import order matters. This is the entry point Caido's own application uses, with the Tailwind and vendor sheets it sits between:

```css
@layer c-base, c-core, c-components, c-plugin, c-utilities, c-vendor-fixes;

@import "tailwindcss/theme.css" layer(c-base);
@import "tailwindcss/preflight.css" layer(c-base);
@import "@caido/tokens/primevue.css" layer(c-base);
@import "@caido/tokens/legacy.css" layer(c-base);

@import "tailwindcss/utilities.css" layer(c-utilities);

/* Imported after the vendor preset so the token block wins. */
@import "tailwindcss-primeui";
@import "@caido/tokens/tokens.css";
```

Two things about that order are deliberate:

`tokens.css` comes **last**, after `tailwindcss-primeui`. It carries the `@theme` block Tailwind builds utilities from, and the vendor preset writes some of the same classes. Whichever is imported later wins, and it has to be this one.

`primevue.css` and `legacy.css` go in early, and only if you need them. `primevue.css` reads the `--c-*` names `legacy.css` defines, so the two travel together. If you are not driving PrimeVue, import neither.

A consumer that only wants the tokens needs one line:

```css
@import "@caido/tokens/tokens.css";
```

### The font

`fonts.css` is the exception to all of the above. Import it from JavaScript, not from CSS:

```ts
import "@caido/tokens/fonts.css";
```

It has to be reached through the bundler's JavaScript graph because it refers to the font file beside it with a relative url. A bundler rewrites that url and emits the file when the stylesheet arrives through an `import`, and leaves it alone when the stylesheet arrives through a CSS `@import` from another package. Pulled in the second way the rule still parses, the face still gets a name, and the browser requests a file that was never emitted, so the interface silently falls back to the metric matched Arial stack and nothing reports an error.

### In markup

The semantic tier generates Tailwind utilities, so most usage is a class name:

```html
<div class="bg-surface-page text-fg-default border border-line-default rounded">
  <p class="text-title text-fg-subtle">Nothing here yet</p>
  <p class="text-fg-muted">Proxy some traffic to get started.</p>
</div>
```

### In CSS

Where a utility will not do, read the custom property directly:

```css
.panel {
  background: var(--color-surface-raised);
  color: var(--color-fg-default);
  border: 1px solid var(--color-line-default);
}
```

### In TypeScript

The package entry exposes the values that cannot be expressed as a custom property, plus the token name union:

```ts
import { dimensions, icons, layers, resolveIcon, typeSteps } from "@caido/tokens";
import type { TokenName } from "@caido/tokens";
```

## Appearance

Colour tokens are emitted as `light-dark()` pairs, so the appearance is chosen with `color-scheme` rather than by swapping a stylesheet. `tokens.css` wires that to `data-appearance` on the root element.

Set the attribute and the whole interface follows:

```ts
const root = window.document.documentElement;
root.dataset.appearance = "light"; // or "dark"
```

If you also use Tailwind's `dark:` variant, note that it is driven separately. Caido defines the variant against `data-mode` and sets **both** attributes together:

```css
@custom-variant dark (&:where([data-mode=dark], [data-mode=dark] *));
```

```ts
root.dataset.appearance = appearance;
root.dataset.mode = appearance;
```

Setting only one of the two is the common mistake: `data-appearance` alone leaves every `dark:` utility inert, and `data-mode` alone leaves the tokens on the wrong appearance. Most components need neither, because the tokens already carry both values.

A token whose name does not start with `--palette-` follows the appearance. A `--palette-` name is a fixed primitive and does not.

## Entry points

| Entry | Holds |
| --- | --- |
| `@caido/tokens` | Token name type, dimensions, icon rungs, layers, type steps, `resolveIcon` |
| `@caido/tokens/tokens.css` | Every primitive and semantic custom property |
| `@caido/tokens/fonts.css` | The `@font-face` rules and the bundled Inter face |
| `@caido/tokens/tokens.json` | Machine readable manifest of every token: name, variable, tier, light and dark value |
| `@caido/tokens/legacy.css` | Compatibility layer, see below |
| `@caido/tokens/primevue.css` | Compatibility layer, see below |

`tokens.json` is the entry to read if you are generating something from the token set rather than consuming it directly. It names every token, the custom property it emits, whether it is a primitive or a semantic, and what it resolves to in each appearance.

## The compatibility layer

`legacy.css` and `primevue.css` are a bridge, not part of the design system.

`legacy.css` emits a small set of `--c-*` names that predate this package. It is kept because three groups of readers still depend on those exact names: the request highlight colours, which are stored as data rather than looked up, so renaming one stops already marked requests from painting; the scrollbar thumb; and the workflow node colours. It also emits the numbered `--c-primary-*`, `--c-secondary-*` and `--c-surface-*` steps. The surface ladder carries both appearances like every other neutral, so a step means the same job in each. The brand steps do not, because a brand solid is the same colour in both.

`primevue.css` maps those numbered steps onto the `--p-*` names that `tailwindcss-primeui` and two CodeMirror themes read. It reads `legacy.css`, so the two are imported together or not at all.

Both are published so that consumers can migrate off them on their own schedule. Do not build anything new on either one. Prefer the semantic names in `tokens.css`.

## The contract

The token names are a public contract. Plugins and themes are written against them, so a name is harder to change than a value.

### What a version means

| Change | Release |
| --- | --- |
| A token is added | minor |
| A token's value changes while its job stays the same | minor |
| A token is marked deprecated, and still works | minor |
| A token's job changes, so the same name now means something else | major |
| A token name is removed | major |
| An entry point is removed or renamed | major |

A value moving is deliberately not breaking. The contract is the name and the job it names, not the colour behind it. A system where the palette cannot be corrected is a system nobody will correct.

The palette is not part of this. Names beginning `--palette-` are primitives, they generate no utility class, and nothing outside this package should read them. Only the semantic tier is covered.

### The deprecation window

A name that is going is marked in `src/tokens/deprecations.json` with the version that announced it, the reason, and the token to move to. It keeps being emitted, keeps working, and appears in the published manifest with a `deprecated` field so a consumer can find it without reading a changelog.

It may only be removed in a release later than the one that announced it. That is not a convention, it is checked: `src/tokens/contract.json` holds the names the last release published, and the build fails if a name disappears without having been announced first.

```
these tokens were published in 0.1.0-beta.0 and have been removed without a deprecation window:
  color.fg.example
```

### Moving off a deprecated name

Every deprecation that names a replacement is a rename the codemod can apply:

```sh
pnpm --filter @caido/tokens codemod ./src           # report what would change
pnpm --filter @caido/tokens codemod ./src --write   # apply it
```

It rewrites both spellings of a token, the custom property and the dotted path, across CSS, TypeScript, JavaScript, Vue and HTML.

### Releasing

Freeze the contract as part of cutting a release, after the version is bumped:

```sh
pnpm --filter @caido/tokens contract
```

That rewrites `src/tokens/contract.json` from what the source now emits. Doing it at release time rather than on every generate is what makes the check meaningful: the file records what was published, not what is in the working tree.

## How the tokens are generated

Nothing under `src/__generated__` is written by hand. It is produced from `src/tokens`, and CI fails if the two disagree.

### The source

| File | Holds |
| --- | --- |
| `resolver.json` | The manifest. Names the sets, the appearances, and the order they compose in |
| `base.tokens.json` | The palette. Raw values with no job attached, identical in both appearances |
| `appearance/light.tokens.json` | The semantic tier for the light appearance |
| `appearance/dark.tokens.json` | The semantic tier for the dark appearance |
| `type.tokens.json` | Type roles, families, weights and the measure |
| `space.tokens.json` | The grid unit and the radius, fixed in pixels |
| `depth.tokens.json` | The layer scale |
| `motion.tokens.json` | Two durations and two easings |
| `legacy.json` | The names the compatibility layer keeps |
| `icon.tokens.json` | The icon size rungs |
| `state.tokens.json` | The interaction state values, such as the disabled opacity |
| `pairings.json` | Every place a colour lands on another colour, and the contrast rule that applies |
| `contrast-accepted.json` | The pairings below the floor today, each with the reason it is not fixed here |
| `deprecations.json` | Names on their way out, with the version that announced each and what to move to |
| `contract.json` | The names the last release published, so a removal without a window fails the build |

### Two tiers

The palette holds values and no meaning. Its names sit outside every Tailwind namespace, so it generates no utility class, and nothing should reach it directly.

The semantic tier names a job. It is the only tier that becomes a utility class, and the only one a component, a plugin or your own CSS should read.

There is no component tier. The set is 456 tokens today, split evenly between the two.

### The pipeline

1. `resolver.json` names the sets and the order they compose in, per appearance.
2. Each appearance is resolved on its own. The documents are flattened into a single map, then every alias is followed until it reaches a value.
3. The two resolved sets are compared. 158 of the 456 tokens hold a different value in each appearance and are emitted as a `light-dark()` pair. The other 298 are identical in both and are emitted once.
4. The result is written to `src/__generated__` as CSS, TypeScript and JSON.

Because the pair is carried in the value itself, changing appearance is a matter of `color-scheme` alone. No stylesheet is swapped and no class is toggled:

```css
:root {
  color-scheme: light dark;
}
:root[data-appearance="light"] {
  color-scheme: light;
}
:root[data-appearance="dark"] {
  color-scheme: dark;
}
```

That is also why a token is read the same way regardless of appearance, and why a consumer never needs to know which one is active.

### What comes out

| File | For |
| --- | --- |
| `tokens.css` | The custom properties, the appearance switch, and the `@theme` block Tailwind generates utilities from |
| `tokens.ts` | The `TokenName` union, so a token name can be checked at compile time |
| `values.ts` | The values JavaScript has to read, where a custom property will not do |
| `tokens.public.json` | The manifest, published as `@caido/tokens/tokens.json` |
| `legacy.css` | The compatibility layer described above |

### The checks

Nine conditions fail the build, each naming the token that caused it:

- a token defined in one appearance but not the other
- a semantic token whose first segment is not a Tailwind namespace, which would produce a variable but no class
- an alias pointing at a token that does not exist, or a cycle of aliases
- a name in `legacy.json` pointing at a token that no longer exists
- a type step whose size or line height is not a whole number of pixels at the base size
- a deprecation whose token has already gone, so the window it promised is already over
- a deprecation whose replacement does not exist
- a name the last release published, removed without having been deprecated first
- a deprecation that does not say when it was announced or why

Colour pairings are checked separately against a contrast floor. A pairing that falls below it has to be recorded in `src/tokens/contrast-accepted.json` with the reason it is not fixed at the token level. That list can only shrink: a pairing that starts passing must be removed, and the check fails until it is.

### Commands

```sh
pnpm --filter @caido/tokens generate   # regenerate CSS, types and the manifest
pnpm --filter @caido/tokens contrast   # check every pairing against its contrast floor
pnpm --filter @caido/tokens test       # the generator's own tests
```

Run `generate` after any edit under `src/tokens` and commit what changes under `src/__generated__`.
