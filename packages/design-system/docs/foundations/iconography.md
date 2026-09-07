# Iconography

An icon here is a glyph, not a graphic. It takes its size from `font-size`, its colour from `currentColor`, and its rasterisation from the same engine that sets the label beside it.

Iconography is therefore a typographic discipline. One family, five sizes taken from the line box, and a status set that exists because the Paper status inks sit too close in hue to be told apart by colour.

## One family, one component

FontAwesome 6 Free Solid. One family, one weight, delivered as a webfont. Two families put two stroke weights and two corner treatments on one toolbar, and a reader takes that as two kinds of control.

Every icon renders through `DsIcon`. The component owns the ladder step, the fixed-width box and the accessibility default, so no call site decides them again.

<Preview title="One family, one weight" center>
  <DsIcon icon="fas fa-magnifying-glass" size="md" />
  <DsIcon icon="fas fa-shield-halved" size="md" />
  <DsIcon icon="fas fa-paper-plane" size="md" />
  <DsIcon icon="fas fa-trash-can" size="md" />
  <DsIcon icon="fas fa-ellipsis" size="md" />
</Preview>

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | string | | FontAwesome class, for example `fas fa-star`. |
| `size` | `xs` `sm` `md` `lg` `xl` | `sm` | Ladder step: 12, 16, 20, 24 or 32px. |
| `fixedWidth` | boolean | `false` | 1.25em box. Required for icons in a column. |
| `label` | string | | Accessible name. Omit to render the icon decorative. |
| `tone` | role name | `inherit` | Colour role. Inherit keeps `currentColor`. |

A hand-written `<i class="fas fa-star">` skips the ladder, the fixed box and the hidden-by-default rule in one move. There is no case where writing one is the shorter path.

## The size ladder

Five steps, and no sixth. A sixth step 1.14 apart from its neighbour gets picked by eye, and the ladder stops predicting anything.

| Step | Size | Where it is used |
|---|---|---|
| `xs` | 12px | Caption and code text, cell markers, the external link marker |
| `sm` | 16px | The default. Body text, buttons at every size, menus, toolbars |
| `md` | 20px | Title text, and controls at 40 or 48px |
| `lg` | 24px | Heading text, and the leading icon of a dialog |
| `xl` | 32px | Empty states and onboarding. Never in chrome |

<Preview title="The ladder" note="12 / 16 / 20 / 24 / 32" center>
  <DsIcon icon="fas fa-shield-halved" size="xs" />
  <DsIcon icon="fas fa-shield-halved" size="sm" />
  <DsIcon icon="fas fa-shield-halved" size="md" />
  <DsIcon icon="fas fa-shield-halved" size="lg" />
  <DsIcon icon="fas fa-shield-halved" size="xl" />
</Preview>

Take the step from the line box of the text beside the icon, never from its font size. The rule is the nearest step to `line box × 0.8`.

A text glyph fills about 70% of its em where an icon fills 100% of its box, so an icon set at the text size reads smaller than the text. The coefficient is Carbon's own ratio: a 16px icon beside 14px text in a 20px line box.

| Text role | Size and line box | Icon step |
|---|---|---|
| `caption` | 12 / 16 | `xs` |
| `body` | 14 / 20 | `sm` |
| `title` | 16 / 24 | `md` |
| `heading` | 20 / 28 | `lg` |
| `display` | 32 / 40 | `xl` |

<DoDont
  do="Icon sized from the 28px line box, one step above the text."
  dont="Sized to the font size, the icon reads smaller than its label.">
  <template #do>
    <span class="inline-flex items-center gap-2 text-heading text-ink"><DsIcon icon="fas fa-shield-halved" size="lg" />Intercept is on</span>
  </template>
  <template #dont>
    <span class="inline-flex items-center gap-2 text-heading text-ink"><DsIcon icon="fas fa-shield-halved" size="md" />Intercept is on</span>
  </template>
</DoDont>

Buttons and fields collapse their line box to the em, because the control height owns the height instead. Derive their icon from the line box the same text would have in flowing prose, so 14px text gives a 20px box and a 16px icon.

