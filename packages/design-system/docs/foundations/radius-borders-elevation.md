# Radius, borders and elevation

Three channels draw every boundary in Caido: a corner, a line, or a change of plane. This page records which one the product reaches for and what each value measures. Every number is read from the shipped CSS.

One fact governs the rest. Caido authors radius and border width in `rem`, and the UI font-size setting is written straight onto the root element, so both scale with the type slider.

Token values live in [Tokens](/tokens). What changed in the product is recorded on the [changelog](/changelog).

## Geometry scales with the type slider

`useFont.ts` assigns `documentElement.style.fontSize` from the UI font size setting. The default is 14px and the slider runs 12 to 24, so `1rem` is 14px on a fresh install and 24px at the top of the range.

Radius follows, because `@caido/common-frontend` ships the radius scale in rem.

| Token | Authored | At the 14px default | At the 24px maximum | Consumed by |
|---|---|---|---|---|
| `--c-border-radius-05` | 0.125rem | 1.75px | 3px | nothing in the shipped library |
| `--c-border-radius-1` | 0.25rem | 3.5px | 6px | Button, Card |
| `--c-border-radius-2` | 0.5rem | 7px | 12px | Menu, Submenu |
| `--c-border-radius-3` | 0.75rem | 10.5px | 18px | nothing in the shipped library |
| `--c-border-radius-4` | 1rem | 14px | 24px | nothing in the shipped library |

Border width follows too, and the resting hairline is the value that suffers for it.

| Token | Authored | At 12px | At the 14px default | At 24px |
|---|---|---|---|---|
| `--c-border-width-1` | 0.0625rem | 0.75px | 0.875px | 1.5px |
| `--c-border-width-2` | 0.125rem | 1.5px | 1.75px | 3px |
| `--c-border-width-3` | 0.1875rem | 2.25px | 2.625px | 4.5px |
| `--c-border-width-4` | 0.25rem | 3px | 3.5px | 6px |
| `--c-border-width-5` | 0.3125rem | 3.75px | 4.375px | 7.5px |

`--c-border-width-1` never renders at 1px. At the default it asks for 0.875px and the device rounds it, so the resting hairline is decided by pixel snapping rather than authored.

A third unit is in play. `.c-well` and the card header rule are authored in `em`, so they scale with the element's own font size on top of the root.

## Two radius scales, not one

App code does not consume the radius tokens. It uses Tailwind's default scale, which is also rem, and the two agree at only two steps.

| Class | Authored | At the 14px default | Token counterpart | Uses in app code |
|---|---|---|---|---|
| `rounded-sm` | 0.125rem | 1.75px | `--c-border-radius-05` | 11 |
| `rounded` | 0.25rem | 3.5px | `--c-border-radius-1` | 51 |
| `rounded-md` | 0.375rem | 5.25px | none | 45 |
| `rounded-lg` | 0.5rem | 7px | `--c-border-radius-2` | 12 |
| `rounded-full` | 9999px | 9999px | none | 28 |

`rounded` and `rounded-md` split the work almost evenly at 51 and 45 uses, and they are different sizes. Two classes doing one job is why the control radius cannot be quoted as a single number today.

## Nested corners

A child inset by `p` inside a parent of radius `R` wants `r = max(0, R - p)`, where `p` is padding plus the parent's border width.

Two concentric rounded rectangles separated by a constant band have corner arcs that differ by exactly the band width. Break that relation and the band either pinches at 45 degrees or balloons into a dent.

| Parent | R at the default | Inset | Child radius |
|---|---|---|---|
| Menu, `--c-border-radius-2` | 7px | `--c-border-width-1`, 0.875px | 6.125px |
| Menu, `--c-border-radius-2` | 7px | `--c-space-3`, 10.5px of padding | 0, square |
| Well, `0.25em` | 3.5px | `0.075em` border, 1.05px | 2.45px |
| Card, `--c-border-radius-1` | 3.5px | header is flush | clipped by the card |

Inner radii are computed, not tokenized. A result of 2.45px is correct, and minting a token for it invites reuse where the formula returns something else.

<DoDont
  do="Square the child inside a 16px inset, so the corner band stays even."
  dont="Round the child inside a 16px inset, so the corner band pinches shut.">
  <template #do>
    <div class="w-full rounded-[7px] border border-separator bg-raised p-[16px]">
      <div class="h-[72px] rounded-none bg-inset"></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full rounded-[7px] border border-separator bg-raised p-[16px]">
      <div class="h-[72px] rounded-[7px] bg-inset"></div>
    </div>
  </template>
</DoDont>

