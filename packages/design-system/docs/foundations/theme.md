# Theme

The theme is the preset the component library draws from: the layer that decides what a button, a menu or a toast looks like without any screen having to say so.

It is not the light and dark appearance. A token already carries both of its values, as [Tokens](/foundations/tokens.md#how-a-token-resolves-to-a-value) explains, so nothing here switches between them.

This page explains the model. [Usage](/foundations/theme/usage.md) shows how to work on it, and [Reference](/foundations/theme/reference.md) lists the mapping and the exceptions.

## The preset is a package, so it is a contract

The preset is not a folder in the application. It is published from its own repository, and several things depend on it across pinned versions.

**A name removed from it is a breaking change for somebody.** Work on the theme reaches a screen through a release rather than a rebuild, and anything the application does to compensate for the theme is a workaround with a deletion date.

[Motion](/foundations/motion/reference.md#motion-drawn-by-the-component-library) takes the same posture toward anything a package draws. The difference is that Caido publishes this one, so a difference in it is a fix to make rather than a difference to live with.

## It is written in class names, not in custom properties

The preset emits class-name strings and imports no token package. `bg-surface-page` is a string, and it becomes a Caido colour because the application rendering it loads the tokens.

**The mechanism is right and stays.** A class name is the third of the [three spellings](/foundations/tokens.md#one-token-three-spellings) and resolves to the same token as the other two, so rewriting the preset in custom properties would buy nothing.

The one exception is the progress spinner, whose two `stroke` colours sit inside a keyframe and so read the custom property directly. [Standing exceptions](/foundations/theme/reference.md#standing-exceptions) records the colours that stand outside the system for other reasons.

## A name that looks defined may not be

Nothing distinguishes a name the system defines from a name it does not, so a preset can be half right for a long time and look entirely right throughout. [Tokens](/foundations/tokens.md#why-stock-utility-names-are-not-safe-to-write) names two ways a class can fail, and a preset written against another scale adds a third.

**A step the system does not define still paints.** It falls through to the scale underneath, without a warning, and paints a grey that looks like a colour somebody chose. A semantic name from the library underneath fails the same way one layer further out: it reaches a Caido value through a chain the system does not control.

**A colour belongs to the system only if you can name the token it resolves to.**

## The mapping is by job, not by hue

Converting a preset is not a search and replace on colour names, because [each step is a job rather than a brightness](/foundations/tokens.md#what-a-step-is). [The ladder](/foundations/theme/reference.md#the-ladder) maps each step to its token by the job it does.

**That ladder is for text on a surface, and it is wrong for text on a fill.** An element on a solid fill takes the foreground measured against that fill, as [Putting text on a fill](/foundations/theme/usage.md#putting-text-on-a-fill) shows.

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

The same token names invert with the appearance, so a hand-written pair applies that inversion a second time. **Keep the half that is correct in the default appearance and delete the variant.** [Never hand-writing a light and dark pair](/foundations/theme/usage.md#never-hand-writing-a-light-and-dark-pair) covers the one exception.

## The preset draws no focus indicator

It used to remove the browser outline in dozens of places and paint its own, mostly on a mouse click rather than on keyboard focus.

**Drawing nothing is the correct contract rather than a gap.** One indicator applied once can be checked against a whole interface, and a hundred components each choosing cannot. A consumer supplies its own rule, and [states](/foundations/states/usage.md#never-removing-the-focus-outline) covers why that rule must never be removed.

A checkbox, a radio and a toggle hide their focused input, so they need a rule that reaches the visible proxy instead, as [Focusing a control that hides its input](/foundations/theme/usage.md#focusing-a-control-that-hides-its-input) shows.
