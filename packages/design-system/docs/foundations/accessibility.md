# Accessibility

Every number on this page was recomputed from the palette the product ships. Nothing was judged by eye, and nothing here describes a colour Caido does not have.

Paper was solved against a contrast budget. Dark was not re-solved at all, so this page reports what dark measures rather than what it was designed to meet.

## The contrast contract

Foreground and background pairs are held to WCAG 2.2. APCA is reported alongside for dark, where the WCAG formula is least reliable, and never replaces it.

| Gate | Threshold | Governs |
|---|---|---|
| SC 1.4.3 Contrast (Minimum), AA | 4.5:1 | All text, at every size in this system |
| SC 1.4.11 Non-text Contrast, AA | 3:1 | Control boundaries, focus rings, meaningful icons |
| SC 1.4.6 Contrast (Enhanced), AAA | 7:1 | The reading pair on canvas and on the raised sheet |
| APCA-W3 Lc | Reported, not a conformance gate | Readability of the dark reading pair |

<Swatches
  :tokens="[
    { name: 'Paper canvas', hex: '#F3EEE8', job: 'surface-100, the page plane' },
    { name: 'Paper ink', hex: '#221F1B', job: '14.23:1 on canvas, APCA Lc 93.7' },
    { name: 'Dark canvas', hex: '#25272D', job: 'surface-900, unchanged' },
    { name: 'Dark ink', hex: '#C7C7C7', job: '8.83:1 on canvas, APCA Lc 69.4' }
  ]"
  caption="The reading pair in both themes. Both clear SC 1.4.6 on canvas and on the raised sheet." />

### What the budget re-anchored

The contrast budget decided which rungs moved, not taste. Six values carry the decision, and each was measured against the Paper canvas.

| Token | Value | On canvas | Role it was solved for |
|---|---|---|---|
| `--c-secondary-300` | `#DAA049` | 2.00:1 | Fills only, never text |
| `--c-secondary-500` | `#845210` | 5.70:1 | Gold ink on the inset plane |
| `--c-danger-400` | `#B12F1B` | 5.53:1 | Error ink and error fill |
| `--c-info-400` | `#2F677F` | 5.41:1 | Info ink and info fill |
| `--c-success-400` | `#246B28` | 5.67:1 | Success ink and success fill |
| `--c-primary-500` | `#A1213F` | 6.49:1 | The brand, and the Paper focus ring |

DI-SERRIA `#DAA049` is the gold Caido has always shipped, and on paper it measures 2.00:1. It stays in the ramp as a fill while the ink role moves down to the 400 and 500 rungs.

### Each family needed its own move

Darkening alone does not produce a readable ink. Info sits at 17 percent saturation in dark, so darkening it yields a grey and the saturation had to rise to 46 percent instead.

Green carries the most luminance per unit of saturation, so success dropped furthest, from 58 percent lightness to 28. Gold slides to brown unless saturation rises as lightness falls, which is why secondary-400 gains 10 points of saturation on the way down.

### Why dark is also measured with APCA

The WCAG 2.x formula loses accuracy as the lighter colour of a pair gets darker, which is the condition a dark theme lives in.

| Pair | WCAG | APCA Lc |
|---|---|---|
| Paper ink `#221F1B` on canvas `#F3EEE8` | 14.23:1 | 93.7 |
| Paper body `#453D36` on canvas | 9.22:1 | 85.0 |
| Dark ink `#C7C7C7` on canvas `#25272D` | 8.83:1 | 69.4 |
| Dark body `#ABABAB` on canvas | 6.50:1 | 53.5 |

Both reading pairs clear AAA, yet APCA separates them by 24 Lc. Read a 7:1 pass as a floor cleared, not as equal readability across the two themes.

APCA signs light-on-dark negative, and the magnitudes are quoted above. It is not a conformance standard, so it never excuses the WCAG floor.

### The large-text exemption never applies

