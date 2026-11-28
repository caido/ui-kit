# Toast

A toast reports something that has already happened, away from wherever somebody is looking, and asks for nothing back. `CToast` is not that message. It is the place the messages land: one element per route shell, drawing a fixed column at the bottom centre of the window. The title, the text, the severity, the lifetime and the politeness all travel in the message rather than in the markup.

This page explains the model. [Usage](/components/toast/usage.md) shows how to mount one and send it a message, and [Reference](/components/toast/reference.md) lists the prop, the slot and the markup it renders.

## What the component settles

<Preview
  light="/examples/component-toast-default-light.svg"
  dark="/examples/component-toast-default-dark.svg"
  alt="An error toast with its width, padding, icon size, close control and corner radius measured"
  caption="384px across, padded 12px, with a 16px gutter to the text and a 28px close control."
/>

The position, the width and the corner are written inside the component, with no border and no shadow, as [Depth](/foundations/depth.md#there-are-no-shadows) expects. **A call site cannot move the column.** [Geometry](/components/toast/reference.md#geometry) gives the measurements.

The icon, the message colour, the accessible role and the live region setting all follow from one value, the severity the message carries, and the title arrives with it.

## A mount point rather than a message

**`CToast` declares one prop, `group`, and holds no content of its own.** A message reaches it over a shared event bus, so the sender and the host never refer to each other, and a single host near the root serves every screen below it.

The authenticated application and the login page each mount one, and a third place mounts a grouped host for a single message of its own.

## The severity decides the appearance

<Preview
  light="/examples/component-toast-severities-light.svg"
  dark="/examples/component-toast-severities-dark.svg"
  alt="Six toast messages, one per severity, each labelled with its background token and its foreground token"
  caption="Each severity pairs a surface token with a foreground token, and four of the six add an icon."
/>

Four severities are reachable from the composable: `error`, `warn`, `info` and `success`. The preset also draws `secondary` and `contrast`, which have no call site and no icon. [Severities](/components/toast/reference.md#severities) lists the tokens for each.

**A message spells its failing case `error`, while the shared severity vocabulary spells it `danger`.** A toast sent with `danger` draws with no background and no text colour at all.

## When a toast is the right choice

[Feedback](/foundations/feedback.md#a-toast-is-for-something-you-are-not-looking-at) owns the test, and it has two halves: the message is about something other than what is being looked at, and it needs nothing done about it.

An error and a warning wait to be dismissed and interrupt a screen reader. An info and a success leave once their text has had time to be read, and wait their turn to be announced. [Feedback reference](/foundations/feedback/reference.md#toast-durations) carries the timings, and [Feedback](/foundations/feedback.md#an-error-or-a-warning-interrupts) the reason for the split.

## When something else is better

A message about the field somebody is editing belongs beside that field, where it will still be there once they look down to fix it. Anything carrying an action to take belongs where that action is, and [Feedback](/foundations/feedback/usage.md#deciding-whether-a-toast-is-the-right-answer) draws that comparison side by side.

One operation that fails several times over is the other case to avoid, because of the three message cap below. Collect those failures into one message, or put the result somewhere it can stay.

## What a toast costs

**Three messages are visible at once, and a fourth removes the oldest.** The count is shared by every caller, so a confirmation raised in one part of the interface can evict an unread error raised in another.

The column is rendered at the end of the document body, so a scoped style in the calling component does not reach inside it. A class on the element is dropped as well, under the rule [Components](/foundations/components.md#presentation-is-blocked-identity-is-not) sets. Text written between the tags compiles and never appears, because there is no default slot.
