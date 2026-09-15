---
outline: false
pageClass: wide
---

# Skeleton and loading

Every wait gets one of three renderings: nothing, a skeleton, or a spinner. Two facts decide which, and both are known at the call site: how long the wait lasts, and whether the shape of the arriving content is known before it arrives.

A skeleton is a promise about geometry. It reserves the exact box the content will occupy. A spinner makes no such promise, so it is only correct where no promise can be made.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Shapes

Three shapes cover every unknown: a line of text, a block of unknown structure, and a circle for an avatar.

<Preview title="Skeleton shapes" note="line box 20, bar 8, last line 60%">
  <DsSkeleton variant="text" :lines="3" />
  <DsSkeleton variant="block" width="200px" height="96px" :radius="6" />
  <DsSkeleton variant="block" width="40px" height="40px" :radius="999" />
</Preview>

### Table rows

Skeleton rows carry the real row height and the real cell inset, so arriving records move nothing.

<Preview title="Skeleton row" note="4 rows at 28px, one bar per column">
  <DsSkeleton variant="row" :rows="4" />
</Preview>

Density picks the row height, matching the table the skeleton stands in for rather than a ladder of its own.

<Preview title="Row density" note="dense 28 / comfortable 32">
  <DsSkeleton variant="row" density="dense" :rows="3" />
  <DsSkeleton variant="row" density="comfortable" :rows="3" />
</Preview>

### Text roles

Bar height follows the type role the text will arrive in, so the line box is identical before and after.

<Preview title="Text roles" note="caption 16 / body-dense 18 / body 20 / title 24">
  <DsSkeleton variant="text" text-role="caption" :lines="2" />
  <DsSkeleton variant="text" text-role="body-dense" :lines="2" />
  <DsSkeleton variant="text" text-role="body" :lines="2" />
  <DsSkeleton variant="text" text-role="title" :lines="2" />
</Preview>

### Spinner

A spinner is correct only where the incoming geometry is unknown, and at region scale it always carries text.

<Preview title="Spinner" note="mark 24, stroke 2, text is the message" spread>
  <DsSkeleton variant="spinner" size="md" label="Loading requests…" />
  <DsSkeleton variant="spinner" size="sm" label="Sending" />
  <DsSkeleton variant="spinner" size="sm" label="Sending request" hide-label />
</Preview>

The three marks sit in the icon ladder at 16, 24 and 32, with stroke 2, 2 and 3.

<Preview title="Spinner sizes" note="16 / 24 / 32, stroke 2 / 2 / 3" center spread>
  <DsSkeleton variant="spinner" size="sm" label="Small" />
  <DsSkeleton variant="spinner" size="md" label="Medium" />
  <DsSkeleton variant="spinner" size="lg" label="Large" />
</Preview>

### Progress bars

The 2px indeterminate bar refreshes content already on screen, and the 4px determinate bar carries a real count. The count reads before the bar, because the count is the answer and a bare percentage is a second question.

<Preview title="Progress" note="2px indeterminate, 4px determinate, count first">
  <DsSkeleton variant="progress-indeterminate" label="Refreshing requests…" />
  <DsSkeleton variant="progress-determinate" :value="0" :max="3180" noun="requests" />
  <DsSkeleton variant="progress-determinate" :value="142" :max="3180" noun="requests" />
  <DsSkeleton variant="progress-determinate" :value="3180" :max="3180" noun="requests" />
</Preview>

### Sheen

One sheen sweeps the whole region and stops after three passes. The right-hand block is the reduced-motion rendering.

<Preview title="Sheen, and the same skeleton without it" note="sheen stops after 3 passes, 4.8s">
  <DsSkeleton variant="text" :lines="3" />
  <DsSkeleton variant="text" :lines="3" :sheen="false" />
</Preview>

### Lifecycle

Load twice and watch the box: the container holds one geometry from pending through resolved, so nothing shifts.

