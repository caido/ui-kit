# Using the theme

How to change what a component draws, and the four places it goes wrong. For the model behind these rules, see [Overview](/foundations/theme.md). For the mapping and the exceptions, see [Reference](/foundations/theme/reference.md).

## Telling whether a colour is from the system

One question settles it: **can you name the token this resolves to?** If getting there takes more than one hop, the answer is no.

**Is it a stock family?** A name like `red-500` or `gray-300` belongs to the framework's own palette. It paints, and it paints a colour nobody here chose.

**Is it a step the system defines?** The ramps stop where they stop, and a step past the end still paints. This is the third way a class can fail silently, after the two [tokens](/foundations/tokens.md#why-stock-utility-names-are-not-safe-to-write) already names.

**Does it arrive through somebody else's variable?** A semantic name from the library underneath reaches a Caido value through a chain the system does not control. It stops resolving the moment that chain is removed.

## Replacing a preset step with a token

Read the job the step is doing on the property it sits on, then pick the token for that job. Do not translate by lightness, and do not translate the same number the same way twice.

The darkest step of the preset's own ramp becomes `fg-strong` when it is a foreground and `surface-page` when it is a background. [Reference](/foundations/theme/reference.md#the-ladder) carries the full ladder.

## Never hand-writing a light and dark pair

A token already holds both values, so a pair written by hand applies the system's inversion a second time.

<DoDont>
<template #do>

```vue
<template>
  <div class="[[bg-surface-page]] text-fg-default" />
</template>
```

One name, both appearances, and nothing to keep in step.

</template>
<template #dont>

```vue
<template>
  <div class="[[bg-surface-0 dark:bg-surface-900]] text-fg-default" />
</template>
```

Two names for one job, inverted twice, agreeing only because dark is the default.

</template>
</DoDont>

The two halves are not even keyed on the same thing. The variant reads one attribute and the token reads another, so they agree by coincidence rather than by construction. Both halves of the pair above name appearance-aware tokens, so that is not the tell. Keep the half that is correct when the appearance is dark, since dark is the default, and delete the variant.

The exception is a pair that expresses maximum contrast against whatever the appearance is, rather than one job at two lightnesses. Applying the ordinary rule there inverts the meaning, and the only way to tell is to measure rather than to match the shape.

## Putting text on a fill

The ladder that maps a preset step to a text token is about weight. It says nothing about what the text is sitting on, and a fill is not a surface.

<DoDont>
<template #do-example>
  <div class="flex w-full max-w-sm items-center justify-center rounded bg-fill-danger-strong p-4 text-fg-on-danger">
    Delete this project
  </div>
</template>
<template #do>
  <p>The fill's own foreground, computed against that exact fill and nothing else.</p>
</template>
<template #dont-example>
  <div class="flex w-full max-w-sm items-center justify-center rounded bg-fill-danger-strong p-4 text-fg-muted">
    Delete this project
  </div>
</template>
<template #dont>
  <p>A foreground from the surface ladder, measured against a surface this text is nowhere near.</p>
</template>
</DoDont>

[Colour](/foundations/colour.md#why-text-on-a-fill-is-different) owns the reasoning, and the check is mechanical once stated. **A fill takes the foreground the pairings table measured against that same fill.** It is not enough to match the word after the dash. `fg-on-danger` is measured against the strong danger fill and not against the plain one, where it lands at 3.77 against a floor of 4.5.

## Reaching a token where a class cannot

A keyframe declaration cannot be a utility class, so an animated colour reads the custom property directly. That is a fourth member of the small set [tokens](/foundations/tokens/usage.md#reading-a-token-outside-a-utility-class) already allows, not a new permission.

Everywhere else, write the class.

## Focusing a control that hides its input

A checkbox, a radio and a toggle put keyboard focus on a transparent input, so the ordinary rule outlines an element nobody can see. Draw the indicator on that input's siblings instead, with the same geometry as the ordinary rule, and write it in the consumer's stylesheet rather than in the preset.

## Raising a difference against the package

The preset ships from its own repository, so a difference in it is filed there rather than painted over locally.

A local override is a workaround with a deletion date. Name the release that removes it, in a comment beside the override, or it becomes permanent by default.