Sizes are authored in `rem`, so icons grow when a user raises the UI font size. Control heights stay in `px` and are applied as `min-height`, so a control grows to fit rather than clipping the icon.

The family's own size classes are banned. `fa-lg` through `fa-10x` multiply the inherited font size and land off the ladder, and `fa-xs` shifts `vertical-align` at the same time.

## Alignment

Centre the icon in the line box. Baseline alignment places it by the font's descent metric, and this product lets the user change the UI typeface, so any baseline offset is wrong for most of them.

Use `inline-flex items-center` on the container and `shrink-0` on the icon, with no vertical margin. Correct a bottom-heavy glyph such as `fa-trash-can` with `translate-y-[-0.5px]`.

The distance from an icon to its label is `gap-1`, 4px, set on the container. A margin on the icon adds to that gap instead of replacing it.

<DoDont
  do="One 4px gap on the container, and nothing on the icon."
  dont="A margin adds to the gap and pushes the label 16px out.">
  <template #do>
    <span class="inline-flex items-center gap-1 rounded-md border border-separator bg-raised px-3 py-1.5 text-body text-ink"><DsIcon icon="fas fa-star" />Add to scope</span>
  </template>
  <template #dont>
    <span class="inline-flex items-center gap-1 rounded-md border border-separator bg-raised px-3 py-1.5 text-body text-ink"><DsIcon icon="fas fa-star" class="mr-3" />Add to scope</span>
  </template>
</DoDont>

Icons stacked in a column need a fixed box. Solid advance widths run from 448 to 512 units in a 512 unit em, so labels step in and out without one. `fa-fw` sets a 1.25em box, 20px at a 16px icon.

<DoDont
  align="start"
  do="A fixed 20px box, so every label starts on one line."
  dont="Natural glyph widths, so the labels step in and out.">
  <template #do>
    <div class="flex flex-col gap-2 text-body text-ink">
      <span class="flex items-center gap-1"><DsIcon icon="fas fa-plus" fixed-width />Add</span>
      <span class="flex items-center gap-1"><DsIcon icon="fas fa-star" fixed-width />Favourites</span>
      <span class="flex items-center gap-1"><DsIcon icon="fas fa-magnifying-glass" fixed-width />Search</span>
    </div>
  </template>
  <template #dont>
    <div class="flex flex-col gap-2 text-body text-ink">
      <span class="flex items-center gap-1"><DsIcon icon="fas fa-plus" />Add</span>
      <span class="flex items-center gap-1"><DsIcon icon="fas fa-star" />Favourites</span>
      <span class="flex items-center gap-1"><DsIcon icon="fas fa-magnifying-glass" />Search</span>
    </div>
  </template>
</DoDont>

An icon-first control trims its leading padding by one step, 8px rather than 12px. The glyph box carries transparent side bearing that text does not, so matching the text-first padding looks more inset.

## Colour

Three classes of icon, three obligations.

| Class | What it is | Colour and contrast |
|---|---|---|
| Decorative | Sits beside text that carries the same meaning | `currentColor`, no floor |
| Meaningful | Carries information no adjacent text carries | Role token, 3:1 minimum |
| Icon as label | The visible content of an icon-only control | Role token, 4.5:1 minimum |

A decorative icon inherits `currentColor` rather than taking a colour of its own. Inheritance makes the pairing automatic in both themes, because there is no second value to forget.

A meaningful icon takes a role token. Every role below clears 4.5:1 on the Paper canvas, so one tone answers the 3:1 and the 4.5:1 obligation at once.

| Tone | Role token | On the Paper canvas |
|---|---|---|
| `danger` | `--c-fg-danger` | 5.53:1 |
| `warning` | `--c-fg-secondary`, the gold ink | 5.43:1 |
| `success` | `--c-fg-success` | 5.67:1 |
| `info` | `--c-fg-info` | 5.41:1 |
| `accent` | `--c-fg-primary` | 6.49:1 |

Di-serria, the gold Caido has always shipped, is not on that list. It measures 2.00:1 against the Paper canvas, which makes it a fill there and an ink in dark, where the identical swatch reaches 6.47:1.

