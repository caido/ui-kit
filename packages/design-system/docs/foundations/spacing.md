---
outline: false
pageClass: wide
---

# Spacing

Caido has one spacing ladder and it is written in rem, against a root font size the user controls. Every gap, inset and bar height resolves through it, so a spacing value is always a multiple of the reader's own text size.

<PageTabs :tabs="['Overview', 'Reference']">

<template #overview>

### One rem, and the user sets it

`@caido/common-frontend` puts `font-size: var(--c-font-size-base)` on `html`, and that token is `14px`. One rem in Caido is 14 pixels, not the 16 a browser and most design tools assume.

The Appearance settings slider then writes `documentElement.style.fontSize` directly, from 12px to 24px in whole steps. Every rem length moves with it, so layout and type scale together rather than drifting apart.

A rem figure copied from a 16px-root tool lands 12.5% smaller here. Resolve a spacing decision to pixels at 14px root before trusting a number taken from anywhere else.

### The ramp

<div class="flex flex-col gap-[6px] rounded-md border border-separator bg-subtle p-[16px]">
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-0</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">0</span><span class="h-[10px] w-0 rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-1</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">0.25rem</span><span class="h-[10px] w-[0.25rem] rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-2</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">0.5rem</span><span class="h-[10px] w-[0.5rem] rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-3</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">0.75rem</span><span class="h-[10px] w-[0.75rem] rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-4</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">1rem</span><span class="h-[10px] w-[1rem] rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-8</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">2rem</span><span class="h-[10px] w-[2rem] rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-10</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">2.5rem</span><span class="h-[10px] w-[2.5rem] rounded-xs bg-accent"></span></div>
  <div class="flex items-center gap-[12px]"><span class="w-[116px] shrink-0 font-mono text-code text-ink-muted">--c-space-12</span><span class="w-[64px] shrink-0 text-right text-caption text-ink-faint">3rem</span><span class="h-[10px] w-[3rem] rounded-xs bg-accent"></span></div>
</div>

Eight rungs ship, and they are numbered on Tailwind's own scale keys. `--c-space-4` and `p-4` are the same 1rem by construction, so a stylesheet and a class string never disagree about what step 4 means.

The jump from 1rem to 2rem is where the ramp changes job. Below it the rungs are gaps and insets. At and above it they are bar heights, which is why 2.5rem and 3rem never appear as a gap anywhere in the product.

### Four steps carry the product

Component markup holds 1380 padding and gap utilities. 1241 of them, 90%, sit on steps 1 through 4, which is 0.25rem to 1rem.

`gap-2` alone accounts for 436, `gap-4` for 197 and `gap-1` for 128. Reaching past step 4 for a gap is uncommon enough that it should be argued for rather than assumed.

Half steps are all but unused: twelve occurrences of `-0.5` and `-1.5` across every package. A layout that needs one is usually compensating for a parent's inset.

### Proximity decides grouping

Space inside a group has to be visibly smaller than the space between that group and its neighbours. Readers group by distance before they group by colour or by a border.

The upstream proxy form is the pattern to copy: `--c-space-2` from a label to its own field, `--c-space-8` from one field row to the next. Four to one, and each label plainly owns one input.

When a label sits as far from its field as from the field above it, the label binds upward and people type into the wrong box.

<DoDont
  align="start"
  do="Half a rem inside the pair, two rem between the pairs."
  dont="Two rem inside the pair, two rem between the pairs.">
  <template #do>
    <div class="flex flex-col gap-[2rem]">
      <div class="flex flex-col gap-[0.5rem]">
        <span class="text-caption text-ink-muted">Host</span>
        <div class="h-sm w-[190px] rounded-md border border-control bg-inset"></div>
      </div>
      <div class="flex flex-col gap-[0.5rem]">
        <span class="text-caption text-ink-muted">Port</span>
        <div class="h-sm w-[190px] rounded-md border border-control bg-inset"></div>
      </div>
    </div>
  </template>
  <template #dont>
    <div class="flex flex-col gap-[2rem]">
      <div class="flex flex-col gap-[2rem]">
        <span class="text-caption text-ink-muted">Host</span>
        <div class="h-sm w-[190px] rounded-md border border-control bg-inset"></div>
      </div>
      <div class="flex flex-col gap-[2rem]">
        <span class="text-caption text-ink-muted">Port</span>
        <div class="h-sm w-[190px] rounded-md border border-control bg-inset"></div>
      </div>
    </div>
  </template>
