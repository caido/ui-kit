export default {
  root: ({ props, state }) => ({
    class: [
      // Font
      "leading-none",

      // Display and Position
      "inline-flex",
      "relative",

      // Shape
      "rounded-md",

      // Color and Background
      { "bg-surface-page": !props.disabled },
      "border",
      { "border-line-strong": !props.invalid },

      // Invalid State
      "invalid:hover:border-line-danger",
      { "border-line-danger": props.invalid },

      // Transitions
      "transition-all",
      "duration-200",

      // States
      {
        "hover:border-line-strong": !props.invalid,
      },
      {
        "z-10": state.focused,
      },

      // Misc
      "cursor-pointer",
      "select-none",
      {
        "bg-surface-subtle select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  labelContainer: "overflow-hidden flex flex-auto cursor-pointer",
  label: ({ props, parent }) => ({
    class: [
      "text-base leading-2",

      // Spacing
      {
        "py-2 px-3":
          props.display === "comma" ||
          (props.display === "chip" && !props?.modelValue?.length),
        "py-1 px-1": props.display === "chip" && props?.modelValue?.length > 0,
      },

      // Color
      {
        "text-fg-strong": props.modelValue?.length,
        "text-fg-muted": !props.modelValue?.length,
      },
      {
        "placeholder:text-transparent": parent.instance?.$name == "FloatLabel",
        "!text-transparent":
          (parent.instance?.$name == "FloatLabel" &&
            props.modelValue == null) ||
          props.modelValue?.length == 0,
      },

      // Filled State *for FloatLabel
      {
        filled:
          parent.instance?.$name == "FloatLabel" && props.modelValue !== null,
      },

      // Transitions
      "transition duration-200",

      // Misc
      "overflow-hidden whitespace-nowrap cursor-pointer text-ellipsis",
    ],
  }),
  dropdown: {
    class: [
      // Flexbox
      "flex items-center justify-center",
      "shrink-0",

      // Color and Background
      "bg-transparent",
      "text-surface-500",

      // Size
      "w-12",

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
      "mt-[2px]",
    ],
  },
  header: {
    class: [
      //Flex
      "flex items-center justify-between",

      // Spacing
      "pt-2 px-4 pb-0 gap-2",
      "m-0",

      //Shape
      "border-b-0",
      "rounded-tl-md",
      "rounded-tr-md",

      // Color
      "text-fg-default",
      "bg-surface-page",
      "border-line-default",

      "[&_[data-pc-name=pcfiltercontainer]]:!flex-auto",
      "[&_[data-pc-name=pcfilter]]:w-full",
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
    class: "p-1 list-none m-0",
  },
  option: ({ context }) => ({
    class: [
      "relative",
      "flex items-center",

      // Font
      "leading-none",

      // Spacing
      "m-0 px-3 py-2 gap-2",
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
  loadingIcon: {
    class: "text-fg-muted animate-spin",
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
