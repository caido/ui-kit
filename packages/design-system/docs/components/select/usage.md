# Using select

How to put a dropdown on a screen and wire it up. For every prop and attribute, see [Reference](/components/select/reference.md).

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

`optionLabel` takes a key name and nothing else, so text that has to be computed is computed into the array first.

Pass a placeholder as well, or seed the model with a value before the field is drawn. A single select with neither renders a blank trigger that reads as an empty control rather than as an empty choice.

<Preview
  light="/examples/component-select-values-light.svg"
  dark="/examples/component-select-values-dark.svg"
  alt="Three triggers showing a value, a placeholder and a disabled control"
  caption="A placeholder is a colour change rather than a lighter weight. Disabled fills the surface and dims the whole trigger."
/>

## Hiding the label in a toolbar

A toolbar row has no space for a stacked label, and the name still has to reach a screen reader. `hideLabel` hides the label visually and keeps it in the DOM.

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

**A hidden label is still a real label.** The gap above the control goes with it, so the block shrinks to the height of the trigger and fits the row.

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

Each entry of `options` is then a group holding its own rows under the key named by `optionGroupChildren`. A heading cannot be picked.

## Showing a validation message

`message` renders under the control, with an `aria-describedby` pointing at it, only when `invalid` is true as well.

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

The caption is announced less reliably than it looks, because the focusable element carries no description. Keep the message short, and keep the same information in the submit path.

## Reading the chosen value

Read the model rather than the `change` payload.

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

**The payload is `{ originalEvent, value }`, although the declared type says it is the value.** A handler that has to use the argument takes `.value` off it.

## Selecting more than one value

`multiple` swaps in the multi-choice control.

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

**Seed the model as `undefined` rather than as an empty array.** The preset paints the label transparent when the bound array is empty, so `ref([])` draws a control with an invisible placeholder.

Expect the rest of the branch to differ too, from the height to the accessible name, as [Geometry](/components/select/reference.md#geometry) and [ARIA](/components/select/reference.md#aria) list.

## Setting the width

**Width cannot come from a class on the tag.** A utility written there typechecks, renders and changes nothing.

Use `fluid` to fill the parent, and a wrapper you own when the width has to be a specific number. `fluid` matters most when the select is itself a flex item, because in a block parent it already fills the width.

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

The accessible name becomes the caller's job, because there is no `label` prop, so write an `aria-label` by hand. `optionLabel` is a function here and a key name on `CSelect`, so markup does not move between the two by copying.

## Passing an identity attribute or a listener

`data-*`, `aria-*`, listeners, `id`, `name` and `form` pass the filter and are bound to the library control rather than to the wrapper.

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

That route is the whole event surface beyond `v-model` and `change`, and [Events](/components/select/reference.md#events) lists what arrives. Do not attach an `aria-describedby` this way, because the component overwrites or deletes it.

## Leaving the overlay alone

The overlay sets its own surface, minimum width and list height, and no class overrides them. Write no shadow, no width and no maximum height around it, and read [depth](/foundations/depth.md#there-are-no-shadows) before changing anything near it.
