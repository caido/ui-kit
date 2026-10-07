# Type

Type in Caido is six roles. You never pick a size: you pick the role that matches the job, and the role decides the size, the line height and the weight together.

This page explains the model. [Usage](/foundations/type/usage.md) shows how to apply it, and [Reference](/foundations/type/reference.md) lists every role with its exact numbers.

## A role is a job, not a size

A role says what a piece of text is doing on the screen. `caption` annotates something else. `title` names a dialog. `body` is a sentence somebody reads.

Because the role carries the job, it sets all three properties the job needs. This is the same idea as [a step in a colour ramp](/foundations/tokens.md#what-a-step-is): the name points at a job, and the system decides the values.

## The line between caption and body

<Specimen />

The test between `caption` and `body` is not length and it is not prose. **Caption is for text that annotates another element on the same screen**, such as a label for its control, a timestamp for its row or a count for its field. Body is for a primary item, whatever its length.

A hostname in a tree row is one word and looks like a label, but it annotates nothing, so it is body, just as it is in the history table. The two views of the same data stop disagreeing.

`caption` is tighter than `body` rather than looser. The usual advice that small text wants more line height is about prose, and a caption here is a single-line label or counter.

## Why there are no size classes

The stock size names carry no meaning, so the roles replace them, and the stock type namespaces are emptied before the roles are declared. A size class says nothing about what an element is, so it cannot be checked.

A few stock names are aliased back so the component library preset keeps rendering. **An aliased name written in Caido resolves to a role value nobody chose, and nothing reports it.** [What the roles replace](/foundations/type/reference.md#what-the-roles-replace) lists each namespace and what to write instead.

## Three weights

`font-regular`, `font-medium` and `font-bold` are the whole vocabulary. **Bold is 600, and the axis stops there.** A request for 700 renders at 600 with nothing reported, so if you have asked for a weight and seen no change, this is usually why.

**Medium refines a hierarchy and never carries one.** A user can pick their own interface face from settings, and the system faces on offer carry a regular and a bold and nothing between, so medium collapses into regular for them. Two roles are therefore never separated by medium alone, which is why `body-strong` is 600 rather than 500.

[Weights](/foundations/type/reference.md#weights) has the values.

## Two families

`font-sans` is the interface. `font-mono` is code, raw HTTP, hex output, scope patterns and every editor surface.

The interface face is chosen for what it does at the smallest size Caido renders. A lowercase `l` and a capital `I` are separated, and zero is slashed, which matters in an interface where people read encoded tokens and hex.

::: tip
The face is about 7 percent wider than the one it replaced, so every line reaches its limit slightly sooner.
:::

## The measure

**A line of prose runs no wider than 66 characters.**

That sits in the middle of the range readability research settles on, and inside the ceiling WCAG 1.4.8 names. The bound is written in `ch`, so it holds when a user changes their text size or picks a different face.

It does not apply to data. A table cell, a tree row, a log line and a raw HTTP body are bounded by their column rather than by readability.

## A role is visual, the element is structural

A role decides how text looks. It does not tell a screen reader what the text is.

`text-title` on a `div` renders a title and announces nothing. A heading has to be a heading element, in an order that does not skip levels, and the role is what styles it. The same split applies to emphasis: `font-bold` draws heavier text, while `strong` says the words matter.

## What the text size setting moves

The interface text size is a user setting, 14 by default. Every role is written relative to it, so all six move together. [The text size setting](/foundations/type/reference.md#the-text-size-setting) has the range.

**Sizes are whole pixels and line heights are multiples of four at the default.** At other settings they become fractions, which is expected.

Spacing does not move. The grid is written in pixels, so raising the text size grows the text and the rows that hold it without inflating the gaps around them. [Space](/foundations/space.md) covers that side.
