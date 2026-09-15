---
outline: false
pageClass: wide
---

# Checkbox, radio and switch

Three controls bind a value the user sets by selection rather than by typing. The system picks between them on one question, when does the value take effect, never on how the control looks.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### The three controls

A checkbox stages a value, a radio group holds one value out of a visible set, and a switch commits the moment it is released.

<Preview title="The three controls" note="md, 28px hit area">
  <DsChoice kind="checkbox" label="Intercept requests" />
  <DsChoice kind="radio" group-label="Scope" :options="[{ value: 'in', label: 'In scope only' }, { value: 'all', label: 'All traffic' }]" :selected="['all']" />
  <DsChoice kind="switch" label="Auto-scroll" :model-value="true" />
</Preview>

### Sizes

Two sizes. Small for table cells and toolbars, medium for settings, dialogs and forms.

<Preview title="Checkbox sizes" note="hit area 24 / 28, box 14 / 16">
  <DsChoice kind="checkbox" size="sm" label="Small checkbox, 14px box" />
  <DsChoice kind="checkbox" size="md" label="Medium checkbox, 16px box" />
</Preview>

<Preview title="Radio and switch sizes" note="radio 12 / 14, track 24 / 28">
  <DsChoice kind="radio" size="sm" group-label="Small" :options="[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }]" :selected="['a']" />
  <DsChoice kind="radio" size="md" group-label="Medium" :options="[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }]" :selected="['a']" />
  <DsChoice kind="switch" size="sm" label="Small switch" :model-value="true" />
  <DsChoice kind="switch" size="md" label="Medium switch" :model-value="true" />
</Preview>

### Checkbox values

Three values, and the mark carries all three. Mixed is a display value that summarises descendants.

<Preview title="Checkbox values" note="unchecked, checked, mixed">
  <DsChoice kind="checkbox" label="Unchecked" />
  <DsChoice kind="checkbox" label="Checked" :model-value="true" />
  <DsChoice kind="checkbox" label="Mixed" indeterminate />
</Preview>

### States

Hover and press paint the row, not the box. Read-only keeps full contrast and stays in the tab order.

<Preview title="Checkbox states" note="hover and press are on the row">
  <DsChoice kind="checkbox" label="Default" />
  <DsChoice kind="checkbox" label="Disabled" disabled />
  <DsChoice kind="checkbox" label="Disabled, checked" :model-value="true" disabled />
  <DsChoice kind="checkbox" label="Read-only, checked" :model-value="true" readonly />
  <DsChoice kind="checkbox" label="Invalid" invalid />
</Preview>

### Focus

Tab into the row. The ring wraps the painted box, so the indicator is one size everywhere.

<Preview title="Focus, by keyboard" note="ring wraps the box, not the row">
  <DsChoice kind="checkbox" label="Tab to me" />
  <DsChoice kind="checkbox" label="Then to me" :model-value="true" />
  <DsChoice kind="switch" label="And to me" />
</Preview>

### Label and description

The description states the consequence and is carried by `aria-describedby`, so the accessible name stays short.

<Preview title="Label and description" note="description is aria-describedby">
  <DsChoice kind="checkbox" label="Intercept requests" description="Pauses each request until you forward or drop it." />
</Preview>

### Unlabelled row selector

A table selector has no visible label, so `aria-label` names the object it selects and padding carries the box to 24px.

<Preview title="Unlabelled row selector" note="24 x 24 hit area, named by aria-label">
  <DsChoice kind="checkbox" size="sm" aria-label="Select request 4821" />
  <DsChoice kind="checkbox" size="sm" aria-label="Select request 4822" :model-value="true" />
</Preview>

### Radio group

One tab stop. Tab in, then arrow through the options. Arrow keys move focus and selection together and skip disabled options.

<Preview title="Radio group, one tab stop" note="Tab in, then arrow keys">
  <DsChoice kind="radio" group-label="Scope" :options="[{ value: 'in', label: 'In scope only' }, { value: 'all', label: 'All traffic' }, { value: 'out', label: 'Out of scope only', disabled: true }]" :selected="['in']" />
</Preview>

<Preview title="Radio group, inline" note="16px between items">
  <DsChoice kind="radio" inline group-label="Body encoding" :options="[{ value: 'raw', label: 'Raw' }, { value: 'form', label: 'Form' }, { value: 'json', label: 'JSON' }]" :selected="['json']" />
