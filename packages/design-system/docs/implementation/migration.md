# Migration

Paper ships. `theme.light.css` carries the light block, `data-mode` is wired from the settings row to the first paint, and every token declared in `tokens.css` has a light counterpart. Light is selectable today under Settings, Appearance.

This page is what that work left behind. The record of what already landed is on [Current state](/implementation/current-state), and the dark palette's value history is on the [changelog](/changelog).

## What is left

| Item | Why this repository cannot close it alone | Who has to act |
|---|---|---|
| Preset pins | `@caido/primevue` ships class strings, not tokens, and spends rungs this ramp needs elsewhere | `@caido/primevue` |
| Dark literals in packages | The values sit outside any custom property, so no token can reach them | `@caido/common-frontend`, `@codemirror/view` |
| The plugin colour-mode API | The type lives in `packages/sdk-frontend` and publishes from `sdk-js` | Both repositories, one release |

Everything else in the theme is either shipped or deliberately left as it is, and each of those decisions is stated below where it matters.

## Preset pins

`@caido/primevue@0.3.3` is a prebuilt bundle of Tailwind class strings. It cannot read a token, and a class string is build output, so nothing in it can be targeted safely by name.

### The light-branch census

Counted over `primevue.mjs`, splitting `dark:` variants from the light branch.

| Rung | Light-branch references | What the preset spends it on |
|---|---|---|
| `surface-0` | 139 | control and panel fills |
| `surface-200` | 107 | borders, chips, disabled fills |
| `surface-100` | 47 | hover fills |
| `surface-300` | 41 | control boundaries |
| `surface-50` | 11 | the lightest fill |
| `primary-700` | 4 | the solid button |

Steps 200 and 300 are spent, so the light ramp cannot reuse them for its own seam. That is why 150 and 350 exist as half rungs: `--c-line-control` needs 3:1 and lands on 350 at 4.12:1 against a raised sheet, while the preset's own 200 measures 1.51:1 and its 300 measures 1.96:1.

### Where the overrides stop

The `c-overrides` layer re-points twelve `data-pc-name` values to `--c-line-control`. It is keyed on attributes rather than on the preset's class strings, and only a layer declared after `c-utilities` can beat a Tailwind utility.

Forty-three preset components carry an unprefixed light-branch `border-surface-200` or `-300`. Most are containers, which WCAG 1.4.11 does not gate. Four control shapes the app actually renders are still on the preset value.

| Component | Sites in app source | Preset light border |
|---|---|---|
| `Tab` and `TabList` | 8 imports each | `border-surface-200`, 1.51:1 |
| `InputGroupAddon` | 10 imports | `border-surface-300`, 1.96:1 |
| `Dropdown` | 5 imports | `border-surface-300`, 1.96:1 |
| `ColorPicker` | 1 import | `border-surface-300`, 1.96:1 |

`Dropdown` is the quiet one. PrimeVue 4 keeps it as a deprecated alias of `Select` but sets `name: "Dropdown"`, and `data-pc-name` is that name lowercased, so the `select` selector never reaches those five instances.

The tab underline is the visible failure. In the light branch the preset writes `border-surface-200` for the active tab and for the inactive one, and reserves the gold `border-secondary-400` for dark alone, so state stops being carried by the underline.

<DoDont
  mode="light"
  do="Active tab underline uses the gold ink: state survives on paper."
  dont="Active tab underline uses the seam rung: state disappears on paper.">
  <template #do>
    <div class="flex w-[230px] gap-1 rounded-md bg-raised p-1">
      <div class="border-b-2 border-gold-ink px-3 py-2 text-body text-gold-ink">Request</div>
      <div class="border-b-2 border-separator px-3 py-2 text-body text-ink-muted">Response</div>
    </div>
  </template>
  <template #dont>
    <div class="flex w-[230px] gap-1 rounded-md bg-raised p-1">
      <div class="border-b-2 border-separator px-3 py-2 text-body text-ink-muted">Request</div>
      <div class="border-b-2 border-separator px-3 py-2 text-body text-ink-muted">Response</div>
    </div>
  </template>
