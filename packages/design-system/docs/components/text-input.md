---
outline: false
pageClass: wide
---

# Text input

A text input takes a value the system cannot list in advance: a hostname, a header, a regex, a note, a query, a credential. The single-line field, the textarea and the search field are one component, because they share one geometry, one label contract, one message contract and one focus ring.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Variants

Four behaviours, one visual style. Text is the default, multiline carries newlines, search filters a visible collection, masked hides a credential behind a reveal toggle.

<Preview stack title="Variants" note="text / multiline / search / masked">
  <DsInput label="Hostname" placeholder="target.example.com" />
  <DsInput variant="multiline" label="Note" placeholder="Why this target matters" />
  <DsInput variant="search" label="Filter requests" placeholder="Filter requests" />
  <DsInput variant="masked" label="API token" placeholder="Paste the token" model-value="ca1do-9f2b-7710" />
</Preview>

### Sizes

Three heights off the shared control ladder, so a field always matches the button or select beside it.

<Preview stack title="Sizes" note="28 / 32 / 40px box height">
  <DsInput size="sm" label="Small" placeholder="28px" />
  <DsInput size="md" label="Medium" placeholder="32px" />
  <DsInput size="lg" label="Large" placeholder="40px" />
</Preview>

### States

The border carries hover and invalid. The ring carries focus, so tab into a field to see it.

<Preview stack title="States" note="border carries hover and invalid, the ring carries focus">
  <DsInput label="Default" placeholder="target.example.com" />
  <DsInput label="Invalid" model-value="https://target.example.com" invalid error="Enter a hostname without a scheme." />
  <DsInput label="Loading" model-value="target.example.com" loading help="Checking availability." />
  <DsInput label="Required" required placeholder="target.example.com" />
</Preview>

### Read only versus disabled

Tab through the pair. The read-only field takes focus and its value can be selected and copied, while the disabled field is skipped.

<Preview stack title="Read only versus disabled" note="fill, value ink and tab order all differ">
  <DsInput label="Session token" readonly model-value="s-8f21ac40" help="Select and copy this value." />
  <DsInput label="Session token" disabled model-value="s-8f21ac40" help="Not part of this interaction." />
</Preview>

### Help and error text

Both sit above the box, in that order. The error is added to the message region and never replaces the help.

<Preview stack title="Help and error text" note="error never replaces help">
  <DsInput label="Hostname" help="Only alphanumerics and hyphens." placeholder="target.example.com" />
  <DsInput label="Hostname" help="Only alphanumerics and hyphens." invalid error="Enter a hostname without a scheme." model-value="https://target.example.com" />
</Preview>

### Prefix and suffix

Static affixes sit 12px from the value and take no pointer events, so clicking one lands the caret in the value.

<Preview stack title="Prefix and suffix slots" note="static affixes, 12px from the value">
  <DsInput label="Endpoint" prefix="https://" placeholder="target.example.com" />
  <DsInput label="Timeout" suffix="ms" model-value="30000" />
  <DsInput label="Weight" prefix="x" suffix="kg" model-value="2.5" />
</Preview>

### Search, interactive

Type to reveal the clear control, then press Escape to clear the value.

<Preview stack title="Search field" note="Escape clears, then passes through on the next press">
  <DsInput variant="search" label="Filter requests" placeholder="Filter requests" />
</Preview>

### Masked, interactive

The reveal control is a real button with `aria-pressed`, so it announces its state and takes a tab stop.

<Preview stack title="Masked field" note="reveal is a button with aria-pressed">
  <DsInput variant="masked" label="API token" model-value="ca1do-9f2b-7710-4e02" />
</Preview>

### Counter and textarea

The counter sits on the label row rather than under the caret. The textarea opens at three rows and resizes vertically only.

<Preview stack title="Character counter" note="counter sits on the label row">
  <DsInput label="Label" :maxlength="24" model-value="Login flow" help="Twenty-four characters." />
</Preview>

