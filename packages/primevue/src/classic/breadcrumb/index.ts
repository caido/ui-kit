export default {
  root: {
    class: [
      // Shape
      "rounded-md",

      // Spacing
      "p-4",

      // Color
      "bg-surface-page",

      // Misc
      "overflow-x-auto",
    ],
  },
  list: {
    class: [
      // Flex & Alignment
      "flex items-center flex-nowrap",

      // Spacing
      "m-0 p-0 list-none leading-none",
    ],
  },
  itemLink: {
    class: [
      // Flex & Alignment
      "flex items-center gap-2",

      // Shape
      "rounded-md",

      // Color
      "text-fg-subtle",

      // States

      // Transitions
      "transition-shadow duration-200",

      // Misc
      "text-decoration-none",
    ],
  },
  itemIcon: {
    class: "text-fg-subtle",
  },
  separator: {
    class: [
      // Flex & Alignment
      "flex items-center",

      // Spacing
      "mx-2",

      // Color
      "text-fg-subtle",
    ],
  },
};
