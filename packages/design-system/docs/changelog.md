---
title: What changed
pageClass: wide
---

# What changed

Caido changed in one direction only. The dark palette the product has always shipped is untouched, and a light theme called Paper was built to sit beside it. This page records both halves of that claim with the values it rests on.

| Measure | Number |
|---|---|
| Dark values that change | 0 |
| Light values shipping before Paper | 0 |
| Lines in `theme.light.css` | 423 |
| Colour rungs authored for Paper | 61 |
| Neutral rungs in the Paper ramp | 14 |
| Semantic tokens carrying both themes | 139 |
| Rungs added to the dark file for light-only consumers | 7 |

Contrast is WCAG 2.2 relative luminance measured on the Paper canvas unless a row names another plane, and hue is always stated with its colour space.

## One change, two halves

Drag the divider. The left half is the palette Caido already shipped, unchanged. The right half did not exist.

<ThemeCompare />

## Dark did not move

Every alias introduced for the light theme carries a dark value byte-identical to the rung it replaced. The swap is a no-op in dark by construction, not by review.

| Mechanism | What the dark value resolves to |
|---|---|
| Plane, ink and line aliases | The surface rung the component already reached for |
| Preservation tokens | Today's literal, byte for byte |
| Syntax and editor chrome | The literals the editors already ship |
| Highlight swatch tokens | `var(--c-highlight-color-*)`, the row fill itself |
| Search cancel icon | The exact data URI `global.css` ships |
| Confetti | The six literals the celebration card shipped with, in array order |

This constraint shaped the structure more than any colour preference did. A role that could not carry its dark value unchanged was not allowed to exist.

Seven rungs were added to `tokens.css` so light-only consumers have a name to reach for: two on primary and five on surface. Surface 50 and 100 carry today's hardcoded `--p-surface-50` and `--p-surface-100` verbatim.

## Paper is the new work

Paper lives in `theme.light.css` under `:root[data-mode="light"]`, inside the `c-theme` layer. It declares 61 colour rungs, the semantic aliases above them, and a second layer that repairs what the prebuilt preset gets wrong on a light background.

## Where Paper comes from

Three directions were generated: warm paper, linen, and brand forward. Each was scored by three lenses, contrast, brand coherence and implementability, and the winner was synthesised and then verified. The row highlights and the syntax palette were derived separately by explicit optimisation.

### The canvas descends from isabelline

Nothing starts from scratch when an existing Caido colour can parent it. The page canvas sits 16 degrees from isabelline in OKLCH hue and carries more than twice its chroma, which is what makes it read as warm rather than white.

<Swatches :tokens="[
  { name: '--isabelline', hex: '#EDEAE8', job: 'the dark body ink, and the parent' },
  { name: '--c-surface-100', hex: '#F3EEE8', job: 'the Paper page canvas' }
]" caption="The parent above, the canvas below." />

### One hue family for every neutral

All 14 neutral rungs sit between 30 and 32 degrees. A neutral black beside a 32 degree canvas reads as dirt, so Paper carries no cool grey anywhere.

Saturation falls from 40 percent at the raised plane to 11 percent at the muted ink, then rises to 12 and holds through the darkest rungs.

<Ramp family="surface" />

### The ramp is split by role

| Range | Job | Rungs in it |
|---|---|---|
| 0 to 150 | Planes | Raised, zebra, canvas, inset |
| 200 to 350 | Lines and controls | Edge, divider, control boundary |
| 400 to 950 | Ink | Placeholder, muted, body, headings, max emphasis |

A rung never does two jobs, so a value cannot be reused into a role its contrast was never solved for.

### The contrast budget decides re-anchoring

Re-anchoring is decided by the contrast floor, not by taste. Where a dark value could not hold its meaning on paper, the rung moved until it cleared. Six anchors carry the result.

<Swatches :tokens="[
  { name: '--c-secondary-300', hex: '#DAA049', job: 'di-serria, fills only' },
  { name: '--c-secondary-500', hex: '#845210', job: 'gold ink on an inset' },
  { name: '--c-danger-400', hex: '#B12F1B', job: 'error' },
  { name: '--c-info-400', hex: '#2F677F', job: 'info' },
  { name: '--c-success-400', hex: '#246B28', job: 'success' },
  { name: '--c-primary-500', hex: '#A1213F', job: 'the brand' }
]" caption="The six anchors, measured on the canvas below." />