<Preview stack title="Textarea" note="three rows minimum, vertical resize only">
  <DsInput variant="multiline" label="Note" placeholder="Why this target matters" help="Markdown is not rendered." />
  <DsInput variant="multiline" label="Note" readonly model-value="Captured from the 2026-02-11 scan." />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | | Visible label text. Required on every field. |
| `variant` | `text` `multiline` `search` `masked` | `text` | Behaviour, not appearance. |
| `size` | `sm` `md` `lg` | `md` | Box height 28, 32 or 40px. |
| `placeholder` | string | | An example of a valid value. |
| `help` | string | | Format rule or scope. Stays visible during an error. |
| `error` | string | | Shown only while `invalid` is set. |
| `prefix` | string | | Static leading affix, such as a scheme. |
| `suffix` | string | | Static trailing affix, such as a unit. |
| `required` | boolean | `false` | Adds the marker inside the label element. |
| `disabled` | boolean | `false` | Removed from the tab order. Not copyable. |
| `readonly` | boolean | `false` | Focusable, selectable, submitted with the form. |
| `invalid` | boolean | `false` | Set after validation has run, never at render. |
| `loading` | boolean | `false` | Async validation or suggestions in flight. |
| `maxlength` | number | | Enables the counter under the rule in Content. |
| `rows` | number | `3` | Textarea rows. Three is the floor. |
| `autocomplete` | string | | Required on fields collecting user information. |
| `hideLabel` | boolean | `false` | Toolbar search only. Label stays in the accessible name. |

Slots `prefix` and `suffix` take a node when the string props are not enough.

### Class strings

The box is the flex container. The inner input drops its own border, background, padding and height.

```html

<div class="flex min-h-md items-center gap-3 rounded-md border border-control bg-raised px-3
            has-[:focus-visible]:outline has-[:focus-visible]:outline-1
            has-[:focus-visible]:shadow-[0_0_0_1px_var(--c-focus-ring)]">
  <input class="grow min-w-0 appearance-none border-0 bg-transparent p-0 text-body font-normal leading-none text-ink outline-none" />
</div>

<div class="flex min-h-md items-center gap-3 rounded-md border border-control bg-raised px-3">
  <i class="fas fa-magnifying-glass w-4 flex-none text-[16px] text-ink-muted" aria-hidden="true"></i>
  <input type="search" class="grow min-w-0 appearance-none border-0 bg-transparent p-0 text-body leading-none text-ink outline-none" />
</div>

<div class="flex min-h-md items-center gap-3 rounded-md border border-danger-ink bg-raised px-3">
  <input class="grow min-w-0 appearance-none border-0 bg-transparent p-0 text-body leading-none text-ink outline-none" />
</div>

<div class="flex min-h-md items-center gap-3 rounded-md border border-separator bg-inset px-3">
  <input readonly class="grow min-w-0 appearance-none border-0 bg-transparent p-0 text-body leading-none text-ink outline-none" />
</div>

<div class="flex min-h-md items-center gap-3 rounded-md border border-control bg-disabled px-3 pointer-events-none select-none">
  <input disabled class="grow min-w-0 appearance-none border-0 bg-transparent p-0 text-body leading-none text-ink-faint outline-none" />
</div>

<div class="flex items-stretch gap-3 rounded-md border border-control bg-raised px-3 py-2">
  <textarea rows="3" class="grow min-w-0 resize-y appearance-none border-0 bg-transparent p-0 text-body text-ink outline-none"></textarea>
</div>

<button type="button" aria-label="Clear search"
        class="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-transparent text-ink-muted hover:bg-inset hover:text-ink">
  <i class="fas fa-xmark" aria-hidden="true"></i>
</button>
```

`min-h-md` with `py-0` and `leading-none` gives the table height without the browser's font metrics entering the calculation. Caido writes the user's UI font size straight onto the root element, so every rem on the page moves with a setting. A height derived from a font-dependent line box drifts away from the button beside it.

### Message region

```html
<div class="mb-2 mt-1 min-h-[16px]">
  <p id="host-help" class="m-0 text-caption text-ink-muted empty:hidden">Only alphanumerics and hyphens.</p>
  <p id="host-error" class="m-0 text-caption text-danger-ink empty:hidden"></p>
</div>
```

