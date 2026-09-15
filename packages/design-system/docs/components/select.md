---
outline: false
pageClass: wide
---

# Select

A Select binds one closed set of values to one field. It reads the current value, offers the legal alternatives, and writes one of them back.

One component ships four variants, single, filterable, multiple and native, over one overlay geometry and one keyboard model taken from the WAI-ARIA Authoring Practices.

<script setup>
import { ref } from "vue";

const scopes = [
  { value: "in-scope", label: "In scope only" },
  { value: "all", label: "All requests" },
  { value: "except", label: "All requests except…" },
];

const methods = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
  { value: "HEAD", label: "HEAD" },
  { value: "OPTIONS", label: "OPTIONS" },
];

const groupedMethods = [
  { value: "GET", label: "GET", group: "Safe" },
  { value: "HEAD", label: "HEAD", group: "Safe" },
  { value: "OPTIONS", label: "OPTIONS", group: "Safe" },
  { value: "TRACE", label: "TRACE", group: "Safe" },
  { value: "POST", label: "POST", group: "Unsafe" },
  { value: "PUT", label: "PUT", group: "Unsafe" },
  { value: "PATCH", label: "PATCH", group: "Unsafe" },
  { value: "DELETE", label: "DELETE", group: "Unsafe" },
  { value: "CONNECT", label: "CONNECT", group: "Unsafe" },
];

const severities = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "info", label: "Informational", disabled: true },
];

const commands = [
  { value: "copy", label: "Copy URL" },
  { value: "replay", label: "Send to Replay" },
  { value: "delete", label: "Delete" },
];

const commandGroups = [
  { items: [
    { id: "copy", label: "Copy URL" },
    { id: "replay", label: "Send to Replay" },
  ] },
  { items: [{ id: "delete", label: "Delete", destructive: true }] },
];

const method = ref("GET");
const filtered = ref("");
const picked = ref(["high", "medium"]);
</script>

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Variants

Single is the default, filterable takes over above eight options, multiple holds a set, and native hands rendering to the operating system.

<Preview title="Variants" note="single / filterable / multiple / native">
  <DsSelect label="Scope" :options="scopes" model-value="in-scope" width="180px" />
  <DsSelect label="Method" variant="filterable" :options="groupedMethods" width="180px" />
  <DsSelect label="Severity" variant="multiple" :options="severities" :model-value="['high']" width="180px" />
  <DsSelect label="Preset" variant="native" :options="scopes" model-value="all" width="180px" />
</Preview>

### Sizes

Small for toolbars, medium for forms, large for spacious layouts. Option rows take the same height as the trigger.

<Preview title="Sizes" note="28 / 32 / 40px">
  <DsSelect label="Small" size="sm" :options="scopes" model-value="all" width="170px" />
  <DsSelect label="Medium" size="md" :options="scopes" model-value="all" width="170px" />
  <DsSelect label="Large" size="lg" :options="scopes" model-value="all" width="170px" />
</Preview>

### Trigger states

Tab into the row to see the focus ring. Hover and press to see the fill move without any text recolouring.

<Preview title="Trigger states" note="focus with Tab, hover with the pointer">
  <DsSelect label="Default" :options="scopes" model-value="in-scope" width="170px" />
  <DsSelect label="Placeholder" :options="scopes" placeholder="Select a scope" width="170px" />
  <DsSelect label="Clearable" :options="scopes" model-value="all" clearable width="170px" />
  <DsSelect label="Disabled" :options="scopes" model-value="all" disabled width="170px" />
  <DsSelect label="Read only" :options="scopes" model-value="all" read-only width="170px" />
  <DsSelect label="Loading" :options="scopes" loading width="170px" />
</Preview>

### Validation and help text

Invalid draws its second pixel inside the box, so the outer size never moves and the row beside it never shifts.

<Preview title="Invalid, required and help text" note="inset ring, outer box unchanged">
  <DsSelect
    label="Severity" :options="severities" required invalid
    error-text="Pick a severity before saving" width="200px" />
  <DsSelect
    label="Scope" :options="scopes" model-value="in-scope"
    help-text="Applies to new requests only" width="200px" />
</Preview>

### Option states

The check column stays reserved on every row, so labels hold their column as selection moves.

<Preview title="Option states" note="row height matches the trigger">
  <DsSelect
    label="Severity" :options="severities" model-value="high" :initial-open="true"
    :initial-active="2" inline-overlay width="200px" />
  <DsSelect
    label="Method" :options="groupedMethods" model-value="POST" :initial-open="true"
    :initial-active="0" inline-overlay width="200px" />
