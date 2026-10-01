# Dialog

A dialog interrupts. It covers the window with a scrim, puts one decision or one short form in front of somebody, and hands the window back once that is answered. `CDialog` is the component that does this in Caido, and it settles most of the appearance itself, so a call site is left choosing a title, a width, whether the dialog can be dismissed, and what goes in each of its three regions.

This page explains the model. [Usage](/components/dialog/usage.md) shows how to open one and fill it, and [Reference](/components/dialog/reference.md) lists the props, events, slots and the markup they render.

## What the component settles

<Preview
  light="/examples/component-dialog-default-light.svg"
  dark="/examples/component-dialog-default-dark.svg"
  alt="A small dialog raised off the page, with its header padding, content bottom padding, close button border and footer gap measured"
  caption="Header 64px, content padded 0 / 16 / 16, footer actions 8px apart, no drop shadow."
/>

Modal, centred and fixed in place: a call site chooses none of the three, because the component writes them itself. It writes the close control the same way, a 32 pixel square carrying a 1 pixel border and a 14 pixel cross, and it writes the width scale below.

**A dialog has exactly three regions, and each one comes pre-padded.** The header carries the title and the close control, the content scrolls when it runs out of room, and the footer holds the actions in a right-aligned row. Anything a call site writes lands inside one of those three, on top of padding that is already correct.

## Three widths rather than a number

<Preview
  light="/examples/component-dialog-widths-light.svg"
  dark="/examples/component-dialog-widths-dark.svg"
  alt="Three dialog width bars at 400, 600 and 800 pixels, with a fourth dashed bar for the omitted case"
  caption="Each value is a cap, so the rendered width is min(100vw - 32px, cap)."
/>

`width` names one of three caps rather than a measurement. **The value is a maximum, so a dialog renders at the smaller of its cap and the window less the 16 pixels the scrim insets on each side.** Leaving the prop out is the fourth case: the dialog shrinks to fit whatever is inside it, which is what a single call site in the interface relies on.

[Space](/foundations/space/usage.md#sizing-a-dialog) owns which cap suits which content, and [its reference](/foundations/space/reference.md#dialog-widths) carries the three values.

## When a dialog is the right choice

A dialog earns its interruption when the next thing cannot happen until somebody answers. Confirming a destructive action, naming a new project, filling a short form whose result changes the page behind it.

The shape that fits is small and finishes. One question, or one form of a few fields, with the way out in the footer, which is where most dialogs in Caido put it.

## When something else is better

Something a person may want to keep open while working is the wrong fit. A dialog traps focus and covers the page, so anything behind it is unreachable for as long as it is up, and a person who needs both at once has to close and reopen.

**Reporting that something already happened is not a decision, so it is not a dialog.** [Feedback](/foundations/feedback.md#a-toast-is-for-something-you-are-not-looking-at) owns that case and gives it a toast. A field that is wrong belongs beside the field rather than over the page, and a region of the interface somebody returns to belongs in the page itself.

## Dismissal is one decision, not three

`closable` drives the close button, the Escape key and the click on the scrim together. **Switching it off takes all three away at once.** No setting keeps Escape while dropping the button.

That is the correct shape for the one case in the interface that uses it, a fatal error screen with nothing behind it worth returning to. Everywhere else it leaves a dialog whose way out is whatever the footer happens to carry.

## The frame is a scrim and a line

**The scrim, rather than a shadow, is what lifts a dialog off the page.** The shadow scale is cleared, so the `shadow-lg` written on the dialog root paints nothing, which is the case [Depth](/foundations/depth.md#there-are-no-shadows) already names. What remains is a 1 pixel `line-default` frame around a `surface-page` panel, on black at 40 per cent.

The root paints the same surface token as the application background. That does not break the rule that [two surfaces which touch are never the same step](/foundations/depth.md#two-surfaces-that-touch-are-never-the-same-step), because these two never touch. The scrim sits between them.

**Nothing about a dialog animates.** The preset leaves the transition empty and no matching rules ship, so a dialog appears and disappears in one frame, in line with what [Motion](/foundations/motion.md#the-common-case-is-free) expects of a surface nobody is tracking with their eyes.

## What a dialog costs

**A dialog is rendered at the end of the document body rather than where it is written.** Slot content keeps the scope of the component that wrote it, so a scoped rule on that content still matches after the move. A `:deep()` selector anchored on that component's root does not, because the dialog is no longer underneath that root, and the three regions come from the component library rather than from the calling component, so a scoped rule written there does not reach them either.

Two more consequences are worth knowing before meeting them. The page behind keeps its scroll: the library asks the body to stop scrolling whenever a dialog is modal, and it asks by adding one class that no shipped rule matches. The close control is named with the English word Close, set by the library default rather than by the translation layer, so it does not follow the interface language.
