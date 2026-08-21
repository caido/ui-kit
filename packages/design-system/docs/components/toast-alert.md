---
outline: false
pageClass: wide
---

# Toast and inline alert

The inline alert sits in the document flow and persists until the condition it reports resolves. The toast floats above the application and confirms an outcome the user already caused.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Intents

Five intents, and the enumeration is closed. Each renders a fixed glyph and a summary that names what happened, so colour is the third channel.

<Preview title="Intents" note="glyph and words carry the meaning, colour is third">
  <DsAlert intent="danger" summary="Rule failed to compile" />
  <DsAlert intent="warning" summary="Rule matched no requests" />
  <DsAlert intent="success" summary="3 projects updated" />
  <DsAlert intent="info" summary="42 requests exported" />
  <DsAlert intent="neutral" summary="Drop a request to replay it" />
</Preview>

### Delivery forms

The same message in both forms. The alert keeps the 4px severity rail and fills its container, the toast drops the rail, takes elevation and clamps between 288 and 336px.

<Preview title="Delivery forms" note="rail 4px inline-start on the alert, elevation on the toast">
  <DsAlert
    intent="danger" summary="Replay send failed"
    detail="Connection refused by 10.0.0.14:8443. Check the upstream host and send again." />
  <DsAlert
    form="toast" intent="danger" summary="Replay send failed"
    detail="Connection refused by 10.0.0.14:8443." />
</Preview>

### Sizes

The compact alert drops the detail line rather than shrinking any part of itself.

<Preview title="Sizes" note="alert sm 32, alert md 48, toast 48 at 288 to 336 wide">
  <DsAlert size="sm" intent="warning" summary="Certificate not trusted" />
  <DsAlert
    intent="warning" summary="Certificate not trusted"
    detail="Responses are still recorded. Install the CA certificate to remove this warning." />
  <DsAlert form="toast" intent="success" summary="Project saved" />
</Preview>

### Anatomy in full

Icon, summary, detail and up to two actions. The detail aligns to the summary text rather than to the container edge, so a wrapped line reads as one paragraph.

<Preview title="Anatomy in full" note="icon 16, gap 8, summary to detail 4, detail to actions 8">
  <DsAlert
    intent="danger" summary="Rule failed to compile"
    detail="Line 4: unterminated character class. The rule is disabled until it compiles."
    :actions="['Open rule', 'Disable rule']" />
</Preview>

### Dismissal

When the user cannot resolve the condition from this view, the dismiss control is absent rather than disabled. An advisory message always carries one.

<Preview title="Dismissal" note="the control is absent, never disabled">
  <DsAlert
    intent="danger" :dismissible="false" summary="Proxy is offline"
    detail="The listener on 127.0.0.1:8080 stopped. Nothing is being captured. This alert carries no dismiss control, because the condition is still true." />
  <DsAlert
    intent="info" summary="A new version is available"
    detail="Advisory, so it can be dismissed. Dismiss it and the example offers to bring it back." />
</Preview>

### Action loading

An in-flight action takes `aria-disabled`, keeps its label and holds its place in the tab order.

<Preview title="Action loading" note="aria-disabled and a reserved slot, so the width does not move">
  <DsAlert
    intent="warning" loading summary="Scan paused at 1204"
    detail="The spinner takes a slot that was already reserved, the label stays readable and the button keeps its place in the tab order."
    :actions="['Resume scan', 'Open log']" />
</Preview>

### Focus

Tab into the alert. Focus reaches the action first, then the dismiss control.

<Preview title="Focus" note="1px ring, no offset">
  <DsAlert
    intent="info" summary="Tab into this alert"
    detail="Focus reaches the action first, then the dismiss control. The ring needs 6px of clear space outside the border box."
    :actions="['Open log']" />
</Preview>

### Live toasts

Success and info run a timer, warning and danger never expire, and a fourth message waits in the queue until a slot frees. Hold the pointer over the stack, or leave focus inside it, and every timer is held.

<Preview title="Live toasts, dark" mode="dark" note="max 3 live, 5s floor extended by word count">
  <DsAlert form="toaster" />
</Preview>

<Preview title="Live toasts, light" mode="light" note="the same component, the same tokens, no per-theme override">
  <DsAlert form="toaster" />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `form` | `inline` `toast` `toaster` | `inline` | Delivery form. `toaster` renders the live trigger panel. |
