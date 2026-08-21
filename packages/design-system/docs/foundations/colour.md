---
outline: false
pageClass: wide
---

# Colour

Two themes. Dark is the palette Caido has always shipped, unchanged. Light is Paper, built to sit beside it without moving a single dark value.

<PageTabs :tabs="['Overview', 'Rules', 'Reference']">

<template #overview>

### Neutrals

Fourteen rungs, every one at hue 30 to 32 degrees. Chroma falls from 40 percent to an 11 percent floor at rungs 500 and 600, then holds at 12.

<Ramp family="surface" />

### Brand

Crimson is the mark and the primary action. Gold is the accent Caido actually uses: measured in the product, gold appears 57 times against crimson's 4, and crimson is never used as text.

<Ramp family="primary" />
<Ramp family="secondary" />

### Status

Danger, success and info. Each family was re-anchored separately, because a uniform darkening does not work across hues.

<Ramp family="danger" />
<Ramp family="success" />
<Ramp family="info" />

</template>

<template #rules>

### How this palette was made

Three competing directions were generated, warm paper, linen and brand forward, then scored by three independent lenses: contrast, brand coherence and implementability. The winner was synthesised from that scoring and then verified. Two sets, the row highlights and the syntax palette, were derived separately by explicit optimisation.

This matters more than a list of hexes. It tells you how to extend the palette rather than guess at it.

### Derive, do not invent

No colour starts from scratch when an existing Caido colour can parent it. The canvas `#F3EEE8` descends from isabelline `#EDEAE8`, a neutral already in the brand, warmed and lifted rather than inherited unchanged: 16 degrees of hue distance in OKLCH and slightly more chroma.

### One hue family for every neutral

All fourteen neutral rungs sit at 30 to 32 degrees. A neutral black placed beside a 32 degree canvas reads as dirt, not as grey, so there is no cool grey anywhere in the light theme.

<DoDont do="Keep every neutral rung on one warm hue." dont="Mix a cool grey into a warm canvas. It reads as dirt.">
  <template #do>
    <div class="flex gap-2">
      <span class="h-12 w-12 rounded-md bg-[#F3EEE8]" /><span class="h-12 w-12 rounded-md bg-[#C1B5A9]" /><span class="h-12 w-12 rounded-md bg-[#453D36]" />
    </div>
  </template>
  <template #dont>
    <div class="flex gap-2">
      <span class="h-12 w-12 rounded-md bg-[#F3EEE8]" /><span class="h-12 w-12 rounded-md bg-[#B0B4BA]" /><span class="h-12 w-12 rounded-md bg-[#3A3F47]" />
    </div>
  </template>
</DoDont>

### The ramp is split by role, not by lightness

A rung never does two jobs. That is what stops a background and its text collapsing into each other as the theme changes.

| Rungs | Role |
|---|---|
| 0 to 150 | Planes: canvas, raised, inset |
| 200 to 350 | Lines and control boundaries |
| 400 to 950 | Ink |

### Contrast budget decides re-anchoring, not taste

This is the load-bearing rule. A colour that cannot clear its floor at the lightness its role needs gets re-anchored, and the original value is kept at whatever rung it can still serve.

Measured on the canvas `#F3EEE8`:

| Token | Value | On canvas | Verdict |
|---|---|---|---|
| `--c-secondary-300` | `#DAA049` | **2.00:1** | Fills only, cannot be text |
| `--c-secondary-500` | `#845210` | **5.70:1** | The gold ink |
| `--c-danger-400` | `#B12F1B` | **5.53:1** | Clears AA |
| `--c-info-400` | `#2F677F` | **5.41:1** | Clears AA |
| `--c-success-400` | `#246B28` | **5.67:1** | Clears AA |
| `--c-primary-500` | `#A1213F` | **6.49:1** | Clears AA |

Gold is the clearest case. Di-serria at its own lightness is 2:1 on paper, so it stayed at rung 300 for fills and the family was re-anchored so its ink rung clears AA.

<DoDont do="Re-anchor the family and keep the original at a fills-only rung." dont="Use the brand gold as text. It measures 2.00:1 on paper.">
  <template #do>
    <span class="rounded-md bg-[#F3EEE8] px-3 py-2 text-body font-semibold text-[#845210]">Warning</span>
  </template>
  <template #dont>
    <span class="rounded-md bg-[#F3EEE8] px-3 py-2 text-body font-semibold text-[#DAA049]">Warning</span>
  </template>
</DoDont>

### Hue separation so meaning survives

Destructive must never collide with the brand wine. In HSL the families sit at primary 346, danger 8, success 124 and info 198 degrees.

Measured perceptually the separation is smaller than those numbers suggest, because HSL degrees are not perceptual degrees. In OKLCH: primary 13, danger 32, success 144, info 229. So primary to danger is **18 degrees perceptual**, not the 338 the HSL figures imply. The separation is real and it works, but quote the space when quoting the number.

### Each family needs its own treatment

Darkening uniformly does not work, because hues do not carry luminance equally.

| Family | Problem | Treatment |
|---|---|---|
| Info | Pewter blue is only 17 percent saturated, so darkening alone yields a grey indistinguishable from `surface-600` | Saturation raised as well |
| Success | Green carries the most luminance per unit saturation | The deepest lightness drop of any family |
| Gold | Loses identity and slides to brown when darkened | Saturation raised from 66 to 76 percent while holding hue |

### Elevation inverts

In dark, raised is lighter than the void. On paper, raised is a white sheet on a warm desk, separated by a border and a shadow, because a light theme runs out of lightness headroom almost immediately.

<DoDont do="Let inset go darker than the page and lift raised with a border." dont="Flip the dark relationship mechanically. Inset ends up lighter than its own page.">
  <template #do>
    <div class="rounded-md bg-[#F3EEE8] p-4">
      <div class="rounded-sm border border-[#C1B5A9] bg-[#E2DCD4] px-3 py-2 text-body text-[#221F1B]">Input</div>
    </div>
  </template>
  <template #dont>
    <div class="rounded-md bg-[#F3EEE8] p-4">
      <div class="rounded-sm bg-[#FDFDFB] px-3 py-2 text-body text-[#221F1B]">Input</div>
    </div>
  </template>
</DoDont>

### Dark must not move

The constraint that shaped the structure more than any colour preference. Every alias carries a dark value byte-identical to the rung it replaced, so existing users see nothing change.

### The two derived sets

**Row highlights.** A luminance ladder, then the ordering brute-forced to maximise the worst-case separation under simulated deuteranopia and protanopia, following Viénot 1999.

Measured worst case across the nine tags: **9.0 CIE76 at normal vision, 7.9 under deuteranopia, 6.2 under protanopia.** All nine stay nameable side by side.

**Syntax.** Every pair that can co-occur in one document is separated deliberately. Measured worst case: **26.3 at normal vision, 17.0 under protanopia, 9.4 under deuteranopia.** The stated 12.3 target holds for normal and protan vision; deuteranopia falls below it and is a known limit rather than a guarantee.

### One bug, not a colour choice

The primary crimson correction was a rung-mapping fault, not a design decision. The preset hardcodes `primary-700`, and the two ramps carry the brand at different rungs.

</template>

<template #reference>

Every token, both themes, read directly from the product. The values below are extracted from `tokens.css` and `theme.light.css`, so this page cannot drift from what ships.

<TokenSearch />

</template>

</PageTabs>
