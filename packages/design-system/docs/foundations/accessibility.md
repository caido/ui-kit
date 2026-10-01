# Accessibility

Accessibility in Caido is not a separate pass at the end. Nearly every rule here was decided by some other part of the system while it was solving its own problem, so almost none of it is written for the first time.

What this page adds is one place to ask whether a control is reachable and named, the rules nobody else owns, and an honest account of which of them a machine actually checks.

This page explains the model. [Usage](/foundations/accessibility/usage.md) shows how to apply it, and [Reference](/foundations/accessibility/reference.md) lists every criterion, role and check.

## AA is the target, not the measurement

The target is **WCAG 2.2 level AA**. Where an AAA criterion is reachable at no cost it is taken, and the criteria table records that.

That is a target rather than a claim of conformance, and the difference matters. One thing here is measured on real values rather than reviewed: colour, at **<TokenCount of="pairings" /> pairings** in both appearances, checked in CI before a review starts. Everything else is a rule a person follows, a type a compiler enforces, or a lint rule with a known blind spot.

So the honest sentence is that the colour floor is met by measurement and the rest is met by construction and review.

## Most of this was decided somewhere else

Repeating a rule is how two versions of it come to exist. Each subject below is owned by the page that worked it out, and that page carries the reasoning.

| Subject | Owner |
|---|---|
| The contrast floors, and which surfaces a foreground is approved for | [Colour](/foundations/colour.md#contrast-and-accessibility) |
| How pairings are checked, and what it means that one is not listed | [Tokens](/foundations/tokens.md#how-pairings-are-checked) |
| Colour is never the only signal | [Colour](/foundations/colour/usage.md#not-relying-on-colour-alone) |
| The focus ring, and why it is an outline in pixels | [Colour](/foundations/colour.md#the-focus-ring) |
| Never removing the focus outline | [States](/foundations/states/usage.md#never-removing-the-focus-outline) |
| Everything clickable is reachable, and hover affordances need a focus equivalent | [States](/foundations/states/usage.md#making-everything-clickable-reachable) |
| Every state looks different from every other | [States](/foundations/states.md#every-state-has-to-look-different-from-every-other) |
| Labelling an icon, and why a tooltip is not a name | [Icons](/foundations/icons/usage.md#labelling-an-icon) |
| Live regions, roles on a progress bar, and politeness | [Feedback](/foundations/feedback.md#what-a-screen-reader-is-told-about-a-wait) |
| Reduced motion, and motion never being the only signal | [Motion](/foundations/motion.md#reduced-motion-is-handled-once) |
| A size in pixels ignoring the text setting | [Type](/foundations/type/usage.md#never-pinning-a-size-in-pixels) |

What follows is what those pages left.

## The element, not the role

Two pages arrived at the same rule from opposite directions without naming it. Type reached it through headings: a role decides how text looks and says nothing about what it is. States reached it through clicks: a container takes no focus and answers no key.

**A control becomes a `button`, a thing that navigates becomes an `a`, and a heading becomes a heading.** Each is reachable, announced and operable with nothing written by hand.

Reaching for a role plus a tab stop plus a key handler is what you do when the right element genuinely cannot be used. It is three chances to get something wrong in place of none.

## A tooltip is not a name

**Every interactive control has an accessible name.** Without one it does not exist for anybody using a screen reader, and no amount of visible styling changes that.

Two things that look like names and are not. A tooltip sets its own attributes and no `aria-label`, so a control with a tooltip and no label is still nameless. A placeholder disappears the moment somebody types, so a field identified by its placeholder loses its name exactly when the person is using it.

The input components make this structural where they can: `label` is a required prop on `CInput`, `CSelect`, `CCheckbox`, `CRadio`, `CToggle` and `CSegmented`, so a field built from one of those with no name does not compile. `CAutoComplete` and `CDropdown` take no `label` prop, so a name on either is written by hand. `hideLabel` hides the text visually and keeps the name.

An icon-only control needs a name and a tooltip, and [Icons](/foundations/icons/reference.md#an-icon-only-control) gives the reason for each. Only the name is guaranteed by the type system.

## A table is a grid

A virtualised list of containers tells a screen reader nothing about being a table, how big it is, or where in it you are. `CTable` carries the outer semantics, and the cells come from `CItemCell`, so a table that builds its own row interior out of plain containers carries no cell roles.

| Element | Carries |
|---|---|
| The table | `role="grid"`, an accessible name, `aria-rowcount` |
| A header cell | `role="columnheader"`, and `aria-sort` when sortable |
| A row | `role="row"` and `aria-rowindex` |
| A cell | `role="gridcell"` |
| A selectable row | `aria-selected` |
| A loading table | `aria-busy` |

`grid` rather than `table` because the rows are selectable and meant to be navigable, which is the distinction between the two roles.

Two things the grid does not do yet, and both are gaps rather than decisions. `CTable` gives a row no tab stop and tracks no active descendant, so next-row and previous-row movement arrives through a global command rather than through the grid, and the half of the role that promises navigation is not kept. And a consumer fills the row slot with its own container, so the cells are grandchildren of the row rather than children, which breaks the ownership the roles describe.

## The count is the dataset

**`aria-rowcount` counts the rows that exist, not the rows on screen.** `aria-rowindex` is a row's position in that same total, rather than among the rows currently rendered.

Virtualisation gets this wrong by default, and it tells somebody they are on row 3 of 20 when they are on row **4,312 of 90,000**. Where the total is genuinely unknown, write `-1` rather than a confident wrong number.

## What a machine catches, and what it does not

Knowing which half a rule is in changes how carefully you have to read your own work.

**Nineteen** accessibility rules run at error on every template, which is more than it sounds. A click handler with no keyboard handler, an interactive element that cannot take focus, a form control with no label, and an invalid `role` are all lint failures rather than review comments.

**The rules that check reachability stop at the component boundary.** A click handler on a component is skipped by them, whatever it says, and a handler written as a property of an object is not matched either. So a container carrying `@click="row.open"` passes every check while being unreachable by keyboard.

Eighteen sites also carry a suppression, each with its reason written beside it, and most of those reasons say the keyboard route exists somewhere the rule cannot see, in a context menu or on a focusable descendant. The number is published rather than left out.

Four rules here have nothing checking them at all: the focus indicator, the tooltip half of the icon rule, the pointer target floor, and the rule about `aria-rowcount`. [Reference](/foundations/accessibility/reference.md#what-is-enforced) lists what each rule is checked by.
