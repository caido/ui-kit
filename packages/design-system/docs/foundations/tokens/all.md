# All tokens

Every token in the system, searchable by name, by CSS variable, or by the value it resolves to.

Search matches all three, so `surface` finds every surface token, `--color-fg` finds the foreground variables, and pasting a value you found in the inspector finds the token it came from. Several words narrow rather than widen: `fill danger` returns only tokens matching both.

Semantic tokens are the ones you write, and there are <TokenCount of="semantic" /> of them. Primitives are the <TokenCount of="primitive" /> raw ramp positions they point at, shown here so you can trace a value back to its step. [Two tiers](/foundations/tokens.md#two-tiers) explains the difference, and the buttons below switch between them.

Results are grouped by what the tokens are for, so you can browse a group without searching.

A token marked `same` holds one value in both themes. A type role also lists the line height and weight it carries. [Reference](/foundations/tokens/reference.md) covers the rules these names follow.

<TokenBrowser />