Both ids stay in `aria-describedby` whether or not the error node carries text. Creating a node and its text in one commit is announced unreliably, so the node exists first.

Colours are role classes, never hex. `bg-raised` and `border-control` resolve per theme, so the same markup is correct in light and dark.

### The field boundary

`border-control` resolves to `--c-line-control`, which is surface-350 on paper and surface-600 in dark. It is the rung the 3:1 boundary figure was solved against, and no softer line token reaches it.

The product does not inherit that edge from PrimeVue. The prebuilt preset paints control boundaries at 1.51:1, so the light theme re-points them in a layer that lands after `c-utilities`.

```css
:root[data-mode="light"] [data-pc-name="inputtext"],
:root[data-mode="light"] [data-pc-name="textarea"],
:root[data-mode="light"] [data-pc-name="password"] input {
  border-color: hsl(var(--c-line-control));
}
```

The selector keys on `data-pc-*` attributes, never on the preset's class strings, which move between preset releases. The rule carries no state qualifier, so a disabled PrimeVue field keeps the same edge.

On paper the boundary measures 4.13:1 on the raised sheet a field sits on, 3.65:1 on canvas and 3.09:1 on the inset plane. In dark the same token measures 2.04:1, and dark was never re-solved.

Dark has no such override, so the preset's own `border-surface-700` still paints the field there, one rung softer than `--c-line-control`. The system specifies `border-control` in both themes, which is the stronger of the two and the one the light layer already installs.

</template>

<template #usage>

### When to use

Use a text input when the system cannot enumerate the value in advance. That is the entire remit. Every other input problem has a control that solves it better, and reaching for a text field instead is how forms become unvalidatable.

| Situation | Use instead | Why |
|---|---|---|
| A closed set of 2 options | Radio group or segmented control | Free text over a closed set cannot be validated at entry. |
| A closed set of 3 or more | Select, or combobox above 8 options | A text field lets the user type a value that does not exist. |
| A boolean | Checkbox, or switch for an immediate setting | A checkbox implies a pending submit. Neither is a string. |
| A bounded number | Number field or slider | Arrow-key increment and clamping belong to the control. |
| A date, time or duration | Date field | Parsing free-text dates is locale-dependent and silently wrong. |
| A request, response, payload or hex dump | Editor surface at `text-code` | No gutter, no find, no restorable scroll offset. Long payloads defeat virtualisation. |
| Known suggestions the user may override | Combobox with `aria-autocomplete="both"` | The suggestion list is part of the control's ARIA contract. |
| Text that is not editable and never will be | Rendered text, or the read-only variant | A disabled input cannot be reached or copied by keyboard. |

Carbon on the two-option case, verbatim: *"It is best practice not to use a dropdown if there are two options to choose from. In this case, use a radio button group instead."*

### Do and do not

<DoDont
  do="Keep the label visible above the box at all times."
  dont="Without a visible label the empty field names nothing.">
  <template #do>
    <DsInput label="Hostname" placeholder="target.example.com" />
  </template>
  <template #dont>
    <DsInput label="Hostname" hide-label placeholder="target.example.com" />
  </template>
</DoDont>

<DoDont
  do="Keep the help text on screen when the error appears."
  dont="Removing help hides the format rule the user needs.">
  <template #do>
    <DsInput label="Hostname" help="Only alphanumerics and hyphens." invalid error="Enter a hostname without a scheme." model-value="https://target.example.com" />
  </template>
  <template #dont>
    <DsInput label="Hostname" invalid error="Enter a hostname without a scheme." model-value="https://target.example.com" />
  </template>
</DoDont>

<DoDont
  do="Use read only for a value the user must select and copy."
  dont="A disabled value leaves the tab order, so nobody copies it.">
  <template #do>
    <DsInput label="Session token" readonly model-value="s-8f21ac40" />
  </template>
  <template #dont>
    <DsInput label="Session token" disabled model-value="s-8f21ac40" />
  </template>
</DoDont>