</Preview>

### Required and invalid

Invalid is a group state. Every box carries the boundary and one message sits under the group.

<Preview title="Radio group, required and invalid" note="one error for the group">
  <DsChoice kind="radio" required invalid group-label="Scope" error="Choose a scope before running." :options="[{ value: 'in', label: 'In scope only' }, { value: 'all', label: 'All traffic' }]" />
</Preview>

### Tri-state parent

The parent reads its children on every change. Activating it while mixed checks all of them.

<Preview title="Checkbox group with a tri-state parent" note="mixed is derived, activation checks all">
  <DsChoice kind="checkbox" group-label="Passive checks" parent-label="All passive checks" :options="[{ value: 'headers', label: 'Security headers' }, { value: 'cookies', label: 'Cookie flags' }, { value: 'tls', label: 'TLS configuration' }]" :selected="['headers']" />
</Preview>

### Switch states

The knob moves at once and `aria-busy` covers the round trip. State text is decorative and hidden from assistive technology.

<Preview title="Switch states" note="off, on, state text, loading, disabled">
  <DsChoice kind="switch" label="Off" />
  <DsChoice kind="switch" label="On" :model-value="true" />
  <DsChoice kind="switch" label="Proxy" state-text :model-value="true" />
  <DsChoice kind="switch" label="Committing" :model-value="true" loading />
  <DsChoice kind="switch" label="Disabled" disabled />
  <DsChoice kind="switch" label="Disabled, on" :model-value="true" disabled />
</Preview>

### A settings block

A switch track is the height of a checkbox box, so a mixed column keeps one optical band.

<Preview title="A settings block" note="switches and checkboxes on one optical band">
  <DsChoice kind="switch" label="Intercept" description="Pauses traffic until you forward or drop it." :model-value="true" />
  <DsChoice kind="checkbox" group-label="Store in history" :options="[{ value: 'req', label: 'Requests' }, { value: 'res', label: 'Responses' }, { value: 'ws', label: 'WebSocket frames' }]" :selected="['req', 'res']" />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `kind` | `checkbox` `radio` `switch` | `checkbox` | Chooses the graphic, the role and the keyboard model. |
| `size` | `sm` `md` | `md` | Hit area 24 or 28px. The painted box follows. |
| `label` | string | | Visible label of a single control. Omit only for a row selector. |
| `description` | string | | One line stating the consequence, carried by `aria-describedby`. |
| `modelValue` | boolean | `false` | Value of a single checkbox or switch. |
| `indeterminate` | boolean | `false` | Checkbox only. Mixed displays but is never selectable. |
| `disabled` | boolean | `false` | Leaves the tab order and is not announced. |
| `readonly` | boolean | `false` | Stays focusable at full contrast. Blocks the change handler. |
| `invalid` | boolean | `false` | Applies to the group, never to one option. |
| `loading` | boolean | `false` | Switch only. Sets `aria-busy` over an optimistic commit. |
| `stateText` | boolean | `false` | Switch only. Decorative on or off text, `aria-hidden`. |
| `ariaLabel` | string | | Names an unlabelled control after the object it selects. |
| `options` | `ChoiceOption[]` | | Two to seven. Present for a group, absent for a single control. |
| `groupLabel` | string | | Visible group label. Required for any group of two or more. |
| `selected` | `string[]` | `[]` | Group selection. A radio group holds at most one value. |
| `error` | string | | One message for the whole group, shown while `invalid` is set. |
| `required` | boolean | `false` | Adds the marker and `aria-required` on the group. |
| `inline` | boolean | `false` | Lays the options out in a row instead of a column. |
| `parentLabel` | string | | Checkbox group only. Adds the tri-state parent. |

`ChoiceOption` is `{ value, label, description?, disabled? }`.

### Events

| Event | Payload | Fires when |
|---|---|---|
| `update:modelValue` | boolean | A single checkbox or switch changes. |
| `update:selected` | `string[]` | A group changes, including the tri-state parent. |

### Class strings

These are the classes the component applies. They work unchanged in the product.

