# Token reference

The rules a token name follows, and what the system counts. For what these names mean, see [Overview](/foundations/tokens.md). For how to choose between them, see [Usage](/foundations/tokens/usage.md#finding-the-token-you-need).

## The name grammar

| Tier | Shape | Example |
|---|---|---|
| Semantic, in colour | `namespace.role.name` | `color.surface.page` |
| Semantic, outside colour | `namespace.name` | `text.body` |
| Semantic, category accent | `color.category.hue.role` | `color.category.rust.fill` |
| Primitive, on a ramp | `palette.family.appearance.step` | `palette.neutral.light.1` |
| Primitive, off the ramps | `palette.family.appearance.name` | `palette.metal.light.gold` |
| Primitive, category | `palette.category.appearance.hue.role` | `palette.category.light.rust.fill` |

Outside colour a semantic name usually has two segments. `spacing` and `radius` have one, because each of those namespaces publishes a single value, and `container.dialog.sm` adds a third for the size.

The CSS variable is the token name with dots turned into dashes, so `color.surface.page` is `--color-surface-page`.

## Counts

| | Count |
|---|---|
| Semantic tokens | <TokenCount of="semantic" /> |
| Primitive tokens | <TokenCount of="primitive" /> |
| Total | <TokenCount of="total" /> |
| Vary by appearance | <TokenCount of="varying" /> |
| Same in both themes | <TokenCount of="fixed" /> |

## Cleared namespaces

These seven are emptied before the tokens are declared, so the token package leaves no stock value in them. Caido aliases the common names back onto its own values so the shipped component preset keeps working, and `design/no-preset-scale` reports twelve of those names as an error in first-party markup. A name outside those twelve produces no warning either way: `rounded-xl` and `leading-normal` still resolve through an alias, while `tracking-wide` and `shadow-md` match no utility.

| Namespace | Stock names it clears | Replaced by |
|---|---|---|
| `--text-*` | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` | [type roles](/foundations/type.md) |
| `--font-*` | stock family names | `font-sans`, `font-mono` |
| `--font-weight-*` | `font-normal`, `font-semibold` | `font-regular`, `font-medium`, `font-bold` |
| `--leading-*` | `leading-tight`, `leading-loose` | the line height on each type role |
| `--tracking-*` | `tracking-wide`, `tracking-tight` | nothing. No letter spacing token is published |
| `--radius-*` | `rounded-sm`, `rounded-md`, `rounded-lg` | a single `rounded`, see [Space](/foundations/space.md) |
| `--shadow-*` | `shadow-sm`, `shadow-md`, `shadow-lg` | nothing. Layering is z-index, see [Depth](/foundations/depth.md) |

The colour namespace is not cleared, so `bg-red-500` still renders. It is still wrong, because a fixed colour cannot follow the theme.

The system publishes one radius token, so the corner to write is the bare `rounded`. The theme block still gives `rounded-xl`, `rounded-2xl`, `rounded-3xl` and `rounded-4xl` fixed values of 12px, 16px, 24px and 32px, none of which the rule reports. `--shadow-*` is the one left with no replacement, so the depth names from `shadow-2xs` to `shadow-2xl` match no utility. `rounded-full`, `rounded-none` and `shadow-none` carry static values rather than token values, and keep working.

## Contrast rules

<TokenCount of="pairings" /> pairings are listed in the token source, and a contrast script measures each in both appearances. It is run on its own rather than as part of the build. The comparison reads the unrounded ratio, so 4.48 fails.

| Usage | Floor | Pairings | Applies to |
|---|---|---|---|
| `text` | 4.5 | 142 | Anything a person reads |
| `identifier` | 3.0 | 22 | Colour that is the only thing identifying a control |
| `focus` | 3.0 | 5 | The focus ring against what sits behind it |

<TokenCount of="accepted-failures" /> pairings are recorded as accepted exceptions. A pairing that is not listed is not checked.

## Appearance

| Root element | `color-scheme` | Result |
|---|---|---|
| no attribute | `light dark` | follows the operating system |
| `data-appearance="light"` | `light` | always light |
| `data-appearance="dark"` | `dark` | always dark |

## Every token

[All tokens](/foundations/tokens/all.md) is the searchable list, with the value each name resolves to in both themes.
