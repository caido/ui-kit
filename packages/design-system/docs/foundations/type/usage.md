# Using type

How to pick a role and write it. For the model behind these rules, see [Overview](/foundations/type.md). For the exact numbers, see [Reference](/foundations/type/reference.md).

## Picking a role

Ask what the text is doing, not how big it should look.

| The text is | Role |
|---|---|
| Annotating something else on the screen: a form label, a timestamp, a count | `caption` |
| A primary item or a sentence somebody reads | `body` |
| That same sentence, carrying emphasis | `body-strong` |
| A heading inside a panel or a settings section | `heading` |
| A dialog title, a page header, an empty state heading | `title` |
| An onboarding or celebration screen | `hero` |

If two answers fit, ask whether the text annotates another element on the same screen. If it does, it is a caption. If no role fits, that is a missing role rather than a missing size, so raise it with the design system.

## Writing a role

**Write the role class and nothing else.** It sets the size, the line height and the weight together.

```vue
<label class="[[text-caption]] text-fg-muted">Name</label>
```

<DoDont>
<template #do-example>
  <p class="text-caption text-fg-muted">Name</p>
</template>
<template #do>
  <p>A label that reads as a label, because <code>caption</code> sets everything it needs.</p>
</template>
<template #dont-example>
  <p class="text-sm font-semibold text-fg-muted">Name</p>
</template>
<template #dont>
  <p>The same element asking for <code>text-sm font-semibold</code>. Neither name says what the element is, and in Caido both resolve to a size and a weight nobody chose.</p>
</template>
</DoDont>

`body` is what an element inherits when it says nothing, so body copy usually needs no class at all. Write it only where an ancestor sets a different role.

## Choosing the element under the role

Write the heading element the document order calls for and put the role on it. Where emphasis carries meaning, write `strong` rather than `font-bold`, and it will already be the right weight. [A role is visual, the element is structural](/foundations/type.md#a-role-is-visual-the-element-is-structural) explains why.

## Emphasising a word inside a sentence

Use `body-strong` for a whole line that carries emphasis. For a word or two inside a sentence, wrap just those words.

<DoDont>
<template #do-example>
  <p class="text-fg-strong">Deleting is <span class="font-bold">permanent</span>.</p>
</template>
<template #do>
  <p>On a role that sets 400, the emphasised word stands out from the sentence around it.</p>
</template>
<template #dont-example>
  <p class="text-heading text-fg-strong">Deleting is <span class="font-bold">permanent</span>.</p>
</template>
<template #dont>
  <p>On a role that already sets 600, the emphasised word is identical to the rest. Nothing looks broken, which is why this is missed.</p>
</template>
</DoDont>

::: tip
The role sets the weight, so check the role before reaching for `font-bold`.
:::

## Refining inside a role

Reach for `font-medium` to lift one item inside a group that already shares a role, and not to invent a step between `body` and `heading`. It collapses into regular for anyone using a system face, as [Three weights](/foundations/type.md#three-weights) explains.

## Bounding prose, and leaving data alone

**Prose takes the measure and data does not.**

```vue
<p class="[[max-w-measure]]">
  A paragraph of explanation that a person reads start to finish.
</p>
```

Put `max-w-measure` on `body` and `body-strong` running as prose: an empty state, a settings description, a notice. Leave it off table cells, tree rows, log lines and raw HTTP, which are scanned rather than read.

## Code, HTTP and anything monospaced

Mono is a family, not a size. Monospaced text still carries a role, so it takes the size of whatever it sits in.

```vue
<span class="[[font-mono]] text-caption text-fg-muted">
  200 OK
</span>
```

## Never pinning a size in pixels

A size written in pixels does not move when a user changes their interface text setting. Somebody who raised it to 20 because they need to read gets one element that ignored them, and nothing reports it.

**Pinning a size in pixels is an accessibility defect rather than a style preference.** There is no exception: even the `px` suffix beside the size control carries a role, so it moves with the setting it labels.

## Leaving room for longer text

**No box is sized to fit its English string.**

A translated sentence runs about 30 percent longer, and a four-character label at 175 percent is ordinary. The tightest boxes hold the shortest strings, which is exactly where that lands.

Raising the interface text size is not a test for this, because it moves every string at once. A longer locale moves some strings and not others.

## Truncating, and when not to

**Truncation hides information, so it is a last resort rather than a layout tool.**

Where a value has to be cut, keep it reachable: a tooltip, an expansion, or the full value somewhere on the screen. The part of a hostname that got cut is often the part that mattered.

## Not setting text in capitals

Write labels in sentence case. Capitals for whole words are harder to read, are announced letter by letter by some screen readers, and do not survive translation into scripts that have no case.

Acronyms and protocol constants are already capitals and stay as they are.

## Collapsing a line to its text

`leading-none` is the one line height override to write, for badges, tabs and single-line rows where the box has to collapse to the text. Everywhere else, leave the line height to the role, because it keeps a line of text a whole number of grid steps tall.
