# Type reference

Every role, weight and family, with the values behind them. For what these names mean, see [Overview](/foundations/type.md#a-role-is-a-job-not-a-size). For how to choose between them, see [Usage](/foundations/type/usage.md#picking-a-role).

Sizes and line heights are given at the default interface size of 14. They move together when a user changes it.

## The six roles

| Role | Size | Line height | Weight | Measure | For |
|---|---|---|---|---|---|
| `text-caption` | 12 | 16 | 400 | none | Names or annotates something else. Form labels, table metadata, timestamps, counters |
| `text-body` | 14 | 20 | 400 | 66ch | A sentence a reader reads. The default, and what an element inherits when it says nothing |
| `text-body-strong` | 14 | 20 | 600 | 66ch | Body text carrying emphasis |
| `text-heading` | 16 | 20 | 600 | none | A heading inside a panel or a settings section |
| `text-title` | 18 | 24 | 600 | none | A dialog title, a page header, an empty state heading |
| `text-hero` | 24 | 32 | 600 | none | Onboarding and celebration screens. Never on a screen carrying data |

Every size is a whole number of pixels and every line height is a multiple of four at the default.

Each role has a token at `text.<role>` and a custom property at `--text-<role>`, with the line height and the weight on `--text-<role>--line-height` and `--text-<role>--font-weight`.

The sample below shows the roles in proportion to one another, each labelled with the value it resolves from.

<Specimen />

## Weights

| Class | Weight |
|---|---|
| `font-regular` | 400 |
| `font-medium` | 500 |
| `font-bold` | 600 |

The shipped face is declared across 400 to 600. A request above 600 renders at 600 and a request below 400 renders at 400, with nothing reported. `b` and `strong` resolve to `font-bold` rather than to the browser's default.

## Families

| Class | Stack |
|---|---|
| `font-sans` | `Inter, "Inter Fallback", ui-sans-serif, system-ui, sans-serif` |
| `font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |

The system ships the interface face and no monospace face, so mono resolves to what the platform already provides.

A user can replace the interface face from settings with one of seven system faces. Those carry a regular and a bold and nothing between, which is why [medium never separates two roles](/foundations/type.md#three-weights).

## Measure

| Token | Value | Utility |
|---|---|---|
| `container.measure` | 66ch | `max-w-measure` |

Write `max-w-measure` on `body` and `body-strong` running as prose. Not on captions, headings, or anything bounded by a column.

## The text size setting

| | Value |
|---|---|
| Minimum | 12 |
| Default | 14 |
| Maximum | 24 |

Every role is written relative to this, so all six move together. Spacing does not move with it, because [the grid is written in pixels](/foundations/space.md).

## What the roles replace

These stock namespaces are emptied before the roles are declared, so `font-serif`, `leading-tight`, `leading-snug`, `leading-relaxed`, `leading-loose` and the six stock `tracking-*` names generate no CSS and produce no warning. The size names from `text-xs` to `text-2xl`, along with `font-normal`, `font-semibold` and `leading-normal`, are pointed back at role values in the app so the component library preset keeps rendering, which means one of those names written in Caido resolves to a role value nobody chose. Two further size names, `text-6xl` and `text-7xl`, are re-declared for the glyphs in the keyboard shortcut dialog and resolve to 52 and 64 at the default rather than to a role.

| Namespace | Stock classes | Write instead |
|---|---|---|
| `--text-*` | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` | one of the six roles |
| `--font-weight-*` | `font-normal`, `font-semibold` | `font-regular`, `font-medium`, `font-bold` |
| `--font-*` | `font-serif` | `font-sans`, `font-mono` |
| `--leading-*` | `leading-tight`, `leading-snug`, `leading-relaxed`, `leading-loose` | the line height on the role, or `leading-none` |
| `--tracking-*` | `tracking-tighter`, `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-wider`, `tracking-widest` | nothing. The system sets no letter spacing |

[Tokens](/foundations/tokens.md#why-stock-utility-names-are-not-safe-to-write) covers why the namespaces are cleared rather than the classes merely discouraged.