<Preview title="Interactive: the lifecycle, at the real row height">
  <DsSkeleton demo />
</Preview>

- The 120ms load paints no indicator at all, because the 400ms gate has not elapsed.
- The container carries `aria-busy` while work is in flight.
- A visually hidden `role="status"` region announces the start, then the result count.

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `text` `block` `row` `spinner` `progress-indeterminate` `progress-determinate` | `text` | Which of the six renderings. |
| `textRole` | `body` `body-dense` `caption` `title` | `body` | Type role the text skeleton stands in for. |
| `lines` | number | `3` | Text lines. The last is 60% wide when there is more than one. |
| `width` | string | `240px` | Block width. Required in practice. |
| `height` | string | `120px` | Block height. Required in practice. |
| `radius` | number | `6` | Block radius in px. The replaced component's radius, not the bar radius. |
| `rows` | number | `4` | Skeleton rows. Compute it from the container height. |
| `columns` | string[] | four tracks | Grid tracks for the row variant. One bar per track. |
| `density` | `dense` `comfortable` | `dense` | Row height 28 or 32px. |
| `size` | `sm` `md` `lg` | `md` | Spinner mark 16, 24 or 32px. |
| `label` | string | `Loading requests…` | Status string. Visible on region spinners, announced everywhere. |
| `hideLabel` | boolean | `false` | In-control spinners only. The mark becomes the progressbar. |
| `value` | number | `142` | Determinate progress: units done. |
| `max` | number | `3180` | Determinate progress: total units. |
| `noun` | string | `requests` | Plural noun in the count string. |
| `sheen` | boolean | `true` | One sheen pass per region. Off gives the reduced-motion rendering. |
| `demo` | boolean | `false` | Runs the real gate, hold and swap lifecycle. |

### Class strings

```html

<div class="relative flex w-full max-w-[320px] flex-col gap-2 overflow-hidden" aria-busy="true">
  <span class="flex h-[20px] items-center" aria-hidden="true">
    <span class="block h-[8px] w-full rounded-xs bg-inset"></span>
  </span>
</div>

<div class="grid h-sm items-center gap-x-3 border-t border-separator px-3">
  <span class="block h-[8px] w-full rounded-xs bg-inset" aria-hidden="true"></span>
</div>

<span class="pointer-events-none absolute inset-y-0 left-0 w-2/5 animate-sheen bg-gradient-to-r
             from-transparent via-selected to-transparent motion-reduce:hidden" aria-hidden="true"></span>

<span class="h-6 w-6 animate-spin rounded-full border-2 border-inset border-t-ink-muted"
      aria-hidden="true"></span>

<div class="h-[4px] overflow-hidden rounded-xs bg-inset" role="progressbar" aria-valuemin="0"
     aria-valuemax="3180" aria-valuenow="142" aria-valuetext="142 of 3,180 requests">
  
  <span class="block h-full rounded-xs bg-accent" style="width: 4%"></span>
</div>
```

Colours are role classes, never hex, so `bg-inset` and `border-t-ink-muted` make the same markup correct in light and dark. Only two values stay inline, both computed per render: the row variant's grid tracks, which belong to the table, and the determinate fill's width.

### Bar height arithmetic

A bar stands in for a line of text, so its height comes from the text's ink, not from its line box.

Arial's x-height is 1062 units on a 2048-unit em, a ratio of 0.519. Sizing to the x-height makes a bar read as lowercase text. Sizing to the cap height, 0.716 em, makes every placeholder look like a heading.

```
bar_height = round_to_even( font_size × 0.519 )

  caption   12 × 0.519 = 6.23  →  6
  body      14 × 0.519 = 7.27  →  8
  title     16 × 0.519 = 8.31  →  8
  heading   20 × 0.519 = 10.4  →  10
  display   32 × 0.519 = 16.6  →  16
```

Rounding is to even values because the geometry grid is even throughout. An odd bar in an even line box puts a half pixel on one side when the bar is centred.

