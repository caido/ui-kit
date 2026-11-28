# Governance

The token names are published, so other people's work depends on them. This page says what may change, what that costs, and who decides. [For contributors](/get-started/contributing.md) covers the mechanics of making the change itself.

## What a version means

| Change | Release |
| --- | --- |
| A token is added | minor |
| A token's value changes while its job stays the same | minor |
| A token is marked deprecated, and still works | minor |
| A token's job changes, so the same name now means something else | major |
| A token name is removed | major |
| An entry point is removed or renamed | major |

**The contract is the name and the job it names, rather than the colour behind it.** A value moving is not breaking, so a colour can be corrected without an event.

A job changing is breaking although the name is identical, and it is the dangerous case, because every call site keeps compiling and starts meaning something else. If `color.fg.muted` stops meaning de-emphasised text and starts meaning disabled text, that is a new token and the old one is deprecated.

The `--palette-*` [primitives](/foundations/tokens.md#two-tiers) sit outside all of this. Nothing outside the package reads them, so they move without a version.

## The deprecation window

A name that is going keeps working, and appears in the published manifest with a `deprecated` field recording the version that announced it, the reason, and what to move to. [When a token is going away](/get-started/plugins.md#when-a-token-is-going-away) shows an entry.

**A name may only be removed in a release later than the one that announced it.** One release is the floor rather than the target, and a name with many consumers should sit deprecated for longer.

A frozen contract file holds the names the last release published, and the build fails if one disappears without having been announced.

```
these tokens were published in 0.1.0-beta.0 and have been removed without a deprecation window:
  color.fg.example
```

The build also fails on a deprecation whose token has already gone, or whose replacement does not exist.

Every deprecation that names a replacement is a rename the shipped codemod can apply. A change that cannot be expressed that way means the two tokens do not mean the same thing, so it is a new token rather than a rename.

## Adding a token

The bar for a new token is whether the job is already named, not whether the value is needed. A value that seems to need a token is one of four things, and only the first is a token.

| The value is | What it wants |
| --- | --- |
| A job nothing names yet | A token. This is the case the tier exists for |
| A value sitting off an existing scale | Moving onto the scale |
| A measurement rather than a decision | The code that measures it, not a name |
| Genuinely private to one component | That component, with the reason written down |

A reviewer rejects a proposal by naming which of the other three it is. A reviewer who cannot name one has found the first.

The rest is mechanical, and [the generator checks most of it](/get-started/contributing.md#what-the-generator-refuses). The token points at a palette entry rather than repeating a value, and a colour that lands on another colour registers the pairing.

## Adding a component

A component ships with two things: a page on this site covering what it is for, how it is used and what it accepts, referring to tokens by name; and an implementation in the preset, built from tokens only. A value the tokens do not have is added first, as a token.

**An implementation with no page has no agreed behaviour, and a page with no implementation is a plan.**

## Release cadence

Publishing is not scheduled. Merging to the main branch publishes any package whose version has changed, and a version with a beta marker publishes under a separate tag, so pre-release work never becomes the default install.

There is no changelog while the package is in beta. The deprecation field in the manifest is the record.

Cutting a release is one change that bumps the version and freezes the contract. **The freeze happens at release time, because the file records what was published rather than what sits in a working tree.** Skipping it fails nothing at once, but the next removal check compares against the wrong baseline.
