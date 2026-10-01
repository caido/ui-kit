# Icons

An icon is a glyph, not a picture. That one fact decides how it is sized, how it is coloured, and what happens when somebody changes their text setting.

This page explains the model. [Usage](/foundations/icons/usage.md) shows how to apply it, and [Reference](/foundations/icons/reference.md) lists the sizes, prefixes and component API.

## One source, one weight

Icons come from Font Awesome Free 6.5.1, solid weight, written `fas`.

Caido draws no interface icons of its own, which is the main way icons here differ from a system that ships its own set. The drawn marks that do exist are logos and illustrations rather than icons. There is no drawing budget and no review queue in front of a feature that needs a picture the library already has.

There is one exception where weight carries meaning: the entry that clears a row highlight uses the regular weight, `far`, so a hollow circle reads as unfilled beside the solid circles that carry a colour. That is the only place in the interface where filled against hollow is the distinction being drawn.

Brand marks are a different family rather than a different weight, and keep `fa-brands`.

## A settled vocabulary, not a permission list

The set is a list of **meanings**, each drawn one way. It is not a list of glyphs you are allowed to use, and there is no gate in front of picking one.

The point is that a meaning the system already has does not get a second drawing. If a sitemap is already a sitemap, a second sitemap glyph elsewhere is drift, and anybody reading the two would have to work out whether the difference meant something.

Sixty older glyph names resolve to their current ones automatically, so two spellings of the same icon do not drift apart wherever the icon goes through the component.

## Some icons name a thing, others name a shape

Two kinds, and mixing them up is what makes an icon set stop meaning anything.

**Single-purpose icons are named after a concept.** A sitemap, a bug, a puzzle piece. Each means one thing and must not be borrowed for another.

**Multi-purpose icons are named after their appearance.** An arrow, a globe, a circle, a chevron. These are shapes, and the same shape legitimately does several jobs.

So a chevron pointing down can open a menu in one place and expand a row in another, while a bug keeps its one meaning wherever it appears.

## The three sizes, side by side

<div data-ds class="flex flex-col gap-4 rounded border border-line-subtle bg-surface-raised p-6">
  <p class="flex items-center gap-3">
    <span class="w-32 shrink-0 text-caption text-fg-muted">no size</span>
    <span class="flex items-center gap-2 text-fg-default"><i class="fas fa-bug" aria-hidden="true"></i> beside body text</span>
  </p>
  <p class="flex items-center gap-3">
    <span class="w-32 shrink-0 text-caption text-fg-muted">no size</span>
    <span class="flex items-center gap-2 text-caption text-fg-muted"><i class="fas fa-bug" aria-hidden="true"></i> beside caption text</span>
  </p>
  <p class="flex items-center gap-3">
    <span class="w-32 shrink-0 font-mono text-caption text-fg-muted">icon-marker</span>
    <span class="flex items-center gap-2"><i class="fas fa-bug icon-marker text-fg-muted" aria-hidden="true"></i> <span class="text-caption text-fg-subtle">12px</span></span>
  </p>
  <p class="flex items-center gap-3">
    <span class="w-32 shrink-0 font-mono text-caption text-fg-muted">icon-message</span>
    <span class="flex items-center gap-2"><i class="fas fa-bug icon-message text-fg-muted" aria-hidden="true"></i> <span class="text-caption text-fg-subtle">32px</span></span>
  </p>
</div>

The first two are the same icon with nothing written. It is a different size in each because the text beside it is, and that is the whole mechanism.

## An inline icon carries no size

An icon sitting next to text takes no size class at all. It inherits, so its size is 1em: the type step of the text beside it.

That is how it tracks the interface text setting. Somebody who raises their text setting to 20px gets icons that grow with it, because the icon was never told a size in the first place.

Most icons in the interface are inline, and they need nothing written.

## Two rungs, for a glyph standing alone

The sizes exist only for a glyph with no text to inherit from.

| Class | Size | For |
|---|---|---|
| `icon-marker` | 12px | A glyph inside a dense marker, a tag or a badge |
| `icon-message` | 32px | A glyph that is the subject of a message: an empty state, a card, a footer notice, a confirmation |

Both are written in pixels rather than a scaling unit, because a glyph standing alone on an empty state is not text.

12px is also the caption type step, so a marker glyph sits at the size of caption text. There is no rung between the two. A glyph that fits neither, such as the one centred in the 48px circle on an onboarding card, is measured against the shape around it rather than against the ladder.

## An icon takes the colour of its context

The component writes no colour of its own, so a glyph is the foreground colour of whatever it sits in. That is why an icon beside a label needs nothing written: it is already the colour of the label.

A glyph that carries meaning on its own, such as a status dot, takes a foreground token written by the caller, because that colour is the caller's knowledge rather than the icon's.

## An icon is either decorative or it is not

An icon beside a text label adds nothing for a screen reader, because the label already says it. An icon standing alone is the only thing saying what a control does.

Those need opposite treatment, and getting it backwards either hides a control or reads the same word twice. [Usage](/foundations/icons/usage.md#labelling-an-icon) covers which is which, and the component does the work once you have decided.