### Box height arithmetic

Every skeleton reproduces the box of the thing it replaces, using that thing's own formula:

```
height = line box + (2 × padding-block) + (2 × border)
```

| Case | Line box | Padding-block | Height | Bar | Space above and below |
|---|---|---|---|---|---|
| Table row, dense | 18 (`body-dense`) | 5 | **28** | 8 | (28 − 8) / 2 = **10** |
| Table row, comfortable | 18 | 7 | **32** | 8 | (32 − 8) / 2 = **12** |
| Menu item | 14 (`label` 14 / 1) | 6 plus 1px border | **28** | 8 | (28 − 8) / 2 = **10** |
| Form control | 14 (`field` 14 / 1) | 8 plus 1px border | **32** | 8 | (32 − 8) / 2 = **12** |
| Paragraph line | 20 (`body`) | 6 | **20** | 8 | (20 − 8) / 2 = **6** |
| Caption line | 16 (`caption`) | 5 | **16** | 6 | (16 − 6) / 2 = **5** |
| Panel header | 24 (`title`) | 4 | **32** | 8 | (32 − 8) / 2 = **12** |

The padding-block column is the real component's padding. The skeleton inherits it by rendering inside the real container, and the bar is centred by the alignment that already centres the text.

</template>

<template #usage>

### When to use

A loading state holds the geometry of content that has not arrived, and says in text that the system is working. It does not fill silence, re-acknowledge a click, or make a fast operation feel substantial.

Answer these four questions in order, at the call site. The first yes decides the rendering.

| # | Question | Render | Why |
|---|---|---|---|
| 1 | Is the region already showing content the user can read? | A 2px indeterminate bar on the container rule, content untouched | Replacing readable content destroys the reading position to say what 2px says. |
| 2 | Will the wait finish inside the 400ms gate? | Nothing at all | An indicator that appears and vanishes reads as a flicker, worse than the wait it hid. |
| 3 | Is the incoming shape known: row height, column count, block size? | A skeleton, laid out by the classes the real content uses | The skeleton reserves the real box, so arrival is a repaint. The only rendering with zero layout shift. |
| 4 | Otherwise | A spinner centred in the region, with visible text | Nothing is known about the geometry, so a placeholder would be a lie about size. |

There is no fifth branch. A region never takes both a skeleton and a spinner, and a page never takes a full-screen overlay while a sub-region also loads.

<DoDont
  do="Reserve the real rows, so arrival repaints and moves nothing."
  dont="The spinner reserves the wrong box, so arriving rows shove the page.">
  <template #do>
    <DsSkeleton variant="row" :rows="4" />
  </template>
  <template #dont>
    <DsSkeleton variant="spinner" size="lg" label="Loading requests…" />
  </template>
</DoDont>

### Timing ladder

Three constants gate every indicator in the product. They are tokens, not per-feature judgement calls.

| Token | Value | What it gates |
|---|---|---|
| `--c-load-gate` | **400ms** | No indicator renders before this much time has passed since the request started. |
| `--c-load-min-visible` | **500ms** | Once rendered, an indicator stays at least this long, even if data arrives sooner. |
| `--c-load-stall` | **10s** | An indeterminate indicator must become determinate, and a cancel control becomes mandatory. |

Each number comes from a published response-time limit. The gate itself follows Nielsen Norman Group's first limit, 0.1s, "the limit for having the user feel that the system is reacting instantaneously".

| Constant | The arithmetic | Basis |
|---|---|---|
| Gate plus hold | A request resolving at 401ms is held to 900ms | Nielsen Norman Group's second limit, 1.0s: "the limit for the user's flow of thought to stay uninterrupted" |
| Hold on its own | Without it, a skeleton paints at 400ms and is gone at 460ms | The user perceives a flash carrying no information |
| Stall at 10s | The indicator turns determinate and a cancel control appears | Nielsen Norman Group's third limit, 10s: "the limit for keeping the user's attention focused on the dialogue" |

