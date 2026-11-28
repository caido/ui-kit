# Feedback

Feedback in Caido is what the interface says while somebody waits, and what it says once something has happened. Two questions settle every case: how long the wait is, and whether the shape of what is arriving is already known.

This page explains the model. [Usage](/foundations/feedback/usage.md) shows how to apply it, and [Reference](/foundations/feedback/reference.md) lists every indicator, threshold and duration.

## Three indicators, and the test that separates them

<Indicators />

Length decides whether an indicator appears at all, and past 10 seconds whether a number is owed as well. What separates the three is a different test. **It is whether the layout on the far side of the wait is already known.**

A table loading its rows takes a skeleton, because its columns and row height are known before the data is. A socket that is still connecting keeps a spinner and a line of text, because nothing is known about what arrives or when. A progress bar is unavailable until something can supply a real numerator.

Two of the three move, under exceptions that [motion](/foundations/motion.md#what-animates-and-what-never-does) sets out: a skeleton animates opacity only, and a spinner falls under the preload exception.

## The thresholds are perception rather than taste

The 0.1 second, 1 second and 10 second limits are Nielsen's response-time limits, and each one names something that happens to a person rather than something somebody preferred. [Timing](/foundations/feedback/reference.md#timing) lists what each one holds. Moving one of them is a claim about perception, and it needs the same kind of evidence.

Past 10 seconds the rule asks for a progress bar, and sometimes no number exists to put in one. An unbounded wait is not a progress bar with the numbers left out. It is a spinner and a sentence saying what is happening and that it is safe to wait.

## Nothing is a state, and it needs a component

Showing nothing under 300ms is not a convention a call site can be trusted to follow. It is a component, and it carries two numbers.

**The delay is 300ms**, so a fast load never flashes an indicator.

**The floor is 500ms** once the indicator does appear, so it never strobes. It is derived rather than chosen: the delay has already spent 300ms of the 1 second limit, and any floor under the remaining 700ms cannot make a finished operation feel delayed.

**The delay is deliberately not `duration-surface`**, which is also 300ms. A transition duration and a perception threshold only happen to share a number, and binding them would let a motion change move a perception threshold.

The floor applies to failure as well as success. Otherwise a fast flicker would come to mean that something went wrong.

## A meter is not a progress bar

<div data-ds class="grid grid-cols-1 gap-4 rounded border border-line-subtle bg-surface-raised p-6 md:grid-cols-2">
  <div class="flex flex-col gap-2">
    <p class="text-caption text-fg-muted">Projects (3 / 5)</p>
    <div class="h-3 w-full overflow-hidden rounded bg-surface-page">
      <div class="h-full w-3/5 rounded bg-fill-secondary"></div>
    </div>
    <p class="font-mono text-caption text-fg-success">role="meter"</p>
  </div>
  <div class="flex flex-col gap-2">
    <p class="text-caption text-fg-muted">Projects</p>
    <div class="h-3 w-full overflow-hidden rounded bg-surface-page">
      <div class="h-full w-3/5 rounded bg-fill-secondary"></div>
    </div>
    <p class="font-mono text-caption text-fg-danger">role="progressbar"</p>
  </div>
</div>

`role="progressbar"` says an operation is in progress. A quota read against a plan limit is not an operation, so a bar that shows how full something is takes `role="meter"`, and only a bar that shows how far along an operation is keeps `role="progressbar"`.

Changing the role is not enough on its own, because a value handed over as a percentage announces 60 for three of five. [Naming a bar that fills up](/foundations/feedback/usage.md#naming-a-bar-that-fills-up) shows how to pass the real counts.

## A toast is for something you are not looking at

A toast is a message about something that is **not where you are looking**, and that needs **nothing from you**. Both halves have to hold, and when either one fails the message belongs inline instead.

**An auto-dismissing message is a time limit**, and WCAG 2.2.1 requires a time limit to be switched off, adjusted or extended. The cleanest way to satisfy it is not to have one, so an error and a warning carry no timer at all.

Success and info confirm something somebody has just done. Losing one costs nothing, so they stay for as long as their own text takes to read and then go.

## An error or a warning interrupts

The component library draws every toast as an alert, which cuts off whatever a screen reader was saying. That is right for an error and a warning, because something has gone wrong and it changes what to do next. For a confirmation it is wrong, so a success and an info are polite and wait their turn.

## What a screen reader is told about a wait

A loading state that announces nothing does not exist for anybody who is not looking at it.

The region is announced politely, because a wait is a status rather than an alert. **The region has to exist before the message does.** A live region injected together with its text announces nothing, because no region was being watched when the text arrived.

The delay solves this at no cost: the empty region renders when the loading branch mounts, and the text lands 300ms later with the indicator. It lives in the shared component, so no screen has to remember it.
