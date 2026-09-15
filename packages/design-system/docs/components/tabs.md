---
outline: false
pageClass: wide
---

# Tabs

Tabs hold several peer views of one subject and show one of them at a time. The subject never changes when the user switches tab, and that property decides every rule here.

This page specifies the in-product component. The Examples, Code and Usage strip below it is documentation chrome, not the component being specified.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Variants

Three levels of chrome. Underline is the default. Usage gives the rule for each.

<Preview title="Variants" note="indicator 2px, strip rule 1px">
  <DsTabs variant="underline" label="Underline example" />
  <DsTabs variant="enclosed" label="Enclosed example" />
  <DsTabs variant="filled" label="Filled example" />
</Preview>

### Sizes

The rung buys height and inline padding. The label holds at 14px on every rung.

<Preview title="Sizes" note="28 / 32 / 40, label holds at 14px">
  <DsTabs size="sm" label="Small example" :panels="false" />
  <DsTabs size="md" label="Medium example" :panels="false" />
  <DsTabs size="lg" label="Large example" :panels="false" />
</Preview>

### Orientation

A vertical strip declares `aria-orientation="vertical"` and promises Up and Down, which is what makes a settings surface of nine sections workable.

<Preview title="Orientation" note="Up and Down arrows, aria-orientation=vertical">
  <DsTabs
    orientation="vertical" label="Settings sections"
    :tabs="[
      { id: 'general', label: 'General' },
      { id: 'proxy', label: 'Proxy' },
      { id: 'scope', label: 'Scope' },
      { id: 'backups', label: 'Backups' },
    ]" />
</Preview>

### States

A disabled tab keeps its place in the arrow rotation. The count, the unsaved dot and the error glyph are drawn and separately spoken as a description.

<Preview title="States: selected, disabled, count, unsaved, error" note="disabled tab keeps its place in the rotation">
  <DsTabs
    label="State example"
    :tabs="[
      { id: 'request', label: 'Request' },
      { id: 'response', label: 'Response', count: 12 },
      { id: 'draft', label: 'Draft', dirty: true },
      { id: 'auth', label: 'Auth', error: true },
      { id: 'websocket', label: 'WebSocket', disabled: true },
    ]" />
</Preview>

### Keyboard and focus

Tab into a strip and arrow along it. Nothing switches until Enter or Space. Home and End jump to the ends.

<Preview title="Focus" note="1px ring, no offset">
  <DsTabs label="Focus example" :panels="false" />
</Preview>

### Document tabs

The enclosed variant is the only one that takes a close mark.

<Preview title="Document tabs" note="Delete closes the focused tab">
  <DsTabs
    variant="enclosed" closeable label="Replay sessions"
    :tabs="[
      { id: 's1', label: 'Login bypass' },
      { id: 's2', label: 'IDOR on /orders', dirty: true },
      { id: 's3', label: 'Session 3' },
      { id: 's4', label: 'A session name long enough to be truncated by the label cap' },
    ]" />
</Preview>

### Overflow

The strip scrolls past its end. Labels cap at 160px and truncate.

<Preview title="Overflow and truncation" note="label caps at 160px, strip scrolls">
  <DsTabs
    variant="filled" label="Overflow example" :panels="false"
    :tabs="[
      { id: 'a', label: 'Summary' },
      { id: 'b', label: 'Request headers' },
      { id: 'c', label: 'Response headers' },
      { id: 'd', label: 'Cookies' },
      { id: 'e', label: 'Timing' },
      { id: 'f', label: 'Initiator chain' },
      { id: 'g', label: 'Security and certificates' },
    ]" />
</Preview>

### Icons

An icon is a recognition aid before the label. It is decorative, and never the only content of a tab.

<Preview title="Icons" note="FontAwesome class strings, 16px">
  <DsTabs
    label="Body views"
    :tabs="[
      { id: 'json', label: 'JSON', icon: 'fas fa-code' },
      { id: 'form', label: 'Form', icon: 'fas fa-list-check' },
      { id: 'binary', label: 'Binary', icon: 'fas fa-file-lines' },
    ]" />
</Preview>

</template>

<template #code>

### Anatomy

