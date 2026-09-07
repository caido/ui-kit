---
outline: false
pageClass: wide
---

# Tokens

A token is a named decision. Paper did not invent this structure, it made it necessary: a second theme is only a data change if every colour a component paints is reached by a name that a theme block can re-point.

Three kinds of name do that work. Rungs hold the values, plane, ink and line aliases hold the jobs, and preservation tokens hold the literals that used to sit inside components.

<PageTabs :tabs="['Overview', 'All tokens']">

<template #overview>

### The three tiers, in the names that ship

`tokens.css` declares 176 custom properties: 61 rungs, 13 role aliases, `--c-on-emphasis`, and 101 preservation tokens. `theme.light.css` declares a light value for all 176, plus 68 more that dark inherits from other files.

```
  rung          --c-surface-900: 30deg 12% 12%                 bare channels, themed
     ▲
     │  var()
  role          --c-ink-strong: var(--c-surface-900)            a job, re-pointed per theme
     ▲
     │  utility class
  component     class="text-ink-strong"                         names the job, never the rung

  preservation  --c-plane-selected: hsl(var(--c-secondary-400) / 0.14)   a finished colour
     ▲
     │  arbitrary value
  component     class="bg-[var(--c-plane-selected)]"
```

| Tier | Names | Value shape | Read by |
|---|---|---|---|
| Rung | `--c-surface-0` to `--c-surface-950`, five brand and status families | Bare HSL channels | Aliases, the PrimeVue bridge |
| Role | `--c-plane-*`, `--c-ink-*`, `--c-line-*` | `var()` on one rung | Tailwind colour utilities |
| Preservation | `--c-plane-selected`, `--c-editor-*`, `--c-syntax-*`, 101 in total | A finished colour, alpha included | `var()` at the call site |

### Rung names are shared, rung values are not

Both themes declare the same 61 rung names, and both give them different values. A rung is a position in a ramp, so the only thing that survives the theme switch is where it sits, not what it holds.

| Family | Rungs | Steps |
|---|---|---|
| `surface` | 14 | 0, 50, 100, 150, 200, 300, 350, 400, 500, 600, 700, 800, 900, 950 |
| `primary` | 11 | 50 to 950 |
| `secondary`, `danger`, `success`, `info` | 9 each | 100 to 900 |

Paper reverses what the high rungs mean. In dark, `--c-surface-800` is the raised panel; in the Paper ramp the same name is heading ink.

The product carries the scar. The prebuilt PrimeVue preset paints PanelMenu with `bg-surface-800` and ships no light value, so the sidebar rendered as a dark slab until `theme.light.css` re-pointed it in `c-overrides`.

<DoDont
  mode="page"
  align="start"
  do="Bind the panel to a role and both themes repaint it."
  dont="Bind the panel to a rung and light keeps the dark value.">
  <template #do>
    <div class="flex w-full gap-3">
      <div class="ds-scope flex-1 rounded-lg bg-canvas p-3" data-mode="light">
        <div class="rounded-md border border-separator bg-raised p-2.5 text-ink">GET /api/session</div>
        <div class="mt-2 text-caption text-ink-muted">light</div>
      </div>
      <div class="ds-scope flex-1 rounded-lg bg-canvas p-3" data-mode="dark">
        <div class="rounded-md border border-separator bg-raised p-2.5 text-ink">GET /api/session</div>
        <div class="mt-2 text-caption text-ink-muted">dark</div>
      </div>
    </div>
  </template>
  <template #dont>
    <div class="flex w-full gap-3 [--frozen-bg:var(--c-bg-raised)] [--frozen-fg:var(--c-fg-default)] [--frozen-line:var(--c-border-separator)] [--frozen-muted:var(--c-fg-muted)]">
      <div class="ds-scope flex-1 rounded-lg bg-canvas p-3" data-mode="light">
        <div class="rounded-md border border-[var(--frozen-line)] bg-[var(--frozen-bg)] p-2.5 text-[var(--frozen-fg)]">GET /api/session</div>
        <div class="mt-2 text-caption text-[var(--frozen-muted)]">light</div>
      </div>
      <div class="ds-scope flex-1 rounded-lg bg-canvas p-3" data-mode="dark">
        <div class="rounded-md border border-[var(--frozen-line)] bg-[var(--frozen-bg)] p-2.5 text-[var(--frozen-fg)]">GET /api/session</div>
        <div class="mt-2 text-caption text-[var(--frozen-muted)]">dark</div>
      </div>
    </div>
  </template>
