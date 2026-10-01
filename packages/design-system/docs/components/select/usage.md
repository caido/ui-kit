# Using select

How to put a dropdown on a screen and wire it up. For what the component decides, see [Overview](/components/select.md). For every prop and attribute, see [Reference](/components/select/reference.md).

## Adding a select to a form

Four things cover the common case: a model, a label, the options, and the two key names saying which field of an option is its text and which is its value.

```vue
<CSelect
  id="plugin"
  v-model="form.pluginId"
  [[:label]]="$t('settings.network.upstreamPlugin.create.plugin')"
  :options="plugins"
  option-label="label"
  option-value="value"
  :placeholder="$t('settings.network.upstreamPlugin.create.selectPlugin')"
  fluid
/>
```

`label` and `options` are both required, so a select with no accessible name and a select with nothing in it are type errors rather than screens. `optionLabel` takes a key name and nothing else, so text that has to be computed is computed into the array first.

Pass a placeholder as well. A single select with no placeholder and no value renders a non-breaking space, so it reads as an empty control rather than as an empty choice. Three of the seven call sites in the interface pass none, and each of the three seeds its model with a value before the field is drawn, which is the other way to keep the trigger from reading blank.

<Preview
  light="/examples/component-select-values-light.svg"
  dark="/examples/component-select-values-dark.svg"
  alt="Three triggers showing a value, a placeholder and a disabled control"
  caption="A placeholder is a colour change rather than a lighter weight. Disabled fills the surface and dims the whole trigger."
/>

## Hiding the label in a toolbar

A toolbar row has no space for a stacked label, and the name still has to reach a screen reader. `hideLabel` swaps the label class for `sr-only` and keeps the element, its text and its `for` association in the DOM.

```vue
<div [[class="w-40"]]>
  <CSelect
    v-model="recordingDuration"
    :options="durations"
    option-label="label"
    option-value="value"
    :label="$t('runtime.logs.selectDurationAriaLabel')"
    hide-label
    fluid
  />
</div>
```

**A hidden label is still a real label.** Hiding it also removes the 4px gap above the control, because an `sr-only` element leaves the flex flow, so the block shrinks from 55px to 31px and fits the row.

## Grouping options under headings

Two props turn a flat list into a grouped one, and they are passed together or not at all.

```vue
<CSelect
  v-model="step"
  :options="steps"
  [[option-group-label="label"]]
  [[option-group-children="items"]]
  option-label="label"
  :label="$t('runtime.convert.chain.selectedDecoder')"
  hide-label
  fluid
/>
```

Each entry of `options` is then a group holding its own rows under the key named by `optionGroupChildren`. A heading is a 36px row in `fg-muted` at weight 600, and it cannot be picked.

## Showing a validation message

`message` renders under the control, and an `aria-describedby` pointing at it is written alongside, but only when `invalid` is true as well. The two flags move together or neither of them does anything.

<DoDont image="component-select-invalid">
  <template #do>
    <p>Set <code>invalid</code> and <code>message</code> together, so a caption appears and says what is wrong.</p>
  </template>
  <template #dont>
    <p>Rely on <code>invalid</code> alone. The border of a single select does not change, so the field looks exactly like a valid one.</p>
  </template>
</DoDont>

```vue
<CSelect
  id="api"
  v-model="form.api"
  :label="$t('settings.aiProviders.form.api.label')"
  :options="apiOptions"
  option-label="label"
  option-value="value"
  :invalid="[[isTouched && form.api === undefined]]"
  :message="$t('settings.aiProviders.form.api.required')"
  fluid
/>
```

Gate `invalid` on something the user has done rather than on emptiness alone, so a form does not open in an error state. Write the message as a sentence saying what to do, because it is doing the work the border is not.

The caption is announced less reliably than it looks. `aria-describedby` lands on the wrapper the library renders rather than on the focusable element inside it, so the element a keyboard reaches carries no description. Keep the message short, and keep the same information in the submit path.

## Reading the chosen value

Read the model. The declared type of the `change` event says it carries a value, and what arrives is the library event object instead.