```
      1 tab list   role="tablist"
   ┌───────────────────────────────────────────────────────────┐
   │  ┌─ 2 ─────────┐  ┌───────────┐  ┌───────────┐            │
   │  │   Pretty    │  │    Raw    │  │    Hex    │   →  5     │
   │  └─────────────┘  └───────────┘  └───────────┘            │
   │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  3 active indicator, 2px, on the shared  │
   ├──────────────────────────────────────────────  edge ──────┤
   │                                                           │
   │   4 panel   role="tabpanel", labelled by its tab          │
   │                                                           │
   └───────────────────────────────────────────────────────────┘
```

| # | Part | Required | What it is |
|---|---|---|---|
| 1 | **Tab list** | Yes | The strip. Carries `role="tablist"`, a name and `aria-orientation`. One tab stop. |
| 2 | **Tab** | Two or more | A `<button>` with `role="tab"`, `aria-selected` and, once mounted, `aria-controls`. |
| 3 | **Indicator** | Underline, enclosed | A 2px bar on the edge the selected tab shares with its panel. |
| 4 | **Panel** | Yes | `role="tabpanel"`, `aria-labelledby` its tab, `tabindex="0"`. Lazy, then permanent. |
| 5 | **Overflow** | As a behaviour | What happens past the end of the strip. The strip scrolls. |

### Inside one tab

```
   ┌─ tab ───────────────────────────────────┐
   │    ⬡      Pretty      12     ●      ×   │
   │    1       2           3      4      5  │
   └─────────────────────────────────────────┘
```

| # | Part | Required | What it is |
|---|---|---|---|
| 1 | **Icon** | No | A 16px FontAwesome glyph before the label. Decorative, `aria-hidden`. |
| 2 | **Label** | Yes | The visible text. One noun phrase. This is the accessible name. |
| 3 | **Count** | No | A pill of tabular digits reporting how many items the panel holds. |
| 4 | **Unsaved mark** | Document tabs | A 6px dot meaning the panel holds uncommitted changes. |
| 5 | **Close** | Document tabs | A 24px target. `aria-hidden`, not a focus stop. Delete is the key. |

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `TabItem[]` | three view tabs | The set, in strip order. |
| `variant` | `underline` `enclosed` `filled` | `underline` | Chrome level. |
| `size` | `sm` `md` `lg` | `md` | Control height 28, 32 or 40px. |
| `orientation` | `horizontal` `vertical` | `horizontal` | Sets `aria-orientation` and the arrow axis. |
| `label` | string | `Views` | Accessible name of the tab list. Name it after the subject. |
| `modelValue` | string | | Id of the selected tab. |
| `closeable` | boolean | `false` | Adds the close mark and wires the Delete key. |
| `panels` | boolean | `true` | Render the panel region. |

Emits `update:modelValue` with the activated id, and `close` with the removed id.

### TabItem

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique in the strip. Keys the tab, the panel and the slot. |
| `label` | string | The visible text and the accessible name. |
| `icon` | string | FontAwesome class, for example `fas fa-code`. |
| `disabled` | boolean | Keeps its place in the rotation and carries `aria-disabled`. |
| `dirty` | boolean | Draws the unsaved dot and speaks "unsaved changes". |
| `error` | boolean | Draws the danger glyph in the count slot. |
| `count` | number | Draws the count pill and speaks "n items". |

### Class strings

These are the classes the component applies. They work unchanged in the product.

```html

<div role="tablist" aria-orientation="horizontal"
     class="flex min-w-0 items-end gap-1 overflow-x-auto border-0 border-b border-solid border-separator">
</div>

<button role="tab" aria-selected="false" tabindex="-1"
        class="relative inline-flex h-md flex-none items-center gap-2 rounded-sm border border-solid border-transparent px-3 text-body font-medium leading-none text-ink-muted hover:bg-inset hover:text-ink">
  Raw
</button>

<button role="tab" aria-selected="true" tabindex="0"
        class="relative inline-flex h-md flex-none items-center gap-2 rounded-sm border border-solid border-transparent px-3 text-body font-semibold leading-none text-ink">
  Pretty
</button>

<span aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] bg-accent transition-transform duration-3 ease-enter motion-reduce:transition-none"></span>
```