</Preview>

### Loading, empty and failed

Three different answers to an unusable list. Each occupies a row without being an option, so arrow keys never land on it.

<Preview title="Loading, empty and failed" note="each row is a row, not an option">
  <DsSelect label="Method" :options="[]" loading :initial-open="true" inline-overlay width="180px" />
  <DsSelect label="Method" :options="[]" :initial-open="true" inline-overlay width="180px" />
  <DsSelect label="Method" :options="[]" failed :initial-open="true" inline-overlay width="180px" />
</Preview>

### Single selection

Open the list and arrow through it. Selection follows focus and tracks the highlight, matching native `<select>`. Press Escape to cancel back to the value held at open.

<Preview title="Interactive: single" note="type G to jump to GET">
  <div class="min-h-[260px] w-[190px]">
    <DsSelect label="Method" v-model="method" :options="methods" clearable width="190px" />
    <div class="mt-3 text-caption">Value: {{ method || "none" }}</div>
  </div>
</Preview>

### Filterable list

Type to narrow the nine options in two groups, then arrow and press Enter. Selection does not follow focus, so scanning a filtered list commits nothing.

<Preview title="Interactive: filterable" note="filter, then arrow and press Enter">
  <div class="min-h-[300px] w-[190px]">
    <DsSelect label="Method" variant="filterable" v-model="filtered" :options="groupedMethods" width="190px" />
    <div class="mt-3 text-caption">Value: {{ filtered || "none" }}</div>
  </div>
</Preview>

### Multiple selection

Space toggles the highlighted option and the popup stays open, so picking four values costs one open rather than four.

<Preview title="Interactive: multiple" note="Space toggles, the trigger reads a count">
  <div class="min-h-[260px] w-[190px]">
    <DsSelect label="Severity" variant="multiple" v-model="picked" :options="severities" width="190px" />
    <div class="mt-3 text-caption">Value: {{ picked.join(", ") || "none" }}</div>
  </div>
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | | Field label. Rendered as a real `<label for>`, so clicking it opens the Select. |
| `options` | `DsSelectOption[]` | `[]` | Each option takes `value`, `label`, optional `disabled` and optional `group`. |
| `variant` | `single` `filterable` `multiple` `native` | `single` | Chooses the ARIA shape and the keyboard model. |
| `size` | `sm` `md` `lg` | `md` | Control height 28, 32 or 40px. Option rows match. |
| `modelValue` | `string` or `string[]` | | An array on the multiple variant, a string elsewhere. |
| `placeholder` | string | `Select an option` | Shown while no value is held. Never the label, never a format hint. |
| `icon` | string | | FontAwesome class drawn before the value, for example `fas fa-globe`. |
| `helpText` | string | | Below the container. Stays present when an error appears. |
| `errorText` | string | | Below the container. Names the constraint that was violated. |
| `emptyText` | string | `No options` | Used when the option set is empty. |
| `failedText` | string | `Could not load options` | Used when the fetch failed. Paired with a Retry control. |
| `filterPlaceholder` | string | `Filter` | Filterable variant only. |
| `width` | string | `220px` | Set by the layout, never by the current value. |
| `clearable` | boolean | `false` | Adds a clear control. Single variant, optional fields only. |
| `disabled` | boolean | `false` | Leaves the tab sequence and is not announced. |
| `readOnly` | boolean | `false` | Keeps full text contrast, stays in the tab sequence, drops the chevron. |
| `invalid` | boolean | `false` | Draws an inset danger ring without changing the outer box. |
| `required` | boolean | `false` | Adds the marker and `aria-required`. |
| `loading` | boolean | `false` | Spinner replaces the chevron. The control stays focusable. |
| `failed` | boolean | `false` | The option set could not be fetched. Not the same as empty. |
| `hideLabel` | boolean | `false` | Keeps the label for assistive technology only. Argue for it first. |

### Events

| Event | Payload | Fires when |
|---|---|---|
| `update:modelValue` | `string` or `string[]` | The value changes, including selection following focus. |
| `change` | `string` or `string[]` | Alongside `update:modelValue`. |
| `retry` | none | The user presses Retry in the failed row. |

### Class strings

These are the classes the component applies. They work unchanged in the product.

