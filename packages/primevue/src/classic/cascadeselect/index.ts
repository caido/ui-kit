export default {
  root: ({ props, state }) => ({
    class: [
      "relative",

      // Flex
      {
        flex: props.fluid,
        "inline-flex": !props.fluid,
      },

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
      {
        "placeholder:text-transparent": parent.instance?.$name == "FloatLabel",
        "!text-transparent":
          (parent.instance?.$name == "FloatLabel" &&
            props.modelValue == null) ||
          props.modelValue?.length == 0,
      },

      // Sizing and Spacing
      "w-[1%]",
      "py-2 px-3",
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
    ],
  },
  list: {
    class: "flex flex-col list-none p-0 m-0 gap-[2px] min-w-full",
  },
  option: ({ context }) => ({
    class: [
      //Shape
      "rounded-[4px]",

      // Spacing
      "first:mt-0 mt-[2px]",

      // Colors
      {
        "text-fg-muted": !context.focused && !context.active,
        "text-fg-default bg-surface-hover": context.focused && !context.active,
        "bg-surface-selected text-fg-strong":
          (context.focused && context.active) ||
          context.active ||
          (!context.focused && context.active),
      },

      // Transitions
      "transition-shadow",
      "duration-200",

      // States
      {
        "hover:bg-surface-hover": !context.active,
        "hover:bg-surface-hover hover:text-fg-strong": context.active,
      },

      // Disabled
      { "opacity-60 pointer-events-none cursor-default": context.disabled },
    ],
  }),
  optionContent: {
    class: [
      "relative",
      "leading-[normal]",

      // Flexbox
      "flex",
      "items-center",

      // Spacing
      "py-2",
      "px-3",

      // Misc
      "no-underline",
      "overflow-hidden",
      "cursor-pointer",
      "select-none",
    ],
  },
  groupIcon: {
    class: [
      // Alignment
      "ml-auto",
    ],
  },
  optionList: {
    class: [
      "min-w-full",

      // Spacing
      "p-1",
      "m-0",
      "list-none",

      // Shape
      "shadow-none sm:shadow-md",
      "rounded-md",
      "border border-line-default",

      // Position
      "static sm:absolute",
      "z-10",

      // Color
      "bg-surface-page",
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
