# Current state

Paper ships. The light theme is in the working tree as `packages/components/src/styles/theme.light.css`, the runtime sets `data-mode` from a saved setting, and dark did not move. This page records what is left.

| The question you probably came with | The measured answer |
|---|---|
| Can a user switch the theme today | Yes. A setting, a store, a boot script and a `watchEffect` are all in the tree |
| Did the call sites get migrated | Yes. 107 `surface-N` utilities remain in application source and every one is dark-scoped |
| What still cannot flip | The dark control boundary, the CodeMirror `dark` flag and 58 raw Tailwind utilities |
| What the vendor pins | 597 light-branch `surface-N` references inside `@caido/primevue@0.3.3` |
| What blocks plugins | `sdk-frontend` still exposes nothing about colour mode, D44 |
| What dark inherited | Its own contrast failures, preserved on purpose by the byte-identical rule |

- **Scope.** `packages/{ui,components,rete,codemirror,sdk-frontend,types,services,stores}`, plus `@caido/primevue@0.3.3`, `@caido/common-frontend@2.7.4` and `@caido/tailwindcss@0.0.1`.
- **Measured on 2026-08-20** against the working tree and the resolved `node_modules` bundles, with contrast computed from the shipping HSL triplets by the WCAG 2.2 relative-luminance formula.
- **Every count** is a grep over `packages/*/src` or over `dist/primevue.mjs`, run fresh rather than carried forward.
- **Companions.** [Migration](/implementation/migration) sequences the work that remains, and the [changelog](/changelog) records every value that changed.

## What ships today

### The mechanism, end to end

Six pieces make the switch work, and none of them is a stub.

| Piece | Where | What it does |
|---|---|---|
| The setting | `packages/types/src/core/settings.ts:377` | `z.enum(["dark","light"]).default("dark").catch("dark")` |
| The store message | `packages/stores/src/settings/useSettingsState.ts:40` | `FSMMessage<"SetColorMode", { colorMode: ColorMode }>` |
| The service | `packages/services/src/settings/useSettingsState.ts:198` | writes the backend setting and mirrors it to `localStorage` |
| The runtime | `packages/ui/src/components/authenticated/EnvProvider/useColorMode.ts:11` | `documentElement.dataset.mode = colorMode.value` inside a `watchEffect` |
| The boot script | `packages/ui/index.html:7-17` | blocking read of `caido.colorMode` so the first paint is not dark |
| The control | `packages/ui/src/components/settings/ColorMode/` | a `settings.appearance.colorMode` picker beside the font controls |

The boot script is the piece a light theme usually forgets. `main.ts` is deferred, so without it every launch flashes the dark canvas before Vue mounts.

### The layer order carries the theme

`packages/ui/src/styles/index.css:1` and `packages/components/src/styles/index.css:1` both open with the same declaration:

```css
@layer c-base, c-core, c-theme, c-components, c-plugin, c-utilities, c-overrides;
```

| Layer | Why it sits there |
|---|---|
| `c-theme` after `c-core` | the theme has to beat `@caido/common-frontend`'s prebuilt rules, which it cannot do from an earlier layer |
| `c-overrides` after `c-utilities` | only a later layer can beat a Tailwind utility, which is what the vendor preset emits for control boundaries |
| `theme.light.css` imported without `layer()` | the file declares both layers itself, so wrapping it would collapse them into one |

### The token layer has one owner

`packages/ui/src/styles/tokens.css` and `primevue.css` are now one-line `@import` shims pointing at the `packages/components` copies. The byte-for-byte duplication is gone, and a light value can only be edited in one place.

| File | Lines | Role |
|---|---|---|
| `packages/components/src/styles/tokens.css` | 239 | the dark rungs, plus every alias with a dark value identical to the rung it replaced |
| `packages/components/src/styles/theme.light.css` | 423 | Paper, scoped to `:root[data-mode="light"]`, heavily commented |
| `packages/components/src/styles/primevue.css` | 99 | the `--p-*` bridge, with a base block, a light block and a dark block |

Both `packages/ui` and `packages/components` import `theme.light.css`, so a product that bundles both ships the theme twice. That is a build-output concern rather than a correctness one.

## The call sites are migrated

### The census

`tailwind.config.js` now carries a `theme.extend.colors` key in both packages, exposing thirteen role names as utilities: `canvas`, `raised`, `overlay`, `inset`, `chip`, four `ink-*` and four `line-*`.

```
role-utility usages across app source ................. 442
surface-N utility usages remaining .................... 107  (in 69 files)
   of those, dark-scoped .............................. 107
   of those, unprefixed ...............................   0
dark: occurrences across app source ................... 203  (in 112 files)
```

The previous pass recorded 452 `surface-N` lines with one `dark:` variant among them. Both halves of that number have moved.

| Package | `surface-N` remaining | All dark-scoped |
|---|---|---|
| `ui/src` | 97 | yes |
| `components/src` | 10 | yes |
| `rete/src` | 0 | n/a |
| `codemirror/src` | 0 | n/a |

### What the remaining hundred are for

Every one is a dark-branch pin, written so the shipping dark rendering does not move when the role alias takes over the light branch.

| Pattern | Count | Read it as |
|---|---|---|
| `text-ink-muted dark:text-surface-500` | 49 | light takes the role, dark keeps the exact step it had |
| `border-line dark:border-surface-700` | 11 | same, for the control boundary |
| `bg-chip dark:bg-surface-800` | 5 | same, for the table header slab |
| `bg-[var(--c-hover-overlay)] dark:hover:bg-surface-700` | 7 | the hover affordance, split by theme |

This is the shape the migration adopted, and it is also where the honesty lies. A `dark:` pin preserves a dark value whether or not that value was correct.

<DoDont
  do="Pin the dark step and let the role own the light branch."
  dont="Pin the light step and the role owns nothing at all.">
  <template #do>
    <div class="rounded-md border border-separator bg-raised px-3.5 py-2.5 text-code text-ink-muted">Send to Replay</div>
  </template>
  <template #dont>
    <div class="rounded-md border border-separator bg-raised px-3.5 py-2.5 text-code text-ink">Send to Replay</div>
  </template>
</DoDont>

### Colour that used to be unreachable

| Surface | Then | Now |
|---|---|---|
| Hex literals in application source | ~106 | 13, all inside `.spec.ts` fixtures |
| Raw colour in `packages/codemirror/src` | 54 syntax hexes plus the editor chrome | 0, against 52 `--c-syntax-*` references |
| `CTable` zebra, hover and selection scrim | three hardcoded literals | `--c-table-stripe`, `--c-plane-hover-row`, `--c-table-selection-overlay` |
| Row-highlight swatch foregrounds | absent, so the fill doubled as the icon colour | `--c-highlight-swatch-*`, split from the persisted `--c-highlight-color-*` fills |
| Search-field clear icon | `fill='white'` baked into a data URI | `--c-search-cancel-icon`, restated per theme because a data URI cannot use `currentColor` |
| Workflow node colours | four literals in `colors.variables.css` | `--c-workflow-node-*`, re-derived for paper |

The row-highlight split is the one worth studying. `composables/request/useRequestRowContextMenu/highlight.ts` persists the literal string `var(--c-highlight-color-<hue>)` as request metadata, so the fill name is user data and cannot be renamed. Splitting the swatch foreground into a second token keeps the stored string valid while giving the icon its own contrast budget.

## What the preset pins

### The light branch names the ramp

`@caido/primevue@0.3.3` is published, and `pnpm-workspace.yaml` still carries no `patchedDependencies` block. Its class strings decide what each `surface` rung has to mean in light.

```
surface-N references in dist/primevue.mjs ............. 1005
   light branch, no dark: prefix ......................  597
   dark-scoped ........................................  408
primary-N references .................................. 137
```

| Preset class | Count | What it forces Paper's rung to be |
|---|---|---|
| `bg-surface-0` | 104 | the raised plane, so rung 0 is the lightest value in the ramp |
| `text-surface-700` | 81 | body ink |
| `border-surface-200` | 63 | a line, not a plane |
| `bg-surface-200` | 33 | a chip fill, which is the same rung doing a second job |
| `text-surface-500` | 33 | muted text |
| `border-surface-300` | 30 | the second line weight |
| `text-surface-600` | 30 | secondary body |

