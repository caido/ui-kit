# Depth

Depth answers two separate questions, and keeping them apart is most of this page.

**Does this thing float?** That is elevation, and it is drawn with a background step and a border.

**What does it sit above?** That is layering, and it is drawn with one of ten named layers.

This page explains the model. [Usage](/foundations/depth/usage.md) shows how to apply it, and [Reference](/foundations/depth/reference.md) lists every layer and value.

## There are no shadows

The token package clears the shadow scale, and defines no shadow value to put back. Depth is drawn with a surface step and a 1px line instead, in both appearances.

The consequence is worth knowing before you hit it. The preset still writes `shadow-md` and `shadow-lg` on roots such as the card, the drawer and the tooltip. Those classes read a scale that is now empty, so they paint nothing, and nothing reports it. [The stock type classes](/foundations/type/reference.md#what-the-roles-replace) fail differently, by resolving to a role nobody chose.

## Two positions, not a ladder

A surface is either in the page or above it. There is no third position.

| Surface | Token | Position |
|---|---|---|
| The application background | `surface-page` | Resting |
| A quieter region inside a page | `surface-subtle` | Resting |
| Anything sitting above the page | `surface-raised` | Floating |

`surface-hover` and `surface-selected` sit above `surface-raised` on the ramp but are not available for depth, because they are states. A row does not become elevated by being hovered.

Elevation is not a scale and does not get one. If something looks like it needs a third step, it is either a floating surface opening over another floating surface, which is a layering question rather than a depth one, or it is a state.

## Two surfaces that touch are never the same step

This is the rule that rejects the most designs.

A panel painted the same colour as the thing behind it has no separation of its own. Not a weak one, none: the two surfaces measure 1 to 1 in either appearance. If two surfaces meet, they are different steps.

It catches a case that looks harmless: a floating panel whose header or footer repaints the panel background. The root is raised, the subsection paints the resting colour, and the panel arrives in two colours with a seam through it.

## A floating surface takes a border as well

The step on its own is not enough, and the reason is arithmetic.

`surface-raised` against `surface-page` measures **1.20 to 1 in light and in dark**. That is a difference you can see along a straight edge running the width of a panel. It is not one you can rely on around a small menu opening on top of a busy table.

The border is `line-default`, at **2.06 light and 2.03 dark** against the page.

## Why that border and not the other two

`line-subtle` is the rule *inside* a panel, the divider between two rows. Using it for the edge *of* a panel puts two meanings on one value, and it is measurably weaker at 1.67 and 1.66 against the page.

`line-strong` was measured and rejected. At **3.16 and 3.11** it is the one neutral line clearing the 3 to 1 non-text floor, which looks like an argument for it until you read what that floor is for. It applies where colour is the only thing identifying a control, and a line between two panels identifies nothing. A menu is identified by the items inside it.

## Layering is ten names

Once something floats, the question becomes what it sits above, and that is a layer.

The ten layers split into two groups, which is why the numbers jump rather than counting up.

**The first four order siblings.** `below`, `base`, `raised` and `sticky` order elements inside one panel. If two elements can never meet on screen, they belong on the same layer.

**The last six order the page.** `overlay`, `scrim`, `spotlight`, `floating`, `detached` and `cover`. An element on one of these has left its panel behind and competes with everything else on screen.

**Everything the component library opens shares one layer.** The application points all four of the groups the library exposes, `menu`, `overlay`, `modal` and `tooltip`, at `floating`, so a menu, a select, a popover, a dialog, a drawer, a toast and a tooltip all open there. Order within the layer is the order things opened. That is the correct behaviour: a menu opened from a dialog has to clear that dialog, and any rule putting menus above dialogs in general then has to explain the reverse case.

[Reference](/foundations/depth/reference.md#the-layers) lists what belongs on each one.
