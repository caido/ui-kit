# Components

A component is where every other page in this system stops being advice.

[Space](/foundations/space.md#the-layout-components-carry-the-gap) puts it exactly: the ladder is a rule everywhere and a type only in the layout primitives. A utility class off the ladder still compiles, because the utilities come from the framework. A rung off the ladder passed to a component does not, because the prop is a closed union of the eight rungs and nothing else.

This page explains the model. [Usage](/foundations/components/usage.md) shows how to work with the contract, and [Reference](/foundations/components/reference.md) lists the components, the vocabulary and what is enforced.

## The API cannot leak what it will not accept

The contract is one sentence and four clauses. No `class`, no `style`, no pass-through object, and no class-shaped prop under another name.

That last clause is there because a ban on the word `class` does not catch `iconClass`, `badgeClass` or a `labelClass` that shipped once. A prop whose value becomes a class is a class prop wearing a different word.

**Refusing is structural rather than advisory.** A component that accepts a class accepts a request it cannot validate, and a caller who spells it wrong is told nothing. So the component stops inheriting attributes and binds only what it chooses, which makes the refusal a property of the code rather than a thing reviewers have to catch.

The contract governs the API, not the internals. What a component does with the library underneath it is its own business; what it accepts from a caller is not.

## Presentation is blocked, identity is not

The filter is an allow-list, and the direction matters. A deny-list fails open, so every new attribute somebody invents is admitted until a rule catches up. An allow-list fails closed, which is the visible direction to fail in.

Four things pass: `data-*`, `aria-*`, a listener, and the three exact names `id`, `name` and `form`.

**Listeners are on that list because they have to be.** A listener arrives in the same bag as the attributes, so a component that stopped inheriting and forwarded nothing would break every button in the interface at once, silently, with no type error anywhere.

`data-*` passes for a concrete reason. The onboarding tours find their targets with attribute selectors, and several of those targets are components. A layer that forwarded nothing would break every tour and no test would notice.

## Forwarding assumes the root carries the semantics

An accessible name has to land on the element that carries the role, and on a wrapped control that element is not the outer one.

So a labelled control splits what it forwards: `aria-*` goes to the real input and everything else goes to the root. Six components need that split, and [Reference](/foundations/components/reference.md#what-the-api-accepts) names them. It is the same failure [accessibility](/foundations/accessibility.md#a-table-is-a-grid) already names for tables, where the cells sit inside a wrapper the row does not own.

`id` is the interesting case. It is on the allow-list, and a labelled control still takes it back, because the label has to point at the input rather than at the wrapper around it.

## The vocabulary is shared, the defaults are not

Three axes, and a shared union behind `severity` and `size`, so that one word means one thing wherever it ranks or scales a control.

| Prop | Values |
|---|---|
| `severity` | `contrast`, `secondary`, `success`, `info`, `warn`, `danger` |
| `variant` | `solid`, `text`, `outlined` |
| `size` | `small`, `medium`, `large` |

<div data-ds class="flex flex-wrap gap-2 rounded border border-line-subtle bg-surface-raised p-6">
  <span class="rounded bg-fill-neutral-subtle px-3 py-1 text-caption text-fg-on-neutral-subtle">contrast</span>
  <span class="rounded bg-fill-secondary px-3 py-1 text-caption text-fg-on-secondary">secondary</span>
  <span class="rounded bg-fill-success-strong px-3 py-1 text-caption text-fg-on-success">success</span>
  <span class="rounded bg-fill-info-strong px-3 py-1 text-caption text-fg-on-info">info</span>
  <span class="rounded bg-fill-warn-strong px-3 py-1 text-caption text-fg-on-warn">warn</span>
  <span class="rounded bg-fill-danger-strong px-3 py-1 text-caption text-fg-on-danger">danger</span>
</div>

Each pairs its fill with that fill's own foreground, which is the rule [colour](/foundations/colour.md#why-text-on-a-fill-is-different) sets and the component applies so a caller never has to.

**A value stays in the shared union even where one component never uses it.** A vocabulary that changed shape per component would not be a vocabulary, so a component narrows or extends that union in its own type rather than in the meaning of the word. `CIcon` is the one place that breaks, because its `size` scales an icon rather than a control and takes `marker` and `message` instead.

The defaults do change per component, and that is correct rather than untidy. A default is a claim about the call sites that write nothing, so it belongs to the component that has them. [Reference](/foundations/components/reference.md#the-vocabulary) carries which is which, every place a component narrows, extends or replaces an axis, and the two places the axis is spelled `width` because what it sets is a width rather than a whole control.

One word is doing more work than it looks. A toast severity is a different set from a component severity: it carries `error` where the components carry `danger`, and it is chosen by which function you call rather than by a prop. [Feedback](/foundations/feedback/usage.md#choosing-a-severity-and-letting-it-choose-the-rest) owns that one.

## Almost nothing verifies that a class resolves

A class name is a string until something renders it, and three different failures look identical at the call site.

[Tokens](/foundations/tokens.md#why-stock-utility-names-are-not-safe-to-write) owns the first: a name from a cleared namespace generates nothing. [Theme](/foundations/theme.md#a-name-that-looks-defined-may-not-be) owns the last: a name that resolves to somebody else's value.

The middle one is this layer's. A lint rule catches a colour class whose token is unpublished, which is the case worth catching. **Everything outside the shapes a rule names is unchecked.** A misspelt utility generates nothing, a prefix from an abandoned convention generates nothing, and a stock size name the theme still aliases paints a role nobody chose. All three read exactly the same in a template as a class that does what its name says.

That is the strongest argument for the contract, and it was not an argument. It was a handful of defects that every reviewer had passed.

## Where the contract does not reach

The contract is a property of the components that adopt it, and not every component has.

Fifteen of the library's components refuse attributes today. The rest, including the layout primitives, still merge whatever a caller passes, so a `class` on one of those lands on the element. That is worth knowing before relying on refusal as a guarantee rather than as a direction.

The layer carries **no suppressed violations**, which is a deliberate contrast with the interface around it. It does carry six written exceptions to a design rule, each naming its reason at the site. Those are two different ledgers and they are kept separate on purpose: a suppression is debt that counts down, and a written exception is a decision that does not.
