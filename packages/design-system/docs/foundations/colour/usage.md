# Using colour

How to pick and apply a colour token. For the model behind these rules, see [Overview](/foundations/colour.md). For the full list of names and values, see [Reference](/foundations/colour/reference.md).

## Picking a token

Three questions, in order.

**What is the colour doing?** Sitting behind content is `surface`, drawing a boundary is `line`, filling a shape is `fill`, being read is `fg`. That gives you the [role](/foundations/colour.md#the-four-roles).

**Does it mean anything?** If it does not, stay neutral. If it marks something destructive, risky, successful or worth noticing, use that intent. If the user picked it, or it only separates categories, use an accent. See [three kinds of colour](/foundations/colour.md#three-kinds-of-colour).

**How much attention does it deserve?** That picks the [step](/foundations/colour.md#what-a-step-is), from subtle through to strong.

## Writing a colour class

Every colour token starts with the property it applies to, followed by the meaning.

```vue
<template>
  <div class="border border-line-subtle bg-surface-raised text-fg-default">
    <span class="[[bg-fill-danger-strong]] [[text-fg-on-danger]] rounded px-2 py-1">Delete</span>
  </div>
</template>
```

None of those names contain a colour or a number. They say raised panel, default text, subtle border, danger fill.

The two highlighted names are a pair. `bg-fill-danger-strong` is the solid, and `text-fg-on-danger` is the only foreground measured against it.

## Never writing a raw value

A hex code or a stock Tailwind colour such as `bg-red-500` cannot follow the appearance, so it will be wrong in one of the two themes.

<DoDont image="token">
  <template #do>
    <p>Use a token that names the meaning. The value follows the theme.</p>
  </template>
  <template #dont>
    <p>Write a hex value or a stock Tailwind colour.</p>
  </template>
</DoDont>

## Putting text on a solid fill

Pair the fill with its matching `fg-on-*` token rather than reaching into the `fg` ladder. [Why text on a fill is different](/foundations/colour.md#why-text-on-a-fill-is-different) explains the reason.

The four status intents carry two steps, and which one you take depends on whether a label sits on the fill.

| Fill | Take | Floor |
|---|---|---|
| A block with a label on it | `fill-danger-strong`, `fill-warn-strong`, `fill-success-strong`, `fill-info-strong` | 4.5, the text floor |
| A block with no text on it, like a meter or a bar | `fill-danger`, `fill-warn`, `fill-success`, `fill-info` | 3.0, the non-text floor |

Three of those fills fall short of that second floor in the light appearance. Warn measures 2.80 and success 2.85 against a subtle track, info measures 2.50 against the page, and all three are recorded as accepted exceptions. `fill-danger` is not registered as a pairing at all, so measure it yourself before you paint it on a new surface.

Primary, secondary and neutral have no `-strong` variant, because each already clears 4.5 with its own `fg-on-*` label: white on primary at 7.55, near-black on secondary at 7.55, and black on neutral at 5.25. Neutral carries a second, quieter fill in `fill-neutral-subtle`, which takes `fg-on-neutral-subtle` rather than `fg-on-neutral`.

```vue
<template>
  <span class="[[bg-fill-success-strong]] [[text-fg-on-success]] rounded px-2 py-1">Saved</span>
</template>
```

<DoDont image="oncolour">
  <template #do>
    <p>Pair a fill with its matching <code>fg-on-*</code> token.</p>
  </template>
  <template #dont>
    <p>Put a normal foreground on a fill. It is not measured against that background.</p>
  </template>
</DoDont>

## Putting text on a highlighted row

Use `fg-strong`, in every one of the nine highlight colours.

`fg-default` clears the contrast floor on three of the nine and fails the other six, so it is not a choice you can make per colour. All nine are listed in [Reference](/foundations/colour/reference.md#row-highlights).

<DoDont image="highlight">
  <template #do>
    <p>Put <code>fg-strong</code> on a highlighted row, in every one of the nine colours.</p>
  </template>
  <template #dont>
    <p>Drop to a lighter foreground because it looks calmer on one of them.</p>
  </template>
</DoDont>

## Choosing between an intent and an accent

Ask whether the colour could be swapped for another without changing what the interface means.

If it could, it is an accent. A user tagging three requests in different colours is organising their own work, and nothing breaks if red and blue trade places.

If it could not, it is an intent. A failed request is red because red means failure, and turning it green would be wrong.

<DoDont image="accent">
  <template #do>
    <p>Use accents for rows a user has marked, where the colour is their choice.</p>
  </template>
  <template #dont>
    <p>Use an accent where the colour carries status. That is what the intents are for.</p>
  </template>
</DoDont>

## Colouring a workflow node

Nodes in the workflow editor are coloured by what kind of node they are, which is categorisation rather than status.

A node border is a stroke on a canvas rather than a background for text, so three of the four darken in the light theme rather than moving toward a tint. The start and end colour is the brand gold and holds one value in both. The categories are listed in [Reference](/foundations/colour/reference.md#workflow-node-categories).

**A glyph drawn on a node takes `workflow-node-fg`.** A stroke carries no glyph, so nothing about these colours was solved for one, and three screens reuse them as a fill behind an icon anyway. Every node colour is mid to light in both appearances, which leaves a foreground that moves with the theme nowhere to go: `fg-strong` clears the 3 to 1 floor on the four light tiles and fails all four dark ones, and `fg-default` clears one pairing out of the eight. One fixed dark value clears all eight, worst 3.38.

## Colouring a medal and other fixed marks

Gold, silver and bronze are not a free choice. They are recognised by their colour, and repainting them removes the only thing they carry, so their hue is fixed in both themes.

Their lightness is not fixed. Canonical bronze measures 2.43 against the light raised surface, which is under the [floor](/foundations/colour.md#contrast-and-accessibility), so the light value is darkened until it reaches 6.10. The pairing is registered against `surface-raised` rather than the page, because that is where a medal is drawn. The values are in [Reference](/foundations/colour/reference.md#medal-colours).

The foreground roles hold their colour back so small text stays legible. An icon that carries meaning through its colour, like a medal, does not have that problem, and flattening it with a rule written for text would remove the point of it. So an icon like this takes its own token, `text-medal-gold`, `text-medal-silver` or `text-medal-bronze`, rather than a foreground step.

<DoDont image="medal">
  <template #do>
    <p>Keep the rank written next to the medal, so the colour confirms it rather than carries it.</p>
  </template>
  <template #dont>
    <p>Leave three coloured discs to say first, second and third on their own.</p>
  </template>
</DoDont>

## Not relying on colour alone

Colour should confirm meaning, not carry it by itself. Someone who cannot separate two hues still needs to read the interface, so pair colour with a label, an icon, or a position.

<DoDont image="alone">
  <template #do>
    <p>Back the colour with a word or an icon that says the same thing.</p>
  </template>
  <template #dont>
    <p>Leave a coloured dot as the only signal of what happened.</p>
  </template>
</DoDont>

Check the accents first. The user picked the colour, it carries no label of its own, and it is where a coloured dot is most likely to end up standing alone.

## Leaving the focus ring alone

The focus ring is drawn once for the whole interface, by a single rule keyed on `:focus-visible`. You do not add it, and the `:focus-visible` part means it does not fire on a mouse click.

Two cases move that ring rather than drawing it on the element holding focus, and both are already written. A checkbox, a radio and a toggle cover themselves with a transparent input, where an outline would paint nothing, so the ring is drawn on that input's siblings with the same geometry. A widget that keeps focus on its container and names the item with `aria-activedescendant` takes the container ring off and redraws it on the focused item at a negative offset, because the item has no gap around it to sit in. In both the indicator moves rather than disappears.

The thing to avoid is removing it. `outline: none` on a control, or a style that paints over the ring, takes the interface away from anyone navigating by keyboard. If a ring is in the wrong place rather than unwanted, move it with `outline-offset` and leave it drawn.

## Measuring an unchecked pairing

[Approved pairings](/foundations/colour.md#contrast-and-accessibility) are measured on every validation run. Anything else is not, and the widget below measures one that is not: `fg-muted` on `surface-selected` reaches 3.86 against a 4.5 floor, which is why that combination was never approved.

<ContrastPair foreground="fg-muted" background="surface-selected" />

If you need a pairing the system does not already approve, measure it before you ship it, against both themes, and do not round the result up.