900ms leaves 100ms of headroom. A 1s gate would push the worst case to 1.5s and break the limit. Past 10s the user leaves, and an indeterminate mark gives no basis for deciding whether to keep waiting.

Under 400ms nothing renders at all: no skeleton, no spinner, no dimming, no cursor change. Between 400ms and 1s the initiating control takes its own loading state in place, and the region gets no indicator of its own.

### Use something else when

| The situation | Use | Because |
|---|---|---|
| The region holds content and is being refreshed | The 2px indeterminate bar. See [Data table](/components/data-table.md) | A skeleton over readable content loses scroll position, selection and place. |
| A single control is committing an action | That control's loading state | The acknowledgement belongs where the click landed. |
| The request returned zero records | Empty state | A skeleton promises content that will never arrive. |
| Results stream in progressively | Arriving rows plus a live count, never a synthetic percentage | The rows are the progress indicator. |
| Work continues without the user waiting | A background task surface | Blocking a region removes the user's ability to keep working. |
| The request failed or timed out | Inline error block with retry | A skeleton that never resolves looks like a hung application. |
| The change is a local write that will succeed | Apply optimistically, then reconcile | An indicator on a 30ms rename adds latency where there was none. |

- Treat an unknown incoming shape as an API defect, not as a reason to weaken the rendering.
- Never stack a page skeleton, a panel spinner and a button spinner in one view.

### Anatomy

```
  SKELETON ROW                        replaces one data-table or list row

  ├────────────── the real row box, height = --c-row-h ──────────────────┤
  ┌───────────────────────────────────────────────────────────────────────┐
  │      ░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░       ┌──▶ │ 1
  │  ↑   └──── 2 ─────┘  └──────── 2 ────────────┘  └─── 2 ───┘      │    │
  └──┼───────────────────────────────────────────────────────────────┼────┘
     3                                                               3
     --c-cell-pad-x, the real cell inset            bar height 8, centred:
                                                    10 above, 10 below at row-h 28

     ══════════════════════════════════════▶  4   one sheen pass per region
```

| # | Part | Required | Rule |
|---|---|---|---|
| 1 | **Container** | Yes | The real container with the real layout, carrying `aria-busy="true"`. |
| 2 | **Bar** | Yes | `bg-inset`, radius `rounded-xs` 2px, height from the type role. Always `aria-hidden="true"`. |
| 3 | **Inset** | Yes | The real inset of the real content. A skeleton with its own padding reserves the wrong box. |
| 4 | **Sheen** | No | One animated pass across the whole region, so one composited layer instead of dozens. Never one animation per bar. |

```
  REGION SPINNER                      shape of incoming content unknown

  ┌───────────────────────────────────────────────────────────────────────┐
  │                                                                       │
  │                              ◜◝                                       │ 5  arc
  │                             ◟  ◞                                      │ 6  track
  │                                                                       │
  │                        Loading requests…                              │ 7  status text
  │                                                                       │
  │                          [ Cancel ]                                   │ 8  cancel
  └───────────────────────────────────────────────────────────────────────┘
```

| # | Part | Required | Rule |
|---|---|---|---|
| 5 | **Arc** | Yes | The moving segment. Must reach 3:1 against the region background. |
| 6 | **Track** | No | The static remainder at `bg-inset`. Omitted at 16px, where it muddies the arc. |
| 7 | **Status text** | Yes, at region and pane scale | A visible string naming what is loading. A spinner with no text is a shape with no meaning. |
| 8 | **Cancel** | Only past 10s | A real button. Never a link, never an icon with no label. |

The third rendering has no parts to label. The refresh bar is 2px painted onto the container's leading rule, replacing nothing, and that rule keeps its width and colour. Content rows stay in place with scroll offset, text selection and row focus preserved.

One indicator owns one region. A region is a box with a single loading lifecycle: a table body, a detail pane, a dialog body, a menu list. Nested regions get their own indicator only when they resolve independently.