| `intent` | `danger` `warning` `success` `info` `neutral` | `info` | Selects the glyph, the fill and the politeness. |
| `size` | `sm` `md` | `md` | Alert height 32 or 48px. The toast has one size. |
| `summary` | string | | One line, eight words or fewer. The accessible name of the message. |
| `detail` | string | | One or two sentences. Absent on the compact size. |
| `actions` | string[] | `[]` | Two at most on an alert, one at most on a toast. |
| `loading` | boolean | `false` | First action takes `aria-disabled` and keeps its width. |
| `dismissible` | boolean | `true` | Renders the dismiss control. Absent, never disabled. |

### Class strings

These are the classes the component applies. They work unchanged in the product.

Inline alert, danger, default size:

```html
<div class="flex min-h-xl items-start gap-2 rounded-md border border-solid border-l-4 py-3 pl-[13px] pr-4 bg-[color-mix(in_srgb,var(--c-danger-fg)_14%,var(--c-bg-raised))] border-[color-mix(in_srgb,var(--c-danger-fg)_55%,var(--c-bg-raised))]">
  <i class="fas fa-circle-exclamation w-4 shrink-0 text-center text-[16px] leading-5 text-danger-ink" aria-hidden="true"></i>
  <div class="flex min-w-0 flex-1 flex-col gap-1">
    <div class="text-body font-semibold text-ink">Rule failed to compile</div>
    <div class="text-body text-ink">Line 4: unterminated character class.</div>
  </div>
</div>
```

Toast, success. The rail is gone, elevation and the width clamp arrive:

```html
<div class="flex min-h-xl min-w-[288px] max-w-[336px] items-center gap-2 rounded-md border border-solid px-4 py-3 shadow-lg bg-[color-mix(in_srgb,var(--c-success-fg)_14%,var(--c-bg-raised))] border-[color-mix(in_srgb,var(--c-success-fg)_55%,var(--c-bg-raised))]">
  <i class="fas fa-circle-check w-4 shrink-0 text-center text-[16px] leading-5 text-success-ink" aria-hidden="true"></i>
  <div class="min-w-0 flex-1 truncate text-body font-semibold text-ink">Project saved</div>
</div>
```

Dismiss control, 24px square with the system ring:

```html
<button class="ml-2 -my-0.5 inline-flex h-xs w-xs shrink-0 cursor-pointer items-center justify-center rounded-sm border border-solid border-transparent bg-transparent text-ink transition-colors duration-1 ease-standard hover:bg-[var(--c-state-hover)] active:bg-[var(--c-state-pressed)] motion-reduce:transition-none focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]" aria-label="Dismiss: Project saved">
  <i class="fas fa-xmark text-[16px] leading-none" aria-hidden="true"></i>
</button>
```

The intent fill and the boundary are mixed from one foreground token, so five intents cost two expressions in both themes and nothing here names a palette step.

### Live regions

Both regions exist from application start, empty, and only text is ever inserted:

```html
<div role="alert" class="flex flex-col items-end gap-2"></div>
<div role="status" class="flex flex-col items-end gap-2"></div>
```

</template>

<template #usage>

### When to use

Work down the table in order and stop at the first row that matches.

| Condition | Mechanism | Why the others fail |
|---|---|---|
| The application cannot proceed until the user answers | **Dialog** | An alert can be scrolled past and a toast expires. Neither can block a decision. |
| The message is about one field | **Field error**, referenced by `aria-describedby` | An alert above the form makes the user hunt for which field is wrong. |
| The condition belongs to one region and persists until resolved | **Inline alert**, mounted inside that region | A toast expires while the condition does not, leaving a broken region unexplained. |
| The condition affects the whole view or the whole session | **Inline alert**, pinned below the view header | A toast for a persistent condition has to be re-raised on a timer. |
| The message carries a control the user should operate | **Inline alert** | A toast sits outside the reading order, so its control needs a shortcut. |
| The user must read for longer, or copy an identifier | **Inline alert**, or the notification log | Auto-dismiss is a time limit under SC 2.2.1, and reading time cannot be limited. |
| The action succeeded and nothing is required of the user | **Toast** | An inline alert leaves a stale congratulation on the page for the user to clear. |
| The failure is already visible where the user is looking | **Nothing.** Render the failure in place | Two reports of one failure teach the user that toasts are redundant. |