<DoDont
  do="Say what is wrong in text beside the danger border."
  dont="Colour alone names neither the problem nor the fix.">
  <template #do>
    <DsInput label="Hostname" invalid error="Enter a hostname without a scheme." model-value="https://target.example.com" />
  </template>
  <template #dont>
    <DsInput label="Hostname" invalid model-value="https://target.example.com" />
  </template>
</DoDont>

<DoDont
  do="Write the placeholder as an example of a valid value."
  dont="A restated label makes an empty field look already filled.">
  <template #do>
    <DsInput label="Endpoint" placeholder="https://target.example.com/login" />
  </template>
  <template #dont>
    <DsInput label="Endpoint" placeholder="Enter an endpoint" />
  </template>
</DoDont>

### Anatomy

Ten named parts in three stacked zones: the label row, the message region and the field box.

| Part | What it is | Rule |
|---|---|---|
| Label | Always present, always visible, above the box. | A real `label for`, 4px above the message region. |
| Required marker | Rendered inside the label element. | Spectrum label text to asterisk, 4px. |
| Counter | Right-aligned on the label row. | `text-caption`, formatted `used/limit`. |
| Help text | Format rules, constraints, scope. Present at rest. | Message region, `text-caption`. |
| Error text | Added to the message region. | Message region, `text-danger-ink`. |
| Field box | The bordered rectangle. Owns height, radius and boundary. | `min-h-*`, `rounded-md`, 1px border. |
| Prefix slot | Leading icon, scheme, unit or scoping select. | 12px from the value. |
| Suffix slot | Clear, reveal, unit, spinner. Two controls at most. | 12px from the value. |
| Status icon | Only invalid and loading occupy it. | Outermost suffix item, at the size's padding inline. |
| Focus ring | Drawn on the box, never on the inner input. | 1px wide at zero offset. |

Drawing the ring on the inner input traces the wrong rectangle whenever a prefix is present.

#### Label position

The label sits above the box. Carbon, Spectrum and Primer all place it there for product UI, and the reason is mechanical rather than stylistic.

A top label has one measurement that holds at every field width: 8px below the label, Carbon's `spacing-03`. A left-aligned label needs a column width negotiated per form, then re-negotiated at every container breakpoint.

Placeholder-as-label is a failure of that rule rather than a compressed version of it. The label disappears the moment the user types, which removes the instruction exactly when the user needs to check their work.

#### Message placement

Help text and error text both sit between the label and the field box, in that order. Nothing sits below the box. This is the GOV.UK ordering, chosen over Carbon's below-field placement for two reasons.

**Occlusion.** Autofill menus, password suggestions and combobox overlays all open downward. Text under the box is the first thing they cover.

**Reading order.** SC 3.3.2 wants instructions readable before the value is committed. Text placed after the control arrives after the decision it was meant to inform.

**The counter is the exception.** It sits on the label row, because it updates on every keystroke, and a live string directly above the caret pulls the eye off the value being typed.

**Reserve the region's height.** In any form with more than one field, the region holds one 16px caption line at all times. Without it, the first error pushes every field below it down, and clearing the error pulls them back up.

### Variants

Four behaviours, one visual style, zero style variants.

| Variant | Meaning | Usage rule |
|---|---|---|
| `text` | Single-line free text. | Any value that fits on one line and holds no newlines. |
| `multiline` | Textarea. | Use when the value holds line breaks or runs past roughly 60 characters. |
| `search` | A query over a collection the user can see. | Typing removes rows. Leading icon, clear control, `type="search"`. |
| `masked` | A credential or secret. | Reveal toggle is a button with `aria-pressed`, never a clickable icon. |

**Slots are not variants.** A field with a leading icon and a field without one are the same variant with different slot occupants, which is why they share one state matrix.

**Width is not a variant.** The parent layout sets it. Every field in the product is `fluid`, so the box fills its column and the form grid owns the width. A field never carries an intrinsic width of its own.

**Below 60 characters, stay single-line.** A single-line field with horizontal scroll scans better than a two-line box.