<DoDont
  do="Keep the status text beside the spinner, naming what loads."
  dont="Without visible text, the reader cannot tell what is loading.">
  <template #do>
    <DsSkeleton variant="spinner" size="md" label="Loading requests…" />
  </template>
  <template #dont>
    <DsSkeleton variant="spinner" size="md" label="Loading requests…" hide-label />
  </template>
</DoDont>

- Never give a skeleton a border, shadow or background the real content will not have.
- Never animate bars out of phase to look organic.
- Never nest a spinner inside a skeleton.

### Variants

Six renderings, one per shape the system stands in for, and a seventh would need a seventh shape. Three shapes of unknown (a line of text, a block, a repeating row), one indeterminate mark for the shape-unknown case, and two linear bars, because Material 3 splits linear progress into determinate and indeterminate.

Shopify Polaris ships skeleton primitives for body text, display text and thumbnails, and GitHub Primer ships a box, a text line and an avatar. Both split on shape and both stop at three.

| Variant | Use when | Rule |
|---|---|---|
| **`text`** | The arriving text sits on a known type role | Bar height derives from the role. The last of several lines is 60% wide. |
| **`block`** | The box is known but the contents are not | Radius matches the replaced component. Requires an explicit width and height, since a block with no dimensions reserves nothing. |
| **`row`** | The initial load of a record surface | Row height is exactly the real row height. One bar per column. |
| **`spinner`** | No skeleton can be honest about geometry | Always paired with visible text at region and pane scale. |
| **`progress-indeterminate`** | A populated region is refreshing | The only variant permitted over readable content. |
| **`progress-determinate`** | Work has a countable unit | Carries `aria-valuenow` and a visible count. |

There is no full-screen blocking overlay. A modal curtain removes the ability to read, cancel, switch tabs or copy a value, in exchange for what a 2px bar delivers. If a whole route is loading, each of its regions renders its own skeleton.

<DoDont
  do="Show the real count: 142 of 3,180 requests."
  dont="The bar hides how far along countable work is.">
  <template #do>
    <DsSkeleton variant="progress-determinate" :value="142" :max="3180" noun="requests" />
  </template>
  <template #dont>
    <DsSkeleton variant="progress-indeterminate" label="Loading requests…" />
  </template>
</DoDont>

- Determinate beats indeterminate whenever a real total exists, including under 10s.
- Never drive a determinate bar from elapsed time.
- Never use `progress-indeterminate` over an empty region.

### Sizes

Every skeleton size is derived from the component it replaces. It has no independent ladder, because a second ladder is a second geometry that will not match the first. Every variant has a border of 0.

| Variant and size | Height | Type role stood in for | Padding-inline | Padding-block | Gap | Radius or mark |
|---|---|---|---|---|---|---|
| `text`, body | **20** | `body` 14 / 20 | inherits the container | **6** | **8** between lines | 2 |
| `text`, body-dense | **18** | `body-dense` 14 / 18 | inherits | **5** | **8** | 2 |
| `text`, caption | **16** | `caption` 12 / 16 | inherits | **5** | **6** | 2 |
| `text`, title | **24** | `title` 16 / 24 | inherits | **8** | **8** | 2 |
| `row`, dense | **28** (`--c-row-h`) | `body-dense` 14 / 18 | `--c-cell-pad-x` | **10** | `--c-cell-pad-x` between column bars | 2 |
| `row`, comfortable | **32** | `body-dense` 14 / 18 | `--c-cell-pad-x` | **12** | `--c-cell-pad-x` | 2 |
| `block` | the replaced height, or an aspect ratio | n/a | 0 | 0 | n/a | the replaced radius |
| `spinner`, sm | **28** (the control it sits in) | `label` 14 / 1 beside it | 8 | **6** | **8** to the label | mark **16**, stroke **2** |
| `spinner`, md | **24** mark in a region | `body` 14 / 20 beneath | 0 | region inset | **12** to the text | mark **24**, stroke **2** |
| `spinner`, lg | **32** mark in a full pane | `body` 14 / 20 beneath | 0 | region inset | **16** to the text | mark **32**, stroke **3** |
| `progress-indeterminate` | **2** | n/a | 0 | 0 | n/a | 0 |
| `progress-determinate` | **4** bar, **24** with its label row | `caption` 12 / 16 for the count | 0 | 0 | **4** between label row and bar | 2 on the fill |