Carbon states the inline dismissal contract directly: *"Inline notifications do not dismiss automatically. They persist on the page until the user dismisses them or takes action that resolves the notification."*

**Rule A-1. Colour is never the intent.** Every intent renders a distinct glyph and a summary that names what happened. WCAG 2.2 SC 1.4.1 Use of Colour makes that a conformance requirement, and at 16px the status hues sit too close to carry the meaning alone, as [Iconography](/foundations/iconography) measures.

**Rule A-2. A toast is a copy, never the original.** Every toast writes a durable entry to the notification log when it is raised. A message that exists only inside a five second overlay has been deleted from the product.

### Choosing the form

<DoDont
  do="A message carrying a control sits inline, inside the reading order."
  dont="The toast expires on a timer and takes Retry with it.">
  <template #do>
    <DsAlert intent="danger" summary="Replay send failed" :actions="['Retry']" />
  </template>
  <template #dont>
    <DsAlert form="toast" intent="danger" summary="Replay send failed" :actions="['Retry']" />
  </template>
</DoDont>

<DoDont
  do="Report one failure once, on the surface that owns it."
  dont="A second report of one failure teaches users to ignore toasts.">
  <template #do>
    <DsAlert intent="danger" summary="Rule failed to compile" />
  </template>
  <template #dont>
    <DsAlert intent="danger" summary="Rule failed to compile" />
    <DsAlert form="toast" intent="danger" summary="Rule failed to compile" />
  </template>
</DoDont>

### Writing the message

<DoDont
  do="The summary names the specific rule that failed to compile."
  dont="Error names nothing, so the user cannot tell what broke.">
  <template #do>
    <DsAlert intent="danger" summary="Rule failed to compile" />
  </template>
  <template #dont>
    <DsAlert intent="danger" summary="Error" />
  </template>
</DoDont>

<DoDont
  do="The detail says what happened, then what to do next."
  dont="Raw exception text names nothing the user can act on.">
  <template #do>
    <DsAlert
      intent="danger" summary="Rule failed to compile"
      detail="The rule references a capture group that does not exist. Fix the pattern or remove the reference." />
  </template>
  <template #dont>
    <DsAlert
      intent="danger" summary="Rule failed to compile"
      detail="RegexError: invalid backreference at position 17, raised from PatternSyntaxException in rules.Compiler.compile" />
  </template>
</DoDont>

### Intent

The enumeration is closed at five and the API exposes no other value. Four status intents is where every surveyed system lands: Carbon ships error, success, warning and info, and Spectrum ships negative, positive, notice and informative.

| Intent | Meaning | Use when | Glyph |
|---|---|---|---|
| `danger` | An operation failed, or data is at risk | The thing the user asked for did not happen | `fa-circle-exclamation` |
| `warning` | The result is degraded or conditional | A rule matched nothing, a response was truncated | `fa-triangle-exclamation` |
| `success` | The operation completed | Only when the result is not already visible | `fa-circle-check` |
| `info` | A neutral fact the user did not ask about | A background task finished, a version is available | `fa-circle-info` |
| `neutral` | A message with no status at all | Onboarding hints, feature explanations, empty states | none, the slot collapses |

The `neutral` fifth exists because a message carrying no status still needs the alert's geometry. Rendering an explanatory hint as `info` inflates the info colour until it stops being read.

One emphasis level per intent. Escalation is a change of mechanism, from toast to inline alert to dialog, never a change of loudness. Primer arrives at the same place from the colour side, holding every semantic foreground inside a contrast band roughly 0.4 wide.

| Not an intent | Rule | Cost of getting it wrong |
|---|---|---|
| `error` | The token family is named `danger`, so the intent is `danger` in buttons, tags, alerts and toasts alike | A search for every destructive affordance in the product misses half of them |
| A style such as "contrast" | A look is not a meaning, and the enumeration is closed at five | A call site picks a look and ships a meaning by accident |

Further rules:

- **Do** pick the intent from what the user needs to do next, not from how the code path felt.
- **Do** treat a 500 returned during a deliberate fuzzing run as `info`, because the user asked for it.
- **Do** move an unheeded warning from a toast to a view-scoped alert instead of making it louder.
- **Do not** expose an emphasis, tone or style prop, since every one that ships is used to make one screen stand out.
- **Do not** add a sixth intent for a domain concept such as "intercepted"; domain state belongs in a tag.
- **Do not** substitute a glyph. The register is fixed in [Iconography](/foundations/iconography).

