# Type

Type in Caido is six roles. You pick the role that matches the job, and the role decides the size, the line height and the weight together.

You never pick a size. A role sets the size together with the line height and the weight rather than on its own, and that pairing is deliberate rather than an omission.

This page explains the model. [Usage](/foundations/type/usage.md) shows how to apply it, and [Reference](/foundations/type/reference.md) lists every role with its exact numbers.

## A role is a job, not a size

A role says what a piece of text is doing on the screen. `caption` annotates something else. `title` names a dialog. `body` is a sentence somebody reads.

Because the role carries the job, it can carry everything the job needs. Each one sets three properties at once, so a role that leaves one of them to chance is not a role.

This is the same idea as [a step in a colour ramp](/foundations/tokens.md#what-a-step-is). The name points at a job, and the system decides the values.

## The line between caption and body

<Specimen />

The test between `caption` and `body` is not length and it is not prose. **Caption is for text that annotates another element on the same screen.** That covers a label for its control, a timestamp for its row and a count for its field. Body is for a primary item, whatever its length.

That distinction does real work. A hostname in a tree row is one word and looks like a label, but the same hostname in the history table is a primary item. Neither one annotates anything, so both are body, and the two views of the same data stop disagreeing.

`caption` is tighter than `body` rather than looser, which looks backwards next to the usual advice that small text wants more line height. That advice is about prose. A caption here is a single-line label or counter, so it takes the tight pairing.

## Why there are no size classes

The stock size names carry no meaning, so the roles replace them. `--text-*`, `--font-*`, `--font-weight-*`, `--leading-*` and `--tracking-*` are emptied before the roles are declared. Compiling the shipped tokens beside the app theme leaves `font-serif`, `leading-tight`, `leading-snug`, `leading-relaxed`, `leading-loose` and the six stock `tracking-*` names emitting no CSS at all, with nothing reported when somebody writes one.

What survives is a compatibility layer. The app points `text-xs` through `text-2xl`, `font-normal`, `font-semibold` and `leading-normal` back at role values so the component library preset keeps rendering, and those aliases are not scoped to it. **An aliased name written in Caido resolves to a role value nobody chose, and nothing reports it.**

That is the reason the namespaces are emptied rather than merely discouraged. A size class carries no evidence about what an element is, so it cannot be checked, and two people reading the same class learn nothing about whether it was chosen or copied.

[Reference](/foundations/type/reference.md#what-the-roles-replace) lists each stock namespace and what to write in its place.

## Three weights

| Class | Weight |
|---|---|
| `font-regular` | 400 |
| `font-medium` | 500 |
| `font-bold` | 600 |

**Bold is 600, and the axis stops there.** The shipped face is declared across 400 to 600, so a request for 700 renders at 600 and a request for 300 renders at 400. Neither reports anything. If you have asked for a weight and seen no change, this is usually why.

`font-semibold` is not part of the vocabulary. It survives only as an alias the component library preset depends on, and it resolves to 600, so anything that was semibold either carries a role that already sets 600 or writes `font-bold`.

**Medium refines a hierarchy and never carries one.** A user can pick their own interface face from settings, and the seven system faces on offer beside the shipped one each carry a regular and a bold and nothing between, so medium collapses into regular for them. Two roles are therefore never separated by medium alone, which is why `body-strong` is 600 rather than 500.

`b` and `strong` resolve to the bold token rather than to the browser's default, so emphasis inside content Caido did not write, such as a rendered markdown description, matches the rest of the interface.

## Two families

`font-sans` is the interface. `font-mono` is code, raw HTTP, hex output, scope patterns and every editor surface.

The interface face is chosen for what it does at the smallest size Caido renders. A lowercase `l` and a capital `I` are separated, and zero is slashed, which matters because people read encoded tokens and hex in this interface and those are the characters that collapse in a face without them.

One cost is worth knowing rather than discovering: the face is about 7 percent wider than the one it replaced on Caido's own text, so every line reaches its limit slightly sooner.

## The measure

**A line of prose runs no wider than 66 characters.**

That sits in the middle of the range readability research settles on, and inside the ceiling WCAG 1.4.8 names. The bound is written in `ch`, so it is measured in the face actually rendering and holds when a user changes their text size or picks a different face.

Write it on `body` and `body-strong`. A caption is a single line. A heading long enough to need a measure is too long to be a heading.

**It does not apply to data.** A table cell, a tree row, a log line and a raw HTTP body are bounded by their column rather than by readability. Putting a measure on a data screen adds space to a screen that is doing work.

## A role is visual, the element is structural

A role decides how text looks. It does not tell a screen reader what the text is.

`text-title` on a `div` renders a title and announces nothing. A heading has to be a heading element, in an order that does not skip levels, and the role is what styles it. The two are chosen separately and both matter.

The same split applies to emphasis. `font-bold` draws heavier text, while `strong` says the words matter. Use the element when the emphasis carries meaning, and it will already be the right weight.

## What the text size setting moves

The interface text size is a user setting, adjustable from 12 to 24, and 14 by default. Every role is written relative to it, so all six move together when a user changes it.

**Sizes are whole pixels and line heights are multiples of four at the default.** A user on 15 or 19 gets fractions, and that is expected: the default is what Caido is designed and documented at.

What does not move is spacing. The grid is written in pixels and stays put, so raising the text size grows the text and the rows that hold it without inflating the gaps around them. [Space](/foundations/space.md) covers that side.