```html

<label class="relative flex min-h-[28px] cursor-pointer items-start gap-2 rounded-sm py-1 hover:bg-[var(--c-state-hover)]">
  <span class="relative flex h-5 flex-none items-center justify-center">
    <input type="checkbox" class="peer absolute inset-0 m-0 cursor-[inherit] p-0 opacity-0">
    <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-xs border border-control bg-raised"></span>
  </span>
  <span class="text-body text-ink">Intercept requests</span>
</label>

<span class="flex h-4 w-4 items-center justify-center rounded-xs border border-accent bg-accent text-ink-onsolid">
  <i class="fas fa-check text-[12px] leading-none"></i>
</span>

<span class="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-accent bg-accent text-ink-onsolid">
  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
</span>

<span class="relative block h-4 w-7 rounded-full border border-accent bg-accent">
  <span class="absolute left-px top-px h-3 w-3 rounded-full bg-ink-onsolid transition duration-2 ease-standard motion-reduce:transition-none [transform:translateX(12px)]"></span>
</span>

<span class="flex h-4 w-4 items-center justify-center rounded-xs border border-separator bg-disabled text-ink-faint"></span>
```

The ring is drawn on the painted box and driven by the input beside it, so it wraps a 16px graphic rather than a 300px row.

```html
<input class="peer absolute inset-0 opacity-0">
<span class="peer-focus-visible:outline-none peer-focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] peer-"></span>
```

Colours are role classes, never hex. `bg-accent` resolves per theme, so the same markup is correct in light and dark.

</template>

<template #usage>

### When to use

Use a checkbox for a value the user stages and commits later, a radio group for one value out of a small visible set, and a switch for a setting that takes effect on release.

| Control | Cardinality | Commit timing | Announces as |
|---|---|---|---|
| Checkbox | 0 or 1 per control, 0 to n per group | Pending, committed by Save, Apply or Run | "checkbox, checked / not checked / mixed" |
| Radio | Exactly 1 of a visible set of 2 to 7 | Pending, with the same commit | "radio button, N of M, selected" |
| Switch | 1 per control | Immediate. There is no Save | "switch, on / off" |

Commit timing is the promise the control's shape makes, and users act on it before they read anything. A checkbox with no Save button sends the user hunting for one, and a switch in a dialog gets toggled twice to test whether it already applied. Both failures are silent.

<DoDont
  do="Use a switch for a setting that applies on release."
  dont="A checkbox waits for a Save button this surface does not have.">
  <template #do>
    <DsChoice kind="switch" label="Intercept requests" :model-value="true" />
  </template>
  <template #dont>
    <DsChoice kind="checkbox" label="Intercept requests" :model-value="true" />
  </template>
</DoDont>

A checkbox group answers "which of these" and a radio group answers "which one of these". If deselecting everything is a legal answer, the control is a checkbox group, because no key returns a radio group to nothing selected.

### Use something else when

| The control | Use | Because |
|---|---|---|
| Picks one of more than seven exclusive values | Select | Seven radios already cost a column of height, and past that the set stops being scannable. |
| Picks one of two to five views or modes in chrome | Segmented control with radio-group semantics | A mode selector belongs in the toolbar as one object, not a stack of rows. |
| Performs work when activated | Button | A checkbox that fires a request on change has no resting meaning. |
| Adds or removes a filter and carries a count | Chip | A chip owns its remove affordance. A second target inside a label is ambiguous. |
| Selects rows in a data table | Table row selection | The header box is tri-state over the page of rows and the hit area is the cell. |
| Expands or collapses content on the page | Disclosure with `aria-expanded` | A switch promises a persisted setting. Collapsing a panel persists nothing. |
| Accepts terms, or any value a form submits | Checkbox, never a switch | A switch inside a submitted form claims the value already took effect. |

Carbon sets the lower bound: "It is best practice not to use a dropdown if there are two options to choose from. In this case, use a radio button group instead."

### Variants

Six variants, and no others. There are no style, emphasis or severity variants.

| Variant | Meaning | Rule |
|---|---|---|
| `checkbox` | One independent binary value, staged | Default for any yes or no in a form, dialog or filter list. |
| `checkbox group` | Zero to n from a visible set | Two to seven options, wrapped in `role="group"` with a visible label. |
| `checkbox tri-state` | A derived summary of descendants | Only ever a parent. A leaf control is never mixed. |
| `radio group` | Exactly one of a visible set | Two to seven options, all visible. Never a single radio alone. |
| `switch` | One binary setting, committed on release | Settings panels, toolbars, per-project toggles. |
| `switch with state text` | The same, with the value rendered as text | Only where the surface is read at a glance. The text is `aria-hidden`. |