Carbon ships text input, password, textarea and search as four components whose Style tabs are identical: the same height ladder, the same 8px label margin, the same 4px helper margin, the same field padding. Four names, one geometry.

| Rejected fork | Why |
|---|---|
| Quiet, borderless or underline-only | Removing the box loses the empty field's hit area, which SC 1.4.11 treats as the case where a 3:1 border is mandatory. |
| Filled versus outlined | A second fill doubles a nine-state matrix across ten parts for no information the user gains. |

Spectrum ships a quiet field and then publishes a compensating negative offset for it. That offset is the cost of the fork.

### Sizing

Three heights from the shared control ladder. A field never invents a height of its own. Carbon states the pairing rule directly: *"Small. Use when buttons are paired with 32px small sized input fields."*

| Size | Height | Padding inline | Icon | Gap to value |
|---|---|---|---|---|
| `sm` | 28px `min-h-sm` | 8px `px-2` | 16px | 12px `gap-3` |
| `md` | 32px `min-h-md` | 12px `px-3` | 16px | 12px `gap-3` |
| `lg` | 40px `min-h-lg` | 16px `px-4` | 20px | 12px `gap-3` |

Radius is `rounded-md`, 6px, at every size. Border is 1px in every state. Type is `text-body` at `leading-none`, weight 400.

| Decision | Rule | Source |
|---|---|---|
| Heights 28 / 32 / 40 | Four systems land on 32px for medium. | Spectrum height-100, Primer 2rem, Ant 32, Carbon size-sm |
| Padding is a separate axis from height | A 32px field takes 8px in a toolbar and 16px in a dialog. | Primer condensed 8, normal 12, spacious 16 at every size |
| Radius 6px at every size | The ladder spans 12px of height and no width change. | The preset paints every field `rounded-md` |
| Border 1px in every state | A width change moves the content box and shifts the value 1px. | Carbon thickens to 2px, the ring outside the box replaces that here |
| Weight 400, line-height 1 | The value is user data, not a control affordance. | Primer tight line height, for compact UI elements |
| Icon sized off the line box, not the font | Icon ink fills its box, glyph ink fills about 70% of the em. | Carbon: 16px and 20px icons pair with 14px and 16px text |
| Icons centre-aligned to the text | Carbon, verbatim: *"Don't baseline-align icons to the text."* | Carbon icon guidance |
| Gap 12px between a slot and the value | It puts the value 40px inside the boundary, which is the preset's own icon field. | Preset `iconfield`: icon at `left-3`, input at `pl-10` |

#### The height arithmetic

```
height = line box + (2 x padding-block) + (2 x border)

sm    28 = 14 + (2 x 6)  + (2 x 1)
md    32 = 14 + (2 x 8)  + (2 x 1)
lg    40 = 14 + (2 x 12) + (2 x 1)
```

Padding-block is derived from the height token and the line box. It is never authored, and never the input to the height. Odd derived values are expected: Spectrum's shipped vertical padding tokens are literally 2, 3, 4, 7, 10, 13, 15 and 19px.

Ship the derivation, not the arithmetic. An input vertically centres its single line inside its content box, so `min-h-md` with `py-0` produces the table height on its own.

#### Textarea

The textarea is the same box with a real line box, so the arithmetic changes and nothing else does.

| Property | Value | Rule |
|---|---|---|
| Type | `text-body`, 14 / 20 | Multi-line text is reading text, so it takes the reading line box. |
| Padding-block | 8px, authored | With a real line box there is no height token to derive from. |
| Padding-inline | Same tier as the single-line field | The two must align when stacked in one form. |
| Default and minimum height | 3 rows, 78px | Below three rows a textarea reads as a broken single-line field. |
| Resize | `resize-y` | Horizontal resize breaks the column grid and cannot be undone. |
| Auto-grow | Optional, capped at 12 rows | Past 12 rows the growth pushes the submit control off screen. |

#### Slots