```html

<button class="flex min-h-md w-full min-w-[64px] items-center gap-2 rounded-sm border border-control bg-raised pl-3 pr-2.5 text-body text-ink">
  In scope only
  <i class="fas fa-chevron-down text-[12px] text-ink-muted"></i>
</button>

<button class="flex min-h-md w-full items-center gap-2 rounded-sm border border-danger-ink bg-raised pl-3 pr-2.5 text-body text-ink shadow-[inset_0_0_0_1px_var(--c-danger-fg)]">
  Select a severity
</button>

<div class="w-max min-w-full max-w-[480px] rounded-md border border-control bg-raised p-1 shadow-lg">
  <div class="max-h-[min(384px,50vh)] overflow-y-auto" role="listbox"></div>
</div>

<div class="flex min-h-md items-center gap-2 rounded-xs bg-selected px-2 text-ink" role="option" aria-selected="true">
  <span class="inline-flex w-4 flex-none justify-center text-accent-ink"><i class="fas fa-check text-[12px]"></i></span>
  <span class="min-w-0 truncate">In scope only</span>
</div>
```

The focus ring is the same string on every focusable part: trigger, clear control, filter field and Retry.

```html
<button class="focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]">
```

Colours are role classes, never hex. `bg-raised` resolves per theme, so the same markup is correct in light and dark.

</template>

<template #usage>

### When to use

Use a Select when the value comes from a finite set the system owns, persists after the choice, and is read back from the trigger.

The fourth test is the one that gets skipped: collapsing costs a click and hides the option set. Pay that cost only when laying the options flat would dominate the layout.

| Situation | Use instead | Why |
|---|---|---|
| Two options, mutually exclusive | Radio group, or a Switch for on and off | A Select for two values spends a click to reveal one alternative. |
| Three to five options that fit flat | Radio group or Segmented control | Zero clicks to read the whole set. |
| The options are verbs | Menu, `role="menu"` | A Menu invokes and closes. A Select stores. |
| The options filter a data set | Filter bar or query input | A filter is a predicate, not a field value. |
| The user may enter a value not in the list | Autocomplete | A Select cannot express a value it does not own. |
| A plain form field, three to seven static options | Native `<select>` | The OS renders it, so no ancestor clips it. |
| Over roughly 25 options with no grouping | Filterable Select, or a picker dialog | Below the fold of a capped overlay, scanning becomes scrolling. |

Carbon on the two-option case: *"It is best practice not to use a dropdown if there are two options to choose from. In this case, use a radio button group instead."*

<DoDont
  do="Put commands in a Menu, which runs one and closes."
  dont="The trigger keeps reading Delete, as if Delete were the value.">
  <template #do>
    <DsMenu label="Actions for request 41" surface="button" trigger-label="Actions" :groups="commandGroups" />
  </template>
  <template #dont>
    <DsSelect label="Actions" :options="commands" model-value="delete" width="190px" />
  </template>
</DoDont>

### Variants

| Variant | ARIA shape | Meaning | Rule |
|---|---|---|---|
| Single | `combobox` with `aria-autocomplete="none"` over a `listbox` | One value from a bounded set | The default, up to eight options. Selection follows focus. |
| Filterable | `combobox` with `aria-autocomplete="list"` | One value from a large bounded set | Mandatory above eight options. Below eight the field is dead weight. |
| Multiple | `listbox` with `aria-multiselectable="true"` | A subset of a bounded set | Space toggles, the popup stays open, selection does not follow focus. |
| Native | `<select>` | One value, form-shaped | Three to seven static options, no grouping, icons, filtering or async. |

Carbon ships three variants of this control. Single and Multiple are kept, and the Combo box moves out to a separate Autocomplete because free text unbounds the value set. The native escape hatch that Carbon's own guidance names is added back.

<DoDont
  do="Switch to the filterable variant above eight options."
  dont="Above eight options the user scrolls a capped list instead of typing.">
  <template #do>
    <DsSelect label="Method" variant="filterable" :options="groupedMethods" width="190px" />
  </template>
  <template #dont>
    <DsSelect label="Method" :options="groupedMethods" model-value="POST" width="190px" />
  </template>
</DoDont>

There is no quiet, borderless or underline-only Select. Spectrum's quiet Picker drops three of the four borders, and WCAG 2.2 SC 1.4.11 requires the remaining boundary to clear 3:1.

That boundary is the only sign a control exists. Deleting three quarters of the perimeter removes the indicator on three quarters of it.

### Sizing

Height arithmetic is `height = line box + 2 x padding-block + 2 x border`. Padding-block is derived from the height token, never chosen.

