# For plugin authors

A plugin is Vue components mounted into a page Caido gives it, so it inherits Caido's tokens. A plugin written against these names follows the appearance, the [type scale](/foundations/type.md) and the [spacing ladder](/foundations/space.md), and keeps following them when those values change. The work is choosing the right name on the right element, not writing a stylesheet.

**Anything on this page you may rely on. Anything not on this page can move in any release without warning.**

## What you may rely on

| Surface | What it is |
| --- | --- |
| `@caido/tokens/tokens.css` | Every semantic custom property, such as `--color-surface-page` and `--text-body` |
| The utility classes those generate | `bg-surface-page`, `text-fg-default`, `border-line-default` and the rest of each family |
| `@caido/tokens/tokens.json` | The machine readable list of every token, its variable, its tier and its value in each appearance |
| `@caido/tokens` | `TokenName`, `dimensions`, `icons`, `layers`, `typeSteps`, `iconAliases`, `resolveIcon` and `rowHeight` |
| `@caido/tokens/fonts.css` | The interface font faces, imported from JavaScript rather than from CSS |
| `@caido/eslint-config` | The design rules, off by default and turned on with `design: true` |

## What you may not

**The palette.** Names beginning `--palette-` are [primitives](/foundations/tokens.md#two-tiers). They name no job and move whenever a colour is corrected, so a value read from one is right today and wrong after the next palette change.

**The compatibility layer.** `legacy.css`, `primevue.css` and the five `plugin-*.css` sheets carry an older vocabulary. The `--c-*` and `--p-*` names in them are not part of the system and will go, as [If your plugin was written before this](#if-your-plugin-was-written-before-this) explains.

**Anything else.** Internal class names, DOM structure, the shape of the generated CSS. If it is not in the table above, it is not a contract.

## Reading a token

Write the utility class on the element. It carries the value, the appearance and any state variant at once, and it is the only spelling the [lint rules](/guides/enforcement.md) can check.

```vue
<template>
  <div class="rounded border border-line-default bg-surface-raised p-4">
    <p class="text-title text-fg-strong">Findings</p>
    <p class="text-body text-fg-subtle">Nothing matched this filter yet.</p>
  </div>
</template>
```

[Colour](/foundations/colour.md) explains which family to reach for: `surface` for a background a thing sits on, `fill` for a background a component paints, `fg` for text, `line` for a border.

A stylesheet is a last resort. No rule forbids one, but a plugin that needs CSS is usually reaching for a value the system already names. Where you have to, read the custom property.

```css
background: var(--color-surface-raised);
```

Never write a colour literal. It has no second value, so it is wrong in one of the two appearances.

## One rem is not sixteen pixels

The root font size is the [text size setting](/foundations/type.md#what-the-text-size-setting-moves): **14 pixels by default, and anywhere from 12 to 24**. So `1rem` is whatever that setting holds, and every type step is written as a ratio against 14, such as `--text-caption` at `calc(12 / 14 * 1rem)`. A plugin that assumes `1rem` is sixteen pixels is wrong at every setting.

The spacing unit, the radius, the icon sizes and the dialog widths are written in pixels because they should not scale. **A value written in a scaling unit is a promise that it grows with the text.**

## Using the component preset

The components Caido is built from are not published, so a plugin cannot import them. [Components](/components/) documents them because their behaviour is the system's.

What is published is `@caido/primevue`, the pass-through preset those components are drawn with. It has no exports map and so no declared surface: treat it as useful rather than guaranteed. If you install it, two steps are easy to miss and neither fails loudly.

Tailwind has to be told to scan it, because its classes live in a file inside `node_modules`.

```css
@source "./node_modules/@caido/primevue/dist/primevue.mjs";
```

Then the scale names have to be aliased. The preset writes `rounded-md` 84 times, along with `rounded-sm`, `rounded-lg`, `text-sm`, `text-xl` and `shadow-lg`. The token package [clears those namespaces](/foundations/tokens/reference.md#cleared-namespaces), and the aliases live in the interface's private stylesheet. **Without them, the preset renders square-cornered and mis-sized, with no error.**

```css
@theme {
  --radius-sm: var(--radius);
  --radius-md: var(--radius);
  --radius-lg: var(--radius);
  --text-sm: var(--text-caption);
  --text-xl: var(--text-title);
}
```

## Your CSS and the cascade

Plugin styles are injected inside a named layer.

```css
@layer c-plugin { /* your css */ }
```

The full order is `c-base`, `c-core`, `c-components`, `c-plugin`, `c-utilities`, `c-vendor-fixes`. Your rules beat component styles, so you can restyle a control Caido drew. They lose to utility classes, so a `bg-surface-page` in the markup wins over a `background` in your stylesheet. **Change the class rather than raising specificity, because specificity does not cross layers.**

The interface zeroes every `shadow-*` class, but not inside the two wrappers a plugin page mounts into, so a plugin keeps its shadows.

## The appearance

Colour tokens carry both appearances in one value, so a plugin writes the token and the browser picks. Read neither `data-appearance` nor `data-mode` on the root: [Theme](/foundations/theme.md#appearance-belongs-to-the-token-not-to-a-variant) explains why a `dark:` pair on a token is wrong. If you find yourself checking one, the value you are switching on wants to be a token.

## If your plugin was written before this

A plugin compiled against the older vocabulary, with colours such as `hsl(var(--c-name))` and step classes such as `bg-surface-0`, keeps rendering. Caido loads these compatibility sheets for it, with nothing to import.

| Sheet | What it keeps working |
| --- | --- |
| `plugin-compat.css` | The legacy colour names, one value each, held across both appearances |
| `plugin-primevue.css` | The `--p-` names, scoped to what a plugin renders into |
| `plugin-utilities.css` | The utility classes the interface used to emit |
| `plugin-light.css` | The light appearance, mapped per property rather than per step |
| `plugin-light-important.css` | The important half of the same |

Their numbered ramp is absolute, so step 0 is the lightest in both appearances and a `bg-surface-0 dark:bg-surface-800` pair keeps working.

**All five are deleted once the last plugin has moved off them.**

## Migrating an existing plugin

The compatibility sheets keep an older plugin rendering, but it does not follow a change of appearance or text size. Start with colour, where the drift shows first: almost every literal already has a name, and swapping it in is the whole change.

| What a plugin tends to carry | What it becomes |
| --- | --- |
| A colour literal, or a colour function | The class for the job, such as `bg-surface-raised` or `text-fg-muted` |
| A stock ramp class such as `text-red-400` | The name for what it meant, such as `text-fg-danger` |
| A framework scale name such as `text-sm` | The step it stands for, such as `text-caption` |
| A size in `rem` written against sixteen pixels | The type step, which is written against the setting |
| A declaration a token already names | The class on the element, and one stylesheet fewer |

The design rules find all of it. They ship in `@caido/eslint-config`, off by default, and one line turns them on across every `.vue` and `.ts` file.

```ts
import { defaultConfig } from "@caido/eslint-config";

export default defaultConfig({ design: true });
```

Install `@caido/tokens` beside it, because the rules check names against its published list. Every rule reports at error, so treat the first run as a survey. [Enforcement](/guides/enforcement.md) covers what each rule rejects, and how to record a reason where a value has no name yet.

## When a token is going away

A name is marked deprecated before it is removed, keeps working meanwhile, and carries the reason and its replacement in the manifest.

```json
"color.fg.example": {
  "variable": "--color-fg-example",
  "tier": "semantic",
  "deprecated": {
    "replacement": "color.fg.muted",
    "since": "0.2.0",
    "reason": "The name said where it was used rather than what it means"
  }
}
```

Every deprecation that names a replacement is a rename a codemod can apply.

```sh
pnpm --filter @caido/tokens codemod ./src           # report what would change
pnpm --filter @caido/tokens codemod ./src --write   # apply it
```

Nothing is deprecated today. [The deprecation window](/guides/governance.md#the-deprecation-window) covers how long a deprecated name stays.