Spectrum ships a checkbox emphasis option and Material 3 ships no checkbox style variants at all. This system takes Material's position: a selection control's importance is set by where it sits in the form, not by its own fill.

<DoDont
  do="Give a radio group at least two options."
  dont="One radio cannot be unset once it has been clicked.">
  <template #do>
    <DsChoice kind="radio" group-label="Scope" :selected="['in']" :options="[{ value: 'in', label: 'In scope only' }, { value: 'all', label: 'All traffic' }]" />
  </template>
  <template #dont>
    <DsChoice kind="radio" group-label="Scope" :selected="['in']" :options="[{ value: 'in', label: 'In scope only' }]" />
  </template>
</DoDont>

The APG defines the mixed state verbatim: "When partially checked, it has state `aria-checked` set to `mixed`."

| Tri-state rule | Why |
|---|---|
| Mixed is derived, never authored. The parent reads its descendants on every change. | A parent stored apart from its children drifts, and a checked parent sits over unchecked children. |
| Activating a mixed parent checks all descendants, and never clears them. | The convention in Carbon, Primer and macOS, and the only non-destructive choice. |
| The cycle is two-state from the user's side. Mixed displays but is never selectable. | Mixed answers a question about children, not a question the user was asked. |

### Anatomy

Eight parts, five in one control and three more in the container that holds a set.

| # | Part | Required | What governs it |
|---|---|---|---|
| 1 | Hit area | Yes | The `<label>`, wrapping box and text. Owns padding, hover and press. Never under 24 x 24. |
| 2 | Painted box | Yes | Square for a checkbox, circle for a radio, pill track for a switch. Owns the boundary and the ring. |
| 3 | Indicator ink | Only when set | Checkmark, mixed bar, dot or knob. This is the state, never the fill alone. |
| 4 | Label | Yes, except on a row selector | Type role `body` at `md`, `dense` at `sm`. Wraps freely. Clicking it toggles the control. |
| 5 | Description | No | One line, type role `caption`, muted ink, associated with `aria-describedby`. |
| 6 | Group container | Yes for any group | `role="radiogroup"` for radios, `role="group"` for checkboxes. Owns the error and the required marker. |
| 7 | Group label | Yes for groups of two or more | A `<legend>` inside a `<fieldset>`, or an element referenced by `aria-labelledby`. |
| 8 | Error text | Only when invalid | Type role `caption`, danger ink, referenced by every control in the group. |

Part 1 owns the feedback and part 2 owns the boundary. The hit area paints hover and press because the hit area is what the pointer hits. Splitting them the other way highlights a 16px square while accepting clicks across 300px.

<DoDont
  do="Put the caveat in the description line, below the label."
  dont="Folded into the label, the caveat becomes the accessible name.">
  <template #do>
    <DsChoice kind="checkbox" label="Intercept requests" description="Pauses each request until you forward or drop it." :model-value="true" />
  </template>
  <template #dont>
    <DsChoice kind="checkbox" label="Intercept requests, which pauses each request until you forward or drop it" :model-value="true" />
  </template>
</DoDont>

| Rule | Breaking it costs |
|---|---|
| Put the box, the label and the description inside one `<label>`. | The text stops being part of the target and needs an `id` to associate. |
| Scope a description to the group or to the item, and hang it off that. | Users read the nearest text as scoping to the nearest control. |
| Align the box to the first line of a wrapping label. | A box centred on a three-line label floats mid-paragraph with nothing to anchor it. |
| Never put a link, a button or an input inside a label. | Clicking it also toggles the control, and the accessible name swallows the link text. |
| Never paint the hover layer on the box. | It teaches the user a 16px target when the target is the width of the row. |

### Sizing

Every control has two boxes, sized separately. The hit area is a row and the painted box is the graphic.

```
hit_area_height    = label_line_box + (2 x padding_block) + (2 x border_width)
painted_box_height = indicator_size + (2 x inner_padding) + (2 x border_width)
```

| Size | Height | Padding-block | Padding-inline | Type role | Gap | Radius |
|---|---|---|---|---|---|---|
| `sm` | 24 | 3 | 0 labelled, 5 unlabelled | `dense` 14 / 18 | 8 | 4 |
| `md` | 28 | 4 | 0 labelled, 4 unlabelled | `body` 14 / 20 | 8 | 4 |

