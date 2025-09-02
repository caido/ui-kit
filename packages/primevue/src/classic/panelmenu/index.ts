export default {
  root: {
    class: "bg-surface-800 rounded-md",
  },
  panel: {
    class: "p-1 overflow-hidden rounded-md bg-surface-800",
  },
  header: {
    class: ["rounded-[4px]", "outline-none"],
  },
  headerContent: ({ context }) => ({
    class: [
      // Shape
      "rounded-[4px]",

      // Color
      "text-surface-600 dark:text-surface-0/80",
      { "text-surface-900": context.active },

      // States
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.20)]",

      // Transition
      "transition duration-200 ease-in-out",
      "transition-shadow duration-200",
    ],
  }),
  headerLink: {
    class: [
      "relative",

      // Font
      "font-semibold",
      "leading-none",

      // Flex & Alignments
      "flex items-center",

      // Spacing
      "py-2 px-3",

      // Misc
      "select-none cursor-pointer no-underline",
    ],
  },
  headerLabel: {
    class: "leading-none",
  },
  headerIcon: {
    class: "mr-2",
  },
  submenuIcon: {
    class: "mr-2 w-3 h-3",
  },
  content: {
    class: [
      // Color
      "text-surface-700 dark:text-white/80",
    ],
  },
  rootList: {
    class: ["outline-none", "m-0 p-0 list-none"],
  },
  menuitem: {
    class: "relative my-[2px]",
  },
  itemContent: {
    class: [
      // Shape
      "border-none rounded-[4px]",

      // Color
      "text-surface-700 dark:text-white/80",

      // Transition
      "transition-shadow duration-200",
    ],
  },
  itemLink: ({ context }) => ({
    class: [
      "relative",

      // Font
      "leading-none",

      // Flex & Alignments
      "flex items-center",

      // Spacing
      "py-2 px-3",

      // Shape
      "rounded-[4px]",

      // Color
      "text-surface-300",

      // States
      "hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.20)] hover:text-surface-700 dark:hover:text-white/80",
      {
        "bg-surface-200 text-surface-700 dark:text-white/80 dark:bg-surface-0/10":
          context.focused,
      },

      // Misc
      "cursor-pointer no-underline",
      "select-none overflow-hidden",
    ],
  }),
  itemIcon: {
    class: "mr-2",
  },
  submenu: {
    class: "p-0 m-0 list-none",
  },
  transition: {
    enterFromClass: "max-h-0",
    enterActiveClass:
      "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
    enterToClass: "max-h-[1000px]",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass:
      "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
    leaveToClass: "max-h-0",
  },
};