Rungs 200 and 300 are pinned by that light branch, which is why `tokens.css:77-82` mints 150 and 350 as half-rungs rather than moving the pinned pair. The inset plane and the control boundary needed values the preset had already spoken for.

### The two rules the preset made necessary

`theme.light.css` closes with a `c-overrides` layer holding exactly two rules, both keyed on `data-pc-*` attributes rather than on the preset's class strings.

| Rule | Selectors | Why it exists |
|---|---|---|
| Control boundary | 12 | the preset emits `border-surface-200`, which measures **1.51:1** on the raised plane against SC 1.4.11's 3:1 |
| PanelMenu plane | 2 | `panelmenu.root` and `panelmenu.panel` are `bg-surface-800` with no light value, and in Paper rung 800 is heading ink |

After the override, `--c-line-control` clears the gate on every plane a control can sit on:

| Boundary against | Measured | Gate |
|---|---|---|
| Raised plane | **4.12:1** | 3:1, pass |
| Page canvas | **3.63:1** | 3:1, pass |
| Inset plane | **3.08:1** | 3:1, pass |

That single row is the whole argument for validating a border token against every surface a control sits on rather than against one.

### The gold-fill collision, and where it went

`primevue.mjs:513-515` renders the Secondary Button as `text-surface-900 dark:text-white` over `bg-secondary-400`. Both halves are hardcoded, so neither theme can reach them.

| Case | Label on the gold fill | Measured |
|---|---|---|
| Dark, as shipped | white on the dark gold | **2.31:1** |
| Dark, with the correct label | the canvas ink on the same gold | 6.47:1 |
| Light, as Paper resolves it | rung 900 ink on the darkened gold | **3.53:1** |

Paper darkened `secondary-400` to 29.5% lightness so the gold could serve as ink at **5.70:1** on canvas. That fixes gold text and leaves the button label short, because the label class is a vendor literal. Five more light-branch gold fills carry the same collision, at `:1122`, `:5872`, `:6079`, `:6991` and `:7530`.

## What the light theme still needs

### The dark control boundary was never repointed

The preset writes 48 instances of `border-surface-200 dark:border-surface-700`. The light half is now overridden. The dark half is not.

| Branch | Value | On the dark canvas | Gate |
|---|---|---|---|
| Light, after `c-overrides` | `--c-line-control` | 3.63:1 | pass |
| Dark, untouched | `surface-700` | **1.74:1** | fail |

A second `c-overrides` rule keyed to `:root[data-mode="dark"]` would move it, and would also be the first deliberate change to a shipping dark value. That is a decision, not an oversight.

### Preserving dark preserved its failures

Rule eight of the theme is that dark must not move. It was the right call for a release, and it means every dark contrast defect on record is still on record.

| Site | Count | Dark measurement | Light measurement |
|---|---|---|---|
| `dark:text-surface-500` muted text | 49 | **3.38:1** on canvas | 5.65:1, passes |
| `--c-plane-inset` against `--c-plane-canvas` | all inset surfaces | **1.00:1**, the same rung | 1.18:1, a real step |
| `CWell.vue:3` `bg-inset border border-line` | 12 | **1.00:1**, both aliases resolve to rung 900 | visible, 1.18:1 |
| `CCard.vue:15,22` header and footer rules | 72 | 1.19:1 | 1.18:1 |

The light ink ladder is the contrast the theme could buy without touching dark:

| Role | On the page canvas |
|---|---|
| `--c-ink-strong` | **14.20:1** |
| `--c-ink-body` | **9.18:1** |
| `--c-ink-muted` | **5.65:1** |
| `--c-ink-faint` | **5.42:1** |

### CodeMirror still declares itself dark

`codemirror/src/extensions/theme.ts:170` and `queryLanguage/shared/theme.ts:95` both pass `{ dark: true }` to `EditorView.theme()`, evaluated at module load. The two editors now agree, which is an improvement, and both are still wrong in light.

| Fact | Consequence |
|---|---|
| Every colour in both files is a `--c-*` reference | the palette flips correctly with no code change |
| The `dark` flag is not a colour | it selects `@codemirror/view`'s own `&dark` branch for selection layers and scroll shadows |
| Flipping it needs a `Compartment` | plus a reconfigure driven by the same `colorMode` the runtime already watches |

### Colour that no role can reach

| Surface | Count | Why it does not flip |
|---|---|---|
| Raw Tailwind palette utilities in app source | 58, across 34 files | `text-red-400` x11 and `text-gray-500` x5 lead; Tailwind's own ramps answer to no token |
| Arbitrary `[var(--c-*)]` classes | 75, 37 distinct | they flip correctly, but they bypass the alpha modifier and the thirteen role names |
| `--c-gray-900` references | 2, both in `tokens.css` | the vendor grey is a dark constant, aliased into `--c-plane-hover-row` and the scrollbar track |
| Raw palette inside the preset | 180 | Toast and Message severity is entirely raw Tailwind, so one semantic renders as two hues |
| Raw `white` and `black` inside the preset | 173 | led by `dark:text-white/80` x69, all bypassing `--c-fg-default` |

Thirteen role names cover the planes, the ink and the lines. Everything else, including hover overlays, scrims, syntax and selection, is reached through arbitrary-value syntax. That is the gap between a token layer and a utility layer.

## Surfaces that are not themed

### Plugins get no signal

`packages/sdk-frontend/src` contains zero occurrences of `theme`, `colorMode`, `dark` or `light`. A plugin cannot read the mode, cannot subscribe to a change, and cannot ship two stylesheets.

`ui/src/services/plugins/usePlugins.ts:211` injects plugin CSS as `@layer c-plugin { … }`, which sits after `c-theme` in the cascade. Plugin CSS therefore wins over the theme it cannot see.

| Rule | Why |
|---|---|
| Add the colour mode to `sdk-frontend` before announcing the light theme | a plugin author has no other way to know which palette their page is sitting on |
| Keep plugin CSS in its own layer | it is the one place a third party can override a theme value, and moving it would silently break existing plugins |
| Never expose the raw `data-mode` attribute as the plugin API | the attribute is a rendering detail, and a typed accessor can outlive it |

### The prebuilt component rules are restated, not fixed

`@caido/common-frontend@2.7.4` still ships one `:root`, zero `data-mode` selectors, zero `prefers-color-scheme` blocks and 97 distinct `--c-*` definitions.

Thirty-five of those are semantic roles, and `theme.light.css:122-158` restates all thirty-five under `:root[data-mode="light"]`. That is why `html { color: var(--c-fg-default) }` now resolves to paper ink rather than to the dark off-white.

What custom properties cannot reach is the package's own component rules, which write literal values. `theme.light.css:321-393` restates 21 of them across 26 selectors.

| Restated rule | What it was painting |
|---|---|
| `.c-card` box shadow | an opaque near-black, which reads as a drawn line on paper |
| `.c-well` separator and border | dark-only literals with no custom property in front of them |
| `.c-table__item-row[data-is-even="false"]` | the zebra stripe |
| `.c-modal__backdrop` | the scrim |
| `.c-drawer` box shadow | an unretinted drop shadow |

Every one of those is a local patch on a published package. Upstream is the real fix, and until it lands the restatements have to track the vendor version.

### The third palette is still a third palette

`packages/ui/src/styles/colors.variables.css` opens by telling readers not to use its values directly, then aliases them into `--active-accent`, `--card-background` and `--text-on-card-background`, which are consumed directly.

| Paint-chip name | Duplicates |
|---|---|
| `--di-serria` | `--c-secondary-400` in dark |
| `--isabelline` | `--c-surface-0` in dark, and also serves as the default foreground |
| `--pewter-blue` | `--c-info-400` in dark |
| `--onyx` | the vendor `--c-gray-800`, missing `--c-surface-800` by one unit per channel |
| `--crayola` | nothing, a fourth danger red |