### Anatomy

```
   2                                                        1
   |                                                        |
   v                                                        v
  +==+======================================================+
  |##|  (!)  Rule failed to compile                 [ x ]   |
  |##|   ^     ^                                      ^     |
  |##|   3     4                                      7     |
  |##|                                                      |
  |##|       Line 4: unterminated character class.          |
  |##|       ^                                              |
  |##|       5                                              |
  |##|                                                      |
  |##|       [ Open rule ]  [ Disable rule ]                |
  |##|       ^                                              |
  |##|       6                                              |
  +==+======================================================+
                              ^
                              8
```

| Part | Name | Required | Governed by |
|---|---|---|---|
| 1 | Container | Yes | Intent fill, 6px radius, live-region membership. Not interactive |
| 2 | Severity rail | Inline alert only | The inline-start border thickened to **4px**. Absent on toasts |
| 3 | Status icon | **Yes, always** | **16px**, one fixed glyph per intent. Never optional, never author-chosen |
| 4 | Summary | **Yes, always** | One line. The accessible name and the string written to the log |
| 5 | Detail | Optional | Wraps at 14 / 20. Absent on the compact size |
| 6 | Action row | Alert: two at most. Toast: one at most | Ghost buttons at the compact control height, **28px** |
| 7 | Dismiss control | Conditional | Icon-only button, **24px** square, accessible name "Dismiss" |
| 8 | Boundary | Yes | **1px** on all four edges. Mandatory in both themes, not decorative |

A toast keeps parts 1 and 3 to 8, drops the rail, and adds the live region that holds it.

Further rules:

- **Do** render the icon in a fixed 16px column, so summaries of different lengths keep their text edges aligned.
- **Do** centre the icon on the summary's 20px line box, which leaves 2px of slack around a 16px glyph.
- **Do** draw the rail as a thickened border, since a separate 4px element has square corners that overhang the arc.
- **Do not** put the dismiss control inside the text column, or a long summary pushes it off the container.
- **Do not** add a countdown bar or a progress ring, which has to be removed under `prefers-reduced-motion` anyway.
- **Do not** place the action row above the detail, because the order is what happened, why, then what to do.

### Sizing

Two sizes for the inline alert, one for the toast. The toast has one because its dimensions are not a call-site decision, and Spectrum publishes a single `toast-height` and a single `toast-maximum-width` for that reason.

| Property | Alert `sm` | Alert `md` (default) | Toast |
|---|---|---|---|
| min-height | **32px** | **48px** | **48px** |
| padding-block | **6px** | **12px** | **12px** |
| padding-inline | **12px** | **16px** | **16px** |
| padding-inline-start, rail compensated | 12 less 3 = **9px** | 16 less 3 = **13px** | not applicable |
| radius | **6px** | **6px** | **6px** |
| border width | **1px** all edges, **4px** inline-start | **1px** all edges, **4px** inline-start | **1px** all edges |
| summary type role | 14 / 18, weight 400 | 14, weight 600, on a **20px** line box | same as alert `md` |
| detail type role | none, single line only | 14 / 20 | 14 / 20 |
| status icon | **16px** | **16px** | **16px** |
| icon-to-text gap | **8px** | **8px** | **8px** |
| summary-to-detail gap | not applicable | **4px** | **4px** |
| detail-to-action gap | not applicable | **8px** | **8px** |
| action-to-action gap | not applicable | **8px** | not applicable, one action |
| dismiss control | **24px** square | **24px** square | **24px** square |
| dismiss glyph | **16px**, `fa-xmark` | same | same |
| width | fills its container | fills its container | min **288px**, max **336px** |
| stack gap | not applicable | not applicable | **8px** |
| viewport inset | not applicable | not applicable | **16px** |
| elevation | none | none | one step |

#### Where the numbers come from

