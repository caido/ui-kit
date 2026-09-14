export default {
  root: {
    class: [
      // Shape
      "rounded-md",

      // Size
      "min-w-[12rem]",
      "p-1",

      // Colors
      "bg-surface-page",
      "border border-line-default",
    ],
  },
  rootList: {
    class: [
      // Spacings and Shape
      "list-none",
      "flex flex-col",
      "m-0 p-0",
    ],
  },
  item: {
    class: "relative my-[2px] [&:first-child]:mt-0",
  },
  itemContent: ({ context }) => ({
    class: [
      //Shape
      "rounded-[4px]",

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
  itemLink: {
    class: [
      "relative",
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
  itemIcon: {
    class: [
      // Spacing
      "mr-2",
    ],
  },
  itemLabel: {
    class: ["leading-none"],
  },
  submenuIcon: {
    class: [
      // Position
      "ml-auto",
    ],
  },
  submenu: {
    class: [
      // Spacing
      "flex flex-col",
      "m-0",
      "p-1",
      "list-none",
      "min-w-[12.5rem]",

      // Shape
      "shadow-none sm:shadow-md",
      "border border-line-default",

      // Position
      "static sm:absolute",
      "z-10",

      // Color
      "bg-surface-page",
    ],
  },
  separator: {
    class: "border-t border-line-strong",
  },
  transition: {
    enterFromClass: "opacity-0",
    enterActiveClass: "transition-opacity duration-250",
  },
};
