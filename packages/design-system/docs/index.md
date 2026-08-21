---
title: Caido Design System
pageClass: wide
---

# Caido Design System

Caido's interface in two themes. Dark is the palette the product has always shipped, unchanged. Light is Paper, built to sit beside it without moving a single dark value.

These pages describe what ships, not a proposal. Every ramp, swatch and token table here reads its values out of `proxy-frontend`, so a page cannot document a colour the product does not have.

## One layout, two themes

Drag the divider. Both halves are the same screen reading the same role names, so the only difference is what those names resolve to.

<ThemeCompare />

## What the system is made of

Six colour families carry the interface: one warm neutral of fourteen rungs, crimson for the brand, gold for the accent, and danger, success and info for status.

`tokens.css` declares 176 custom properties and `theme.light.css` gives every one of them a light value. Rungs hold the values, role aliases hold the jobs, and preservation tokens hold the finished literals that used to sit inside components.

## The rules behind Paper

Paper was derived, not picked. Each rule below is stated in full on [Colour](/foundations/colour), with the measurement that backs it.

| Rule | What it means |
|---|---|
| Derive, do not invent | The canvas `#F3EEE8` descends from isabelline `#EDEAE8`, 16 degrees away in OKLCH and slightly warmer |
| One hue family for every neutral | All fourteen rungs sit at 30 to 32 degrees. There is no cool grey anywhere in Paper |
| Split the ramp by role | Rungs 0 to 150 are planes, 200 to 350 are lines and controls, 400 to 950 are ink |
| Contrast budget decides re-anchoring | A colour that cannot clear its floor at the lightness its role needs moves rung |
| Hue separation so meaning survives | Primary to danger is 18 degrees apart in OKLCH, not the 338 that HSL implies |
| Each family needs its own treatment | Info gained saturation, success took the deepest lightness drop, gold rose in saturation |
| Elevation inverts | On paper, raised is a white sheet on a warm desk and inset goes darker than the page |
| Dark must not move | Every alias carries a dark value byte-identical to the rung it replaced |

The contrast budget is the load-bearing one. Caido's gold `#DAA049` measures 2.00:1 on the canvas, so it stays a fill and `--c-secondary-500` `#845210` carries the gold ink at 5.70:1.

Re-anchoring is a change of rung, not of colour. The brand crimson `#A1213F` is `--c-primary-700` in dark and `--c-primary-500` in Paper: same value, different position, because the two themes need it at different depths.

## Where the values come from

Three stylesheets hold every colour in the product. An extractor reads them and writes the data these pages render, so the documentation cannot drift from the source.

| File | What it holds |
|---|---|
| `packages/components/src/styles/tokens.css` | The dark rungs, the role aliases and the preservation tokens |
| `packages/components/src/styles/theme.light.css` | Paper: 423 lines, every light rung and every override |
| `packages/ui/src/styles/colors.variables.css` | Row highlight fills, swatch foregrounds and workflow node colours |

The row highlights and the syntax palette were derived separately by explicit optimisation, and both are measured for colour vision deficiency. Row fills separate by 9.0 CIE76 at worst under normal vision, 7.9 under deuteranopia and 6.2 under protanopia.

## Where to go next

Pick the route that matches what you are doing. Every page states its rule first and its evidence after.

### Learning the system

- [Principles](/principles). What the system optimises for, and what it refuses to do.
- [How to read a spec](/how-to-read-a-spec). How a page is laid out and what each number means.
- [Colour](/foundations/colour). Both ramps, the eight rules in full, and the measurements behind them.
- [Accessibility](/foundations/accessibility). The contrast contract, the focus rule and the size floors.

### Building a screen

- [Button](/components/button). The reference component, and the shape every other component page follows.
- [Data table](/components/data-table). Caido's densest surface: row geometry, selection and tagging.
- [Typography](/foundations/typography). Six sizes and thirteen roles, and why a component asks for a role.
- [Spacing](/foundations/spacing). One ladder, written in rem against a root size the reader controls.

### Implementing it in the product

- [Tokens](/tokens). The three tiers, and the single name a component is allowed to reach for.
- [Current state](/implementation/current-state). What `proxy-frontend` does today, measured, with 50 numbered defects.
- [Migration](/implementation/migration). The phase order, sequenced so the dark theme stays byte-stable.
- [What changed](/changelog). Every value that moved, old and new, side by side.
