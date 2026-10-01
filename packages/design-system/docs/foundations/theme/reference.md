# Theme reference

The attributes, the ladder and the standing exceptions. For what these mean, see [Overview](/foundations/theme.md). For how to apply them, see [Usage](/foundations/theme/usage.md).

## The two attributes

Both sit on the root element, and they are not interchangeable.

| Attribute | Values | Read by |
|---|---|---|
| `data-appearance` | `light`, `dark`, or absent | The token stylesheet, to set `color-scheme` |
| `data-mode` | `light` or `dark`, never anything else | The `dark:` variant, and the editor |

Absent means somebody has chosen System. In that case the resolved light or dark still lands on `data-mode`, so `data-mode` always names a real appearance and `data-appearance` records only a deliberate choice.

The `dark:` variant and a token therefore read different attributes.

## How a value is emitted

A token that holds the same value in both appearances is written once, flatly. A token whose two values are colours and differ is written as `light-dark()`, light first, and nothing selects it: `color-scheme` decides which half applies.

<TokenCount of="varying" /> of the semantic colour tokens vary this way. The rest hold one value.

No token value in that stylesheet is keyed on an appearance selector. Two rules do read the attribute, and what they set is `color-scheme`. The compatibility sheets shipped beside it are a different matter: those do carry blocks guarded by the mode attribute, which is part of what makes them compatibility rather than part of the system.

## The ladder

What a preset step becomes, by the job it does on the property it sits on.

| Used as | Becomes |
|---|---|
| The darkest steps, as text | `fg-strong` |
| The middle steps, as text | `fg-default`, `fg-subtle`, `fg-muted`, in descending weight |
| The darkest step, as a background | `surface-page` |
| One step up, as a background | `surface-raised` |
| The pale steps, as a border | `line-default` |
| The same, on hover | `line-strong` |
| Anything on a solid fill | The foreground measured against that fill |

The last row is not part of the ladder. It replaces it.

## Severity names

The component library spells one concept two ways, and the split is real rather than an oversight: a message takes `error` and has no `danger`, a button takes `danger` and has no `error`. A message and a button therefore cannot share a severity constant.

`help` keeps its branch and resolves to `info`. No caller passes it, and removing a name from a published package is a breaking change with no benefit.

Two names that asked about chrome rather than colour are gone. Chrome is the `variant` prop, which takes `solid`, `text` or `outlined`.

## Standing exceptions

Three places keep a colour the system does not name, each for a reason that would have to stop being true.

| What | Why it is correct | What would change it |
|---|---|---|
| A colour picker's gradient and handle | Its job is to show colour the system does not own, and the handle must stay visible over every hue at once | It stops being a colour picker |
| Media chrome | Controls sit on somebody's photograph, whose luminance cannot be known | It starts rendering over a known surface |
| Scrims | [Depth](/foundations/depth.md) already names the scrim as a layer whose appearance is decided elsewhere | That ruling is revisited |

A fourth used to sit here. A slider handle drew itself from a ramp step rather than from a named fill, and it now reads `fill-neutral`, so the exception closed rather than being argued.

## What not to write

| Avoid | Instead |
|---|---|
| A stock family name | The token for the job it is doing |
| A ramp step the system does not define | A step that exists, chosen by job |
| A semantic name from the library underneath | The token it was reaching for |
| A light and dark pair written by hand | The single appearance-aware name |
| A surface foreground on a solid fill | The foreground measured against that fill |
| A focus rule inside a component | Nothing. The consumer supplies one for the whole interface |
| A local patch for a package defect | The same fix, filed where the package lives |
