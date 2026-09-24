# States

A state is how a component says what is happening to it. Hovered, selected, focused, invalid, disabled.

This page explains the model. [Usage](/foundations/states/usage.md) shows how to apply it, and [Reference](/foundations/states/reference.md) lists every state, the property it owns and the token it uses.

The whole page rests on one rule, and it is stronger than it first sounds.

## A state owns a property

**A state owns a property, and no two states that can co-occur own the same one.**

Read quickly that looks like a consistency rule: pick a treatment and use it everywhere. It is not. It is what makes states compose without anybody arbitrating between them.

A table row is the proof. It can be striped, coloured by the user, hovered and selected at the same time. If three of those paint a background, the last one to paint wins and the rest are invisible. Making them consistent does not fix that. Making them own different properties does.

Once each state owns its own property, any combination of them simply happens, and "what do these two do together" stops being a question anyone answers per pair.

| State | Owns | Value |
|---|---|---|
| Rest | | the surface the component sits on |
| Hover | `background-color` | `surface-hover` |
| Active | `background-image` | `fg-strong` at 20%, laid over what is already there |
| Selected or current | whichever property the surface has spare | see below |
| Focus | `outline` | `line-focus`, 2px, offset 2px |
| Invalid | `border-color` | `line-danger` |
| Disabled | `opacity` | `opacity-disabled` |
| Locked | `color` and an icon | a lock glyph and its tooltip |
| Loading | the content | a skeleton or a spinner |
| Read-only | nothing | it is a behaviour, not a look |

Hover and active both act on the background, and they do not contest it. Hover sets `background-color`; active lays a translucent `fg-strong` wash over whatever is already there, so a control that is pressed shows both at once rather than one replacing the other.

## Selected takes whatever the surface has spare

There is no single treatment for selected, because the property that is free to carry it is not the same on every surface.

| Surface | Identifier | Emphasis |
|---|---|---|
| Tree row | `line-selected`, a leading edge | `fg-strong` at 20%, as a wash |
| Tab | `line-selected`, on the tab border | `fg-secondary` |
| Sidebar item | `surface-selected` | `fg-secondary` |
| Table row | `line-selected`, a leading edge | `fg-strong` at 20%, as a wash |
| Menu item | `surface-selected` | `fg-strong` |

Three of those surfaces move identification to an edge, and one sentence holds them: **the identifier is whichever property the surface has spare, and it has to clear 3 to 1 on its own.** A tree row's background is already carrying the stripe, so identification moves to the leading edge, where `line-selected` measures 3.81 at worst against the system surfaces a row can be. A colour somebody set sits outside that set, which is why a selected row carries the wash as well as the edge.

The sidebar item and the menu item work differently, and it is worth being exact about why. `surface-selected` measures 1.44 against the page, well under what an identifier owes, so the background is not carrying identification there on its own. It is doing it together with the step up in text colour. That is a pair of weak signals rather than one strong one, and it is the weakest place in the set as it stands.

## What happens when states combine

Because each state owns a property, the answer is usually all of them at once. Three cases need more.

**The user beats the system.** A row's background is either the colour a user gave it or the stripe. The user's colour wins, because one is data somebody set deliberately and the other is decoration the system applied.

**Hover composes rather than replaces.** Hover has to stay visible on a row the user has coloured, so it cannot be an opaque fill that covers one. On a surface that can carry data it is a translucent wash layered over whatever the background already holds.

**Disabled goes last.** An opacity multiplies whatever the element already resolved to, which is exactly what a state needs if it has to work on top of every other one. It is also why no other state is drawn with an opacity.

## Every state has to look different from every other

The list is not finished until each state is distinguishable from every other state on the same component. Three consequences.

**Current and selected are the same idea on different surfaces.** Both mean "this one", and nothing is ever both: a sidebar entry is current, a row is selected. The distinction that matters lives in the markup, where a screen reader needs it, not in the paint.

**Read-only has no appearance, and that is the answer rather than a gap.** It keeps full text contrast, stays focusable, stays selectable, and loses only the affordance for editing. What separates it from disabled is behaviour, and the behaviour is the important half.

**Locked is not disabled.** Both used to dim, and two states that both dim are one state as far as anybody can tell. Locked is the lock glyph and its tooltip; the opacity belongs to disabled alone.
