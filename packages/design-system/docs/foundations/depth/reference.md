# Depth reference

Every surface and layer, with the values behind them. For what these mean, see [Overview](/foundations/depth.md). For how to choose between them, see [Usage](/foundations/depth/usage.md#picking-a-layer).

## Surfaces available for depth

| Token | Position |
|---|---|
| `surface-page` | Resting. The application background |
| `surface-subtle` | Resting. A quieter region inside a page |
| `surface-raised` | Floating. Anything sitting above the page |

`surface-hover` and `surface-selected` sit above `surface-raised` on the ramp and are states rather than depths.

## The edge of a floating surface

| Token | Used for |
|---|---|
| `line-default` | The edge of a floating panel |
| `line-subtle` | A rule inside a panel, between two rows |

## Measured separation

Against `surface-page`, in each appearance. A ratio is never rounded up.

| Token | Light | Dark |
|---|---|---|
| `surface-raised` | 1.20 | 1.20 |
| `line-subtle` | 1.67 | 1.66 |
| `line-default` | 2.06 | 2.03 |
| `line-strong` | 3.16 | 3.11 |

`line-strong` is the one token above clearing the 3 to 1 non-text floor, and it is still not used for panel edges, because that floor applies where colour is the only thing identifying a control. A line between two panels identifies nothing.

## The layers

The first four order siblings inside one panel. The last six order the page.

| Class | Value | What belongs here |
|---|---|---|
| `z-below` | -1 | Something drawing underneath the content it belongs to, like the workflow connection canvas beneath its node cards |
| `z-base` | 0 | Ordinary content. Nothing needs to write this |
| `z-raised` | 1 | Lifted above its own siblings inside one panel. A column resize handle, a state panel covering an editor, a label floated over one |
| `z-sticky` | 2 | Stays in place while its container scrolls. One rung above raised so a sticky header clears anything its own panel has lifted |
| `z-overlay` | 50 | Floats over one panel. A jump to row pill, a drawer inside a panel, a drag mirror. Above forty because the component library preset writes `z-40` on a popover root and a sticky table header, and those land in the same stacking context as this one |
| `z-scrim` | 60 | Dims the page so one thing can be worked on. Above overlay because it covers panel overlays too |
| `z-spotlight` | 70 | The one element a scrim isolates |
| `z-floating` | 100 | Where the component library opens. The application points the `menu`, `overlay`, `modal` and `tooltip` groups here, which covers a menu, a select, a popover, a dialog, a drawer, a toast and a tooltip |
| `z-detached` | 10000 | A surface placed outside the element it belongs to, where that element can itself be floating |
| `z-cover` | 20000 | Replaces the application. Onboarding, the welcome screen, the loading screen |

## What does not exist

| Absent | Examples | Write instead |
|---|---|---|
| Shadows | `shadow-sm`, `shadow-md`, `shadow-lg` | a surface step and a border |

The token package clears the shadow scale, so the `shadow-md` and `shadow-lg` the preset writes on a card, a drawer and a tooltip read an empty scale and paint nothing. That is silent, not reported.

Numeric z-index classes behave differently. `z-10` and `z-50` do compile, because the utilities come from the framework rather than from this system. The named layers are a rule everywhere, not something the compiler enforces.
