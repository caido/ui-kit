# Motion

Motion in Caido is deliberately small: **two durations and two curves**. There is no ladder, because Caido did not need one.

The most important thing on this page is that the common case costs you nothing. A control changing colour on hover already moves at the right speed on the right curve, with no class written.

This page explains the model. [Usage](/foundations/motion/usage.md) shows how to apply it, and [Reference](/foundations/motion/reference.md) lists every value.

## The common case is free

A bare `transition` resolves to 150ms on the standard curve, because the theme points the framework's own defaults at those tokens:

```css
--default-transition-duration: var(--duration-state);
--default-transition-timing-function: var(--ease-standard);
```

So `transition-colors` on a hover state needs nothing else, and **writing `duration-state` or `ease-standard` at a call site that already inherits them is noise**. It adds a decision where there was none and removes the thing that made the default worth having.

## Two durations

| Class | Value | For |
|---|---|---|
| `duration-state` | 150ms | A control changing state. Hover, focus, selection, a colour or an opacity moving |
| `duration-surface` | 300ms | A surface arriving or leaving. A drawer, a panel, a strip that opens |

300ms is one job rather than a second speed. A larger surface travels further, so the eye has further to follow it, and that is the only place a longer duration is earned.

There is no third duration. Anything under about 100ms does not read as movement at all. It is not a shorter step on the same scale. It is a different kind of value, and it belongs in the component that needs it with its reason written down.

## Two curves

| Class | Value | For |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Everything, unless a surface is arriving |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | A surface arriving. Decelerating, so it settles rather than stops |

The curves are named by their job rather than their shape, which is what lets a reviewer reject one. There is no accelerating curve for a surface leaving, because nothing Caido draws needs one. The component library draws some of its own leaving motion on `ease-in`, which falls under the motion the library owns.

## What animates, and what never does

| Animates | Never animates |
|---|---|
| Colour on a control changing state | Anything on a surface carrying captured content |
| Opacity on something appearing or dimming | Any property that forces layout |
| A surface arriving or leaving | A row in a data table, a response body, an editor |
| Transform, when a surface travels | |
| A loading or progress indicator | |

**Nothing on a data surface moves.** Not a row in a data table, not a response body, not an editor. A row in a menu or a popover is chrome rather than data, so it may. This is what Caido already does rather than a preference: the shared table carries no motion of any kind, and neither does the editor.

Two reasons hold it. Rows are packed tightly because the data is what matters, so a row that moves when the pointer crosses it is spending attention on chrome. And captured content is not interface: a response body was written by somebody else, sometimes by an attacker, and it does not get to move.

**No property that forces layout.** `width`, `height`, `top`, `left` and `margin` force layout on every frame, in a tool people keep open for hours beside a live proxy. Animate `transform` and `opacity`, which composite instead.

## Reduced motion is handled once

Someone who has asked their system to reduce motion gets every transition and every animation switched off across the whole page, by one global stylesheet. **You do not write `motion-reduce:` on your own component.**

That is global for a practical reason rather than a stylistic one. Most of the motion on screen is drawn by the component library rather than by Caido, so a convention where each author remembers to add a variant would cover a small fraction of it and miss the rest.

Two things keep moving, and both carry information:

**A loading skeleton keeps pulsing.** It animates opacity and nothing else, which WCAG 2.3.3 excludes from its definition of motion animation, and it is the only thing saying the panel is loading.

**A spinner keeps spinning.** It does rotate, so it is motion, but it falls under the preload exception to WCAG 2.2.2, where not indicating progress would leave somebody thinking the app had frozen.

Everything else stops, including the pinging halo on a websocket tag, because the static dot under it already says everything the halo says.

## Motion is never the only thing saying something

This follows from the rule above. Once motion can be switched off for everyone at once, anything speaking only through movement goes silent for those users.

So if a thing animates to say something, something static has to say it too.
