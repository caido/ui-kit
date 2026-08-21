# Appendix: the typeface upgrade

<Preview mode="dark">
  <DsAlert
    intent="warning"
    summary="Proposed. Not adopted. Not scheduled."
    detail="The stack in force is Arial for the UI and Courier New for the mono surfaces. This appendix is the record of the case, not a plan to act on it." />
</Preview>

**Status: proposed, not adopted.** The system ships, and continues to ship:

```css
--c-font-family-base: Arial, sans-serif;
--c-font-family-mono: "Courier New", monospace;
```

The case worth recording is one argument: Courier New carries no glyph-level defence against confusable characters, and it renders inside the size band *Unicode Technical Report #36* scopes as dangerous.

For a tool whose users read attacker-chosen bytes, that is a correctness defect rather than a styling preference. [Selection rules for a monospace face](#selection-rules-for-a-monospace-face) carries the measurements.

The [typography foundation](/foundations/typography) is complete on the current stack. A face swap changes which glyphs fill the boxes, not the boxes themselves. The ramp, line boxes, weights, role tokens and scale unit all land on Arial and Courier New unmodified.

## What this appendix settles

Four rules are in force whatever face renders. One question is deferred.

- **Selection rules.** What a candidate UI face and a candidate mono face must satisfy to be eligible. [UI](#selection-rules-for-a-ui-face), [mono](#selection-rules-for-a-monospace-face).
- **[Ligature policy](#ligature-policy).** Programming ligatures off in every byte-auditing surface, whichever mono face is in place. In force today.
- **[Tabular figures](#tabular-figures).** Mandatory on numeric columns, shipped in the same release as any proportional-figure face.
- **[Licensing](#licensing).** Only OFL 1.1 or equivalent, with no Reserved Font Name, for a self-hosted desktop bundle.
- **Deferred.** Whether to adopt the two candidate faces at all. See [Adoption sequence](#adoption-sequence-and-acceptance-tests).

The two candidates that satisfy the rules are **Inter Variable** for the UI and **JetBrains Mono NL** for the request, response and hex viewers.

Every metric below was read from the font binaries, not from vendor copy. The binaries: the shipping macOS system faces, `InterVariable.woff2` name table `Version 4.001;git-9221beed3`, and the JetBrains Mono 2.304 release archive.

## Font metrics used here

Six measurements decide every rule on this page.

```
  4  ascender    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    ▲
                       ┌───┐                                │
  3  cap height  ──────┤ H │───┬───┐───────────────────     │   4  default
  2  x-height    ──────┤   │   │ x │───────────────────     │      line box
     baseline    ──────┴───┴───┴───┴───────────────────     │
                                                            │
  4  descender   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    ▼

                 │◄── 5 ──►│
                  advance width       1  unitsPerEm: the grid all of it is counted in
                                      6  USE_TYPO_METRICS: which metric set wins
```

Vertical metrics, numbered: 1 em grid, 2 x-height, 3 cap height, 4 ascender, descender and line box, 5 advance width, 6 `USE_TYPO_METRICS`.

| # | Part | What it is | What it governs |
|---|---|---|---|
| 1 | **unitsPerEm** | The design grid every other number is counted in. 2048 for Arial, Courier New and Inter; 1000 for JetBrains Mono. | Makes two faces comparable once each measure is divided by it. |
| 2 | **x-height** | Height of lowercase `x` above the baseline. | Apparent size and legibility at 12 to 14px. Rules U-3, M-3. |
| 3 | **cap height** | Height of `H` above the baseline. | Optical alignment of text against icons and rules. |
| 4 | **ascender, descender, line box** | Ascent plus descent plus gap, taken from the `typo`, `hhea` or `win` metric set. | The default line box, so row height in every virtualised table. Rules U-1, M-5. |
| 5 | **advance width** | The cell width one glyph occupies, side bearings included. | Characters per line in the raw viewers, and column alignment. Rules U-2, M-4. |
| 6 | **USE_TYPO_METRICS** | `fsSelection` bit 7. Set means the `typo` set is authoritative. | Whether the line box is the same number on macOS, Windows and Linux. |

## Selection rules for a UI face

A candidate UI face is eligible only if it satisfies all six rules. They are ordered by weight.

| # | Rule | Why |
|---|---|---|
| U-1 | `USE_TYPO_METRICS` set, and the `typo`, `hhea` and `win` metric sets identical | The default line box must be the same number on macOS, Windows and Linux. A virtualised table computes row arithmetic from a line height. |
| U-2 | Uniform digit advances, or a `tnum` feature that produces them | Numeric columns are the primary reading surface. See [Tabular figures](#tabular-figures). |
| U-3 | x-height at or above 0.53 em | Apparent size in a dense UI is governed by x-height, not by em size. |
| U-4 | An `opsz` axis whose default is the base size, or a face drawn for it | A display cut rendered at 14px has too little spacing and too fine a joint. |
| U-5 | A continuous `wght` axis | The dark-theme irradiation compensation is a fractional weight change. |
| U-6 | A `zero` feature reaching a slashed or dotted zero | `0` against `O` appears in IDs, hashes and ports throughout the UI chrome, not only in the viewers. |

### Why Arial fails

Arial fails two of the six. It is a competent grotesque and is not the problem the monospace side is.

| Measure, at unitsPerEm 2048 | Arial | Verdict |
|---|---|---|
| x-height | 1062 = 0.5186 em | U-3 passed |
| cap height | 1467 = 0.7163 em | reference |
| digit advances | uniform at 1139 for all ten | U-2 passed by construction, and load-bearing. See [Tabular figures](#tabular-figures) |
| `fvar` | **absent** | **U-5 failed** |
| `USE_TYPO_METRICS` | **not set**. `typo` line box 1.0884 em against `hhea` 1.1499 em | **U-1 failed by 5.65%** |

Arial also fails a rule that cannot be measured: it was never chosen. It is the first entry of a list sourced from a coverage table of websafe faces. It carries no optical size, no disambiguation feature set and no design intent aimed at a 14px dense UI.

Every tool in the same density band runs a purpose-built UI face, and so does every design system in the benchmark set:

- Carbon on IBM Plex Sans.
- Material 3 on Roboto.
- Primer on the platform stack, with explicit `font-feature-settings` applied.

**The pure platform stack fails U-1 and U-2 together.** Measured against the macOS system binary, it has an x-height of 0.508 em and **proportional** digits with advances spanning 908 to 1264 units.

A 14/18 table row is therefore a different optical density on each of the three target platforms, and its numeric columns are ragged before any CSS is written. For a tool whose value is reading data in fixed columns, a zero-byte stack does not offset that.

### What Inter Variable measures

```
unitsPerEm      2048          numGlyphs 2937          cmap 2852
x-height        1118 = 0.5459 em          cap height 1490 = 0.7275 em
typo/hhea/win   asc 1984, desc -494, gap 0   → line box 1.2100 em on every platform
USE_TYPO_METRICS   set
fvar axes       opsz  14.0 → 32.0  (default 14.0)
                wght 100.0 → 900.0 (default 400.0)
GSUB            aalt calt case ccmp cv01–cv14 dlig dnom frac locl numr ordn
                pnum salt sinf ss01–ss08 subs sups tnum zero
digit advances  1292 833 1249 1265 1323 1215 1270 1159 1267 1270   ← proportional by default
tabular (.tf)   61 glyphs; all ten digits at 1328 = 0.6484 em; brackets and braces at 800
zero.slash      present in the glyph order
```

| Rule | Verdict | Evidence |
|---|---|---|
| U-1 | passed | `USE_TYPO_METRICS` set, three metric sets identical at 1984 / −494 / 0, line box 1.2100 em on all three platforms |
| U-2 | passed conditionally | Default figures are proportional. `tnum` remaps all ten digits to `.tf` at a uniform 0.6484 em. See [Tabular figures](#tabular-figures) |
| U-3 | passed | 0.5459 em against Arial's 0.5186 em, **+5.27%**. At 14px, Inter's lowercase measures 7.64px against Arial's 7.26px |
| U-4 | passed exactly | `opsz` 14.0 to 32.0, default **14.0**, which is the base size the ramp anchors on |
| U-5 | passed | `wght` continuous 100 to 900. The only property here that changes what the type system can do, not how well it looks |
| U-6 | passed | `zero.slash` present in the glyph order and reachable through the `zero` feature |

**Density comes from x-height, not from size.** 14px Inter reads at roughly the apparent size of 14.7px Arial, so density is recovered without changing a single nominal value in the ramp.

**The 14px anchor is not Inter's.** It is set by the convergence of Primer `base.text.size.sm` ("14px, default body text size for UI"), Fluent 2 Body 1 at 14/20, Material 3 `body-medium` at 14/20 and Carbon `bodyCompact01` at 14/18.

`font-optical-sizing: auto` selects the Text cut below roughly 20px and the Display cut above it, from one file.

<DoDont
  mode="dark"
  align="start"
  do="Keep the nominal 14px and buy density from a taller lowercase."
  dont="Shrink to 11px. The whole ramp shrinks and lowercase turns confusable.">
  <template #do>
    <div class="text-dense text-ink">GET /api/v1/users?id=1024</div><div class="text-caption text-ink-muted">14px, taller lowercase</div>
  </template>
  <template #dont>
    <div class="text-[11px] leading-[14px] text-ink">GET /api/v1/users?id=1024</div><div class="text-caption text-ink-muted">11px, same face, ramp cut</div>
  </template>
</DoDont>

### The proposed UI stack

```css
--c-font-family-base:
 "InterVariable", "Inter", -apple-system, BlinkMacSystemFont,
 "Segoe UI Variable Text", "Segoe UI", Roboto, "Helvetica Neue",
  Arial, "Noto Sans", sans-serif,
 "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```

Arial stays in the stack. **Rule: the last non-generic entry of a fallback chain must be the face the product ships today.** A load failure then degrades to the familiar product, not to an unfamiliar one.

| Rule | Cost if ignored |
|---|---|
| Never hardcode a webfont family into `--c-font-family-base`. The UI family is a user-selectable setting, and an adopted face becomes its default entry. | A hardcoded family silently removes a user setting. |
| Verify `USE_TYPO_METRICS` and the three metric sets in the binary before adopting any UI face. | The rasteriser owns the line box, row height becomes a per-platform variable, and every virtualised list inherits the drift. |
| Keep the incumbent face in the fallback chain ahead of the generic keyword. | A blocked webfont drops the UI onto whatever the browser calls `sans-serif`, which is a different metric on each platform. |
| Treat x-height, not nominal size, as the density lever. | A face with 5% more x-height buys the same apparent density as a size bump, without touching the ramp. |
| Never adopt the pure platform stack for a data-dense tool. | Its digits are proportional and its metrics differ per platform, so numeric columns go ragged and row density changes per OS. |
| Never accept a face without a continuous `wght` axis where the dark theme needs optical compensation. | Fractional weights snap to the nearest static instance and the declaration becomes a no-op that reads as applied. |
| Never pick a display-drawn face for a 14px UI. | Spacing tuned for headlines closes up at UI size, and joints drawn for large rendering fill in. |

## Selection rules for a monospace face

**Glyph disambiguation in a byte-auditing surface is a correctness property, and a named standard says so.**

### The standard

*Unicode Technical Report #36, Unicode Security Considerations* defines the problem and states the requirement. Verbatim, from the stabilised revision `tr36-15`:

- §2: visually confusable strings are "two different strings of Unicode characters whose appearance in common fonts in small sizes at typical screen resolutions is sufficiently close that people easily mistake one for the other".
- §2: the band is "fonts whose ascent plus descent is from 9 to 12 pixels for most scripts, and somewhat larger for scripts, such as Japanese".
- §2.4: "on the computer used to write this document, roughly 30% of the fonts display glyphs that are essentially identical".
- §2.11.2: "Use distinctive fonts, where possible".
- §2.11.2: "Use a size that makes it easier to see the differences in characters. Disallow the use of font sizes that are so small as to cause even more characters to be visually confusable."

**Sourcing note.** UTR #36 was stabilised in 2014 and is no longer maintained. The Unicode Consortium now points to UTS #39, UTS #55 and UAX #31, so re-check UTS #39 for superseding language before quoting UTR #36 in shipped documentation. The stabilised revision remains the citable text.

**Why this binds a proxy tool and not a text editor.** The viewers render bytes an adversary chose: hostnames, `Host` and `Origin` values, JWT payloads, base64 blobs, injected parameters, redirect targets. The user's task is to decide whether what is on screen is what they think it is.

Each of these is a finding missed or a false positive chased:

- A homoglyph in a hostname.
- A `1` where an `l` was expected inside a token.
- An `O` that is a `0` inside a hash.

The face is part of the detection path.

<DoDont
  mode="dark"
  align="start"
  do="A dotted zero: 0 and O separate at 13px, with no CSS."
  dont="Courier New draws 0 and O as the same two contours. The reader guesses.">
  <template #do>
    <div class="font-[ui-monospace,Menlo,Consolas,monospace] text-[26px] tracking-[2px] text-ink">0O0O 1lI</div><div class="font-[ui-monospace,Menlo,Consolas,monospace] text-code tracking-[1px] text-ink">a0f3O91b0Oe4 1lI|</div><div class="text-caption text-ink-muted">Disambiguated zero, in the default glyph</div>
  </template>
  <template #dont>
    <div class="font-mono text-[26px] tracking-[2px] text-ink">0O0O 1lI</div><div class="font-mono text-code tracking-[1px] text-ink">a0f3O91b0Oe4 1lI|</div><div class="text-caption text-ink-muted">Courier New: 0 and O are 2 contours each</div>
  </template>
</DoDont>

### The eligibility rules

| # | Rule | Why |
|---|---|---|
| M-1 | The default `zero` glyph carries a dot or a slash, with no feature flag required | A disambiguation that depends on a CSS declaration surviving every downstream override is not a disambiguation. |
| M-2 | `1`, `l` and `I` differ in contour, not only in width | Width alone fails at 12px and fails harder on a low-DPI display. |
| M-3 | x-height at or above 0.52 em | UTR #36 §2.11.2 requires a size that makes differences visible. Lowercase height is what that means in practice. |
| M-4 | Advance width 0.60 em ± 0.5% against the incumbent | The characters-per-line count of every raw view must not change. |
| M-5 | `USE_TYPO_METRICS` set, metric sets identical | Same reason as U-1, and the hex viewer is the most line-height-sensitive surface in the product. |
| M-6 | Ligatures either absent from the binary or disableable in a way no override can undo | See [Ligature policy](#ligature-policy). |

### Why Courier New fails

Courier New fails M-1, M-2, M-3 and M-5.

| Measure, at unitsPerEm 2048 | Courier New | Verdict |
|---|---|---|
| x-height | 866 = **0.4229 em** | **M-3 failed** |
| cap height | 1170 = 0.5713 em | reference |
| advance | 1229 = 0.6001 em, every glyph | M-4 reference for any replacement |
| `typo` metrics | 1255 / −386 / 0, line box 0.8013 em | **M-5 failed** |
| `hhea` metrics | 1705 / −615 / 0, line box 1.1328 em | **M-5 failed** |
| `USE_TYPO_METRICS` | `fsSelection` bit 7 **not set** | **M-5 failed** |
| GSUB features | `ccmp dlig fina init isol liga locl medi rlig` | **M-1, M-2 failed. No `zero`, no `tnum`, no `ss*`, no `cv*`** |

### Courier New has no zero-versus-O defence in the binary

**Was:** `zero` and `O` both have 2 contours, an outer bowl and a counter, with no dot or slash. The only separation is ink width, `0` at 771 units (0.3765 em) against `O` at 1024 units (0.5000 em), in the same 0.6001 em cell.
**Cost:** A pentester reading attacker-controlled bytes cannot separate `0` from `O` in a hash, a token or a hostname.
**Now:** Require a dotted or slashed default zero of any mono face on a byte-auditing surface.
**Do:** No action needed. There is no switch to turn on, so no configuration can fix this face.

### Courier New renders inside the confusable size band

**Was:** x-height 0.4229 em puts lowercase at 5.18px at a 12.25px render and 5.92px at 14px, and ascent plus descent of 1641/2048 = 0.8013 em puts the text at 9.82px and 11.22px at those sizes.
**Cost:** Both renders sit inside the 9-to-12-pixel band UTR #36 §2 scopes as confusable, on the surface where a pentester reads attacker-controlled bytes.
**Now:** Require x-height at or above 0.52 em, and check ascent plus descent against that band.
**Do:** No action needed.

### Courier New's default line box is undefined

**Was:** With `USE_TYPO_METRICS` unset, the rasteriser derives the default line box from either metric set: `hhea` gives 1.1328 em, `OS/2` typo gives 0.8013 em, a factor of 1.414 apart.
**Cost:** Row height in the hex viewer differs by **41%** depending on which set the platform picks.
**Now:** Require `USE_TYPO_METRICS` set with identical metric sets (M-5).
**Do:** No action needed.

### What JetBrains Mono NL measures against it

| Pair | Courier New | JetBrains Mono NL |
|---|---|---|
| `0` vs `O` | 2 contours each, identical topology, separated only by ink width 0.3765 em vs 0.5000 em | `zero` carries a **third contour**: a closed 120 × 114 unit dot in the counter, x 240–360, y 310–424. `O` has 2 contours. |
| `1` vs `l` vs `I` | ink widths 772 / 857 / 772 units, 1 contour each, all full-height serifed stems | ink widths 450 / 520 / 390 units. `l` carries a tail, `1` a flag and base, `I` bare serifs |
| `,` vs `.` | comma 422 × 602 units, period 308 × 271 | comma 163 × 306, period 164 × 162. The comma descends to −160 against the period's −10 |
| `:` vs `;` | 308 × 896 vs 456 × 1080 | 166 × 570 vs 180 × 720 |
| `rn` vs `m` | no alternate available | `cv06` supplies an alternate `m` addressing the collision directly, in the standard build only |

**Dotted or slashed is settled by measurement.** The default `zero` is dotted: contour 2 is a closed blob 120 units wide by 114 tall in the middle of the counter.

The `zero` feature's alternate, `zero.zero`, replaces the single 596-unit counter with two 414-unit contours offset diagonally (y 249–663 and y 67–481). That is the signature of a slash cutting the counter in two.

Both forms are in the binary. M-1 is satisfied by the default glyph, which is what makes the NL build viable at all.

**M-4: the horizontal trade is zero.**

| | advance width | x-height |
|---|---|---|
| Courier New | 1229/2048 = **0.6001 em** | 866/2048 = 0.4229 em |
| JetBrains Mono NL | 600/1000 = **0.6000 em** | 550/1000 = **0.5500 em** |
| delta | −0.016% | **+30.1%** |

Measured on `JetBrainsMonoNL-Regular.ttf` 2.304, the advance is 600 units for every non-zero-width glyph at unitsPerEm 1000. The cell is the same cell: characters per line in every raw view is unchanged to four decimal places, and the lowercase gains 30.1% of its height. At 13px, 5.50px of lowercase becomes 7.15px.

JetBrains states the design intent for exactly this trade (jetbrains.com/lp/mono): "While characters remain standard in width, the height of the lowercase is maximized. This approach keeps code lines to the length that developers expect, and it helps improve rendering in small size, since each symbol occupies more pixels."

**M-5:**

| | typo | hhea | win | `USE_TYPO_METRICS` | default line box |
|---|---|---|---|---|---|
| Courier New | 1255 / −386 / 0 | 1705 / −615 / 0 | 1705 / 615 | not set | 0.8013 em or 1.1328 em |
| JetBrains Mono NL | 1020 / −300 / 0 | 1020 / −300 / 0 | 1020 / 300 | **set** | **1.3200 em everywhere** |

### What the NL build costs

The NL build is a separate binary with a different table set, not a configuration of the standard build. The difference is larger than the name suggests.

| | JetBrainsMono-Regular 2.304 | JetBrainsMonoNL-Regular 2.304 |
|---|---|---|
| tables | includes `GSUB`, `GPOS` | `GDEF` only. **No `GSUB`, no `GPOS`** |
| numGlyphs | 1743 | 1590 |
| cmap entries | not measured | 1363 |
| GSUB features | `aalt calt case ccmp cv01–cv12 cv14–cv20 cv99 frac locl ordn sinf ss01 ss02 ss19 ss20 subs sups zero` | none |

**Choosing NL removes the `zero` feature along with the ligatures.** The `zero.zero` slashed alternate is still in the NL glyph order, but with no `GSUB` table there is no lookup that can reach it, and `font-feature-settings: "zero" 1` becomes a no-op. The `cv01`, `cv05` and `cv06` alternates for `l` and `m` go with it.

That trade is acceptable only because the default zero is already dotted, so the disambiguation required sits in the default glyph rather than behind a feature flag. State it rather than discover it later.

**JetBrains publishes no NL webfont.** The 2.304 release contains 16 NL faces as TTF and 16 as OTF, and zero as webfonts. There is no NL variable build either: the variable builds are `JetBrainsMono[wght].ttf` and `JetBrainsMono-Italic[wght].ttf` only.

Adoption means compressing `woff2` in-house from the release TTFs, which is a build task rather than a dependency bump. The subset sizes under [Bundle cost and loading](#bundle-cost-and-loading) come from doing exactly that.

### The proposed mono stack

```css
--c-font-family-mono:
 "JetBrains Mono NL", "JetBrainsMono NL", "JetBrains Mono",
  ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas,
 "DejaVu Sans Mono", "Liberation Mono", monospace;
```

**Courier New is deliberately absent from the mono fallback chain. Rule: a fallback chain must never contain a face that fails the eligibility rule the chain exists to enforce.** Falling back to `ui-monospace` (SF Mono at 0.526 em x-height on macOS, Cascadia on Windows 11) is a better failure than falling back to 0.4229 em.

This is the one place the "keep the incumbent in the chain" rule from [The proposed UI stack](#the-proposed-ui-stack) is overridden, and the override is deliberate: here the incumbent is the defect.

| Surface | Family | Ligatures | Role |
|---|---|---|---|
| Raw HTTP request and response viewer | JetBrains Mono NL | **off** | `code` 13/18 |
| Hex viewer | JetBrains Mono NL | **off** | `code-dense` 12/16 |
| Mono cells in data tables (IDs, hashes, ETags) | JetBrains Mono NL | **off** | `code-dense` 12/16 |
| Inline `<code>` in UI prose | JetBrains Mono NL | **off** | `code-inline` 0.92 em |
| Workflow and script editor | JetBrains Mono, standard build | user setting, default off | `code` 13/18 |

**Runners-up, for the record.** IBM Plex Mono (SIL OFL 1.1, the mono of the Carbon Design System, in the same 0.6 em cell class) is a defensible alternative, as are Fira Code and Source Code Pro. SF Mono is disqualified: it is macOS-only, and Apple's licence does not permit web redistribution.

<DoDont
  mode="dark"
  align="start"
  do="13px inside the 0.6 em cell: the whole line fits."
  dont="17px widens the cell. The right end of the line is clipped.">
  <template #do>
    <div class="w-60 overflow-hidden whitespace-pre rounded-sm bg-inset p-2 font-mono text-code text-ink">GET /api/v1/users?id=1024</div><div class="text-caption text-ink-muted">13px, 0.6000 em cell, line fits</div>
  </template>
  <template #dont>
    <div class="w-60 overflow-hidden whitespace-pre rounded-sm bg-inset p-2 font-mono text-[17px] text-ink">GET /api/v1/users?id=1024</div><div class="text-caption text-ink-muted">17px, wider cell, line clipped</div>
  </template>
</DoDont>

| Rule | Cost if ignored |
|---|---|
| Verify the `zero` and `O` contour counts in the candidate binary before adopting a mono face. | Two contours each means there is no defence to enable, and no CSS can add one. |
| Hold the advance width to the incumbent's within half a percent. | A wider cell silently drops columns from every fixed-width raw view, and the loss appears as horizontal scroll in the surface users read most. |
| Prefer x-height gain over size gain in a mono face. | It raises legibility at the same characters-per-line count, where a size bump costs columns. |
| Never put a face that fails the disambiguation rules into the fallback chain. | A fallback that lands on the defect the change was made to remove converts a load failure into a correctness failure. |
| Never assume a "no-ligatures" build is the same binary with a feature switched off. | A stripped build can lose `zero`, `tnum` and the character-variant alternates with it. Verify the table set. |
| Never rely on a mono face whose disambiguation lives behind a feature flag where a user stylesheet can reach the element. | The default glyph is the only guarantee. |

## Ligature policy

**Programming ligatures are off in every surface where the user is auditing bytes.** This is in force today and does not depend on adopting any face.

**The reason, in the vendor's own words.** JetBrains states that its ligatures exist "to reduce noise by merging symbols and removing details so the eyes are processing less." Merging symbols and removing details is the precise operation a pentester must not have performed on their behalf.

When `!=`, `->`, `=>`, `<=`, `>=`, `::` and `//` collapse into single glyphs, the 1:1 mapping between character and glyph breaks. That mapping is what the reader uses to:

- Count bytes.
- Spot an injected character.
- See that a `//` in a path has something between the slashes.

### Disabling `liga` does not disable the ligatures

**Was:** JetBrains Mono has no `liga` feature in the binary. Every code ligature is implemented through `calt`, contextual alternates.
**Cost:** `font-feature-settings: "liga" 0` is a no-op that reads as a fix, and ligatures keep rendering in the raw viewers.
**Now:** Set `font-variant-ligatures: none` and `font-feature-settings: "calt" 0` together, or ship a build with no `GSUB` table.
**Do:** Replace any `"liga" 0` declaration on a mono surface with both declarations.

Wrong. `liga` is absent from the measured feature list under [What the NL build costs](#what-the-nl-build-costs), so this class is a no-op and ligatures keep rendering:

```html
<pre class="font-mono [font-feature-settings:'liga'_0]">GET /a
```

Correct on a standard build:

```html
<pre class="font-mono [font-variant-ligatures:none] [font-feature-settings:'calt'_0,'zero'_1]">GET /a
```

`font-variant-ligatures: none` disables `liga`, `clig`, `dlig` and `hlig` per the CSS Fonts specification, but it does **not** disable `calt`. That feature is controlled by `font-variant-ligatures: no-contextual`, so setting `"calt" 0` explicitly covers both readings and both engines.

### Prefer the binary to the CSS

A no-`GSUB` build cannot render a ligature under any declaration, any user stylesheet or any fallback face in the chain.

Ligatures stay available, behind a user setting, in the workflow and script editor, because that surface is code reading rather than byte auditing.

| Rule | Cost if ignored |
|---|---|
| Disable ligatures at the binary level when the surface is byte auditing. | A stripped build is the only form of the rule that no override can defeat. |
| Set `font-variant-ligatures: none` and `font-feature-settings: "calt" 0` together on a standard build. | Either one alone leaves a class of ligature rendering in at least one engine. |
| Test the policy by comparing glyph count to character count on `!= -> => <= >= :: // /*`. | Reading the CSS proves nothing. The binary decides. |
| Never let ligatures into a raw request, response or hex surface behind a user preference. | The setting will be on for someone reading a payload, and a merged glyph pair hides an injected byte. |
| Never extend the ban to the script editor. | Byte-for-byte fidelity is not the task there, and the blanket rule costs readability with no correctness gain. |

## Tabular figures

**Rule: a face with proportional default figures may only be adopted in the same release that applies `font-variant-numeric: tabular-nums` to every numeric surface.** Adopting the face first is a measurable regression, not a partial improvement.

Measured digit advances at unitsPerEm 2048:

| Face | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Uniform? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Arial** | 1139 | 1139 | 1139 | 1139 | 1139 | 1139 | 1139 | 1139 | 1139 | 1139 | **yes** |
| **Inter Variable** (default) | 1292 | 833 | 1249 | 1265 | 1323 | 1215 | 1270 | 1159 | 1267 | 1270 | **no** |
| **Inter Variable** (`tnum`) | 1328 | 1328 | 1328 | 1328 | 1328 | 1328 | 1328 | 1328 | 1328 | 1328 | yes |

Inter's widest digit is `4` at 1323 units and its narrowest is `1` at 833. The spread is `1323 / 833 = 1.588`, so **the widest digit is 58.8% wider than the narrowest**. Worked at 14px:

| String | Arial | Inter default | Inter `tnum` |
|---|---|---|---|
| `1111` | 31.14 px | **22.78 px** | 36.31 px |
| `4444` | 31.14 px | **36.18 px** | 36.31 px |
| misalignment | 0 px | **13.40 px** | 0 px |

A uniform-advance incumbent aligns every numeric column by construction, without a single CSS declaration. That alignment is invisible until it is removed.

<DoDont
  mode="dark"
  align="start"
  do="tabular-nums: 1111 and 4444 end at the same right edge."
  dont="Proportional figures leave the column ragged, by 13.4 px at 14px.">
  <template #do>
    <div class="text-[18px] leading-normal tabular-nums text-ink">1111<br>4444<br>1414<br>9999</div><div class="text-caption text-ink-muted">tabular-nums, one advance for all ten digits</div>
  </template>
  <template #dont>
    <div class="text-[18px] leading-normal proportional-nums text-ink">1111<br>4444<br>1414<br>9999</div><div class="text-caption text-ink-muted">proportional-nums, 1 at 833 against 4 at 1323</div>
  </template>
</DoDont>

`font-variant-numeric: tabular-nums` maps to the OpenType `tnum` feature. MDN defines it as "figures where numbers are all of the same size, allowing them to be easily aligned like in tables".

Measured against the Inter binary, `tnum` remaps all ten digits to `.tf` variants at a uniform 1328/2048 = 0.6484 em. It also remaps brackets and braces to 800-unit tabular variants, so bracketed values align down a column.

**The second-order cost.** Inter's tabular digit is 1328 units against Arial's 1139, so `1328 / 1139 = 1.166`, **16.6% wider than the incumbent digit**. A four-digit column grows from 31.14 px to 36.31 px, so every numeric column has to be re-measured against its allotted width in the same change.

**Where it applies:** every numeric surface listed under Numerals in [Typography](/foundations/typography), plus table headers and badge counters.

**The jitter case.** Under Inter's default figures a counter ticking 199 to 200 changes string width by `(1249 + 1292 + 1292) − (833 + 1270 + 1270) = 460` units, which at 14px is **3.15 px**. That is visible movement in a fixed row, and everything to the right of the counter moves with it.

**Slashed zero is a separate declaration on the UI face:** `font-feature-settings: "zero" 1`. MDN describes `slashed-zero` as forcing "the use of a 0 with a slash; this is useful when a clear distinction between O and 0 is needed."

| Rule | Cost if ignored |
|---|---|
| Ship `tabular-nums` in the same release as any proportional-figure face. | Split across two releases, the first ships a regression against the product it replaced. |
| Re-measure every numeric column against its allotted width when the tabular advance is wider than the incumbent digit. | A 16.6% wider digit turns a column that fitted into one that truncates. |
| Apply `tabular-nums` to live-updating numbers, not only to static table cells. | A counter with proportional figures moves every element to its right on each tick. |
| Never apply tabular figures to running prose or headings. | Tabular digits carry compromised proportions and read loose inside a sentence. |
| Never treat uniform digit advances in the incumbent face as a property that carries over. | It is a property of that binary, and the next face is unlikely to share it. |
| Never rely on `"zero" 1` on a build with no `GSUB` table. | The declaration is silently inert there. |

## Licensing

**Rule: a self-hosted face inside a distributed desktop bundle must be SIL OFL 1.1 or equivalent, and must declare no Reserved Font Name.** Both conditions are verified against the upstream licence file in the release archive, never against a secondary source or a marketplace listing.

| Face | Licence | Copyright line, first line verbatim | Reserved Font Name |
|---|---|---|---|
| Inter | **SIL Open Font License 1.1** | "Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter)" | none declared |
| JetBrains Mono | **SIL Open Font License 1.1** | "Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono)" | none declared |

Three consequences for a distributed desktop bundle:

1. **Self-hosting and redistribution inside the application bundle are permitted.** OFL 1.1 §2 permits bundling with software, with or without modification, provided the licence and copyright notice travel with the font.
2. **Subsetting is permitted.** Subsetting is a modification, and OFL 1.1 allows modified versions. That is what makes the byte figures under [Bundle cost and loading](#bundle-cost-and-loading) legal as well as arithmetically attractive.
3. **Neither face declares a Reserved Font Name.** Under OFL 1.1 §3 an RFN would forbid a modified build from carrying the original name. With none declared, an in-house-compressed `woff2` keeps the family name, which matters because the no-ligature webfont has to be built.

The licence file ships with the binaries and is listed in the application's third-party notices.

| Rule | Cost if ignored |
|---|---|
| Read the licence file inside the release archive you are shipping, at the version you are shipping. | Licences change between versions, and marketplace summaries lag them. |
| Check for a Reserved Font Name before planning any subset or in-house build. | An RFN forces a rename, and a renamed family breaks every `font-family` string and every fallback chain that references it. |
| Ship the licence text alongside the binary and register it in third-party notices in the same change that adds the font. | Added later, it is added never. |
| Never self-host a face whose licence permits only web serving from a vendor domain. | A desktop bundle is redistribution, and that distinction is the one most commonly missed. |
| Never treat a vendor's free tier as equivalent to OFL. | Subsetting and bundle redistribution are the two rights that matter here, and the two most often withheld. |
| Never vendor a font through a package manager and assume the licence came with it. | Package metadata frequently names a licence the archive does not contain, and the archive is what ships. |

## Bundle cost and loading

**Rule: budget a webfont against the icon-font payload the application already ships, not against zero.** An application shell that carries icon fonts almost always holds more dead glyph coverage in those fonts than the entire cost of two purpose-built text faces.

Audit the icon fonts in the same change, and the typeface upgrade routinely makes the download smaller rather than larger.

Subset sizes for the candidates, produced with `fontTools.subset`, Brotli compression, `--no-hinting`, and the feature set `ccmp,locl,kern,mark,mkmk,tnum,zero,calt,case`. Unicode ranges are the Google Fonts `latin` and `latin-ext` ranges.

| File | Latin | Latin + Latin-Ext |
|---|---|---|
| `InterVariable` 4.001, one file, `opsz` 14–32 and `wght` 100–900 | 67,532 | 154,116 |
| `JetBrainsMonoNL-Regular` 2.304 | 8,504 | 11,444 |
| `JetBrainsMonoNL-Bold` 2.304 | not measured | 11,652 |
| **Total** | **76,036** | **177,212** |

Two decisions that adoption forces:

1. **Latin or Latin-Ext.** The `latin-ext` figure for a variable face carries the full `wght` range across the extended set, which is where most of the 86,584-byte difference goes. Decide it against the state of the internationalisation work at adoption time, not in advance.
2. **Reproducible is not the same as built.** Subset figures produced by hand are reproducible but they are not the shipped artifact. Verify against the real build output before quoting them anywhere external.

### Loading

`@font-face` is a declaration Tailwind has no utility for, so it stays CSS.

```css
@font-face {
  font-family: "InterVariable";
  font-style: normal;
  font-weight: 100 900;
  font-display: block;
  src: url("/fonts/InterVariable-latin.woff2") format("woff2");
}
```

**Rule: `font-display: block`, never `swap`, for an application shell.** MDN defines `block` as giving "the font face a short block period and an infinite swap period". It defines `swap` as giving "the font face an extremely small block period and an infinite swap period".

`swap` is wrong here because the flash of unstyled text reflows a virtualised table mid-scroll and moves rows under the pointer. `block` holds the render until the font resolves. Pair it with `<link rel="preload" as="font" crossorigin>`.

**The block period length is user-agent dependent.** Neither MDN nor the CSS Fonts specification fixes it, and Firefox exposes it as `gfx.downloadable_fonts.fallback_delay`.

A locally bundled font resolves in single-digit milliseconds over `file:` or an application scheme, so the block period is no practical constraint for a desktop build. It is a real constraint for a web build served over a network, and that is the case to design the preload for.

| Rule | Cost if ignored |
|---|---|
| Audit the icon fonts in the same change that adds a text face. | Dead icon coverage dwarfs the cost of the text faces, and the two numbers belong on the same line of the budget. |
| Subset to the Unicode ranges the product renders, and re-derive the subset when internationalisation coverage changes. | A full-coverage variable face costs roughly twice its Latin subset. |
| Pair `font-display: block` with `<link rel="preload">`. | Block without preload extends the blank period. Preload without block reintroduces the reflow. |
| Never use `font-display: swap` in an application shell. | The swap reflows a virtualised list while the user is scrolling it, and rows move under the pointer mid-click. |
| Never quote hand-produced subset sizes as shipped figures. | Build pipelines re-encode, and the difference is large enough to make a release note wrong. |
| Never ship a `.ttf` fallback `src` alongside a `woff2` for a bundled desktop application. | A `woff2`-capable engine never fetches it, so it is pure installer weight. |

## Dark-theme remedy on a static face

**On a static face, only two of the three parts of the dark-theme remedy are implementable.**

**The effect.** Light strokes on a dark field bleed outward into the surrounding dark, so identical text appears heavier and blurrier on dark than on light. The name is **irradiation**, also called halation or bloom.

Three things aggravate it: maximum luminance delta (white on black), uncorrected astigmatism, and macOS subpixel antialiasing, which additionally thickens light-on-dark.

Astigmatism prevalence is not marginal. The accessibility literature reports a UK spectacle-wearer survey of n > 11,000 finding 47.4% at 0.75 D or greater in at least one eye. That figure reaches this document through a research digest, so re-verify it before quoting it externally.

The full three-part remedy:

1. Never pure white body ink on the dark theme. Use the warm off-white foreground role over the dark canvas role.
2. Drop the variable weight axis by 20 units in dark, so 400 becomes 380, 500 becomes 480, 600 becomes 580.
3. Never `-webkit-font-smoothing: antialiased`.

**Part 2 requires a variable face.** A static binary has no `fvar` table, so `font-weight: 380` snaps to the nearest static instance, which is 400, and the compensation has no effect while appearing to be applied. Inter Variable's `wght` axis is continuous from 100 to 900, which is what would make the value legal.

On a static stack the remedy reduces to two parts. Part 1 is a token override, so it stays CSS:

```css
:root[data-mode="dark"] { --c-fg-default: ; }
```

Part 3 is a ban, so there is nothing to write. Never set `-webkit-font-smoothing: antialiased`, in either theme.

Body ink then reads its role token through a class:

```html
<p class="text-body text-ink bg-canvas">Response 200 OK, 1,024 bytes, 41 ms</p>
```

<DoDont
  mode="dark"
  align="start"
  do="Warm off-white ink on the dark canvas: the strokes stay crisp."
  dont="Pure white blooms. The same text reads heavier and blurrier than on light.">
  <template #do>
    <div class="text-body text-ink">Response 200 OK, 1,024 bytes, 41 ms</div><div class="text-caption text-ink-muted">Warm off-white foreground role</div>
  </template>
  <template #dont>
    <div class="text-body text-white">Response 200 OK, 1,024 bytes, 41 ms</div><div class="text-caption text-ink-muted">Pure white, maximum luminance delta</div>
  </template>
</DoDont>

### No third option on a static face

The `GRAD` axis, which changes stroke weight without changing advance widths and is the textbook answer, is absent from Arial and also absent from Inter Variable 4.001 (measured `fvar`: `opsz` and `wght` only). `wght −20` is the substitute, and it is available only after a variable face is adopted.

**Cost of `wght −20` once available.** It is a weight change rather than a grade change, so it is not width-neutral. Applying it moves advance widths on theme switch, which can re-clip a truncation site.

Restrict it to text roles and keep it off `label` and `badge` roles inside width-constrained controls.

### `-webkit-font-smoothing: antialiased` is not the substitute

**Was:** The declaration thins strokes globally and is macOS-only, Chromium-and-WebKit-only, with no Windows or Linux equivalent.
**Cost:** It treats the effect for a fraction of users, does nothing for the rest, and degrades the light theme because it applies unconditionally.
**Now:** Never set `-webkit-font-smoothing`, in either theme.
**Do:** Remove it wherever it appears. A three-platform, two-theme product cannot accept a remedy that covers one platform and makes the other theme worse.

| Rule | Cost if ignored |
|---|---|
| State the unavailable remedy explicitly wherever the dark theme is specified. | A remedy that is silently missing gets reinvented as a worse one. |
| Verify that a fractional weight actually renders before relying on it. | On a static face the declaration parses, applies, and does nothing. |
| Keep `wght −20` off width-constrained roles once it is available. | It changes advance widths, so a label that fitted in the light theme can clip in the dark one. |
| Never use pure white for body ink on a dark canvas. | Maximum luminance delta is the single largest contributor to irradiation, and the warm off-white costs nothing to adopt. |
| Never substitute a smaller size or a lighter static weight for the missing grade adjustment. | Both change the type ramp to compensate for a rendering effect, and the ramp then reads wrong in the light theme. |

## Adoption sequence and acceptance tests

If the proposal is ever adopted, the ordering below is a constraint rather than a suggestion.

| # | Step | Why it is at this position |
|---|---|---|
| 1 | Land the whole typography system on the current stack first: the scale unit, the ramp, the role tokens, whole-pixel line boxes. | The family change must be the only variable under test. Landing both at once makes every regression ambiguous. |
| 2 | Give `--c-font-family-mono` its consumers before changing its value. Every mono surface must read the token, with no hardcoded stack anywhere. | A token with no consumers cannot deliver a face change to the surface the change was made for. |
| 3 | Add the adopted face as the default entry of the user-selectable family list. Self-host the binaries. Detail below. | The UI family is a user setting, so a face absent from that list is unreachable. |
| 4 | **In the same release as step 3**, apply `font-variant-numeric: tabular-nums` to every table cell and header, every numeric column, badge counter and timestamp. | See [Tabular figures](#tabular-figures). Shipping step 3 alone regresses every numeric column by up to 13.4 px per four-digit cell. **Non-negotiable.** |
| 5 | Apply `font-feature-settings: "zero" 1` to the UI face. Verify ligatures off on a standard build, and that the no-`GSUB` build renders none without CSS. | See [Ligature policy](#ligature-policy). |
| 6 | Enable the dark-theme `wght −20` compensation and verify no truncation site re-clips on theme switch. | Only implementable once a variable face is in. See [Dark-theme remedy on a static face](#dark-theme-remedy-on-a-static-face). |

**Step 3 in full.** Keep the websafe faces as alternatives. Build and self-host the binaries with `font-display: block` plus preload, and ship both licence files in third-party notices. The no-ligature build has no upstream webfont, so step 3 contains a build task.

The icon-font cleanup under [Bundle cost and loading](#bundle-cost-and-loading) has no dependency on any of the above and should ship independently, and earlier.

### Acceptance tests

| # | Test | Pass condition |
|---|---|---|
| 1 | **Confusable render.** At 12px and 13px, both themes, in the shipped mono: `0O0O oO 1lI\| iIl rn m rnm cl d vv w VV W 5S 8B 2Z ., :; '" -_ {}[]()  \/` | Every pair distinguishable at 60 cm without leaning in |
| 2 | **Ligature.** Render `!= -> => <= >= :: // /* www` in the raw HTTP viewer | Glyph count **equals** character count |
| 3 | **Tabular.** A column of `1111`, `4444`, `1414`, `9999`, and a counter ticking 199 → 200 → 201 | Identical rendered width, and nothing to the right of it shifts |
| 4 | **Column count.** Characters per line in the raw viewer at a fixed width, before and after | Unchanged. The advance is 0.6001 em before and 0.6000 em after |
| 5 | **Truncation.** Every truncating site, before and after, and again on dark/light switch once `wght −20` is enabled | No new clipping |
| 6 | **Fallback.** Block the webfont requests and reload | Application fully usable on the fallback stack, no layout collapse |
| 7 | **Payload.** Measure built font bytes before and after | Total downloaded font bytes decrease |

| Rule | Cost if ignored |
|---|---|
| Land the geometry system on the current stack before changing any family. | With both moving, a regression cannot be attributed to either. |
| Give the family token its consumers before changing its value. | Changing a token that nothing reads produces a passing release and an unchanged product. |
| Run the confusable render test on the lowest-DPI display the product supports, at the smallest role size. | A pair that separates on a high-DPI panel at 14px can merge at 12px on a 96-DPI one. |
| Run the fallback test by blocking the font requests, not by renaming the family. | Renaming skips the loading path, which is where the layout collapse would appear. |
| Never ship the family change and the figure change in separate releases. | The intermediate state is worse than either endpoint. |
| Never accept the change without re-measuring every truncating site. | The advance widths move, and a label that fitted before is the failure mode that reaches users first. |
| Never enable the dark-theme weight compensation in the same release as the family change. | It moves advance widths a second time, and two width shifts in one release make a clipping report unattributable. |

## The decision in force

**The decision in force is to keep the websafe stack.** `--c-font-family-base` remains `Arial, sans-serif`, `--c-font-family-mono` remains `"Courier New", monospace`, and the user-selectable family list is unchanged. Nothing in this appendix is scheduled.

**Recommendation, on the record and not scheduled: adopt Inter Variable for the UI and JetBrains Mono NL for the request, response and hex viewers, in a single release that also ships `tabular-nums`.** The case rests on four measured claims, in order of weight:

1. **Courier New has no glyph-level defence against confusables and renders inside the size band UTR #36 §2 scopes.** Its `0` and `O` are topologically identical, it has no `zero`, `tnum`, `ss*` or `cv*` feature to enable, and its lowercase measures 5.18 px at the size the mono cells render.
2. **The mono replacement is free horizontally.** 0.6000 em against 0.6001 em, so no view loses a column, and the lowercase gains 30.1%.
3. **Both faces are SIL OFL 1.1 with no Reserved Font Name**, so self-hosting, subsetting and redistribution inside the desktop bundle are permitted, and an in-house `woff2` keeps the family name.
4. **A variable UI face is the only route to the dark-theme irradiation compensation.** On a static face `wght −20` is not implementable and the remedy is permanently two-thirds of itself.

Two items are not blocked by that decision and are governed separately:

- **The ligature policy** is in force today on whatever mono face renders.
- **The mono token consolidation**, step 2 of the adoption sequence, is a correctness improvement to the token layer on its own terms, and it is the prerequisite that makes a future mono change a one-line edit.

| Rule | Cost if ignored |
|---|---|
| Revisit this appendix as a whole, not as a menu. | The figure, ligature and licence rules make the face change safe. Taking the face alone ships the regression and none of the benefit. |
| Keep the measurements attached to the recommendation. | A proposal held for a future release decays into an opinion the moment its numbers are separated from it. |
| Re-verify the binary versions named here before acting. | A face that gained or lost an axis, a feature or a metrics flag between releases invalidates the specific claim that rests on it. |
| Never re-derive the evidence at adoption time. | It is recorded here with the binaries and versions named. Verify the versions, do not restart the analysis. |
| Never read the typography foundation as provisional because this appendix exists. | The foundation specifies boxes. This appendix proposes glyphs. |
| Never adopt one of the two faces without the other. | The mono case is correctness. The UI case is density and dark-theme compensation. Splitting them pays the webfont pipeline cost for half the return. |
