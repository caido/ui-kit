# Using states

How to apply a state, and the six places it usually goes wrong. For the model behind these rules, see [Overview](/foundations/states.md). For the full property table and tokens, see [Reference](/foundations/states/reference.md).

## Letting the component draw the state

**States live in the components.** A button already hovers, presses, focuses and disables; a row already selects. Writing them again on top is how a component ends up with two answers for the same state.

Reach for the tokens directly only when you are building something the library does not have.

## Giving two states two properties

The rule from the overview, applied. A row can be coloured by somebody and selected at the same time, so those two cannot both be a background.

<DoDont>
<template #do-example>
  <div class="w-full max-w-sm overflow-hidden rounded border border-line-subtle">
    <div class="flex items-center gap-2 border-b border-line-subtle bg-surface-raised px-3 py-2 text-caption text-fg-muted">A row somebody coloured</div>
    <div class="flex items-center gap-2 border-l-2 border-line-selected bg-highlight-orange px-3 py-2 text-fg-strong">
      <span class="truncate">GET /api/session</span>
    </div>
    <div class="flex items-center gap-2 px-3 py-2 text-fg-default">GET /api/user</div>
  </div>
</template>
<template #do>
  <p>Selected is a leading edge, so the colour somebody set is still there. Both states are readable at once.</p>
</template>
<template #dont-example>
  <div class="w-full max-w-sm overflow-hidden rounded border border-line-subtle">
    <div class="flex items-center gap-2 border-b border-line-subtle bg-surface-raised px-3 py-2 text-caption text-fg-muted">A row somebody coloured</div>
    <div class="flex items-center gap-2 bg-surface-selected px-3 py-2 text-fg-default">
      <span class="truncate">GET /api/session</span>
    </div>
    <div class="flex items-center gap-2 px-3 py-2 text-fg-default">GET /api/user</div>
  </div>
</template>
<template #dont>
  <p>Selected paints the background, so the colour is gone. Somebody's data was overwritten by a state.</p>
</template>
</DoDont>

**What else can this element be at the same time?** Answer that before adding a state to it. If any of those already own the property you were about to take, take a different one.

## Dimming only what is disabled

Opacity belongs to disabled. A second state that also dims is not a second state, because nobody can tell the two apart.

<DoDont>
<template #do-example>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <div class="inline-flex w-40 items-center justify-between rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default opacity-disabled">
      <span>Export</span>
    </div>
    <div class="inline-flex w-40 items-center justify-between rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default">
      <span>Export</span>
      <i class="fas fa-lock text-fg-muted" aria-hidden="true"></i>
    </div>
  </div>
</template>
<template #do>
  <p>Disabled dims. Locked keeps full contrast and says why with a glyph and its tooltip.</p>
</template>
<template #dont-example>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <div class="inline-flex w-40 items-center justify-between rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default opacity-disabled">
      <span>Export</span>
    </div>
    <div class="inline-flex w-40 items-center justify-between rounded border border-line-subtle bg-surface-raised px-3 py-2 text-fg-default opacity-disabled">
      <span>Export</span>
    </div>
  </div>
</template>
<template #dont>
  <p>Two states, one treatment. There is no way to tell which one cannot be clicked and which one needs a permission.</p>
</template>
</DoDont>

## Keeping a disabled control readable

Disabled means it cannot be operated. It does not mean the content is gone.

Somebody looking at a disabled field usually wants to read what is in it, and often wants to copy it. Turning off text selection takes that away for no gain, because selecting text was never how the control was operated in the first place.

**The form controls are already settled, so this rule is about what you build around them.** The preset turns selection off together with pointer events on a disabled input, select, checkbox and the other controls it dresses, which leaves nothing to decide there.

On a row, a panel or a container you disable yourself, leave selection on. Turn it off only where a drag or a double click would otherwise pick up the label of something you are dragging.

## Never removing the focus outline

Focus is applied for the whole interface on `:focus-visible`, so a focusable element already draws a ring. You do not write it, and the one thing you must not do is take it away.

A few controls move the ring rather than drawing a second one: a bordered input takes it on its own boundary, the three controls that hide their real input draw it on the box beside them, and a composite widget clears it on the container and redraws it on the item the user is on. **Moving a ring is not removing one.**

An outline that has been removed and not replaced makes the interface unusable by keyboard, and it fails silently: everything still works for a pointer, so nothing looks broken until somebody tries to tab.

If an outline is in the wrong place rather than unwanted, move it with an offset. Do not switch it off.

## Making everything clickable reachable

If an element responds to a click, it has to be reachable by keyboard and operable by <kbd>Enter</kbd> or <kbd>Space</kbd>.

The usual way this breaks is a click handler on a plain container. A `div` takes no focus and answers no key, so the behaviour exists for a pointer and does not exist otherwise. Use a real control, or give the element a role, a tab stop and key handling.

Anything that appears on hover needs the same treatment: a row action that only exists while a pointer is over it is unreachable for somebody who never moves a pointer.

## Choosing between read-only and disabled

They feel similar and they are not.

Read-only means you may read the value and not change it. Disabled means the control does not apply right now. [Reference](/foundations/states/reference.md#read-only-against-disabled) has the full comparison.

Read-only has no appearance of its own. Leave a read-only field at full contrast rather than dimming it, because the dimming is the disabled treatment and it will be read as disabled.