```html

<span class="inline-flex h-4 min-w-[20px] items-center justify-center rounded-full bg-inset px-1.5 text-caption font-medium tabular-nums text-ink-muted">12</span>
<i class="fas fa-triangle-exclamation text-[12px] leading-none text-danger-ink" aria-hidden="true"></i>
<span class="h-1.5 w-1.5 rounded-full bg-accent-ink" aria-hidden="true"></span>
<span class="-me-1.5 inline-flex h-xs w-xs items-center justify-center rounded-sm text-ink-faint hover:bg-selected hover:text-ink" aria-hidden="true">
  <i class="fas fa-xmark text-[13px] leading-none"></i>
</span>
```

The focus ring is the system's 1px band, plus `focus-visible:z-[1]` so it paints over the neighbouring tab instead of under it. See [Accessibility](/foundations/accessibility) for the ring markup.

Colours are role classes, never hex. `bg-accent` resolves per theme, so the same markup is correct in light and dark.

### Required ARIA

| Element | Role | Attribute | Value, and when |
|---|---|---|---|
| Strip | `tablist` | `aria-label` or `aria-labelledby` | Always |
| Strip | `tablist` | `aria-orientation` | `horizontal` or `vertical`, always explicit |
| Tab | `tab` | `aria-selected` | `true` on exactly one tab, `false` on the rest |
| Tab | `tab` | `aria-controls` | Points at its panel, once that panel is mounted |
| Tab | `tab` | `tabindex` | `0` on the tab that holds focus, `-1` on all others |
| Tab | `tab` | `aria-disabled` | `true` where it applies |
| Panel | `tabpanel` | `aria-labelledby` | Points at its tab's id |
| Panel | `tabpanel` | `tabindex` | `0`, always |
| Panel | `tabpanel` | `hidden` | On every panel that is not selected |

The tab is a real `<button type="button">`, not a `<div>` with a role. That is what makes Enter and Space activate it without a handler.

`aria-selected` is the only carrier of selection, and a tab takes no `aria-current`. The pair announces as "selected, current page, tab", which is three statements about one fact.

A tab is not a toggle either, so `aria-pressed` on `role="tab"` is invalid.

</template>

<template #usage>

### When to use

Use tabs when the panels are alternatives and nothing is lost by not looking at the others right now.

| The content | Use instead |
|---|---|
| Both regions must be visible while the user works in one | [Split pane](/components/split-pane) |
| The sections are steps in a sequence with a required order | A wizard. Steps have an order and a completion state, tabs have neither. |
| There are more than nine peers, or the set grows without bound | A list with a detail region, or a [select](/components/select) |
| The items are destinations in the application, not views of one object | The sidebar, backed by routes |
| The choice is a filter over a table rather than a view of it | A segmented control, or a [select](/components/select) |
| One section is consulted briefly and dismissed | Popover, or a drawer |
| The sections are all short and the user reads all of them | Stacked sections on one scrolling page |
| Each tab would hold a single control | Put the controls in the toolbar |

<DoDont
  do="Divide one subject into peer views: one request, read three ways."
  dont="Use tabs as navigation. Destinations announce as 'tab, 2 of 5', not links.">
  <template #do>
    <DsTabs label="Request views" :panels="false"
      :tabs="[{ id: 'pretty', label: 'Pretty' }, { id: 'raw', label: 'Raw' }, { id: 'hex', label: 'Hex' }]" />
  </template>
  <template #dont>
    <DsTabs label="Sections" :panels="false"
      :tabs="[{ id: 'http', label: 'HTTP history' }, { id: 'replay', label: 'Replay' }, { id: 'settings', label: 'Settings' }]" />
  </template>
</DoDont>

| Rule | Breaking it costs |
|---|---|
| Use tabs when the user moves between the panels repeatedly. | Without that frequency the strip is chrome paid for a switch nobody makes. |
| Convert a two-tab set to a segmented control when both panels are one paragraph. | A strip plus a panel spends 32px of chrome to hide 40px of content. |
| Convert to a split pane once users switch back and forth to compare. | The switching is the symptom and the layout is the cause. |
| Never hide a required form field behind a tab. | Submit fails against a field the user cannot see or scroll to. |
| Never nest a tab set inside another tab set. | Two identical rotations, and no cue about which one the arrow keys drive. |

### Variants

| Variant | Meaning | Usage rule |
|---|---|---|
| **Underline** | No container chrome. A 1px rule under the strip, a 2px indicator on the selected tab. | Views of one object inside a panel that already has a boundary. |
| **Enclosed** | Each tab is its own container at 6px, joined to the panel by dropping the shared edge. | Document tabs the user opens, renames and closes. The only variant taking a close mark. |
| **Filled** | No rule, no indicator. An inset track, and a raised seat at 4px on the selected tab. | Inside a toolbar that already carries its own bottom rule. |

