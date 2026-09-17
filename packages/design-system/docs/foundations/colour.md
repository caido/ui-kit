# Colour

Colour in Caido carries meaning. It separates a panel from the page behind it, marks a destructive action, and tells you which request in a table you are looking at.

Because it carries meaning, you do not pick it by eye. You pick a token that says what the colour is for. [Tokens](/foundations/tokens/index.md) covers how those names are built and how they resolve.

## Colour anatomy

There are two kinds of colour in the system.

Neutral colours build the interface itself. Backgrounds, panels, borders, body text. They carry no meaning on their own, and most of what you see on screen is neutral.

Intent colours say something. There are six, and each one has a single job: primary for the main action, danger for something destructive, warn for something risky, success for something that worked, info for something neutral worth noticing, and secondary for the brand accent.

The neutral ramp below is the same fourteen jobs in both themes. A step holds its job in each, which is why one token name works everywhere.

<SwatchPair family="neutral" jobs />

## Applying colour with tokens

Every colour token starts with the property it applies to, followed by the meaning.

```vue
<template>
  <div class="border border-line-subtle bg-surface-raised text-fg-default">
    <CButton class="bg-fill-danger text-fg-on-danger">Delete</CButton>
  </div>
</template>
```

None of those names contain a colour or a number. They say raised panel, default text, subtle border, danger fill. The value behind each changes between light and dark, and the markup never does.

This is why raw values are rejected. A hex code or a Tailwind colour like `bg-red-500` cannot follow the appearance, so it will be wrong in one of the two themes.

<DoDont image="token">
  <template #do>
    <p>Use a token that names the meaning. The value follows the theme.</p>
  </template>
  <template #dont>
    <p>Write a hex value or a stock Tailwind colour.</p>
  </template>
</DoDont>

## Colour roles

Four roles cover every colour token. The role tells you where the colour is allowed to go.

`surface` is for backgrounds. The page, a raised panel, a hovered row.

<TokenSwatches prefix="color.surface" />

`line` is for borders and dividers.

<TokenSwatches prefix="color.line" />

`fill` is for blocks that are entirely one colour, like a solid button or a status meter.

<TokenSwatches prefix="color.fill" />

`fg` is for text and icons.

<TokenSwatches prefix="color.fg" />

If you are unsure which role you need, ask what the colour is doing. A panel behind content is a surface. A line between two things is a line. A block that is entirely one colour is a fill. Anything you read is a foreground.

For the value each of these resolves to in either theme, see [all tokens](/foundations/tokens/all.md).

## Emphasis

Inside a role, tokens step from subtle to strong. Use the step that matches how much attention the element deserves.

For text, `fg-muted` is for something barely worth reading, `fg-subtle` for supporting text, `fg-default` for body text, and `fg-strong` for text that needs weight.

The same idea runs through the other roles. `line-subtle` separates things that belong together, and `line-strong` marks a boundary that has to be noticed on its own.

Reaching for the strongest step everywhere removes the hierarchy that emphasis exists to create.

## Text on a solid fill

When text sits on a `fill`, it does not take an `fg` step. It takes the matching `fg-on-*` token.

```vue
<template>
  <CButton class="bg-fill-primary text-fg-on-primary">Save</CButton>
</template>
```

These are separate tokens because the colour that reads on a solid is decided by that solid, not by the text ladder. Each one is calculated against its fill and against that fill's hover, so a single label works in both states.

<DoDont image="oncolour">
  <template #do>
    <p>Pair a fill with its matching <code>fg-on-*</code> token.</p>
  </template>
  <template #dont>
    <p>Put a normal foreground on a fill. It is not measured against that background.</p>
  </template>
</DoDont>

## Accessibility

Caido meets WCAG AA contrast ratios.

Text clears 4.5 to 1, from criterion 1.4.3.

Anything that is not text clears 3.0 to 1, from criterion 1.4.11, and only when colour is the only thing identifying it. A button with a visible label is identified by that label, so the rule does not apply to its fill.

<ContrastPair foreground="fg-default" background="surface-page" />
<ContrastPair foreground="fg-subtle" background="surface-raised" />

Every foreground is measured against every surface it is approved for, in both themes, on every build. A ratio is never rounded up, so 4.48 fails.

Which surfaces a foreground is approved for is part of the rule, and this is where a pairing usually goes wrong.

Text on a page or a panel can use any foreground. Text on a component background, like a hovered or selected row, uses `fg-default` or `fg-strong` only. Those surfaces sit higher up the ramp, so the muted steps run out of room against them.

<ContrastPair foreground="fg-muted" background="surface-selected" />

That pairing is never checked, because it is not one the system approves. Reading it against the text floor shows why.

If you pair a foreground and a background the system does not already check, measure it before you ship it.

## Do not rely on colour alone

Colour should confirm meaning, not carry it by itself. Someone who cannot separate two hues still needs to read the interface.

Pair colour with a label, an icon, or a position.

<DoDont image="alone">
  <template #do>
    <p>Back the colour with a word or an icon that says the same thing.</p>
  </template>
  <template #dont>
    <p>Leave a coloured dot as the only signal of what happened.</p>
  </template>
</DoDont>

This is also why request methods are not colour coded. Nine verbs in a table whose rows already carry the user's own highlight colours would put two unrelated colour systems on one surface, and the method is already written in the row.

## Light and dark

Every token has a light value and a dark value. You write one name, and the theme decides which value appears.

A step keeps its job across both themes rather than its lightness. The raised surface is a light grey in the light theme and a dark grey in the dark theme, and it is the same token in both.

This means you never write a theme conditional for colour. If you find yourself checking the theme in a component, the token you need probably exists already.