| Value | Source | What it buys |
|---|---|---|
| Alert `md` min-height 48, padding-block 12 | Carbon's inline notification publishes `min-height 3rem` and a text wrapper padding of `0.75rem` | The same pair, adopted unchanged |
| Alert `sm` min-height 32 | The canonical desktop control height, shipped independently by Spectrum, Primer, Ant and Carbon | A compact alert aligns with the controls beside it in a toolbar row |
| Toast height 48, not Spectrum's 52 | A toast and an alert carrying identical content must have identical geometry | A message moving to the log does not shift 4px and read as new |
| Toast width 288 to 336 | Floor from Carbon's `Notification width 18rem`, ceiling from Spectrum's `toast-maximum-width: 336px` | A two-word confirmation does not take the footprint of a two-line failure |
| padding-inline 16 | Carbon's inline notification `Details margin-left, margin-right 1rem` | Adopted unchanged |
| Rail compensation, 12 less 3 and 16 less 3 | The inline-start border is 4px rather than 1px, so the start padding drops by the difference | Text starts the same distance from the outer edge in every form |
| Icon-to-text gap 8 | One step below the compact 12px inset. Carbon's 16px icon margin assumes a touch-density slot | Spacing inside a group stays smaller than the spacing to its frame |
| Dismiss control 24px square | The WCAG 2.2 SC 2.5.8 Target Size floor, whose own figure shows six 24 by 24 icon buttons passing | Carbon's 48px close button is a touch target and leaves no room for the message |
| Radius 6 | The container radius the system assigns to cards, panels, popovers and menus | An alert is a container, so it does not take the 4px control radius |

#### Height arithmetic

```
height = line box + 2 x padding-block + 2 x border

Alert sm, single line:
  18 + (2 x 6) + (2 x 1)  = 32px   <- equals min-height exactly

Alert md or toast, summary only:
  20 + (2 x 12) + (2 x 1) = 46px   <- min-height 48 governs; the 2px
                                      difference is absorbed by centring

Alert md or toast, summary and one detail line:
  20 + 4 + 20 + (2 x 12) + (2 x 1) = 70px   <- min-height inert

Alert md, summary, two detail lines and an action row:
  20 + 4 + 20 + 20 + 8 + 28 + (2 x 12) + (2 x 1) = 126px
```

The compact size resolves exactly, because its line box is the 18px dense box. The default size resolves 2px short and is lifted by `min-height` with `align-items: center`, which is the sanctioned implementation. Do not chase the 2px with a 13px padding value.

Two formulas from [Radius, borders and elevation](/foundations/radius-borders-elevation) resolve here. The container at 6px with a 16px inset gives a nested block **radius 0**, and the dismiss button at 4px control radius takes a **6px** ring radius.

Further rules:

- **Do** keep 8px of clear space between the dismiss control and the text column.
- **Do not** set a fixed height on any size, because every one of them wraps and a fixed height clips the second line.
- **Do not** let a toast exceed three lines of detail; past that the content belongs in the log.
- **Do not** shrink the status icon or the dismiss glyph for the compact size; drop the detail line instead.

### States

The container is not a control, so most of the interaction matrix does not apply. Naming the absent states is part of the specification.

| State | Applies | Rendering |
|---|---|---|
| default | Yes | Intent fill, 1px intent boundary, summary and detail at the default foreground |
| default, `neutral` | Yes | Raised surface, separator boundary, detail at the muted foreground, icon slot collapsed |
| focus-visible | Toast root only, when the region shortcut moves focus to it | Two-tone ring, inset variant inside a clipping panel |

| Absent state | Why it does not apply |
|---|---|
| hover, pressed | A hover response on a non-interactive surface advertises an interaction that does not exist |
| disabled | A message that does not apply is not rendered. Greying one out leaves unreadable text on screen |
| loading | A pending operation is not a completed one. Report progress in the task's own surface |
| error | `danger` is an intent selected by the caller. A component whose render fails has a defect |
| read-only | All alert text is read-only by construction, so the state matches the default |
| selected | Nothing selects an alert, because it is not a row, an option or a collection item |

The dismiss control and the action buttons are ordinary controls and take the full matrix.

| State | Dismiss control | Action button |
|---|---|---|
| default | Transparent fill, glyph at the default foreground | Ghost tone, label at the default foreground |
| hover | State-hover layer over the intent fill | State-hover layer |
| pressed | State-pressed layer | State-pressed layer |
| focus-visible | Two-tone ring, 2px inner on a 2px offset | Identical |
| disabled | Not permitted. If dismissal is not allowed, the control is absent | Not permitted. An action that cannot run is not offered |
| loading | Not applicable | `aria-disabled="true"`, spinner in the reserved slot, label and width unchanged, focus retained |

Primer states the loading pattern as a spinner plus `aria-disabled` with focus preserved, and warns that disabling buttons makes them inaccessible to keyboard users.