</DoDont>

### Nesting steps down

A nested container takes an inset one step below its parent. `p-4` on the pane, `p-2` on the card inside it, and the step alone makes the depth readable without drawing a line.

Double insetting, a padded pane holding a padded scroll container, is the usual source of an unexplained two rem gap. One inset per nesting level, owned by one container.

Data surfaces are the exception. A table fills its pane edge to edge and the cells carry the inset, so the first column never starts an extra rem in.

<DoDont
  do="Pane at one rem, card at half a rem: the step reads."
  dont="Pane at one rem, card at one rem: the step disappears.">
  <template #do>
    <div class="rounded-lg bg-subtle p-[1rem]">
      <div class="rounded-md border border-separator bg-raised p-[0.5rem] text-caption text-ink-muted">row</div>
    </div>
  </template>
  <template #dont>
    <div class="rounded-lg bg-subtle p-[1rem]">
      <div class="rounded-md border border-separator bg-raised p-[1rem] text-caption text-ink-muted">row</div>
    </div>
  </template>
</DoDont>

### Gaps belong to the container

The container owns the distance between its children, through `gap`. The product already reads that way: 855 gap utilities against 142 margins, six `space-x` or `space-y` classes and six negative margins.

A margin on a component's outermost element makes its footprint stop matching its box, so two consumers place it differently and neither can override cleanly. Utility classes that space children by margin skip the first child, so a reordered or conditional child breaks the sequence.

Read a negative margin as a defect report against the parent's padding, and fix the parent. Left alone, the compensation outlives its cause.

### Size is a prop, not a height

Controls do not carry heights. They carry a `size` prop, and the PrimeVue preset turns it into a padding pair, so the height falls out of the line box plus that padding.

`size="small"` is the product's working default at 218 call sites; `size="large"` appears twice. Controls sharing a row must share the prop, because a button that omits it grows by a padding step and the baseline breaks.

Icon-only buttons are the one fixed dimension: the preset swaps the horizontal padding for `w-10 px-0`, so a 2.5rem width holds the target once the label is gone.

<DoDont
  do="Both buttons take the sm size, so the baseline holds."
  dont="Cancel takes the md size, so the baseline breaks.">
  <template #do>
    <DsButton size="sm" variant="primary" label="Send" />
    <DsButton size="sm" variant="ghost" label="Cancel" />
  </template>
  <template #dont>
    <DsButton size="sm" variant="primary" label="Send" />
    <DsButton size="md" variant="ghost" label="Cancel" />
  </template>
</DoDont>

### Row height follows the type ramp

Virtualised tables compute their row height as `fontSize.value * 1.5`, in twelve places across HTTP history, search, findings, sitemap, intercept, websockets, automate and replay.

That is deliberate here. The row holds one line of text, the slider that sets the row height is the same slider that sets the text size, and the two cannot fall out of step.

It also means a row is 18px for a reader at the 12px setting. Anything a pointer has to hit inside that row needs its own floor rather than the row's height.

### Container width, not viewport width

A pane can be 200px wide on a 4K display, so layout inside a pane responds to its container. The product agrees by a wide margin: 61 container-query variants against 17 viewport breakpoints.

The automate tree shows the full order of sacrifice in one component. Above 14rem it draws a title, a labelled button and a `pl-4` inset; between 8rem and 14rem the title goes, the button keeps its icon and its `aria-label`, and the inset drops to `px-1`; below 8rem the list body hides entirely.

Thresholds are in rem while the pane is measured in pixels, which is correct. A container query asks whether the content still fits, and content size is type size, so a pane has to collapse at a wider pixel width once the reader scales type up.

### Raw lengths

Scoped styles reference the ramp 189 times and write a raw length on a spacing property 27 times. Markup adds 74 arbitrary length utilities on top of that.

A raw length has no owner and no audit trail. It cannot be found by anyone looking for every place the product spaces at half a rem, and it does not move when the ramp does.

The tell is a raw value sitting beside its own token, in the same block, meaning the same thing:

```css
&__field-row {
  gap: var(--c-space-2);
}

&--resolve-dns {
  gap: 0.5rem;
}
```

</template>

<template #reference>

### Ramp values

Uses counts `var(--c-space-N)` references in scoped styles across every package.

