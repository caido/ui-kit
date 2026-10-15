# For contributors

This page covers working on the system itself: adding a [token](/foundations/tokens.md), changing the [preset](/foundations/theme.md), or writing a page on this site. [Governance](/guides/governance.md) covers what makes a change breaking.

**A change that adds a second way to say something already said is the change to reject, even when the new way is better.**

## Getting set up

The repository holds four packages: the tokens, the component preset, a Tailwind integration and this site. Every task runs through mise, so a fresh checkout needs nothing installed beyond mise itself.

```sh
mise pnpm:install
```

`@caido/eslint-config` resolves to a sibling checkout, so **the `typescript-configs` repository has to sit beside this one or the install fails.**

## The commands

`mise tasks` lists every task.

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

The token source is 15 files: the base ramps, one file per property family, and the two [appearance](/foundations/theme.md#appearance-belongs-to-the-token-not-to-a-variant) files that give each semantic name its light and dark value. Edit the source, never the generated output.

```sh
mise tokens:build
```

**Build, not only generate.** The interface and the linter read the token package through a local link, so they see `dist` and not your edit. A token that is generated but not built looks correct in the source and does nothing anywhere else.

The generated files are committed, so a value change shows up in review as a diff. Continuous integration regenerates them and fails on any difference.

## What the generator refuses

The generator resolves every alias and stops the build, printing the offending names, on any of these.

| Refused | Example |
| --- | --- |
| A circular alias, or an alias to nothing | a name pointing at a token that does not exist |
| A token missing from one appearance | defined in the light file only |
| A semantic name outside a class namespace | a first segment the framework cannot turn into a utility |
| A type step off the pixel grid | not a whole number of pixels at the base size |
| A broken deprecation | no reason, a replacement that does not exist, or a token already removed |

Each check has a test that plants the fault, so every one has been seen to fail.

## Colour is measured, not reviewed

`mise tokens:contrast` measures all <TokenCount of="pairings" /> registered pairings in both appearances, as [Contrast rules](/foundations/tokens/reference.md#contrast-rules) sets out. A pairing nobody registered is a pairing nobody measured, so a new colour landing on a new surface is added to the list in the same change.

<TokenCount of="accepted-failures" /> pairings are carried as accepted failures, each with a written reason. **That list can only shrink: a pairing that starts passing fails the check until its entry is deleted**, and that stale entry is reported before any real failure.

## Working on this site

The site runs on [VitePress](https://vitepress.dev), but not on its default theme. The layout, the sidebar and the tabs are written in this repository, so a default theme option has no effect, and the navigation is typed data in `.vitepress/navigation.ts`.

Pages are Markdown with Vue components inside them, so a count reads the manifest rather than repeating a number that will drift.

The specimens are generated from one module per [component](/components/) under `scripts/specimens`, taking their geometry and colours from the shipped preset and the token manifest. Regenerate one at a time while working.

```sh
mise design-system:examples --only=button
```

## What continuous integration does and does not cover

Three jobs run on a pull request: a typecheck, the linter, and a token job that runs the tests, fails on drift, measures the contrast pairings and builds the package. A separate job follows every link, on a push that touches a Markdown file, once a week, and on request.

**Checks start when a review is requested rather than when a pull request opens.** Pushing to a branch runs nothing, and a draft is skipped entirely, so a first push shows no signal at all.

Nothing builds this site, the linter covers its theme but not its pages, and the typechecker covers neither. A page that points nowhere is caught, but **a dead specimen or a false claim passes every gate**, so a documentation change is reviewed by reading it.
