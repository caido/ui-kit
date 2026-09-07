export default {
  table: {
    class: [
      // Spacing & Position
      "mx-auto my-0",

      // Table Style
      "border-spacing-0 border-separate",
    ],
  },
  cell: {
    class: [
      // Alignment
      "text-center align-top",

      // Spacing
      "py-0 px-3",
    ],
  },
  node: ({ context }) => ({
    class: [
      "relative inline-block",

      // Spacing
      "py-3 px-4",

      // Shape
      "border",
      "rounded-md",
      "border-line-default",
      // Color
      {
        "text-fg-subtle": !context?.selected,
        "bg-surface-page": !context?.selected,
        "bg-surface-selected text-fg-strong": context?.selected,
      },

      // States
      {
        "hover:bg-surface-hover": context?.selectable && !context?.selected,
        "hover:bg-surface-hover hover:text-fg-strong":
          context?.selectable && context?.selected,
      },

      { "cursor-pointer": context?.selectable },
    ],
  }),
  lineCell: {
    class: [
      // Alignment
      "text-center align-top",

      // Spacing
      "py-0 px-3",
    ],
  },
  connectorDown: {
    class: [
      // Spacing
      "mx-auto my-0",

      // Size
      "w-px h-[20px]",

      // Color
      "bg-surface-subtle",
    ],
  },
  connectorLeft: ({ context }) => ({
    class: [
      // Alignment
      "text-center align-top",

      // Spacing
      "py-0 px-3",

      // Shape
      "rounded-none border-r",
      { "border-t": context.lineTop },

      // Color
      "border-line-default",
    ],
  }),
  connectorRight: ({ context }) => ({
    class: [
      // Alignment
      "text-center align-top",

      // Spacing
      "py-0 px-3",

      // Shape
      "rounded-none",

      // Color
      {
        "border-t border-line-default": context.lineTop,
      },
    ],
  }),
  nodeCell: {
    class: "text-center align-top py-0 px-3",
  },
  nodeToggleButton: {
    class: [
      // Position
      "absolute bottom-[-0.75rem] left-2/4 -ml-3",
      "z-20",

      // Flexbox
      "flex items-center justify-center",

      // Size
      "w-6 h-6",

      // Shape
      "rounded-full",
      "border border-line-default",

      // Color
      "bg-inherit text-inherit",

      // Focus

      // Misc
      "cursor-pointer no-underline select-none",
    ],
  },
  nodeToggleButtonIcon: {
    class: [
      // Position
      "static inline-block",

      // Size
      "w-4 h-4",
    ],
  },
};