That is the contrast budget deciding a rung rather than taste. A gold glyph on paper drops to the ink rung, and drops one further, to `--c-secondary-500`, when it sits on inset rather than canvas.

<Preview title="Meaningful tones" note="5.41:1 worst case on paper">
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-exclamation" tone="danger" />Danger</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-triangle-exclamation" tone="warning" />Warning</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-check" tone="success" />Success</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-info" tone="info" />Info</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-dot" tone="accent" />Accent</span>
</Preview>

Never invent an opacity for a glyph. A 15 percent ghost reads in dark and vanishes on paper, so the fade is a token: `--c-opacity-ghost` is 0.15 in dark and 0.4 in Paper.

FontAwesome sets `-webkit-font-smoothing: antialiased` on every icon class, which renders the glyph lighter than the label beside it. Return it to `auto` in one global rule, and that rule is the only CSS this foundation needs.

## Icon-only controls

`aria-label` goes on the control, and the icon inside stays hidden. A name on the icon leaves the button itself unnamed, which fails WCAG 2.2 SC 4.1.2 Name, Role, Value at Level A.

A tooltip is not a name. It does not reach the accessibility tree, and it never appears for a keyboard user who has not hovered.

<Preview title="Icon-only controls" note="28 / 32 / 32px">
  <DsButton size="sm" variant="ghost" icon="fas fa-star" label="Add to scope" icon-only />
  <DsButton size="md" variant="secondary" icon="fas fa-pencil" label="Edit" icon-only />
  <DsButton size="md" variant="ghost" danger icon="fas fa-trash-can" label="Delete" icon-only />
</Preview>

The hit area is at least 24 by 24 CSS px under SC 2.5.8, or 20 by 20 with 4px of separation under the spacing exception. Under a coarse pointer with no hover it is 44 by 44.

<DoDont
  do="A 28px hit area clears the 24px minimum with room to spare."
  dont="An 18px target fails SC 2.5.8 and is easy to miss.">
  <template #do>
    <div class="inline-flex h-sm w-sm items-center justify-center rounded-md bg-inset text-ink-muted"><DsIcon icon="fas fa-trash-can" /></div>
  </template>
  <template #dont>
    <div class="inline-flex h-[18px] w-[18px] items-center justify-center rounded-md bg-inset text-ink-muted"><DsIcon icon="fas fa-trash-can" /></div>
  </template>
</DoDont>

Width and height come from one height token, so the control is square by construction. Sizing width from one source and height from padding gives a control that is visibly not square beside one that is.

## Highlight swatches

The nine request highlight colours each hold two jobs. One washes a whole table row, and one paints the picker glyph a user clicks to apply that wash.

On paper those two jobs need two values. The row fills run 1.07:1 to 1.54:1 against the canvas, which is correct under body ink and invisible as a glyph.

So the product splits them. `--c-highlight-color-*` stays the row fill, because that literal string is persisted in request metadata, and `--c-highlight-swatch-*` carries the glyph.

| Token family | Job | Range on the Paper canvas |
|---|---|---|
| `--c-highlight-color-*` | Row wash sitting behind body ink | 1.07:1 to 1.54:1 |
| `--c-highlight-swatch-*` | Picker glyph, legend dot, any icon | 5.86:1 to 8.19:1 |

<DoDont
  mode="light"
  do="The picker glyph takes the swatch ink and clears 4.5 to 1."
  dont="The picker glyph takes the row fill and reads 1.21 to 1.">
  <template #do>
    <span class="inline-flex items-center gap-2 text-body text-ink"><DsIcon icon="fas fa-tag" tone="danger" />Red<span class="rounded-sm bg-tag-row px-2 text-tag-ink">GET /login</span></span>
  </template>
  <template #dont>
    <span class="inline-flex items-center gap-2 text-body text-ink"><DsIcon icon="fas fa-tag" class="text-tag-row" />Red<span class="rounded-sm bg-tag-row px-2 text-tag-ink">GET /login</span></span>
  </template>
</DoDont>

In dark the split is a formality. Each swatch token points straight at its fill, because the dark fills were already inks and nothing had to move.

