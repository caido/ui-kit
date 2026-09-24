# Motion reference

Every duration and curve. For what these mean, see [Overview](/foundations/motion.md). For how to choose between them, see [Usage](/foundations/motion/usage.md).

## Durations

| Class | Value | For |
|---|---|---|
| `duration-state` | 150ms | A control changing state |
| `duration-surface` | 300ms | A surface arriving or leaving |

## Curves

| Class | Value | For |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Everything, unless a surface is arriving |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | A surface arriving |

## What a bare transition resolves to

| Property | Resolves to |
|---|---|
| `--default-transition-duration` | `var(--duration-state)`, so 150ms |
| `--default-transition-timing-function` | `var(--ease-standard)` |

So `transition-colors` with nothing else already runs at 150ms on the standard curve. Writing either class at such a call site adds nothing.

The two lines above are written by the theme rather than emitted with the tokens, so anything wiring its own theme has to point them at the tokens itself or a bare `transition` falls back to the framework's own defaults. Those happen to hold the same 150ms and the same curve today, so nothing looks wrong, and nothing holds them in step if either side moves.

## What animates

| Animates | Never animates |
|---|---|
| Colour on a control changing state | Anything on a surface carrying captured content |
| Opacity on something appearing or dimming | Any property that forces layout |
| A surface arriving or leaving | A row in a data table, a response body, an editor |
| Transform, when a surface travels | |
| A loading or progress indicator | |

Layout properties to avoid animating: `width`, `height`, `top`, `left`, `margin`. Animate `transform` and `opacity`, which composite.

Nothing Caido writes uses `transition-all`, because it names no property and animates whatever changes. The library writes it in some of its own presets, which falls under the motion the library owns.

## Reduced motion

One global stylesheet switches every transition and every animation off for the whole page. A component does not write its own variant.

| Keeps moving | Why |
|---|---|
| `animate-pulse` on a loading skeleton | Animates opacity only, which WCAG 2.3.3 excludes from motion animation, and it is the only thing reporting that the panel is loading |
| `animate-spin` on a spinner | Falls under the preload exception to WCAG 2.2.2, where not indicating progress would suggest the app had frozen |

Everything else stops, including `animate-ping`, because the static dot beneath it already carries the same information.

## Values that are not on the scale

| Value | Why it is not a token |
|---|---|
| A progress bar's 1000ms | A fixed smoothing time on the bar's transform, rather than a control changing state |
| A route transition's 50ms | Below the threshold at which a change reads as motion at all |

Anything under roughly 100ms belongs in the component that needs it, with its reason written down.

## Motion drawn by the component library

Components from the library carry their own durations and curves, and those are not set by this system. The library writes `duration-200` and `ease-in` in its own presets, neither of which is on this scale.

Where a package draws the motion, the package owns it, so a difference there is raised against the package rather than repainted locally.