The values that are not inherited are fixed as follows.

| Value | Rule and source | Consequence |
|---|---|---|
| Bar radius **2px** | The radius foundation assigns 2px to objects 20px or smaller on their shortest side | A pill radius on an 8px bar reads as a chip, which carries meaning |
| Marks **16 / 24 / 32** | The iconography ladder, unchanged, because a spinner is a mark in an icon slot | A fourth diameter puts a mark at a size no icon can match |
| Stroke **2 / 2 / 3** | Ratio 1:12, from Material 3's 4dp indicator in a 48dp mark: 24/12 = 2, 32/12 rounds to 3 | At 16px the ratio gives 1.33px, clamped to 2px, because a thinner arc disappears at 1x |
| Refresh bar **2px** | The system's width for a state applied to a resting boundary | The bar is exactly that: a temporary state on a permanent rule |
| Determinate bar **4px** | Material 3's linear progress indicator ships a 4dp track | At 2px the fill cannot be read as a proportion; at 8px it becomes furniture |
| Ceiling **32px** | There is no 48px or 64px spinner | Reduced motion kills a large rotating mark, so a dramatic size has no fallback |

### Zero layout shift

Zero layout shift is the acceptance criterion, not an aspiration. Core Web Vitals treats a Cumulative Layout Shift score of 0.1 or lower at the 75th percentile as good. Swapping a spinner for a list blows through that in one frame.

Five rules produce zero shift, and all five are mandatory.

1. Render inside the real container, as its children rather than a sibling that gets swapped out.
2. Compute the row count: `rows = ceil(container_height / --c-row-h)`, capped at what the viewport shows.
3. Reserve intrinsic size on blocks: declare an aspect ratio or an explicit width and height on both the skeleton and the real element.
4. Reserve the mark slot in controls, so a button entering its loading state swaps a glyph without changing width.
5. Let the gate absorb the common case, so a request resolving at 120ms produces one paint rather than three.

- Never give a skeleton its own padding, margin or gap.
- Never hardcode a row count, which is wrong at every viewport height but one.

### States

A loading indicator is non-interactive by construction: not focusable, no pointer events, no value to change. Only three of the nine standard states render: default is each variant at rest, loading is the component itself, and error replaces the indicator in the same box with an inline error block and retry.

- Hover, active, disabled, read-only and selected have no rendering, and the indicator carries `pointer-events-none` so no dead click is possible. A selection made before a refresh survives it.
- Nothing is focusable except cancel and retry, which are real buttons. A focusable skeleton is a tab stop that vanishes, dropping focus to the document body.

Eight phases, each with exactly one rendering.

| Phase | Container | Bar or mark | Sheen | Status text | Announcement |
|---|---|---|---|---|---|
| **idle** | Nothing rendered | none | none | none | none |
| **pending**, 0 to 400ms | Real container, real size, `aria-busy="true"` | **not rendered** | none | none | none |
| **visible, indeterminate** | `bg-canvas`, `aria-busy="true"` | `bg-inset`; spinner arc `border-t-ink-muted` | one pass per 1600ms | `text-ink-muted`, `body` 14 / 20 | `role="status"` announces once |
| **visible, determinate** | as above | track `bg-inset`, fill `bg-accent` | none, a moving fill is its own animation | `text-ink` for the count, muted for the noun | `aria-valuenow` updates, throttled |
| **stalled**, past 10s | as above | as above, now determinate | **frozen** | `text-ink`, escalated string | `role="status"` announces the escalation once |
| **resolved** | Real content, `aria-busy` removed | none | none | none | `role="status"` announces the result count |
| **empty** | Empty state block | none | none | The empty state's own copy | announced as the result |
| **error** | Inline error block, 1px danger border | none | none | Error text plus a retry button | `role="alert"` |

