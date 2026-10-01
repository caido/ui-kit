# Using components

How to work with an API that refuses things, and what to do with the class you were about to pass. For the model behind these rules, see [Overview](/foundations/components.md). For the components and the vocabulary, see [Reference](/foundations/components/reference.md).

## Passing identity through a component

Four kinds of attribute reach a component, and nothing else does.

`data-*` for anything that addresses the element from outside, `aria-*` for semantics, a listener, and the three names `id`, `name` and `form`.

```vue
<template>
  <CButton [[data-onboarding="plugin-install"]] label="Install" @click="install" />
</template>
```

A labelled control takes `id` back off you and puts it on the inner input. Passing one still works, and the label points at it.

## Working out what a class was for

A class you were about to pass is one of three things, and only the last one is yours to keep.

**The same value at every call site.** That is a default the component should have owned. Move it inside and delete it from all of them.

**A different value per call site, from a small set.** That is a semantic prop the component is missing. Name the meaning rather than the appearance, so the prop is `severity` rather than a colour.

**Layout around the component.** That belongs to the parent, and it does not arrive as a class either.

Counting the call sites is what tells you which. Reading them is what tells you whether the answer is one prop or three.

## Laying things out

Space between things is the caller's, and it comes from the layout primitives rather than from a margin on a child.

<DoDont>
<template #do>

```vue
<template>
  <HStack [[:gap="2"]]>
    <CButton label="Save" severity="primary" />
    <CButton label="Cancel" variant="text" />
  </HStack>
</template>
```

The group owns the gap, so removing or reordering a child changes nothing.

</template>
<template #dont>

```vue
<template>
  <div>
    <CButton label="Save" severity="primary" [[class="mr-2"]] />
    <CButton label="Cancel" variant="text" />
  </div>
</template>
```

The gap is written on a child, and the class is refused anyway.

</template>
</DoDont>

On the layout primitives, `gap` and `padding` accept the eight rungs as a closed union, so an off-ladder value is a type error rather than something a reviewer has to notice. [Space](/foundations/space.md#the-layout-components-carry-the-gap) covers why that guarantee stops at the primitives.

## Reading an escape hatch before removing it

Refusing an escape hatch without reading its uses deletes a feature nobody wrote down.

Read every value passed through it first. That is what tells the difference between a missing default, a missing prop, and something genuinely nobody needs. One prop that looked like a dozen different layout decisions turned out to be mostly missing defaults, a few decisions the component should have owned, and several values that were already dead.

## Counting by import, never by tag name

A tag name is a local alias somebody picked in one file. The same component imported under two spellings is one component and two counts.

That is not a rounding error. A survey counted by tag once missed enough call sites to produce the wrong rule rather than a slightly wrong number.

## Never reaching for a stronger selector

A call site fighting a component with `!important` is evidence, not carelessness. Something the caller needed was not in the API.

The fix is upstream: work out which of the three things above it was, and add it. An override that wins today wins until the component changes underneath it, and then it stops, quietly.

## Deciding whether something needs a prop

The test is what happens to a caller who does not get it.

**Does its absence push the caller onto another mechanism inside the layer?** Then it is composition, and the answer is no. Somebody wraps the component, or uses a different one.

**Does its absence push the caller outside the layer?** Then it is a permanent exception, and an exception is what the next person copies. Add the prop.

The library underneath having a prop is not evidence the layer needs one. A prop only worth having if its value can be named is not worth having: one that positioned an icon became a separate trailing-icon prop instead, because an icon in an unspecified position is not a thing anybody can mean. Name the value before adding the prop, and leave the prop out when the name will not come.