| Size | Height | Line box | Padding-block | Lead | Trail | Radius | Border | Icon |
|---|---|---|---|---|---|---|---|---|
| `sm` | 28 | 16 | 5 | 8 | 6 | 4 | 1 | 16 |
| `md` | 32 | 20 | 5 | 12 | 10 | 4 | 1 | 16 |
| `lg` | 40 | 20 | 9 | 16 | 14 | 4 | 1 | 20 |

| Value | Rule | Source |
|---|---|---|
| Heights 28 / 32 / 40 | 32 is canonical across four systems. 28 is the working default in dense chrome. | Spectrum `component-height-100: 32`, Ant `controlHeight: 32`, Primer medium control 2rem |
| Padding-block 5 / 5 / 9 | `(H - L - 2B) / 2`. Odd values are correct, not rounding errors. | Spectrum ships vertical padding tokens of 2, 3, 4, 7, 10, 13, 15 and 19px |
| Lead padding 8 / 12 / 16 | Density is a separate axis from height. | Primer condensed 8px, normal 12px, spacious 16px at one control size |
| Trail padding is lead minus 2 | The trailing item is a glyph. Icon boxes carry side bearing, so optical padding diverges. | Spectrum edge-to-text 12px against edge-to-visual 10px on one 32px control |
| Radius 4 | The trigger is operated by the user, so it takes the control radius. | Spectrum `corner-radius-small: 4px` |
| Border 1px | 2px is reserved for the invalid state, so it may not be spent at rest. | Primer thin border 1px, Spectrum `border-width-100: 1px` |
| Icon 16 / 16 / 20 | Keyed off the line box. A 16px glyph floats inside a 40px control. | Carbon: 16px and 20px icons are balanced against 14px and 16px text |
| Gap 8 | Value edge to chevron edge. Larger than the 4px pairing gap. | Spectrum `picker-visual-to-disclosure-icon-medium: 8px` |

Width follows `min-width = 2 x height`, which is Spectrum's picker minimum-width multiplier. Below that ratio the chevron and the trail reserve consume the control and no value is legible.

**A Select never changes width when its value changes.** Width comes from the layout or from the longest option, resolved once. A Select that shrinks for "GET" and grows for "OPTIONS" moves every neighbouring control on every selection.

| Overlay part | Value | Rule |
|---|---|---|
| Radius | 6 | The overlay contains other things, so it takes the container radius. |
| Border | 1px `border-control`, mandatory | A shadow alone does not survive on a dark canvas. |
| List inset | 4 | Sets the option radius by the concentric rule. |
| Option radius | 2 | Derived: `6 - 4 = 2`. Reusing 6 pinches the corner band. |
| Option height | Equals the trigger height | Carbon: the field height and menu option height should always match. |
| Option padding-inline | 8 both edges | With the 4px inset, overlay edge to content is 12, matching the `md` lead. |
| Check column | 16px glyph plus 8px gap | Overlay edge to label is 32px, reproducing Spectrum's not-selected indent. |
| Offset from trigger | 4 | Reads as detached without letting the pointer leave the composite target. |
| Min-width | Equals the trigger width | A narrower overlay makes the trigger look like a different element. |
| Max-width | 2 x trigger width, capped at 480px | Beyond that the option text is a paragraph and the list should be a dialog. |
| Max-height | 12 option rows, capped at `50vh` | Rows, not pixels. A pixel cap cuts the visible count when a user raises their font. |

Never set a fixed `height` on the trigger. Use `min-height` with centred content. It survives a user forcing line-height to 1.5x under SC 1.4.12, and does not clip at 200% zoom under SC 1.4.4.

### States

Focus recolours nothing. The indicator is a 1px ring on the border box with no offset, so the control keeps its radius.

One tone, because that is what the product ships: `--c-focus-ring` is primary-500 on paper and white in dark, and each clears its own theme. Always `:focus-visible`, never `:focus`, which fires on pointer click and trains every mouse user to ignore the ring.

| Trigger state | Fill | Boundary | Value | Chevron |
|---|---|---|---|---|
| default | `bg-raised` | `border-control` | `text-ink` | `text-ink-muted` |
| hover | `bg-inset` | unchanged | unchanged | `text-ink` |
| active | `bg-selected` | unchanged | unchanged | unchanged |
| focus-visible | unchanged | unchanged | unchanged | unchanged |
| open | `bg-inset` | unchanged | unchanged | rotated 180 degrees |
| disabled | `bg-disabled` | `border-separator` | `text-ink-faint` | `text-ink-faint` |
| read-only | transparent | `border-separator` | `text-ink` at full contrast | removed |
| loading | `bg-raised` | unchanged | unchanged | replaced by a spinner |
| invalid | `bg-raised` | `border-danger-ink` plus a 1px inset ring | `text-ink` | `text-danger-ink` |

