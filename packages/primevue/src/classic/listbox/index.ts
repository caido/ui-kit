export default {
  root: ({ props }) => ({
    class: [
      "rounded-md",

      // Colors
      { "bg-surface-page": !props.disabled },
      "text-fg-default",
      "border",
      { "border-line-default": !props.invalid },

      // Disabled State
      {
        "bg-surface-subtle select-none pointer-events-none cursor-default":
          props.disabled,
      },

      // Invalid State
      { "border-line-danger": props.invalid },
    ],
  }),
  listContainer: "overflow-auto",
  list: {
    class: "p-1 list-none m-0",
  },
  option: ({ context, props }) => ({
    class: [
      "relative",

      // Flex
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
        "bg-surface-selected text-fg-strong":
          context.selected && !props.checkmark,
        "bg-surface-page": props.checkmark && context.selected,
      },

      //States
      {
        "hover:bg-surface-hover":
          (!context.focused && !context.selected) ||
          (props.checkmark && context.selected),
      },
      {
        "hover:bg-surface-hover hover:text-fg-strong":
          context.selected && !props.checkmark,
      },
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
  optionCheckIcon: "relative -ms-1.5 me-1.5 text-fg-default w-4 h-4",
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

      "[&_[data-pc-name=pcfilter]]:w-full",
    ],
  },
};
