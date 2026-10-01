# Tokens Package (`@caido/tokens`)

_The design token source, and the generator that turns it into CSS and types._

## Guidelines

### The source of truth

Seventeen files under `src/tokens`. Everything else in this package is generated from them.

| File                           | Holds                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `resolver.json`                | The manifest. Names the sets, the appearances, and the order they compose in             |
| `base.tokens.json`             | The palette. Raw values with no job attached, identical in both appearances              |
| `appearance/dark.tokens.json`  | The semantic tier for the dark appearance                                                |
| `appearance/light.tokens.json` | The semantic tier for the light appearance                                               |
| `type.tokens.json`             | The type system. Roles, families, weights and the measure, identical in both appearances |
| `space.tokens.json`            | The grid unit and the radius. Fixed in pixels, identical in both appearances             |
| `depth.tokens.json`            | The layer scale. Ten names, identical in both appearances                                |
| `motion.tokens.json`           | Two durations and two easings, identical in both appearances                             |
| `legacy.json`                  | The tokens read directly as a colour value, and the name each one keeps                  |
| `icon.tokens.json`             | The icon size rungs                                                                      |
| `state.tokens.json`            | The interaction state values, such as the disabled opacity                               |
| `pairings.json`                | Every place a colour lands on another colour, and the contrast rule that applies         |
| `contrast-accepted.json`       | The pairings below the floor today, each with the reason it is not fixed here             |
| `deprecations.json`            | Names on their way out, with the version that announced each and what to move to         |
| `contract.json`                | The names the last release published, so a removal without a window fails the build      |
| `plugin-compat.json`           | The legacy colour names a plugin built before the migration reads, and the token each takes |
| `plugin-primevue.json`         | The `--p-` names such a plugin reads, scoped to what it renders into                     |

The layout follows the W3C design token resolver module, version 2025.10. The manifest composes the palette first and then one appearance file, and the later file wins.

### Values are exact

Components are written to as many decimal places as the value needs. Most of the ramp is whole numbers, but a colour converted from hex rarely lands on one: rounding `#bb3829` to whole degrees and percents renders `#bc3829`. Twelve of the thirteen colours moved out of hand written stylesheets needed one decimal place to survive the conversion, so that is what they carry.

### A token is one of six kinds

A colour, a type step, a font family, a font weight, a measure in character widths, or a dimension in pixels. The resolver rejects anything else and names the token that carried it.

A dimension is written in pixels and stays there, because the grid must mean the same thing at every interface text setting. A measure is written in `ch` so it tracks the shipped face rather than a pixel count.

A type step is the one that emits more than one declaration. This:

    "body": { "$value": { "size": 14, "leading": 20, "weight": 600 } }

becomes `--text-body`, `--text-body--line-height` and `--text-body--font-weight`, which is the shape Tailwind reads so that one utility class carries size, line height and weight together.

Sizes and line heights are written as whole pixels at the 14px base and the emitter converts them, so `size: 12` is written as `calc(12 / 14 * 1rem)`. The source holds the number a designer reads and the output holds a value that is exact at the default and proportional at every other text setting. `weight` is optional, and a step without one sets no weight and inherits.

### Two tiers

The palette holds values and no meaning. Its names sit outside every Tailwind namespace, so it generates no utility class and nothing in the product reaches it directly.

The semantic tier names a job. It is the only tier that becomes a utility class, and the only one a component, a plugin or a user's own CSS may read.

There is no component tier. A value that seems to need one is one of four things: a missing semantic name, a value sitting off a scale, a measurement rather than a decision, or something genuinely private to one component, which belongs in that component's own stylesheet rather than here.

### Adding a token

Add it to both appearance files. The build fails if only one has it.

Name it so its first segment is a Tailwind namespace, otherwise it produces a variable that generates no class. `color`, `spacing`, `text`, `radius`, `shadow`, `font`, `font-weight`, `container`, `z-index` and `ease` are the namespaces the generator accepts today. `duration` is accepted too and is a special case: Tailwind has no such namespace, so the variable is real but the class comes from an `@utility` block in the consuming application's stylesheet. Adding another bridged namespace means writing that bridge as well as the token.

Point it at a palette entry with an alias rather than repeating a value.

Then run `pnpm --filter @caido/tokens generate` and commit what changes under `src/__generated__`.