If the user must be able to read the value, the control is read-only, never disabled.

| Property | Read-only | Disabled |
|---|---|---|
| Container fill | transparent | field background |
| Value ink | full contrast | disabled ink |
| Chevron | removed, nothing to disclose | present, disabled ink |
| Tab sequence | stays in | removed |
| Announced | yes | no |
| Submitted with the form | yes | no |

<DoDont
  do="Use read-only for a value the user still needs to read."
  dont="Disabled greys the value and drops the field out of tab order.">
  <template #do>
    <DsSelect label="Scope" :options="scopes" model-value="in-scope" read-only width="190px" />
  </template>
  <template #dont>
    <DsSelect label="Scope" :options="scopes" model-value="in-scope" disabled width="190px" />
  </template>
</DoDont>

| Option state | Fill | Label | Check glyph |
|---|---|---|---|
| resting | none | `text-ink` | absent, indent held open |
| visually focused | `bg-inset` | `text-ink` | absent |
| selected | `bg-selected` | `text-ink` | present, `text-accent-ink` |
| selected and focused | `bg-selected` blended toward the ink | `text-ink` | present, `text-accent-ink` |
| disabled | none | `text-ink-faint` | absent |
| group header | none | `text-ink-muted`, weight 600 | not applicable |

**Pointer hover and keyboard focus paint one fill.** Two highlights in one open list give the user two apparent cursors and no way to predict what Enter commits.

**Selection is carried by the check glyph, not by the fill.** That redundancy is what exempts the fill from the 3:1 floor of SC 1.4.11. Remove the glyph and the fill must clear 3:1 against the resting fill, which no tint achieves while carrying 4.5:1 text on both.

Never set the `disabled` attribute while options load. A disabled element leaves the tab sequence, so a keyboard user's focus is destroyed mid-interaction. Primer's rule for the same case: display a spinner, set `aria-disabled`, preserve focus.

<DoDont
  do="Keep it focusable while loading, with a spinner replacing the chevron."
  dont="Disabling mid-load destroys the keyboard user's focus position.">
  <template #do>
    <DsSelect label="Method" :options="[]" loading width="190px" />
  </template>
  <template #dont>
    <DsSelect label="Method" :options="[]" disabled width="190px" />
  </template>
</DoDont>

Never present a fetch failure as an empty list. "No options" tells the user their filter was too narrow. The truth is that the system failed and they need a retry, not a different query.

Pressed, visited and indeterminate do not apply. A Select holds a value, not a binary state, and multi-select expresses partial selection as a count on the trigger.

### Accessibility

The trigger carries `role="combobox"` and the popup carries `role="listbox"`. The APG requires each one: role combobox on the element that displays the value, `aria-controls` pointing at the popup, and `aria-expanded` present in both states. Focus never leaves it, *"DOM focus remains on the combobox"*, with `aria-activedescendant` naming the focused option.

| Attribute | Where | Value |
|---|---|---|
| `role="combobox"` | trigger | single and filterable |
| `aria-expanded` | trigger | `false` closed, `true` open. Always present. |
| `aria-controls` | trigger | id of the listbox |
| `aria-activedescendant` | trigger | id of the focused option, absent when none |
| `aria-autocomplete` | trigger | `none` single, `list` filterable |
| accessible name | trigger | from the `<label for>`. `aria-label` is the fallback. |
| `aria-describedby` | trigger | help text id and error text id, space separated |
| `aria-busy="true"` | trigger | while options load |
| `aria-multiselectable="true"` | popup | multiple variant only |
| `role="option"` | each option | never on a message row or a group header |
| `aria-selected` | each option | written explicitly as `true` or `false` |
| `role="group"` | option group | labelled by the group header text |
| `role="status"` | live region | count after filtering, loading, empty, failed |

A missing accessible name is this component's most common failure. The visible value looks like a name and is not one: the value answers "what is selected", the name answers "selected what".

<DoDont
  do="Give the field a visible label above the control."
  dont="Without a label the control has no name for a screen reader.">
  <template #do>
    <DsSelect label="Severity" variant="multiple" :options="severities" :model-value="['high']" width="190px" />
  </template>
  <template #dont>
    <DsSelect label="Severity" hide-label variant="multiple" :options="severities" :model-value="['high']" width="190px" />
  </template>