<DoDont
  do="Square the panes a splitter cuts, so no arc is sliced."
  dont="Round the panes a splitter cuts, so each arc becomes a notch.">
  <template #do>
    <div class="flex h-[104px] w-full bg-canvas">
      <div class="flex-1 bg-raised"></div>
      <div class="w-px bg-separator"></div>
      <div class="w-[84px] bg-raised"></div>
    </div>
  </template>
  <template #dont>
    <div class="flex h-[104px] w-full bg-canvas">
      <div class="flex-1 rounded-[7px] bg-raised"></div>
      <div class="w-px bg-separator"></div>
      <div class="w-[84px] rounded-[7px] bg-raised"></div>
    </div>
  </template>
</DoDont>

`.c-card` carries `overflow: hidden`, which is why its flush header and footer clip correctly against a 3.5px corner. A rounded parent without that clip needs `rounded-[inherit]` on its first and last child instead.

The focus ring flips the sign of the formula, because the ring sits outside the border box: `r_ring = r_control + offset`. The shipped button ring is `box-shadow: 0 0 .1em .1em`, and positive spread expands the arc for you.

## The line roles

Six line tokens ship. Four are general, and `--c-line-control` is an alias of `--c-line-strong`, so three values do the boundary work in each theme. `--c-line-connector` and `--c-line-tooltip` are scoped to one component each.

<Swatches
  :tokens="[
    { name: '--c-line-soft, dark', hex: '#484C56', job: 'Panel and menu dividers. No contrast floor.' },
    { name: '--c-line-default, dark', hex: '#25272D', job: 'Table and list rules. Equal to the dark canvas.' },
    { name: '--c-line-control, dark', hex: '#616161', job: 'Control boundary. Tops out at 2.41:1.' },
    { name: '--c-line-soft, light', hex: '#D8CFC5', job: 'Panel and menu dividers. No contrast floor.' },
    { name: '--c-line-default, light', hex: '#C1B5A9', job: 'Table and list rules, the paper seam.' },
    { name: '--c-line-control, light', hex: '#88796B', job: 'Control boundary. Minted as surface-350 for 1.4.11.' },
  ]"
  caption="Dark values are the rungs Caido has always shipped. Paper adds surface-350, a half rung that exists only to carry the control boundary." />

The control boundary is the one line carrying a contrast obligation. WCAG 1.4.11 asks 3:1 for the sole boundary of a control, and exempts a divider that is not part of a component.

| Line on surface | Dark | Paper |
|---|---|---|
| `--c-line-default` on the canvas | 1.00:1 | 1.74:1 |
| `--c-line-default` on a raised sheet | 1.18:1 | 1.97:1 |
| `--c-line-soft` on the canvas | 1.74:1 | 1.33:1 |
| `--c-line-soft` on a raised sheet | 1.47:1 | 1.51:1 |
| `--c-line-control` on the canvas | 2.41:1 | 3.65:1 |
| `--c-line-control` on a raised sheet | 2.04:1 | 4.13:1 |
| `--c-line-control` on an inset well | 2.41:1 | 3.09:1 |

Paper clears the floor on all three planes, worst case 3.09:1 in an inset well. Dark clears it nowhere and tops out at 2.41:1, because the rule that dark must not move froze every value where it stood.

Paper needs a layer of its own to keep that result. The prebuilt preset paints control boundaries with a Tailwind utility measuring 1.51:1, and only `c-overrides`, declared after `c-utilities`, can beat a utility.

That block keys on `data-pc-*` attributes rather than the preset's class strings, and covers twelve control families from `inputtext` to `togglebutton`.

Names state duty, not appearance. `soft` and `strong` would describe a look, and a look inverts between themes, so components would then import the wrong one.

<DoDont
  do="Draw the field boundary in line-control, which clears three to one."
  dont="Draw the field boundary in the fill itself, which measures one to one.">
  <template #do>
    <div class="h-md w-[220px] rounded-[3.5px] border border-control bg-inset"></div>
  </template>
  <template #dont>
    <div class="h-md w-[220px] rounded-[3.5px] border border-inset bg-inset"></div>
  </template>
</DoDont>

## Border, shadow or plane shift

Choose the mechanism from the relationship between the two surfaces, not from the look you want.

| Mechanism | Correct when | Cost |
|---|---|---|
| Plane shift | Two surfaces are permanently adjacent: panes, a card on the page | Nothing. No added box and no added line |
| Border | The boundary is the only evidence that a control is there | A sub-pixel width today, plus the 3:1 floor |
| Shadow | The upper surface floats over content whose colour it cannot predict | A blurred silhouette repainted on every scroll frame |

Floating is the one case a plane shift cannot serve, because there is no known surface underneath to shift against. Elsewhere a shadow adds noise without adding information.

