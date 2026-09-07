# @caido/primevue

## Unreleased

### Breaking

The preset no longer draws focus indicators.

It previously removed the browser outline in 90 places across 52 files and substituted a
ring of its own. Fifty-five of those removals were scoped to `focus` rather than
`focus-visible`, so they also fired on a mouse click. The substituted rings were never
measured against a contrast target.

Applications using this preset must now define their own `:focus-visible` rule. An
application that does not will fall back to the browser default, and will show no indicator
at all on `checkbox`, `radiobutton` and `toggleswitch`, which relocate focus to a sibling.

### Changed

Colours are written from Caido's design tokens rather than from stock Tailwind palettes.
188 stock colour references are gone, along with the `primary-contrast` and `highlight`
names that resolved through PrimeVue's own variables.

Appearance is carried by the tokens rather than by `dark:` variants. A token such as
`surface-page` already resolves per appearance, so a hand-written light and dark pair
applied the inversion twice.

### Fixed

An `info` badge rendered with no background. Two object literals each carried a duplicate
key, so the later one silently won and tested the wrong severity.

`dark:focus:ring-red-4000` in `message` and `toast`. There is no such step, so the class
compiled to nothing and the dark ring fell back to the light one.

`hover:bg-surface-80/50` in `treetable`. There is no step 80.