| Token | rem | px at 14 root | Tailwind key | Uses |
|---|---|---|---|---|
| `--c-space-0` | 0 | 0 | `0` | 0 |
| `--c-space-1` | 0.25rem | 3.5 | `1` | 24 |
| `--c-space-2` | 0.5rem | 7 | `2` | 88 |
| `--c-space-3` | 0.75rem | 10.5 | `3` | 2 |
| `--c-space-4` | 1rem | 14 | `4` | 63 |
| `--c-space-8` | 2rem | 28 | `8` | 12 |
| `--c-space-10` | 2.5rem | 35 | `10` | 0 |
| `--c-space-12` | 3rem | 42 | `12` | 0 |

Three rungs are declared and never referenced. Steps 10 and 12 do their work as heights instead, and step 0 is spelled `p-0` in markup.

### The ramp at each font size

The slider runs 12 to 24 in steps of 1. These are the ends and the default.

| Token | 12px root | 14px default | 24px root |
|---|---|---|---|
| `--c-space-1` | 3 | 3.5 | 6 |
| `--c-space-2` | 6 | 7 | 12 |
| `--c-space-3` | 9 | 10.5 | 18 |
| `--c-space-4` | 12 | 14 | 24 |
| `--c-space-8` | 24 | 28 | 48 |
| `--c-space-10` | 30 | 35 | 60 |
| `--c-space-12` | 36 | 42 | 72 |

### Control padding by size

Straight from the Caido PrimeVue button preset. Height is the line box plus these values, never a height token.

| `size` | Vertical | Horizontal | Notes |
|---|---|---|---|
| `"small"` | `py-1.5`, 0.375rem | `px-3`, 0.75rem | 218 call sites, the working default |
| unset | `py-2`, 0.5rem | `px-3`, 0.75rem | the preset default, rarely used directly |
| `"large"` | `py-3`, 0.75rem | `px-4`, 1rem | two call sites |
| icon only | unchanged | `px-0` | fixed `w-10`, 2.5rem wide |

A button with a label also carries `gap-2`, so 0.5rem is the icon to label distance everywhere.

### Table cell padding

Header and body cells take the same pair, so a column stays aligned through the header.

| `size` | Vertical | Horizontal |
|---|---|---|
| `"small"` | 0.375rem | 0.5rem |
| unset | 0.75rem | 1rem |
| `"large"` | 0.9375rem | 1.25rem |
| cell being edited | 0.6rem | 0.5rem |

### Heights that act as bars

The three largest rungs appear as heights rather than gaps. This is the whole bar ladder in the product.

| Class | rem | px at 14 root | Uses | Holds |
|---|---|---|---|---|
| `h-8` | 2 | 28 | 12 | tab strips, segmented controls |
| `h-10` | 2.5 | 35 | 25 | toolbar rows, list rows |
| `h-12` | 3 | 42 | 42 | page headers, usually with `p-4` inside |

`min-h-10` and `min-h-11` appear eleven times between them, where a bar has to survive content that wants to be shorter. The 281 uses of `min-h-0` are the flex overflow idiom and have nothing to do with spacing.

### Container thresholds in use

Two arbitrary widths and five named ones from `@tailwindcss/container-queries`. There are four `@container` roots: the automate tree, the replay collections pane and both replay toolbars.

| Variant | Width | What changes at it |
|---|---|---|
| `@[8rem]:` | 8rem | the list body appears; below this the pane is chrome only |
| `@[14rem]:` | 14rem | titles and button labels appear, inset goes `px-1` to `pl-4` |
| `@sm:` | 24rem | toolbar groups take column spans and spread over three rows |
| `@md:` | 28rem | an action group justifies to the right edge |
| `@xl:` | 36rem | groups restate row 3, holding the three-row layout |
| `@2xl:` | 42rem | four groups move up to row 1 |
| `@4xl:` | 56rem | every group sits on row 1 |

The replay toolbar is a twelve-column grid at `gap-2` and `p-2`. Panes that collapse are floored with `min-w-16`, which is 4rem, half the first threshold.

### What the system does not have

Worth stating, because a spec that describes machinery the product lacks is worse than one that leaves it out.

| Absent | Reality |
|---|---|
| Density modes | No `data-density` attribute exists. The font size slider is the density control |
| Named role tokens | No inset, squish, stack or inline tokens ship. Roles are conventions on the ramp |
| A control height ladder | Height comes from the `size` prop and its padding pair |
| Bar height tokens | Bars are `h-8`, `h-10` and `h-12` in markup |
| Threshold tokens | Container widths are written inline, as `@[8rem]:` or a named variant |

</template>

</PageTabs>
