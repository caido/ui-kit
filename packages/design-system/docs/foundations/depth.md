# Depth

Depth answers two separate questions.

**Does this thing float?** That is elevation, and it is drawn with a background step and a border.

**What does it sit above?** That is layering, and it is drawn with one of ten named layers.

This page explains the model. [Usage](/foundations/depth/usage.md) shows how to apply it, and [Reference](/foundations/depth/reference.md) lists every layer and value.

## There are no shadows

The token package clears the shadow scale, and defines no shadow value to put back. Depth is drawn with a surface step and a 1px line instead, in both appearances.

The preset still writes `shadow-md` and `shadow-lg` on roots such as the card, the drawer and the tooltip. Those classes now paint nothing, and nothing reports it, as [What does not exist](/foundations/depth/reference.md#what-does-not-exist) records.

## Two positions, not a ladder

A surface is either in the page or above it. There is no third position. `surface-page` and `surface-subtle` rest in the page, and `surface-raised` floats above it, as [Surfaces available for depth](/foundations/depth/reference.md#surfaces-available-for-depth) lists.

Elevation is not a scale and does not get one. If something looks like it needs a third step, it is either a floating surface opening over another floating surface, which is a layering question, or it is a state. A row does not become elevated by being hovered.

## Two surfaces that touch are never the same step

This is the rule that rejects the most designs. Two surfaces painted the same colour measure 1 to 1 in either appearance, so they have no separation at all.

It catches a case that looks harmless: a floating panel whose header or footer repaints the resting colour, so the panel arrives in two colours with a seam through it.

## A floating surface takes a border as well

The step on its own is not enough. `surface-raised` against `surface-page` measures only **1.20 to 1**, which shows along a long straight edge but not around a small menu opening over a busy table. The border, `line-default`, roughly doubles that separation. [Measured separation](/foundations/depth/reference.md#measured-separation) gives every ratio.

## Why that border and not the other two

`line-subtle` is the rule *inside* a panel, the divider between two rows. Using it for the edge *of* a panel puts two meanings on one value, and it is weaker.

`line-strong` was measured and rejected. It is the one neutral line clearing the 3 to 1 non-text floor, but that floor applies where colour is the only thing identifying a control. A menu is identified by the items inside it, not by its edge.

## Layering is ten names

Once something floats, the question becomes what it sits above, and that is a layer. The ten layers split into two groups, which is why the numbers jump rather than counting up.

**The first four order siblings.** `below`, `base`, `raised` and `sticky` order elements inside one panel. If two elements can never meet on screen, they belong on the same layer.

**The last six order the page.** `overlay`, `scrim`, `spotlight`, `floating`, `detached` and `cover`. An element on one of these has left its panel behind and competes with everything else on screen.

**Everything the component library opens shares one layer**, `floating`, and order within it is the order things opened. That is the correct behaviour: a menu opened from a dialog has to clear that dialog, and any rule putting menus above dialogs in general then has to explain the reverse case.

[The layers](/foundations/depth/reference.md#the-layers) lists what belongs on each one.
