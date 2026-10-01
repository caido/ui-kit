# Using toggle

How to write a toggle, bind it, hide its label and place it in a row. For what the component decides, see [Overview](/components/toggle.md). For every prop and attribute, see [Reference](/components/toggle/reference.md).

## Writing a toggle

Two things are required and the other two have defaults. Pass a `label` and bind a model.

```vue
<template>
  <CToggle [[v-model="isEnabled"]] [[label="Intercept requests"]] />
</template>
```

**The model is required rather than optional.** It is declared with `required: true`, so a toggle written without one warns at render rather than defaulting to off. A `Maybe<boolean>` out of a store has to be resolved to a real boolean before it is bound.

The label is a plain string and there is no slot to replace it, so text written between the tags is discarded. The string is interpolated rather than parsed, so markup inside it renders as the characters that were typed.

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

Five of the nine call sites in the interface are written this way, all of them a table cell enabling one row. The shape reads the same as `v-model` to everything downstream.

## Binding a value that is not true or false

There is no way to do it. The switch is on when the model is the literal `true`, and the two props of the component library that would change that pair are refused by the [allow-list](/foundations/components/reference.md#what-the-api-accepts) before they reach it. A setting stored as `"yes"` and `"no"`, or as `1` and `0`, either converts at the call site or uses a `CCheckbox`, which takes the pair as props.

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

Pass the same string to both, as the settings rows do, so that the words on screen and the name in the accessibility tree stay one thing. Keep the label element itself: replacing it with an `aria-label` looks tidier and costs the click target on the words.

**Hiding the label takes the 8 pixel gap out of the layout as well.** The clipped label is positioned absolutely, so it stops being an item in the flex row, and the visible box is then exactly the 40 by 24 pixel switch.

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

A directive written on `CToggle` reaches the wrapper the component renders, because that wrapper is a single element root, so the tooltip works either way. Put it on an element the call site owns, as the workflow table does, and the hit area stays under the control of the caller. Disabled is also the only way to stop a toggle responding: read-only belongs to the component library underneath and no prop reaches it, so the choice [states](/foundations/states/usage.md#choosing-between-read-only-and-disabled) describes has one answer here.

<Preview
  light="/examples/component-toggle-states-light.svg"
  dark="/examples/component-toggle-states-dark.svg"
  alt="Six switches captioned off, hover, on, hover, focus and disabled"
  caption="Hover moves the track fill and leaves the knob where it is. The focus outline is drawn outside the track rather than over it."
/>

**A disabled label keeps the pointer it had.** Hide the label on any toggle that can be disabled, as all nine call sites do, so the words are not on screen to invite a click that lands and does nothing.

## Placing a toggle in a row

The wrapper the component renders is a block level flex row, so it fills the width it is handed and holds the switch at the leading edge. Centring or pushing it is a job for the element around it: a `div` carrying `flex justify-center`, or an `HStack`, and the alignment then belongs to the column rather than to the control.

<DoDont image="component-toggle-position">
<template #do>
<p>Put the alignment on a wrapper you own, where <code>justify-center</code> has a flex container to act on.</p>
</template>
<template #dont>
<p>Set <code>text-align</code> on the cell. A flex item does not move for it, which is what the four table columns setting it show today.</p>
</template>
</DoDont>

## Styling a toggle

**Nothing class-shaped survives the API.** A `class`, a `style`, a `label-class` and a pass-through object are dropped before the page, with no warning and no error, and the component spec sets three of the four at once and asserts that the class they carry paints nothing.

<DoDont image="component-toggle-class">
<template #do>
<p>Wrap the toggle and put the class on the wrapper, which keeps the margin on an element that accepts one.</p>
</template>
<template #dont>
<p>Write the class on the toggle. It is silently discarded, so the switch stays exactly where it was.</p>
</template>
</DoDont>

## Forwarding an attribute

Four shapes get through: `data-*`, `aria-*`, a listener, and the names `name` and `form`. An `id` is taken by the component for the input and the label, so passing one replaces the generated id rather than landing anywhere else.

```vue
<template>
  <CToggle v-model="isEnabled" label="Share analytics" [[id="analytics-switch"]] />
</template>
```

Two of those land somewhere surprising. `name` and `form` pass the filter and settle on the outer element of the switch rather than on the input, so a toggle inside a real form contributes nothing to what the form submits. An `aria-label` passes too and is merged onto the input after the name the component built, which means it wins and the visible words stop being the accessible name.

Write the words once, in `label`, and let the component carry them to the input.
