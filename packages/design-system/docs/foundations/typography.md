---
outline: false
pageClass: wide
---

# Typography

Type carries almost everything the product says. Six sizes and thirteen roles cover the whole interface, and a component asks for a role, never for a size.

What changed in the product is recorded on the [changelog](/changelog).

<PageTabs :tabs="['Overview', 'Reference']">

<template #overview>

### The root is 14 pixels

`@caido/common-frontend` sets `html { font-size: var(--c-font-size-base) }`, and that token is `14px`. Every `rem` in the interface multiplies 14, not the browser's usual 16.

The interface font-size slider then writes its own value straight onto the root in `px`, from 12 to 24 in whole steps. The multiplier moves, and every `rem` in the product moves with it.

Read every `rem` on this page against 14. Stock Tailwind `text-sm` paints 12.25px here and `text-xs` paints 10.5px, which is why both are named in the Reference tab.

### The ramp

The sizes are 12, 13, 14, 16, 20 and 32. Every one is a whole integer and carries at least one named role.

The curve is fine at the bottom, where the eye resolves a single pixel, and coarse at the top, where it does not. Nothing sits at 11, 18 or 24, because no role needs them.

The base is 14. That is the number `--c-font-size-base` already carries and the number both font-size sliders start on.

<Preview title="The ramp" mode="dark" note="12 / 13 / 14 / 16 / 20 / 32">
  <div class="flex w-full flex-col gap-4"><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">32 / 40</span><span class="text-display font-semibold text-ink">Display</span></div><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">20 / 28</span><span class="text-heading font-semibold text-ink">Heading</span></div><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">16 / 24</span><span class="text-title font-semibold text-ink">Title</span></div><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">14 / 20</span><span class="text-body text-ink">Body, the default</span></div><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">14 / 18</span><span class="text-dense text-ink">Body dense, the data row</span></div><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">13 / 18</span><span class="font-mono text-code text-ink">GET /api/v2/users HTTP/1.1</span></div><div class="flex items-baseline gap-5"><span class="w-16 shrink-0 text-caption tracking-wide text-ink-faint">12 / 16</span><span class="text-caption tracking-wide text-ink-muted">Caption, 3 of 47 requests</span></div></div>
</Preview>

### Roles, not sizes

A role publishes size, line box, weight, tracking and family as one value. Components take the role and nothing else.

Name the role at the call site. `body-dense` keeps its name through a value change, while a size class has to be re-audited every time the base moves.

The product reaches for stock Tailwind sizes today, `text-sm` at 177 call sites and `text-xs` at 42. Each of those has a role waiting for it, and the Reference tab carries the mapping.

<Preview title="Roles in one view" mode="dark">
  <div class="w-full"><div class="text-heading font-semibold text-ink">HTTP history</div><div class="mt-1 text-caption tracking-wide text-ink-muted">3 of 47 requests</div><div class="mt-5 flex h-sm items-center gap-4 border-b border-separator text-dense font-semibold leading-none text-ink"><span class="w-16 shrink-0">Method</span><span class="w-14 shrink-0">Status</span><span class="grow">Host</span><span class="w-20 shrink-0 text-right">Bytes</span></div><div class="flex h-md items-center gap-4 text-dense text-ink"><span class="w-16 shrink-0"><span class="rounded-sm bg-tag-row px-1.5 py-0.5 text-caption font-semibold uppercase tracking-[0.04em] text-tag-ink">Get</span></span><span class="w-14 shrink-0 tabular-nums">200</span><span class="grow truncate font-mono text-code">api.example.com/v2/users</span><span class="w-20 shrink-0 text-right tabular-nums">1439</span></div><div class="flex h-md items-center gap-4 text-dense text-ink"><span class="w-16 shrink-0"><span class="rounded-sm bg-tag-row px-1.5 py-0.5 text-caption font-semibold uppercase tracking-[0.04em] text-tag-ink">Post</span></span><span class="w-14 shrink-0 tabular-nums">404</span><span class="grow truncate font-mono text-code">api.example.com/v2/sessions</span><span class="w-20 shrink-0 text-right tabular-nums">3067</span></div></div>
</Preview>

### Units

Two units answer one question: should this value grow when the reader raises the interface font size?

Yes means `rem`, which is every font size in the ramp. No means `px`, which is chrome geometry: control heights, row heights, icon boxes, borders and focus rings.

