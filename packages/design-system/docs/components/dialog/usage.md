# Using a dialog

How to open one, fill its three regions and choose its width. For the model behind these rules, see [Overview](/components/dialog.md). For every prop, event and slot, see [Reference](/components/dialog/reference.md).

## Opening a dialog

Two props are required. `visible` is a two-way model, so it is written `v-model:visible`, and `title` is the accessible name of the dialog.

```vue
<script setup lang="ts">
import { CDialog, CInput } from "@proxy-frontend/components";
import { ref } from "vue";

const isVisible = ref(false);
const name = ref("");
</script>

<template>
  <CDialog
    [[v-model:visible="isVisible"]]
    :title="$t('projects.createDialog.header')"
  >
    <CInput v-model="name" :label="$t('projects.createDialog.nameLabel')" />
  </CDialog>
</template>
```

**A one-way `:visible` compiles, and then the two sides stop agreeing.** Closing the dialog leaves the parent value true, so setting it true again changes nothing.

## Choosing a width

<Preview
  light="/examples/component-dialog-widths-light.svg"
  dark="/examples/component-dialog-widths-dark.svg"
  alt="Three dialog width bars at 400, 600 and 800 pixels, with a fourth dashed bar for the omitted case"
  caption="Each value is a cap, so the rendered width is min(100vw - 32px, cap)."
/>

Take `small` for a confirmation or a single field, `medium` for a form with a short body, and `large` for the widest forms. [Space](/foundations/space/usage.md#sizing-a-dialog) owns that choice.

<DoDont image="component-dialog-width">
<template #do>

Set the width with the `width` prop, which is the route the component exposes.

</template>
<template #dont>

Do not reach for a class, because the component refuses attributes and the dialog keeps shrinking to fit its content instead.

</template>
</DoDont>

## Filling the footer

**Supplying the footer slot is what makes the footer element exist.** It arrives as a padded, right-aligned row, so the buttons go straight in.

<DoDont>
<template #do>

```vue
<template #footer>
  <CButton
    :label="$t('projects.createDialog.cancel')"
    variant="text"
    @click="onCancel"
  />
  <CButton
    :label="$t('projects.createDialog.create')"
    severity="primary"
    @click="onCreate"
  />
</template>
```

The footer already lays its children out, so the slot holds the actions and nothing else.

</template>
<template #dont>

```vue
<template #footer>
  <div [[class="w-full px-4 flex items-center justify-end gap-2"]]>
    <CButton
      :label="$t('projects.createDialog.create')"
      severity="primary"
      @click="onCreate"
    />
  </div>
</template>
```

A row inside the row repeats the alignment and stacks 16 more pixels onto each side.

</template>
</DoDont>

## Padding the content

The content region is already padded at the sides and the bottom. **Padding written inside the slot adds to that rather than replacing it**, so a `p-4` wrapper renders 32 pixels down each side.

Reach for `VStack` when the fields inside need space between them, which is the rule [Space](/foundations/space/usage.md#spacing-with-the-layout-components) sets for spacing a group.

## Replacing the header

Filling the `header` slot replaces the title text. It does not replace `title`, which stays required as the accessible name, so the same translation key is often passed twice.

```vue
<CDialog
  v-model:visible="isVisible"
  :title="$t('workflows.nodeListDialog.header')"
  width="large"
>
  <template #header>
    <VStack :gap="2">
      <div [[class="text-title"]]>
        {{ $t("workflows.nodeListDialog.header") }}
      </div>
      <p class="text-fg-muted">
        {{ $t("workflows.nodeListDialog.description") }}
      </p>
    </VStack>
  </template>
</CDialog>
```

The `text-title` role has to be written by hand here, because the fallback that carried it is the thing being replaced. [Type](/foundations/type/reference.md#the-six-roles) has the role and what it renders at.

## Blocking dismissal

`:closable="false"` removes every way out except the footer, as [Overview](/components/dialog.md#dismissal-is-one-decision-not-three) explains.

```vue
<CDialog
  v-model:visible="isVisible"
  :title="$t('errors.detailedError.header')"
  [[:closable="false"]]
  width="medium"
>
  <template #footer>
    <CButton
      :label="$t('errors.detailedError.actions.reloadPage')"
      @click="onReload"
    />
  </template>
</CDialog>
```

## Addressing a dialog from outside

Identity attributes and listeners reach the dialog, and `class` and `style` do not. [Attributes](/components/dialog/reference.md#attributes) lists the filter.

```vue
<CDialog
  v-model:visible="isVisible"
  :title="$t('plugins.uninstall.header')"
  [[data-onboarding="plugin-uninstall"]]
  width="small"
/>
```

**An `aria-label` written at the call site loses to `title`.** Pass `aria-labelledby` instead when the name has to come from an element.

## Reacting to open and close

`@show`, `@hide` and `@after-hide` are not declared, but they pass the attribute filter and fire as the library emits them.

```vue
<CDialog
  v-model:visible="isVisible"
  :title="$t('projects.createDialog.header')"
  width="medium"
  [[@hide="onHide"]]
>
  <VStack :gap="4">
    <CInput v-model="name" :label="$t('projects.createDialog.nameLabel')" />
  </VStack>
</CDialog>
```

Clear whatever the dialog collected in that `hide` handler rather than when it next opens, so the second opening starts from an empty form.
