export default {
  root: {
    class: [
      // Sizing and Shape
      "min-w-[12.5rem]",
      "rounded-md",

      // Spacing
      "p-1",

      // Colors
      "bg-surface-raised",
      "text-fg-default",
    ],
  },
  list: {
    class: [
      // Spacings and Shape
      "list-none",
      "m-0",
      "p-0",
    ],
  },
  item: {
    class: "relative my-[2px] [&:first-child]:mt-0",
  },
  separator: {
    class: "border-t border-line-default",
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
      {
        "text-surface-500 pointer-events-none cursor-default": context.disabled,
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
    class: ["leading-[normal]"],
  },
  submenuLabel: ({ context }) => ({
    class: [
      // Font
      "font-bold",

      // Spacing
      "m-0",
      "py-2 px-3",

      // Shape
      "rounded-tl-none",
      "rounded-tr-none",

      // Colors
      "bg-surface-raised",
      "text-fg-muted",
    ],
  }),
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