</DoDont>

### Planes, ink and lines

Thirteen aliases carry the whole surface system. Each is a bare `var()` on exactly one rung, in both themes, so the swap is a redirection and never a recalculation.

| Alias | Light rung | Dark rung |
|---|---|---|
| `--c-plane-canvas` | 100 | 900 |
| `--c-plane-raised` | 0 | 800 |
| `--c-plane-overlay` | 0 | 800 |
| `--c-plane-inset` | 150 | 900 |
| `--c-plane-chip` | 200 | 700 |
| `--c-ink-strong` | 900 | 200 |
| `--c-ink-body` | 700 | 300 |
| `--c-ink-muted` | 500 | 400 |
| `--c-ink-faint` | 400 | 500 |
| `--c-line-default` | 300 | 900 |
| `--c-line-soft` | 200 | 700 |
| `--c-line-strong` | 350 | 600 |
| `--c-line-control` | 350 | 600 |

`--c-on-emphasis` sits beside them and is the one exception. Dark declares it as a literal rather than as `var(--c-surface-0)`, so a later change to rung 0 cannot move the text on a crimson fill.

The `ui` Tailwind config exposes the thirteen as colour utilities: `bg-canvas`, `bg-raised`, `bg-inset`, `bg-chip`, `text-ink-strong`, `text-ink-muted`, `border-line`, `border-line-control`. Each is emitted as `hsl(var(--token) / <alpha-value>)`.

### Why the swap is an alias swap

Rewriting the ramp inside the theme block would work only if every role moved by the same function of its rung. Four rows from the table above show it cannot.

| Evidence | Light | Dark | What it rules out |
|---|---|---|---|
| `--c-ink-strong` against `--c-ink-faint` | 900 and 400 | 200 and 500 | A shared direction of travel |
| `--c-plane-canvas` against `--c-plane-inset` | 100 and 150 | 900 and 900 | A one-to-one mapping of rungs |
| `--c-plane-canvas` against `--c-line-default` | 100 and 300 | 900 and 900 | A fixed offset between roles |
| `--c-line-strong` against `--c-line-soft` | 350 and 200 | 600 and 700 | A shared sign on the delta |

Two roles land on the same rung in dark and separate in light. A seam in dark is rung 900, the same value as the canvas it sits on, and in Paper it is a mid grey at rung 300, which is a difference of intent rather than of degree.

### Preservation tokens

The other 101 names exist because the value was already in the product, hardcoded in a component, an editor theme or a stylesheet. Each one names that literal so the light theme has somewhere to answer.

| Group | Count | Dark value |
|---|---|---|
| Planes and neutral ink: selected, hover, zebra, veils, tabs | 17 | The literal the component shipped |
| Overlays, scrims, focus ring, stripe, medal | 9 | The literal each rule shipped |
| Editor chrome | 19 | What CodeMirror's own themes paint |
| Syntax | 24 | Today's highlight literals, verbatim |
| intro.js chrome and the search cancel icon | 5 | The overrides file, data URI included |
| Component scoped: tour, palette, onboarding, workflow, confetti | 27 | The literals those components shipped |

They differ from role aliases in one way that matters at the call site. A role alias passes channels through, so a utility can add its own alpha, while a preservation token resolves to a finished colour and is read directly.

```css

--c-plane-canvas: var(--c-surface-100);

--c-plane-selected: hsl(var(--c-secondary-400) / 0.14);
```

That is why `CTable` writes `hover:bg-[var(--c-plane-hover-row)]` and not a named utility. Put a colour function in a rung and every `/10` below it drops its alpha with no build error.

### The vendor bridge

Two libraries own names Caido does not. `@caido/common-frontend` ships 35 semantic properties, and the PrimeVue preset reads a `--p-` ramp. Both are re-pointed rather than replaced.

```css
--c-bg-default: hsl(var(--c-plane-canvas));   
--p-surface-100: hsl(var(--c-surface-100));   
```

The bridge is where rung mapping bites. The Button preset hardcodes `bg-primary-700`, dark carries the brand crimson at 700 and Paper carries it at 500, so the light block re-points `--p-primary-700` at `--c-primary-500`.

