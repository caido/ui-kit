# For contributors

This page covers working on the system itself: adding a [token](/foundations/tokens.md), correcting a value, changing the [preset](/foundations/theme.md), or writing a page on this site. [Governance](/guides/governance.md) covers what makes a change breaking and what the release promises.

The rule underneath all of it is that a value is settled once and read everywhere. A change that adds a second way to say something already said is the change to reject, even when the new way is better.

## Getting set up

The repository holds four packages: the tokens, the component preset, a Tailwind integration and this site. Install once from the root.

```sh
pnpm install
```

One dependency is a local link rather than a registry install. `@caido/eslint-config` resolves to a sibling checkout, so **the `typescript-configs` repository has to sit beside this one or the install fails.**

## The commands

Every task here is a pnpm script. That is the exception rather than the pattern: the rest of Caido runs tasks through mise, and mise is used here only to pin the toolchain, so there is no `mise run` to reach for.

| Command | What it does |
| --- | --- |
| `pnpm typecheck` | Typechecks every package that defines the script |
| `pnpm lint` | Dead code detection, then the [design rules](/guides/enforcement.md) with fixes applied |
| `pnpm lint-prod` | The same without fixes, failing on any warning |
| `pnpm --filter @caido/tokens generate` | Rebuilds the generated stylesheets and the manifest from the token source |
| `pnpm --filter @caido/tokens build` | Copies the generated files into what the packages publish |
| `pnpm --filter @caido/tokens contrast` | Measures every registered pairing in both appearances |
| `pnpm --filter @caido/tokens test` | The one test suite in the repository |
| `pnpm --filter @caido/design-system dev` | Serves this site |
| `pnpm --filter @caido/design-system generate:examples` | Redraws the specimens this site uses |

## Changing a token

The token source is 15 files, holding the base ramps, one file per property family, and the two [appearance](/foundations/theme.md#appearance-belongs-to-the-token-not-to-a-variant) files that give each semantic name its light and dark value. Edit the source, never the generated output.

```sh
pnpm --filter @caido/tokens generate   # rewrite the generated files
pnpm --filter @caido/tokens build      # copy them into dist
```

**Both steps are required, and skipping the second is the mistake that costs an afternoon.** The interface and the linter both read the token package through a local link, so they see `dist` and not your edit. A token changed and generated but not built looks correct in the source and does nothing anywhere else.

The generated files are committed on purpose, so a value change shows up in review as a diff rather than as an invisible rebuild. Continuous integration regenerates them and fails if the result differs from what was committed.

## What the generator refuses

The generator is the first reviewer. It reads the source, resolves every alias, and then runs a series of checks that each end the build with the offending names printed. It refuses a circular alias, a name pointing at something that does not exist, a token defined in one appearance but not the other, a semantic name outside a namespace the framework can turn into a class, a type step that is not a whole number of pixels at the base size, and a deprecation that is missing its reason, names a replacement that does not exist, or has already outlived the name it described.

A check that has never been seen to fail is not a check, so each one has a test that plants the fault.

## Colour is measured, not reviewed

Contrast is the one property nobody is asked to judge by eye. <TokenCount of="pairings" /> pairings are registered in the token source, and the script measures each one in both appearances against the floors on [Accessibility](/foundations/accessibility.md).

It is run on its own rather than as part of the build. A pairing nobody registered is a pairing nobody measured, so a new colour landing on a new surface has to be added to the list when it is introduced.

<TokenCount of="accepted-failures" /> pairings are carried as accepted failures, each with a written reason. **That list can only shrink: a pairing that starts passing fails the check until its entry is deleted.** The check refuses a stale acceptance before it reports a real failure, so the exceptions cannot quietly accumulate.

## Working on this site

The pages are Markdown with Vue components available inside them, which is how a figure that has to stay true to the code stays true: a count reads the manifest rather than repeating a number that will drift.

The specimens are generated rather than drawn by hand, from one module per [component](/components/) under `scripts/specimens`. Regenerate one at a time while working.

```sh
pnpm --filter @caido/design-system generate:examples --only=button
```

Every drawing takes its geometry and its colours from the shipped preset and the token manifest, so a specimen cannot show a control the interface does not draw.

## What continuous integration does and does not cover

Three jobs run: a typecheck, the linter, and a token job that runs the tests, regenerates the tokens and fails on drift, measures the contrast pairings, and builds the package.

Two gaps are worth knowing before relying on a green run.

**Checks start when a review is requested rather than when a pull request opens.** Pushing to a branch runs nothing, and a draft is skipped entirely, so a first push shows no signal at all.

The other gap is this site. The linter covers the theme but not the pages, the typechecker covers neither, and nothing in continuous integration builds the site. **A broken link, a dead specimen or a false claim on a page passes every gate this repository has.** That is what makes review of a documentation change a reading job rather than a checking job.