### Directly read tokens

`legacy.css` writes a bare HSL triple by default, because the Tailwind preset that reads the ramp wraps it in `hsl()` itself. A token read as a colour value on its own needs the whole function instead, and `legacy.json` names those.

Listing a token there does two things: it emits a complete colour rather than a triple, and it fixes the variable name rather than deriving it from the path.

The names matter more than they look. `--c-highlight-color-red` and its eight siblings are stored, as that literal string, on every request a user has highlighted. The consumer builds the name at runtime and sends `var(--c-highlight-color-red)` to be persisted. Renaming one of those tokens does not break a build; it stops already highlighted requests from painting, in data this package cannot see. They are a data contract, and they do not change without a migration.

### The ten checks

Each fails the build and names the token that caused it.

A token defined in one appearance and not the other.

A semantic token whose first segment is not a namespace, which would generate a variable but no class.

An alias pointing at a token that does not exist, or a cycle of aliases.

A name in `legacy.json` pointing at a token that no longer exists.

A type step whose size or line height is not a whole number of pixels at the base size.

A deprecation whose token has already gone, so the window it promised is already over.

A deprecation whose replacement does not exist.

A name the last release published, removed without having been deprecated first.

A deprecation that does not say when it was announced or why.

A plugin compatibility name pointing at a token that does not exist.

### Generated output

Nothing under `src/__generated__` is edited by hand. It is committed rather than ignored, because this repository treats generated source as source and a colour change that nobody can see in a diff is worse than one that can.

| File                 | For                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------- |
| `tokens.css`         | The palette, the appearance switch, and the theme block that generates utilities      |
| `legacy.css`         | The variable names the product uses today, so the migration can prove nothing changed |
| `tokens.ts`          | The union of every token name                                                         |
| `tokens.public.json` | A flat reference, published as `@caido/tokens/tokens.json`                            |
| `values.ts`          | The dimensions and type steps as numbers, for the code that cannot read a stylesheet  |

### Values that JavaScript has to read

Most of this package ends up in a stylesheet. A few numbers cannot, because the code that needs them is laying out a virtual list and needs an integer rather than a custom property.

`values.ts` is generated for exactly that, and `layout.ts` is the one hand written module that consumes it. `rowHeight(interfaceFontSize)` is derived rather than written: the body line box ratio comes from the type step and the padding from the grid unit, so no pixel value appears in it. Every virtual table calls it, rather than each carrying the same literal multiplier.

The rule that follows: anything read from JavaScript reads the token rather than repeating its value. A number copied into a thirteenth place is the problem this replaced, not a smaller version of it.

### The PrimeVue variable layer

`src/vendor/primevue.css` declares the `--p-` variables. It lives here rather than in a consumer because more than one package loads it and each held its own copy.

PrimeVue does not read it. The application runs PrimeVue with `unstyled: true` and a pass-through theme, and `@primevue/themes` is not installed, so nothing generates or consumes those names at runtime. The single consumer is the `tailwindcss-primeui` Tailwind plugin, which turns them into utility classes. When the theme block takes over those classes, this file has no reader left.

It holds 54 declarations in three blocks:

| Block                                            | Declarations |
| ------------------------------------------------ | ------------ |
| The palette, `--p-primary-*` and `--p-surface-*` | 24           |
| Light                                            | 15           |
| Dark                                             | 15           |

The light block is a bare `:root` and the dark block overrides it through `[data-mode="dark"]`, so the appearance the consumer sets on the root element selects between them. Not every declaration in either block has a reader, and the count above is what is written rather than what paints.

Four declarations hold a value of their own rather than pointing at a token:

| Declaration                 | Value        | Why it is still here                                               |
| --------------------------- | ------------ | ------------------------------------------------------------------ |
| `--p-surface-50`            | `#f8fafc`    | A borrowed step the ramp does not have, and nothing paints with it |
| `--p-surface-100`           | `#f1f5f9`    | The same step, and the one of the two that does paint              |
| `--p-highlight-color`       | white at 87% | No token names it                                                  |
| `--p-highlight-focus-color` | white at 87% | The same                                                           |

Each is a decision the design system has not made. The radius used to be here too and now points at its token. Until the rest are decided, they sit in one file where they can be seen rather than in two.

