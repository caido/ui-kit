export default {
  root: ({ props, state }) => ({
    class: [
      // Display and Position
      "inline-flex",
      "relative",

      // Shape
      "rounded-md",

      // Color and Background
      { "bg-surface-page": !props.disabled },
      "border",
      { "border-line-default": !props.invalid },

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
  labelContainer: {
    class: ["overflow-hidden flex flex-auto cursor-pointer"],
  },
  label: ({ props, parent }) => ({
    class: [
      "block leading-[normal]",

      // Space
      "py-2 px-3",

      // Color
      "text-fg-strong",
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

      // Transition
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
  panel: {
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
  treeContainer: {
    class: [
      // Sizing
      "max-h-[200px]",

      // Misc
      "overflow-auto",
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
