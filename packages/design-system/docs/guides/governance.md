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

A value moving is deliberately not breaking. **The contract is the name and the job it names, rather than the colour behind it.** A system whose palette cannot be corrected is a system nobody will correct, and correcting a colour is ordinary business rather than an event.

A job changing is breaking although the name is identical, and it is the dangerous case, because nothing fails. Every call site keeps compiling and starts meaning something else. If `color.fg.muted` stops meaning de-emphasised text and starts meaning disabled text, that is a new token and the old one is deprecated, however tempting the reuse looks.

The palette sits outside all of this. `--palette-*` names generate no utility class and nothing outside the package should read one, so they move without a version story. That is the whole reason the [lower tier](/foundations/tokens.md) exists.

## The deprecation window

A name that is going is recorded with the version that announced it, the reason, and what to move to. It keeps being emitted, keeps working, and appears in the published manifest carrying a `deprecated` field, so a consumer finds it by reading the manifest rather than by reading prose.

**A name may only be removed in a release later than the one that announced it.** One release is the floor rather than the target, and a name with many consumers should sit deprecated for longer.

This is checked rather than promised. A frozen contract file holds the names the last release published and which of them were already deprecated, and the build fails if a name disappears without having been announced.

```
these tokens were published in 0.1.0-beta.0 and have been removed without a deprecation window:
  color.fg.example
```

Two more checks close the obvious ways around it. A deprecation whose token has already gone fails, because the window it promised is already over. A deprecation whose replacement does not exist fails, because it sends a consumer nowhere.

Every deprecation that names a replacement is a rename, and the package ships a codemod that applies it. A rename that cannot be expressed as one is a sign the two tokens do not mean the same thing, which makes it a new token rather than a rename.

## Adding a token

A new token is a new word in the vocabulary, so the bar is whether the job is already named rather than whether the value is needed.

A value that seems to need a token is one of four things, and only the first is a token.

| The value is | What it wants |
| --- | --- |
| A job nothing names yet | A token. This is the case the tier exists for |
| A value sitting off an existing scale | Moving onto the scale |
| A measurement rather than a decision | The code that measures it, not a name |
| Genuinely private to one component | That component, with the reason written down |

A reviewer rejects a proposal by naming which of the other three it is. A reviewer who cannot name one has found the first.

Everything after that question is mechanical and the checks cover it: the token goes in both appearance files, its first segment is a namespace the framework can turn into a class, it points at a palette entry rather than repeating a value, and a colour that lands on another colour declares the pairing so the [contrast floor](/foundations/accessibility.md) applies.

## Adding a component

A component is two things, and both are required before it ships.

A page on this site covering what it is for, how it is used and what it accepts, referring to tokens by name and never by value. And an implementation in the preset, built from tokens only. If it needs a value the tokens do not have, that is the previous section, and it happens first.

A component that exists in one of the two is not done. An implementation with no page has no agreed behaviour, and a page with no implementation is a plan.

## When checks actually run

Worth knowing before trusting a green tick: the checks start **when a review is requested rather than when a pull request opens**. Pushing to a branch runs nothing and a draft is skipped entirely, so a first push shows no signal at all rather than a passing one.

Three jobs run when they do start: a typecheck, the linter, and a token job that runs the tests, regenerates the tokens and fails if the committed output differs, measures every registered [pairing](/foundations/colour.md), then builds the package.

## Release cadence

Publishing is not scheduled. Merging to the main branch publishes any package whose version has changed, so a release happens when somebody decides one should and bumps the version in the same change. A version carrying a beta marker publishes under a separate tag, so pre-release work never becomes the default install.

There is no changelog while the package is in beta. The deprecation field in the published manifest is the record, and it is the one a consumer can act on without reading prose. A changelog starts when the names stop moving and a written history of what moved becomes worth keeping.

Cutting a release is two things in one change: bump the version, and freeze the contract. **The freeze happens at release time rather than on every generate, because the file records what was published rather than what sits in a working tree.** Skipping it does not fail immediately. It makes the next removal check compare against the wrong baseline, which is the kind of failure that surfaces one release too late.
