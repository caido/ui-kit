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
      { "bg-surface-0 dark:bg-surface-950": !props.disabled },

      "border",
      { "dark:border-surface-600": parent.instance.$name != "InputGroup" },
      { "dark:border-surface-600": parent.instance.$name == "InputGroup" },
      { "border-surface-300 dark:border-surface-600": !props.invalid },

      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": props.invalid },

      // Transitions
      "transition-all",
      "duration-200",

      // States
      { "hover:border-secondary-400": !props.invalid },

      // Misc
      "cursor-pointer",
      "select-none",
      {
        "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default":
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
        "text-surface-800 dark:text-white/80": props.modelValue != undefined,
        "text-surface-400 dark:text-surface-500": props.modelValue == undefined,
      },
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",

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
      "focus:outline-none focus:shadow-none",

      // Filled State *for FloatLabel
      {
        filled:
          parent.instance?.$name == "FloatLabel" && props.modelValue !== null,
      },

      // Misc
      "relative",
      "cursor-pointer",
      "overflow-hidden overflow-ellipsis",
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
      "bg-surface-0 dark:bg-surface-900",
      "text-surface-700 dark:text-white/80",

      // Shape
      "border border-surface-300 dark:border-surface-700",
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
      "border-0 rounded",

      // Colors
      {
        "bg-surface-200 dark:bg-surface-600/60":
          context.focused && !context.selected,
        "text-surface-700 dark:text-white/80":
          context.focused && !context.selected,
        "bg-highlight": context.selected,
        "bg-highlight-emphasis": context.focused && context.selected,
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
      "text-surface-400 dark:text-surface-500",

      // Misc
      "cursor-auto",
    ],
  },
  optionCheckIcon:
    "relative -ms-1.5 me-1.5 text-surface-700 dark:text-white/80 w-4 h-4",
  optionBlankIcon: "w-4 h-4",
  emptyMessage: {
    class: [
      // Font
      "leading-none",

      // Spacing
      "py-2 px-3",

      // Color
      "text-surface-800 dark:text-white/80",
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
      "text-surface-700 dark:text-white/80",
      "bg-surface-0 dark:bg-surface-900",
      "border-surface-300 dark:border-surface-700",

      // Filter
      "[&_[data-pc-name=pcfilter]]:w-full",
    ],
  },
  clearIcon: {
    class: [
      // Color
      "text-surface-400 dark:text-surface-500",

      // Position
      "absolute",
      "top-1/2",
      "right-12",

      // Spacing
      "-mt-2",
    ],
  },
  loadingIcon: {
    class: "text-surface-400 dark:text-surface-500 animate-spin",
  },
};