Line heights are unitless, because only a unitless value survives nesting. Tracking and inline code are in `em`, since both are proportions of the surrounding em box.

The product's own space tokens are `rem` too, so `--c-space-4` measures 14px at the default root and 24px at the top of the slider.

### Two axes the reader controls

Two sliders ship. One sets the interface root, the other writes `--c-editor-font-size`. Both run 12 to 24 in whole pixels and both start at 14.

The editor scroller then takes `0.9em` of that token, so the payload viewer paints 12.6px at the default and 10.8px at the slider's floor.

A researcher who wants larger request bytes does not want larger menus. That is why the two axes are separate, and why the viewer must never inherit the chrome's size.

### Controls own their height

A height-constrained control takes `line-height: 1` and gets its height from the height token. Padding and inherited leading do not decide it.

Left to `line-height: normal`, a control's height becomes a per-face metric. Arial resolves `normal` to 1.1499em, so a button beside a 32px field measures 34.10px, and it moves again whenever the reader picks another face.

<DoDont
  do="The height token sets both controls, so the row aligns."
  dont="Padding and leading make the button taller than the field.">
  <template #do>
    <span class="inline-flex h-md items-center rounded-md border border-control bg-raised px-3 text-body font-medium leading-none text-ink">Send</span><span class="inline-flex h-md items-center rounded-md border border-control bg-inset px-3 text-body leading-none text-ink">example.com</span>
  </template>
  <template #dont>
    <span class="inline-block rounded-md border border-control bg-raised px-3 py-2 text-body font-medium leading-normal text-ink">Send</span><span class="inline-flex h-md items-center rounded-md border border-control bg-inset px-3 text-body leading-none text-ink">example.com</span>
  </template>
</DoDont>

### Weight

Three weights carry the roles: 400 for content, 500 for control labels, 600 for headings, table headers and badges.

Arial holds two files, 400 and 700, and carries no `fvar` axis. So 500 resolves to 400 and 600 resolves to 700: source carries three levels and the screen shows two.

Author the 500 tier anyway. It records which text is a control affordance and which is content, and it turns a future multi-weight face into a token change rather than a rewrite.

`font-bold` still appears at 48 call sites in the product, and every one paints the same Arial Bold that 600 does. The role set stops at 600 for that reason.

Keep 600 on single short lines. Never reach for weight to rescue text whose colour is too close to its background.

<DoDont
  do="Weight 600 on the title, 400 on the copy beneath it."
  dont="Body copy at 600 renders bold and the title stops leading.">
  <template #do>
    <div class="max-w-xs"><div class="text-title font-semibold text-ink">Request blocked</div><div class="mt-1 text-body font-normal text-ink">The proxy rejected this request because the client certificate expired on 12 March.</div></div>
  </template>
  <template #dont>
    <div class="max-w-xs"><div class="text-title font-semibold text-ink">Request blocked</div><div class="mt-1 text-body font-semibold text-ink">The proxy rejected this request because the client certificate expired on 12 March.</div></div>
  </template>
</DoDont>

### Accessibility floors

12px is a hard floor, and it is a rendered floor. `text-xs` is authored at `0.75rem` and paints 10.5px against the 14px root, so it fails the floor while reading as a size class.

The system never claims SC 1.4.3's large-text relaxation, so every text pair holds 4.5:1 in both themes. The two gates are set out in [Accessibility](/foundations/accessibility).

12px at weight 400 is spot text. It repeats a value shown elsewhere: a timestamp, a count, a byte size, a breadcrumb. Anything the reader has to read is `body` at 14px.

Badges are the one exception. At weight 600 the house rule admits 12px, and in exchange the colour pair owes 7:1.

<DoDont
  do="Help text at 14px, the size the reader actually has to read."
  dont="Help text at 12px, a size reserved for repeated spot values.">
  <template #do>
    <div class="w-64"><div class="text-body font-medium leading-none text-ink">Scope regex</div><div class="my-1.5 text-body text-ink-muted">Matches the full URL, including the query string.</div><div class="flex h-md items-center rounded-md border border-control bg-inset px-2 font-mono text-code text-ink">^https://api.example.com/</div></div>
  </template>
  <template #dont>
    <div class="w-64"><div class="text-body font-medium leading-none text-ink">Scope regex</div><div class="my-1.5 text-caption tracking-wide text-ink-muted">Matches the full URL, including the query string.</div><div class="flex h-md items-center rounded-md border border-control bg-inset px-2 font-mono text-code text-ink">^https://api.example.com/</div></div>
  </template>