Worked: `sm` is 18 + (2 x 3) = 24. `md` is 20 + (2 x 4) = 28. Small belongs in table cells, tree nodes and toolbars. Medium is the default for settings, dialogs and forms.

| Decision | Value | Why | Source |
|---|---|---|---|
| Hit area floor | 24 x 24 at every density | The one control exempt from compact density. A missed target costs more than a tall row. | WCAG 2.2 SC 2.5.8, Level AA |
| Radius owner | The hit area, at 4 | A hovered checkbox row and a hovered menu item then share one shape. | Spectrum `corner-radius-small: 4px` |
| Padding-inline | 0 labelled, `(24 - box_width) / 2` unlabelled | A labelled box aligns with the label column. The formula clears the 24px floor. | Derived |
| Box-to-label gap | 8 | Double the 4px gap an icon takes inside a button, because the box has its own boundary. | Carbon checkbox label padding-left 8, radio icon margin-right 8 |
| Label type role | `body` at 400, not `label` at 500 | The `label` role carries `line-height: 1`, and these labels wrap to two and three lines. | Carbon types the label as `$body-compact-01` |

SC 2.5.8 is verbatim: "The size of the target for pointer inputs is at least 24 by 24 CSS pixels."

| Size | Control | Box | Radius | Indicator | Height arithmetic |
|---|---|---|---|---|---|
| `md` | Checkbox | 16 x 16 | 2 | check glyph 12, mixed bar 8 x 2 | 12 + (2 x 1) + (2 x 1) = 16 |
| `md` | Radio | 14 x 14 | full | dot 6 | 6 + (2 x 3) + (2 x 1) = 14 |
| `md` | Switch | 28 x 16 | full | knob 12 | 12 + (2 x 1) + (2 x 1) = 16 |
| `sm` | Checkbox | 14 x 14 | 2 | check glyph 10, mixed bar 7 x 2 | 10 + (2 x 1) + (2 x 1) = 14 |
| `sm` | Radio | 12 x 12 | full | dot 6 | 6 + (2 x 2) + (2 x 1) = 12 |
| `sm` | Switch | 24 x 14 | full | knob 10 | 10 + (2 x 1) + (2 x 1) = 14 |

Every box carries a 1px border.

| Value | Number | Why | Source |
|---|---|---|---|
| Checkbox box at `md` | 16 | Two of three desktop systems land on 16, and it clears the 24px floor by 4 each side. | Carbon 16px, Spectrum `checkbox-control-size-medium: 16px` |
| Radio against checkbox | 2 smaller at every step | Optical. A circle of equal diameter reads larger than a square, whose corners carry area. | Spectrum checkbox 14 / 16 / 18 against radio 12 / 14 / 16 |
| Radio dot | 6 at both sizes | At fractional device pixel ratios a 5px dot lands on a half pixel and renders as a smudge. | Carbon: dot 8 in a control of 20, a ratio of 0.40 |
| Checkbox radius | 2 | Objects of 20px or under take the 2px step. At 4px a 16px box reads as a switch track. | Material 3 `md-comp-checkbox container-shape: 2px` |
| Border | 1 everywhere | Material 3's 2px outline is 25% of a 16px box, so the control reads as half filled. | Primer `--borderWidth-thin`, Spectrum `border-width-100` |
| Check glyph | 12 in a 16 box | A glyph touching the boundary merges with it at 100% zoom, and the box reads as solid. | Derived: box minus border minus 1px optical clearance |
| Mixed bar | 8 x 2 | Half the box wide, so "some" reads as a fraction of "all". 2px is the checkmark's stroke. | Derived |
| Switch track height | 16 at `md`, equal to the checkbox box | A settings column mixes switches and checkboxes, and two graphic heights break the band. | Derived |
| Switch track width | `2 x border + 2 x inset + 2 x knob`, so 28 at `md` and 24 at `sm` | Travel equals one knob diameter, so the two positions never overlap. | SC 1.4.1 Use of Color |

The switch's 1.75:1 track ratio sits between Carbon's small toggle at 2.0:1 and Material 3's switch at 1.63:1.

| Relationship | Value | Rule |
|---|---|---|
| Group label to first item | 8 | Carbon publishes "Group label margin-bottom 8 / 0.5" for both group types. |
| Vertical gap between items | 4 | Carbon's checkbox item margin. Pitch is 32 at `md` and 28 at `sm`. |
| Horizontal gap between items | 16 minimum | Twice the box-to-label gap. Below 2:1 the pairing inverts. |
| Group to error text | 4 | The error binds to the group above it, closer than the next field. |
| Group to next field | 16 | One step above the widest gap inside the group. |

