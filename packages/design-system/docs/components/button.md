---
outline: false
pageClass: wide
---

# Button

A button commits an action in the current context. Emphasis is how the interface says which action matters, so the rung a button paints from is a statement about intent, not decoration.

Caido ships two buttons. PrimeVue's `Button` under the `@caido/primevue` pass-through preset carries the product UI, 387 tags in `packages/ui/src`, and `CButtonV2` from `@caido/common-frontend` carries the shared components. Both read the same ramps.

<PageTabs :tabs="['Examples', 'Code', 'Usage']">

<template #examples>

The specimens below are the documentation's own button, painted from the extracted token scope. What each shipping severity paints, in tokens and measured ratios, is in the Code tab.

### Emphasis

Emphasis is a severity crossed with a fill weight. Solid commits, outlined offers a real alternative, text is for repeated chrome like toolbars and table rows.

<Preview title="Emphasis">
  <DsButton variant="primary" icon="fas fa-paper-plane" label="Send request" />
  <DsButton variant="secondary" label="Save" />
  <DsButton variant="ghost" label="Cancel" />
</Preview>

The house default is `severity="contrast"`, on 194 of the 387 buttons. Unset severity paints the brand crimson solid, and 119 buttons leave it unset.

### Destructive actions

Danger is one of the colour roles, not a fourth emphasis level. It crosses with `text` and `outlined`, so a destructive action can take any weight without a new token.

<Preview title="Danger">
  <DsButton variant="primary" danger label="Delete project" />
  <DsButton variant="secondary" danger label="Delete" />
  <DsButton variant="ghost" danger label="Remove" />
</Preview>

### Sizes

Three sizes. The preset sets type size and padding only, so the height falls out of the line box rather than snapping to a ladder rung.

<Preview title="Sizes" note="small / default / large">
  <DsButton size="sm" variant="secondary" label="Small" />
  <DsButton size="md" variant="secondary" label="Medium" />
  <DsButton size="lg" variant="secondary" label="Large" />
</Preview>

Small and large both move the type, `text-sm` down and `text-xl` up. Only the default size leaves it at the inherited 1rem.

### States

Tab into the row to see the focus ring. Loading keeps the resting label, because the preset swaps the icon for a spinner and leaves the label element in place.

<Preview title="States">
  <DsButton variant="primary" label="Default" />
  <DsButton variant="primary" label="Send request" loading />
  <DsButton variant="primary" label="Disabled" disabled />
  <DsButton variant="secondary" label="Tab to me" />
</Preview>

### Icon only

Dropping the label drops the horizontal padding and fixes the width at `w-10`, 2.5rem. The label element stays in the DOM, invisible and zero width.

<Preview title="Icon only">
  <DsButton variant="secondary" icon="fas fa-plus" label="Add" icon-only />
  <DsButton variant="ghost" icon="fas fa-xmark" label="Close" icon-only />
  <DsButton variant="ghost" danger icon="fas fa-trash" label="Delete" icon-only />
</Preview>

</template>

<template #code>

### Props

The shipping surface is PrimeVue's `Button`. These are the props the product actually sets.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | | The button text. Omit it for an icon-only button, then supply `aria-label`. |
| `icon` | string | | FontAwesome class, for example `fas fa-plus`. |
| `severity` | `contrast` `danger` `secondary` `success` `info` `warn` `help` | unset | Colour role. Unset paints the brand crimson solid. |
| `text` | boolean | `false` | Transparent fill, no border. Used 103 times. |
| `outlined` | boolean | `false` | Transparent fill with a 1px border in the severity colour. Used 100 times. |
| `size` | `small` `large` | unset | Sets type size and padding. It does not set a height. |
| `loading` | boolean | `false` | Swaps the icon for a spinner and blocks activation. |
| `disabled` | boolean | `false` | Applies `opacity-60` and `pointer-events-none`. |

### What each severity paints

Solid rows measure the label against its own fill. Text rows measure the ink against the page canvas.

| Combination | Light token | Dark token | Light ratio | Dark ratio |
|---|---|---|---|---|
| unset, solid | `--c-primary-500` | `--c-primary-700` | 7.35:1 | 6.25:1 |
| `contrast`, solid | `--c-surface-900` | `--c-surface-300` | 16.41:1 | 6.50:1 |
| `contrast`, text | `--c-surface-900` | `--c-surface-300` | 14.23:1 | 6.50:1 |
| `danger`, solid | `--c-danger-500` | `--c-danger-400` | 7.75:1 | 6.54:1 |
| `danger`, text | `--c-danger-400` | `--c-danger-400` | 5.53:1 | 6.54:1 |
| `success`, solid | `--c-success-500` | `--c-success-400` | 7.52:1 | 4.60:1 |
| `info`, text | `--c-info-400` | `--c-info-400` | 5.41:1 | 5.54:1 |
| `secondary`, text | `--c-secondary-400` | `--c-secondary-400` | 5.43:1 | 6.47:1 |

