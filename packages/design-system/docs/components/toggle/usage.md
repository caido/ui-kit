# Using toggle

How to write a toggle, bind it, hide its label and place it in a row. For what the component decides, see [Overview](/components/toggle.md). For every prop and attribute, see [Reference](/components/toggle/reference.md).

## Writing a toggle

Pass a `label` and bind a model. Both are required.

```vue
<template>
  <CToggle [[v-model="isEnabled"]] [[label="Intercept requests"]] />
</template>
```

**A toggle without a model warns at render rather than defaulting to off**, so resolve a `Maybe<boolean>` out of a store to a real boolean before binding it. The label is plain text: markup inside it renders as typed, and text between the tags is discarded.

## Confirming before the switch moves

A setting that has to reach the server before the switch is allowed to move is bound one way. Pass `:model-value` from the value that came back and handle the update, so the switch moves when the change lands rather than when the pointer goes down.

```vue
<template>
  <CToggle
    [[:model-value="data.enabled"]]
    :label="$t('settings.network.dns.table.enable', { name: data.name })"
    hide-label
    [[@update:model-value="onEnableClick(data)"]]
  />
</template>
```

Every table cell that enables one row is written this way.

## Binding a value that is not true or false

There is no way to do it. The switch is on when the model is the literal `true`, and the props that would change that pair are refused by the [allow-list](/foundations/components/reference.md#what-the-api-accepts). A setting stored as `"yes"` and `"no"` either converts at the call site or uses a `CCheckbox`, which takes the pair as props.

## Hiding the label

Where the words are already printed beside the switch, `hide-label` clips the label rather than removing it. The accessible name survives and so does the pairing that makes clicking those words work.

```vue
<template>
  <div class="flex items-center justify-between gap-4">
    <h3 class="text-heading">{{ $t("settings.analytics.share.label") }}</h3>
    <CToggle
      v-model="enabled"
      :label="$t('settings.analytics.share.label')"
      [[hide-label]]
    />
  </div>
</template>
```

Pass the same string to both, so the words on screen and the accessible name stay one thing. Keep the label rather than replacing it with an `aria-label`, which costs the click target on the words.

**Hiding the label takes the 8 pixel gap out of the layout as well**, so the visible box is exactly the switch.

## Disabling a toggle

`disabled` blocks the change, dims the switch to 0.6 opacity and dims the label with it. Say why it is disabled somewhere the pointer can find, and force the model to the state the control is claiming.

```vue
<template>
  <div v-tooltip="locked ? $t('workflows.workflowTable.upgradeTooltip') : undefined">
    <CToggle
      [[:model-value="locked ? false : data.enabled"]]
      [[:disabled="locked"]]
      :label="$t('workflows.workflowTable.enable', { name: data.name })"
      hide-label
      @update:model-value="() => onToggle(data)"
    />
  </div>
</template>
```

A directive on `CToggle` also reaches its wrapper, but an element the call site owns keeps the hit area under the caller's control. Disabled is the only way to stop a toggle responding, because no prop reaches read-only, so the choice [states](/foundations/states/usage.md#choosing-between-read-only-and-disabled) describes has one answer here.

<Preview
  light="/examples/component-toggle-states-light.svg"
  dark="/examples/component-toggle-states-dark.svg"
  alt="Six switches captioned off, hover, on, hover, focus and disabled"
  caption="Hover moves the track fill and leaves the knob where it is. The focus outline is drawn outside the track rather than over it."
/>

**A disabled label keeps the pointer it had.** Hide the label on any toggle that can be disabled, so the words are not on screen to invite a click that does nothing.

## Placing a toggle in a row

The wrapper is a block level flex row that holds the switch at the leading edge. Centring or pushing it is a job for the element around it: a `div` carrying `flex justify-center`, or an `HStack`.

<DoDont image="component-toggle-position">
<template #do>
<p>Put the alignment on a wrapper you own, where <code>justify-center</code> has a flex container to act on.</p>
</template>
<template #dont>
<p>Set <code>text-align</code> on the cell. A flex item does not move for it, which is what the four table columns setting it show today.</p>
</template>
</DoDont>

## Styling a toggle

**Nothing class-shaped survives the API.** A `class`, a `style`, a `label-class` and a pass-through object are all dropped with no warning, and the component spec pins that.

<DoDont image="component-toggle-class">
<template #do>
<p>Wrap the toggle and put the class on the wrapper, which keeps the margin on an element that accepts one.</p>
</template>
<template #dont>
<p>Write the class on the toggle. It is silently discarded, so the switch stays exactly where it was.</p>
</template>
</DoDont>

## Forwarding an attribute

An `id` is taken by the component for the input and the label, so passing one replaces the generated id. [Attributes](/components/toggle/reference.md#attributes) lists where every other shape lands.

```vue
<template>
  <CToggle v-model="isEnabled" label="Share analytics" [[id="analytics-switch"]] />
</template>
```

Two land somewhere surprising. `name` and `form` settle on the outer element rather than the input, so a toggle inside a real form submits nothing. A forwarded `aria-label` replaces the visible words as the accessible name, so write the words once, in `label`.
