# Using tokens

How to find a token and write it. For the model behind these rules, see [Overview](/foundations/tokens.md). For the grammar, the counts and the contrast floors, see [Reference](/foundations/tokens/reference.md). For every name and value, see [All tokens](/foundations/tokens/all.md).

## Finding the token you need

Start from the property you are setting, not from the colour you have in mind.

**Which property is it?** A background, a border, a solid block, or text. That picks the role: `surface`, `line`, `fill`, `fg`. For anything that is not colour, the namespace is the property family: `text` for type, and a rung of the spacing ladder for padding and gaps.

**Does it mean anything?** If not, stay neutral. If it marks something destructive, risky, successful or worth noticing, take that intent.

**How much attention does it deserve?** That picks the emphasis, from `subtle` through `default` to `strong`.

Three answers give you a name. A background, neutral, raised clear of the page is `bg-surface-raised`.

If you cannot answer the first question, the problem is usually the element rather than the token. A thing that is both a border and a background is two elements.

## Writing a token

Write the utility class. The value follows the theme with no further work.

<DoDont>
<template #do>

```vue
<div class="[[bg-surface-raised]]">
  <p class="[[text-fg-default]]">Ready</p>
</div>
```

Each name says what the value is for. The theme decides the value.

</template>
<template #dont>

```vue
<div style="background: [[#2f2c29]]">
  <p style="color: [[#e8e5e0]]">Ready</p>
</div>
```

Fixed values cannot follow the theme, so this is wrong in one of the two.

</template>
</DoDont>

None of the names on the left contain a colour, a number, or a theme. They say raised panel and default foreground, and the same two names work in both appearances.

## Picking the right step of a fill

A fill that carries a label is text, so it has to clear the text contrast floor. The four status intents carry a `-strong` step for exactly that.

<DoDont>
<template #do>

```vue
<div class="[[bg-fill-danger-strong]]">
  <p class="text-fg-on-danger">Delete</p>
</div>
```

Measures 5.89 in light and 7.10 in dark, clearing the 4.5 floor.

</template>
<template #dont>

```vue
<div class="[[bg-fill-danger]]">
  <p class="text-fg-on-danger">Delete</p>
</div>
```

Measures 3.77. The plain step is for fills with no text on them.

</template>
</DoDont>

[Colour](/foundations/colour/usage.md#putting-text-on-a-solid-fill) covers which step to take for each intent.

## Reading a token outside a utility class

Some places cannot use a utility class: a canvas that paints itself, an inline SVG, a chart library that wants a colour string. Those read the CSS variable directly.

```ts
const probe = document.createElement("span");
probe.style.color = "var([[--color-line-strong]])";
element.append(probe);
const line = getComputedStyle(probe).color;
probe.remove();
```

Read it through a real property rather than off the custom property, because a custom property read on its own returns the token text, and a token that varies comes back as a `light-dark()` string rather than a colour. Read it again if the appearance can change while the view is open, and never copy the value it resolves to today. The variable name is the token name with dots turned into dashes, so `color.line.strong` becomes `--color-line-strong`.

## When no token fits

Before deciding a token is missing, work out which of these you have. Three of the four are not a missing token.

**The name exists and you did not find it.** The most common case. Search [All tokens](/foundations/tokens/all.md) by role rather than by colour, since the same value appears under several roles with different names.

**You need a different step of something that exists.** A border stronger than `line-default` is `line-strong`, not a new token. Reach along the emphasis scale first.

**It is a measurement rather than a choice.** A width set by what has to fit inside it is not a token. It is a number with a reason, and the reason belongs in the component.

**It is genuinely missing.** A meaning the system has no name for, needed in more than one place. A token that only one component would use is usually a value that belongs in that component, so find the second place that needs it, then raise it.