Orientation is a property, not a variant. Every strip declares `horizontal` or `vertical`, which sets `aria-orientation`, which is what tells assistive technology which arrow keys to promise.

Vertical is for one case: a settings surface with more than seven sections whose names are of uneven length.

There is no borderless, pill or icon-only variant. An icon-only tab has an invisible accessible name, which fails SC 2.5.3 Label in Name the moment anyone speaks it aloud.

<DoDont
  do="Use the enclosed variant for tabs the user opens and closes."
  dont="Close marks on underline tabs. A fixed view cannot be closed.">
  <template #do>
    <DsTabs variant="enclosed" closeable label="Replay sessions" :panels="false"
      :tabs="[{ id: 's1', label: 'Login bypass' }, { id: 's2', label: 'IDOR on /orders', dirty: true }]" />
  </template>
  <template #dont>
    <DsTabs variant="underline" closeable label="Request views" :panels="false"
      :tabs="[{ id: 'pretty', label: 'Pretty' }, { id: 'raw', label: 'Raw' }]" />
  </template>
</DoDont>

| Rule | Breaking it costs |
|---|---|
| Default to underline. | A tab strip is chrome by construction, and underline adds the least of it. |
| Use filled inside a toolbar and nowhere else. | Its selected seat competes with a table's selected row directly below it. |
| Never mix variants in one view. | Two strips with different chrome read as two mechanisms, and both get tested. |
| Never give a vertical strip a horizontal indicator. | The indicator goes on the edge the strip shares with the panel, which is its inline end. |

### Sizes

Three rungs, from the same control ladder as [Button](/components/button), so a tab strip and a toolbar button line up on one baseline grid.

| Property | `sm` | `md` (default) | `lg` | Justification |
|---|---|---|---|---|
| **Height** | **28px** | **32px** | **40px** | The control ladder: `--c-control-h-sm`, `-md`, `-lg`. |
| **Label size / line box** | **14 / 1** | 14 / 1 | 14 / 1 | Type role `label`. Line box 1 so the height token owns the height. |
| **Label weight, rest** | **500** | 500 | 500 | `--c-wght-medium`, the control-label weight. |
| **Label weight, selected** | **600** | 600 | 600 | `--c-wght-semibold`. Weight is the only thing that changes. |
| **Padding-inline** | **8px** | **12px** | **16px** | Matches Button at the same rung, so both share one optical inset. |
| **Gap, icon to label** | **6px** | **8px** | **8px** | A 28px control cannot spend 8px twice and still hold a label. |
| **Gap, tab to tab** | **4px** | 4px | 4px | `--c-inline-xs`. Two objects, not a section break. |
| **Icon size** | **16px** | 16px | 16px | `--c-icon-sm`, the size paired with 14px text across the system. |
| **Count pill** | **16px tall, 20px min-width, 12px tabular** | same | same | The counter shape from the tag spec, unchanged. |
| **Unsaved dot** | **6px** | 6px | 6px | Below 6px it stops being a circle at 1x. Above 8px it competes with the label. |
| **Close target** | **24 x 24** | 24 x 24 | 24 x 24 | SC 2.5.8 Target Size sets 24 CSS px. A negative end margin fits it in a 28px tab. |
| **Active indicator** | **2px** | 2px | 2px | `--c-border-width-emphasis`. 1px is the separator width it sits on. |
| **Strip rule** | **1px** | 1px | 1px | The system's border width, `--c-border-separator`. |
| **Radius, underline and filled** | **4px** | 4px | 4px | `--c-radius-sm`, the control radius, on the hover and selected fills. |
| **Radius, enclosed** | **6px top corners** | same | same | `--c-radius-md`, the container radius. The close control inside stays at 4px. |
| **Label cap** | **160px** | 160px | 160px | About 22 characters of 14px Arial. Past that the strip stops fitting. |
| **When to use** | A 40px toolbar, and any dense chrome | Everywhere else | Top-level document tabs | |

### Overflow

The strip scrolls in its own axis. It does not wrap, it does not shrink tabs below their label cap, and it does not collapse into a menu at a breakpoint.

