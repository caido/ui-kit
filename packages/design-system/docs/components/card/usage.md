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

Nothing in typecheck, lint or the console reports a dropped `class`. [Components](/foundations/components/usage.md#laying-things-out) sets out where layout belongs when a component refuses to carry it.

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

The band already centres its child vertically, so leave the vertical padding off. Keep the content to one line with its controls at `small`, because a second row overflows the band rather than pushing the body down.

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

A footer that has to look like a separate plate takes the 4 pixel `surface-page` strip on its own content, matching the header band.

## Padding the body

The body carries no padding, so write it on the content or take the `padded` prop.

```vue
<template>
  <CCard [[padded]]>
    <LicenseAttributions />
  </CCard>
</template>
```

`padded` adds 16 pixels to the body only. No call site passes it today, because padding is often asymmetric or a scrolling child has to reach the card edge. Either way, take the rung off the [space ladder](/foundations/space/usage.md#picking-a-rung): 8 pixels inside a toolbar row, 16 inside a panel with prose in it.

## Putting a scrolling region inside a card

The body already sets `min-h-0`, so an overflowing child shrinks instead of pushing the card taller. Put the overflow on the child.

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

A card is a frame around a scrolling thing rather than a scrolling thing itself.

## Passing an identity attribute or a listener

Identity attributes and listeners reach the root, as [Forwarded attributes](/components/card/reference.md#forwarded-attributes) lists.

```vue
<template>
  <CCard [[data-testid]]="reporter-list" @click="onCardClick">
    <ReporterListItems />
  </CCard>
</template>
```

A tour step, a test selector and a click handler all work through that list, and [components](/foundations/components/usage.md#passing-identity-through-a-component) has its full shape. A directive such as `v-tooltip` is not filtered, which is how a locked preset card explains why it cannot be opened.

## Choosing between a card and a well

Ask what the surface is claiming.

**Is this region a thing in its own right?** Reach for `CCard`.

**Is it a quieter area inside something already raised?** Reach for `CWell`.

[Overview](/components/card.md#when-a-well-fits-better-than-a-card) sets out the difference. When a raised panel needs sub-panels of its own, split it with the 4 pixel `surface-page` strip so the page colour runs between them, rather than nesting a second card inside the first.
