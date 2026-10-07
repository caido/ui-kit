# Using tag

How to label a tag, pick its colour axis and hold a row still with one. For what the component decides, see [Overview](/components/tag.md). For the props, the DOM and the forwarded attributes, see [Reference](/components/tag/reference.md).

## Labelling a tag

`label` is the one required prop, and it takes a string or a number. There is no default slot, so the text goes through the prop even when it is already a translated string.

```vue
<template>
  <CTag :label="$t('projects.table.readOnlyTag')" severity="info" />
</template>
```

A number needs no conversion, so a status code goes straight to the prop.

```vue
<template>
  <CTag [[:label="statusCode"]] severity="info" width="small" />
</template>
```

Keep the label to a word or two, because the chip clips anything wider rather than wrapping it.

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

`icon` takes the class string of one icon, in the form [icons](/foundations/icons/usage.md#writing-an-icon) sets out, and draws it in front of the label.

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

Both reach the root. A tooltip is not a name on its own, which is the rule [accessibility](/foundations/accessibility.md#a-tooltip-is-not-a-name) sets.

## Reserving a width in a toolbar

Pass `width` with an empty label to hold the space a value will occupy, so the row does not jump when the value arrives.

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

Match the width to what fills it later. The HTTP history idle row reserves `medium` for the method and `small` for the status code.

**A reserved chip does not grow with the text setting**, while the labelled tag that replaces it does. Check a toolbar at a 12 pixel and a 24 pixel text setting before relying on the reservation.

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

[Components](/foundations/components/usage.md#laying-things-out) covers where layout belongs when a component refuses to hold it.

## Passing an identity attribute

A `data-*` or `aria-*` attribute reaches the root, which is what a test selector and a tour step run on.

```vue
<template>
  <CTag [[data-testid="status-tag"]] :label="statusCode" severity="info" />
</template>
```

[Forwarded attributes](/components/tag/reference.md#forwarded-attributes) lists every shape, and [components](/foundations/components/usage.md#passing-identity-through-a-component) explains the rule.

## Choosing between a tag and a span

Reach for the component when the chip is a label with a severity or a category on it. Reach past it when the design needs something the two axes do not offer, such as a half-opacity fill, because no attribute will get there.

Write the span from the tokens and hold it level with the tag beside it: caption role, weight 600, `rounded`, and 4 pixels above and below the text. Then check the pair at a 12 pixel text setting and again at 24.
