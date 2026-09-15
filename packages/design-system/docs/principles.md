---
title: Principles
---

# Principles

Five rules made Paper, the light theme that now sits beside the dark palette Caido has always shipped. They are why the light theme could be added without moving a single dark value, and why a reviewer can reject a colour without arguing about taste.

Every number on this page is measured against `theme.light.css` and `tokens.css` as they ship. Contrast is WCAG 2.2 on the Paper canvas unless a row names another plane.

| Principle | Break it and |
|---|---|
| Derive, do not invent | The value has no parent, so nobody can extend the palette later |
| The contrast budget decides re-anchoring | A colour that read well as a fill ships as text nobody can read |
| One hue family, one job per rung | A cool grey lands on a warm canvas and reads as dirt |
| Colour is never the only cue | Two states collapse into one for a reader who cannot separate the hues |
| Dark must not move | Every screen in the product changes to pay for a theme it never asked for |

## Derive, do not invent

Nothing in Paper starts from scratch when an existing Caido colour can parent it. The page canvas descends from `--isabelline`, the ink the dark theme puts on a card, sitting 16 degrees away in OKLCH hue with a little over twice the chroma.

<Swatches :tokens="[
  { name: '--isabelline', hex: '#EDEAE8', job: 'card ink in dark, and the parent' },
  { name: '--c-surface-100', hex: '#F3EEE8', job: 'the Paper page canvas' }
]" caption="The parent above, the canvas it produced below." />

The gold fill rung is `--di-serria` at the value the product already ships, so the accent Caido actually uses stays the accent rather than being restyled for paper.

Three directions were generated first: warm paper, linen and brand forward. Each was scored by three lenses, contrast, brand coherence and implementability, and the winner was synthesised and then verified rung by rung. The row highlights and the syntax palette were derived separately by explicit optimisation.

Break it and the palette stops being extendable. A rung with a stated parent can be reproduced by anyone; a rung chosen by eye can only be defended by the person who chose it.

## The contrast budget decides re-anchoring

This is the load-bearing rule. A rung moves to a new position when the measured floor says it must, and the position it lands on is the one the budget allows.

| Token | On the canvas | What it may do |
|---|---|---|
| `--c-secondary-300` | 2.00:1 | Fills only. It can never be text |
| `--c-secondary-400` | 5.43:1 | The gold ink, and `--c-fg-secondary` |
| `--c-secondary-500` | 5.70:1 | Gold ink solved for the inset plane |
| `--c-danger-400` | 5.53:1 | Error ink, fill and border |
| `--c-info-400` | 5.41:1 | Info ink, fill and border |
| `--c-success-400` | 5.67:1 | Success ink, fill and border |
| `--c-primary-500` | 6.49:1 | The brand, as ink and as fill |

One recipe does not port across hues, so each family paid the budget in its own way.

| Family | Why one recipe fails | What Paper does |
|---|---|---|
| Info | 17 percent saturated in dark, so darkening alone yields a grey | Saturation rises to 46 percent |
| Success | Carries the most luminance per unit of saturation | Drops to 28 percent lightness, the lowest of the four inks |
| Gold | Slides towards brown as lightness falls | Saturation rises from 66 to 76 percent |
| Crimson | Already sits at a usable position in dark | Keeps 346 degrees at 66 percent |

Break it and a colour that looked correct as a fill gets reused as text. Gold at rung 300 is the case to remember: it reads well behind a label and measures 2.00:1 in front of one.

<DoDont
  do="Muted ink on the Paper canvas, measured at 5.66 to one."
  dont="Line tone on the Paper canvas, measured at 1.33 to one."
  mode="light">
  <template #do>
    <div class="rounded-md bg-canvas px-4 py-3 text-body text-ink-muted">14 requests queued</div>
  </template>
  <template #dont>
    <div class="rounded-md bg-canvas px-4 py-3 text-body text-separator">14 requests queued</div>
  </template>
</DoDont>

## One hue family, one job per rung

All fourteen neutral rungs sit between 30 and 32 degrees of hue, so Paper carries no cool grey anywhere. A neutral black placed beside a 32 degree canvas reads as dirt rather than as grey.

Saturation falls from 40 percent at the raised plane to 11 percent at the muted ink, then rises to 12 percent and holds through the darkest rungs.

<Ramp family="surface" />

The ramp is split by role rather than by lightness, and a rung never does two jobs.

