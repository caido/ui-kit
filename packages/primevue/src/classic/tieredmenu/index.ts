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

      // Misc
      "select-none",
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
        "text-fg-strong": !context.focused && !context.active,
        "text-fg-strong bg-surface-hover": context.focused && !context.active,
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
      {
        "opacity-disabled pointer-events-none cursor-default": context.disabled,
      },
    ],
  }),
  itemLink: {
    class: [
      "relative",
      // Flexbox

      "flex",
      "items-center",

      // Spacing
      "py-1.5",
      "px-4",

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
    class: ["leading-normal", "mr-2"],
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
      "rounded-md",
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
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,scale,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