Carbon uses 4px between checkbox items and 8px between vertical radio items. This system unifies both at 4px, because a settings form mixes the two and two pitches make the form look mis-set.

| Rule | Breaking it costs |
|---|---|
| Derive the switch track width from the knob and the inset. | Travel stops equalling the knob diameter as soon as the size step changes. |
| Hold the hit area at 24px in both axes under every density mode. | Compact density starts shipping targets that fail SC 2.5.8. |
| Align a group's boxes on one vertical axis and let the labels run ragged. | Right-aligned text inside a group gives the eye two edges to track. |
| Never shrink the painted box below 12px. | A 10px circle with a 1px boundary leaves no dot that survives a fractional pixel ratio. |
| Never use the button's 4px icon gap between a box and its label. | At 4px the box attaches to whichever text is nearer. |

### States

Colours are semantic role classes. A numbered palette step here is a defect, because both themes execute the same rule.

| Control and value | Box fill | Boundary | Indicator |
|---|---|---|---|
| Checkbox, unchecked | `bg-raised` | 1px `border-control` | none |
| Checkbox, checked | `bg-accent` | 1px `border-accent` | `text-ink-onsolid` check |
| Checkbox, mixed | `bg-accent` | 1px `border-accent` | `text-ink-onsolid` bar |
| Radio, unselected | `bg-raised` | 1px `border-control` | none |
| Radio, selected | `bg-accent` | 1px `border-accent` | `text-ink-onsolid` dot |
| Switch, off | `bg-inset` | 1px `border-control` | knob `bg-ink-muted` |
| Switch, on | `bg-accent` | 1px `border-accent` | knob `bg-ink-onsolid` |

One accent across all three controls, in both themes, at every size. Two selection hues teach the user that hue means something, and then the user looks for a meaning that is not there.

The switch's off track is a filled inset rather than a transparent box. A transparent track holds the knob with 1px of boundary, so the knob sits on the surface rather than in a track, and the two fills are what the 3:1 state-change floor measures.

| State | Hit area | Box | Mechanism |
|---|---|---|---|
| Hover | `bg-[var(--c-state-hover)]`, 4px radius | unchanged | An alpha layer over whatever surface the row sits on. |
| Pressed | `bg-[var(--c-state-pressed)]` | unchanged | Same layer, deeper alpha. No transform, no size change, no shadow. |
| Focus-visible | unchanged | 1px ring on the box | No offset. Wraps the box, never the label. |
| Focus with hover | hover layer | ring | Independent layers. Neither suppresses the other. |
| Disabled | no layer, no pointer events | `bg-disabled`, 1px `border-separator`, `text-ink-faint` ink | Opaque tokens, never opacity. Held to a 2.5:1 to 3.5:1 band. |
| Read-only | no layer, focusable | unchanged | `aria-disabled="true"`, the change handler blocked, full contrast kept. |
| Invalid | unchanged | 1px `border-danger-ink` | Applies to the group. Colour alone never carries it, the message does. |
| Loading | unchanged | unchanged | Switch only. Optimistic, with `aria-busy="true"`. |

Hover and press transition over 70ms, and the box and knob over 110ms, both on `ease-standard`. Ring radius is box radius plus 2, so 4px for a checkbox and full for a radio and a switch.

Loading does not apply to a checkbox or a radio. Neither control performs work, so a spinner would claim a selection is being processed while it is still staged. A switch does load, optimistically: the knob moves, `aria-busy` is set, and on failure the knob returns with an error in the surface that owns the setting.

Invalid applies to the group and never to one option. A radio group is one value, so "you have not chosen" is one error, and per-option markers repeat it once per option.

<DoDont
  do="Use read-only when the user still needs the value."
  dont="Disabled drops the value out of the tab order.">
  <template #do>
    <DsChoice kind="checkbox" label="Store WebSocket frames" :model-value="true" readonly />
  </template>
  <template #dont>
    <DsChoice kind="checkbox" label="Store WebSocket frames" :model-value="true" disabled />
  </template>
</DoDont>

Carbon states the rule: "In scenarios where the content of a disabled component or element is still relevant to the user ... the read-only variation is used."