</DoDont>

### The two patches already standing in

`--p-primary-700` is re-pointed to the light brand rung, because the solid Button hardcodes `bg-primary-700` and dark carries the brand at 700 while the light ramp carries it at 500.

PanelMenu is re-pointed to the raised plane. The preset paints its root and its panel `bg-surface-800` with no light value, and 800 is body ink in this ramp, so the nav rendered as a dark slab.

Both patches look redundant from outside and are not. Neither can be deleted until an upstream release resolves in the lockfile.

### What the upstream release has to carry

- A light branch keyed to the same `data-mode` attribute this app already sets on `<html>`.
- Control boundaries at 3:1 against their own fill, not against the panel behind them.
- Steps 200 and 300 released from double duty, so a consuming ramp can place its own seam.

`--p-secondary-400` can go in the same change. Paper declares it in the light block and nothing reads it: the preset never names a `--p-secondary-*` variable, and the Sidebar rule it was written for reads `--c-secondary-400` directly.

## Surfaces still on dark literals

App source is clean. Every scoped `<style>` block across `ui`, `components`, `rete` and `codemirror` returns zero colour literals, and no hex survives outside test files. What remains belongs to a package.

### The five rules Paper misses

`@caido/common-frontend@2.7.4` ships 22 colour literals outside any custom property, across 19 rule groups. Paper restates 14 of those groups in `c-theme`. Five are missed, and all five for the same reason.

The theme file spells the class `.c-submenu__item-or-menu`. The package emits `.c-submenu__item-or-submenu`. Correcting that one string closes four of the five.

| Rule | Package literal | Result on paper |
|---|---|---|
| Submenu item hover and active | white at 10% | 1.00:1, no visible state |
| Submenu item disabled | `gray` | 3.88:1, identical in both themes |
| Disabled menu icon | `gray` | its own selector, so the covered parent rule cannot reach it |

The menu equivalents are all covered, so a menu and its submenu currently answer the same pointer differently. In dark that overlay measures 1.37:1, and Paper's own hover token measures 1.12:1 against a raised sheet.

<DoDont
  mode="light"
  align="start"
  do="Submenu hover uses the paper overlay token: the row under the pointer lifts."
  dont="Submenu hover keeps the package literal: the row under the pointer stays flat.">
  <template #do>
    <div class="w-[210px] rounded-md border border-separator bg-raised p-1">
      <div class="rounded-sm px-2.5 py-1.5 text-body text-ink">Copy as cURL</div>
      <div class="rounded-sm bg-inset px-2.5 py-1.5 text-body text-ink">Copy as HTTP</div>
      <div class="rounded-sm px-2.5 py-1.5 text-body text-ink">Copy URL</div>
    </div>
  </template>
  <template #dont>
    <div class="w-[210px] rounded-md border border-separator bg-raised p-1">
      <div class="rounded-sm px-2.5 py-1.5 text-body text-ink">Copy as cURL</div>
      <div class="rounded-sm px-2.5 py-1.5 text-body text-ink">Copy as HTTP</div>
      <div class="rounded-sm px-2.5 py-1.5 text-body text-ink">Copy URL</div>
    </div>
  </template>
</DoDont>

### The CodeMirror dark flag

`{ dark: true }` is still passed at module load in `extensions/theme.ts` and in `queryLanguage/shared/theme.ts`, so `@codemirror/view` keeps its `&dark` base branch selected under Paper.

Nothing is visible today. Every rule that branch paints is shadowed by a `--c-editor-*` token, and the three it covers that have no token, the tooltip arrow, `.cm-button` and `.cm-textfield`, are never rendered by this app.

The cost is latent. Enabling a stock CodeMirror panel, or taking an upstream release that adds one `&dark` rule, drops a dark surface onto paper with no build error. Reconfiguring the theme through a `Compartment` on `data-mode` change removes the whole class.

### `color-scheme` is declared once, on purpose