```vue
<script setup lang="ts">
const onChange = () => {
  service.setFontFamily(selectedFontFamily.value);
};
</script>

<template>
  <CSelect
    v-model="selectedFontFamily"
    :options="fonts"
    :label="$t('settings.appearance.uiFontFamily.label')"
    hide-label
    [[@change]]="onChange"
  />
</template>
```

**The payload is `{ originalEvent, value }` rather than the value.** The one call site using the event ignores its argument and reads the model, which is the pattern to copy. A handler that has to use the argument takes `.value` off it, and the declared type says otherwise.

## Selecting more than one value

`multiple` swaps in the multi-choice control, and the obvious way to seed its model is the wrong one.

```vue
<script setup lang="ts">
const selectedScopes = ref<string[] | undefined>([[undefined]]);
</script>

<template>
  <CSelect
    v-model="selectedScopes"
    :options="scopes"
    option-label="name"
    option-value="id"
    :label="$t('scopes.filter.label')"
    :placeholder="$t('scopes.filter.placeholder')"
    multiple
    fluid
  />
</template>
```

Seed it as `undefined` rather than as an empty array. The preset paints the label transparent when the bound array is present and empty, so `ref([])` draws a control with an invisible placeholder inside it and nothing on screen saying why.

Expect the rest of the branch to differ too. The control is 34px rather than 31px, each row carries a 20px checkbox, the `<label for>` becomes the accessible name, and `invalid` paints the border for real.

## Setting the width

**Width cannot come from a class on the tag.** The component stops inheriting attributes and its filter drops `class`, `style` and a pass-through styling object, so a utility written there typechecks, renders and changes nothing.

Use `fluid` in a block parent, and a wrapper you own when the width has to be a specific number. The wrapper is already a full-width flex column in an ordinary block parent, so `fluid` matters most when the select is itself a flex item, which is where the collapse is hardest to see.

## Reaching for CDropdown instead

Swap wrappers when a row has to be more than text. `CDropdown` forwards everything, so a class, an `aria-label` and props it never declares all reach the control underneath.

```vue
<CDropdown
  :model-value="selected"
  :options="environments"
  :option-label="getLabel"
  data-key="id"
  :aria-label="$t('environment.select.ariaLabel')"
  :placeholder="$t('environment.select.placeholder')"
  [[class="w-full"]]
  @update:model-value="onClick"
>
  <template #option="{ option }">
    <span :class="isNoEnvironment(option) ? 'text-fg-subtle' : ''">
      {{ getLabel(option) }}
    </span>
  </template>
</CDropdown>
```

**Does the row need anything other than text?** Then it is this wrapper, and the accessible name becomes the caller's job: there is no `label` prop, so write an `aria-label` by hand, as twelve of the thirteen call sites do. `optionLabel` is a function here and a key name on `CSelect`, so markup does not move between the two by copying.

## Passing an identity attribute or a listener

The filter admits four shapes: `data-*`, `aria-*`, an `on[A-Z]` listener, and the three exact names `id`, `name` and `form`. They are bound to the library control rather than to the wrapper.

```vue
<CSelect
  v-model="form.api"
  :label="$t('settings.aiProviders.form.api.label')"
  :options="apiOptions"
  option-label="label"
  [[data-onboarding="ai-provider-api"]]
  @show="onOverlayOpen"
/>
```

That route is the whole event surface beyond `v-model` and `change`. `@focus`, `@blur`, `@show`, `@hide`, `@before-show`, `@before-hide` and `@filter` arrive as forwarded attributes and reach a control that declares each of them.

Do not attach an `aria-describedby` this way. The component binds its own afterwards, so a caller's value is overwritten when there is a message and deleted outright when there is not.

## Leaving the overlay alone

The overlay takes the page surface, a 1px `line-default` border and no shadow, and its minimum width is pinned to the trigger at the moment it opens. The list scrolls past 196px, which the library sets inline and no class overrides.

Write no shadow, no width and no maximum height around it, and read [depth](/foundations/depth.md#there-are-no-shadows) before changing anything near it.
