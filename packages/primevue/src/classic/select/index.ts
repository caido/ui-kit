export default {
  root: ({ props, state, parent }) => ({
    class: [
      // Display and Position
      "inline-flex",
      "relative",
      // Shape
      { "rounded-md": parent.instance.$name !== "InputGroup" },
      {
        "first:rounded-l-md rounded-none last:rounded-r-md":
          parent.instance.$name == "InputGroup",
      },
      {
        "border-0 border-y border-l last:border-r":
          parent.instance.$name == "InputGroup",
      },
      {
        "first:ml-0 ml-[-1px]":
          parent.instance.$name == "InputGroup" && !props.showButtons,
      },

      // Color and Background
      { "bg-surface-page": !props.disabled },

      "border",
      { "border-line-strong": parent.instance.$name != "InputGroup" },
      { "border-line-strong": parent.instance.$name == "InputGroup" },
      { "border-line-strong": !props.invalid },

      // Invalid State
      "invalid:hover:border-line-danger",
      { "border-line-danger": props.invalid },

      // Transitions
      "transition-all",
      "duration-200",

      // States
      { "hover:border-fill-secondary": !props.invalid },

      // Misc
      "cursor-pointer",
      "select-none",
      {
        "bg-surface-subtle select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  label: ({ props, parent }) => ({
    class: [
      //Font
      "leading-[normal]",

      // Display
      "block",
      "flex-auto",

      // Color and Background
      "bg-transparent",
      "border-0",
      {
        "text-fg-strong": props.modelValue != undefined,
        "text-fg-muted": props.modelValue == undefined,
      },
      "placeholder:text-fg-muted",

      // Sizing and Spacing
      "w-[1%]",
      "py-2 pl-3",
      { "pr-7": props.showClear },

      //Shape
      "rounded-none",

      // Transitions
      "transition",
      "duration-200",

      // States
      "focus:shadow-none",

      // Filled State *for FloatLabel
      {
        filled:
          parent.instance?.$name == "FloatLabel" && props.modelValue !== null,
      },

      // Misc
      "relative",
      "cursor-pointer",
      "overflow-hidden text-ellipsis",
      "whitespace-nowrap",
      "appearance-none",
    ],
  }),
  dropdown: {
    class: [
      // Flexbox
      "flex items-center justify-center",
      "shrink-0",

      // Color and Background
      "bg-transparent",
      "text-surface-300",

      // Size
      "pl-1 pr-3",

      // Shape
      "rounded-r-md",
    ],
  },
  overlay: {
    class: [
      // Colors
      "bg-surface-page",
      "text-fg-default",

      // Shape
      "border border-line-default",
      "rounded-md",
      "shadow-md",
    ],
  },
  listContainer: {
    class: [
      // Sizing
      "max-h-[200px]",

      // Misc
      "overflow-auto",
    ],
  },
  list: {
    class: "m-0 p-1 list-none gap-[2px] flex flex-col",
  },
  option: ({ context }) => ({
    class: [
      "relative",
      "flex items-center",

      // Font
      "leading-none",

      // Spacing
      "m-0 px-3 py-2",
      "first:mt-0 mt-[2px]",

      // Shape
      "border-0 rounded-sm",

      // Colors
      {
        "bg-surface-hover": context.focused && !context.selected,
        "text-fg-default": context.focused && !context.selected,
        "bg-surface-selected text-fg-strong": context.selected,
        "bg-surface-hover text-fg-strong": context.focused && context.selected,
      },

      // Transition
      "transition-colors duration-200",

      // Misc
      "cursor-pointer font-normal overflow-hidden whitespace-nowrap",
    ],
  }),
  optionGroup: {
    class: [
      "font-semibold",

      // Spacing
      "m-0 py-2 px-3",

      // Colors
      "text-fg-muted",

      // Misc
      "cursor-auto",
    ],
  },
  optionCheckIcon: "relative -ms-1.5 me-1.5 text-fg-default w-4 h-4",
  optionBlankIcon: "w-4 h-4",
  emptyMessage: {
    class: [
      // Font
      "leading-none",

      // Spacing
      "py-2 px-3",

      // Color
      "text-fg-strong",
      "bg-transparent",
    ],
  },
  header: {
    class: [
      // Spacing
      "pt-2 px-2 pb-0",
      "m-0",

      //Shape
      "border-b-0",
      "rounded-tl-md",
      "rounded-tr-md",

      // Color
      "text-fg-default",
      "bg-surface-page",
      "border-line-default",

      // Filter
      "[&_[data-pc-name=pcfilter]]:w-full",
    ],
  },
  clearIcon: {
    class: [
      // Color
      "text-fg-muted",

      // Position
      "absolute",
      "top-1/2",
      "right-12",

      // Spacing
      "-mt-2",
    ],
  },
  loadingIcon: {
    class: "text-fg-muted animate-spin",
  },
};