</DoDont>

| Key, closed | Behaviour |
|---|---|
| Tab | One tab stop for the whole control, chevron included. |
| Down Arrow | Opens on the selected option, or the first if none. |
| Up Arrow | Opens and moves visual focus to the last option. |
| Enter | Opens the popup. |
| Home, End | Opens on the first or last option. |
| Printable character | Single: type-ahead to the next matching name. Filterable: opens and filters. |
| Escape | Clears the value on a clearable Select. |

| Key, open | Behaviour |
|---|---|
| Down Arrow, Up Arrow | APG: *"Moves focus to and selects the next option."* |
| Page Down, Page Up | Moves visual focus 10 options, clamped at the ends. |
| Home, End | Moves visual focus to the first or last option. |
| Enter | Accepts the focused option, closes, returns focus to the trigger. |
| Escape | Closes and restores the value held when the popup opened. |
| Tab | Commits the focused option, closes, moves to the next control. |
| Space | Multiple variant: toggles the focused option. The popup stays open. |

Selection follows focus on the single variant only. Single replaces native `<select>` and must behave like one. Arrowing a filtered list would commit values the user is still scanning, and on multiple, Space is the toggle, so movement cannot also select.

Escape restores the value held at open. Without that, a user who arrows through a selection-follows-focus list and then presses Escape has silently changed the field while trying to cancel.

DOM focus never enters the option list, because moving it there breaks the filterable variant. The overlay is not a focus trap: Tab leaves it and commits.

On close, focus returns to the trigger on every path. A close that leaves focus on `<body>` sends the next Tab press to the top of the document.

The focused option is scrolled into view with the smallest scroll that reveals it, never centred. The overlay closes when its trigger scrolls out of view, since an overlay anchored to an invisible element is attached to nothing.

| Part | Floor | Criterion |
|---|---|---|
| Value text on the trigger fill | 4.5:1 | SC 1.4.3. It is text at 14px. |
| Placeholder text | 4.5:1 | SC 1.4.3. It carries meaning, so it takes `text-ink-muted`. |
| Option label, on every fill it can sit on | 4.5:1 | SC 1.4.3, evaluated on resting, hover and selected separately. |
| Group header and message text | 4.5:1 | SC 1.4.3. It is text. |
| Trigger boundary | 3:1 | SC 1.4.11. It is the only indicator that a control is present. |
| Chevron and check glyph | 3:1 | SC 1.4.11, as graphical objects needed to understand the control. |
| Focus ring | 3:1 against everything adjacent | SC 1.4.11 and SC 2.4.13. The token is chosen per theme to hold this. |
| Selected option fill | exempt while the glyph is present | SC 1.4.11 exempts a redundant indicator. |

### Content

| Slot | Rule | Reason |
|---|---|---|
| Field label | Sentence case, three words or fewer, no colon | Carbon: text input labels should be three words or less. |
| Placeholder | An instruction, "Select a scope". Never the label or an example value | It disappears on selection. What must survive belongs in the label. |
| Option label | Sentence case, no terminal punctuation, distinguishing word first | Options truncate from the tail. |
| Redundant prefixes | Strip them. "GET", not "Method: GET" | The field label already carries the noun. |
| Group header | A noun phrase, never a sentence, never clickable | It labels a set. A clickable header is Menu behaviour. |
| Empty, no options | "No options available" | States that the set is empty, not that the query failed. |
| Empty, after filtering | Names the query: `No results for "sco"` | The user's next action differs: widen the filter, or leave. |
| Loading | "Loading…". One string, one row, no skeleton | A skeleton in a list of unknown length implies a length. |
| Error | "Could not load options", plus a Retry control | Says what failed and offers the one action that fixes it. |
| Multi-select summary | `3 selected` | The trigger has one line of fixed width. Extra words push out the count. |
| Help text | Stays present when an error appears | Replacing it deletes the rule the user needs to fix the error. |
| Error text | Names the constraint, not the fact that something is wrong | "Select a scope" is actionable. "Invalid selection" is not. |

Option order changes at the same eight-option threshold that turns on filtering. Below eight, order by logic or by frequency with the most-picked value first, because the user is scanning a short set.

At eight and above, order alphabetically, because the user is searching for a known string. Never order by database id.

</template>

</PageTabs>