Three rules the matrix encodes.

| Rule | Why | Criterion |
|---|---|---|
| **The sheen freezes at five seconds.** The skeleton stays, static, and the status text carries the signal. | The loop starts automatically, lasts over five seconds, and runs beside other content. | WCAG 2.2 SC 2.2.2 Pause, Stop, Hide (Level A) |
| **The sheen never strobes.** The 1600ms period is 0.625Hz, read as one continuous sweep. | The motion foundation's 400ms ceiling governs discrete transitions. An ambient loop is not one. | SC 2.3.1 caps flashing at three per second |
| **Error replaces, it never overlays.** The error block occupies the box the skeleton occupied. | A toast fired over a region full of skeletons leaves that region permanently unresolved. | None |

Freezing discharges SC 2.2.2 without a pause control, which would need its own label, focus stop and state.

Under `prefers-reduced-motion: reduce`, the [motion foundation](/foundations/motion.md) policy applies as follows.

| Element | Under reduce |
|---|---|
| Sheen sweep, a translate | **Killed.** The skeleton renders as a flat `bg-inset` shape. |
| Sheen as an opacity pulse | **Killed** as well. A loop is a loop whether it moves or fades. |
| Spinner at 16px and 24px | **Kept.** These sit inside the icon ladder and subtend a small visual angle. |
| Spinner at 32px | **Killed.** Downgraded to the 24px mark. |
| `progress-indeterminate` sweep | **Killed.** The bar renders as a static 2px rule for the duration. |
| `progress-determinate` fill growth | **Kept.** It conveys the information, so SC 2.3.3's carve-out applies. |
| Status text updates | **Kept.** They become the primary signal once the motion is gone. |

Under reduced motion a skeleton is a static grey shape. With no status text, that user sees a frozen region and no evidence that anything is happening. This is why status text is required rather than optional.

Design the static rendering first, then review it beside the animated one.

### Accessibility

| Part | Role | Required attributes | Why |
|---|---|---|---|
| Skeleton container | none added | `aria-busy="true"` while loading, removed on resolve | `aria-busy` tells assistive technology the subtree is changing, so announcements wait. |
| Every bar | none | `aria-hidden="true"` | A bar has no name and no meaning. Exposed, it announces as an empty group. |
| Spinner with visible text | none | `aria-hidden="true"` on the mark | The text is the message. Marking both produces a double announcement. |
| Spinner with no visible text, in-control only | `progressbar` | `aria-label`, `aria-valuetext`, and no `aria-valuenow` | An indeterminate progressbar is signalled by a missing `aria-valuenow`, not by a zero. |
| Determinate bar | `progressbar` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and a name | `aria-valuetext` carries the human string; `aria-valuenow` carries the number. |
| Status text region | `status` | none beyond the role | `role="status"` implies polite and atomic, so it waits for a pause. |
| Error block | `alert` | none beyond the role | `role="alert"` implies assertive. A failed load justifies interrupting. |
| Cancel and retry buttons | `button` | per the Button spec | They are real controls, so the Button spec governs them. |

Status messages are a conformance requirement, not a courtesy. WCAG 2.2 SC 4.1.3 Status Messages (Level AA) requires a status change to be programmatically determinable without receiving focus. Loading starting, finishing and failing are three status changes.

Announce three times, and only three: start, finish with a count, and failure. A region updated on every tick floods the speech queue and buries the finish announcement. Throttle `aria-valuenow` to one update per second and let `aria-valuetext` carry the meaning.

No part of a skeleton, spinner or progress bar is focusable or takes a key. That is the correct keyboard map, not an omission. The WAI-ARIA Authoring Practices treat `progressbar` as a non-interactive range widget with no author-defined keyboard behaviour, in the same class as `meter`.

