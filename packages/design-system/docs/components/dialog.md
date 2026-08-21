---
outline: false
pageClass: wide
---

# Dialog

A dialog takes the application hostage until the user answers it. It stops every other task and captures the keyboard, so the system ships three variants, four widths and one fixed action order.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

### Variants

Three variants, derived from the two ARIA roles plus the destructive case. Standard carries a form, confirm carries a message and a yes-or-no answer, destructive carries an irreversible commit.

Each button opens the variant it names. Open all three and compare where focus lands.

<Preview title="Variants" note="dialog / alertdialog / alertdialog">
  <DsDialog
    variant="standard" title="Rename project" trigger-label="Standard"
    message="The project file on disk keeps its current name."
    field-label="Project name" confirm-label="Rename" />
  <DsDialog
    variant="confirm" size="sm" title="Discard unsaved changes?" trigger-label="Confirm"
    message="The replay tab has edits that have not been sent. Discarding returns the tab to the last sent request."
    confirm-label="Discard" cancel-label="Keep editing" />
  <DsDialog
    variant="destructive" size="sm" title="Delete 42 requests?" trigger-label="Destructive"
    message="These requests are removed from the project and cannot be recovered."
    confirm-label="Delete" />
</Preview>

### Widths

Four rungs, each a maximum rather than a fixed width. Block size is capped at `min(90dvh, 720px)` so the action row never falls below the fold.

Each button opens the rung it names, so the four widths can be compared at the current viewport.

<Preview title="Widths" note="400 / 480 / 640 / takeover">
  <DsDialog
    size="sm" title="New tab" trigger-label="sm 400" field-label="Tab name"
    message="Small carries a confirm or a single field." confirm-label="Create" />
  <DsDialog
    size="md" title="Add scope preset" trigger-label="md 480" field-label="Preset name"
    message="Medium is the default. Two to five fields."
    checkbox-label="Apply to the current session" confirm-label="Add" />
  <DsDialog
    size="lg" title="Rewrite host across selection" trigger-label="lg 640" long
    message="Large carries a code block, a table preview or a two-column field pair. Prose inside it is capped at 60ch so the line length stays readable."
    confirm-label="Rewrite" />
  <DsDialog
    size="full" title="Import project archive" trigger-label="full takeover"
    message="Takeover needs a written justification against the purpose test. The radius drops to 0 because the surface touches the viewport edge."
    confirm-label="Import" />
</Preview>

### Initial focus

Focus lands on the element the focus table names, never on the close control. Open each of these and read where the ring starts.

<Preview title="Initial focus" note="never the close control">
  <DsDialog
    title="Rename request" trigger-label="First field" field-label="Name"
    message="The field is the point of the dialog, so focus starts in it." confirm-label="Rename" />
  <DsDialog
    size="lg" title="Rewrite host across selection" trigger-label="Title, long body" long
    message="The body runs past the fold, so focus starts on the title with tabindex -1."
    confirm-label="Rewrite" />
  <DsDialog
    variant="confirm" size="sm" title="Send to Replay?" trigger-label="Primary action"
    message="No field, so focus starts on the action the dialog exists to obtain."
    confirm-label="Send" />
  <DsDialog
    variant="destructive" size="sm" title="Revoke API key?" trigger-label="Cancel"
    message="The commit cannot be undone, so focus starts on the least destructive action."
    confirm-label="Revoke" />
</Preview>

### Scrolled

Scroll the body. The header separator appears once the body leaves its top, and the footer separator disappears once nothing remains below the fold.

<Preview title="Scrolled" note="header 56, footer 64, separators are state">
  <DsDialog
    size="lg" title="Rewrite host across selection" trigger-label="Scrolling body" long
    message="The header and the action row are fixed, so the commit is reachable at every viewport height."
    field-label="New host" checkbox-label="Also update matching findings" confirm-label="Rewrite" />
</Preview>

### Submitting and error

The commit keeps its label and its place in the tab order while it runs. A rejected commit puts the error above the body and moves focus to it.

<Preview title="Submitting" note="aria-disabled, never the disabled attribute">
  <DsDialog
    title="Rewrite host" trigger-label="Commit in flight" loading
    message="The primary keeps its label and its width, shows a 16px spinner and stays focusable. The close control is aria-disabled."
    field-label="New host" confirm-label="Rewrite" />
  <DsDialog
    title="Rewrite host" trigger-label="Commit rejected"
    error="That host is not a valid authority. Enter a host name, optionally with a port."
    message="The error region sits above the first invalid field and takes focus, so the result of the action is announced."
    field-label="New host" confirm-label="Rewrite" />
