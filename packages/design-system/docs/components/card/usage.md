# Using card

How to place a card, fill its three regions and size it from the outside. For what the component decides, see [Overview](/components/card.md). For the prop, the slots and the DOM, see [Reference](/components/card/reference.md).

## Sizing a card from its parent

`CCard` writes `size-full` on its root, so it fills the element it is placed in and nothing else. Give it a parent with a size, and put the card inside with no attributes at all.

```vue
<template>
  <div class="size-full">
    <CCard>
      <CTableRowsSkeleton />
    </CCard>
  </div>
</template>
```

<DoDont image="component-card-sizing">
  <template #do>
    <p>Size the wrapper around the card. The root already fills its box, so the wrapper is the one place a width or a height has an effect.</p>
  </template>
  <template #dont>
    <p>Put the sizing classes on the card itself. A class is not on the forwarded allow-list, so the attribute is dropped and the card renders at content height with nothing reported.</p>
  </template>
</DoDont>

**A dropped `class` looks identical to a class that works.** Nothing in typecheck, lint or the console reports it, so the failure arrives as a panel that is the wrong height and a template that reads as though it should be right. [Components](/foundations/components/usage.md#laying-things-out) sets out where layout belongs when a component refuses to carry it.

## Adding a header

Pass `#header` and the card draws a 48 pixel band with a 4 pixel `surface-page` strip under it. The slot content is the whole band, so give it `w-full` and set its own horizontal padding.

```vue
<template>
  <div class="size-full">
    <CCard>
      <template #header>
        <div class="[[w-full]] flex items-center justify-between pl-4 pr-1">
          <span>{{ $t("findings.reporterList.header") }}</span>
          <CButton
            size="small"
            variant="text"
            severity="contrast"
            :label="$t('findings.reporterList.deselect')"
            @click="onDeselectClick"
          />
        </div>
      </template>
      <ReporterListItems />
    </CCard>
  </div>
</template>
```

The band is a row flex container that centres its child vertically, so leave the vertical padding off and let `items-center` do the work. Keep the content to one line with its controls at `small`, because the band does not grow: a second row overflows it rather than pushing the body down.

## Adding a footer

Pass `#footer` and the card draws a 1 pixel `line-subtle` rule above it. The footer takes its height from its content, so the padding is the caller's.

```vue
<template>
  <CCard>
    <SessionListItems />
    <template #footer>
      <i18n-t
        keypath="assistant.sessionList.footer.disclaimer"
        tag="div"
        class="w-full min-w-0 p-4 text-fg-muted"
        scope="global"
      >
        <template #link>
          <CExternalLink
            :href="Config.urls.privacy"
            :label="$t('assistant.sessionList.footer.privacyLink')"
          />
        </template>
      </i18n-t>
    </template>
  </CCard>
</template>
```

A footer that takes the card's own background needs nothing else. A footer that has to look like a separate plate takes the 4 pixel `surface-page` treatment instead, written on the footer content, matching what the header band already does.

## Padding the body

The body carries no padding, so write it on the content or take the `padded` prop.

```vue
<template>
  <CCard [[padded]]>
    <LicenseAttributions />
  </CCard>
</template>
```

`padded` adds 16 pixels on all four sides of the body and leaves the header and footer untouched. **No call site in the interface passes it.** Call sites pad their own content instead, usually because the padding is asymmetric, or because a scrolling child has to reach the card edge. Take the rung off the [space ladder](/foundations/space/usage.md#picking-a-rung) either way: 8 pixels inside a toolbar row, 16 inside a panel with prose in it.

## Putting a scrolling region inside a card

The body is a flex child with `min-h-0` already set, which is the part that lets an overflowing child shrink instead of pushing the card taller. Put the overflow on the child.

```vue
<template>
  <div class="size-full">
    <CCard>
      <template #header>
        <ListHeader />
      </template>
      <div class="size-full overflow-y-auto">
        <FindingRows />
      </div>
    </CCard>
  </div>
</template>
```

Do not try to set the overflow on the card, because no attribute would reach it. A card is a frame around a scrolling thing rather than a scrolling thing itself.

## Passing an identity attribute or a listener

`data-*`, `aria-*`, a listener and the three names `id`, `name` and `form` reach the root. Everything else is filtered out.

```vue
<template>
  <CCard [[data-testid]]="reporter-list" @click="onCardClick">
    <ReporterListItems />
  </CCard>
</template>
```

A tour step, a test selector and a click handler all work through that list, which is why it exists at all, and [components](/foundations/components/usage.md#passing-identity-through-a-component) has its full shape. A directive is not an attribute and is not filtered, so `v-tooltip` on a card reaches the root the way it would on any element: four call sites rely on that, each a locked preset explaining why it cannot be opened.

## Choosing between a card and a well

Ask what the surface is claiming.

**Is this region a thing in its own right?** Reach for `CCard`.

**Is it a quieter area inside something already raised?** Reach for `CWell`.

[Overview](/components/card.md#when-a-well-fits-better-than-a-card) sets out why the two stop being interchangeable as soon as a header is involved. When a raised panel needs sub-panels of its own, split it with the 4 pixel `surface-page` strip the header already uses so the page colour runs between them, rather than nesting a second card inside the first.
