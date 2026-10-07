# Using tabs

How to render a tab set, fill its panels, size it, and how to render the chip that shares the name. For what each component is for, see [Overview](/components/tabs.md). For the props, events and the rendered DOM, see [Reference](/components/tabs/reference.md).

## Rendering a tab set

Two things are required: an `items` array and a `v-model:value`. Each item needs an `id`, which is both the tab value and the name of the slot that fills its panel.

```vue
<script setup lang="ts">
import { CTabs, type CTabsItem } from "@proxy-frontend/components";
import { ref } from "vue";

const tab = ref<"details" | "changelog">("details");

const tabs: CTabsItem<"details" | "changelog">[] = [
  { id: "details", label: "Details" },
  { id: "changelog", label: "Changelog" },
];
</script>

<template>
  <CTabs [[v-model:value="tab"]] :items="tabs">
    <template #details>
      <PluginReadme :source />
    </template>
    <template #changelog>
      <PluginChangelog :source />
    </template>
  </CTabs>
</template>
```

There is no default slot, so anything between the tags without a `#name` is discarded silently. Bind the model even when the set has a single entry, because a strip without one has no active tab.

## Naming a tab

An item with a `label` needs nothing else. **Give every item either a `label` or a `tab-<id>` slot**, because an item with neither renders an empty tab that is still focusable and selectable.

Reach for the slot when a tab holds more than text. Plugins puts a count beside each name that way:

```vue
<template>
  <CTabs v-model:value="tab" :items="tabs">
    <template [[#tab-store]]>
      <HStack :gap="1">
        {{ $t("plugins.tabs.store") }}
        <Badge v-if="storeCount > 0" size="small" severity="secondary">
          {{ storeCount }}
        </Badge>
      </HStack>
    </template>
  </CTabs>
</template>
```

The slot's `active` scope property always arrives as `undefined`, so read the model value instead.

## Filling a panel

**A panel slot takes the raw `id` and a tab slot takes the same `id` behind `tab-`.** Keep the words `tab` and `panel` out of an identifier, because they collide with the two shared fallback slots that [CTabs slots](/components/tabs/reference.md#ctabs-slots) lists. An item with no panel slot renders an empty panel.

## Guarding a panel that costs something

Each panel mounts on the first render, so a panel holding a rendered document, a table or a subscription starts working before anybody opens it. Guard the body against the model value, as the plugin store detail does:

```vue
<template>
  <CTabs v-model:value="tab" :items="tabs">
    <template #changelog>
      <MarkdownRenderer [[v-if="tab === 'changelog'"]] :markdown="changelog" />
    </template>
  </CTabs>
</template>
```

The guard belongs inside the slot rather than on the `CTabs`, because the panel element itself is always rendered.

## Sizing a tab set

**A `class` on `CTabs` is dropped before it reaches the DOM, along with `style`**, and nothing reports the loss. Put the class on a wrapper element instead, as the Automate session settings do.

<DoDont image="component-tabs-class">
  <template #do>
    <p>Put the class on <code>CTab</code>, which sets no <code>inheritAttrs</code> and forwards it to the root element.</p>
  </template>
  <template #dont>
    <p>Put the class on <code>CTabs</code>, where the forwarded attribute allow-list drops it.</p>
  </template>
</DoDont>

[Forwarded attributes](/components/tabs/reference.md#forwarded-attributes) lists what still reaches each one.

## Reacting to a click

**`tabClick` fires after the model has already changed**, so a handler reading the bound value sees the new identifier. Take the previous value from somewhere the handler owns when it needs one.

A mousedown on a tab never reaches an ancestor, so wire middle-click and right-click behaviour through `tabMouseDown`.

```vue
<template>
  <CTabs
    v-model:value="tab"
    :items="tabs"
    @tab-click="onTabClick"
    [[@tab-mouse-down="onTabMouseDown"]]
  />
</template>
```

Both listeners take the kebab-case spelling in a template.

## Switching the indicator off

Setting `indicator` to false hides the bar and leaves the band it sits in. Nothing in Caido sets it, so leave it alone unless the bar reads as a second, unrelated rule.

## Rendering a chip

`CTab` needs a `label` and an `is-selected`, and it draws one chip rather than a strip. Lay the row out at the call site and give each chip a stable key.

```vue
<template>
  <HStack :gap="1">
    <CTab
      v-for="session in sessions"
      :key="session.id"
      v-model:is-editable="editing[session.id]"
      class="shrink-0"
      icon="fas fa-sliders"
      :data-session-id="session.id"
      :label="session.name ?? $t('generic.value.notAvailable')"
      :is-selected="session.id === activeId"
      @select="($event) => onSelect($event, session)"
      @rename="(name) => onRename(session, name)"
      @close="onClose(session)"
    />
  </HStack>
</template>
```

**`select` is not confirmation that a chip was chosen.** A right press that opens a context menu emits it too, so read it as a pointer event on the chip. Close on a middle click through a plain `@mousedown.middle` listener, which reaches the root element.

Content that belongs beside the label goes in `prefix`, which renders between the icon and the label:

```vue
<template>
  <CTab :label="session.name" :is-selected="isSelected">
    <template [[#prefix]]>
      <ReplayTag :session />
    </template>
  </CTab>
</template>
```

## Renaming a chip

`is-editable` is a model, and the chip sets it to true on its own double-click. Give the same model a second route from a context menu, because double-click has no keyboard equivalent.

`rename` carries the new name, after a blur or Enter, and only when the value changed.

::: tip
`CTab` renders no `role`, so write the tab semantics on the row yourself or move the feature to a `CTabs`.
:::
