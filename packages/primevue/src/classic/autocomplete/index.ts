export default {
  root: ({ props }) => ({
    class: [
      "relative",

      // Flex
      {
        flex: props.fluid,
        "inline-flex": !props.fluid,
      },

      // Size
      { "w-full": props.multiple },
      { "[&>input]:!rounded-r-none": props.dropdown },

      // Color
      "text-surface-900 dark:text-surface-0",

      //States
      {
        "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  inputMultiple: ({ props, state }) => ({
    class: [
      // Font
      "leading-none",

      // Flex
      "flex items-center flex-wrap",
      "gap-2",

      // Spacing
      "m-0 list-none",
      "py-1 px-1",

      // Size
      "w-full",

      // Shape
      "appearance-none rounded-md",

      // Color
      "text-surface-700 dark:text-white/80",
      "placeholder:text-surface-400 dark:placeholder:text-surface-500",
      { "bg-surface-0 dark:bg-surface-950": !props.disabled },
      "border",
      { "border-surface-300 dark:border-surface-700": !props.invalid },

      // Invalid State
      "invalid:focus:ring-red-200",
      "invalid:hover:border-red-500",
      { "border-red-500 dark:border-red-400": props.invalid },

      // States
      {
        "hover:border-surface-400 dark:hover:border-surface-700":
          !props.invalid,
      },
      {
        "outline-none outline-offset-0 z-10 ring-1 ring-primary-500 dark:ring-primary-400":
          state.focused,
      },

      // Transition
      "transition duration-200 ease-in-out",

      // Misc
      "cursor-text overflow-hidden",
    ],
  }),
  inputToken: {
    class: ["py-1 px-0 ml-2", "inline-flex flex-auto"],
  },
  inputChip: {
    class: "flex-auto inline-flex pt-1 pb-1",
  },
  input: {
    class:
      "border-none outline-none bg-transparent m-0 p-0 shadow-none rounded-none w-full",
  },
  dropdown: {
    class: [
      "relative",

      // Alignments
      "items-center inline-flex justify-center text-center align-bottom",

      // Shape
      "rounded-r-md",

      // Size
      "py-2 leading-none",
      "w-10",

      // Colors
      "text-primary-contrast",
      "bg-primary",
      "border border-primary",

      // States
      "focus:outline-none focus:outline-offset-0 focus:ring-1 ",
      "hover:bg-primary-emphasis hover:border-primary-emphasis",
      "focus:ring-primary-500 dark:focus:ring-primary-400",
    ],
  },
  loader: {
    class: [
      "text-surface-500 dark:text-surface-0/70",
      "absolute top-[50%] right-[0.5rem] -mt-2 animate-spin",
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

      // Size
      "overflow-auto",
    ],
  },
  list: {
    class: "p-1 list-none m-0",
  },
  option: ({ context }) => ({
    class: [
      "relative",

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
      },

      //States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]":
          !context.focused && !context.selected,
      },
      { "hover:bg-highlight-emphasis": context.selected },
      {
        "hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-[rgba(255,255,255,0.03)]":
          context.focused && !context.selected,
      },

      // Transition
      "transition-shadow duration-200",

      // Misc
      "cursor-pointer overflow-hidden whitespace-nowrap",
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
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