SC 1.4.3 relaxes to 3:1 at 18pt, or 14pt bold. Body text here is 14px, which is 10.5pt, so nothing in the system qualifies.

Solve every ink against 4.5:1, including captions, help text and placeholders. Understanding SC 1.4.3 names placeholders directly.

### Headroom on paper

No Paper ink rung sits within rounding distance of its floor, so an 8-bit quantisation step cannot drop one under. The tightest ink is info-400 at 5.41:1 against a 4.5:1 floor.

The tightest non-text value is the control boundary `#88796B`, which measures 3.09:1 on the inset plane, 3.65:1 on canvas and 4.13:1 on the raised sheet.

## Focus

The Paper ring is one tone. `--c-focus-ring` resolves to primary-500 `#A1213F`, and in dark the same token is `#ffffff`. There is no two-tone construction anywhere in the product.

| Ring | Plane | Contrast |
|---|---|---|
| Paper `#A1213F` | canvas `#F3EEE8` | 6.49:1 |
| Paper `#A1213F` | raised `#FDFDFB` | 7.35:1 |
| Paper `#A1213F` | inset `#E2DCD4` | 5.50:1 |
| Paper `#A1213F` | chip `#D8CFC5` | 4.87:1 |
| Dark `#FFFFFF` | canvas `#25272D` | 14.93:1 |
| Dark `#FFFFFF` | raised `#30333B` | 12.63:1 |
| Dark `#FFFFFF` | chip `#484C56` | 8.59:1 |

One tone per theme works because the token is theme scoped. The worst case across the seven pairings is 4.87:1, against a 3:1 floor.

### What consumes the token

`--c-focus-ring` has exactly one consumer. The prebuilt `.c-button` hard-codes its focus colour to `white`, which is invisible on paper, so the light theme re-points it.

```css
:root[data-mode="light"] .c-button {
  --button-focus-color: var(--c-focus-ring);
}
```

The prebuilt geometry is a box shadow rather than an outline: `.c-button__input:focus-visible` clears the outline and paints `0 0 .1em .1em var(--button-focus-color)`.

PrimeVue controls take a different route, `focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]` in the primary or secondary ramp. Both routes trigger on `:focus-visible`, never on `:focus`.

<DoDont
  mode="light"
  do="The brand ring measures 7.35:1 against the raised sheet."
  dont="The prebuilt white ring measures 1.02:1 against the raised sheet.">
  <template #do>
    <div class="flex w-full items-center justify-center rounded-lg bg-raised p-5">
      <span class="inline-flex h-md items-center rounded-md bg-accent px-3 text-body font-medium text-ink-onsolid shadow-[0_0_0.1em_0.1em_var(--c-accent-solid)]">Send</span>
    </div>
  </template>
  <template #dont>
    <div class="flex w-full items-center justify-center rounded-lg bg-raised p-5">
      <span class="inline-flex h-md items-center rounded-md bg-accent px-3 text-body font-medium text-ink-onsolid shadow-[0_0_0.1em_0.1em_var(--c-fg-onsolid)]">Send</span>
    </div>
  </template>
</DoDont>

### The inverse tone

`--c-focus-ring-inverse` resolves to surface-0 in both themes, `#FDFDFB` on paper and `#EDEAE8` in dark. It exists for a ring that lands on a saturated fill, where the ring tone would otherwise sit on its own colour.

On paper it measures 7.35:1 against the brand fill. No rule consumes it yet, so treat it as the reserved answer to that case rather than as shipped behaviour.

### Which ring rungs clear the bar

The preset rings with primary-300, primary-400 and primary-500. On paper only the last two clear SC 1.4.11, at 5.35:1 and 6.49:1 on canvas, while primary-300 `#EDABB5` measures 1.64:1.

Two bans hold everywhere:

- Never write `outline-none` without rendering a replacement indicator in the same rule. `CInternalLink` and `CExternalLink` do this correctly: they drop the outline and underline instead.
- Never build a ring from an opacity modifier, because the composited result is not a token and cannot be measured.

