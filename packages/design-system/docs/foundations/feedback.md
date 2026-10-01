# Feedback

Feedback in Caido is what the interface says while somebody waits, and what it says once something has happened. Two questions settle every case: how long the wait is, and whether the shape of what is arriving is already known.

Which indicator looks better on the screen is not one of them.

This page explains the model. [Usage](/foundations/feedback/usage.md) shows how to apply it, and [Reference](/foundations/feedback/reference.md) lists every indicator, threshold and duration.

## Three indicators, and the test that separates them

<Indicators />

Length decides whether an indicator appears at all, and past 10 seconds whether a number is owed as well. What separates the three is a different test. **It is whether the layout on the far side of the wait is already known.**

That is why a table loading its rows takes a skeleton. The columns are known, the row height is a required prop, and the header is already drawn and stays drawn. Nothing about that wait is shapeless, and a spinner in the middle of it throws away a layout the interface already has.

A socket that is still connecting keeps its spinner, and carries a line of text saying so. The table around it is already drawn, but nothing is known about what arrives in it or when, so there is no shape for a skeleton to preview.

A progress bar answers a different question again, and it is unavailable until something can supply a real numerator.

Two of the three move, and [motion](/foundations/motion.md#what-animates-and-what-never-does) carries the exceptions that let them. A skeleton animates opacity and nothing else, which WCAG 2.3.3 excludes from its definition of motion animation. A spinner rotates, and falls under the preload exception, where showing nothing would suggest the interface had frozen.

## The thresholds are perception rather than taste

The three numbers are Nielsen's response-time limits, and each one names something that happens to a person rather than something somebody preferred.

| Limit | What it holds |
|---|---|
| 0.1 second | An action still feels like it caused the result |
| 1 second | A train of thought stays unbroken |
| 10 seconds | Attention holds without being told how much longer |

So the ladder is not a set of durations anybody chose. Moving one of them is a claim about perception, and it needs the same kind of evidence the original carries.

Past 10 seconds the rule asks for a progress bar, and sometimes no number exists to put in one. That case is written down rather than folded quietly into the nearest indicator, because an unbounded wait is not a progress bar with the numbers left out. It is a spinner and a sentence saying what is happening and that it is safe to wait.

## Nothing is a state, and it needs a component

Showing nothing under 300ms is not a convention a call site can be trusted to follow. It is a component, and it carries two numbers.

**The delay is 300ms**, so a fast load never flashes an indicator.

**The floor is 500ms** once the indicator does appear, so it never strobes. That second number is derived rather than chosen.

1 second is the limit the whole rule protects, and the delay has already spent 300ms of it before anything appears. That leaves 700ms, so any floor at or under 700 cannot make a finished operation feel delayed. 500 sits inside it and puts the worst case at 800ms.

Anybody moving the floor is held under 700, and if the delay changes, that ceiling moves with it.

**The delay is deliberately not `duration-surface`**, which is also 300ms. A transition duration and a perception threshold are two different quantities that happen to collide at one number, and binding them together means a future motion change silently moves a perception threshold.

The floor applies to failure as well as success. If it held a success behind the indicator but let an error through at once, somebody would learn that a fast flicker means something went wrong, which is an accidental signal built out of a timing rule.

## A meter is not a progress bar

The two bars below are the same drawing. Only the first one is telling the truth about what it is.

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

`role="progressbar"` says an operation is in progress. A quota read against a plan limit is not an operation, and announcing three of five projects used as one is the interface making a false statement about itself.

A bar that shows how full something is takes `role="meter"`. A bar that shows how far along an operation is keeps `role="progressbar"`.

Changing the role is not enough on its own. The component library derives `aria-valuenow` from the value it is handed, and that value is a percentage, so a meter left otherwise untouched announces 60 for three of five. The real counts have to be written explicitly, and the accessible name is the label alone, so the counts are shown once and read once.

## A toast is for something you are not looking at

A toast is a message about something that is **not where you are looking**, and that needs **nothing from you**. Both halves have to hold, and when either one fails the message belongs inline instead.

Auto-dismissal is the half that carries an obligation. **An auto-dismissing message is a time limit**, and WCAG 2.2.1 requires a time limit to be switched off, adjusted to at least ten times its default length, or extended on request. The cleanest way to satisfy a criterion about time limits is not to have one, so an error and a warning carry no timer at all, which is stronger than making one adjustable.

Success and info confirm something somebody has just done. They carry nothing to act on and losing one costs nothing, so they stay for as long as their own text takes to read and then go.

## An error or a warning interrupts

The component library draws every toast as an alert, which clears the speech queue and cuts off whatever a screen reader was saying. That is right for an error and for a warning. For a confirmation it is wrong, because the alert role interrupts somebody mid-sentence to tell them what they already know.

An error and a warning are assertive, because something has gone wrong and it changes what to do next. A success and an info are polite and wait their turn.

## What a screen reader is told about a wait

A loading state that announces nothing does not exist for anybody who is not looking at it.

The region is announced politely, because a wait is a status rather than an alert. **The region has to exist before the message does.** A live region injected together with its text announces nothing, because no region was being watched when the text arrived, and that is the most common way a live region fails silently.

The delay closes it at no cost. The empty region renders when the loading branch mounts, and the text lands 300ms later, when the indicator becomes visible.

It lives in the shared component rather than at the call site, so no screen has to remember it.
