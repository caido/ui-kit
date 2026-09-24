# Component reference

The components, the vocabulary and what is enforced. For what these mean, see [Overview](/foundations/components.md). For how to apply them, see [Usage](/foundations/components/usage.md).

## What the API accepts

| Passed | Reaches the component |
|---|---|
| `data-*` | Yes |
| `aria-*` | Yes, on a labelled control it lands on the input |
| A listener | Yes |
| `id`, `name`, `form` | Yes, and a labelled control claims `id` for its input |
| `class` | No |
| `style` | No |
| A pass-through object | No |
| Any prop whose value becomes a class | No |

The filter is an allow-list, so anything not named above is refused without a rule being written for it. A labelled control is one of `CInput`, `CSelect`, `CCheckbox`, `CRadio`, `CToggle` and `CSegmented`.

## The components

| Group | Components |
|---|---|
| Actions | `CButton`, `CExternalLink`, `CInternalLink` |
| Fields | `CInput`, `CSelect`, `CCheckbox`, `CRadio`, `CToggle`, `CSegmented`, `CAutoComplete`, `CSearchBar` |
| Containers | `CCard`, `CWell`, `CDialog`, `CTabs`, `CTab` |
| Data | `CTable`, `CTree`, `CReorderableList`, `HexViewer` |
| Menus | `CMenu`, `CContextMenu`, `CDropdown` |
| Status | `CTag`, `CToast`, `CProgress`, `CLoading` |
| Text | `CLabel`, `CEditableLabel`, `CSecretLabel`, `CIcon`, `MarkdownRenderer` |
| Layout | `Stack`, `HStack`, `VStack`, `StackItem` |
| Scrolling | `CHorizontalScroll`, `CVerticalScroll` |

Fifteen refuse attributes today: `CButton`, `CCard`, `CCheckbox`, `CDialog`, `CInput`, `CLoading`, `CMenu`, `CRadio`, `CSegmented`, `CSelect`, `CTable`, `CTabs`, `CTag`, `CToast` and `CToggle`. The rest still merge what a caller passes.

## The layout components

| Prop | Accepts |
|---|---|
| `gap` | `0`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, defaulting to `2` |
| `direction` | `horizontal`, `vertical`, on `Stack` only, defaulting to `vertical` |
| `padding`, `paddingBlock`, `paddingInline` | The same eight |
| `wrap` | A boolean |
| `grow`, `shrink` | A boolean, on `StackItem` only |
| `justify` on `Stack`, `alignX` on `HStack`, `alignY` on `VStack` | The main axis: `start`, `center`, `end`, `between`, defaulting to `start` |
| `align` on `Stack`, `alignY` on `HStack`, `alignX` on `VStack` | The cross axis: `start`, `center`, `end`, `stretch`, `baseline`, defaulting to `stretch`, or to `center` on `HStack` |

The eight are the [spacing rungs](/foundations/space/reference.md#the-rungs), expressed as a closed union. There is no ninth value to pass.

## The vocabulary

The six are `contrast`, `secondary`, `success`, `info`, `warn` and `danger`.

| Component | Axis | Accepts | Default |
|---|---|---|---|
| `CButton` | `severity` | The six, plus `primary` | `contrast` |
| | `variant` | `solid`, `text`, `outlined` | `solid` |
| | `size` | `small`, `medium`, `large` | `medium` |
| `CInput`, `CSelect` | `size` | `small`, `large` | `small` |
| `CTag` | `severity` | The six | Absent, which renders the pill with no severity colour |
| | `category` | `amber`, `azure`, `fern`, `lime`, `magenta`, `rust`, `teal`, `violet` | Absent |
| | `width` | `small`, `medium` | Absent |
| `CDialog` | `width` | `small`, `medium`, `large` | Absent |
| `CIcon` | `size` | `marker`, `message` | Absent |

Two components spell the axis `width` because what it sets is a width rather than a whole control. `CTag` carries a second axis for kind rather than severity, and setting it suppresses the first, because a thing is either being ranked or being distinguished. `CIcon` sizes an icon rather than a control, so its `size` leaves the shared union entirely.

## State ownership

| Owned by | What |
|---|---|
| The component | Hover, press, and the appearance of disabled |
| The caller | Whether it is disabled, what is selected, and the value |

Focus is not in that table because it belongs to neither. One global indicator is drawn for the whole interface, which is why the preset [draws none](/foundations/theme.md#the-preset-draws-no-focus-indicator).

Inside the library a caller never writes an interaction state, and there are only a handful of hover classes in it, every one inside a component.

## What is enforced

| Rule | Checked by |
|---|---|
| An off-ladder gap or padding | The type, on the layout primitives only |
| A `class`, `style` or pass-through reaching a component | The component, which refuses it |
| A missing required prop | The type |
| A raw colour, an arbitrary value, a primitive token, a stock colour | A lint rule, at error |
| A legacy token, a ramp step, a preset size, weight or radius name | A lint rule, at error |
| An inline style or a style block | A lint rule, at error |
| A colour class whose token is unpublished | A lint rule, at error |
| An escape written without a reason beside it | A lint rule, at error |
| Any other class that resolves to nothing | Nothing |
| A rung passed as a utility class rather than a prop | Nothing |

The layer carries no suppressed violations and six written exceptions to a design rule, each an `eslint-disable` comment naming its reason at the site.

## What not to write

| Avoid | Instead |
|---|---|
| `class` on a component | A default, a prop, or layout in the parent |
| A prop whose value is a class under another name | The semantic prop it was standing in for |
| `!important` at a call site | The thing the API was missing |
| A margin on a child for spacing | `gap` on the group |
| A colour name in a component's props | `severity`, which names the meaning |
| A count taken by tag name | The same count taken by import |