Paper declares `color-scheme: light`. Dark declares nothing, so native scrollbars, autofill, spellcheck underlines and the overscroll canvas keep the user agent default there.

<i class="fas fa-circle-info" aria-hidden="true" /> That is a trade rather than an oversight. Declaring `color-scheme: dark` would change what every existing dark user sees, which is the one rule this migration never broke.

## The plugin colour-mode API

A case-insensitive search for `colorMode`, `prefers-color-scheme` and `data-mode` over `packages/sdk-frontend/src` returns zero matches. The published `@caido/sdk-frontend` is a compiled mirror of that tree, so it returns zero as well.

This is the one item that is late rather than pending. Light is already selectable, so every published plugin holding dark colours is already reachable under Paper.

### What a plugin can do today

A plugin can read `document.documentElement.dataset.mode` and watch it with a `MutationObserver`. That works, and it is not a contract: nothing documents the attribute, the element it sits on, or its two values.

Plugins also compile their own CSS outside Caido's Tailwind config, so the `dark:` variant is unavailable to them at any level of author effort. The attribute is the only signal they have.

### Four requirements, one release

- **A read and a subscribe.** `getColorMode(): "light" | "dark"` and `onColorModeChange(callback): ListenerHandle` on `WindowSDK`. The seam exists: `onContextChange` at `packages/ui/src/api/window.ts:91` is a `watch` returning `{ stop }`, and colour mode is that same shape.
- **Publish the roles, demote the rungs.** `--c-plane-canvas`, `--c-ink-body` and `--c-line-control` become supported names, and `--c-surface-700` becomes internal. Line 4 of `tokens.css` still tells users the variables are theirs to customise, and under Paper step 700 is body ink rather than a mid grey.
- **Document the layer position.** Plugin CSS is injected into `@layer c-plugin` at `usePlugins.ts:211`, which now sits after `c-theme` and before `c-utilities`. A plugin therefore beats Paper's component restatements and loses to Tailwind utilities and to `c-overrides`.
- **Ship the developer note with the API, not after it.** The release where the read first exists is the only migration window plugin authors get.

## Sequencing

| Rule | What breaks if you ignore it |
|---|---|
| Ship the SDK read and event before any further theme work | light is already selectable, so every release without it is a release plugins cannot adapt to |
| Fix the submenu selector with a test that asserts the computed hover fill | the typo passed review once, and a selector that matches nothing fails silently |
| Key every preset patch on `data-pc-*`, never on the preset's class strings | class strings are build output and move without a major version |
| Delete a patch only once its upstream replacement resolves in the lockfile | the `--p-primary-700` and PanelMenu patches both look redundant from outside |
| Never declare `color-scheme: dark` as a tidy-up | it changes native UI for every existing dark user, and dark must not move |

## Residual risks

| Risk | What regresses | The check that catches it |
|---|---|---|
| The `localStorage` mirror is written only by `setColorMode` | a machine that never toggled locally boots dark and snaps once settings load | write the mirror on settings load too, then cold start a fresh profile |
| No gate asserts the ramp rungs are bare HSL channels | wrapping one rung in `hsl(…)` strips the alpha from every `/N` modifier downstream, with no build error | a regex over the ramp block of `tokens.css` inside `mise lint:prod` |
| No gate asserts a contrast floor per role | the pairs Paper measured live in comments, where no build can read them | enumerate the declared role pairs per theme and assert each floor in CI |
| No lint rule points authors at role classes | numbered rungs still compile, so new call sites keep naming steps instead of roles | warn on ramp utilities outside a `dark:` variant, one package at a time |
| A PrimeVue major renames `data-pc-name` | every preset patch stops matching and control boundaries drop back to the preset value | read the computed border colour on one patched control per family in a fixture |
| The theme flips with no transition suppression | any element carrying a colour transition animates the swap instead of cutting | suppress transitions for one frame around the attribute write |
| A future light value is authored against the canvas rather than its own plane | a border that clears 3:1 on the page fails against the sheet it actually sits on | measure against the legal background set, which is what naming a role makes possible |