| Measurement | Value | Rule |
|---|---|---|
| Field edge to prefix icon | The size's padding inline | The icon replaces the value at the leading edge. |
| Prefix or suffix to value | 12px `gap-3` | The preset pads the value to 40px and insets the icon to 12px. |
| Interactive suffix to field edge | 4px | Its hit area must not touch the border. |
| Interactive suffix hit area | 24 x 24 minimum | SC 2.5.8, verbatim: *"at least 24 by 24 CSS pixels."* |
| Interactive suffix radius | `rounded-full` when square | A circle has no corner arc to keep concentric. |
| Interactive suffix ring | Inset, `outline-offset-[-2px]` | A ring at zero offset would sit on the field's own border. |

At `sm`, 28px tall, a 24px target leaves 2px of clearance, so `sm` accepts one interactive suffix and `md` accepts two.

### States

| State | Fill | Border | Value | Ring |
|---|---|---|---|---|
| default | `bg-raised` | `border-control` | `text-ink` | none |
| hover | unchanged | `border-ink-muted` | unchanged | none |
| focus-visible | unchanged | `border-control` | unchanged | 1px `gold-ink`, zero offset |
| disabled | `bg-disabled` | `border-control` | `text-ink-faint` | none, not focusable |
| read-only | `bg-inset` | `border-separator` | `text-ink` | ring, focusable |
| invalid | unchanged | `border-danger-ink` | unchanged | ring on focus |
| loading | unchanged | `border-control` | unchanged | ring on focus |

The placeholder is `text-ink-faint`, the label `text-ink-muted`, the help `text-ink-muted`, the error `text-danger-ink`. Disabled drops every one of them to `text-ink-faint`.

`bg-inset` and `bg-disabled` resolve to the same plane in both themes, because the product carries no separate disabled plane. The fill is therefore not what separates read-only from disabled. The value ink and the tab order are.

The disabled fill is the only paint disabled changes. The boundary stays at `border-control`, which is what the preset does: its border rule keys on `invalid` and nothing else.

One reading of the fill differs from the shipped preset. The preset paints a field `bg-surface-0 dark:bg-surface-950`, and in dark `surface-950` is the canvas itself, so a dark field is a well cut into the panel around it. On this page a field sits directly on canvas, where that fill would erase the box. The specimen therefore holds `bg-raised` in both themes, which is exact on paper and one rung light in dark.

Focus does not change the border colour. A field that recolours its border on focus spends the border on a state the ring already carries, and leaves nothing for invalid to say.

#### States that do not exist

| State | Why |
|---|---|
| Active or pressed | Pointer-down places the caret, so there is no held moment to paint. |
| Selected | The text inside is selected, not the field. A field in a list is not a list item. |
| Warning | A field is valid or invalid. A warning belongs in a form-level banner with an action. |
| Hover on disabled or read-only | Disabled invites no interaction. Read-only keeps the caret, and that is the whole affordance. |
| Loading on a plain field | Loading covers async validation only. A spinner in an inert field lies about the wait. |

Carbon's own warning row proves the point by setting the warning message to `text-primary` rather than a warning colour.

#### Read only versus disabled

| | Read-only | Disabled |
|---|---|---|
| Tab order | In | Removed |
| Announced with its value | Yes | Usually skipped |
| Selectable and copyable | Yes | No |
| Submitted with the form | Yes | No |
| Contrast obligation | Full, 4.5:1 on the value | Exempt under SC 1.4.11 |
| Value measured on paper | 12.05:1 on the inset plane | 4.62:1, against no floor |
| Fill and value | Inset plane, `text-ink` | The same plane, `text-ink-faint` |
| Means | "This value is real and you cannot change it here." | "This control is not part of the interaction now." |

SC 1.4.11, verbatim: *"User Interface Components that are not available for user interaction (e.g., a disabled control in HTML) are not required to meet contrast requirements."*

Carbon states the selection rule too: *"In scenarios where the content of a disabled component or element is still relevant to the user … the read-only variation is used."*

Read-only is almost always correct in a security tool full of captured request data. A captured header, a computed hash, a generated project ID and a session token are all values the user needs to read, select and copy.

#### Disabled is a token, never an opacity

`opacity` is rejected on three grounds, two of them measurable.