- Wrapping makes a tab's vertical position depend on the width of every tab before it.
- Shrinking gives a strip of tabs truncated to four characters each.
- Collapsing to a menu changes the keyboard model at a width the user did not choose.

<DoDont
  do="Turn a settings surface of nine sections into a vertical strip."
  dont="Keep nine sections horizontal. The strip overflows and hides tabs.">
  <template #do>
    <DsTabs orientation="vertical" label="Settings sections" :panels="false"
      :tabs="[
        { id: 'general', label: 'General' },
        { id: 'proxy', label: 'Proxy' },
        { id: 'scope', label: 'Scope' },
        { id: 'backups', label: 'Backups' },
        { id: 'certificates', label: 'Certificates' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'shortcuts', label: 'Shortcuts' },
        { id: 'updates', label: 'Updates' },
        { id: 'advanced', label: 'Advanced' },
      ]" />
  </template>
  <template #dont>
    <DsTabs label="Settings sections" :panels="false"
      :tabs="[
        { id: 'general', label: 'General' },
        { id: 'proxy', label: 'Proxy' },
        { id: 'scope', label: 'Scope' },
        { id: 'backups', label: 'Backups' },
        { id: 'certificates', label: 'Certificates' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'shortcuts', label: 'Shortcuts' },
        { id: 'updates', label: 'Updates' },
        { id: 'advanced', label: 'Advanced' },
      ]" />
  </template>
</DoDont>

| Rule | Breaking it costs |
|---|---|
| Keep the label at 14px on every rung and in every density mode. | The strip is where a type change costs a horizontal reflow of every sibling. |
| Reserve the selected weight at rest, with a zero-height copy of the label at 600. | Without it, selecting a tab widens it and pushes every later tab sideways. |
| Scroll the strip to keep the selected tab in view when selection changes. | A selected tab off the end leaves no visible selection anywhere. |
| Never let a tab shrink below its content. | The cap has to be on the label, not on the tab, or the flex minimum wins. |
| Never apply the density attribute to the label. | A 13px tab label beside a 14px toolbar button is visible as an error. |

### States

| State | Label | Fill | Indicator | Behaviour |
|---|---|---|---|---|
| **Default** | `--c-fg-muted`, weight 500 | none | none | The unselected resting state. |
| **Hover** | `--c-fg-default` | `--c-bg-inset` | none | 70ms colour transition, the fastest tier. |
| **Focus-visible** | unchanged | unchanged | unchanged | The system ring. Focus is not selection. |
| **Selected** | `--c-fg-default`, weight **600** | raised on enclosed and filled, none on underline | 2px `--c-accent-solid` | `aria-selected="true"`. Exactly one per strip. |
| **Selected and focused** | as selected | as selected | as selected | Both indications present at once, neither suppressed. |
| **Disabled** | `--c-fg-faint` | none | none | `aria-disabled="true"`, not the `disabled` attribute. Activation is a no-op. |
| **Unsaved** | as its base state | as its base state | as its base state | Plus a 6px `--c-accent-fg` dot after the label. |
| **Error** | as its base state | as its base state | as its base state | The danger glyph in the count slot. Never colour alone: SC 1.4.1. |

Loading, read-only, indeterminate and pressed do not apply. The panel loads rather than the tab, a tab writes nothing, and selection is exactly one of n.

| What moves | Duration | Easing | Why |
|---|---|---|---|
| Label and fill colour on hover | **70ms** `--c-duration-1` | linear | Hover fires on every pointer traverse of the strip. |
| Indicator on the newly selected tab | **150ms** `--c-duration-3` | `--c-ease-enter` | A scale from 0 to 1 on the tab's own axis, anchored at the centre. |
| Strip scroll to bring a tab into view | **240ms** `--c-duration-4` | `--c-ease-standard` | A region-sized movement, the only travel over 2px here. |

The indicator does not slide from the old tab to the new one. A travelling indicator has to be measured against two moving targets, it is wrong for one frame on every resize, and in a scrolling strip it animates across tabs the user cannot see.

Under `prefers-reduced-motion: reduce` the scale and the scroll animation are dropped and the colour transitions stay. See [Motion](/foundations/motion).