#### Toast lifecycle

| State | Trigger | Behaviour | Visual |
|---|---|---|---|
| queued | More than three toasts are live | Held in order, released when a slot frees | none |
| entering | Released into the region | Fade in with an 8px translate from the edge, 150ms, entrance easing | opacity 0 to 1 |
| visible | Entrance complete | Timer running for `info` and `success` only | steady |
| paused | Pointer over the stack, or focus inside it | Timer suspended and restarted in full on leave | **no visual change** |
| leaving | Timer expired, dismissed or superseded | Fade out at 110ms with no translate, then the stack closes | opacity 1 to 0 |

The exit runs at 0.7 of the entrance, the ratio [Motion](/foundations/motion) sets and the one Material ships at 225ms in against 195ms out. It also drops the translate: an element leaving at full velocity spends its last frames where nobody is looking, and a translating exit drags the remaining toasts sideways as they reflow.

Under `prefers-reduced-motion` the entrance drops the translate and keeps the opacity fade, which SC 2.3.3 does not class as motion animation.

An inline alert fades in over 110ms and never animates its height. An alert that grows into a form pushes the submit button under a cursor that is already moving toward it.

Further rules:

- **Do** express hover and pressed with the state-layer tokens, so one alpha works over five tints in both themes.
- **Do** restart the full interval on leave, since a resumed 300ms remainder reads as the toast vanishing.
- **Do not** use the `disabled` attribute anywhere in this component; absent is the correct expression of unavailable.

### Accessibility

| Element | Role | Required attributes |
|---|---|---|
| Polite live region | `status` | In the DOM from application start, empty. `aria-live` **not** set, the role implies polite |
| Assertive live region | `alert` | In the DOM from application start, empty. `aria-live` **not** set, the role implies assertive |
| Toast | none on the toast itself | `tabindex="-1"`, so the region shortcut can move focus to it |
| Inline alert, raised after first paint | `status` or `alert` per the politeness map | As above |
| Inline alert, present at first paint | **no live-region role** | Read in document order like any other content |
| Status icon | none | `aria-hidden="true"`. The summary carries the meaning |
| Dismiss control | `button` | `aria-label` naming the message it closes |
| Action | `button` | The visible label is the accessible name |

A live region is monitored only once it has been in the accessibility tree long enough for the assistive technology to register it. A region created in the same commit as its first message announces nothing.

`role="alert"` implies `aria-live="assertive"` and `aria-atomic="true"`, and `role="status"` implies polite and atomic. Setting both makes VoiceOver announce the message twice.

The APG Alert pattern lists keyboard interaction for the pattern as not applicable and requires alerts to leave keyboard focus where it was. `aria-live="off"` is not silence either: it means announce only while focus is inside the region.

#### Politeness map

| Intent | Role | Politeness | Reason |
|---|---|---|---|
| `danger` | `alert` | assertive | The user's action did not happen, and waiting lets them continue on a false assumption |
| `warning`, blocking | `alert` | assertive | The next step will not work |
| `warning`, advisory | `status` | polite | The result is degraded, not wrong |
| `success` | `status` | polite | Confirmation of something the user already knows they asked for |
| `info` | `status` | polite | Nothing depends on it |
| `neutral` | none | none | Guidance text, read in document order |
| Append-only stream | `log` | polite | Sequence matters and each entry joins a growing set |

Assertive interrupts speech mid-word. Marking every message assertive is functionally identical to marking none of them, because the user stops being able to tell which interruptions matter.

#### Keyboard

The APG Alert pattern specifies no keyboard interaction, because it assumes an alert carries no controls. A toast does carry one, and a control outside the reading order that no key reaches is unusable.

| Key | Context | Action |
|---|---|---|
| The documented notification shortcut | Anywhere in the application | Move focus to the newest toast. Listed in the keyboard reference |
| `Tab`, `Shift+Tab` | Focus inside a toast | Move between that toast's controls, then to the next toast in the stack |
| `Escape` | Focus inside a toast | Dismiss it. Focus moves to the next toast, or back to the pre-entry element |
| `Enter`, `Space` | On a dismiss or action control | Activate |
| `Tab` | Inline alert | Natural document order. The component intercepts nothing |
| `Escape` | Inline alert | **Not handled.** Escape belongs to the innermost open overlay |

Focus management, in order:

