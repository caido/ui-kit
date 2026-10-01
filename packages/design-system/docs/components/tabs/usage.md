# Using tabs

How to render a tab set, fill its panels, size it, and how to render the chip that shares the name. For what each component is for, see [Overview](/components/tabs.md). For the props, events and the rendered DOM, see [Reference](/components/tabs/reference.md).

## Rendering a tab set

Two things are required: an `items` array and a `v-model:value`. Each item needs an `id`, which becomes the value of its tab, the value of its panel, and the name of the slot that fills that panel.

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

There is no default slot. Anything placed between the opening and closing tags without a `#name` is discarded, and nothing reports it.

The model is declared required, so it is a prop the template has to supply and a strip left without one has no active tab. Bind it even when the set has a single entry.

## Naming a tab

An item with a `label` needs nothing else. The label is rendered as the fallback content of the shared `tab` slot, which is the whole of what `label` does.

**Does each item carry either a `label` or a slot of its own?** An item with neither renders a tab button 31.5 pixels wide with nothing inside it, still focusable and still selectable. Give every item either a `label` or a `tab-<id>` slot.

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

The slot is declared with an `active` scope property, and it arrives as `undefined`. The component library renders a tab body with no scope properties at all unless the tab is asked to render as a child, and `CTabs` never asks. Read the model value instead of that property.

## Filling a panel

**A panel slot takes the raw `id` and a tab slot takes the same `id` behind `tab-`.** An item whose `id` is the literal string `tab` or `panel` collides with the two shared fallback slots and renders through the wrong branch, so keep those two words out of an identifier.

An item with neither a panel slot nor the shared `panel` slot renders an empty panel rather than nothing, because the shared slot has no fallback content of its own.

## Guarding a panel that costs something

**Each panel mounts on the first render, and the inactive ones are hidden rather than removed.** A panel holding a rendered document, a table or a subscription therefore starts working before anybody opens it.

Guard the body against the model value, which is what the plugin store detail does:

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

**A `class` on `CTabs` is dropped before it reaches the DOM, along with `style`.** The container keeps its own full height column layout and nothing reports the loss. Put the class on a wrapper element instead, which is what the Automate session settings do.

<DoDont image="component-tabs-class">
  <template #do>
    <p>Put the class on <code>CTab</code>, which sets no <code>inheritAttrs</code> and forwards it to the root element.</p>
  </template>
  <template #dont>
    <p>Put the class on <code>CTabs</code>, where the forwarded attribute allow-list drops it.</p>
  </template>
</DoDont>

The two components behave in opposite ways here, so check which one is in front of you before writing a class. What still reaches a `CTabs` is `data-*`, `aria-*`, a listener and the three names `id`, `name` and `form`, and all of them land on the outer container rather than on the tab list.

## Reacting to a click

**`tabClick` fires after the model has already changed.** It carries the item identifier, and the order holds because the component library merges its own click handler ahead of the forwarded one. A handler reading the bound value sees the new identifier rather than the previous one. Take the previous value from somewhere the handler owns when it needs one.

`tabMouseDown` exists because a mousedown on a tab does not escape the strip. The component stops propagation, so a listener on any ancestor never sees it, and middle-click and right-click behaviour has to be wired through that event.

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

`indicator` is the one presentational prop, and setting it false hides the 4 pixel bar while leaving the page-coloured band it sits in. Selection is then carried by the active tab's underline and label colour.

Nothing in Caido sets it. Leave it alone unless the strip sits somewhere the bar reads as a second, unrelated rule.

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

**`select` is not confirmation that a chip was chosen.** It fires on a left click of the label button, and on a mousedown from any other button, so a right press that opens a context menu emits it too. Read it as a pointer event on the chip rather than as a selection, and close on a middle click through a plain `@mousedown.middle` listener, which reaches the root element.

There is no default slot. Content that belongs beside the label goes in `prefix`, which renders between the icon and the label:

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

`rename` carries the new name, and the field emits it only when the value actually changed, after a blur or Enter. Nothing is written for a field closed at the value it opened with.

Before wiring a chip strip, decide which element owns the roles: `CTab` renders a plain container with two data attributes and no `role`, so write the tab semantics on the row yourself, or move the feature to a `CTabs`.
