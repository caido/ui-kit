# @caido/primevue

PrimeVue themes for Caido.

## Focus indicators

This package draws no focus indicator. The consuming application must define one.

Focus is a global concern. One indicator, applied once by the application, is consistent
across every component and can be checked against a contrast target as a whole. Every
component deciding for itself cannot be checked that way and does not stay consistent.
The preset therefore neither removes the browser outline nor substitutes a ring of its own.

An application using this preset must define a `:focus-visible` rule. Without one, controls
show whatever the browser draws by default.

Three components need more than that rule. `checkbox`, `radiobutton` and `toggleswitch`
place a transparent input over a styled box, so an indicator on the focused element paints
nothing. An application must style the visible sibling as well.

Caido's own rule, for reference:

    :focus-visible {
      outline: 2px solid var(--color-line-focus);
      outline-offset: 2px;
    }

    input.peer:focus-visible ~ * {
      outline: 2px solid var(--color-line-focus);
      outline-offset: 2px;
    }