- It gives a different result on every surface, so one disabled label lands at three contrast ratios over canvas, the raised sheet and the inset plane.
- It creates a stacking context and multiplies down the tree: a field at .6 holding an icon at .8 yields .48.
- It leaks whatever sits behind a translucent overlay through the value text.

Use `bg-disabled`, `text-ink-faint` and the same `border-control` the field carries at rest. The product carries one token for the ink, `--c-ink-disabled`, which resolves to `--c-ink-faint` on paper and to surface-600 in dark.

Against the inset plane it measures 4.62:1 on paper and 2.41:1 in dark. SC 1.4.11 exempts both, so the two numbers are a report rather than a pass. The paper ramp names that rung `placeholder / disabled`, and both roles do resolve to it.

#### When invalid turns on

- Never before the field's first blur, because a half-typed hostname is wrong and saying so is useless.
- On blur, validate and mark.
- Once marked, re-validate on every input and clear the state the instant it passes.
- On failed submit, mark every failing field and move focus to the first one.
- Carry invalid with three signals at once: the danger border, the status icon and the error text.
- Keep the fill unchanged when invalid, since tinting it lowers the value's contrast against its own background.

### Accessibility

Native elements only: `input type="text"`, `textarea` and `input type="search"`, which exposes `role="searchbox"` implicitly. No ARIA role is added, because every role that could be added is the one the element already has.

| Requirement | Form | Rule |
|---|---|---|
| Accessible name | A visible `label for` | SC 3.3.2. `aria-label` only for the toolbar search field. |
| Label in name | The visible string sits inside the accessible name | SC 2.5.3. Voice-control users say what they see. |
| Description | `aria-describedby` naming the help id and the error id | Both ids are referenced permanently, empty or not. |
| Validity | `aria-invalid="true"` only after validation has run | Setting it at render marks an untouched field as failed. |
| Required | Native `required`, plus the marker inside the label | The marker is the visual half of the same statement. |
| Purpose | `autocomplete` on fields collecting user information | SC 1.3.5, Level AA, one attribute. |
| Async state | `aria-busy="true"` while validating | Removed when the result lands. |
| Character limit | `maxlength` plus a counter in a `role="status"` region | The counter announces politely, the field does not. |

#### Keyboard

Everything here is native. The specification is mostly a list of things not to intercept.

| Key | Single-line | Textarea | Search |
|---|---|---|---|
| `Tab` | Move into and out of the field | Move out of the field | Move into and out of the field |
| `Enter` | Submits the form if one has a submit control | Inserts a newline | Runs the query, or no-op when filtering is incremental |
| `Escape` | Passes through, so an enclosing dialog closes | Passes through | Clears a non-empty value, then passes through |
| `Home` / `End` | Caret to start or end of value | Caret to start or end of line | As single-line |
| Arrow keys | Caret movement | Caret movement across lines | `Down` opens a suggestion list where one exists |
| `Ctrl` or `Cmd` + `Z` | Native undo and redo | Native undo and redo | Native undo and redo |

| Rule | Why |
|---|---|
| `Tab` never inserts a tab character in a textarea | It is the only way out, so trapping it is the classic keyboard trap. |
| `Escape` clears the search variant only | In a form field, clearing destroys work nobody asked to destroy. |
| Never re-implement undo | Swallowing `Ctrl+Z` loses the user's typing with no recovery path. |
| Every slot control is a real `button type="button"` | A styled `span` has no tab stop and no accessible name, and without the type it submits the form. |

#### Focus

A field's ring is one pixel of gold drawn immediately outside the boundary, at zero offset. That is what ships: the preset writes `focus:ring-1 focus:ring-secondary-500 dark:focus:ring-secondary-400` and suppresses the native outline. The tone is `gold-ink` in both themes, so one value covers every plane a field can sit on.

| Plane under the field | Paper ring | Dark ring |
|---|---|---|
| Raised sheet | 6.15:1 | 5.48:1 |
| Canvas | 5.43:1 | 6.47:1 |
| Inset | 4.60:1 | 6.47:1 |

