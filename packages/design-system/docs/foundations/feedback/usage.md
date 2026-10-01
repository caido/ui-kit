# Using feedback

How to pick an indicator, write it, and decide where a message belongs. For the model behind these rules, see [Overview](/foundations/feedback.md). For every threshold and duration, see [Reference](/foundations/feedback/reference.md).

## Picking an indicator

Three questions, asked in this order, and the first one that settles it wins.

**How long is the wait?** Under 300ms, write nothing at all. Between 300ms and 10 seconds, an indicator is owed. Over 10 seconds, a person has to be told how much longer.

**Is the shape already known?** A table whose columns are drawn and whose row height is fixed has one. A handshake does not.

**Is there a real numerator?** Only then is it a progress bar. Reaching for one without a number is how a bar ends up animating a guess.

## Previewing a shape you already have

When the layout is known before the data is, the indicator can be that layout.

<DoDont>
<template #do-example>
  <div class="w-full max-w-sm overflow-hidden rounded border border-line-subtle">
    <div class="flex items-center gap-2 border-b border-line-subtle bg-surface-raised px-3 py-2 text-caption text-fg-muted">
      <span class="w-14 shrink-0">Method</span>
      <span class="flex-1">Path</span>
    </div>
    <div class="flex h-20 flex-col justify-center gap-2 px-3">
      <div class="h-3 w-full animate-pulse rounded bg-surface-selected"></div>
      <div class="h-3 w-4/5 animate-pulse rounded bg-surface-selected"></div>
      <div class="h-3 w-3/5 animate-pulse rounded bg-surface-selected"></div>
    </div>
  </div>
</template>
<template #do>
  <p>A skeleton stands in at the height the rows will have, so nothing moves when the data lands.</p>
</template>
<template #dont-example>
  <div class="w-full max-w-sm overflow-hidden rounded border border-line-subtle">
    <div class="flex items-center gap-2 border-b border-line-subtle bg-surface-raised px-3 py-2 text-caption text-fg-muted">
      <span class="w-14 shrink-0">Method</span>
      <span class="flex-1">Path</span>
    </div>
    <div class="flex h-20 items-center justify-center px-3">
      <i class="fas fa-spinner animate-spin text-fg-muted icon-message" aria-hidden="true"></i>
    </div>
  </div>
</template>
<template #dont>
  <p>A spinner stands in a space whose shape was known, so the layout jumps when the rows land.</p>
</template>
</DoDont>

## Showing nothing when the wait is short

Run the 150ms load and watch the panel with the delay stay empty while the one without it flashes a spinner.

<DelayDemo />

`CLoading` owns the delay, the floor and the announcement. Hand it the flag and the two branches, and write none of the three yourself.

```vue
<template>
  <[[CLoading]] :is-loading="isLoading" label="Loading requests">
    <template #indicator><CTableRowsSkeleton /></template>
    <RequestTable />
  </CLoading>
</template>
```

A hand-rolled delay is the same rule implemented again, at a threshold nobody agreed, with no live region attached. `label` is required for that reason: a wait that announces nothing does not exist for anybody not watching the screen.

## Deciding whether a toast is the right answer

A toast has to clear both halves. If either one fails, the message belongs where somebody is already looking.

<DoDont>
<template #do-example>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <p class="text-caption text-fg-muted">Hostname</p>
    <div class="rounded border border-line-danger px-3 py-2 text-fg-default">example..com</div>
    <p class="text-caption text-fg-danger">Enter a valid hostname.</p>
  </div>
</template>
<template #do>
  <p>The message sits with the field it is about, so it is there when somebody looks down to fix it.</p>
</template>
<template #dont-example>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <p class="text-caption text-fg-muted">Hostname</p>
    <div class="rounded border border-line-danger px-3 py-2 text-fg-default">example..com</div>
    <div class="flex items-center gap-2 rounded border border-line-subtle bg-surface-raised px-3 py-2 text-caption text-fg-default">
      <i class="fas fa-circle-xmark text-fg-danger" aria-hidden="true"></i>
      <span>Enter a valid hostname.</span>
    </div>
  </div>
</template>
<template #dont>
  <p>The message floats away from the field it is about, so it is gone before anybody has fixed it.</p>
</template>
</DoDont>

A message also belongs inline when it needs an action to resolve, when it is the failure of the task being done right now, and when one operation would fire several messages at once.

## Choosing a severity, and letting it choose the rest

There are four calls, `notifyError`, `notifyWarning`, `notifyInfo` and `notifySuccess`, and picking one settles the title, the duration, the role and the politeness together.

```ts
const { notifyError, notifySuccess } = useToast();

[[notifyError]]("Could not reach the upstream host.");
[[notifySuccess]]("Project exported.");
```

## Never writing the title or the timer

**The title is not yours to pass.** It is derived from the severity and comes from the message catalogue, so the four possible titles live in one place rather than drifting into four hundred spellings of the word Error.

**The timer is not yours to override.** An error carries none on purpose, and handing one a duration turns a message somebody has to act on into a message that leaves on its own.

## Naming a bar that fills up

Write the counts, and the role and the bounds follow from them.

<DoDont>
<template #do-example>
  <div class="flex w-full max-w-sm flex-col gap-2 rounded bg-surface-raised p-3">
    <p class="text-caption text-fg-muted">Projects (3 / 5)</p>
    <div class="h-3 w-full overflow-hidden rounded bg-surface-page">
      <div class="h-full w-3/5 rounded bg-fill-secondary"></div>
    </div>
  </div>
</template>
<template #do>
  <p>A meter carrying the real counts. It announces three of five, which is what it shows.</p>
</template>
<template #dont-example>
  <div class="flex w-full max-w-sm flex-col gap-2 rounded bg-surface-raised p-3">
    <div class="flex items-center justify-between text-caption text-fg-muted">
      <span>Projects</span>
      <span class="font-mono">60%</span>
    </div>
    <div class="h-3 w-full overflow-hidden rounded bg-surface-page">
      <div class="h-full w-3/5 rounded bg-fill-secondary"></div>
    </div>
  </div>
</template>
<template #dont>
  <p>The same bar handed a percentage. It announces 60, and claims an operation is running.</p>
</template>
</DoDont>

`CProgress` takes the counts rather than the percentage, and writes the role and the bounds from them. Pass a bare noun as the `label`, because the component prints the counts after it and reads the label alone as the name.

## Announcing a wait

You do not write the live region. `CLoading` renders it, empty, the moment the loading branch mounts, and the text arrives 300ms later with the indicator.

That ordering is the whole trick, and it fails with no warning and no error when it is reversed. If you are building a wait that cannot go through `CLoading`, render the empty region first and fill it afterwards.

A scrollable region that is loading marks itself `aria-busy="true"` as well, so a screen reader knows the rows underneath are not final. `CTable` does this for you, and hands its `loadingLabel` to `CLoading` as the announcement, so a table that leaves `loadingLabel` unset waits in silence. Anywhere else, set `aria-busy` yourself.
