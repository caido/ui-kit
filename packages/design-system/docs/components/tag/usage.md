# Using tag

How to label a tag, pick its colour axis and hold a row still with one. For what the component decides, see [Overview](/components/tag.md). For the props, the DOM and the forwarded attributes, see [Reference](/components/tag/reference.md).

## Labelling a tag

`label` is the one required prop, and it takes a string or a number. There is no default slot, so the text goes through the prop even when it is already a translated string.

```vue
<template>
  <CTag :label="$t('projects.table.readOnlyTag')" severity="info" />
</template>
```

A number needs no conversion on the way in, which is why the intercept and search toolbars hand a status code straight to the prop.

```vue
<template>
  <CTag [[:label="statusCode"]] severity="info" width="small" />
</template>
```

Keep the label to a word or two. The chip holds one line, and `truncate` on the root clips anything wider than the space available rather than wrapping it.

## Picking severity or category

Ask what the colour is doing before reaching for either axis.

**Does the colour rank this row against the others?** Then it is an intent, and it belongs in `severity`. A failing status code is `danger` because danger is what it means.

**Does it separate one kind from another without ranking them?** Then it is an accent, and it belongs in `category`. A request method is the clear case: nothing breaks when `GET` trades colours with `POST`.

```vue
<template>
  <CTag :label="method" :category="METHOD_CATEGORIES[method]" />
</template>
```

<DoDont image="component-tag-axis">
  <template #do>
    <p>Pass one axis. A category on its own paints the accent, and a severity on its own paints the intent.</p>
  </template>
  <template #dont>
    <p>Pass both. The container drops the severity as soon as a category is present, so the second prop reads as a decision that nothing acts on.</p>
  </template>
</DoDont>

[Colour](/foundations/colour/usage.md#choosing-between-an-intent-and-an-accent) has the full test, and the eight accent names are listed under [category accents](/foundations/colour/reference.md#category-accents).

## Adding a glyph

`icon` takes the class string of one icon, in the form [icons](/foundations/icons/usage.md#writing-an-icon) sets out, and the component draws it in front of the label with a 4 pixel gap.

```vue
<template>
  <CTag
    :label="$t('plugins.store.official')"
    [[icon="fas fa-shield-halved"]]
    severity="success"
  />
</template>
```

The glyph inherits the tag foreground, so an icon inside a `warn` tag is already the warn colour and needs nothing written for it.

## Naming a tag that has no words

A tag can carry a glyph and an empty label, and the container drops the gap beside the glyph when it does. That chip says nothing to a screen reader on its own, so give it a name and a tooltip.

```vue
<template>
  <CTag
    v-tooltip.top="$t('replay.tag.pipeline')"
    [[:aria-label="$t('replay.tag.pipeline')"]]
    :label="''"
    icon="fas fa-layer-group"
    category="lime"
  />
</template>
```

`aria-label` is forwarded and lands on the root, and `v-tooltip` is a directive rather than an attribute, so it reaches the root untouched. A tooltip is not a name on its own, which is the rule [accessibility](/foundations/accessibility.md#a-tooltip-is-not-a-name) sets and the reason both are written here.

## Reserving a width in a toolbar

Pass `width` with an empty label to hold the space a value will occupy. The chip renders as a blank fill at 48 or 64 pixels and the row stops jumping when the value arrives.

```vue
<template>
  <CCard>
    <div class="size-full flex items-center gap-2 p-2">
      <CTag :label="''" severity="info" [[width="medium"]] />
      <span class="text-fg-default">{{
        $t("intercept.requestToolbar.idle.waiting")
      }}</span>
    </div>
  </CCard>
</template>
```

Match the width to what fills it later. The HTTP history idle row reserves `medium` for the method and `small` for the status code, which are the same 64 and 48 pixels the success row puts in their place.

**A reserved chip does not grow with the text setting.** Its height comes from `h-6` rather than from a line box, so it measures 24 pixels at a 12 pixel text setting and 24 at a 24 pixel one, while the labelled tag that replaces it runs from 21.72 to 35.42. Check a toolbar at both ends of the setting before relying on the reservation.

## Spacing a row of tags

A tag carries no margin and accepts no class, so the gap between two of them belongs to the element holding them. Use `HStack` with a rung from the [space ladder](/foundations/space/reference.md#the-rungs).

```vue
<template>
  <HStack [[:gap="2"]]>
    <CTag :label="$t('projects.table.readOnlyTag')" severity="info" />
    <CTag :label="$t('projects.table.temporaryTag')" />
  </HStack>
</template>
```

<DoDont image="component-tag-class">
  <template #do>
    <p>Put the gap on the parent and let the severity pick the fill.</p>
  </template>
  <template #dont>
    <p>Write a margin class on the tag. The attribute is removed before it reaches the root and nothing reports the loss.</p>
  </template>
</DoDont>

**A dropped class leaves no trace.** The attribute is filtered before the root renders, so the shipped markup holds the component classes and nothing the call site wrote, while the template still reads as though the class took effect. [Components](/foundations/components/usage.md#laying-things-out) covers where layout belongs when a component refuses to hold it.

## Passing an identity attribute

`data-*`, `aria-*`, a listener and the three names `id`, `name` and `form` reach the root. Everything else, including `title` and `role`, is filtered out.

```vue
<template>
  <CTag [[data-testid="status-tag"]] :label="statusCode" severity="info" />
</template>
```

That list is what a test selector and a tour step run on, and [components](/foundations/components/usage.md#passing-identity-through-a-component) has its full shape.

## Choosing between a tag and a span

Reach for the component when the chip is a label with a severity or a category on it. Reach past it when the design needs something the two axes do not offer, such as a half-opacity fill or a width outside 48 and 64 pixels, because no attribute will get there.

When that happens, write the span from the tokens rather than fighting the component, and hold it level with the tag beside it: caption role, weight 600, `rounded`, and 4 pixels above and below the text.

Then check the pair at a 12 pixel text setting and again at 24, because a tag height is a line box plus its padding and a hand-written one is whatever was typed.
