# States

A state is how a component says what is happening to it. Hovered, selected, focused, invalid, disabled.

This page explains the model. [Usage](/foundations/states/usage.md) shows how to apply it, and [Reference](/foundations/states/reference.md) lists every state, the property it owns and the token it uses.

## A state owns a property

**A state owns a property, and no two states that can co-occur own the same one.**

This is not a consistency rule. It is what makes states compose without anybody arbitrating between them.

A table row can be striped, coloured by the user, hovered and selected at the same time. If three of those paint a background, the last one to paint wins and the rest are invisible. Giving each its own property fixes that, and any combination then simply works.

So hover owns `background-color`, focus owns `outline`, invalid owns `border-color` and disabled owns `opacity`. Active lays a translucent wash over the background rather than replacing it, so a pressed control shows hover as well. [What each state owns](/foundations/states/reference.md#what-each-state-owns) lists every state with its token.

## Selected takes whatever the surface has spare

There is no single treatment for selected, because the property that is free to carry it is not the same on every surface.

**The identifier is whichever property the surface has spare, and it has to clear 3 to 1 on its own.** A tree row's background is already carrying the stripe, so identification moves to a leading edge in `line-selected`. [Selected, by surface](/foundations/states/reference.md#selected-by-surface) lists each surface.

The sidebar item and the menu item are the exception. Their background, `surface-selected`, falls well under what an identifier owes, so it works together with a step up in text colour. That is a pair of weak signals rather than one strong one, and it is the weakest place in the set as it stands.

## What happens when states combine

Usually all of them show at once. Three cases need more.

**The user beats the system.** A row's background is either the colour a user gave it or the stripe. The user's colour wins, because one is data somebody set deliberately and the other is decoration the system applied.

**Hover composes rather than replaces.** Hover has to stay visible on a row the user has coloured, so on a surface that can carry data it is a translucent wash.

**Disabled goes last.** An opacity multiplies whatever the element already resolved to, so it works on top of every other state. It is also why no other state is drawn with an opacity.

## Every state has to look different from every other

Each state has to be distinguishable from every other state on the same component. Three consequences follow.

**Current and selected are the same idea on different surfaces.** Both mean "this one", and nothing is ever both: a sidebar entry is current, a row is selected. The distinction that matters lives in the markup, where a screen reader needs it, not in the paint.

**Read-only has no appearance, and that is the answer rather than a gap.** It keeps full contrast and loses only the affordance for editing. What separates it from disabled is behaviour.

**Locked is not disabled.** Both used to dim, and two states that both dim are one state as far as anybody can tell. Locked is the lock glyph and its tooltip; the opacity belongs to disabled alone.
