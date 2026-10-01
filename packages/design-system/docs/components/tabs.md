# Tabs

Two unrelated components carry the tab name. `CTabs` builds a horizontal strip of tab buttons over a panel area from an array of items and a bound value, and it renders a real `role="tablist"` with everything that belongs to one. `CTab` builds a single closable chip that renames itself on double-click, and it is not an ARIA tab at all: it draws one chip and leaves the strip, the roles and the keyboard to whatever lays a row of them out. Plugins, the plugin store detail pane and the Automate session settings use the first. The Replay and Automate tab strips use the second.

This page explains the model. [Usage](/components/tabs/usage.md) shows how to apply each of them, and [Reference](/components/tabs/reference.md) lists the props, events, slots and the DOM they render.

## Why one name covers two components

The two answer different questions. `CTabs` answers which of a known set of panels is showing. `CTab` answers how one entry in an open-ended, renamable, closable row is drawn.

**A tab set is a view switch over a fixed set, and a tab chip is one entry in a working list.** A Replay session strip grows while somebody works, each entry is renamed and closed on its own, and no entry in it owns a panel that `CTabs` could render. A plugin store showing details beside a changelog is the opposite case, and it is two panels behind two buttons.

## What CTabs settles

<Preview
  light="/examples/component-tabs-default-light.svg"
  dark="/examples/component-tabs-default-dark.svg"
  alt="A two tab strip on the raised surface with the first tab active, annotated with the 53 pixel tab height, the 4 pixel page coloured band, the indicator bar and the zero panel padding"
  caption="The shipped configuration: two items, an active indicator and a panel with no padding of its own."
/>

A call site supplies `items` and a bound `value`. The strip height, the padding, the top corners, the band under the row, the indicator, the roving focus and every ARIA attribute come from the component and its preset.

**The caller writes no roles and no identifiers.** `role="tablist"` sits on the row, `role="tab"` with `aria-selected` and `aria-controls` on each button, `role="tabpanel"` with `aria-labelledby` on each panel, tabindex 0 on the active button against -1 on the rest, and ArrowLeft, ArrowRight, Home and End move focus along the row while Enter and Space select the tab that holds it. The identifiers linking a tab to its panel are generated from the component instance.

A tab button measures 53 pixels tall, padding 16 pixels above and below its label against 15.75 pixels either side, so its width comes from the label. The row measures 56 pixels: the 53 pixel button, the 1 pixel it pulls back with a negative bottom margin, and a 4 pixel band of the page colour beneath it.

## When a tab set is the right choice

**Is the set fixed, small, and is each entry a whole panel of content?** Then this is the component. Two to five entries, each named in a word or two, decided when the feature was written rather than by whoever is using it.

Showing one panel also has to hide the others without costing anything. A tab set is a view switch, so nothing behind a hidden tab should need watching while another is open.

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

**The bar on its own could not carry the selected state in the light theme.** `fill-secondary` is a single value with no light and dark pair, so that bar measures 6.47 against the page surface in dark and 2.14 in light. A decorative band beside an underline and a colour change can afford that. The same bar standing alone could not. [Colour](/foundations/colour/usage.md#not-relying-on-colour-alone) owns the wider rule.

The `indicator` prop removes the bar and leaves the other two. Nothing in Caido passes it, so the shipped strip draws all three.

## What CTab is for instead

<Preview
  light="/examples/component-tabs-chip-light.svg"
  dark="/examples/component-tabs-chip-dark.svg"
  alt="Two session chips on the page surface, one with a subtle border and one with the selected border, each holding an icon, a label and a 40 pixel close button"
  caption="The selected chip differs from the resting chip in its border colour and nothing else."
/>

A chip is 32 pixels tall and holds two flush buttons inside a 1 pixel border: the label button, which grows to fill the chip and emits `select`, and a close button fixed at 40 pixels. The label takes an optional icon in front of it and an optional `prefix` slot after that, which Replay fills with status avatars and a tag.

**Selecting a chip changes the colour of its 1 pixel border and nothing else.** Both inner buttons keep the page surface whether the chip is selected or not, so the selected state rests on `line-selected`, which measures 7.47 against the page surface in dark and 5.51 in light.

Double-click swaps the label for a focused text field. That is an accelerator with no keyboard equivalent, so each of the three call sites also offers Rename in a context menu, which is what [accessibility](/foundations/accessibility/usage.md#giving-a-double-click-a-second-route) requires of a double-click.

## What the pattern costs

**A `CTabs` mounts each of its panels on the first render.** The component passes no lazy flag, so the component library renders all the panels and hides the inactive ones with `display: none`. A panel that is expensive to build pays for itself even when nobody opens it, which is why the plugin store detail wraps both of its panel bodies in a check on the active identifier.

The strip scrolls horizontally with no affordance at all. The scrolling container hides its scrollbar, and the previous and next buttons in the preset need a scrollable flag the component never passes, so a row wider than its container gives no sign of it.

The tab list also cannot be named. An `aria-label` from a call site is forwarded onto the outer container rather than onto the `role="tablist"` element, so it does not name the list to a screen reader.

A `class` on `CTabs` never reaches the DOM, and `CTab` is the exact opposite: it forwards everything, including `class` and `style`. That split is the [component contract](/foundations/components.md#presentation-is-blocked-identity-is-not) rather than anything particular to tabs, and [Usage](/components/tabs/usage.md#sizing-a-tab-set) shows what to write on each.

## One size and one colour scheme

Neither component imports the shared size union or the shared severity union, and neither declares a `size`, `severity`, `variant` or `disabled` prop. What varies on a `CTabs` is which tab is active. What varies on a `CTab` is whether it is selected, whether it is being renamed, and whether an icon or a prefix is present.

The preset does define a dimmed disabled tab and a pair of scroll buttons, and no route through either component reaches them, because the item type carries no disabled field and the scrollable flag is never passed.