Paper reaches past the paint chips and redefines the four context variables directly at `theme.light.css:190-196`. The chips themselves survive, unthemed, as a dark-only layer nothing needs.

### The system preference is never read

Zero `prefers-color-scheme` queries exist anywhere in `packages/*/src`. The setting defaults to `dark` and stays there until a user changes it, so a machine in light mode opens Caido dark on first run.

`color-scheme: light` is declared once, at `theme.light.css:11`, deliberately scoped so dark keeps today's user-agent default. Native scrollbars, `<select>` popups, date pickers and autofill therefore follow the theme in light and are untouched in dark.

## The elevation ladders, measured

The previous pass left the light ladder unmeasured and flagged it as blocking. It is measured now, and it inverts rather than descends.

| Step | Dark | Light |
|---|---|---|
| Canvas to raised | 1.19:1, raised is lighter | **1.14:1, raised is lighter** |
| Canvas to inset | **1.00:1, the same rung** | **1.18:1, inset is darker** |
| Canvas to chip | 1.46:1 from raised | 1.33:1 |

Dark raises by adding light and has headroom to spare. Paper runs out of lightness above the canvas almost immediately, so the inset plane goes darker than the page instead of lighter.

<DoDont
  mode="light"
  do="Keep the card one luminance step off its page."
  dont="Swap them and the card reads as sunken, not raised.">
  <template #do>
    <div class="rounded-lg bg-canvas p-4">
      <div class="rounded-md bg-raised px-[18px] py-3.5 text-code text-ink">Card</div>
    </div>
  </template>
  <template #dont>
    <div class="rounded-lg bg-raised p-4">
      <div class="rounded-md bg-canvas px-[18px] py-3.5 text-code text-ink">Card</div>
    </div>
  </template>
</DoDont>

Both light steps clear 1.10:1, so a panel edge in Paper does not need a hairline to read. The `--c-box-shadow-small` retint at `theme.light.css:162` carries contact separation where a boundary has to be felt rather than seen.

## Two pipelines still resolve every ramp

`packages/ui/tailwind.config.js` loads `plugins: [tailwindcssPrimeui, tailwindcssCaido, …]`, and both register colours.

| Plugin | Registers | Ramps it actually owns | Resolves through |
|---|---|---|---|
| `tailwindcss-primeui@0.3.4` | flat keys (`'surface-400'`) | `surface-*`, `primary-*` | `--p-*`, `primevue.css` |
| `@caido/tailwindcss@0.0.1` | nested keys (`surface: { 400: … }`) | `secondary-*`, `danger-*`, `info-*`, `success-*` | `--c-*`, `tokens.css` |

The flat keys win after `flattenColorPalette`, so `@caido/tailwindcss`'s own `surface` and `primary` maps at `tailwindcss.js:56-66` and `:111-121` are unreachable. A developer editing a surface step there sees no effect and no error.

| Consequence | Measurement |
|---|---|
| A theme override is written twice, in two namespaces and two value syntaxes | six ramps |
| `bg-secondary-400/50` keeps its alpha, `bg-surface-400/50` does not | `tailwindcss-primeui` emits `color-mix`, the other four ramps carry `<alpha-value>` |
| The `--p-*` bridge now carries three blocks | base, `:root[data-mode="light"]` at `primevue.css:30` and `:root[data-mode="dark"]` at `:75` |
| `--p-secondary-400` is defined and unused | `primevue.css:71` exists for a Sidebar reference that now reads `--c-secondary-400` directly |

Two collapses survive in the base block and are corrected only in light: `--p-surface-950` aliases rung 900, and `--p-primary-50` aliases `--c-primary-100`. In dark, a focused selected row and an unfocused one still resolve to one colour.

| Rule | Why |
|---|---|
| Treat `--c-*` as one namespace with one owner, and route every ramp through it | a theme override is then written once |
| Give a new alias a dark value byte-identical to the rung it replaces | that single constraint is what let the whole alias layer land without a dark regression |
| Never add a token to `primevue.css` as a literal hex | every literal in that file is a step that cannot participate in a theme |
| Never point two `--p-*` steps at the same `--c-*` value | both collapses in the base block erase a state distinction the preset assumes exists |

## The claims the theme file overstates

A current-state page has to check the shipping comments too.

| Comment | Where | What the measurement says |
|---|---|---|
| Syntax pairs separate by 12.3 CIE76 under normal, deuteranopic and protanopic vision | `theme.light.css:249-250` | worst case is 26.3 normal and 17.0 protanopic, but **9.4 deuteranopic**. The target holds for two of the three |
| Row-highlight fills | `theme.light.css:199-207` | worst-case separation is 9.0 normal, 7.9 deuteranopic and 6.2 protanopic, against 2.4 before the re-derivation |

Deuteranopic separation in the syntax set is a known limit rather than a bug, and the comment should say so. Nothing in the product depends on the overstatement, and the file is the only place a reader would find it.

## Typography

### The root font size is 14px, and it is written from JavaScript

Nothing in the theme work touched this. It is the single largest source of drift in the product.

| Layer | Rule | Wins |
|---|---|---|
| `c-base`, Tailwind preflight | `html,:host { line-height:1.5; font-family:ui-sans-serif,… }` | overridden |
| `c-base`, `global.css:5` | `body { font-size: unset }` | `unset` on an inherited property means `inherit` |
| `c-core`, common-frontend normalize | `html { line-height: 1.15 }` | wins over preflight, later layer |
| `c-core`, common-frontend base | `html { font-size: var(--c-font-size-base) }` | wins |
| `:root` token in the shipped vendor CSS | `--c-font-size-base: 14px` | value source |
| runtime inline style, `EnvProvider/useFont.ts:12-16` | `documentElement.style.fontSize = "${fontSize}px"` | **beats every layer** |

```ts

watchEffect(() => {
  Object.assign(window.document.documentElement.style, {
    fontSize: `${fontSize.value}px`,
  });
});
```

The browser's own default font size is expressed by redefining the root element's initial `font-size`, so writing a literal px value discards that accessibility setting completely. Expressing the root as a percentage and routing the user's slider through a multiplier keeps both.

### What every rem token resolves to

| Class | Tailwind nominal | At the 14px root | At the 12px setting | Occurrences |
|---|---|---|---|---|
| `text-xs` | 12 / 16 | **10.50 / 14.00** | 9.00 / 12.00 | 44 |
| `text-sm` | 14 / 20 | **12.25 / 17.50** | 10.50 / 15.00 | 178 |
| `text-base` | 16 / 24 | **14.00 / 21.00** | 12.00 / 18.00 | 6 |
| `text-lg` | 18 / 28 | **15.75 / 24.50** | 13.50 / 21.00 | 66 |
| `text-xl` | 20 / 28 | **17.50 / 24.50** | 15.00 / 21.00 | 36 |
| `text-2xl` | 24 / 32 | **21.00 / 28.00** | 18.00 / 24.00 | 10 |
| no class | inherit | **14.00 / 16.10** | 12.00 / 13.80 | ~90% of the UI |

Two different line boxes ship for the same 14px. Normalize's `1.15` gives a 16.10px box and `text-base` gives a 21.00px box, a 4.9px difference for identical text.

Arial's `hhea` line box is 1.1499em, measured against the macOS binary at `unitsPerEm` 2048, which is where the 16.10px unclassed box comes from.

| Fractional value | Mechanism | Visible result |
|---|---|---|
| A 12.25px glyph | rounding depends on device pixel ratio, hinting and subpixel positioning | two labels at 12.25px differ by a whole pixel of cap height |
| A 17.50px line box | it is a layout quantity, so fifty rows is 875px | 1px borders alternate crisp and blurred down a table |

### The typography defect list

