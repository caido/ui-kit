# Dialog

A dialog interrupts. It covers the window with a scrim, puts one decision or one short form in front of somebody, and hands the window back once that is answered. `CDialog` settles most of the appearance itself, so a call site chooses a title, a width, whether the dialog can be dismissed, and what goes in each of its three regions.

This page explains the model. [Usage](/components/dialog/usage.md) shows how to open one and fill it, and [Reference](/components/dialog/reference.md) lists the props, events, slots and the markup they render.

## What the component settles

<Preview
  light="/examples/component-dialog-default-light.svg"
  dark="/examples/component-dialog-default-dark.svg"
  alt="A small dialog raised off the page, with its header padding, content bottom padding, close button border and footer gap measured"
  caption="Header 64px, content padded 0 / 16 / 16, footer actions 8px apart, no drop shadow."
/>

A dialog is always modal, centred and fixed in place, and the component draws its own close control. [Fixed behaviour](/components/dialog/reference.md#fixed-behaviour) lists every setting a caller cannot change.

**A dialog has exactly three regions, and each one comes pre-padded.** The header carries the title and the close control, the content scrolls when it runs out of room, and the footer holds the actions in a right-aligned row.

## Three widths rather than a number

<Preview
  light="/examples/component-dialog-widths-light.svg"
  dark="/examples/component-dialog-widths-dark.svg"
  alt="Three dialog width bars at 400, 600 and 800 pixels, with a fourth dashed bar for the omitted case"
  caption="Each value is a cap, so the rendered width is min(100vw - 32px, cap)."
/>

`width` names one of three caps rather than a measurement. **The value is a maximum, so a dialog never grows past the window.** Leaving the prop out makes the dialog shrink to fit its content.

[Space](/foundations/space/usage.md#sizing-a-dialog) owns which cap suits which content, and [Widths](/components/dialog/reference.md#widths) carries the values.

## When a dialog is the right choice

A dialog earns its interruption when the next thing cannot happen until somebody answers. Confirming a destructive action, naming a new project, filling a short form whose result changes the page behind it.

The shape that fits is small and finishes: one question, or one form of a few fields, with the way out in the footer.

## When something else is better

Something a person may want to keep open while working is the wrong fit, because a dialog traps focus and leaves the page behind it unreachable.

**Reporting that something already happened is not a decision, so it is not a dialog.** [Feedback](/foundations/feedback.md#a-toast-is-for-something-you-are-not-looking-at) owns that case and gives it a toast. A field that is wrong belongs beside the field rather than over the page, and a region of the interface somebody returns to belongs in the page itself.

## Dismissal is one decision, not three

`closable` drives the close button, the Escape key and the click on the scrim together. **Switching it off takes all three away at once.** No setting keeps Escape while dropping the button.

That suits a fatal error screen with nothing behind it worth returning to, the one place the interface uses it. Everywhere else, leave `closable` at its default.

## The frame is a scrim and a line

**The scrim, rather than a shadow, is what lifts a dialog off the page.** [Depth](/foundations/depth.md#there-are-no-shadows) defines no shadow, so what remains is a 1 pixel `line-default` frame around a `surface-page` panel, on a translucent black scrim.

The panel paints the same surface as the application background. That does not break the rule that [two surfaces which touch are never the same step](/foundations/depth.md#two-surfaces-that-touch-are-never-the-same-step), because the scrim sits between them.

**Nothing about a dialog animates.** It appears and disappears in one frame, as [Motion](/foundations/motion.md#the-common-case-is-free) expects of a surface nobody is tracking with their eyes.

## What a dialog costs

**A dialog is rendered at the end of the document body rather than where it is written.** A scoped rule on slot content still matches after the move, but a `:deep()` selector anchored on the calling component's root does not, because the dialog is no longer underneath that root. The three regions come from the component library, so a scoped rule in the calling component does not reach them either.

Two more gaps are worth knowing: the page behind keeps its scroll, and the close control is named Close in English whatever the interface language. [Fixed behaviour](/components/dialog/reference.md#fixed-behaviour) and [ARIA](/components/dialog/reference.md#aria) record both.