| Rule | Breaking it costs |
|---|---|
| Keep the muted-to-default label step. | It is what makes the selected tab findable without tracing the 2px bar. |
| Mark a disabled tab with `aria-disabled`, never the `disabled` attribute. | A tab out of the rotation is one a keyboard user never learns exists, and the roving `tabindex` gets a hole. |
| Put the loading state inside the panel, as a skeleton matched to its real shape. | A spinner in the strip flickers on every switch and moves the label 16px. |
| Never convey selection with the indicator alone. | 2px of colour is a 1.4.1 failure, and invisible at the far end of a wide strip. |

### Keyboard

The first eight rows are the WAI-ARIA Authoring Practices Tabs pattern. Delete is the pattern's optional row for removable tabs.

| Key | Action |
|---|---|
| Tab, from outside | "When focus moves into the tab list, places focus on the active tab element." |
| Tab, from inside | "moves focus to the next element in the page tab sequence outside the tablist" |
| Right Arrow | Horizontal: "moves focus to the next tab. If focus is on the last tab, moves focus to the first tab." |
| Left Arrow | Horizontal: "moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab." |
| Down Arrow / Up Arrow | Vertical list, the same, on the vertical axis. |
| Home / End | "Moves focus to the first / last tab." |
| Enter / Space | Activates the focused tab. The only way selection changes from the keyboard. |
| Delete | Removes "the tab from the tab list and the corresponding tabpanel from the DOM". Enclosed only. |
| Shift + Tab | Leaves the strip backwards, from wherever focus sits in the rotation. |

The strip is one tab stop. `tabindex` roves: it sits on the tab that holds focus, and it returns to the selected tab when focus leaves the strip entirely.

Activation is manual, and that is a system-wide decision. The pattern's guidance is that automatic activation suits panels that are "simple and load instantly", and manual suits panels that "contain content that could take time to load".

Every panel in this product is a data surface, so automatic activation would mount a virtualised table on each arrow press. There is no `activation` prop to get wrong.

Delete acts on the focused tab, which under manual activation is not always the selected one. Closing changes the visible panel only when the closed tab was selected.

### Focus management

Focus is moved programmatically on close, and nowhere else.

- On close, focus moves to the tab that took the closed tab's index, or to the last remaining tab.
- On closing the last tab, focus moves to the empty state, never to `<body>`.
- Never on activation. Enter leaves focus on the tab, because the user was operating the strip.

The panel carries `tabindex="0"`, so the route into it is the pattern's own Tab row. Tab into the strip, arrow to a tab, Enter, Tab into the panel.

WCAG 2.2 SC 2.4.11 Focus Not Obscured applies directly. A tab strip is often sticky at the top of a scrolling panel, and a focused tab that scrolls under the toolbar fails that criterion.

| Rule | Breaking it costs |
|---|---|
| Set `aria-orientation` explicitly on every strip. | The implicit default is horizontal, so a vertical strip promises the wrong two keys. |
| Give the panel `tabindex="0"`. | A panel whose first element is a paragraph is unreachable by keyboard. |
| Write `aria-controls` only when the panel exists. | A reference to an unrendered id is reported as a broken relationship. |
| Never put a focusable control inside a tab. | It breaks the roving model and is not a valid child of `role="tab"`. |
| Never implement automatic activation because one panel is cheap. | Arrow keys would then mean different things in different places. |

### Contrast floors

| Part | Floor | Rule |
|---|---|---|
| Selected label against its fill | **4.5:1** | SC 1.4.3. Text at 14px, below the large-text threshold in both weights. |
| Unselected label against its fill | **4.5:1** | Same. `--c-fg-muted` clears it on canvas, on inset and on raised. |
| Active indicator against both surfaces beside it | **3:1** | SC 1.4.11. It identifies which tab is selected, so 2px is still in scope. |
| Strip rule | **none required** | A decorative separator identifies no component and no state. |
| Enclosed tab boundary, selected | **3:1** against the strip background | It is the boundary of the selected control. |
| Focus ring | **3:1** against adjacent colours, and 3:1 between focused and unfocused | SC 2.4.13. The per-theme token holds the first on the surfaces the ring lands on. |
| Disabled label | **none required** | 1.4.3 exempts inactive controls. Held at `--c-fg-faint`, a step below muted. |
| Unsaved dot | **3:1** | It carries state, so 1.4.11 reaches it. Never the only carrier. |
| Count pill text | **4.5:1** | Text. |

### Content

