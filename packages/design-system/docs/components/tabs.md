# Tabs

Two unrelated components carry the tab name. `CTabs` builds a real `role="tablist"` strip over a panel area from an array of items and a bound value. `CTab` builds a single closable chip that renames itself on double-click, and it is not an ARIA tab at all: the strip, the roles and the keyboard belong to whatever lays a row of them out.

This page explains the model. [Usage](/components/tabs/usage.md) shows how to apply each of them, and [Reference](/components/tabs/reference.md) lists the props, events, slots and the DOM they render.

## Why one name covers two components

**A tab set is a view switch over a fixed set, and a tab chip is one entry in a working list.** A plugin store showing details beside a changelog is two panels behind two buttons, so it uses `CTabs`. A Replay session strip grows while somebody works, each entry is renamed and closed on its own, and no entry owns a panel, so it uses `CTab`.

## What CTabs settles

<Preview
  light="/examples/component-tabs-default-light.svg"
  dark="/examples/component-tabs-default-dark.svg"
  alt="A two tab strip on the raised surface with the first tab active, annotated with the 53 pixel tab height, the 4 pixel page coloured band, the indicator bar and the zero panel padding"
  caption="The shipped configuration: two items, an active indicator and a panel with no padding of its own."
/>

A call site supplies `items` and a bound `value`. The strip geometry, the indicator, the roving focus and the arrow key handling come from the component and its preset, and a tab's width comes from its label.

**The caller writes no roles and no identifiers.** [CTabs DOM and ARIA](/components/tabs/reference.md#ctabs-dom-and-aria) lists what the component renders, and [Measurements](/components/tabs/reference.md#measurements) gives the sizes.

## When a tab set is the right choice

**Is the set fixed, small, and is each entry a whole panel of content?** Then this is the component: two to five entries, each named in a word or two, decided when the feature was written. Nothing behind a hidden tab should need watching while another is open.

## When something else fits better

| Instead of | Reach for |
|---|---|
| Switching one value rather than a panel of content | [Segmented](/components/segmented.md) |
| A set that grows while somebody works | `CTab`, laid out by the call site |
| A set that outgrows the row it sits in | [Select](/components/select.md) |
| Panels that all have to stay on screen at once | A splitter, or a stacked layout |

## Selection is said three ways at once

<Preview
  light="/examples/component-tabs-indicator-light.svg"
  dark="/examples/component-tabs-indicator-dark.svg"
  alt="The same two tab strip with the indicator switched off, so the page coloured band is bare and the active tab is marked by its underline and label colour alone"
  caption="With the indicator off the band stays and the bar does not."
/>

An active tab moves its label to `fg-secondary`, changes its 1 pixel bottom border to `line-secondary`, and carries a 4 pixel bar of `fill-secondary` under it inside the page-coloured band.

**The bar on its own could not carry the selected state in the light theme**, where it measures 2.14 against the page surface. Beside an underline and a colour change it can afford that, as [Contrast](/components/tabs/reference.md#contrast) shows and [Colour](/foundations/colour/usage.md#not-relying-on-colour-alone) explains.

The `indicator` prop removes the bar and leaves the other two.

## What CTab is for instead

<Preview
  light="/examples/component-tabs-chip-light.svg"
  dark="/examples/component-tabs-chip-dark.svg"
  alt="Two session chips on the page surface, one with a subtle border and one with the selected border, each holding an icon, a label and a 40 pixel close button"
  caption="The selected chip differs from the resting chip in its border colour and nothing else."
/>

A chip holds two flush buttons inside a 1 pixel border: the label button, which grows to fill the chip, and a close button. The label takes an optional icon and an optional `prefix` slot, which Replay fills with status avatars and a tag.

**Selecting a chip changes the colour of its border and nothing else**, so the selected state rests on `line-selected` alone.

Double-click swaps the label for a focused text field. It has no keyboard equivalent, so each call site also offers Rename in a context menu, as [accessibility](/foundations/accessibility/usage.md#giving-a-double-click-a-second-route) requires.

## What the pattern costs

**A `CTabs` mounts each of its panels on the first render** and hides the inactive ones, so a panel that is expensive to build pays for itself even when nobody opens it. [Guarding a panel](/components/tabs/usage.md#guarding-a-panel-that-costs-something) shows the fix.

A row wider than its container scrolls with no scrollbar and no buttons, so it gives no sign of it. The tab list also cannot be named, because a forwarded `aria-label` lands on the outer container rather than on the tab list.

A `class` on `CTabs` never reaches the DOM, and `CTab` forwards everything. That split is the [component contract](/foundations/components.md#presentation-is-blocked-identity-is-not), and [Usage](/components/tabs/usage.md#sizing-a-tab-set) shows what to write on each.

## One size and one colour scheme

Neither component takes a `size`, `severity`, `variant` or `disabled` prop, as [Vocabulary](/components/tabs/reference.md#vocabulary) records. What varies on a `CTabs` is which tab is active. What varies on a `CTab` is whether it is selected, whether it is being renamed, and whether an icon or a prefix is present.
