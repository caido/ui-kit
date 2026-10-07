# Using depth

How to raise a surface and place it in the stack. For the model behind these rules, see [Overview](/foundations/depth.md). For every layer and value, see [Reference](/foundations/depth/reference.md).

## Deciding whether it floats at all

Ask this before reaching for anything.

**A panel, a card, a section and an inline list do not float.** They sit in the page and are separated by the layout around them. Take `surface-page` for the region itself and `surface-subtle` for a quieter area inside it, such as the track a meter fills.

A thing floats when it opens over content and can be dismissed: a menu, a popover, a dialog, a drawer, a toast, a tooltip. Giving the floating treatment to anything else is the most common way this goes wrong.

## Raising a surface

Two properties together, never one alone.

```vue
<template>
  <div class="[[bg-surface-raised]] [[border border-line-default]] rounded">
    <slot />
  </div>
</template>
```

The step says it is above the page, and the border gives it an edge wherever it lands.

<DoDont image="float">
  <template #do>
    <p>There is a line where the marker points, so the menu has a shape. The edge holds wherever it lands.</p>
  </template>
  <template #dont>
    <p>Nothing is there. At the surface step alone the menu runs into the table behind it and you cannot see where one stops.</p>
  </template>
</DoDont>

Do not change anything else on the way up. Raising a surface changes only its background step and whether it has a border.

## Picking a layer

Start from whether the thing has left its panel.

**Still inside one panel?** Use the first four. `below` for something that draws underneath its own content, `base` for ordinary content, which needs no class written at all, `raised` for something lifted above its siblings, `sticky` for a header that stays put while its container scrolls.

**Competing with the whole page?** Use the last six. `overlay` floats over one panel, `scrim` dims the page, `spotlight` is the one thing a scrim isolates, `floating` is everything the component library opens, `detached` is a surface placed outside the element it belongs to when that element can itself be floating, `cover` replaces the application.

**Opened by the component library?** You do not choose. It is already on `floating`.

## Never writing a number

```vue
<template>
  <aside class="sticky top-0 [[z-sticky]]">
    <slot />
  </aside>
</template>
```

`z-10` and `z-50` are the same mistake at different heights. A number says what won this time, not what the thing is, so the next person has no way to know what they are competing with. The numeric classes still compile, so this is a rule to follow rather than something the build catches.

If no layer name fits, that is a missing layer rather than a reason for a number, and it is worth raising.

## Dimming the page around one thing

**A scrim and the thing it isolates are two layers, not one.** The scrim dims the page on `scrim`, and the element being worked on goes on `spotlight` so it stays readable above it. On one shared layer, the scrim either covers the thing it was meant to isolate or fails to cover anything else.

## Using a shadow as a mask

A shadow that fades content out at the edge of a scrolling region is a mask rather than a depth, and the rule against shadows does not reach it.

The shadow scale is cleared, so a mask is written as an escape with a reason. Name the mask in that reason, so the next person does not take it for an elevation that got past the rule.

## Reading depth from script

A value copied into script drifts the moment the layer moves, and nothing reports it. Read the layer from the token package instead, the way the configuration the application hands the component library does.