| Situation | Required behaviour |
|---|---|
| A region enters loading | Focus does not move. Nothing about the indicator is focusable. |
| A focused control is removed when content arrives | Move focus deliberately, before the removal, to a stable ancestor. |
| A dialog opens with a loading body | Focus goes to the dialog, not to the indicator. |
| Content resolves while focus is elsewhere | Do not move focus. The `role="status"` announcement is the notification. |
| Loading fails | Do not move focus. Announce through `role="alert"`. |

| Part | Floor | Basis |
|---|---|---|
| Skeleton bar vs region background | No WCAG floor, practical floor **1.2:1** | The bar carries no information, so SC 1.4.11 does not apply. It still has to be visible. |
| Sheen vs bar | None | Decorative, and absent under reduced motion. |
| Spinner arc vs background | **3:1** | SC 1.4.11. The arc is the graphical object that says work is in flight. |
| Spinner track vs background | None | Decorative. If the track is doing the arc's work, the arc is too low contrast. |
| Determinate fill vs track | **3:1** | SC 1.4.11. The boundary between fill and track is the value. |
| `progress-indeterminate` vs its rule | **3:1** | SC 1.4.11. It is the only indication of state in that variant. |
| Status text, `body` 14 | **4.5:1** | SC 1.4.3. Never large text. |
| Count text, `caption` 12 | **4.5:1** | SC 1.4.3. 12px is below every large-text threshold. |
| Error text and error icon | **4.5:1** | SC 1.4.3. The icon carries status, so it takes the text floor. |

The 1.2:1 practical floor comes from Carbon's g10 light theme, which ships adjacent surfaces at 1.19:1, the demonstrated point at which a fill step still reads as a step.

- Never make a skeleton focusable, because `aria-busy` and the status region already do that work.
- Never use `role="alert"` for a successful load.

### Content

Every string a loading state carries is part of the spec, because the string is the only part that carries information.

| String | Pattern | Example | Rule |
|---|---|---|---|
| Indeterminate status | `Loading {plural noun}…` | `Loading requests…` | Sentence case. Name the thing loading, never the mechanism. |
| Determinate count | `{done} of {total} {plural noun}` | `142 of 3,180 requests` | The count comes first. Thousands separators per locale. Never a bare percentage. |
| Byte progress | `{done} of {total}` with units | `1.2 MB of 4.7 MB` | The same unit on both sides of "of". Mixed units force arithmetic on the reader. |
| Stall escalation | `Still loading {plural noun}…` plus the count | `Still loading requests… 142 of 3,180` | Appears once, at 10s. It does not repeat and does not count up in prose. |
| Error | `{What failed}. {What to do}.` | `Could not load requests. Check that the project is open, then retry.` | Two sentences: the failure in the user's terms, then the action. Never a code alone. |
| Retry control | `Retry` | | One word. Not "Try again", which appears elsewhere with a different meaning. |
| Cancel control | `Cancel`, or `Stop` if server work has begun | | `Stop` when the user is choosing between two different outcomes. |

<DoDont
  do="Name what is loading, so several waits stay distinguishable."
  dont="A bare Loading leaves the user guessing which wait it is.">
  <template #do>
    <DsSkeleton variant="spinner" size="md" label="Loading requests…" />
  </template>
  <template #dont>
    <DsSkeleton variant="spinner" size="md" label="Loading…" />
  </template>
</DoDont>

- Use one ellipsis character (U+2026), never three periods.
- Put an ellipsis on indeterminate strings only, since a determinate string ends with a count.
- Never write "Please wait", which asks for something the user has no choice about.
- Never ship rotating jokes, which a screen reader reads out on every render.
- Never change the noun mid-load, because the live region announces the new noun as new information.
- Make every string translatable with the count as an interpolated variable.

</template>

</PageTabs>