Hover and press are alpha layers on the row, not fixed colours on the box, because these controls sit on the page, on a card, in a menu, in a well and in a table row. The mechanism is Material 3's `md-sys-state` model, applied as a rectangle on the hit area rather than a circle centred on the box.

One state layer per pointer position. A checkbox inside a table row that already paints its own hover does not paint a second one, because two stacked alphas produce a brightness step on the rows that contain a checkbox.

WCAG 2.2 exempts inactive components: "User Interface Components that are not available for user interaction are not required to meet contrast requirements." The 2.5:1 to 3.5:1 band is a design decision, not a conformance one.

The ring is one tone per theme rather than one tone for both. `--c-focus-ring` resolves to primary-500 `#A1213F` on paper and `#ffffff` in dark, so each theme picks a value that clears its own surfaces instead of asking a single value to clear every surface in both.

The ring has to clear both a near-white panel and the saturated accent fill of the box it wraps. Those need opposite branches, so two concentric rings ship together.

| Rule | Breaking it costs |
|---|---|
| Paint hover and press on the hit area as alpha state layers. | A fixed ramp is correct on one surface and wrong on the other four. |
| Give a switch an optimistic commit with `aria-busy`, and revert with a visible error. | A knob held still until the round trip returns reads as a checkbox. |
| Put the invalid boundary on every box and the message under the group, once. | Per-option messages are read aloud once per option. |
| Never disable a checked control by fading the accent. | A desaturated accent reads as a different colour rather than an inactive one. |
| Never animate the checkmark path, the box size or the row height. | Only fill, boundary, mark colour and knob transform may change, over 70ms to 110ms. |
| Never style `:focus`. | The ring persists after every click, and a ring shown when it is not needed stops being read. |

### Accessibility

| Case | Requirement |
|---|---|
| Checkbox | Native `<input type="checkbox">`. Role, checked state and the Space key come from the browser. |
| Radio | Native `<input type="radio">` with a shared `name`, which gives the group roving focus. |
| Switch | Native `<input type="checkbox" role="switch">`. `true` and `false` only, never `mixed`. |
| Tri-state checkbox | The `indeterminate` DOM property, which the browser maps to `aria-checked="mixed"`. |
| Checkbox group | A container with `role="group"` and `aria-labelledby` pointing at the visible label. |
| Radio group | `<fieldset><legend>`, or `role="radiogroup"` with `aria-labelledby`. Never a bare stack. |
| Accessible name | A `<label for>` or the input nested inside the `<label>`. Never `aria-label` over visible text. |
| Unlabelled control | `aria-label` naming the object: "Select request 4821", not "Select". |
| Description | `aria-describedby` on the control, or on the group when it scopes to the group. |
| Required group | `aria-required="true"` on the container, plus a visible marker in the group label. |
| Invalid group | `aria-invalid="true"` on each control, each pointing at the one error message. |
| Unavailable, value still readable | `aria-disabled="true"` with a blocked handler, not the `disabled` attribute. |

The APG states the group rule verbatim: "If a set of checkboxes is presented as a logical group with a visible label, the checkboxes are included in an element with `role group` that has the property `aria-labelledby` set to the ID of the element containing the label."

The checkbox pattern is verbatim: "When the checkbox has focus, pressing the Space key changes the state of the checkbox."

| Key | Checkbox | Switch | Radio group |
|---|---|---|---|
| `Tab` | Its own tab stop, including inside a group | Its own tab stop | One tab stop for the whole group |
| `Space` | Toggles | Toggles and commits | Checks the focused button |
| `Enter` | Submits the form, and must not be intercepted | Optional, outside a form only | Submits the form |
| Arrow keys | None | None | Move focus and selection, wrapping at both ends |

On entry, verbatim: "If a radio button is checked, focus is set on the checked button. If none of the radio buttons are checked, focus is set on the first radio button in the group."

A radio group is one tab stop with a roving `tabindex`. A checkbox group is n tab stops. A seven-option radio group built the other way charges a keyboard user seven presses to pass a question they did not want to answer.

| Focus rule | Breaking it costs |
|---|---|
| Focus never moves on a value change, except a radio arrow key moving both. | Focus that jumps on a value change loses the user's position in the form. |
| A tri-state parent never takes focus when its children change. | The user is pulled out of the child they were working in. |
| A group that reveals dependent fields leaves focus on the control. | Moving focus into the revealed block skips the rest of the group. |
| A control removed by its own change hands focus on deliberately. | Focus dropped on a removed node lands on `<body>`. |

