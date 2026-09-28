# For plugin authors

A plugin draws inside Caido's interface, so it inherits Caido's tokens. That is the point: a plugin written against these names follows the appearance, the [type scale](/foundations/type.md) and the [spacing ladder](/foundations/space.md) without doing anything, and it keeps following them when those values change.

A plugin is Vue components mounted into a page Caido gives it. You should not need to write a stylesheet, and you should not be writing markup by hand: the work is choosing the right name on the right element.

It also means the names are a contract. Anything on this page you may rely on. Anything not on this page can move in any release without warning.

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

**The palette.** Names beginning `--palette-` are primitives, the lower of the two [token tiers](/foundations/tokens.md). They hold a value and name no job, they generate no utility class, and they are free to move whenever a colour is corrected. Reading one gives you a colour that is right today and wrong after the next palette change.

**The compatibility layer.** `legacy.css`, `primevue.css` and the five `plugin-*.css` sheets carry an older vocabulary that the interface and the plugins written against it are still moving off. The `--c-*` and `--p-*` names in them are not part of the system and will go. A plugin reads none of them directly, which the section below explains.

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

A stylesheet is a last resort rather than a starting point. Nothing forbids one, and there is no rule against it, but a plugin that needs CSS is usually a plugin reaching for a value the system already names. Where you genuinely have to, read the custom property rather than a literal.

```css
background: var(--color-surface-raised);
```

Never write a colour literal. A literal has no second value, so it is wrong in one of the two appearances, and no contrast figure, so nobody knows whether it is legible.

## One rem is not sixteen pixels

The root font size is a setting. It defaults to **14 pixels and somebody can move it anywhere from 12 to 24**, and Caido writes that number onto the root element, so `1rem` is whatever that setting holds.

Every type step is written as a ratio against 14 so it lands on whole pixels at the default: `--text-body` is `calc(14 / 14 * 1rem)`, `--text-caption` is `calc(12 / 14 * 1rem)`. A plugin that hardcodes `1rem` meaning sixteen pixels is wrong at the default and wrong by a different amount at every other setting.

What the system does not want to scale is written in pixels instead: the spacing unit, the radius, the icon sizes and the dialog widths. **A value written in a scaling unit is a promise that it grows with the text.**

## Using the component preset

The components Caido itself is built from are not published. [Components](/components/) documents them because their behaviour is the system's, and a plugin cannot import them.

What is published is `@caido/primevue`, the pass-through preset those components are drawn with, which you can apply to your own component library. It is not in the table above, because it has no exports map and therefore no declared surface, so treat it as useful rather than guaranteed.

If you do install it, two steps are easy to miss and neither one fails loudly.

Tailwind has to be told to scan it, because the preset's classes live in a file inside `node_modules` that nothing else points at.

```css
@source "./node_modules/@caido/primevue/dist/primevue.mjs";
```

Then the scale names have to be aliased. The preset writes `rounded-md` **84 times**, along with `rounded-sm`, `rounded-lg`, `text-sm`, `text-xl` and `shadow-lg`. The token package clears all of those namespaces and defines none of those keys, and the aliasing that makes them work lives in the interface's own private stylesheet, which is not published. So a plugin that installs the preset and the tokens and nothing else renders square-cornered and mis-sized, with no error, no warning and no missing file.

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

The full order is `c-base`, `c-core`, `c-components`, `c-plugin`, `c-utilities`, `c-vendor-fixes`. Two consequences are worth knowing before you fight one of them.

Your rules beat component styles, because `c-plugin` comes after `c-components`. You can restyle a control Caido drew.

Your rules lose to utility classes, because `c-utilities` comes after `c-plugin`. A `bg-surface-page` in the markup wins over a `background` in your stylesheet. **Change the class rather than raising specificity, because specificity does not cross layers.**

One carve-out runs the other way. The interface draws no shadow and zeroes every `shadow-*` class, but it excludes the two wrappers a plugin page mounts into, so a plugin keeps its shadows.

## The appearance

Colour tokens carry both appearances in one value, so nothing in a plugin has to branch on the current one. Write the token and the browser picks.

Caido sets two attributes on the root element together, which [Theme](/foundations/theme.md) covers in full. `data-appearance` drives `color-scheme`, which selects between the two halves of every colour token. `data-mode` drives the `dark:` variant. A plugin should read neither, because a token already carries both values. If you find yourself checking one, the value you are switching on wants to be a token.

## If your plugin was written before this

Nothing breaks on the day the tokens ship. A plugin compiled against the older vocabulary writes every colour as `hsl(var(--c-name))` and reaches for numbered step classes such as `bg-surface-0`, and Caido loads a set of compatibility sheets that keep both resolving. Nothing has to be imported and nothing has to be changed for that to happen.

| Sheet | What it keeps working |
| --- | --- |
| `plugin-compat.css` | The legacy colour names, one value each, held across both appearances |
| `plugin-primevue.css` | The `--p-` names, scoped to what a plugin renders into |
| `plugin-utilities.css` | The utility classes the interface used to emit |
| `plugin-light.css` | The light appearance, mapped per property rather than per step |
| `plugin-light-important.css` | The important half of the same |

The numbered ramp in them is absolute rather than relative to the appearance, so step 0 is the lightest in both and a plugin that writes `bg-surface-0 dark:bg-surface-800` keeps switching the appearance for itself. That is deliberate, because a step that moved with the appearance would invert every pair written that way.

**All five are deleted once the last plugin has moved off them.** They are a bridge with an end rather than a surface to build on.

## Migrating an existing plugin

The sheets above keep an older plugin rendering, and they cannot make it follow anything. It holds its own colours when somebody changes the appearance, its own sizes when somebody moves the root font setting, and the values it was given on the day it was written while the interface around it moves on. That gap only widens, and the sheets do not last.

Colour is where the drift shows first, so it is the part worth doing on its own. Almost every literal in a plugin has a name already, and swapping it for that name is the whole change.

| What a plugin tends to carry | What it becomes |
| --- | --- |
| A colour literal, or a colour function | The class for the job, such as `bg-surface-raised` or `text-fg-muted` |
| A stock ramp class such as `text-red-400` | The name for what it meant, such as `text-fg-danger` |
| A framework scale name such as `text-sm` | The step it stands for, such as `text-caption` |
| A size in `rem` written against sixteen pixels | The type step, which is written against the setting |
| A declaration a token already names | The class on the element, and one stylesheet fewer |

None of it has to be found by reading. The eleven design rules ship in `@caido/eslint-config`, they stay off until asked for, and one line turns them on across every `.vue` and `.ts` file in the plugin.

```ts
import { defaultConfig } from "@caido/eslint-config";

export default defaultConfig({ design: true });
```

`@caido/tokens` has to be installed beside it, because the rules that check a name against the published list read that list rather than a copy of it. Every rule reports at error, so **the first run on a plugin that has never had them is a survey rather than a list of things to do tonight**. [Enforcement](/guides/enforcement.md) covers what each rule rejects, and how to record a reason where a value genuinely has no name yet.

## When a token is going away

A name never disappears without notice. It is marked deprecated first, keeps working for at least one release after that, and carries the reason and its replacement in the manifest.

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

Nothing is deprecated today, so that command reports nothing to do. The window is checked rather than promised: building the token package fails if a published name is removed without having been deprecated in an earlier release. [Governance](/guides/governance.md) covers what counts as a breaking change and how long the window is.
