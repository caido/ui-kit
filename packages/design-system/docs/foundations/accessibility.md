# Accessibility

Accessibility in Caido is not a separate pass at the end. Most of its rules were decided by other parts of the system while solving their own problems. This page collects the rules nobody else owns, and says which of them a machine actually checks.

This page explains the model. [Usage](/foundations/accessibility/usage.md) shows how to apply it, and [Reference](/foundations/accessibility/reference.md) lists every criterion, role and check.

## AA is the target, not the measurement

The target is **WCAG 2.2 level AA**. Where an AAA criterion is reachable at no cost it is taken, and the criteria table records that.

That is a target rather than a claim of conformance. Only colour is measured on real values, at **<TokenCount of="pairings" /> pairings** in both appearances, checked in CI before a review starts. Everything else is met by construction and review: a rule a person follows, a type a compiler enforces, or a lint rule with a known blind spot.

## Most of this was decided somewhere else

Repeating a rule is how two versions of it come to exist, so each subject is owned by the page that worked it out.

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

## The element, not the role

Type and States reach the same rule from opposite directions: a type role says nothing about what text is, and a container takes no focus and answers no key.

**A control becomes a `button`, a thing that navigates becomes an `a`, and a heading becomes a heading.** Each is reachable, announced and operable with nothing written by hand.

A role plus a tab stop plus a key handler is for when the right element genuinely cannot be used. It is three chances to get something wrong in place of none.

## A tooltip is not a name

**Every interactive control has an accessible name.** Without one it does not exist for anybody using a screen reader, and no amount of visible styling changes that.

A tooltip sets no `aria-label`, so a control with a tooltip and no label is still nameless. A placeholder disappears the moment somebody types, so a field loses its name exactly when the person is using it.

Most components make the name a required prop, as [Naming a control](/foundations/accessibility/usage.md#naming-a-control) shows. An icon-only control needs a name and a tooltip, and [Icons](/foundations/icons/reference.md#an-icon-only-control) gives the reason for each.

## A table is a grid

A virtualised list of containers tells a screen reader nothing about being a table, how big it is, or where in it you are. `CTable` carries the outer semantics and `CItemCell` the cells, as [Grid and table roles](/foundations/accessibility/reference.md#grid-and-table-roles) lists. The role is `grid` rather than `table` because the rows are selectable and meant to be navigable.

Two gaps remain, and neither is a decision. `CTable` gives a row no tab stop and tracks no active descendant, so moving between rows arrives through a global command rather than through the grid. And a consumer fills the row slot with its own container, so the cells are grandchildren of the row rather than children, which breaks the ownership the roles describe.

## The count is the dataset

**`aria-rowcount` counts the rows that exist, not the rows on screen.** `aria-rowindex` is a row's position in that same total, rather than among the rows currently rendered.

Virtualisation gets this wrong by default, and it tells somebody they are on row 3 of 20 when they are on row **4,312 of 90,000**. Where the total is genuinely unknown, write `-1` rather than a confident wrong number.

## What a machine catches, and what it does not

**Nineteen** accessibility rules run at error on every template, so a missing keyboard handler or label is a lint failure rather than a review comment. **The rules that check reachability stop at the component boundary**, and [Not trusting a green build](/foundations/accessibility/usage.md#not-trusting-a-green-build) shows what slips through.

Eighteen sites carry a suppression, each with its reason written beside it. Most say the keyboard route exists somewhere the rule cannot see, in a context menu or on a focusable descendant.

Four rules have nothing checking them at all, as [What is enforced](/foundations/accessibility/reference.md#what-is-enforced) lists.