## Colour is never the only cue

SC 1.4.1 Use of Color is Level A, the lowest bar in the standard, and no palette satisfies it alone. Every status, tag, selected row and disabled control carries a second channel.

| Meaning | Glyph that ships | Outline |
|---|---|---|
| Error | `fas fa-triangle-exclamation` | Triangle |
| Failed item | `fas fa-circle-xmark` | Circle with a cross |
| Success | `fas fa-circle-check` | Circle with a tick |
| Info | `fas fa-circle-info` | Circle with a letter i |
| Selected | `fas fa-check` | Bare tick, no container |

Error takes the only triangle, because it is the state most often read at a glance and beside another status. The remaining circles differ by their interior glyph, which is a weaker channel than outline shape.

<DoDont
  do="Triangle beside circle: the pair reads without colour."
  dont="Circle beside circle: the pair reads only in colour.">
  <template #do>
    <div class="flex flex-col gap-2 text-body text-ink">
      <span class="flex items-center gap-2"><i class="fas fa-triangle-exclamation text-danger-ink" aria-hidden="true"></i>Error</span>
      <span class="flex items-center gap-2"><i class="fas fa-circle-check text-success-ink" aria-hidden="true"></i>Success</span>
    </div>
  </template>
  <template #dont>
    <div class="flex flex-col gap-2 text-body text-ink">
      <span class="flex items-center gap-2"><i class="fas fa-circle text-danger-ink" aria-hidden="true"></i>Error</span>
      <span class="flex items-center gap-2"><i class="fas fa-circle text-success-ink" aria-hidden="true"></i>Success</span>
    </div>
  </template>
</DoDont>

### The error and warning pair

The Paper danger ramp drops to danger-700 `#751810` where error sits beside the gold warning, and the token file records that as the reason for the rung. At the 400 rung the red and the gold collapse under deuteranopia.

That collapse is why the shape channel is mandatory rather than decorative, and why the pair is never distinguished by fill alone.

### Measured separation

Row highlights separate by a worst case of 9.0 CIE76 for normal vision, 7.9 under deuteranopia and 6.2 under protanopia. The set they replaced measured 2.4.

Syntax co-occurring pairs reach 26.3 CIE76 for normal vision and 17.0 under protanopia. Deuteranopia reaches 9.4, short of the 12.3 the token file states, and stands as a known limit of the palette.

Every status ships a label, visible or as the icon's accessible name, and every row tag renders its name as text beside its fill.

### Selection

The selected table row is a veil, not a swap: gold at 14 percent on paper, white at 20 percent in dark. On paper that veil measures 1.19:1 against the row it replaces, so the row cannot lean on it alone.

The command palette carries a second channel of its own, `--c-selection-marker`, gold `#845712` on paper and `transparent` in dark. Selection must also expose its state programmatically, not only visually.

### Disabled states use tokens, never opacity

`--c-ink-disabled` resolves to `--c-ink-faint`: `#6A5E53` on paper and `#616161` in dark. On paper it measures 5.45:1 on canvas and 4.62:1 on the inset plane.

Where an affordance genuinely fades, the fade is a token too. `--c-opacity-ghost` is 0.15 in dark and 0.4 on paper, because 0.15 of the paper ink composites to 1.34:1 on canvas while 0.4 reaches 2.39:1.

<DoDont
  do="A disabled token composites nothing, so the value can be measured."
  dont="An opacity modifier composites with the plane, so nothing can be measured.">
  <template #do>
    <div class="flex w-full items-center justify-center rounded-lg bg-raised p-5">
      <span class="inline-flex h-md cursor-not-allowed items-center rounded-md bg-disabled px-3 text-body font-medium text-ink-faint">Send</span>
    </div>
  </template>
  <template #dont>
    <div class="flex w-full items-center justify-center rounded-lg bg-raised p-5">
      <span class="inline-flex h-md cursor-not-allowed items-center rounded-md bg-accent px-3 text-body font-medium text-ink-onsolid opacity-50">Send</span>
    </div>
  </template>
