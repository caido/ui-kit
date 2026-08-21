# Motion

Motion says what changed and where it came from. It is never decoration, because every animation in a work tool is paid for thousands of times in one session.

Frequency sets the numbers. A pentester keeps Caido open all day and arrows through thousands of HTTP rows. Duration is chosen by how often an interaction fires, not by how large it looks.

Durations are absolute milliseconds, never relative units. The Caido UI font size is a user setting, and someone who enlarges the interface wants larger text, not slower menus.

## What the product does today

Motion is the one foundation Caido has not tokenised. Neither `packages/ui/tailwind.config.js` nor `packages/components/tailwind.config.js` extends `transitionDuration` or `transitionTimingFunction`, so both files fall through to stock Tailwind.

| Measured across `packages/*/src` | Result |
|---|---|
| Distinct durations in use | Six: 50, 100, 150, 200, 300 and 1000ms |
| Distinct easings in use | Three: `ease-in`, `ease-out`, `ease-in-out` |
| `transition-all` declarations | Nine, across four advanced drawers and the app shell |
| `prefers-reduced-motion` blocks | One, the onboarding confetti in `Checklist/Celebration.vue` |
| Motion rungs named in either Tailwind config | Zero |

Every value below is therefore a target this page sets, not a value already in the tree. The rest of the system was measured out of the product; this section was measured to be replaced.

## Duration

Pick the duration from how often the interaction fires, then check it against the distance travelled.

| Class | ms | Use for |
|---|---|---|
| `transition-none` | 0 | Row hover and selection in lists above 1000 rows |
| `duration-1` | 70 | Hover and press colour, state layers, checkbox fill |
| `duration-2` | 110 | Fades, tooltip appearance, badge colour swaps |
| `duration-3` | 150 | Menu, popover and dropdown entrance |
| `duration-4` | 240 | Panel expand, modal entrance, drawer slide |

Anything under 100ms reads as instant, which is why state feedback sits at 70ms. Carbon's slower rungs, 400ms and 700ms, are left unexposed on purpose, because nothing in a proxy is worth waiting that long for.

Exits run at 0.7 of their entrance: 100ms against a 150ms entrance, 170ms against 240ms.

<DoDont
  do="At 70ms the hover colour lands before the pointer settles."
  dont="At 400ms the hover colour trails the pointer across the row.">
  <template #do>
    <div class="flex h-xl w-36 items-center justify-center rounded-md border border-separator bg-subtle text-body text-ink-muted transition-colors duration-1 ease-standard hover:bg-selected hover:text-ink">Hover me</div>
  </template>
  <template #dont>
    <div class="flex h-xl w-36 items-center justify-center rounded-md border border-separator bg-subtle text-body text-ink-muted transition-colors duration-[400ms] ease-standard hover:bg-selected hover:text-ink">Hover me</div>
  </template>
</DoDont>

Never invent a value between the rungs because a transition feels slightly off. A one-off 180ms is unanchored, cannot be audited, and multiplies on contact with the next component.

The product already holds 50, 100, 200, 300 and 1000ms alongside each other. That is what an unanchored value looks like once it has had a few years to spread.

## Easing

Entrances decelerate and exits accelerate. An element arriving was already moving before you saw it, so it settles into rest. An element leaving never stops on screen, so frames spent slowing it down are frames the user waits through.

| Class | Curve | Use for |
|---|---|---|
| `ease-enter` | cubic-bezier(0, 0, 0.38, 0.9) | Every entrance: menu, popover, dialog, drawer |
| `ease-exit` | cubic-bezier(0.2, 0, 1, 0.9) | Every matching exit, at 0.7 of the entrance |
| `ease-standard` | cubic-bezier(0.2, 0, 0.38, 0.9) | Motion that starts and ends on screen |
| `ease-linear` | linear | Anything at or under 70ms, and the backdrop dim |

These are Carbon's productive curves, and the duration ladder is Carbon's productive set as well, so time and curve come from one source rather than two.