</Preview>

### Dismiss blocked

Click the scrim on this one. Nothing happens, because the dialog holds unsaved input. Escape and Cancel still work, since both resolve to a safe outcome.

<Preview title="Dismiss blocked" note="closedby=closerequest while dirty">
  <DsDialog
    title="Add scope preset" trigger-label="Dirty form" dirty
    message="Light dismiss is available only while the dialog holds no unsaved input."
    field-label="Preset name" checkbox-label="Apply to the current session" confirm-label="Add" />
</Preview>

</template>

<template #code>

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `Dialog title` | The `aria-labelledby` target. Sentence case, 40 characters maximum. |
| `message` | string | | Body text, wired to `aria-describedby`. Required on the alert variants. |
| `variant` | `standard` `confirm` `destructive` | `standard` | Sets the role, the commit tone and the initial focus. |
| `size` | `sm` `md` `lg` `full` | `md` | Maximum width 400, 480, 640 or takeover. |
| `triggerLabel` | string | `Open dialog` | Label on the button that opens the dialog. |
| `confirmLabel` | string | `Save` | Primary action. Repeat the verb from the title. |
| `cancelLabel` | string | `Cancel` | Secondary action. Use `Discard` when the exit loses work. |
| `fieldLabel` | string | | Renders one text field, which becomes the initial focus target. |
| `checkboxLabel` | string | | Renders one checkbox. Its presence promotes a confirm to standard. |
| `long` | boolean | `false` | Overflowing body, so the scrolled separators can be seen. |
| `loading` | boolean | `false` | Spinner plus `aria-disabled`, never the `disabled` attribute. |
| `error` | string | | Inline error region above the body content, focused on open. |
| `dirty` | boolean | `false` | Swallows the scrim click and sets `closedby="closerequest"`. |

### Redlines

| Part | Height | Inset | Radius | Type role |
|---|---|---|---|---|
| Shell | `min(90dvh, 720px)` cap | 0 | `rounded-lg` 10 | n/a |
| Header | **56** | 16 | inherits top corners | `title` 16/24/600 |
| Body | fills, scrolls | 16, top 0 | 0 | `body` 14/20/400 |
| Footer | **64** | 16 | inherits bottom corners | `label` on the buttons |
| Close control | **28** square | 0 | `rounded-sm` 4 | icon 16 |
| Action buttons | **32** | 12 inline | `rounded-md` 6 | `body` 14/20/500 |
| Trigger | **32** | 12 inline | `rounded-md` 6 | `body` 14/20/500 |
| Separators | 1 | full-bleed | 0 | n/a |
| Scrim | viewport | 0 | 0 | black at 40 percent |

Height is arithmetic, not a typed number. Header is `24 + 2 × 16`. Footer is `32 + 2 × 16`, taken from the control height because its tallest child is a control.

### Class strings

The shell at `md`, capped in both axes:

```html
<div class="flex max-h-[min(90dvh,720px)] w-full max-w-[480px] flex-col overflow-hidden rounded-lg border border-solid border-control bg-raised shadow-lg">
```

The header, carrying the separator it shows only while the body is scrolled:

```html
<header class="flex min-h-[56px] flex-none items-center gap-2 p-4 shadow-[inset_0_-1px_0_var(--c-border-separator)]">
```

The action row, secondary then primary, end aligned at an 8px gap:

```html
<footer class="flex min-h-[64px] flex-none items-center justify-end gap-2 p-4">
  <button class="inline-flex h-md items-center rounded-md border border-solid border-control bg-transparent px-3 text-body font-medium text-ink">Cancel</button>
  <button class="inline-flex h-md items-center rounded-md border border-solid border-danger-ink bg-danger-ink px-3 text-body font-medium text-canvas">Delete</button>
</footer>
```

Every emphasis carries a border, so a label never shifts by a pixel between Cancel and the commit. The colour lives in the variant, never in the base: `border-transparent` in a base string outranks `border-control` in a variant and leaves a control looking like plain text.

The boundary ring is `border-control`. Measured against the dialog fill it reads 4.13:1 in light and 2.04:1 in dark; against the dimmed page, 1.31:1 and 2.89:1.

