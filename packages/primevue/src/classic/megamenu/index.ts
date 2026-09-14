export default {
  root: ({ props }) => ({
    class: [
      "relative",

      // Flexbox
      "flex",

      // Shape & Size
      "rounded-md",

      // Color
      "bg-surface-page",
      "border border-line-default",
      {
        "p-2 items-center": props.orientation == "horizontal",
        "flex-col sm:w-48 p-1": props.orientation !== "horizontal",
      },
    ],
  }),
  rootList: ({ props }) => ({
    class: [
      // Flexbox
      "sm:flex",
      "items-center",
      "flex-wrap",
      "flex-col sm:flex-row",
      { hidden: !props?.mobileActive, flex: props?.mobileActive },

      // Position
      "absolute sm:relative",
      "top-full left-0",
      "sm:top-auto sm:left-auto",

      // Size
      "w-full sm:w-auto",

      // Spacing
      "m-0",
      "p-1 sm:py-0 sm:p-0",
      "list-none",

      // Shape
      "shadow-md sm:shadow-none",
      "border-0",

      // Color
      "bg-surface-page sm:bg-transparent",

      // Misc
    ],
  }),
  item: ({ props }) => ({
    class: [
      "sm:relative static my-[2px] [&:first-child]:mt-0",
      {
        "sm:w-auto w-full": props.horizontal,
        "w-full": !props.horizontal,
      },
    ],
  }),
  itemContent: ({ context }) => ({
    class: [
      "rounded-[4px]",

      //  Colors
      {
        "text-fg-muted": !context.focused && !context.active,
        "text-fg-default bg-surface-hover": context.focused && !context.active,
        "bg-surface-selected text-fg-strong":
          (context.focused && context.active) ||
          context.active ||
          (!context.focused && context.active),
      },

      // Hover States
      {
        "hover:bg-surface-hover": !context.active,
        "hover:bg-surface-hover hover:text-fg-strong": context.active,
      },

      // Transitions
      "transition-all",
      "duration-200",
    ],
  }),
  itemLink: {
    class: [
      "relative",

      // Flexbox
      "flex",
      "items-center",

      // Spacing
      "py-2",
      "px-3",

      // Size
      "leading-none",

      // Misc
      "select-none",
      "cursor-pointer",
      "no-underline ",
      "overflow-hidden",
    ],
  },
  itemIcon: {
    class: "mr-2",
  },
  submenuIcon: ({ props }) => ({
    class: [
      {
        "ml-auto sm:ml-2": props.horizontal,
        "ml-auto": !props.horizontal,
      },
    ],
  }),
  overlay: ({ props }) => ({
    class: [
      // Size
      "w-auto",

      // Spacing
      "m-0",

      // Shape
      "shadow-none sm:shadow-md",

      "rounded-md",

      // Color
      "bg-surface-page",

      // Position
      "static sm:absolute",
      "z-10",
      {
        "sm:left-full top-0": !props.horizontal,
      },
    ],
  }),
  grid: {
    class: "flex flex-wrap sm:flex-nowrap",
  },
  column: {
    class: "w-full sm:w-1/2",
  },
  submenu: {
    class: ["m-0 list-none", "p-1 px-2 w-full sm:min-w-[14rem]"],
  },
  submenuLabel: {
    class: [
      "font-semibold",

      // Spacing
      "py-2 px-3",
      "m-0",

      // Color
      "text-fg-muted",
      "bg-surface-page",
    ],
  },
  separator: {
    class: "border-t border-line-strong",
  },
  button: {
    class: [
      // Flexbox
      "flex sm:hidden",
      "items-center justify-center",

      // Size
      "w-7",
      "h-7",

      // Shape
      "rounded-full",
      // Color
      "text-fg-muted",

      // States
      "hover:text-fg-subtle",
      "hover:bg-surface-hover",

      // Transitions
      "transition duration-200 ease-in-out",

      // Misc
      "cursor-pointer",
      "no-underline",
    ],
  },
  end: {
    class: "ml-auto self-center",
  },
};
