# Accessibility reference

Every criterion, role and check. For what these mean, see [Overview](/foundations/accessibility.md). For how to choose between them, see [Usage](/foundations/accessibility/usage.md).

The target is WCAG 2.2 level AA.

## The criteria

| Criterion | Level | What it requires | Where it is met |
|---|---|---|---|
| 1.4.1 Use of Color | A | Colour is never the only signal | [Colour](/foundations/colour/usage.md#not-relying-on-colour-alone) |
| 1.4.3 Contrast (Minimum) | AA | Text clears its floor, taken here as 4.5 to 1 throughout | [Colour](/foundations/colour.md#contrast-and-accessibility) |
| 1.4.4 Resize Text | AA | Text scales without loss | [Type](/foundations/type/usage.md#never-pinning-a-size-in-pixels) |
| 1.4.8 Visual Presentation | AAA | Several things, of which the bounded line is the one taken | [Type](/foundations/type.md#the-measure) |
| 1.4.11 Non-text Contrast | AA | An identifying colour clears 3 to 1 | [Colour](/foundations/colour.md#contrast-and-accessibility) |
| 2.1.1 Keyboard | A | Everything operable by pointer is operable by keyboard | [States](/foundations/states/usage.md#making-everything-clickable-reachable) |
| 2.2.1 Timing Adjustable | A | A time limit is avoidable, which is why an error carries none | [Feedback](/foundations/feedback.md#a-toast-is-for-something-you-are-not-looking-at) |
| 2.3.3 Animation from Interactions | AAA | Motion is switchable off | [Motion](/foundations/motion.md#reduced-motion-is-handled-once) |
| 2.4.3 Focus Order | A | Focus follows reading order | [Usage](/foundations/accessibility/usage.md#keeping-focus-in-reading-order) |
| 2.4.7 Focus Visible | AA | Focus is always indicated | [Colour](/foundations/colour.md#the-focus-ring) |
| 2.5.8 Target Size (Minimum) | AA | A pointer target is 24 by 24 CSS pixels | [Usage](/foundations/accessibility/usage.md#sizing-a-pointer-target) |
| 4.1.3 Status Messages | AA | A status is announced without taking focus | [Feedback](/foundations/feedback.md#what-a-screen-reader-is-told-about-a-wait) |

Two of those sit above the target. 1.4.8 and 2.3.3 came free with decisions taken for other reasons. A third, 2.4.13 Focus Appearance, is not in the table at all because it measures something different from 1.4.11: the same pixels focused and unfocused, rather than the indicator against what is behind it. The focus outline is 2px, which is the perimeter 2.4.13 asks for. 2.4.11 Focus Not Obscured is missing rather than met, because `CTable` keeps its header row sticky and nothing has measured a focused row scrolled under it.

## Grid and table roles

| Element | Carries |
|---|---|
| The table | `role="grid"`, an accessible name, `aria-rowcount` |
| A header cell | `role="columnheader"`, and `aria-sort` when sortable |
| A row | `role="row"` and `aria-rowindex` |
| A cell | `role="gridcell"`, from `CItemCell` |
| The item rows together | `role="rowgroup"` |
| A selectable row | `aria-selected` |
| A loading table | `aria-busy` |

`aria-rowcount` counts the dataset, plus the header row when a table carries one, and `aria-rowindex` numbers into that same total rather than into the rendered window. The header row sits outside the rowgroup, and the cells come from `CItemCell`, so a table that builds its own row interior carries no cell roles at all.

## Target sizes

| | Minimum | Notes |
|---|---|---|
| A pointer target | 24 by 24 CSS pixels | Written as a floor, not derived, so it holds below the default text setting |
| An icon-only control | 24 by 24, as above | Its size comes from the glyph and the padding around it, and neither is bound to the floor |

Exempt: anything inline in a sentence, anything whose function is reachable from a control that does meet the floor, anything sized by the user agent, anything where the presentation is essential, and anything spaced so that 24 pixel circles centred on each target do not intersect. That last one is the exception a dense table invokes.

## Names

| Source | Counts as a name |
|---|---|
| `label` on a component | Yes, and required on the input components and `CButton`. `CAutoComplete` and `CDropdown` carry no such prop |
| A visible `label` element bound to its control | Yes |
| `aria-label` | Yes, on an element whose role permits a name. Ignored on a bare `div` or `span` |
| A tooltip | No. It names its own container and nothing on the control |
| A placeholder | No. It disappears when somebody types |
| A title attribute | Last resort only. Absent on touch, and it loses to everything else |

## What is enforced

| Rule | Checked by |
|---|---|
| Text and identifying colour clear their floors | The contrast gate, on <TokenCount of="pairings" /> pairings in both appearances |
| An accepted contrast exception that stops failing | The same gate, which fails until the entry is removed |
| A click handler without a keyboard handler | Lint, at error |
| An interactive element that cannot take focus | Lint, at error |
| A form control with no label | Lint at error, and a required prop |
| An invalid or incomplete `role` | Lint, at error |
| A positive `tabindex` | Lint, at error |
| A `@mouseover` or `@mouseleave` without its focus equivalent | Lint, at error, and on components as well |
| A name on an interactive control | A required prop, for components only |
| The focus indicator | Nothing |
| The tooltip on an icon-only control | Nothing |
| A pointer target clearing 24 by 24 | Nothing |
| `aria-rowcount` counting the dataset | Nothing |

The click-handler rule matches a handler written as a bare name or an inline function. A handler written as a property of an object is not matched, so an element carrying one passes while being unreachable.

## What not to write

| Avoid | Instead |
|---|---|
| A click handler on a container | The element that already does the job |
| `role` plus `tabindex` plus a key handler | The same, unless the right element genuinely cannot be used |
| A placeholder as the only name | A `label`, hidden if it would be redundant |
| A tooltip as the only name | A `label` as well, because they answer different questions |
| `visibility` or `display` to hide a hover action | Opacity, so the control stays focusable |
| A double-click as the only route to an action | A second route with a name of its own |
| A row count taken from the rendered window | The dataset total, or `-1` when it is unknown |
| Removing an outline | An offset, if it sits wrong |