| Token | On the canvas | What it is allowed to do |
|---|---|---|
| `--c-secondary-300` | 2.00:1 | Fills only. It can never be text |
| `--c-secondary-500` | 5.70:1 | The gold ink, solved for an inset plane |
| `--c-danger-400` | 5.53:1 | Error ink, fill and border |
| `--c-info-400` | 5.41:1 | Info ink, fill and border |
| `--c-success-400` | 5.67:1 | Success ink, fill and border |
| `--c-primary-500` | 6.49:1 | The brand, as ink and as fill |

### Hue separation carries the meaning

Always name the space when quoting a hue. In HSL primary sits at 346 and danger at 8, which looks like 338 degrees of separation and is not.

| Family | HSL hue | OKLCH hue |
|---|---|---|
| Primary | 346 | 13 |
| Danger | 8 | 32 |
| Success | 124 | 144 |
| Info | 198 | 229 |

Perceptually the two reds are 18 degrees apart, so the separation rests on the ratio and the label rather than on the hue.

### Each family needed its own treatment

| Family | Why one recipe fails | What Paper does |
|---|---|---|
| Info | 17 percent saturated in dark, so darkening alone yields a grey | Saturation rises to 46 percent |
| Success | Carries the most luminance per unit saturation | Lands at 28 percent lightness, the lowest of the four inks |
| Gold | Slides to brown as lightness falls | Saturation rises from 66 to 78 percent |
| Crimson | Already sits at the brand position | Keeps 346 degrees at 66 percent |

The brand rung is the one value both themes share exactly. Dark calls it `--c-primary-700` and Paper calls it `--c-primary-500`, and both resolve to the same three bytes.

### Elevation inverts

A light theme runs out of lightness headroom fast. Raised becomes a white sheet on a warm desk, and inset goes darker than the page rather than lighter.

| Role | Dark | Paper |
|---|---|---|
| Raised | Lighter than the canvas | A near-white sheet above it |
| Inset | The canvas value itself | One step darker than the canvas |
| Chip | Lighter than the raised plane | Darker than the canvas |

## What Paper had to solve on its own

### The nine row highlights

The nine fill strings are persisted in request metadata, so the dark values cannot change. Paper gets its own nine, derived by optimisation rather than by tinting the dark set.

| Vision | Worst-case pair, CIE76 |
|---|---|
| Normal | 9.0 |
| Deuteranopia | 7.9 |
| Protanopia | 6.2 |

The tightest pair in the shipped nine measures 2.4. A second family, `--c-highlight-swatch-*`, splits the icon foreground from the row fill, because the Paper fills are far too pale to carry an icon.

In dark that swatch token resolves to the fill itself, so nothing moves there.

### The syntax palette

The Paper syntax colours were solved for pair separation, not translated from the dark set. Every co-occurring pair was measured under three vision models.

| Vision | Worst-case pair, CIE76 | Against the 12.3 target |
|---|---|---|
| Normal | 26.3 | Met |
| Protanopia | 17.0 | Met |
| Deuteranopia | 9.4 | Not met |

The comment in `theme.light.css` claims the target holds under all three. It holds for normal and protanopic vision, and deuteranopia is a known limit of this palette.

### Control boundaries

The prebuilt preset paints light control borders at 1.51:1, and WCAG 1.4.11 needs 3:1. Only a layer ordered after `c-utilities` can beat a Tailwind utility, so `c-overrides` restates them, keyed on `data-pc-*` attributes rather than on the preset's class strings.

| Plane | `--c-line-control` measured on it |
|---|---|
| Raised | 4.13:1 |
| Canvas | 3.65:1 |
| Inset | 3.09:1 |

The same layer repairs PanelMenu, which the preset paints with `bg-surface-800` and no light value. In the Paper ramp surface 800 is body ink, so the navigation rendered as a dark slab.

### Cues that are not colour

Some affordances survive on dark by opacity alone and disappear on paper, so Paper gives each of them a second channel.

| Affordance | Dark | Paper |
|---|---|---|
| Magnetic connection | Opacity alone | A `4 4` dash |
| Editor tooltip border | None, the base rule sits on the light branch | A real hairline |
| Shadow | The preset's opaque `rgb(1 4 9)` | Warm `rgb(60 45 32)` with a real alpha |
| Ghost opacity | 0.15 | 0.4 |
| Confetti | Six bright literals | Each hue dropped to a 700-weight ink |

## Reading the values

Every colour on this page is read out of the product by the extractor, so these tables cannot drift from what ships. Search a role name to see both themes at once.

<TokenSearch />