The nine fills were re-derived together rather than picked one at a time. Worst-case CIE76 separation is 9.0 under normal vision, 7.9 under deuteranopia and 6.2 under protanopia, up from 2.4 before.

## Status icons

Colour cannot carry status on its own. In HSL the Paper status inks sit at 346, 8, 124 and 198 degrees, which reads as 338 degrees between the accent and danger.

In OKLCH the same four sit at 13, 32, 144 and 229, and the real gap between accent and danger is 18 degrees. Always name the space before trusting a hue distance.

Eighteen degrees is a family resemblance, not a distinction, and protanopia narrows it further. So every status renders as colour, plus an icon, plus a text label.

| Intent | Glyph | Silhouette |
|---|---|---|
| Danger | `fa-circle-exclamation` | Circle with a bar |
| Warning | `fa-triangle-exclamation` | Triangle |
| Success | `fa-circle-check` | Circle with a tick |
| Info | `fa-circle-info` | Circle with an i |
| Selected | `fa-circle-dot` | Circle with a dot |

<Preview title="The status set">
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-exclamation" tone="danger" />Failed</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-triangle-exclamation" tone="warning" />Timed out</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-check" tone="success" />Passed</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-info" tone="info" />Queued</span>
  <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-dot" tone="accent" />Selected</span>
</Preview>

Outline shape is the channel that survives at 16px. The triangle marks warning, and the four circles differ by the count and orientation of their interior mark.

<DoDont
  do="Icon and word carry the status with the colour ignored."
  dont="Colour only: danger and success merge for a protan reader.">
  <template #do>
    <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-exclamation" tone="danger" />Failed</span>
    <span class="inline-flex items-center gap-1 text-body text-ink"><DsIcon icon="fas fa-circle-check" tone="success" />Passed</span>
  </template>
  <template #dont>
    <span class="inline-block h-3 w-3 rounded-full bg-danger-ink"></span>
    <span class="inline-block h-3 w-3 rounded-full bg-success-ink"></span>
  </template>
</DoDont>

`fa-circle-xmark` is not an error glyph. Its interior mark is the same cross that dismisses the toast it appears in, so one mark would mean two things on one surface.

The text label can be visible text or the icon's accessible name. A status word that lives only in a `title` attribute does not exist for a keyboard user, or in a screenshot.

## The glyph register

One name per concept. A product that spells one intent three ways cannot be audited by search, and drifts into three slightly different glyphs.

| Concept | Glyph | Never author |
|---|---|---|
| Close | `fa-xmark` | `fa-close`, `fa-times` |
| Delete | `fa-trash-can` | `fa-trash` |
| Edit | `fa-pencil` | `fa-edit`, `fa-pen` |
| Save | `fa-floppy-disk` | `fa-save` |
| Search | `fa-magnifying-glass` | `fa-search` |
| Undo | `fa-rotate-left` | `fa-undo` |
| Help | `fa-circle-question` | `fa-question-circle` |
| Overflow menu | `fa-ellipsis` | `fa-ellipsis-h` |
| Disclosure | `fa-angle-right`, `fa-angle-down` | any `chevron` or `caret` name |
| External link | `fa-up-right-from-square` | `fa-external-link-alt` |

Disclosure is the angle, not the caret. A filled caret reads heavier than every glyph beside it at 16px, and shipping both teaches a user two rules for one behaviour.

Add the row before you add the glyph. A new concept gets its one name at that moment, and every later search finds all of its uses.

The external link marker is `xs`, 12px beside body text. It sits inside the anchor so it shares the link's hit area, and it stays hidden, with "opens in a new tab" carried in the link's accessible name.

## Review gates

A change that touches icons fails review if any of these is false.

- The icon renders through the icon component, not a hand-written `<i>` element.
- The step comes from the line box beside it, never a font size or a family size class.
- The colour is `currentColor` or a role token, never a numbered rung and never a hex.
- A highlight glyph takes a swatch token, never the row fill token that shares its name.
- A decorative icon is hidden, and every icon-only control names itself on the control.
- Every icon in a column carries `fa-fw`, and no icon carries a margin.
- Every status colour ships with its glyph and a text label.

For what changed in the product, see the [changelog](/changelog).