A shift that resolves to the value it sits on is not a shift. `--c-plane-hover-row` in dark resolves to `#25272D`, the same value as both `--c-line-default` and the canvas.

Row separators follow the same discipline. Pick a stripe or a rule, never both on one boundary, and keep row hover on in every table, because in a dense grid it is the reading cursor.

## Elevation

Elevation runs on the plane step in both themes, and the direction of the step inverts.

| Plane | Dark | Step from canvas | Paper | Step from canvas |
|---|---|---|---|---|
| `--c-plane-canvas` | `#25272D` | the page | `#F3EEE8` | the page |
| `--c-plane-raised` | `#30333B` | 1.18:1 lighter | `#FDFDFB` | 1.13:1 lighter |
| `--c-plane-inset` | `#25272D` | none, 1.00:1 | `#E2DCD4` | 1.18:1 darker |
| `--c-plane-chip` | `#484C56` | 1.74:1 lighter | `#D8CFC5` | 1.33:1 darker |
| `--c-table-stripe` | `#353942` | 1.29:1 lighter | `#FAF8F5` | 1.09:1 lighter |

Dark has no recessed plane at all. Inset and sunken both resolve to the canvas value, so a dark well is drawn with a line or it is not drawn.

Paper has almost no raised headroom, and that is the arithmetic behind the inversion. Its canvas leaves 1.15:1 to white, the raised sheet spends 1.13:1 of it, and `#FDFDFB` leaves 1.02:1 above itself. Dark's canvas has 14.93:1 above it.

So Paper pays for elevation with a border plus a shadow, and dark pays with the plane step alone.

| Shadow | Dark | Paper |
|---|---|---|
| `--c-box-shadow-small` | `rgb(1 4 9) 0 1px 0 0` | `rgb(60 45 32 / 0.1) 0 1px 2px 0` |
| `--c-box-shadow-large` | `rgb(1 4 9) 0 8px 24px 0` | `rgb(60 45 32 / 0.16) 0 8px 24px 0` |
| `--c-shadow-overlay` | `0 0 #0000` | `--c-box-shadow-large` |
| `.c-card` | three black layers at 20, 14 and 12 percent | two warm layers at 5 and 10 percent |
| `.c-drawer` | `-8px 0 8px #14141440` | `-8px 0 16px rgb(60 45 32 / 0.1)` |

`--c-shadow-overlay` is `0 0 #0000` in dark. The command palette gets no shadow whatsoever, so its ring and its plane step carry the entire elevation signal.

Paper keeps the upstream geometry and changes only the ink. The large shadow holds `0 8px 24px` exactly, and the small one gains 2px of blur because the upstream value has none.

The ink is warm on purpose. `rgb(60 45 32)` is `hsl(28deg 30% 18%)`, two degrees off the neutral ramp's 30 degree floor, where pure black would composite toward grey and read as dirt.

The overlay ink is the neutral exactly. `rgb(34 31 27)` resolves to `hsl(30deg 12% 12%)`, which is `--c-surface-900`, and it carries every scrim, hover veil and active overlay in Paper.

Upstream ships `rgb(1, 4, 9)` fully opaque, with no alpha at all. On paper that renders as a drawn line rather than a shadow, which is why Paper restates both tokens instead of retinting them in place.

<DoDont
  do="Ring the dark overlay in line-control, because its shadow token is zero."
  dont="Drop the ring from the dark overlay, because its shadow token is zero.">
  <template #do>
    <div class="w-full bg-canvas p-4">
      <div class="h-[76px] rounded-[7px] border border-control bg-raised"></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full bg-canvas p-4">
      <div class="h-[76px] rounded-[7px] border border-transparent bg-raised"></div>
    </div>
  </template>
</DoDont>

<DoDont
  mode="light"
  do="Give the paper sheet a hairline and a shadow above the canvas."
  dont="Give the paper sheet only a lightness step above the canvas.">
  <template #do>
    <div class="w-full bg-canvas p-4">
      <div class="h-[76px] rounded-[7px] border border-separator bg-raised shadow-[0_8px_24px_rgba(60,45,32,0.16)]"></div>
    </div>
  </template>
  <template #dont>
    <div class="w-full bg-canvas p-4">
      <div class="h-[76px] rounded-[7px] bg-raised"></div>
    </div>
  </template>
</DoDont>

## Painting order

z-index is elevation's other axis, and the product has no ladder for it. App code ships `z-10` ten times, `z-20` three times, and one `z-40` and one `z-50`.

The prebuilt library ships `z-index: 99999` on `.c-drawer`. That is what one locally chosen value escalates into once nothing else can sit above it.

The ordering is not arbitrary work. A toast reporting a failed request has to be readable over the modal that triggered it, and a tooltip over the toast, which is a relationship no call site can see on its own.
