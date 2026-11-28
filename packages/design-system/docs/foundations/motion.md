# Motion

Motion in Caido is deliberately small: **two durations and two curves**. There is no ladder, because Caido did not need one.

This page explains the model. [Usage](/foundations/motion/usage.md) shows how to apply it, and [Reference](/foundations/motion/reference.md) lists every value.

## The common case is free

A bare `transition` resolves to 150ms on the standard curve, because the theme points the framework's own defaults at those tokens:

```css
--default-transition-duration: var(--duration-state);
--default-transition-timing-function: var(--ease-standard);
```

So `transition-colors` on a hover state needs nothing else, and **writing `duration-state` or `ease-standard` at a call site that already inherits them is noise**.

## Two durations

`duration-state`, at 150ms, is for a control changing state. `duration-surface`, at 300ms, is for a surface arriving or leaving, and that is one job rather than a second speed: a larger surface travels further, so the eye has further to follow it.

There is no third duration. Anything under about 100ms does not read as movement at all, so it is a different kind of value rather than a shorter step. [Values that are not on the scale](/foundations/motion/reference.md#values-that-are-not-on-the-scale) lists the ones that exist.

## Two curves

`ease-standard` is for everything, unless a surface is arriving, and then `ease-enter` decelerates it so it settles rather than stops. [Curves](/foundations/motion/reference.md#curves) gives both values.

The curves are named by their job rather than their shape, which is what lets a reviewer reject one. There is no accelerating curve for a surface leaving, because nothing Caido draws needs one.

## What animates, and what never does

Colour, opacity, a travelling surface and a loading indicator animate. [What animates](/foundations/motion/reference.md#what-animates) has the full list.

**Nothing on a data surface moves.** Not a row in a data table, not a response body, not an editor. A row in a menu or a popover is chrome rather than data, so it may. Rows are packed tightly because the data is what matters, and captured content is not interface: a response body was written by somebody else, sometimes by an attacker, and it does not get to move.

**No property that forces layout.** A layout property recalculates the page on every frame, in a tool people keep open for hours beside a live proxy. Animate `transform` and `opacity`, which composite instead.

## Reduced motion is handled once

Someone who has asked their system to reduce motion gets every transition and every animation switched off across the whole page, by one global stylesheet. **You do not write `motion-reduce:` on your own component.**

It is global because most of the motion on screen is drawn by the component library rather than by Caido, so a convention where each author adds a variant would miss most of it.

Only a loading skeleton and a spinner keep moving, because both carry information. [Reduced motion](/foundations/motion/reference.md#reduced-motion) gives the reason for each.

## Motion is never the only thing saying something

Once motion can be switched off, anything speaking only through movement goes silent. If a thing animates to say something, something static has to say it too.
