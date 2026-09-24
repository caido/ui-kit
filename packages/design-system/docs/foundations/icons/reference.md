# Icon reference

Sizes, prefixes and the component API. For what these mean, see [Overview](/foundations/icons.md). For how to choose between them, see [Usage](/foundations/icons/usage.md).

## Sizes

| Class | Size | For |
|---|---|---|
| none | inherits, 1em | An icon sitting beside text. The usual case |
| `icon-marker` | 12px | A glyph inside a dense marker, a tag or a badge |
| `icon-message` | 32px | A glyph that is the subject of a message |

Both rungs are in pixels and do not move with the interface text setting. An inline icon does move with it, because it inherits.

There is no rung between 12 and 32, and no class that names one.

The two sizes ship as `--icon-marker` and `--icon-message`. Each class is a utility declared from its variable in the app stylesheet, so a surface wiring its own stylesheet declares them again or the class name resolves to nothing.

## Prefixes

| Prefix | Used for |
|---|---|
| `fas` | The solid weight. Everything but the two cases below |
| `far` | The regular weight. One place only, where hollow against filled is the distinction |
| `fa-brands` | Brand marks, which are a different family rather than a different weight |

Only the glyph name is rewritten. Every alias is keyed on a glyph name, so a prefix and any other class on the icon reach the stylesheet exactly as written.

## Glyph names

Sixty older glyph names resolve to their current ones automatically, so a name that moved upstream, and a second spelling of one that did not, both still render.

That resolution happens inside the component, which means it applies when you pass the icon as a prop and not when you write the class directly on an element.

## The component

| Prop | Type | Meaning |
|---|---|---|
| `icon` | string | The glyph, such as `fas fa-bug` |
| `label` | string, optional | The accessible name. Pass it only when the icon stands alone |
| `size` | `marker` or `message`, optional | For a glyph with no text to inherit from |

What the component does with `label`:

| `label` | Result |
|---|---|
| Passed | `role="img"` and an accessible name |
| Omitted | `aria-hidden`, so the icon is skipped by assistive technology |

So the decorative case and the meaningful case are handled for you once you have decided which one you have.

## An icon-only control

| Needs | Why |
|---|---|
| An accessible name | Without it the control does not exist for a screen reader |
| A tooltip | Without it a sighted person cannot learn what the glyph means |
| A pointer target of at least 24 by 24 CSS pixels | Nothing checks it, so it needs checking |

A tooltip does not provide an accessible name. The tooltip directive names its own container and sets nothing on the control but a data attribute.

## The vocabulary

The glyphs the interface has settled on, grouped by the job they do. Reuse one of these before reaching for a new glyph, because a second drawing of a meaning that already exists is drift.

### Acting on something

<IconGrid icons="fa-plus, fa-minus, fa-trash, fa-copy, fa-paste, fa-pencil, fa-pen-to-square, fa-floppy-disk, fa-download, fa-file-import, fa-rotate-left, fa-arrows-rotate, fa-paper-plane, fa-play, fa-pause, fa-check, fa-xmark" />

### Saying how something went

<IconGrid icons="fa-circle-check, fa-circle-xmark, fa-triangle-exclamation, fa-circle-info, fa-circle-question, fa-spinner, fa-lock, fa-circle" />

### Moving and arranging

<IconGrid icons="fa-chevron-right, fa-chevron-down, fa-chevron-left, fa-caret-down, fa-arrow-right, fa-arrow-left, fa-arrow-up, fa-arrow-down, fa-arrow-right-arrow-left, fa-up-right-from-square, fa-ellipsis, fa-grip-vertical, fa-layer-group" />

### Things in Caido

<IconGrid icons="fa-bug, fa-sitemap, fa-puzzle-piece, fa-globe, fa-folder, fa-folder-open, fa-file, fa-file-lines, fa-magnifying-glass, fa-filter, fa-gear, fa-sliders, fa-user, fa-eye, fa-eye-slash, fa-hard-drive, fa-code, fa-bolt-lightning, fa-inbox, fa-bookmark, fa-comments, fa-book, fa-medal, fa-rocket" />

Those cover most of what the interface draws. The full set is Font Awesome Free solid, so a meaning that genuinely has no glyph here can take one from there, as long as it is not a second drawing of something above.

## What not to write

| Avoid | Instead |
|---|---|
| A size on an icon beside text | Nothing. It inherits |
| A size between the two rungs | One of the two rungs |
| A glyph written as a class on a control | The component's `icon` prop, so resolution and labelling apply |
| A second glyph for a meaning that already has one | The glyph that meaning already uses |