| # | Defect | Measurement | Location |
|---|---|---|---|
| T1 | The dominant UI text size renders at a fractional **12.25px** | `text-sm` x178 | throughout |
| T2 | Secondary text renders at **10.50px**, below every published floor | `text-xs` x44 | throughout |
| T3 | A px root discards the user's browser default font size | `documentElement.style.fontSize` | `useFont.ts:13` |
| T4 | Selecting a UI font destroys the fallback stack | the token becomes bare `Arial`, losing `, sans-serif` | `useFont.ts:25-29` |
| T5 | Three unrelated monospace stacks render side by side | Tailwind `font-mono`, `--c-font-family-mono` with **0 app consumers**, and a hardcoded stack | `codemirror/src/extensions/theme.ts:39` |
| T6 | The editor renders at a fractional **12.60px** | `--c-editor-font-size: 14px` then `.cm-scroller { font-size: 0.9em }` | `theme.ts:9,40` |
| T7 | Two line-height defaults for the same 14px | 16.10px against 21.00px | normalize against `text-base` |
| T8 | `font-semibold` against `font-bold` is a distinction Arial cannot render | 89 + 48 + 38 usages, 79% of all weight authoring | the weight table below |
| T9 | Letter-spacing is never authored | **0** `tracking-*` classes | |
| T10 | `--c-font-size-100: .875rem` resolves to **12.25px** while the base is 14px | the layer-2 size tokens contradict their own base | shipped vendor CSS |
| T11 | Sub-floor hardcoded sizes ship | `text-[10px]` x6, `text-[9px]` x1, `text-[1.2em]` x4 | [Sub-floor sizes shipping today](#sub-floor-sizes-shipping-today) |
| T12 | Virtualised row height is computed from the font size in JavaScript | `fontSize.value * 1.5` in **12 files** | [Row height is derived from the type setting](#row-height-is-derived-from-the-type-setting) |
| T13 | Tabular figures are effectively unauthored | **1** `tabular-nums` in the whole codebase | `onboarding/Checklist/Container.vue:48` |

Weight, as rendered on Arial:

| Authored | Class | Occurrences | Renders as |
|---|---|---|---|
| 400 | `font-normal` | 8 | 400 |
| 500 | `font-medium` | 38 | **400** |
| 600 | `font-semibold` | 89 | **700** |
| 700 | `font-bold` | 48 | 700 |

`font-medium` is indistinguishable from unstyled text, and `font-semibold` from `font-bold`, for 175 of the 183 weight classes in the codebase. The system has three emphasis levels in source and two on screen.

### Sub-floor sizes shipping today

| What | Where | Renders at |
|---|---|---|
| `text-[9px]` | `replay/ReplayEntry/http/Success/Container.vue:57` | 9.00px |
| `text-[10px]` x6 | `Sidebar/Container.vue:186`, `replay/Tag/PipelineTag.vue:14`, four more | 10.00px |
| `text-xs` x44 | throughout | **10.50px** |
| `text-xs` at the 12px root setting | throughout | **9.00px** |
| `font-mono text-xs` hex dump | `packages/components/src/HexViewer.vue:59` | **10.50px** |
| `text-[1.2em]` x4 | `BrowserDialog/Container.vue:33,42`, two more | a relative size that does not sit on the ramp |

### Row height is derived from the type setting

Twelve files compute `itemHeight` from the font size as `fontSize.value * 1.5`, across HTTP History, Search, Sitemap, Findings, Automate, Intercept, Websockets and two Replay tabs.

| Failure mode | Measurement |
|---|---|
| Below the pointer-target floor | **21.00px** at the default, against SC 2.5.8's 24px minimum, on a `cursor-pointer` row |
| No line-spacing headroom | exactly SC 1.4.12's 21px floor, under a 1px `border-b` and an `overflow-hidden` cell |
| Fractional pitch | **19.50px** at the 13px setting and 18px at 12px, compounding over thousands of rows |
| Inconsistent with its own siblings | nine templates pass literals at four values: 20, 28, 30 and 32. Six row heights ship in one product |
| It inverts the user's intent | a user who raises the type size gets 1.71x fewer rows per screen across the slider range |

The virtualiser indexes with `Math.floor(scrollTop / itemHeight)` at `CTable/useScroll.ts:41,85`, so a fractional pitch turns into scroll drift rather than into a rounding artefact.

<DoDont
  do="Set row height from the row-height token, at 28px."
  dont="Derive it from the font size and rows shrink to an untappable 21px.">
  <template #do>
    <div class="w-[210px] overflow-hidden rounded-md border border-separator bg-raised">
      <div class="flex h-sm items-center border-b border-separator px-2.5 text-caption text-ink">GET /api/users</div>
      <div class="flex h-sm items-center border-b border-separator px-2.5 text-caption text-ink">GET /api/session</div>
      <div class="flex h-sm items-center px-2.5 text-caption text-ink">POST /api/login</div>
    </div>
  </template>
  <template #dont>
    <div class="w-[210px] overflow-hidden rounded-md border border-separator bg-raised">
      <div class="flex h-[21px] items-center border-b border-separator px-2.5 text-caption text-ink">GET /api/users</div>
      <div class="flex h-[21px] items-center border-b border-separator px-2.5 text-caption text-ink">GET /api/session</div>
      <div class="flex h-[21px] items-center px-2.5 text-caption text-ink">POST /api/login</div>
    </div>
  </template>
</DoDont>

### Numerals, truncation and the font stack

Measured: **96** `truncate`, 39 `text-nowrap`, 17 `whitespace-nowrap`, 9 `text-ellipsis`, 30 `overflow-hidden`, 2 `break-words`, **0** `break-all`.

The middle three are hand-rolled re-implementations of what `truncate` already does. The absent `break-all` is a live defect for base64 and hex payloads.

The shipping stack, from the installed vendor stylesheet, sets `--c-font-family-base: Arial, sans-serif` and `--c-font-family-mono: "Courier New", monospace`. Those are fallback stacks rather than chosen typefaces.

`packages/types/src/core/settings.ts:394-403` offers seven user-selectable UI faces above a comment naming cssfontstack.com as their provenance. Three are the wrong category: Georgia and Times New Roman are serif, and Courier New is monospace.

Arial's digits are uniform by construction, so every numeric column in the product is aligned today by accident rather than by authoring. That is the fact a typeface change would break.

### Font payload

The built output carries eight font binaries, all pulled in by `@caido/common-frontend/dist/assets/icons.css` and loaded lazily at `packages/ui/src/main.ts:38`.

| Family | Bytes | App usages |
|---|---|---|
| Font Awesome 6 Free Solid 900 `.woff2` | 156,496 | 627 occurrences, 136 distinct codepoints |
| Font Awesome 6 Free Regular 400 `.woff2` | 25,452 | **1** |
| Font Awesome 6 Brands 400 `.woff2` | 117,372 | **0** |
| Material Icons 400 `.woff2` | 128,352 | **0** direct |
| Total on disk, all eight | **1,288,280** | |
| Total a `woff2`-capable browser downloads | **427,672** | |

Subsetting Solid to its 136 used glyphs and dropping Regular, Brands and Material Icons frees **416,324 bytes**. Material Icons is pulled in by vendor internals rather than by application code, so removing it is an upstream change.

| Rule | Why |
|---|---|
| Express the root size as a percentage of the browser default | the browser's own accessibility setting then survives |
| Treat any fractional rendered size as a defect report, not a rounding artefact | half-pixel line boxes alternate crisp and blurred borders down a table |
| Never derive a virtualised row height from a font size | it fails SC 2.5.8 at the default and produces a pitch that compounds into scroll drift |
| Never treat the three monospace stacks as cosmetic | `--c-font-family-mono` has zero consumers, so changing it changes nothing in the request viewers |

## Spacing, radius and sizing drift

### The unit policy is violated by the root

| Authored | Intent | At the 14px default | At the 24px setting |
|---|---|---|---|
| `gap-2` (0.5rem) | 8px | **7.00px** | 12.00px |
| `p-4` (1rem) | 16px | **14.00px** | 24.00px |
| `rounded` (0.25rem) | 4px | **3.50px** | 6.00px |
| `rounded-md` (0.375rem) | 6px | **5.25px** | 9.00px |
| `--c-border-width-1` (0.0625rem) | 1px | **0.875px** | 1.50px |
| `--p-content-border-radius` (6px, fixed) | 6px | 6.00px | 6.00px |

`--c-border-width-1` is a sub-pixel border that cannot render as a clean hairline at 1x device pixel ratio. `rounded-md` and `--p-content-border-radius` are two names for the default radius that differ by 0.75px at the default and by 3.00px at the top of the slider.

The 8pt grid in this codebase is a 7pt grid.

### Radius has five sources of truth

146 radius occurrences in application source, across 8 distinct classes.

| Class | Count | Share | Renders at the 14px root |
|---|---|---|---|
| `rounded-md` | 45 | 30.8% | 5.25px |
| `rounded` | 44 | 30.1% | 3.50px |
| `rounded-full` | 27 | 18.5% | pill |
| `rounded-lg` | 12 | 8.2% | 7.00px |
| `rounded-sm` | 11 | 7.5% | 1.75px |
| `rounded-[var(--c-border-radius-1)]` | 5 | 3.4% | 3.50px |

`rounded-md` and `rounded` split 45 to 44 with no rule distinguishing them. Five sources exist for the small radius: two Tailwind steps, `--c-border-radius-1`, a fixed 6px `--p-content-border-radius`, and the preset's own arbitraries.

The five `rounded-[var(--c-border-radius-1)]` sites each reached for the layer-2 token and received exactly the 3.50px that plain `rounded` already gives, so the token layer bought nothing.

Nested radius violations, verified instances rather than an exhaustive scan:

| Site | Required inner | Drawn | Error |
|---|---|---|---|
| `components/src/CTab/Container.vue:45,74` | 4.25 | 5.25 | +1.00px, **+23.5%** |
| `@caido/primevue@0.3.3` `Classic.select` option | 1.75 | 3.50 | **2.0x**, across 36 controls |
| `ui/…/runtime/Convert/Chain/ItemChain.vue:22` | 0.75 | 5.25 | **7.0x** |
| `packages/components/src/CWell.vue:3` | 0, no `overflow-hidden` | inherit 3.50 | flush children paint outside the parent arc |

The Dialog is the one correct instance in the set: root `rounded-lg` with header `rounded-tl-lg rounded-tr-lg`, a flush child correctly inheriting the parent radius.

<DoDont
  do="Derive the inner radius from the outer radius minus the padding."
  dont="Reuse the outer radius and the inner corner is visibly too round.">
  <template #do>
    <div class="rounded-[12px] border border-separator bg-subtle p-1.5">
      <div class="h-[56px] w-[150px] rounded-md bg-raised"></div>
    </div>
  </template>
  <template #dont>
    <div class="rounded-[12px] border border-separator bg-subtle p-1.5">
      <div class="h-[56px] w-[150px] rounded-[12px] bg-raised"></div>
    </div>
  </template>
</DoDont>

### Arbitrary values

App source holds 131 arbitrary-value utilities, led by width at 37, height at 35, font-size and colour at 20, and z-index at 8.

Four borders are sized in `em` and grow with the type slider. A border that changes thickness when the user changes text size is never intentional.

| Site | Class | At 14px | At 24px |
|---|---|---|---|
| `components/src/CTable/Table.vue:241` | `border-b-[0.2em]` | 2.80px | 4.80px |
| `components/src/CTable/Table.vue:266` | `border-b-[0.1em]` | 1.40px | 2.40px |
| `components/src/CTable/HeaderCell.vue:57` | `border-r-[0.1em]` | 1.40px | 2.40px |
| `ui/…/websocket/Editable/Tabs/Upgrade/Container.vue:31` | `border-t-[0.2em]` | 2.80px | 4.80px |

| What | Where |
|---|---|
| `border-[1px]` x2 plus one `border-b-[1px]`, all redundant with `border` | `decodeOnHover.ts:23`, `CTab/Container.vue:45` |
| `leading-1`, not a real Tailwind class and a silent no-op | `protocols/Banner/Container.vue:18` |
| 8 arbitrary z-index values with no scale: -1, 1, 2, 11, 12, 9999, 99999 | seven files |
| 20 empty `<style scoped></style>` blocks, out of the 139 files carrying one | throughout |

### Control and bar heights do not form a ladder

Rendered heights measured from `@caido/primevue@0.3.3` at the 14px root with Arial.

| Component | Preset classes | Rendered |
|---|---|---|
| Button, default | `px-3 py-2 leading-[normal]` | **32.10px** |
| Button, `size="small"` | `text-sm py-1.5 px-3` | **26.59px** |
| InputText, default | `py-2 px-3 leading-none` | **30.00px** |
| InputText, `size="small"` | `py-1.5 px-2 leading-none` | **26.50px** |
| Select | label `py-2 pl-3 leading-[normal]`, no size variant | **32.10px** |
| Checkbox, RadioButton | `w-5 h-5` | **17.50 x 17.50px** |

`size="small"` is used 210 times against `size="large"` twice, and Button accounts for 178 of the 210. Small is the real default.

```
Button root   : leading-[normal] px-3 py-2, no font-size class, inherits 14px
                Arial normal line-height = (1854 + 434 + 67) / 2048 = 1.1499em
                height = 14 x 1.1499 + 14 + 2 = 32.10px
InputText root: leading-none py-2 px-3
                height = 14 x 1.0 + 14 + 2 = 30.00px
                                                 => 2.10px on every default pair
```

`<Select size="small">` renders at **32.10px** next to `<Button size="small">` at **26.59px**, a 5.51px and **21%** mismatch on the app's most common toolbar pairing. The preset has no `size` handling for Select or Textarea at all.

<DoDont
  do="Give one size ladder to every control family."
  dont="Leave Select without a size ladder and it outgrows its button.">
  <template #do>
    <div class="flex items-center gap-2">
      <span class="inline-flex h-[27px] items-center rounded-md border border-control bg-raised px-3 text-code text-ink">Send</span>
      <span class="inline-flex h-[27px] items-center rounded-md border border-control bg-inset px-3 text-code text-ink-muted">HTTP/1.1</span>
    </div>
  </template>
  <template #dont>
    <div class="flex items-center gap-2">
      <span class="inline-flex h-[27px] items-center rounded-md border border-control bg-raised px-3 text-code text-ink">Send</span>
      <span class="inline-flex h-md items-center rounded-md border border-control bg-inset px-3 text-code text-ink-muted">HTTP/1.1</span>
    </div>
  </template>
</DoDont>

The measured cost of that missing contract is roughly 89 Tailwind `!important` overrides across 41 files, most of them spacing, concentrated in `BottomBar`, `Sidebar/MenuItem`, `Sidebar/MenuGroup`, `WorkflowToolbar` and `CTab`.

`h-12` is used 42 times and is unambiguous: it is the Caido bar. At the 14px root it renders **42px**, off both the 4px and the 8px rhythm.

No control height matches any bar height. 42px bars containing 26.59px controls leave 7.7px of slack top and bottom. Nothing snaps, everything is centred with flex, and the product has no vertical grid.

### Spacing usage is already close to a ramp

| Measurement | Value |
|---|---|
| `gap` against `margin` in app source | 838 to 169, with `space-x/y-*` used 6 times in total |
| Coverage of steps 1, 2 and 4 | 81.6% of 1,515 spacing utilities; adding 3 and 8 reaches 90.9% |
| Gap distribution | `gap-2` 402, `gap-4` 191, `gap-1` 106, together 87% of gaps |
| Padding distribution | `p-4` 63, `p-2` 54, `p-1` 24, together 76% of paddings |
| Negative-margin cluster | eight occurrences, all compensating for preset padding the component did not own |

`@caido/common-frontend` ships `--c-space-0/1/2/3/4/8/10/12` = 0, 4, 8, 12, 16, 32, 40, 48px. It is missing 2, 6, 20 and 24, and it has a 2x hole between 16 and 32.

No token covers the 24px section separation that Carbon, Spectrum, Ant, Primer, Bootstrap and Tailwind all carry. That hole is why component authors reach for arbitrary values.

`@container` is in use at four sites with ad-hoc thresholds, `@[8rem]` four times and `@[14rem]` seven times. Roughly 50 viewport breakpoints are used inside splitter panes, where a pane can be 200px wide on a 4K display.

| Rule | Why |
|---|---|
| Author radius, border width and shadow geometry in absolute px | they are chrome geometry, and the one border token in rem renders at 0.875px |
| Derive an inner radius from the outer radius minus the padding between them | the four measured violations run from +23.5% to 7.0x |
| Never extend a hit area with negative margins | the shipping instance overlaps the neighbouring column's sort target |
| Never add an `!important` override to correct a control height | they signal a missing size contract, not a wrong value |

## Component defects found during specification

### Contrast failures, blocking

The theme work closed the light half of several of these and left the dark half exactly where it was.

| # | Defect | Measurement | Status |
|---|---|---|---|
| C1 | `severity="contrast" outlined` Button boundary | 2.41 / 2.04 / 1.39:1 in dark, 58 instances | open in dark |
| C2 | Every input, select, checkbox and radio border | 1.74:1 dark, 3.63:1 light after the override | light closed |
| C3 | Select has no focus indicator at all | 36 controls, `label` carries `focus:outline-none focus:shadow-none` | open, theme-independent |
| C4 | Links are colour-only, and `brightness-115` does not resolve in Tailwind | 2.25:1 against body text | open |
| C5 | Muted text on the dark canvas | **3.38:1**, 49 `dark:text-surface-500` sites | open in dark, 5.65:1 in light |
| C6 | `--c-ink-muted` on raised and chip planes in dark | 4.01:1 and 2.73:1 | open in dark |
| C7 | Checkbox unchecked boundary | 1.74:1 dark, 3.63:1 light after the override | light closed |
| C9 | Placeholder text | 3.38:1 dark, 5.42:1 light | light closed |
| C13 | Toast container boundary | **1.23:1** against the app background in dark | open in dark |
| C14 | Dialog edge, assembled from three per-section borders | 1.74:1 dark, so the dialog relies on `shadow-lg` | open in dark |
| C15 | Dialog scrim | `--c-scrim` is a warm 32% in light; in dark the best possible value at full opacity is 1.6652:1 | scrim cannot carry separation alone |
| C16 | `CWell.vue:3` `bg-inset border border-line` | **1.00:1** in dark, both aliases resolve to rung 900 | open in dark |
| C17 | `CCard.vue:15,22` header and footer rules | 1.19:1 dark, 1.18:1 light | open in both |
| C18 | Preset shadows in dark, all `rgb(0 0 0 / 0.1)` | **1.050:1** on the dark canvas | open in dark; light retinted at `theme.light.css:162` |
| C19 | The 3% white hover, `dark:hover:bg-[rgba(255,255,255,0.03)]`, 32 sites | **1.088:1**, the primary hover affordance on menus and rows | open in dark |

Nothing muted in dark clears the APCA readability floor: rung 400 measures Lc -39.8 and rung 300 Lc -53.5 against a Lc 60 minimum. That is the exact failure mode the Cambridge EDC review names, which finds WCAG 2 wrongly passing about 47% of roughly 5,000 pairs (Waller, 2022).

<DoDont
  do="Draw focus as a 2px ring with a 2px offset."
  dont="Draw focus as a 1px ring with no offset.">
  <template #do>
    <span class="inline-flex h-md items-center rounded-md bg-raised px-3.5 text-code text-ink shadow-[0_0_0_2px_var(--c-bg-canvas),0_0_0_4px_var(--c-focus-ring)]">Send request</span>
  </template>
  <template #dont>
    <span class="inline-flex h-md items-center rounded-md bg-raised px-3.5 text-code text-ink shadow-[0_0_0_1px_var(--c-focus-ring)]">Send request</span>
  </template>
</DoDont>

### Semantics and keyboard

None of these are colour, and none of them moved.

| # | Defect | Measurement | Standard |
|---|---|---|---|
| S1 | 37 icon-only Buttons carry neither `aria-label` nor `v-tooltip` | 53 icon-only total, 16 with a tooltip | SC 4.1.2, **Level A** |
| S2 | 7 of 34 `CCheckbox` have no accessible name; 8 ToggleSwitch and 5 InputNumber likewise | | SC 4.1.2, Level A |
| S3 | Textarea naming: 18 of 18 pass `placeholder`, 1 of 18 passes `aria-label` | | placeholder-as-label |
| S4 | Status is conveyed by colour alone: `fa-circle-exclamation` usages = **0** | | SC 1.4.1, **Level A** |
| S5 | `CTable` sortable headers have no `tabindex`, no focus state and no `aria-sort` | | SC 2.4.7, SC 4.1.2 |
| S6 | No `aria-rowcount` or `aria-rowindex` on any virtualised table | | SC 4.1.2 |
| S7 | Deliberate focus-indicator removal in at least 7 places | `CTab` `!ring-0`, 4 Buttons, 2 links | SC 2.4.7 |
| S8 | Four focus idioms, plus none for Select | 175 `focus:ring` against 92 `focus-visible:` preset-wide | SC 2.4.7 |
| S9 | Focus ring is 1px with no offset everywhere it exists | 228 px² of indicator against 448 px² required, a **51% shortfall** | SC 2.4.13 |
| S10 | Background behind a modal is focus-trapped but not inert | PrimeVue 4 Dialog renders a `div`, so no top layer and no automatic inert | highest severity in the dialog set |
| S11 | Checkbox and radio targets render at **17.50 x 17.50 CSS px** | mitigated only where a `<label for>` extends the target | SC 2.5.8, 24 x 24 |
| S12 | Virtualised rows are `cursor-pointer` targets at 21.00px, stacked at 0px separation | | SC 2.5.8 |
| S13 | Every toast is `role="alert"` with `aria-live="assertive"`, including success | | SC 4.1.3 |
| S14 | Toast auto-dismisses at 3000ms including errors, with no pause and no log | | SC 2.2.1 |
| S15 | No `aria-busy`, no `aria-hidden` on skeleton bars, no `role="status"` load region | | SC 4.1.3 |
| S16 | `prefers-reduced-motion` is handled once in the app and zero times in the preset | `onboarding/Checklist/Celebration.vue:169` | SC 2.3.3 |
| S17 | Live-table autoscroll pauses only implicitly, through scroll position | no visible control and no keyboard equivalent | SC 2.2.2, Level A |
| S18 | Column resize is mouse-only: no `tabindex`, no focus state | `HeaderCell` resizer is `w-[0.5em]` | SC 2.4.7 |
| S19 | `body { overflow: hidden }` plus persisted splitter positions can strand a focused control | | SC 2.4.11 |
| S20 | There is no read-only path on any input family | 17 of 79 InputText instances are disabled, which locks pointer events | |

### Missing primitives

| Primitive | State |
|---|---|
| Typography | No component and no scale. 58 headings styled ad hoc; the invalid class `text-md` ships twice |
| Icon | No component. 277 `icon=` props, 68 raw `<i class>`, 7 in legacy FA4 syntax |
| Icon accessibility and sizing | 0 `fa-fw`, 42 `aria-hidden` against 345 icon occurrences |
| Inline alert | PrimeVue `Message` has **zero** real usages; every hit is a locally-defined component |
| Persistent inline message | every non-blocking message is a 3-second transient toast |
| Tag, badge and chip | No primitive. Status chips and method tags are hand-built with no shared geometry |
| Radio and toggle wrappers | `CCheckbox` is correct; its radio and toggle siblings do not exist |
| Split pane | No wrapper, so gutter geometry and keyboard behaviour are decided per call site |
| Skeleton | No shared primitive, and no geometry from the row-height token, so every initial load reflows |
| Linear progress | No component for the refresh-of-populated-content case |
| Table | `CTable` is a virtualisation engine, now fully tokenized, but not a design-system table |

### API and variant discipline

| Finding | Measurement |
|---|---|
| No design-system chokepoint for Button | 194 files import the vendor Button directly, roughly 395 tag instances |
| Button call sites override the preset | 74 instances carry a class override |
| The variant surface is far wider than its use | 8 severities crossed with 5 modifiers is 40 renderings; 6 ship in volume |
| Two invalid severities ship | `severity="invisible"` (6) and `severity="none"` (4) are not valid PrimeVue severities |
| Five modal APIs are in play at once | across 57 modal surfaces with no shared spec |
| The `CDialog` wrapper is bypassed | 6 uses against 44 raw, because it exposes no `header`, `class` or `closable` prop |
| 44 dialogs are draggable | the wrapper passes `:draggable="false"`, and the raw usages do not |
| Two title paths, one of which cannot be wired | 23 pass a `header` prop and 21 use a `#header` slot |
| `CDropdown` forwards five props | it does not forward `size`, `disabled`, `invalid`, `placeholder`, `loading` or `filter` |
| `CCard` renders into the wrong slot | header, body and footer go inside the PrimeVue Card `#content` slot |
| Sizing is unmanaged outside Button | `size=` is passed on 6 of 79 InputText instances and 0 of 18 Selects |
| Two full-width idioms compete | `class="w-full"` at 41 uses against `fluid` at 21 |
| Validation never reaches the control's visual state | `invalid=` is passed on 2 of 79 InputText instances |
| One accent, two colours | Checkbox accent is gold, radio accent is crimson |
| One invalid state, two tokens | Checkbox and InputText use `danger-400`; radio and Select use `red-500` |
| The deprecated alias still ships | `primevue/dropdown` is imported in 5 files alongside `primevue/select` |
| Toast summaries bypass i18n | the composable hardcodes "Error", "Info", "Warning" and "Success" |
| `CTable` row transitions animate every property | bare `transition duration-200` on a surface that recycles nodes at scroll speed |

### The icon register is fragmented

| Intent | Canonical FA6 name | Count | Aliases in use | Count |
|---|---|---|---|---|
| Warning | `fa-triangle-exclamation` | 4 | `fa-warning`, `fa-exclamation-triangle` | 8, 5 |
| Close | `fa-xmark` | 10 | `fa-close`, `fa-times` | 4, 2 |
| Search | `fa-magnifying-glass` | 10 | `fa-search` | 6 |
| Undo | `fa-rotate-left` | 13 | `fa-undo` | 3 |
| Help | `fa-circle-question` | 3 | `fa-question-circle` | 5 |
| Delete | `fa-trash` | 22 | `fa-trash-can` | 6 |
| Error | `fa-circle-exclamation` | **0** | `fa-circle-xmark` | 7 |
| Save | `fa-floppy-disk` | 0 | `fa-save` | 13 |
| External link | `fa-up-right-from-square` | 0 | `fa-external-link-alt` | 4 |

89 occurrences need rewriting to a single register. Three spellings of one warning triangle ship today, and the glyph the status set requires for the danger intent has zero usages.

| Rule | Why |
|---|---|
| Fix a defect at the one wrapper that owns it, not at its call sites | 345 icon sites are 345 opportunities to get the same rule wrong |
| Treat a missing primitive as the reason a rule is unenforceable | every rule in the split-pane specification is unenforceable today |
| Never widen a prop union to accept a value the component does not style | two invalid severities ship precisely because the prop is a bare string |
| Never report a persistent condition through a 3-second toast | the failure explanation expires and the region never reaches a terminal state |

## Defects in the third-party preset

### Classes that compile to nothing

All confirmed by compiling them through the real Tailwind config, which emitted no rule.

| Class | Occurrences | Consequence |
|---|---|---|
| `focus:ring-red-4000` | 2 | the highest-severity toast and message close buttons have no focus ring |
| `bg-surface-00` | 1 | a transparent background in light mode |
| `dark:hover:bg-surface-80/50` | 2 | no dark hover on sortable table headers |

The `red-4000` typo has a second defect stacked on it. Those `closeButton` branches key off `e.severity`, but PrimeVue 4.1.0's `ToastMessage.vue` has no `severity` prop, so all six focus-ring branches are dead. The close button falls back to Tailwind's default ring colour, a semi-transparent blue with no relationship to the palette.

### Raw palette and raw geometry inside the preset

| Finding | Measurement |
|---|---|
| Direct references to a numbered ramp step | **1,142** surface and primary references combined |
| Raw Tailwind colour references | **180** |
| Toast and Message severity is entirely raw Tailwind | `severity="info"` renders a raw Tailwind blue in light and a Caido token in dark |
| Those raw ramps are also the healthiest numbers in the system | the ten measured severity text pairs pass AA in both themes |
| Raw `white` and `black` occurrences | **173**, led by `dark:text-white/80` x69 |
| Off-rhythm padding | `py-[0.9375rem]` x5, `p-[1.125rem]` x17, `px-[1.125rem]` x4 |
| `leading-[normal]` x24 against `leading-none` x40 | the preset contradicts its own line-height rule within one file |
| Icon-only Buttons are not square | `w-10 px-0` fixes width at 35.00px while height lands near 32.8px |
| The icon-to-label gap is set twice | `button.root` sets `gap-2` and `button.icon` sets `mr-2`, so the distance is **16px** |
| Toast width and text are off every ladder | `w-96` = 336px, and `messageText` is `text-base` against a 12.25px body |
| The dialog transition section is an empty object literal | the dialog has no enter or leave animation at all |
| There is no `inputicon` key at all | icon colour and size cannot be overridden per call site |
| Label, help text and error text are not pass-through sections | `inputtext` exposes only `root`, so `aria-describedby` has no chokepoint |

The 1,142 direct step references are not an exemption to write into the specification. `tailwind.config.js` re-points the utility names the preset emits, so a step-looking class compiles to a role variable. That makes the config the adapter between a vendor that names appearances and a token layer that names roles.

### Motion

Counts from `dist/primevue.mjs` unless stated.

| Finding | Measurement | Standard breached |
|---|---|---|
| One duration dominates | `duration-200` x95 | 200ms is 2 to 3x too slow for row hover |
| Easing is inverted | `ease-in-out` x31, `ease-linear` x14, `ease-in` x8, `ease-out` x**1** | every surveyed system decelerates entrances |
| Unenumerated transitions | `transition-all` x23, including the splitter gutter | the drag handle trails the pointer while dragged |
| Durations above the ceiling | `duration-1000` x7, `duration-800` x1 | Material's 400ms guidance |
| App-side utilities | `transition-all` x9, `duration-300` x6, `ease-out` x5 | same rules, smaller surface |

There is exactly one well-formed enter and exit pair in the whole preset, on the menu at `primevue.mjs:263`:

```
enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]"
leaveActiveClass: "transition-opacity duration-100 ease-linear"
```

It enumerates its properties, decelerates on enter and exits faster than it enters, which is the template the rest of the preset should have followed.

| Rule | Why |
|---|---|
| Open the upstream releases now | they have the longest lead time, and the local overrides track a vendor version until they land |
| Re-point a vendor utility name through `tailwind.config.js` where the collision is per-property | two config lines move a boundary without a preset release |
| Never treat a preset class as shipped behaviour without compiling it | three classes emit no rule at all, and the failures read as missing design |
| Never copy a severity class string out of the preset into a new component | 180 of them are raw Tailwind and respond to no token and no theme change |

## Consolidated defect register

| Rule | Why |
|---|---|
| Carry the defect number into the commit that closes it | the register can then be checked off against merged work rather than against memory |
| Re-measure a defect before closing it | a ratio fixed by moving the other side of the pair is not fixed |
| Never treat severity here as scheduling order | four critical entries cannot be fixed in this repository at all |
| Never close an entry because its light half is closed | the dark half is where the preservation rule parked the remainder |

| # | Defect | Status |
|---|---|---|
| D1 | Two colour pipelines: `surface` and `primary` via `--p-*`, the other four via `--c-*` | open |
| D2 | `@caido/tailwindcss` `surface` and `primary` maps are unreachable dead code | open |
| D3 | `--c-surface-100` used but never defined | closed, defined at `tokens.css:80` |
| D4 | `--p-surface-50/100` hardcoded cold slate | closed in `primevue.css`; the cold value is still the dark rung |
| D5 | `--p-surface-950` duplicates 900; `--p-primary-50` duplicates 100 | open in dark, corrected in the light block |
| D6 | Grey ramp defined twice, drifting on 6 of 8 shared steps | open, 2 vendor references remain |
| D7 | `tokens.css` and `primevue.css` duplicated byte for byte across two packages | closed, both are `@import` shims |
| D8 | `colors.variables.css` is a third palette with paint-chip names | open, dark only |
| D9 | `@caido/common-frontend`: one `:root`, zero `data-mode`, 97 tokens | open upstream, 35 semantics overridden locally |
| D10 | `html { color: var(--c-fg-default) }` unreadable on a light page | closed for colour; the 14px root pin remains |
| D11 | `--c-fg-onEmphasis` on `--c-bg-primary` = 1.98:1 in dark | open |
| D12 | No `color-scheme` declaration anywhere | closed for light; dark keeps the UA default deliberately |
| D13 | `var(--p-secondary-400)` referenced and never defined | closed, and the definition is now the unused half |
| D14 | Preset classes that compile to nothing | open, upstream |
| D15 | The dark theme is written into the light branch | **closed**, 0 unprefixed `surface-N` utilities remain |
| D16 | Ramp utilities invert in light | closed by the role layer |
| D17 | Unconditional colour references outside the token system | mostly closed, 58 raw Tailwind utilities remain |
| D18 | CodeMirror `{ dark: true }` plus untokenized syntax hexes | half closed, 0 hexes and the flag still baked |
| D19 | Root font size is 14px, written from JS | open |
| D20 | `text-sm` renders at 12.25px and `text-xs` at 10.50px | open |
| D21 | Row height computed as `fontSize * 1.5` in 12 files | open |
| D22 | Six hardcoded row heights ship alongside it | open |
| D23 | `--c-border-width-1` is a 0.875px sub-pixel border | open |
| D24 | Five sources of truth for the small radius | open |
| D25 | Four nested-radius violations, worst at 7.0x | open |
| D26 | Four borders sized in `em`, growing across the slider | open |
| D27 | 8 arbitrary z-index values with no scale | open |
| D28 | Select and Textarea have no `size` handling | open, upstream |
| D29 | Dark control borders point at the wrong steps | open, the light half is overridden |
| D30 | `--c-line-control` in dark fails 3:1 on every surface | open |
| D31 | Select has no focus indicator at all | open |
| D32 | 37 icon-only Buttons have no accessible name | open |
| D33 | Status is colour-only | open |
| D34 | Modal background is focus-trapped but not inert | open |
| D35 | Checkbox and radio targets are 17.50px | open |
| D36 | Focus is `focus:` rather than `focus-visible:`, every ring 1px | open |
| D37 | Toast auto-dismisses at 3000ms with no pause and no log | open |
| D38 | The 3% white hover measures 1.088:1 across 32 sites | open in dark |
| D39 | Preset shadows measure 1.050:1 on the dark canvas | open in dark, retinted in light |
| D40 | `CTable` hardcodes a hex zebra, hover and selection scrim | **closed**, all three tokenized |
| D41 | `prefers-reduced-motion` handled once in the app, zero in the preset | open |
| D42 | `transition-all` in the preset, plus bare `transition` on virtualised rows | open |
| D43 | Raw Tailwind colour references in the preset and in app source | open, 180 and 58 |
| D44 | `sdk-frontend` has zero references to theme or colour mode | **open, blocks the plugin story** |
| D45 | Row-highlight swatches are background-only | **closed**, `--c-highlight-swatch-*` split from the fills |
| D46 | 89 icon occurrences use FA4 or FA5 alias names | open |
| D47 | Font Awesome Regular, Brands and Material Icons ship nearly unused | open |
| D48 | The `FontFamily` setting offers two serif faces and one monospace face | open |
| D49 | `useFont.ts:25-29` writes the bare family name into the token | open |
| D50 | Two copies of `@caido/common-frontend` ship in one bundle | **closed**, `packages/rete` now uses `catalog:` |

## What is already correct

An honest record has to say what not to touch. Several of these are the patterns the rest of the work should copy.

| Strength | Measurement, and what to keep |
|---|---|
| The theme mechanism is complete and ordinary | a setting, a store message, a service, a `watchEffect` and a blocking boot script. Nothing exotic to maintain |
| The layer declaration carries both theme layers | `c-theme` after `c-core`, `c-overrides` after `c-utilities`. Adding a third theme is one more file |
| The dark preservation rule held | every alias in `tokens.css` carries a dark value identical to the rung it replaced, so the alias swap was a no-op |
| The half-rung device | `surface-150` and `surface-350` gave the inset plane and the control boundary real values without moving the two rungs the preset pins |
| The HSL channel-triplet storage is correct and load-bearing | `tokens.css` stores bare channels, which is what Tailwind 3 requires for opacity modifiers |
| The token layer has one owner | `packages/ui` imports the `packages/components` files rather than copying them |
| The role names are utilities now | 442 role-utility usages against 107 remaining step utilities, all of them dark pins |
| The persisted highlight string was respected | splitting the swatch foreground kept every already-tagged row valid |
| `CCheckbox` is a correct `useId()` plus `<label for>` implementation | copy its naming pattern verbatim into the radio and toggle wrappers |
| Spacing usage is already near-tokenized | three steps cover 87% of gaps and 76% of paddings. The tail needs no restyling |
| Border width already resolves to a clean two-step system | 1px used 77 times, 2px used 23 times |
| The `label`-prop rule is fully enforced | zero Buttons use text children instead of `label` |
| The dark elevation ladder is wider-spaced than Radix's | canvas to raised 1.19:1, raised to chip 1.46:1, carried by background shift alone |
| `@tailwindcss/container-queries` is already a dependency | the two thresholds in use match the first two specified |
| The preset contains exactly one well-formed enter and exit pair | on the menu at `primevue.mjs:263`. Copy its shape |

The channel-triplet mapping is verified in the built CSS: `.bg-danger-400\/10 { background-color: hsl(var(--c-danger-400) / .1) }`.

| Rule | Why |
|---|---|
| Keep the channel-triplet storage exactly as it is | it is one careless tidy-up away from stripping the alpha off every opacity modifier in the codebase |
| Never re-derive the elevation ladder in dark | it already clears every separation threshold on background shift alone |
| Never replace a half-rung with a moved rung | 200 and 300 are pinned by 93 vendor references this repository cannot edit |

## Open questions

Items that are unresolved rather than defective, recorded so they are not mistaken for either.

| # | Open question | What it blocks |
|---|---|---|
| 1 | Windows and Linux metrics are unverified. Every face metric came from the macOS binaries | any density claim for those platforms, until the faces are measured |
| 2 | The CodeMirror line-box lookup needs verification against CodeMirror itself | confirming the specified value is honoured rather than overridden by internal measurement |
| 3 | Trebuchet MS has no `sxHeight` or `sCapHeight` record | keeping it in the selectable face list |
| 4 | The dark-mode optical compensation reduces to two parts on the current stack | FontAwesome sets `-webkit-font-smoothing: antialiased` on every icon class |
| 5 | Should a fifth dark plane be minted between raised and inset? In dark, canvas and inset are the same rung | the only real elevation step in dark is canvas to raised at 1.19:1 |
| 6 | Should the dark control boundary move, breaking rule eight? | closing D29 and D30, which no light-side override can reach |
| 7 | Splitter persistence key stability is unaudited against pane insertion and reordering | recovery, because there is no per-split and no global reset affordance |

Open question 4 in full: Arial has no variable weight axis, so dropping `wght` by 20 units is unavailable. What remains is the warm off-white ink on the dark canvas family, and never setting `-webkit-font-smoothing: antialiased`.

Open question 6 is the one with a deadline. Every other dark defect can wait for an upstream release, and this one is a two-line override the project has so far declined to write.

| Rule | Why |
|---|---|
| Decide open question 6 before the light theme is announced | a reviewer who measures both themes will find the dark boundary first |
| Remove the FontAwesome `-webkit-font-smoothing: antialiased` declaration as part of the icon work | it is the single place the dark-mode ink rule is broken today |
| Never publish a density claim for Windows or Linux from the measurements here | Linux usually substitutes a different face entirely |
| Never treat these as blocked work | each is a measurement or a decision that can be taken in an afternoon |