| Range | Job | Rungs in it |
|---|---|---|
| 0 to 150 | Planes | Raised, zebra, canvas, inset |
| 200 to 350 | Lines and controls | Edge, divider, control boundary |
| 400 to 950 | Ink | Placeholder, muted, body, headings, max emphasis |

Elevation inverts inside the plane band. Dark raises by getting lighter and its inset is the canvas value itself, while Paper raises to a near-white sheet on a warm desk and sends the inset darker than the page, because a light theme runs out of lightness headroom fast.

Break it and a rung gets reused into a role its contrast was never solved for. That is how a divider tone ends up carrying a caption.

## Colour is never the only cue

Every status, tag, selected row and disabled control carries a second channel: a glyph, a label, a dash or a plane of its own. WCAG 2.2 SC 1.4.1 is Level A, and no palette meets it alone.

Hue distance is the first place this argument goes wrong, so always name the space when quoting one.

| Family | HSL hue | OKLCH hue |
|---|---|---|
| Primary | 346 | 13 |
| Danger | 8 | 32 |
| Success | 124 | 144 |
| Info | 198 | 229 |

Primary and danger look 338 degrees apart in HSL and are 18 degrees apart perceptually, so their separation rests on the contrast ratio and the label instead.

Where colour had to carry meaning on its own, the set was solved by optimisation and then measured under three vision models.

| Set | Normal | Protanopia | Deuteranopia |
|---|---|---|---|
| Row highlights, worst pair CIE76 | 9.0 | 6.2 | 7.9 |
| Syntax, worst pair CIE76 | 26.3 | 17.0 | 9.4 |

The first light fills came out at 2.4 for the tightest highlight pair, which is why the nine were re-derived rather than tinted from the dark set. The syntax comment in `theme.light.css` claims 12.3 under all three models: it holds for normal and protanopic vision, and deuteranopia is a known limit of the palette.

Paper adds a second channel wherever dark got one for free. The swatch family `--c-highlight-swatch-*` splits the icon ink from the row fill, the magnetic connection gains a `4 4` dash where dark used opacity alone, and ghost opacity rises from 0.15 to 0.4.

Break it and two states read as one. A component that renders a status colour without its icon token and an accessible label is a conformance failure and fails review.

<DoDont
  do="Shape and word carry the state, and colour reinforces it."
  dont="Colour alone, so the two states carry no shape and no word.">
  <template #do>
    <div class="flex gap-6 text-body text-ink">
      <span class="inline-flex items-center gap-2"><i class="fas fa-circle-exclamation text-danger-ink" aria-hidden="true"></i>Error</span>
      <span class="inline-flex items-center gap-2"><i class="fas fa-circle-check text-success-ink" aria-hidden="true"></i>Passed</span>
    </div>
  </template>
  <template #dont>
    <div class="flex gap-6 text-body text-ink">
      <span class="inline-flex items-center gap-2"><i class="fas fa-circle text-danger-ink" aria-hidden="true"></i></span>
      <span class="inline-flex items-center gap-2"><i class="fas fa-circle text-success-ink" aria-hidden="true"></i></span>
    </div>
  </template>
</DoDont>

## Dark must not move

Every alias introduced for Paper carries a dark value byte-identical to the rung it replaced, so the swap is a no-op in dark by construction rather than by review. This constraint shaped the token structure more than any colour preference did.

The preservation tokens reproduce today's literals byte for byte, and seven rungs were added to `tokens.css` so light-only consumers have a name to reach for: two on primary and five on surface. Surface 50 and 100 carry the hardcoded `--p-surface-50` and `--p-surface-100` values verbatim.

That is what lets a component name a role instead of a rung. There are 139 semantic tokens carrying both themes, so `bg-raised` and `text-ink` resolve correctly in each and one piece of markup serves both.

<DoDont
  do="Name the surface and the ink, so one markup serves both themes."
  dont="Reuse the on-emphasis ink on a card, where both are surface 0."
  mode="light">
  <template #do>
    <div class="rounded-md bg-raised px-4 py-3 text-body text-ink">Send request</div>
  </template>
  <template #dont>
    <div class="rounded-md bg-raised px-4 py-3 text-body text-ink-onsolid">Send request</div>
  </template>
</DoDont>

Break it and the second theme costs the first one. The values behind every rule here are in [Colour](/foundations/colour), the full token list is in [Tokens](/tokens), and [What changed](/changelog) records the whole move with both themes side by side.