```html
<div class="transition-[opacity,transform] duration-3 ease-enter">Entering</div>
<div class="transition-[opacity,transform] duration-[100ms] ease-exit">Leaving</div>
```

<DoDont
  do="The panel leaves in 100ms, faster than its 150ms entrance."
  dont="The panel leaves in 150ms, as slowly as its entrance.">
  <template #do>
    <div class="group relative h-24 w-52 rounded-md border border-dashed border-separator p-2 text-caption text-ink-faint">Hover to open
      <div class="absolute inset-x-2 bottom-2 flex h-xl -translate-y-2 items-center rounded-md border border-separator bg-raised px-3 text-body text-ink opacity-0 transition-[opacity,transform] duration-[100ms] ease-exit group-hover:translate-y-0 group-hover:opacity-100 group-hover:duration-3 group-hover:ease-enter motion-reduce:translate-y-0 motion-reduce:transition-opacity">Filter</div>
    </div>
  </template>
  <template #dont>
    <div class="group relative h-24 w-52 rounded-md border border-dashed border-separator p-2 text-caption text-ink-faint">Hover to open
      <div class="absolute inset-x-2 bottom-2 flex h-xl -translate-y-2 items-center rounded-md border border-separator bg-raised px-3 text-body text-ink opacity-0 transition-[opacity,transform] duration-3 ease-exit group-hover:translate-y-0 group-hover:opacity-100 group-hover:duration-3 group-hover:ease-enter motion-reduce:translate-y-0 motion-reduce:transition-opacity">Filter</div>
    </div>
  </template>
</DoDont>

<DoDont
  do="The menu decelerates into place and stops where it lands."
  dont="The menu overshoots and re-crosses pixels it had already passed.">
  <template #do>
    <div class="group relative h-24 w-52 rounded-md border border-dashed border-separator p-2 text-caption text-ink-faint">Hover to open
      <div class="absolute inset-x-2 bottom-2 flex h-xl -translate-y-3 items-center rounded-md border border-separator bg-raised px-3 text-body text-ink opacity-0 transition-[opacity,transform] duration-[100ms] ease-exit group-hover:translate-y-0 group-hover:opacity-100 group-hover:duration-3 group-hover:ease-enter motion-reduce:translate-y-0 motion-reduce:transition-opacity">Filter</div>
    </div>
  </template>
  <template #dont>
    <div class="group relative h-24 w-52 rounded-md border border-dashed border-separator p-2 text-caption text-ink-faint">Hover to open
      <div class="absolute inset-x-2 bottom-2 flex h-xl -translate-y-3 items-center rounded-md border border-separator bg-raised px-3 text-body text-ink opacity-0 transition-[opacity,transform] duration-[100ms] ease-exit group-hover:translate-y-0 group-hover:opacity-100 group-hover:duration-3 group-hover:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:translate-y-0 motion-reduce:transition-opacity">Filter</div>
    </div>
  </template>
</DoDont>

Pair the curves on both halves of one overlay, so it reads as a single object arriving and leaving. No spring, bounce or overshoot anywhere in the product.

## Travel sets the duration

Duration grows with distance, sub-linearly. Doubling the travel does not double the time, because the eye judges perceived speed rather than elapsed milliseconds.

- 4px chevron rotation on an accordion header: `duration-2`
- 8px menu or popover drop: `duration-3`
- 16px modal entrance: `duration-4`
- 240px to 400px drawer slide: `duration-4`

A chevron and a drawer differ by a factor of 100 in travel and by a factor of 2.2 in time. Step up one rung when travel grows by about an order of magnitude, not one rung per doubling.

Hold entrance offsets small: 8px for menus and popovers, 16px for modals. A small offset lets a short duration read as deliberate movement instead of a jump.

## Transition properties

Every transition names the properties it touches. `transition-all` is banned, because it opts every property into the animation, including properties nobody chose to animate.

```html
<button class="transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-3 ease-standard">Save</button>
```