### The one re-anchoring

The preset hardcodes `bg-primary-700` for the unset solid button. In the dark ramp `--c-primary-700` is the brand crimson, but the light ramp carries the brand at 500.

So `primevue.css` re-points `--p-primary-700` at `--c-primary-500` for light only. Both rungs are `346deg 66% 38%`, so the solid button paints the identical crimson in either theme.

### Class strings

You write the component, the preset emits the classes. This is the resolved colour and geometry for `severity="contrast"` at the default size.

```html
<button
  class="items-center inline-flex text-center align-bottom justify-center
         leading-[normal] text-nowrap px-3 py-2 gap-2 rounded-md
         text-white dark:text-surface-900
         bg-surface-900 dark:bg-surface-300
         border border-surface-900 dark:border-surface-300
         focus:outline-none focus:ring-1
         focus:ring-surface-500 dark:focus:ring-surface-0">
  Send request
</button>
```

Adding `text` and `size="small"` replaces the fill and the padding, and nothing else.

```html
<button
  class="items-center inline-flex justify-center text-sm py-1.5 px-3 gap-2 rounded-md
         bg-transparent border-transparent
         text-surface-900 dark:text-surface-300
         hover:bg-surface-900/10">
  Cancel
</button>
```

Colour classes resolve through two plugins. `bg-danger-400` and `text-ink-strong` read Caido's `--c-*` tokens directly, while `bg-surface-900` and `bg-primary-700` route through the PrimeVue `--p-*` layer that `primevue.css` points back at the same ramps.

A leading icon carries both the root `gap-2` and its own `mr-2`, so it sits 1rem from the label rather than 0.5rem.

</template>

<template #usage>

### When to use

Use a button to commit an action: send, save, delete, apply. Use a link to navigate somewhere instead, because a link changes location and a button changes state.

### Emphasis

<DoDont do="Give one action per view the solid emphasis." dont="Give two actions the solid emphasis, so neither reads first.">
  <template #do>
    <DsButton variant="ghost" label="Cancel" />
    <DsButton variant="primary" label="Send request" />
  </template>
  <template #dont>
    <DsButton variant="primary" label="Cancel" />
    <DsButton variant="primary" label="Send request" />
  </template>
</DoDont>

<DoDont do="Use danger only for the action that destroys something." dont="Use danger for every action here, and urgency stops reading.">
  <template #do>
    <DsButton variant="primary" danger label="Delete project" />
    <DsButton variant="secondary" label="Export" />
  </template>
  <template #dont>
    <DsButton variant="primary" danger label="Delete project" />
    <DsButton variant="primary" danger label="Export" />
  </template>
</DoDont>

### Loading

<DoDont do="Keep the label while loading, so the button holds its width." dont="Drop the label while loading, so the row reflows under the pointer.">
  <template #do>
    <DsButton variant="primary" label="Send request" loading />
  </template>
  <template #dont>
    <DsButton variant="primary" label="" icon-only loading />
  </template>
</DoDont>

### Sizes

Size is padding plus type, not a fixed height, so a button and the field beside it only line up when both take the same size. Small is `text-sm py-1.5 px-3`, the default is `px-3 py-2`, and large is `text-xl py-3 px-4`.

The root font size is 14px, so `px-3` is 10.5px and `w-10` is 35px. Every rem in the product resolves against 14, not 16.

### Accessibility

Every button is a native `<button>`, so it is focusable, activates on both Enter and Space, and announces its role without any ARIA.

An icon-only button needs an `aria-label`. Of the 87 icon-only buttons in `packages/ui/src`, 34 carry one, and the rest announce as "button" and nothing else.

The focus ring is a 1px `ring` in one tone per severity. It is drawn outside the border box, so it cannot change the control's size, and it is keyed to `focus` rather than `focus-visible`, so a pointer click shows it too.

Disabled buttons dim to `opacity-60` over whatever sits behind them. A contrast solid button measures 4.51:1 disabled in light and 3.29:1 in dark, which is why an opacity dim cannot be read as one fixed contrast value.

### Content

Label buttons with a verb and an object: "Send request", not "OK". Sentence case, no terminal punctuation, three words at most.

### Where it falls short

These are measured against what ships today, not against an intended palette.

| Combination | Measured | Cause |
|---|---|---|
| `secondary`, solid | 2.62:1 light, 2.31:1 dark | Gold is a fill rung in both ramps, and both label choices are mid-luminance. |
| unset, focus ring | 1.64:1 light, 8.23:1 dark | The ring is `primary-300`, which the light ramp keeps as a pale tint. |
| `info`, solid | 3.68:1 light | The light branch is Tailwind's stock `blue-500`, outside the Caido ramps. |
| unset, text | 2.96:1 dark | The preset sets no dark branch, and dark's `--c-primary-600` sits close to the canvas. |

Two rows fail in light only, one in dark only, and the gold row in both. Dark did not move for Paper, so its failures predate it.

</template>

</PageTabs>
