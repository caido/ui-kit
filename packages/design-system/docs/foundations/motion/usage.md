# Using motion

How to write a transition. For the model behind these rules, see [Overview](/foundations/motion.md). For every value, see [Reference](/foundations/motion/reference.md).

## Writing nothing, which is usually right

**A control changing state already moves correctly.** Name the properties and stop.

```vue
<template>
  <div
    class="[[transition-colors]] cursor-pointer rounded px-3 py-2 hover:bg-surface-hover"
  >
    Open in Replay
  </div>
</template>
```

That runs at 150ms on the standard curve, because both are the framework defaults. Adding `duration-state` or `ease-standard` here changes nothing and makes a decision out of something that was free.

## Naming what animates

**Always name the properties.** `transition-all` animates whatever happens to change, including a layout property somebody adds later, with nobody deciding that it should.

<DoDont>
<template #do>

```vue
<template>
  <div class="[[transition-colors]] hover:bg-surface-hover" />
</template>
```

Colour moves and nothing else, whatever gets added to this element later.

</template>
<template #dont>

```vue
<template>
  <div class="[[transition-all]] hover:bg-surface-hover" />
</template>
```

Any property added later starts animating, including one that forces layout.

</template>
</DoDont>

## Fading something in

Something that appears without travelling animates opacity alone, and stays on the default duration and curve.

```vue
<template>
  <Transition
    enter-active-class="[[transition-opacity]]"
    leave-active-class="[[transition-opacity]]"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" />
  </Transition>
</template>
```

Opacity composites, so a fade costs no layout work whatever sits behind it.

## Moving a surface

A drawer, a panel or a strip that opens is the one case for the longer duration, and for the entering curve.

```vue
<template>
  <aside class="transition-transform [[duration-surface]] [[ease-enter]]">
    <slot />
  </aside>
</template>
```

`ease-enter` decelerates, so the surface settles rather than stopping dead. Use it when something arrives, and leave the standard curve on everything else.

## Animating position without forcing layout

Move things with `transform`, never with a layout property.

<DoDont>
<template #do>

```vue
<template>
  <div class="transition-transform [[translate-x-0]]" />
</template>
```

Transform composites, so the browser does no layout work per frame.

</template>
<template #dont>

```vue
<template>
  <div class="transition-[left] [[left-0]]" />
</template>
```

`left` forces the browser to lay the page out again on every frame.

</template>
</DoDont>

The same applies to a progress bar. Animate `transform` through `scaleX` rather than `width`.

## Leaving data surfaces alone

**A row in a data table, a response body and an editor do not animate.**

If something near data needs to move, check whether it is actually on the data or layered over it. A pill above a table and a popover beside a list are both fine, because neither is the data surface.

## Not writing reduced motion yourself

There is one global rule handling `prefers-reduced-motion`, so a component does not write its own `motion-reduce:` variant.

If something genuinely has to keep moving because stopping it would remove information, add it to the exemption in the global reduced-motion rule, with its reason written beside it, rather than adding a local override.

## Switching an animation off by name

If you do need to stop an animation yourself, set the `animation` shorthand rather than its duration.

```css
animation: none;
```

Setting `animation-duration: 0s` is beaten by any inline duration, and a data-driven animation writes exactly that: the celebration confetti sets each piece's duration inline from its own data. Setting the shorthand clears the name, and with no name there is nothing left to run. **Write `animation: none` and leave the duration alone.**
