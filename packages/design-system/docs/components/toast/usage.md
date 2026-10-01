# Using a toast

How to mount the host, send it a message and replace what a message draws. For the model behind these rules, see [Overview](/components/toast.md). For every prop, event and slot, see [Reference](/components/toast/reference.md).

## Mounting the host

Write one `CToast` per route shell, near the root of that shell, with nothing inside it.

```vue
<script setup lang="ts">
import { CToast } from "@proxy-frontend/components";
</script>

<template>
  <CToast />
</template>
```

<Preview
  light="/examples/component-toast-stack-light.svg"
  dark="/examples/component-toast-stack-dark.svg"
  alt="Three stacked toast messages in a fixed column at the bottom centre of a cropped window, with the offsets from the bottom edge measured"
  caption="Fixed at the bottom centre, 36px clear of the window edge, 16px between messages, three at a time."
/>

**A second ungrouped host on screen at the same time draws each ungrouped message twice**, because the event bus offers every message to every host whose group matches. The two hosts written without a group sit on routes that never render together.

## Sending a message

The composable returns four calls, and picking one settles the title, the duration, the accessible role and the politeness together. [Feedback](/foundations/feedback/usage.md#choosing-a-severity-and-letting-it-choose-the-rest) owns that choice.

```ts
import { useToast } from "@proxy-frontend/components";

const { notifyError, notifySuccess } = useToast();

notifyError("Could not reach the upstream host.");
notifySuccess("Project exported.");
```

Whatever calls this does not have to sit under the host. Anything mounted under the application root can send, and the message finds the column on its own.

Pass the text and stop there. The title comes from the severity through the message catalogue, so the word Error is spelled once rather than once per call site, and [Feedback](/foundations/feedback/usage.md#never-writing-the-title-or-the-timer) explains why the timer is settled the same way.

## Setting a duration

`duration` is the one option, written in milliseconds, and it is the only part of a lifetime a call site can reach.

```ts
notifyInfo(message, [[{ duration: 5000 }]]);
```

Three places in the interface pass one: the frontend SDK, which hands a plugin author's value straight through, one replay path that gives a particular error four seconds, and the AI provider path that gives a failed request five. **Handing a duration to `notifyError` or `notifyWarning` turns a message somebody has to act on into one that leaves on its own**, which is what the last two of those do, so argue with them rather than copying them.

## Replacing the body of a message

Set a `group` and fill the `message` slot. Both are needed together: an ungrouped host receives the traffic from the composable as well, and would draw those messages through the same template.

A grouped host stays empty until a message carrying the same string reaches it, and the composable sets no group, so such a message is pushed onto the event bus through the toast composable the component library ships.

```vue
<script setup lang="ts">
import { CToast, VStack } from "@proxy-frontend/components";

const GROUP = "browser-engine-update";
</script>

<template>
  <CToast [[:group="GROUP"]]>
    <template #message="{ message }">
      <VStack :gap="1" class="min-w-0 flex-auto">
        <span class="text-heading text-fg-info-strong">{{ message.summary }}</span>
        <span class="text-fg-strong">
          {{ $t("authenticated.browserEngine.updateAvailableMessage") }}
        </span>
      </VStack>
    </template>
  </CToast>
</template>
```

**The slot replaces the icon, the title and the detail for every message that host receives**, and it is handed the message as its scope. The close control is a sibling and stays. Nothing wraps the slot content, so it supplies its own sizing: `flex-auto min-w-0` on the wrapper, or the close control takes the width.

## Colouring text on a toast surface

A message drawn by the preset already carries the right colour. Inside the slot that colour has to be written, and there is one pairing that looks correct and is not.

<DoDont image="component-toast-contrast">
<template #do>

Take the foreground token the severity itself paints, `fg-info-strong` on an info surface, measured at 8.20:1 in light and 4.54:1 in dark. Secondary text takes `fg-strong`.

</template>
<template #dont>

Reach for `fg-on-info`. The `fg-on-*` tokens are measured against the solid `fill-*-strong` colours rather than against a toast surface, so this pairing is untested: it measures 1.40:1 in light, and the 7.51:1 it happens to reach in dark comes from that surface rather than from a checked pair.

</template>
</DoDont>

[Colour](/foundations/colour/usage.md#putting-text-on-a-solid-fill) owns which foreground belongs on which background, and [measuring an unchecked pairing](/foundations/colour/usage.md#measuring-an-unchecked-pairing) covers what to do when the pairing is new.

## Addressing the host from outside

`data-*`, `aria-*`, a listener and the three names `id`, `name` and `form` reach the column. `class` and `style` do not, which is the filter [Components](/foundations/components/reference.md#what-the-api-accepts) sets for the layer.

```vue
<CToast [[data-testid="toast-host"]] />
```

**A class written here is not a weak style that something else beats.** It is dropped before it reaches the DOM, so the element carries no trace of it. To colour one message rather than the host, use the slot above.

## Reacting to a dismissal

`@close` reaches the element underneath as a listener and fires with the message that was dismissed. It fires when somebody clicks the close control, and when the three message cap removes the oldest.

```vue
<CToast [[@close="onDismissed"]] />
```

**It does not fire when a message reaches the end of its own life**, which emits `life-end` instead. Put whatever has to happen after a message on the call that sent it rather than on a handler here.
