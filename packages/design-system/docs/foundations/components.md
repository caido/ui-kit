# Components

A component is where every other page in this system stops being advice.

A utility class off the spacing ladder still compiles. A rung off the ladder passed to a layout component does not, because the prop is a closed union of the eight rungs, as [Space](/foundations/space.md#the-layout-components-carry-the-gap) explains.

This page explains the model. [Usage](/foundations/components/usage.md) shows how to work with the contract, and [Reference](/foundations/components/reference.md) lists the components, the vocabulary and what is enforced.

## The API cannot leak what it will not accept

The contract is one sentence and four clauses. No `class`, no `style`, no pass-through object, and no class-shaped prop under another name.

That last clause is there because a ban on the word `class` does not catch `iconClass`, `badgeClass` or a `labelClass` that shipped once. A prop whose value becomes a class is a class prop wearing a different word.

**Refusing is structural rather than advisory.** A component that accepts a class accepts a request it cannot validate. So the component stops inheriting attributes and binds only what it chooses, and the refusal becomes a property of the code rather than a thing reviewers have to catch.

The contract governs the API, not the internals. What a component does with the library underneath it is its own business.

## Presentation is blocked, identity is not

The filter is an allow-list, because a deny-list fails open: every new attribute is admitted until a rule catches up. [What the API accepts](/foundations/components/reference.md#what-the-api-accepts) lists the four kinds that pass.

**Listeners pass because they have to.** A listener arrives in the same bag as the attributes, so forwarding nothing would silently break every button in the interface. `data-*` passes because the onboarding tours find their targets with attribute selectors, and several of those targets are components.

## Forwarding assumes the root carries the semantics

An accessible name has to land on the element that carries the role, and on a wrapped control that element is not the outer one.

So a labelled control sends `aria-*` and `id` to the real input and everything else to the root, and [What the API accepts](/foundations/components/reference.md#what-the-api-accepts) names the six that do. It is the same failure [accessibility](/foundations/accessibility.md#a-table-is-a-grid) names for tables, where the cells sit inside a wrapper the row does not own.

## The vocabulary is shared, the defaults are not

Three axes, `severity`, `variant` and `size`, each backed by a shared union, so that one word means one thing wherever it ranks or scales a control.

<div data-ds class="flex flex-wrap gap-2 rounded border border-line-subtle bg-surface-raised p-6">
  <span class="rounded bg-fill-neutral-subtle px-3 py-1 text-caption text-fg-on-neutral-subtle">contrast</span>
  <span class="rounded bg-fill-secondary px-3 py-1 text-caption text-fg-on-secondary">secondary</span>
  <span class="rounded bg-fill-success-strong px-3 py-1 text-caption text-fg-on-success">success</span>
  <span class="rounded bg-fill-info-strong px-3 py-1 text-caption text-fg-on-info">info</span>
  <span class="rounded bg-fill-warn-strong px-3 py-1 text-caption text-fg-on-warn">warn</span>
  <span class="rounded bg-fill-danger-strong px-3 py-1 text-caption text-fg-on-danger">danger</span>
</div>

Each severity pairs its fill with that fill's own foreground, the rule [colour](/foundations/colour.md#why-text-on-a-fill-is-different) sets, so a caller never has to.

**A value stays in the shared union even where one component never uses it.** A component narrows or extends that union in its own type rather than changing the meaning of the word.

The defaults do change per component, and that is correct. A default is a claim about the call sites that write nothing, so it belongs to the component that has them. [The vocabulary](/foundations/components/reference.md#the-vocabulary) lists every value and default, and the few places an axis is replaced.

A toast severity is a different set: it carries `error` where the components carry `danger`, and it is chosen by which function you call rather than by a prop. [Feedback](/foundations/feedback/usage.md#choosing-a-severity-and-letting-it-choose-the-rest) owns that one.

## Almost nothing verifies that a class resolves

A class name is a string until something renders it, and three different failures look identical at the call site.

[Tokens](/foundations/tokens.md#why-stock-utility-names-are-not-safe-to-write) owns the first: a name from a cleared namespace generates nothing. [Theme](/foundations/theme.md#a-name-that-looks-defined-may-not-be) owns the last: a name that resolves to somebody else's value.

The middle one is this layer's. A lint rule catches a colour class whose token is unpublished. **Everything outside the shapes a rule names is unchecked.** A misspelt utility or a prefix from an abandoned convention generates nothing, and reads exactly the same in a template as a class that works.

That is the strongest argument for the contract: a handful of defects that every reviewer had passed.

## Where the contract does not reach

The contract is a property of the components that adopt it, and not every component has.

[Fifteen components](/foundations/components/reference.md#the-components) refuse attributes today. The rest, including the layout primitives, still merge whatever a caller passes, so treat refusal as a direction rather than a guarantee.

The layer carries **no suppressed violations** and six written exceptions to a design rule. The two are kept apart on purpose: a suppression is debt that counts down, and a written exception is a decision that does not.
