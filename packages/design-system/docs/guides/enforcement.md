# Enforcement

Every rule in this system is a claim about what the interface does. A claim nobody checks stops being true quietly, in a pull request nobody had time to read closely.

Eleven lint rules make the checkable part checkable. They run at error, and they replace a reviewer noticing.

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

Colour is checked separately and by measurement rather than by rule: <TokenCount of="pairings" /> pairings in both appearances, against the floors on [Accessibility](/foundations/accessibility.md).

## What stays legal, and why

A rule with no correct alternative does not raise a standard. It teaches people to switch rules off. Three constructs use the same square brackets as an arbitrary value and are not one.

**An arbitrary variant is a selector.** `data-[level=INFO]:text-fg-info` chooses when a class applies and carries no measurement. The two are told apart by the character after the closing bracket, because a variant is always followed by a colon.

**A track template has no namespace.** `grid-cols-[auto_1fr]` describes the shape of a grid, and the framework has no theme namespace for a track list, so there is no token to move to.

**A keyword is not a measurement.** `max-h-[inherit]` names a behaviour.

Inline styles split on the same principle. A style is rejected when every value in it is a literal and allowed when any value comes from an expression. A virtual list writing a computed row offset is a measurement rather than a decision, and it cannot be a class because the number is not known until it runs. `:style="{ width: '100%' }"` is rejected, because that one is `w-full` wearing a disguise.

Spec files are exempt from the two colour rules. A test proving a component drops a class needs a class the system would never use, and a stock red is right for that job precisely because it is banned everywhere else.

Four names carrying the legacy prefix are not tokens, so the rule allows them. Three are channels holding a setting or a computed value, and the fourth is data: a highlight colour name is written onto a request and stored, so renaming one does not break a build, it stops every request already marked with that colour from painting, in projects nobody here can see.

## The escape hatch

Any rule can be switched off, and doing so requires a written reason naming which case in [Governance](/guides/governance.md#adding-a-token) the value is.

```vue
<!-- eslint-disable-next-line design/no-arbitrary-value -- case 3: the box reserves
     the width of a caret that inherits 1em, so it tracks the text setting rather
     than the pixel grid. -->
<div class="w-[1em]">
```

A reason under twelve characters is rejected as well as a missing one, because a dash and one word is not a reason. `eslint-disable-next-line` reaches only the line that follows it, so an attribute several lines into a multi-line tag needs a disable and enable pair around the element instead.

**The narrowest case carries an expiry.** A value private to one component stops being private the moment a third component needs it, at which point it becomes a missing name and moves to a shared utility. That is what happened to the scroll rail hiding, which was the same declarations in two places and is now one utility.

## What the rules cannot see

A rule that runs is not a rule that covers everything, and the gaps are worth knowing because they are where a violation hides in plain sight.

| Gap | What it means |
| --- | --- |
| The class rules read templates only | A class assembled in a script file is invisible to all of them |
| They match `class` and `:class` exactly | An attribute such as `header-class` or a pass-through class carries no protection at all |
| `no-arbitrary-value` skips anything variant-prefixed | A variant-prefixed arbitrary value is not reported |
| `require-escape-reason` reads named disables | A bare disable with no rule named is not caught, and switches everything off |
| A pairing nobody registered | Is a pairing nobody measured, so a new colour on a new surface has to be added to the list |

The preset is the largest uncovered surface. The design rules are applied to the interface and to this site's theme, and never to the package the preset lives in, which is why the preset writes scale names that first-party markup may not.

## Turning rules on where violations already exist

**The interface carried 721 violations across 229 files the day these rules were written.** Eleven rules failing a build that was green the day before does not raise the standard, it gets the rules switched off.

The linter records them instead. A suppressions file lists a count per file per rule, it is committed, and it may only ever count down. A new violation fails immediately, including in a file that already carries suppressed ones. Removing the last violation in a file makes its entry unused, and the build fails until the smaller file is committed.

So the file cannot be gamed in either direction, and its total is the tracker. **Two violations remain, both a style block in an editor wrapper**, against a baseline of 721.
