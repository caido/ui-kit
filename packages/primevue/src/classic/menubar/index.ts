export default {
  root: {
    class: [
      "relative",

      // Flexbox
      "flex",
      "items-center",

      // Spacing
      "p-2",

      // Shape
      "rounded-md",

      // Color
      "bg-surface-0 dark:bg-surface-800",
      "border border-surface-200 dark:border-none",
    ],
  },
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
      "bg-surface-0 dark:bg-surface-800 sm:bg-transparent",

      // Misc
      "outline-none",
    ],
  }),
  item: {
    class: "sm:relative sm:w-auto w-full static my-[2px] [&:first-child]:mt-0",
  },
  itemContent: ({ context }) => ({
    class: [
      // Shape
      "rounded-[4px]",

      // Colors
      {
        "text-surface-500 dark:text-white/70":
          !context.focused && !context.active,
        "text-surface-500 dark:text-white/70 bg-surface-200 dark:bg-surface-600/90":
          context.focused && !context.active,
        "bg-highlight text-highlight-contrast":
          (context.focused && context.active) ||
          context.active ||
          (!context.focused && context.active),
      },

      // States
      {
        "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]":
          !context.active,
        "hover:bg-highlight-emphasis": context.active,
      },

      // Disabled State
      { "opacity-60 pointer-events-none cursor-default": context.disabled },

      // Transitions
      "transition-all",
      "duration-200",
    ],
  }),
  itemLink: ({ context }) => ({
    class: [
      "relative",

      // Flexbox
      "flex",
      "items-center",

      // Spacing
      "py-2",
      "px-3",

      // Size
      {
        "pl-9 sm:pl-5": context.level === 1,
        "pl-14 sm:pl-5": context.level === 2,
      },
      "leading-none",

      // Misc
      "select-none",
      "cursor-pointer",
      "no-underline ",
      "overflow-hidden",
    ],
  }),
  itemIcon: {
    class: "mr-2",
  },
  submenuIcon: ({ props }) => ({
    class: [
      {
        "ml-auto sm:ml-2": props.root,
        "ml-auto": !props.root,
      },
    ],
  }),
  submenu: ({ props }) => ({
    class: [
      "flex flex-col",
      // Size
      "rounded-md",
      "min-w-[12.5rem]",

      // Spacing
      "p-1",
      "m-0",
      "list-none",

      // Shape
      "shadow-none sm:shadow-md",
      "border border-surface-200 dark:border-surface-700",

      // Position
      "static sm:absolute",
      "z-10",
      { "sm:absolute sm:left-full sm:top-0": props.level > 1 },

      // Color
      "bg-surface-0 dark:bg-surface-900",
    ],
  }),
  separator: {
    class: "border-t border-surface-200 dark:border-surface-600",
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
      "text-surface-500 dark:text-white/80",

      // States
      "hover:text-surface-600 dark:hover:text-white/60",
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]",
      "focus:outline-none focus:outline-offset-0",
      "focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400",

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