1. Raising a toast or an inline alert never moves focus, because a message that captures focus loses the keystrokes in flight.
2. Entering the region by shortcut records the previously focused element and pauses every timer inside it.
3. Dismissing the focused toast moves focus to the next toast, then to the recorded element when none remain.
4. A focused toast cannot auto-dismiss, because focus inside the region pauses its timer.
5. Removing an inline alert that holds focus returns focus to the region the alert described.
6. The ring needs 6px of clear space outside the border box, and uses the 3px inset variant inside a clipping panel.

#### Timing and SC 2.2.1

An auto-dismissing toast is a time limit. SC 2.2.1 Timing Adjustable requires that the user can turn it off, adjust it to at least ten times the default, extend it, or that it runs past twenty hours. The APG Alert pattern adds that an alert disappearing too quickly can fail SC 2.2.3.

| Requirement | Mechanism |
|---|---|
| Nothing is lost when the toast expires | Rule A-2. Every toast writes a durable log entry |
| The user can turn the limit off | A setting that disables auto-dismiss for all toasts |
| The limit adapts to the content | Default 5 seconds, extended by `duration = max(5s, words x 0.3s + 2s)` |
| The limit never removes a control | `warning` and `danger` never expire, and neither does a toast carrying an action |

Five seconds is Carbon's coded default for a dismissible informational toast. The word-count extension exists because a fixed interval gives a nine-word message the same reading time as a two-word one. Carbon states the same obligation: *"users should be able to access them elsewhere after the toast notification disappears if they need more time to read"*.

#### Contrast floors

| Part | Floor | Source | Why |
|---|---|---|---|
| Summary and detail | **4.5:1** against the intent fill | SC 1.4.3 | The default foreground is solved against every intent fill in both themes |
| Status icon | **4.5:1**, and **APCA Lc 45** | Carbon: *"Icons are always a solid, monochromatic color and need to pass the same color contrast ratio as typography (4.5:1)."* | A 16px glyph is a fine-detail pictogram, and 3:1 on a dark surface overstates legibility |
| Container boundary | **3:1** against the fill **and** against the surface behind it | SC 1.4.11 | Two adjacencies, both required. Solved at 3:1 plus a 2% margin on canvas, raised and inset |
| Severity rail | Same as the boundary | SC 1.4.11 | It is the boundary, thickened |
| Dismiss glyph | **4.5:1** | SC 1.4.3 | The only content of a control with no visible label, so it is read as text |
| Action label | **4.5:1** | SC 1.4.3 | The visible label is body text |
| Focus ring | **3:1** between focused and unfocused pixels, area at least `4w + 4h` | SC 2.4.13 | The per-theme token is what holds this; a value fixed across both themes would not |

The boundary floor is the one most often skipped, and it matters most in the dark theme. At the canvas lightness this system uses, even an 80% shadow reaches roughly **1.34:1** while a 15% shadow on a light surface beats it, so the 1px boundary is the only edge a dark-theme toast has.

### Content

Every string in this component is read once, at speed, by someone in the middle of something else.

**Summary.** One line, eight words or fewer, because the toast clips it. Sentence case, no terminal period, past tense for completed actions and present tense for conditions. Name the object and the count: "42 requests exported" beats "Export complete".

Never restate the intent. "Error", "Warning", "Success" and "Info" are forbidden summaries, since the icon and the colour already say that, and a summary that names nothing is why users stop reading notifications. Never open with an apology either.

**Detail.** One or two sentences with terminal punctuation. Say what happened, then what to do. Never paste raw exception text, which belongs in the log entry where it can be selected and copied, and never put the only copy of an identifier here.

**Action labels.** A verb, one or two words: "Retry", "Open rule", "Undo". The label must read out of context, because a screen-reader user may reach it through a control list. Append an ellipsis to any label that opens a dialog, per the APG convention.

**Localisation.** Every string comes from the translation layer, including the summary. Never concatenate sentence fragments, since word order differs between languages. Design for 35% expansion and for the 0.12em of letter-spacing a user stylesheet may add under SC 1.4.12.

Further rules:

- **Do** write the summary so it still makes sense with the icon and colour stripped away, which is the Rule A-1 test.
- **Do** put the count in the summary and the reason in the detail, because users scan summaries and read details selectively.
- **Do not** use a toast to deliver instructions, which have to be readable while the user follows them.
- **Do not** write a summary that only makes sense while the originating screen is visible.

</template>

</PageTabs>