</DoDont>

### Numerals

Apply `tabular-nums` to every aligned numeral: table columns, status codes, byte counts, response times, ports, timestamps and any counter that updates live.

Arial gives all ten digits one advance of 1139 units, so the declaration changes nothing on the default face. It reaches one call site in the product today, and it ships regardless.

Behind Arial the stack falls through to the generic `sans-serif`. The platform faces measured there carry proportional digits, so a column that aligns by construction is ragged on a machine without Arial.

A slashed zero cannot be specified on the mono face. Courier New's feature list carries no `zero` and no `tnum`, so declaring either paints nothing and reads as a solved problem.

Measured digit advances, the jitter cost and the `zero` rule are in [Tabular figures](/appendix-typefaces#tabular-figures).

### Faces

`--c-font-family-base` ships as `Arial, sans-serif` and `--c-font-family-mono` ships as `"Courier New", monospace`. The editor is the one exception, at `Menlo, Monaco, Consolas, monospace`.

The interface face is the reader's to choose, from seven names lifted from a websafe coverage table. Georgia, Times New Roman and Courier New are all on that list.

The setting replaces the whole declaration rather than prepending to it, so a pick leaves a bare family name with nothing behind it. Where that face is missing the browser falls through to its own default, which in Chrome is a serif.

Anything written into `--c-font-family-base` should carry `, sans-serif` behind it. The picker does not do that today, and the fallback is the reader's problem until it does.

Neither shipping mono face carries programming ligatures, so no surface declares them off. [Ligature policy](/appendix-typefaces#ligature-policy) carries the declarations a face that did would need.

### Truncation

One idiom ships: the `truncate` class, which is overflow hidden plus an ellipsis plus `nowrap`. It needs `min-w-0` on every flex ancestor, or the item refuses to shrink and the row overflows instead.

Never truncate the only copy of a value. The full string stays reachable without a resize, through a tooltip or the detail pane.

End-truncate prose. Middle-truncate URLs and paths, because two requests often differ only in the middle.

<DoDont
  align="start"
  do="Middle truncation keeps the path segment that differs between rows."
  dont="End truncation renders two different requests as one string.">
  <template #do>
    <div class="flex w-64 font-mono text-code text-ink"><span class="min-w-0 truncate">https://api.example.com/v2/users</span><span class="shrink-0">/1234/profile</span></div><div class="flex w-64 font-mono text-code text-ink"><span class="min-w-0 truncate">https://api.example.com/v2/users</span><span class="shrink-0">/9876/profile</span></div>
  </template>
  <template #dont>
    <div class="w-64 truncate font-mono text-code text-ink">https://api.example.com/v2/users/1234/profile</div><div class="w-64 truncate font-mono text-code text-ink">https://api.example.com/v2/users/9876/profile</div>
  </template>
</DoDont>

Rows in a virtualised table never wrap or clamp, because the virtualiser divides scroll offset by a constant row height. The editor already wraps payload and hex with `word-break: break-all`, which is right: every character there is equally significant.

</template>

<template #reference>

### Font tokens that ship

Nine values decide type in the product. Eight are declared by `@caido/common-frontend` and the ninth is written at runtime from settings.

| Token | Value | Where it lands |
|---|---|---|
| `--c-font-family-base` | `Arial, sans-serif` | `html`, and overwritten wholesale by the reader's pick |
| `--c-font-family-mono` | `"Courier New", monospace` | Every monospace surface outside the editor |
| `--c-font-size-base` | `14px` | `html`, so it is the root every `rem` divides |
| `--c-font-size-75` | `0.75rem` | Counters and pill labels. 10.5px at the default root |
| `--c-font-size-100` | `0.875rem` | Most control labels. 12.25px at the default root |
| `--c-font-size-200` | `1rem` | 14px at the default root |
| `--c-font-size-300` | `1.125rem` | 15.75px at the default root |
| `--c-font-weight-500` | `500` | The only weight token in the set |
| `--c-editor-font-size` | `14px` by default | The editor root, written from settings |

### Stock sizes in use today

Tailwind 3.4's default scale is still reachable, and every entry resolves against the 14px root rather than 16. Counts are call sites across the UI, components and workflow-editor packages.

| Class | Authored | Renders at the 14px root | Call sites | Role that replaces it |
|---|---|---|---|---|
| `text-xs` | 0.75rem | 10.5px | 42 | `caption`, at 12px |
| `text-sm` | 0.875rem | 12.25px | 177 | `body-dense` or `body`, at 14px |
| `text-base` | 1rem | 14px | 6 | `body` |
| `text-lg` | 1.125rem | 15.75px | 67 | `title`, at 16px |
| `text-xl` | 1.25rem | 17.5px | 36 | `title`, at 16px |
| `text-2xl` | 1.5rem | 21px | 10 | `heading`, at 20px |
| `text-3xl` | 1.875rem | 26.25px | 4 | `heading` or `display` |

### Sizes and line boxes

Line boxes are designed in whole pixels and the multiplier is back-solved, so fifty stacked rows land on whole pixels. Sizes of 20px and above sit on a 4px grid, and below that a 2px sub-grid is allowed.

| Size | Line box | Multiplier | Used by |
|---|---|---|---|
| 12 | 16 | 1.3333 | `caption`, `badge`, `code-dense` |
| 13 | 18 | 1.3846 | `code`, the payload viewer |
| 14 | 18 | 1.2857 | `body-dense`, the default data row |
| 14 | 20 | 1.4286 | `body`, the system base |
| 16 | 24 | 1.5 | `title`, `body-lg` |
| 20 | 28 | 1.4 | `heading` |
| 32 | 40 | 1.25 | `display` |
| any | 1em | 1 | Every height-constrained control |

Leading tightens as size rises: about 1.43 at 14px, 1.4 at 20px, 1.25 at 32px. A single global multiplier is banned, since 13px at 1.5 gives a 19.5px box and a half-pixel row border.

### Role tokens

Thirteen roles, from six sizes. Tracking is zero everywhere except 12px, which takes 0.025em, and uppercase badges, which take 0.04em.

| Role | Size / line box | Weight | Family | Use it for |
|---|---|---|---|---|
| `display` | 32 / 40 | 600 | sans | Empty states, onboarding, one dashboard numeral. |
| `heading` | 20 / 28 | 600 | sans | The page title and top-level settings headers. |
| `title` | 16 / 24 | 600 | sans | Dialog titles, card and panel headers, sidebar group headers. |
| `body-lg` | 16 / 24 | 400 | sans | Long-form prose only. Never chrome. |
| `body` | 14 / 20 | 400 | sans | The default. Field help, descriptions, menus, dialogs, tooltips. |
| `body-dense` | 14 / 18 | 400 | sans | Data-table cells, tree rows, list rows. Use at 15 rows or more. |
| `label` | 14 / 1 | 500 | sans | Button and tab labels, chips, field labels, select triggers. |
| `label-strong` | 14 / 1 | 600 | sans | Table column headers and the active tab. |
| `field` | 14 / 1 | 400 | sans | The value inside a single-line input. A textarea takes `body`. |
| `caption` | 12 / 16 | 400 | sans | Timestamps, counts, byte sizes, status bar. Secondary only. |
| `badge` | 12 / 16 | 600 | sans | Method tags, severity chips, status pills. 12 characters or fewer. |
| `code` | 13 / 18 | 400 | mono | Raw HTTP bodies and headers, the payload viewer. |
| `code-dense` | 12 / 16 | 400 | mono | Hex dump, monospace cells, long hashes in a column. |
| `code-inline` | 0.92em / 1.4 | 400 | mono | Inline code inside prose. In `em`, so it tracks its parent. |

### Element lookup

Read this at design time. Every row is a rule.

| Element | Role | Rule |
|---|---|---|
| Button label | `label` | Size variants change padding and height, never font size. |
| Tab label | `label`, `label-strong` when active | Weight changes on activation, never size. Reserve the wider width at rest. |
| Input value | `field` | Switch to mono for URL, header, raw body and hex inputs. |
| Input label | `label` | Always a persistent visible label. A placeholder is a format hint. |
| Input help text | `body` | 14px, not 12px. The reader has to read it. |
| Input error text | `body` at 500 | Weight, icon and colour together. Never colour alone. |
| Table cell | `body-dense` | The 2px shorter line box is the whole density mechanism. |
| Table cell, ID or hash | `code-dense` | Family and size change. Row height does not. |
| Table cell, numeric | `body-dense` with `tabular-nums` | Tabular figures are mandatory on every aligned column. |
| Table header | `label-strong` | Same size as the cell. Hierarchy comes from weight alone. |
| Menu item | `label` | The shortcut hint beside it takes `caption` with `tabular-nums`. |
| Page title | `heading` | One per page. |
| Panel or card header | `title` | Also settings sub-sections and table section rows. |
| Dialog title | `title` | 16px, not 20px. A dialog is a sub-task, not a page. |
| Tooltip | `body` | 14px, not 12px. Often the only full copy of a truncated value. |
| Toast summary | `title` | The detail line below it takes `body`. |
| Sidebar group header | `title` | Not `badge`. It is navigation structure, not a chip. |
| Breadcrumb | `caption` | The current segment takes `label`. |
| Timestamp, count, byte size | `caption` with `tabular-nums` | Never the only place a value appears. |
| Status badge, method tag | `badge` | Single line, and never the only cue for its meaning. |
| Payload viewer | `code` | Sized from `--c-editor-font-size` at `0.9em`, so it holds its own axis. |
| Hex viewer | `code-dense` | `word-break: break-all` for wrapping, as the editor already sets. |
| Keyboard shortcut | `caption`, mono | Weight 500, tracking 0.025em. |
| Empty state hero | `display` | One per screen. Anything larger is an illustration. |

### Class strings

The utility theme adds the six sizes above, named after roles rather than t-shirt sizes. It extends the default scale rather than replacing it, so `text-sm` stays reachable and still resolves off the 14px root.

```html

<p class="text-body text-ink">The proxy rejected this request.</p>

<h2 class="text-title font-semibold text-ink">Scope settings</h2>

<button class="inline-flex h-md items-center px-3 text-body font-medium leading-none">Send</button>

<div class="flex h-md items-center text-dense text-ink">
  <span class="grow truncate">api.example.com/v2/users</span>
  <span class="w-20 text-right tabular-nums">1439</span>
</div>

<span class="text-caption tracking-wide text-ink-muted">3 of 47 requests</span>

<pre class="font-mono text-code text-ink">GET /api/v2/users HTTP/1.1</pre>
```

### Type at each density

Row height is an integer token owned by [Spacing](/foundations/spacing#density). This table records which role fills the row at each step.

| Density | Row height | Text role | Line box |
|---|---|---|---|
| Compact | 24px | `body-dense` remapped to 13 / 16 | 16 |
| Default | 28px | `body-dense` at 14 / 18 | 18 |
| Comfortable | 32px | `body` at 14 / 20 | 20 |

### Font stacks

Three stacks are in force. The interface one is the only one the reader can change, and the change lands as a replacement rather than a prefix.

| Stack | Value in force |
|---|---|
| Interface | `Arial, sans-serif`, then whatever single name the reader picks |
| Monospace | `"Courier New", monospace` |
| Editor scroller | `Menlo, Monaco, Consolas, monospace`, at `0.9em` of the editor root |

The picker holds seven names, taken from the 90%-plus coverage set on cssfontstack.com. They were chosen for availability, not for a dense interface.

| Kind | Faces in the picker |
|---|---|
| Sans | Arial (the default), Trebuchet MS, Verdana, Tahoma |
| Serif | Georgia, Times New Roman |
| Monospace | Courier New |

Arial is the only one measured against the selection rules, at x-height 0.5186em and a uniform digit advance of 1139 units. Courier New is the lowest in the list at 0.4229em.

### Settings that move type

Three settings reach type, and each writes to a different place. All three persist per user, not per project.

| Setting | Range | Default | What it writes |
|---|---|---|---|
| Interface font size | 12 to 24px, step 1 | 14px | `font-size` on the root element, in `px` |
| Editor font size | 12 to 24px, step 1 | 14px | `--c-editor-font-size`, in `px` |
| Interface font family | Seven names | Arial | `--c-font-family-base`, the whole value |

### Accessibility checks

Two floors bind on type. Contrast, target size, resize and the focus rule are set out in [Accessibility](/foundations/accessibility).

| Check | Requirement |
|---|---|
| Minimum size | 12px rendered, never authored-only |
| Text spacing | Survives line height 1.5, tracking 0.12em, word spacing 0.16em |

</template>

</PageTabs>