| Part | Floor | Criterion |
|---|---|---|
| Label and description text | 4.5:1 against the surface behind it | SC 1.4.3. 14px at 400 is not large text. |
| Unchecked boundary | 3:1 against every surface the control can sit on | SC 1.4.11. It is the only thing that says a control is there. |
| Checked fill | 3:1 against the surrounding surface | SC 1.4.11. The fill is the state indicator. |
| Checkmark, bar, dot, knob | 3:1 against the fill it sits on | SC 1.4.11. A mark that vanishes leaves the fill carrying the state. |
| Switch on-track against off-track | 3:1 | SC 1.4.11 state change. Position also distinguishes them, per SC 1.4.1. |
| Focus ring | 3:1 against both the box and the surface behind it | SC 1.4.11, plus SC 2.4.13's contrast leg. |
| Focus ring area | At least a 2px perimeter of the box, `4h + 4w` | SC 2.4.13. A 2px outline at 2px offset delivers `4w + 4h + 48`. |
| Error text | 4.5:1 | SC 1.4.3. |
| Disabled | Exempt, held to a 2.5:1 to 3.5:1 band | SC 1.4.11 exempts components not available for interaction. |
| Hit area | 24 x 24 CSS px, 44 x 44 under `pointer: coarse` | SC 2.5.8, and SC 2.5.5 for coarse pointers. |

The unchecked boundary is the highest-risk value in the component. SC 1.4.11 says "adjacent color(s)", plural, so it is tested as a cross product against every surface role, not one representative pairing.

| Rule | Breaking it costs |
|---|---|
| Test the unchecked boundary against every surface in the system. | These controls live on cards, in wells, in menus and in table rows. |
| Name an unlabelled control after the object it selects. | A screen reader's control list reads as a column of "Select". |
| Keep the `indeterminate` property in sync after every re-render. | No markup carries it, so the parent silently loses its bar. |
| Never put `aria-label` on a control that already has a visible label. | The two names drift, and the visible text stops being the accessible name. |
| Never use `aria-checked="mixed"` on a switch. | It is not valid for the role, and it describes a setting that cannot exist. |
| Never rely on the `readonly` attribute for a checkbox or a radio. | It is inert on both, so the control stays editable while looking otherwise. |

### Content

| Rule | Statement | Cost of breaking it |
|---|---|---|
| C1 | Sentence case, no terminal punctuation. | Title case reads as a proper noun and slows scanning. |
| C2 | Write the label as the state that is true when the control is set. | A negative label inverts the control, and checked then means "do not". |
| C3 | Four words or fewer for a group member. | Options written as sentences cannot be compared down the column. |
| C4 | A label that needs a sentence gets a description line instead. | Everything in the label is read as the name, caveats included. |
| C5 | A switch label names the thing, never the state and never "enable". | "Enable intercept" announces as "Enable intercept, switch, off". |
| C6 | A switch label never changes with the state. | A changing label reads as neither the current state nor the result. |
| C7 | The group label asks the question and the options answer it. | Mixed grammar forces the user to re-read the group label each time. |
| C8 | Descriptions state a consequence, not a restatement. | A restatement costs a line and teaches users to skip descriptions. |
| C9 | A required group carries the marker on the group label. | A marker on each option reads as though each option is required. |
| C10 | Never fix a label's width to its English string. | German and Finnish run 30% to 40% longer and truncate in translation. |

Carbon sets C3's lower bound at "should not exceed three words". Four allows for a qualifier.

<DoDont
  do="Write the label as the state that is true when set."
  dont="Negated, checked means 'do not' and inverts the control.">
  <template #do>
    <DsChoice kind="checkbox" label="Follow redirects" :model-value="true" />
  </template>
  <template #dont>
    <DsChoice kind="checkbox" label="Do not follow redirects" :model-value="true" />
  </template>
</DoDont>

| Rule | Breaking it costs |
|---|---|
| Name the setting and let the control carry the state. | A label that repeats the state announces it twice and goes stale. |
| Write group options in one grammatical form and one rough length. | The column has to be read rather than scanned. |
| Never append the current value to a switch label. | It duplicates the role's announcement and guarantees a stale state. |
| Never let a label wrap to three lines. | At that length it is a paragraph with a checkbox beside its first line. |

</template>

</PageTabs>