</DoDont>

A disabled control also sets `aria-disabled="true"`, keeps `cursor: not-allowed`, and suppresses its hover, focus and pressed state layers.

## Target size and text spacing

| Criterion | Level | Number |
|---|---|---|
| SC 2.5.8 Target Size (Minimum) | AA | 24 by 24 CSS px |
| SC 2.5.5 Target Size (Enhanced) | AAA | 44 by 44 CSS px, coarse pointer |
| SC 1.4.12 Text Spacing | AA | Survives line-height forced to 1.5 |
| SC 1.4.4 Resize Text | AA | 200 percent zoom, no loss of content |

The spacing exception is exact. An undersized target passes when a 24px circle centred on its bounding box does not touch another target's circle, so a 20 by 20 icon button with a 4px gap passes and the same button with no gap fails.

### Why 24px is also a text rule

At 14px text, SC 1.4.12 forces a 21px line box. A 20px fixed-height row with `overflow: hidden` clips it, and clipped text is loss of content.

So every control and every row states its size as `min-height`, never `height`, and centres its content with flex. The box grows when the line box grows.

<DoDont
  align="start"
  do="min-height lets the row grow when line-height is forced."
  dont="A fixed 20px row clips text at 1.5 line spacing.">
  <template #do>
    <div class="w-full max-w-[280px] overflow-hidden rounded-md border border-separator font-mono text-code text-ink">
      <div class="flex min-h-xs items-center border-b border-separator px-2 leading-[1.5]">GET /api/session</div>
      <div class="flex min-h-xs items-center px-2 leading-[1.5]">POST /api/charge</div>
    </div>
  </template>
  <template #dont>
    <div class="w-full max-w-[280px] overflow-hidden rounded-md border border-separator font-mono text-code text-ink">
      <div class="flex h-[20px] items-center overflow-hidden border-b border-separator px-2 leading-[1.5]">GET /api/session</div>
      <div class="flex h-[20px] items-center overflow-hidden px-2 leading-[1.5]">POST /api/charge</div>
    </div>
  </template>
</DoDont>

## What dark inherits

Dark did not move. Every alias carries a value byte-identical to the rung it replaced, so a gate dark misses today was already missed before Paper existed.

| Role | Dark value | On dark canvas | Paper value | On Paper canvas |
|---|---|---|---|---|
| `--c-line-control` | `#616161` | 2.41:1 | `#88796B` | 3.65:1 |
| `--c-ink-faint` | `#787878` | 3.38:1 | `#6A5E53` | 5.45:1 |
| `--c-ink-disabled` | `#616161` | 2.41:1 | `#6A5E53` | 5.45:1 |

Paper is where the boundary gate could finally be enforced, and it needed its own layer to do it. The theme file records the prebuilt preset's control boundary at 1.51:1, and only a layer ordered after `c-utilities` can beat a Tailwind utility.

```css
@layer c-overrides {
  :root[data-mode="light"] [data-pc-name="inputtext"] {
    border-color: hsl(var(--c-line-control));
  }
}
```

The override is keyed on `data-pc-*` attributes, never on the preset's class strings, so a preset upgrade cannot quietly drop it.

## How these numbers are checked

`extract.mjs` reads `tokens.css`, `theme.light.css` and `colors.variables.css` and rewrites the data this site renders from. Ramps, swatches and the token table cannot drift, because none of them holds a value of its own.

| Record | Count |
|---|---|
| Semantic tokens, both themes | 139 |
| Token groups | 10 |
| Ramp rungs, both themes | 122 |
| Families with a full ramp | 6 |

There is no CI step in proxy-frontend that fails a build on contrast. The extractor removes drift in the values, and every ratio above was recomputed from the two hexes named beside it.