The floor is 3:1, so the tightest pairing a field can produce still clears 4.5:1. See [Accessibility](/foundations/accessibility) for the two ring bans that hold everywhere.

Gold, not the brand crimson, because the ring sits one pixel outside a `border-danger-ink` edge whenever a focused field is also invalid. Two reds touching read as one thick red border, and the field then says nothing about where the keyboard is.

| Rule | Why |
|---|---|
| `:focus-visible`, never `:focus` | The preset keys on `:focus`, which fires on pointer click and trains people to ignore rings. On the wrapper the selector is `:has(:focus-visible)`. |
| Ring radius is the control radius | At zero offset the ring hugs the border box, so `rounded-md` covers the border and the ring together. |
| The ring area does not clear SC 2.4.13 | A 1px ring at zero offset gives about `2w + 2h` square px, half the `4w + 4h` that criterion asks for. It is AAA, and this is a reported gap rather than a pass. |
| Never auto-focus a field | Unless it is the sole purpose of the view, it takes the keyboard and moves the reading position. |
| Focus must not be covered by sticky chrome | SC 2.4.11. Give scroll containers scroll padding equal to the sticky height plus 4px. |
| Never clip the ring with `overflow-hidden` | The ring is drawn outside the border box, which is what an ancestor clips away. |

#### Contrast floors

Every figure below was measured against the raised sheet the field sits on, apart from the disabled row, which is measured on the inset plane.

| Part | Floor | Paper | Dark |
|---|---|---|---|
| Value text | 4.5:1 | 16.11:1 | 7.47:1 |
| Placeholder | 4.5:1 | 6.18:1 | 2.86:1 |
| Label, help, counter and affix ink | 4.5:1 | 6.41:1 | 4.01:1 |
| Error text and status icon | 4.5:1 | 6.26:1 | 5.53:1 |
| Field boundary | 3:1 | 4.13:1 | 2.04:1 |
| Focus ring | 3:1 | 6.15:1 | 5.48:1 |
| Disabled parts | Exempt under SC 1.4.11 | 4.62:1 | 2.41:1 |

Paper was solved against that budget. Dark was never re-solved, so its column reports what dark measures rather than what it was built to meet, and three rows sit under their figure.

SC 1.4.3 relaxes to 3:1 at 18pt, or 14pt bold. The value, the label and the placeholder are all 14px, which is 10.5pt, so the relaxation never applies and every ink here is solved at 4.5:1.

APCA is reported alongside dark on the Accessibility page because the WCAG formula loses accuracy there. It never replaces the floor, and no part of this component is gated on it.

### Content

| Element | Rule | Why |
|---|---|---|
| Label | Sentence case, three words or fewer, a noun phrase, no trailing colon. | Carbon, verbatim: *"Text input labels should be three words or less."* |
| Required marker | Mark the minority. One convention per form, never both. | Marking every field in an all-required form carries no information. |
| Placeholder | An example of a valid value, roughly 30 characters. | The format rule must survive the first keystroke, so it lives in help text. |
| Help text | One sentence. States the format, constraint or scope. | It is what the user needs to fix an error, so removing it removes the fix. |
| Error text | One sentence saying what is wrong and what to do. | SC 3.3.1 wants the error in text, SC 3.3.3 wants the correction. |
| Error text, worked | "Enter a hostname without a scheme" | "Invalid hostname" satisfies neither success criterion. |
| Naming the field in an error | Only when the message appears away from the field. | Beside a label reading "Hostname", the name is already adjacent. |
| Counter | From the first keystroke at a limit of 40 or fewer, otherwise from 80%. | `3/4000` is noise. `3200/4000` is information. |
| Search placeholder | Name the scope, not the action: "Filter requests", not "Search". | The user can see it is a search field. The scope is what they cannot see. |
| Units | Static text in the suffix slot, never in the placeholder or label. | A unit in the placeholder vanishes on input, and seconds then look like milliseconds. |
| Truncation | The value scrolls. It never truncates with an ellipsis. | An ellipsis is indistinguishable from a value that really ends in three dots. |

</template>

</PageTabs>
