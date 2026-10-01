# For contributors

This page covers working on the system itself: adding a [token](/foundations/tokens.md), correcting a value, changing the [preset](/foundations/theme.md), or writing a page on this site. [Governance](/guides/governance.md) covers what makes a change breaking and what the release promises.

The rule underneath all of it is that a value is settled once and read everywhere. A change that adds a second way to say something already said is the change to reject, even when the new way is better.

## Getting set up

The repository holds four packages: the tokens, the component preset, a Tailwind integration and this site. Every task runs through mise, which pins the toolchain and defines the tasks, so a fresh checkout needs nothing installed beyond mise itself.

```sh
mise pnpm:install
```

One dependency is a local link rather than a registry install. `@caido/eslint-config` resolves to a sibling checkout, so **the `typescript-configs` repository has to sit beside this one or the install fails.**

## The commands

`mise tasks` lists them, which is the answer to what a newcomer can run before reading anything else.

| Command | What it does |
| --- | --- |
| `mise design-system:dev` | Rebuilds the tokens, then serves this site |
| `mise design-system:build` | Rebuilds the tokens, then builds this site |
| `mise design-system:examples` | Redraws the specimens this site uses |
| `mise primevue:dev` | Serves the preset in its component explorer |
| `mise tokens:generate` | Rewrites the generated stylesheets and the manifest from the token source |
| `mise tokens:build` | Generates, then copies the result into what the packages publish |
| `mise tokens:check` | Fails if the generated output differs from what the source produces |
| `mise tokens:contrast` | Measures every registered pairing in both appearances |
| `mise tokens:test` | The one test suite in the repository |
| `mise typecheck` | Typechecks every package that defines the script |
| `mise lint:dev` | Dead code detection, then the [design rules](/guides/enforcement.md) with fixes applied |
| `mise lint:prod` | The same without fixes, failing on any warning |
| `mise lint:links` | Follows every link in these pages, on disk and over the network |
| `mise validate` | Everything continuous integration runs |

## Changing a token

The token source is 15 files, holding the base ramps, one file per property family, and the two [appearance](/foundations/theme.md#appearance-belongs-to-the-token-not-to-a-variant) files that give each semantic name its light and dark value. Edit the source, never the generated output.

```sh
mise tokens:build
```

That runs two steps, and **the second is the one that used to cost an afternoon when it was skipped.** The interface and the linter both read the token package through a local link, so they see `dist` and not your edit. A token changed and generated but not built looks correct in the source and does nothing anywhere else. `mise tokens:generate` runs the first step alone, for the rare case where only the source matters.

The generated files are committed on purpose, so a value change shows up in review as a diff rather than as an invisible rebuild. Continuous integration regenerates them and fails if the result differs from what was committed.

## What the generator refuses

The generator is the first reviewer. It reads the source, resolves every alias, and then runs a series of checks that each end the build with the offending names printed. It refuses a circular alias, a name pointing at something that does not exist, a token defined in one appearance but not the other, a semantic name outside a namespace the framework can turn into a class, a type step that is not a whole number of pixels at the base size, and a deprecation that is missing its reason, names a replacement that does not exist, or has already outlived the name it described.

A check that has never been seen to fail is not a check, so each one has a test that plants the fault.

## Colour is measured, not reviewed

Contrast is the one property nobody is asked to judge by eye. <TokenCount of="pairings" /> pairings are registered in the token source, and the script measures each one in both appearances against the floors on [Accessibility](/foundations/accessibility.md).

It is run on its own rather than as part of the build. A pairing nobody registered is a pairing nobody measured, so a new colour landing on a new surface has to be added to the list when it is introduced.

<TokenCount of="accepted-failures" /> pairings are carried as accepted failures, each with a written reason. **That list can only shrink: a pairing that starts passing fails the check until its entry is deleted.** The check refuses a stale acceptance before it reports a real failure, so the exceptions cannot quietly accumulate.

## Working on this site

The site runs on [VitePress](https://vitepress.dev), whose documentation covers the Markdown extensions, the frontmatter and the build. Its default theme does not apply here: the layout, the sidebar and the tabs are written in this repository rather than extended from that theme, so a theme option taken from those pages has no effect and the navigation is typed data in `.vitepress/navigation.ts`.

The pages are Markdown with Vue components available inside them, which is how a figure that has to stay true to the code stays true: a count reads the manifest rather than repeating a number that will drift.

The specimens are generated rather than drawn by hand, from one module per [component](/components/) under `scripts/specimens`. Regenerate one at a time while working.

```sh
mise design-system:examples --only=button
```

Every drawing takes its geometry and its colours from the shipped preset and the token manifest, so a specimen cannot show a control the interface does not draw.

## What continuous integration does and does not cover

Three jobs run on a pull request: a typecheck, the linter, and a token job that runs the tests, regenerates the tokens and fails on drift, measures the contrast pairings, and builds the package. Links are checked in a job of their own, which runs on a push that touches a Markdown file, once a week, and on request.

Two gaps are worth knowing before relying on a green run.

**Checks start when a review is requested rather than when a pull request opens.** Pushing to a branch runs nothing, and a draft is skipped entirely, so a first push shows no signal at all.

The other gap is this site. The linter covers the theme but not the pages, the typechecker covers neither, and nothing in continuous integration builds the site. Links are followed, so a page that points nowhere is caught, but **a dead specimen or a false claim passes every gate this repository has.** That is what makes review of a documentation change a reading job rather than a checking job.