</template>

<template #usage>

### When to use

Use a dialog to acquire a decision, or a small amount of input, the application cannot proceed without. All four clauses must hold at once: short, infrequent, blocking, self-contained.

A session here involves thousands of requests, so most tasks repeat. The default answer to "should this be a modal" is no.

| Situation | Use instead | Why the modal fails |
|---|---|---|
| The task repeats more than a few times per session | Inline editing or a side panel | Each repetition costs a focus round trip and a scroll lock |
| The user must read the request or row underneath | Split pane or drawer | The modal covers the evidence the decision needs |
| The message carries no decision | Inline message, or a toast | A focus trap bought for zero information |
| More than about six fields, or a field with its own picker | A settings page or a route | Escape closes the picker and the form together |
| Another dialog is already open | Steps on one surface | Focus return dies and two Escape handlers stack |
| The result is a long-running operation | The task or export surface | A spinner turns a background job into a blocking one |

### Emphasis

<DoDont do="One primary action. Cancel stays secondary." dont="Two primary buttons hide which one is the safe exit.">
  <template #do>
    <DsButton variant="secondary" label="Cancel" />
    <DsButton variant="primary" label="Delete 42 requests" />
  </template>
  <template #dont>
    <DsButton variant="primary" label="Cancel" />
    <DsButton variant="primary" label="Delete 42 requests" />
  </template>
</DoDont>

<DoDont do="Loading keeps the label, the width and the tab order." dont="Disabled drops the button from the tab order, losing focus.">
  <template #do>
    <DsButton variant="primary" label="Rewrite" loading />
  </template>
  <template #dont>
    <DsButton variant="primary" label="Rewrite" disabled />
  </template>
</DoDont>

### Variants

<DoDont do="The destructive variant opens with focus on Cancel." dont="Standard opens with focus on Delete, so Enter deletes.">
  <template #do>
    <DsDialog
      variant="destructive" size="sm" title="Delete 42 requests?" trigger-label="Destructive"
      message="These requests are removed from the project and cannot be recovered."
      confirm-label="Delete" />
  </template>
  <template #dont>
    <DsDialog
      variant="standard" size="sm" title="Delete 42 requests?" trigger-label="Standard"
      message="These requests are removed from the project and cannot be recovered."
      confirm-label="Delete" />
  </template>
</DoDont>

<DoDont do="Report a result with no decision inline." dont="A dialog with one OK button traps focus for nothing.">
  <template #do>
    <DsAlert intent="success" summary="42 requests exported" :dismissible="false" />
  </template>
  <template #dont>
    <DsDialog
      variant="confirm" size="sm" title="Export complete" trigger-label="Export complete"
      message="42 requests were written to the archive."
      confirm-label="OK" cancel-label="Close" />
  </template>
</DoDont>

| Variant | Role | Use it for | Rule |
|---|---|---|---|
| `standard` | `dialog` | A task needing input or a choice | One primary commit, one cancel. Escape closes unless dirty |
| `confirm` | `alertdialog` | One message and a yes-or-no answer | No input fields. Body is one to three sentences |
| `destructive` | `alertdialog` | An irreversible commit | Danger tone. Focus starts on Cancel. No close control |

Passive dialogs, progress dialogs, nested dialogs, draggable dialogs and non-modal dialogs are all rejected. Each one fails a clause of the purpose test.

### Sizing

Widths are maximums. The shell resolves to `min(<max>, 100vw − 40px)`, so it never touches the viewport edge and never drops below 288px. The 20px inset is the product's own mask padding.

| Size | Maximum | Use it for |
|---|---|---|
| `sm` | 400px | Confirms, destructive commits, single-field prompts |
| `md` | 480px | The default. Short forms of two to five fields |
| `lg` | 640px | A code block, a table preview, a two-column field pair |
| `full` | Takeover | Requires written justification against the purpose test |

Inside `lg` and `full`, prose is capped at `60ch`. A 640px dialog otherwise produces a 90-character line, roughly twice the comfortable return-sweep distance.

Every direct child of the body is square-cornered. Shell radius 10 minus inset 16 lands on 0, so only the shell is rounded.

### Accessibility

