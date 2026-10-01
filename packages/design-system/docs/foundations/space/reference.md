# Space reference

Every rung and fixed value, with what it is for. For what these mean, see [Overview](/foundations/space.md#the-ladder). For how to choose between them, see [Usage](/foundations/space/usage.md#picking-a-rung).

Values are in pixels and do not change when a user changes their interface text size.

## The rungs

<SpacingScale />

There is no 5, 7, 9, 10 or 11. A margin or an offset takes a leading minus at any rung, where an element has to pull back onto a neighbour.

## Control padding

The half steps either side of rung 1, and rung 1 itself. Two of the three sit off the 4 pixel grid.

| Class | Value |
|---|---|
| `p-0.5` | 2px |
| `p-1` | 4px |
| `p-1.5` | 6px |

The axis spellings take the same three values, so `py-1.5` and `px-1.5` are each the same 6 pixels.

A control that carries text writes no height. It is the line box of the type role plus the padding above and below.

## Radius

| Class | Value | For |
|---|---|---|
| `rounded` | 6px | Every rectangular surface |
| `rounded-full` | A round shape | Dots, avatars and pills |
| `rounded-none` | 0 | Removing the corner |

## Dialog widths

| Class | Value | For |
|---|---|---|
| `max-w-dialog-sm` | 400px | A confirmation or a single field |
| `max-w-dialog-md` | 600px | A form with a short body |
| `max-w-dialog-lg` | 800px | The widest forms |

Derived by shrinking each dialog in Caido until its content overflowed. The measured floors were 188px for a confirmation and 439px for a short form, so all three clear their content with room to spare.

## Border widths

`border`, `border-2` and `border-4` emit 1, 2 and 4 pixels. They come from the framework as fixed values, so there is nothing to choose and nothing to tokenise.

## The layout components

| Component | What it does |
|---|---|
| `Stack` | Puts a gap between children in either direction |
| `HStack` | A horizontal stack |
| `VStack` | A vertical stack |
| `StackItem` | Says whether one child grows or shrinks |

| Prop | On | Accepts |
|---|---|---|
| `gap` | all stacks | `0 1 2 3 4 6 8 12`. Defaults to 2 |
| `padding`, `paddingBlock`, `paddingInline` | all stacks | `0 1 2 3 4 6 8 12` |
| `direction` | `Stack` | `horizontal`, `vertical`. Defaults to `vertical` |
| `align` | `Stack` | `start`, `center`, `end`, `stretch`, `baseline`. Defaults to `stretch` |
| `justify` | `Stack` | `start`, `center`, `end`, `between`. Defaults to `start` |
| `alignX`, `alignY` | `HStack`, `VStack` | `start`, `center`, `end`, plus `between` along the direction and `stretch` or `baseline` across it. `HStack` defaults to `start` and `center`, `VStack` to `stretch` and `start` |
| `wrap` | all stacks | boolean. Defaults to false |
| `grow`, `shrink` | `StackItem` | boolean. `grow` defaults to false, `shrink` to true |

`HStack` and `VStack` name the axes rather than taking the `align` and `justify` that `Stack` does, because on a horizontal stack `align` is vertical and on a vertical stack it is horizontal, and neither name says which.

## What not to write

| Never write | Examples | Write instead |
|---|---|---|
| Preset corners | `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg` | `rounded`. Each already resolves to the same 6 pixels |
| Shadows | `shadow-sm`, `shadow-md`, `shadow-lg` | nothing. Layering is z-index, see [Depth](/foundations/depth.md) |

A shadow other than `shadow-none` generates no CSS and reports nothing. A preset corner is the other case: it is aliased onto the one radius so the component library keeps working, and a lint rule reports it in first party markup, at error.

Off-ladder spacing behaves differently. `p-5` does compile, because the utilities come from the framework rather than from this system.
