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
      "text-fg-strong",

      //States
      {
        "bg-surface-subtle select-none pointer-events-none cursor-default":
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
      "text-fg-default",
      "placeholder:text-fg-muted",
      { "bg-surface-page": !props.disabled },
      "border",
      { "border-line-default": !props.invalid },

      // Invalid State
      "invalid:hover:border-line-danger",
      { "border-line-danger": props.invalid },

      // States
      {
        "hover:border-line-strong": !props.invalid,
      },
      {
        "z-10": state.focused,
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
    class: "border-none bg-transparent m-0 p-0 shadow-none rounded-none w-full",
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
      "text-fg-on-primary",
      "bg-fill-primary",
      "border border-fill-primary",

      // States
      "hover:bg-fill-primary-hover hover:border-fill-primary-hover",
    ],
  },
  loader: {
    class: [
      "text-fg-muted",
      "absolute top-[50%] right-[0.5rem] -mt-2 animate-spin",
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
      "border-0 rounded-sm",

      // Colors
      {
        "bg-surface-hover": context.focused && !context.selected,
        "text-fg-default": context.focused && !context.selected,
        "bg-surface-selected text-fg-strong": context.selected,
      },

      //States
      {
        "hover:bg-surface-hover": !context.focused && !context.selected,
      },
      { "hover:bg-surface-hover hover:text-fg-strong": context.selected },
      {
        "hover:text-fg-default hover:bg-surface-hover":
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
      "text-fg-muted",

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
      "text-fg-strong",
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
