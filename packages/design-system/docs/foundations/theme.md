# Theme

The theme is the preset the component library draws from: the layer that decides what a button, a menu or a toast looks like without any screen having to say so.

It is not the light and dark appearance. A token already carries both of its values, so nothing here switches between them. [Tokens](/foundations/tokens.md#how-a-token-resolves-to-a-value) covers how that works, and this page covers where a component's appearance comes from in the first place.

This page explains the model. [Usage](/foundations/theme/usage.md) shows how to work on it, and [Reference](/foundations/theme/reference.md) lists the mapping and the exceptions.

## The preset is a package, so it is a contract

The preset is not a folder in the application. It is published from its own repository, and several things depend on it across pinned versions.

**A name removed from it is a breaking change for somebody.** That single fact shapes the rest: work on the theme reaches a screen through a release rather than a rebuild, and anything the application does to compensate for the theme is a workaround with a deletion date, because the theme can be corrected at source instead.

That posture matches the one [motion](/foundations/motion/reference.md#motion-drawn-by-the-component-library) already takes toward anything a package draws. The difference here is that Caido publishes this one, so a difference in it is a fix to make rather than a difference to live with.

## It is written in class names, not in custom properties

The preset emits class-name strings. Its imports are all relative to its own source, so no token package appears among them, and the one custom property it reads sits inside a single keyframe. `bg-surface-page` is a string, and it becomes a Caido colour because the application rendering it loads the tokens.

**The mechanism is right and stays.** A class name is the third of the [three spellings](/foundations/tokens.md#one-token-three-spellings) and resolves to the same token as the other two, so rewriting the preset in custom properties would buy nothing.

A keyframe declaration cannot be a utility class, so the two colours set on `stroke` inside the progress spinner read the custom property directly. [Reference](/foundations/theme/reference.md#standing-exceptions) records the colours that stand outside the system for other reasons.

## A name that looks defined may not be

This is where writing in class names costs something. Nothing distinguishes a name the system defines from a name it does not, so a preset can be half right for a long time and look entirely right throughout.

[Tokens](/foundations/tokens.md#why-stock-utility-names-are-not-safe-to-write) names two ways a class can fail: it can look wrong, or it can generate nothing at all. A preset written against somebody else's scale adds a third, and it is the one nobody catches.

**A step the system does not define still paints.** A ramp step outside the published range does not fall back and does not warn. It falls through to the scale underneath and paints a grey from it, which looks like a colour somebody chose.

A semantic name belonging to the library underneath is the same problem one layer further out. It reaches a Caido value through a chain of variables the system does not control, which is not the same as being written from its tokens, and the difference only becomes visible when the intermediate layer is removed.

So the rule underneath: **a colour belongs to the system only if you can name the token it resolves to.**

## The mapping is by job, not by hue

Converting a preset is not a search and replace on colour names, because the same number means different things on different properties. [Each step is a job rather than a brightness](/foundations/tokens.md#what-a-step-is), and a step used as a foreground is answering a different question from the same step used as a background.

| Where the preset used it | What it becomes |
|---|---|
| The darkest steps, as text | `fg-strong` |
| The middle steps, as text | `fg-default`, then `fg-subtle`, then `fg-muted` |
| The darkest step, as a background | `surface-page` |
| One step up, as a background | `surface-raised` |
| The pale steps, as a border | `line-default`, and `line-strong` on hover |

**That ladder is for text on a surface, and it is wrong for text on a fill.** It maps a step to a text token by weight and says nothing about what the text sits on. An element on a solid fill takes that fill's own `fg-on-*`, which is computed against exactly that fill. [Colour](/foundations/colour.md#why-text-on-a-fill-is-different) owns the reasoning, and the check is mechanical: a fill takes the foreground the pairings table measured against that fill, which is not always the one whose name matches.

**There is no step below the page, and that is deliberate.** A preset authored against a scale where the number is a lightness expresses a recessed field as one step down. Here the floor is the floor, and depth is expressed by [raising the container](/foundations/depth.md) rather than sinking the control.

## Appearance belongs to the token, not to a variant

A preset written by hand pairs a light class with a dark one. Against a token that already carries both values, the second half is not redundant. It is wrong.

<div data-ds class="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div class="scheme-light flex flex-col gap-2 rounded border border-line-subtle bg-surface-raised p-4">
    <span class="font-mono text-caption text-fg-muted">bg-surface-raised</span>
    <span class="text-body text-fg-default">Light appearance</span>
  </div>
  <div class="scheme-dark flex flex-col gap-2 rounded border border-line-subtle bg-surface-raised p-4">
    <span class="font-mono text-caption text-fg-muted">bg-surface-raised</span>
    <span class="text-body text-fg-default">Dark appearance</span>
  </div>
</div>

Those two blocks carry the same token names and differ only in the class that forces the appearance. Nothing in the names mentions an appearance, and the inversion happens anyway.

So a hand-written pair applies that inversion a second time, and the two halves are not even keyed on the same thing: the variant reads one attribute and the token's own inversion reads another. They agree today because the appearance defaults to dark and the dark half wins either way. **The rule is to keep the half that is correct in the default appearance and delete the variant.**

One kind of pair is the exception, and it is worth knowing before the rule is applied mechanically. Where a pair expresses maximum contrast against whatever the appearance is, rather than one job at two lightnesses, the ordinary rule inverts its meaning. That one is found by measuring, not by matching the pattern.

## The preset draws no focus indicator

It used to remove the browser outline in dozens of places and paint its own, and most of those fired on a mouse click rather than on keyboard focus.

**Drawing nothing is the correct contract rather than a gap.** Focus is a global concern: one indicator applied once can be checked against a whole interface, and a hundred components each choosing cannot. A consumer supplies its own rule, and [states](/foundations/states/usage.md#never-removing-the-focus-outline) covers why that rule must never be removed once it exists.

Three controls need more than the ordinary rule. A checkbox, a radio and a toggle cover themselves with a transparent input and paint a visual proxy beside it, so an outline on the focused element paints nothing anybody can see. They need a rule that reaches the proxy rather than the focused element, and the consumer supplies one: the indicator is drawn on the focused input's siblings, with the same geometry as the ordinary rule.