A tab's label is its accessible name, its panel's heading and the string the user scans, all in one string.

| Rule | Statement | Consequence |
|---|---|---|
| C1 | **A label is a noun or a noun phrase.** "Request", "Response headers", "Timing". Never a verb. | A tab does not perform, it reveals. "Send" is a button. |
| C2 | **Sentence case, no trailing punctuation, no role words.** Not "Response headers tab". | Assistive technology already announces the role. |
| C3 | **One to three words, under 22 characters**, the 160px cap at 14px. | Past the cap the label truncates and the full string stays as the `title`. |
| C4 | **Labels in one strip are parallel in form.** "Request", "Response", "WebSocket". | Non-parallel labels make the user read the strip instead of scanning it. |
| C5 | **A count goes in the count slot, never in the label.** | The pill changes a value. The name stays fixed and is not re-announced. |
| C6 | **A tab is never empty.** | An icon-only tab has no visible accessible name. |
| C7 | **A document tab shows the user's own name for the document**, truncated at the front. | "…/orders/1042" tells the user more than "https://example.com/…". |
| C8 | **The unsaved state is spoken, not only drawn**, as "unsaved changes". | A dot alone is a 1.4.1 failure. |

<DoDont
  do="Put a count in the count slot and leave the name fixed."
  dont="Bake the count into the label. The tab resizes on every update.">
  <template #do>
    <DsTabs label="Response views" :panels="false"
      :tabs="[{ id: 'req', label: 'Request' }, { id: 'res', label: 'Response', count: 12 }]" />
  </template>
  <template #dont>
    <DsTabs label="Response views" :panels="false"
      :tabs="[{ id: 'req', label: 'Request' }, { id: 'res', label: 'Response 12' }]" />
  </template>
</DoDont>

<DoDont
  do="Keep every label in one strip parallel: one noun phrase each."
  dont="Mix verb phrases and abbreviations. The user reads instead of scanning.">
  <template #do>
    <DsTabs label="Request views" :panels="false"
      :tabs="[{ id: 'a', label: 'Request' }, { id: 'b', label: 'Response' }, { id: 'c', label: 'WebSocket' }]" />
  </template>
  <template #dont>
    <DsTabs label="Request views" :panels="false"
      :tabs="[{ id: 'a', label: 'Request' }, { id: 'b', label: 'See the response' }, { id: 'c', label: 'WS' }]" />
  </template>
</DoDont>

| Rule | Breaking it costs |
|---|---|
| Make the label the accessible name, with no `aria-label` overriding it. | A different `aria-label` fails SC 2.5.3 and breaks voice control. |
| Name the tab list after the subject it divides: "Replay sessions". | A screen reader announces the list name first, and "tab list" tells the user nothing. |
| Keep the panel free of a heading that repeats its tab. | The tab is the heading, and `aria-labelledby` already says so. |
| Never truncate in the middle of a document tab label. | Path-like strings are distinguished by their tails, so the ellipsis goes at the front. |
| Never abbreviate to fit. | If three labels do not fit at 14px, the set has too many tabs, or it is vertical. |

### Rules of use

| Rule | Breaking it costs |
|---|---|
| Keep exactly one tab selected at all times, including after a close. | The roving `tabindex` has no home to return to, and the state is undefined. |
| Mount a panel on first activation and keep it mounted afterwards. | Re-mounting a virtualised table throws away its scroll position and its request in flight. |
| Persist the selected tab per subject, not globally. | A different Replay session expects its own tab, not the last one you used elsewhere. |
| Keep the tab list in DOM order before its panels, in the same order. | Traversal follows DOM order, so the user goes backwards on every switch. |
| Cap a fixed tab set at seven. | Seven is where a horizontal strip stops fitting at the label cap on a 1280px display. |
| Treat the strip as one focus stop in every layout, vertical included. | A nine-section settings page would otherwise cost nine Tab presses. |
| Never put tabs at the top of a dialog. | A dialog asks one question. A strip there hides the thing being configured. |
| Never put a route behind a tab and call it a tab. | If back is expected to move between panels, they are pages and need links. |
| Never give two strips in one view the same accessible name. | "Views" and "Views" leaves no way to tell which subject each divides. |
| Never hide a destructive action behind an unselected tab. | The user cannot see the state they are about to destroy. |

</template>

</PageTabs>
