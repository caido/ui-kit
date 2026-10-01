# Toast

A toast reports something that has already happened, away from wherever somebody is looking, and asks for nothing back. `CToast` is not that message. It is the place the messages land: one element per route shell, drawing a fixed column at the bottom centre of the window and filling it with whatever the rest of the interface has pushed onto it. The title, the text, the severity, the lifetime and the politeness all travel in the message rather than in the markup, which leaves this element with almost nothing to decide.

This page explains the model. [Usage](/components/toast/usage.md) shows how to mount one and send it a message, and [Reference](/components/toast/reference.md) lists the prop, the slot and the markup it renders.

## What the component settles

<Preview
  light="/examples/component-toast-default-light.svg"
  dark="/examples/component-toast-default-dark.svg"
  alt="An error toast with its width, padding, icon size, close control and corner radius measured"
  caption="384px across, padded 12px, with a 16px gutter to the text and a 28px close control."
/>

The position, the width and the corner are written inside the component. It renders fixed at the bottom centre of the window, 384 pixels across, and each message takes a 6 pixel corner with no border and no shadow, which is what [Depth](/foundations/depth.md#there-are-no-shadows) expects of a surface here. **A call site cannot move the column, because the position is set inside the component rather than exposed as a prop.**

The icon, the message colour, the accessible role and the live region setting are settled as well, and one value picks all four: the severity the message carries. The title arrives with it, because the call that chose the severity took the title from the message catalogue at the same time.

## A mount point rather than a message

**`CToast` declares one prop, `group`, and holds no content of its own.** A message reaches it over a shared event bus rather than through markup, so the component that sends one and the host that draws it never refer to each other, and a single host near the root of the application serves every screen below it.

Two shells mount one today, the authenticated application and the login page, and a third mounts a grouped host for a single message of its own. Nothing else in the interface writes the element at all.

## The severity decides the appearance

<Preview
  light="/examples/component-toast-severities-light.svg"
  dark="/examples/component-toast-severities-dark.svg"
  alt="Six toast messages, one per severity, each labelled with its background token and its foreground token"
  caption="Each severity pairs a surface token with a foreground token, and four of the six add an icon."
/>

Four severities are reachable from the composable: `error`, `warn`, `info` and `success`. The preset also draws `secondary` and `contrast`, which have no call site in the interface. Those two carry no icon, so their text starts 24 pixels further left than the rest, which is the difference worth noticing in the drawing above.

**A message spells its failing case `error`, while the shared severity vocabulary spells the same idea `danger`.** A toast sent with `danger` matches neither comparison in the preset, so it draws with no background and no text colour at all.

## When a toast is the right choice

[Feedback](/foundations/feedback.md#a-toast-is-for-something-you-are-not-looking-at) owns the test, and it has two halves: the message is about something other than what is being looked at, and it needs nothing done about it.

The component is built around the second half. An error and a warning wait to be dismissed, and an info and a success leave once their own text has had time to be read. [Feedback reference](/foundations/feedback/reference.md#toast-durations) carries the four timings.

The same split runs through the announcement. An error and a warning interrupt whatever a screen reader is saying, and the other two wait their turn, which is the behaviour [Feedback](/foundations/feedback.md#an-error-or-a-warning-interrupts) asks for and the reason the component overrides the library default.

## When something else is better

A message about the field somebody is editing belongs beside that field, where it will still be there once they look down to fix it. Anything carrying an action to take belongs where that action is, and [Feedback](/foundations/feedback/usage.md#deciding-whether-a-toast-is-the-right-answer) draws that comparison side by side.

One operation that fails several times over is the other case to avoid. The host shows three messages at a time, so the fourth failure pushes the first off screen before it has been read. Collect those failures into one message, or put the result somewhere it can stay.

## What a toast costs

**Three messages are visible at once, and a fourth removes the oldest.** The count lives in one module-level array shared by every caller of the composable, so a confirmation raised in one part of the interface can evict an unread error raised in another.

**The column is rendered at the end of the document body rather than where it is written.** A scoped style in the calling component does not reach inside it, and neither does a class written on the element, which the attribute filter drops first. [Components](/foundations/components.md#presentation-is-blocked-identity-is-not) sets that rule for the whole layer.

Text written between the opening and closing tags is the quiet failure. There is no default slot, and the element underneath reads five named templates and nothing else, so that text compiles, typechecks and then never appears.