The shell carries `role="dialog"` or `role="alertdialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the visible title. The alert roles also require `aria-describedby` on the message.

| Key | Behaviour |
|---|---|
| `Tab`, `Shift + Tab` | Cycle inside the dialog and wrap at both ends |
| `Escape` | Closes to the safe outcome, on every variant |
| `Enter` | Commits, except from a button, a link or a text area |
| `Enter` on `destructive` | Does nothing at all, so a stray keystroke cannot delete |
| `Escape` with a child overlay open | The overlay takes the first Escape, the dialog the second |

Initial focus is placed by the call site's content, not by DOM order.

| Variant and content | Initial focus |
|---|---|
| `standard` whose first field is the point of the dialog | The first field |
| `standard` with a body longer than the visible area | The title, with `tabindex="-1"` |
| `standard` with no field | The primary action |
| `confirm` | The primary action |
| `destructive` | Cancel, the least destructive action |

On close, focus returns to the invoking element. If the invoker is gone, focus the nearest surviving ancestor, never `document.body`. If it survives off-screen, scroll it into view first, per SC 2.4.11.

Compute the tabbable set at the moment of the keystroke, never at open time, because dialog content changes as fields appear.

Mark the application root `inert` for the dialog's lifetime. A focus trap stops Tab, but it does not stop a screen reader's virtual cursor from reading the page behind the modal.

| Part | Floor | Criterion |
|---|---|---|
| Title and body text | 4.5:1, held at 7:1 by the token contract | SC 1.4.3 |
| Boundary ring against fill | 3:1. Measured 4.13:1 light, 2.04:1 dark | SC 1.4.11 |
| Commit label on the danger fill | 4.5:1. Measured 5.53:1 light, 6.54:1 dark | SC 1.4.3 |
| Close control glyph | 4.5:1, because the glyph carries meaning | SC 1.4.3 by adoption |
| Focus indicator contrast and area | 3:1, and at least `4w + 4h` | SC 2.4.13 |
| Close control target | 24 × 24 floor. This spec ships 28 × 28 | SC 2.5.8 |
| Scrim, dark theme | No alpha reaches 3:1, so the ring is mandatory | SC 1.4.11, discharged by the ring |

Every dialog needs a visible dismissal affordance as well as Escape, because Escape alone does not serve pointer-only or touch users.

Dismissal, by gesture:

| Gesture | `standard`, clean | `standard`, dirty | `confirm` | `destructive` |
|---|---|---|---|---|
| Escape | Closes | Raises the discard confirm | Closes to cancel | Closes to cancel |
| Close control | Closes | Raises the discard confirm | Closes | Not present |
| Click on scrim | Closes | Swallowed | Closes | Swallowed |
| Cancel button | Closes | Raises the discard confirm | Closes | Closes |

Light dismiss is available only while the dialog holds no unsaved input. The native element encodes this in `closedby`: `any` when clean, `closerequest` when dirty.

On open the background stops scrolling, and on close its exact `scrollTop` is restored. Lock the scrolling pane, not the document, because a splitter-packed shell has no document scroll.

### Content

| Element | Rule | Example |
|---|---|---|
| Title | Sentence case, 40 characters maximum. A question ends in a question mark | "Delete 42 requests?" |
| Body | State the consequence, then the scope, with a number in it | "These 42 requests cannot be recovered" |
| Primary label | Repeat the verb from the title. Never "OK" or "Yes" | Title "Delete 42 requests?", button "Delete" |
| Secondary label | "Cancel" when nothing is lost, "Discard" when work is lost | "Keep editing" |
| Trigger label | A control that opens a dialog ends in an ellipsis | "Save as…" |
| Error text | Name the field and the fix, not the failure | "Port must be between 1 and 65535" |

Title length is derived. At `sm` the title has `400 − 32 padding − 28 close control − 8 gap = 332px`, which is about 41 characters at 16px before it wraps.

<DoDont do="The title names the object and the count." dont="'Are you sure?' reads the same on every dialog.">
  <template #do>
    <DsDialog
      variant="destructive" size="sm" title="Delete 42 requests?" trigger-label="Scoped title"
      message="These requests are removed from the project and cannot be recovered."
      confirm-label="Delete" />
  </template>
  <template #dont>
    <DsDialog
      variant="destructive" size="sm" title="Are you sure?" trigger-label="Unscoped title"
      message="These requests are removed from the project and cannot be recovered."
      confirm-label="Delete" />
  </template>
</DoDont>

</template>

</PageTabs>
