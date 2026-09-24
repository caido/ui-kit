# Feedback reference

Every indicator, threshold and duration. For what these mean, see [Overview](/foundations/feedback.md). For how to choose between them, see [Usage](/foundations/feedback/usage.md#picking-an-indicator).

Durations are in milliseconds and do not change when a user changes their interface text size.

## Indicators

| Wait | Shape | Indicator |
|---|---|---|
| Under 300ms | Either | Nothing |
| 300ms to 10s | Not known | Spinner |
| 300ms to 10s | Known | Skeleton |
| Over 10s | Measurable | Progress bar |
| Over 10s | No number obtainable | Spinner, and text saying what is happening |

## Timing

| | Value | What it is |
|---|---|---|
| Delay before an indicator appears | 300ms | Below this an indicator is noise |
| Minimum time on screen | 500ms | So an indicator that appears never strobes |
| Worst case added to a finished operation | 800ms | Delay plus floor, short of the 1s limit |
| Perception limit | 100ms | An action feels like it caused the result |
| Flow-of-thought limit | 1s | A train of thought stays unbroken |
| Attention limit | 10s | Past this a person has to be told how much longer |

The floor binds where `CLoading` owns both branches. Where a parent chooses between idle, loading and success with its own branch, the loading subtree unmounts as soon as the load finishes and there is nothing left to hold, so a load landing between 300ms and 800ms can still flicker. The delay binds in both places.

## Toasts

| | Value |
|---|---|
| Position | `bottom-center` |
| Visible at once | 3 |

## Toast durations

| Severity | On screen |
|---|---|
| `error` | Until dismissed |
| `warn` | Until dismissed |
| `success` | 3s plus 1s per 3 words, floor 4s, ceiling 12s |
| `info` | 3s plus 1s per 3 words, floor 4s, ceiling 12s |

## Toast politeness

| Severity | Role | Live |
|---|---|---|
| `error`, `warn` | `alert` | `assertive` |
| `success`, `info` | `status` | `polite` |

## The components

| Component | Prop | Type | Required |
|---|---|---|---|
| `CLoading` | `isLoading` | `boolean` | Yes |
| | `label` | `string` | Yes |
| `CProgress` | `value` | `number` | Yes |
| | `max` | `number` | Yes |
| | `label` | `string` | Yes |
| `CToast` | `group` | `string` | No |

`CLoading` takes an `indicator` slot for what stands in during the wait and a default slot for the content. It renders its own live region and holds both the delay and the floor. While a load is running and the delay has not elapsed it renders neither slot, so the space goes blank rather than stale. `CProgress` writes `role="meter"` and the real bounds from the counts it is given. Its accessible name is the label alone, so the counts are shown once and read once.

`useToast` returns `notifyError`, `notifyWarning`, `notifyInfo` and `notifySuccess`. Each takes the message and an optional `{ duration }`. The title is derived from the severity and comes from the message catalogue.

## Where every number comes from

| Value | Source |
|---|---|
| 100ms, 1s, 10s | Nielsen's three response-time limits |
| 300ms delay | The threshold below which an indicator reads as noise rather than as information |
| 500ms floor | Derived: the 1s limit minus the 300ms delay leaves 700ms, and 500 fits inside it |
| 3s plus 1s per 3 words | The usual toast reading-time guideline, floored at 4s and capped at 12s |
| 3 toasts | A fourth pushes the first off the screen before it has been read |
| `bottom-center` | Set once in `CToast`, so no mount point can differ |

## What not to write

| Avoid | Instead |
|---|---|
| A hand-rolled delay before an indicator | `CLoading`, which carries the threshold and the announcement |
| A spinner for a wait whose shape is known | A skeleton previewing the layout that replaces it |
| A progress bar with no real numerator | A spinner and a sentence saying what is happening |
| `role="progressbar"` on a quota | `role="meter"` with the real counts |
| A percentage passed as the count | The count and its maximum, so the number announced is the number shown |
| A duration on an error toast | Nothing. An error carries no timer |
| A title passed at a toast call site | Nothing. It is derived from the severity |
| A toast for a field error | The message beside the field |
| A live region rendered with its text already in it | The empty region first, the text afterwards |