Some prebuilt rules read no custom property at all. Those are restated inside `c-theme` at equal specificity, and the file says plainly that upstream is the real fix.

### Layers decide who wins

Both style entry points open with the same line, so the order is fixed before any rule is parsed.

```css
@layer c-base, c-core, c-theme, c-components, c-plugin, c-utilities, c-overrides;
```

`theme.light.css` is imported without a `layer()` function, on purpose. It declares `c-theme` for the palette and `c-overrides` for the handful of rules that have to beat a Tailwind utility.

| Layer | Holds | Why it sits there |
|---|---|---|
| `c-base` | `tokens.css`, `primevue.css`, `colors.variables.css` | Rungs and preservation tokens, before anything reads them |
| `c-core` | `@caido/common-frontend` | Vendor rules, overridable by the theme |
| `c-theme` | Paper, and restated prebuilt rules | After the vendor, before components |
| `c-plugin` | Plugin CSS, wrapped at injection time | Above components, below utilities |
| `c-utilities` | Tailwind utilities | Normal utility precedence |
| `c-overrides` | Control boundaries, PanelMenu | The only place a rule can beat a utility |

`c-overrides` earns its position. The prebuilt preset emits a control boundary at 1.51:1 as a utility, WCAG 1.4.11 asks for 3:1, and the override re-points those borders at `--c-line-control` keyed on `data-pc-*` attributes rather than class strings.

### The theme selector and first paint

The attribute is `data-mode` on `<html>`, and the setting is a two value enum in `@proxy-frontend/types` that defaults to `dark` and falls back to `dark` on a parse failure. A third theme is one more `:root[data-mode="x"]` block in a sibling file.

Only the light block declares `color-scheme`. Dark keeps the user agent default it has always had, which is what stops scrollbars and native controls shifting for existing users.

The real preference lives in user settings on the backend, so it is not readable at first paint. Three pieces close that gap and all three ship.

| Piece | Where | Job |
|---|---|---|
| `<html data-mode="dark">` | `packages/ui/index.html` | The document has a mode before any script runs |
| Blocking inline script | `packages/ui/index.html` | Reads `caido.colorMode`, guarded for blocked storage |
| Write through mirror | `useSettingsState.ts` | Puts the saved mode where that script can find it |

Once the app is up, `useColorMode` runs a `watchEffect` that writes `document.documentElement.dataset.mode`. Toggling one attribute re-evaluates every custom property at once, which is the whole point of keeping components off the rungs.

### What a plugin can rely on

Plugin CSS is fetched and injected wrapped in `@layer c-plugin { }`, between the component and utility layers. That position is the cascade guarantee, and it holds whatever the plugin's own selectors look like.

Every rung, role alias and preservation token is a global custom property, so a plugin can read them. Roles are the supported surface, because a rung means the opposite thing in the other theme.

There is no SDK call for the colour mode today. A plugin that renders its own DOM reads `document.documentElement.dataset.mode` and watches the attribute if it needs to react.

### Do and do not

| Do | Do not | What breaks |
|---|---|---|
| Name a role at the call site, so a theme change is a data change | Write a rung into a component | `surface-800` is a panel in dark and heading ink in Paper |
| Keep rungs and role aliases as bare channels | Write a colour function into a rung | Every opacity modifier below it drops its alpha silently |
| Read a preservation token with `var()` at the call site | Wrap one in a colour utility | It already carries its alpha, and the utility adds a second |
| Re-point a vendor name at a Caido role | Fork the vendor ramp | The next preset upgrade reintroduces every hardcoded rung |
| Put a rule that must beat a utility in `c-overrides` | Reach for `!important` | Specificity fights leave no record of what they were fighting |
| Apply the mode from the blocking script in `index.html` | Apply it after login or from a module | The wrong theme paints first, then snaps |

</template>

<template #all-tokens>

Every semantic token, grouped by what it paints, with its value in both themes. Rungs are not listed here because a rung has no job of its own: the ramps are on [Colour](/foundations/colour).

Values are extracted from `tokens.css`, `theme.light.css`, `colors.variables.css` and the vendor stylesheet, so this table cannot drift from what ships.

<TokenSearch />

</template>

</PageTabs>
