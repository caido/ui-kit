# Enforcement

A rule nobody checks stops being true quietly, in a pull request nobody had time to read closely. Eleven lint rules check what can be checked. They run at error, and they replace a reviewer noticing.

## What is enforced

| Rule | Rejects | Because |
| --- | --- | --- |
| `no-arbitrary-value` | `p-[5px]`, `w-[137px]` | A value in a class name is a value that sits on no scale |
| `no-stock-color` | `text-red-400`, `bg-gray-500` | The framework's ramps are not this system's colours, and they do not move with the appearance |
| `no-raw-color` | `#353942`, a colour function | A colour written as a literal has no name, no second value, and no contrast figure |
| `no-primitive-token` | `var(--palette-…)` | The primitive tier holds values and names no job |
| `no-legacy-token` | `var(--c-space-2)` | The vocabulary this system replaces. Two systems both being live is the state the migration exists to end |
| `no-ramp-step` | `bg-primary-500` | A numbered step is a position on a ramp rather than a job |
| `no-preset-scale` | `text-sm`, `rounded-md` | The framework's own scale names, which resolve to a role nobody chose |
| `no-unknown-token` | `bg-nonexistent-thing` | A utility whose token is not published generates nothing |
| `no-inline-style` | `style="width: 100%"` | A declaration on an element is a value the layer above cannot see |
| `no-style-block` | a `<style>` block in a component | A component stylesheet is a second system running beside this one |
| `require-escape-reason` | switching any of the above off without saying why | An exception nobody wrote down cannot be told from a mistake |

Colour contrast is measured rather than linted: <TokenCount of="pairings" /> pairings in both appearances, as [How pairings are checked](/foundations/tokens.md#how-pairings-are-checked) explains.

## What stays legal, and why

A rule with no correct alternative teaches people to switch rules off. Three constructs use the same square brackets as an arbitrary value and are allowed.

| Construct | Example | Why it is allowed |
| --- | --- | --- |
| An arbitrary variant | `data-[level=INFO]:text-fg-info` | It is a selector, always followed by a colon, and carries no measurement |
| A track template | `grid-cols-[auto_1fr]` | The framework has no namespace for a track list, so there is no token to move to |
| A keyword | `max-h-[inherit]` | It names a behaviour, not a measurement |

An inline style is allowed when any value in it comes from an expression, such as a virtual list writing a computed row offset. `:style="{ width: '100%' }"` is all literal, so it is rejected: that one is `w-full`.

Spec files are exempt from the two colour rules, because a test proving a component drops a class needs a class the system would never use.

Four names with the legacy prefix are not tokens, so the rule allows them. Three are channels holding a setting or a computed value. The fourth is a highlight colour name stored on each request, so renaming it would stop every request already marked with that colour from painting.

## The escape hatch

Any rule can be switched off, and doing so requires a written reason naming which case in [Governance](/guides/governance.md#adding-a-token) the value is.

```vue
<!-- eslint-disable-next-line design/no-arbitrary-value -- case 3: the box reserves
     the width of a caret that inherits 1em, so it tracks the text setting rather
     than the pixel grid. -->
<div class="w-[1em]">
```

A reason under twelve characters is rejected as well as a missing one. `eslint-disable-next-line` reaches only the next line, so an attribute further down a multi-line tag needs a disable and enable pair around the element.

**The private case carries an expiry.** A value private to one component stops being private when a third component needs it, and moves to a shared utility, as the scroll rail hiding did.

## What the rules cannot see

| Gap | What it means |
| --- | --- |
| The class rules read templates only | A class assembled in a script file is invisible to all of them |
| They match `class` and `:class` exactly | An attribute such as `header-class` or a pass-through class carries no protection at all |
| `no-arbitrary-value` skips anything variant-prefixed | A variant-prefixed arbitrary value is not reported |
| `require-escape-reason` reads named disables | A bare disable with no rule named is not caught, and switches everything off |

The preset is the largest uncovered surface. The rules run on the interface and this site's theme but never on the preset package, which is why the preset writes scale names that first-party markup may not.

## Turning rules on where violations already exist

The interface carried 721 violations across 229 files the day these rules were written. Failing the build on all of them would only have got the rules switched off.

Instead, a committed suppressions file lists a count per file per rule, and it may only count down. A new violation fails immediately, even in a file that already carries suppressed ones, and removing the last one in a file fails the build until the smaller file is committed. **Two violations remain, both a style block in an editor wrapper.**