| Property | Work per frame | Verdict |
|---|---|---|
| `transform`, `opacity` | composite only | preferred |
| `background-color`, `border-color`, `color`, `box-shadow` | paint | allowed |
| `width`, `height`, `top`, `left`, `padding` | layout, paint, composite | never |

Two shipping components show the cost. `CProgress.vue` runs `transition-width duration-1000`, and `CVerticalScroll/Container.vue` toggles between `h-5` and `h-0` under `transition-all duration-300`, so both do layout work on every frame for the whole run.

Express size and position change as `translate` or `scale`, never as `width`, `height`, `top` or `left`. A splitter gutter that declares `transition-all` animates its own position during a drag, so the handle trails the pointer by the transition duration.

## Colour inside a transition

The from and to colours of any transition are role classes such as `bg-subtle` and `bg-selected`. A numbered rung binds one theme into a rule that both themes run.

`WebsocketTag.vue` shows the failure: `bg-success-400/45 dark:bg-emerald-400/45` needs a second declaration for the second theme, and a role class would have needed none.

Elevation inverts between the two themes, so this is not cosmetic. In dark a raised surface is lighter than the canvas. In Paper a raised sheet is white on a warm desk and an inset goes darker than the page, because a light theme runs out of lightness headroom fast.

The scrim behind a modal follows the same rule. It is a token, not a literal: pure black at 40 percent in dark, warm ink at 32 percent in Paper, because a neutral black over a 32 degree canvas reads as dirt.

## Reduced motion

Under `prefers-reduced-motion: reduce`, kill spatial movement and opt colour and opacity back in at 100ms.

WCAG 2.2 SC 2.3.3 covers animation triggered by interaction. Its Understanding document draws the usable line. Changes in colour, blurring or opacity that do not change perceived size, shape or position are not motion animation.

So translate, scale, rotate, parallax, drawer slides, large spinners and smooth scrolling are killed. Colour, border colour, opacity and shadow transitions return at 100ms. The caret blink and the focus ring stay, because each one says where input goes.

<DoDont
  do="Under reduce, the selected row keeps its background colour."
  dont="Under reduce, the selected row loses its background colour too.">
  <template #do>
    <div class="w-56 overflow-hidden rounded-md border border-separator font-mono text-code">
      <div class="border-b border-separator px-2.5 py-1.5 text-ink-muted">GET /api/users</div>
      <div class="border-b border-separator bg-selected px-2.5 py-1.5 text-ink">POST /api/login</div>
      <div class="px-2.5 py-1.5 text-ink-muted">GET /assets/app.js</div>
    </div>
  </template>
  <template #dont>
    <div class="w-56 overflow-hidden rounded-md border border-separator font-mono text-code">
      <div class="border-b border-separator px-2.5 py-1.5 text-ink-muted">GET /api/users</div>
      <div class="border-b border-separator px-2.5 py-1.5 text-ink-muted">POST /api/login</div>
      <div class="px-2.5 py-1.5 text-ink-muted">GET /assets/app.js</div>
    </div>
  </template>
</DoDont>

Components express the policy with Tailwind's `motion-reduce:` variant. The global floor ships once in the base stylesheet, so a new component inherits it without opting in. A per-component policy is one that new components skip.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  :where(a, button, [role="button"], [role="option"], tr, li) {
    transition-property: background-color, border-color, color, opacity, box-shadow !important;
    transition-duration: 100ms !important;
  }
}
```

One block of this shape exists in the product today, scoped to the onboarding confetti. The floor above replaces it and covers `animate-pulse`, `animate-spin` and `animate-ping`, which currently run without one.

A killed spinner is replaced by a determinate indicator under 24px, never by nothing. Shortening a spatial animation is not a substitute for removing it, since parallax at 100ms crosses the same pixels.

WCAG 2.2 SC 2.2.2 governs motion the interface starts on its own. Anything moving past five seconds beside other content needs a visible, keyboard-reachable pause, so a live-tailing request table carries one.

Bound an ambient loop instead of letting it run. The skeleton sheen is declared as `sheen 1600ms linear 3`, which stops at 4.8 seconds and never reaches the five second limit in the first place.