Generating this file is possible and is not done yet. The emitter would have to express `color-mix` and a literal first, and the reduction above should happen before anything is generated from it.

### One value in two places is not one token

`color.scrollbar.thumb` is white at 20 percent. So is the overlay that marks a selected row. They are not the same token and they are not going to be merged.

The reduction bundles them as one entry, "white at 20%, the selected row overlay and the scrollbar thumb". That reads as one decision and it is two. The thumb is a persistent control drawn over unknown scrolled content, and its alpha exists so the control stays legible over anything. The selected row is a transient state wash drawn over a row, and its alpha exists so the row's own text survives underneath. One is chrome, the other is state.

The evidence that settles it is that the selection job is already written with a different colour elsewhere. The tree and the replay collection draw the same state as surface 0 at 20 percent, a cream, and pair it with the same brand gold left border the table uses. So the selected row is not even one value today, and naming it after the table's version would have frozen a divergence.

Of seven design systems surveyed, none files a scrollbar under its interaction family. A shared number is not a shared job, and merging on one is the merge that comes apart the first time either value moves.

The selected row therefore has no token yet. Naming it is a colour decision, and it waits for the step that defines interaction states.

### The plugin compatibility layer

A plugin built before the migration compiles against `@caido/tailwindcss`, which writes every colour as `hsl(var(--c-NAME))`. The value has to be a bare HSL triple rather than a colour, or the declaration is dropped and the plugin paints nothing.

Five sheets carry it, and none of them is part of the design system. Nothing in this package or in the application may read a name or a class they define.

| File | Holds |
| ---- | ----- |
| `__generated__/plugin-compat.css` | The legacy colour names, one value each, held across both appearances |
| `__generated__/plugin-primevue.css` | The `--p-` names, scoped to `.c-wrapper-body` and `.c-wrapper-topbar` |
| `vendor/plugin-utilities.css` | The utility classes the application used to emit, generated once with tailwindcss 3.4.13 over the presets plugins bundle |
| `vendor/plugin-light.css` | The light appearance, mapped per property |
| `vendor/plugin-light-important.css` | The important half of the same, for the first layer |

Three things about them are not obvious.

The ramp is absolute. Step 0 is the lightest in both appearances and step 900 the darkest, because a plugin writes `bg-surface-0 dark:bg-surface-800` and switches the appearance itself. A step that moved with the appearance would invert that pair.

The light appearance is mapped per property rather than per step. The preset names a step as a background in one rule and as body text in another, so `bg-surface-900` has to be a panel while `text-surface-900` stays readable on it. One value per step cannot serve both.

The important half sits in the first layer rather than the last. A cascade layer orders normal declarations by declaration order and important ones against it, so an important rule in an early layer beats one in a late layer. A plugin ships its own important utilities into `c-plugin`, so these have to sit ahead of it.

The three vendor sheets are unscoped, because a menu, a dialog and a select panel are moved to the end of the body. Every selector names a numbered step, a stock colour or an arbitrary value, all three of which the application's design rules forbid, so none of it reaches the application.

When the last plugin has moved to the semantic tokens, all five are deleted.

### The appearance switch

Three rules set the appearance, and they do not grow as tokens are added. An absent attribute follows the operating system, and either explicit value overrides it.

A token that differs between appearances is written once, using `light-dark()`. A token that is the same in both is written as a plain value. So the generated stylesheet shows at a glance which decisions are appearance dependent.

Both appearances hold real values. The generator still reports when they are identical, which is now true only of the type tokens, because a role is the same size in either appearance.

### Why this package imports nothing

The generator runs on Node with native type stripping, which was chosen so the package ships with no runtime dependency at all. A helper authored for a bundler carries imports without file extensions, which Node cannot resolve, so importing one anywhere under `src` breaks the generator, because the scripts import `src`.

That constraint is why equality checks against `undefined` appear here rather than a shared optional helper.

The rule still holds for application code, which runs through the bundler. It does not reach build tooling. If this package ever exports something a bundled consumer imports at runtime, that surface can use the helpers and this note stops applying to it.

## Testing

`src/index.spec.ts` covers the resolver, the emitters and the contract, including each of the ten checks failing.

A check that has never been seen to fail is not a check. When adding one, write the test that plants the fault first.
