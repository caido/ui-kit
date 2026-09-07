export default {
  root: {
    class: [
      // Flex & Alignment
      "flex items-center justify-center flex-wrap",

      // Spacing
      "px-4 py-2",

      // Shape
      "border-0 rounded-md",

      // Color
      "bg-surface-page",
      "text-fg-muted",
    ],
  },
  first: ({ context }) => ({
    class: [
      "relative",

      // Flex & Alignment
      "inline-flex items-center justify-center",

      // Shape
      "border-0 rounded-full",

      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",

      // Color
      "text-fg-muted",

      // State
      {
        "hover:bg-surface-hover": !context.disabled,
      },

      // Transition
      "transition duration-200",

      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": context.disabled },
    ],
  }),
  prev: ({ context }) => ({
    class: [
      "relative",

      // Flex & Alignment
      "inline-flex items-center justify-center",

      // Shape
      "border-0 rounded-full",

      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",

      // Color
      "text-fg-muted",

      // State
      {
        "hover:bg-surface-hover": !context.disabled,
      },

      // Transition
      "transition duration-200",

      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": context.disabled },
    ],
  }),
  next: ({ context }) => ({
    class: [
      "relative",

      // Flex & Alignment
      "inline-flex items-center justify-center",

      // Shape
      "border-0 rounded-full",

      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",

      // Color
      "text-fg-muted",

      // State
      {
        "hover:bg-surface-hover": !context.disabled,
      },

      // Transition
      "transition duration-200",

      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": context.disabled },
    ],
  }),
  last: ({ context }) => ({
    class: [
      "relative",

      // Flex & Alignment
      "inline-flex items-center justify-center",

      // Shape
      "border-0 rounded-full",

      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",

      // Color
      "text-fg-muted",

      // State
      {
        "hover:bg-surface-hover": !context.disabled,
      },

      // Transition
      "transition duration-200",

      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": context.disabled },
    ],
  }),
  page: ({ context }) => ({
    class: [
      "relative",

      // Flex & Alignment
      "inline-flex items-center justify-center",

      // Shape
      "border-0 rounded-full",

      // Size
      "min-w-[2.5rem] h-10 m-[0.143rem]",
      "leading-none",

      // Color
      {
        "bg-surface-selected text-fg-strong border-line-selected hover:bg-surface-hover hover:text-fg-strong ":
          context.active,
        "text-fg-muted": !context.active,
      },

      // State
      {
        "hover:bg-surface-hover": !context.disabled && !context.active,
      },

      // Transition
      "transition duration-200",

      // Misc
      "user-none overflow-hidden",
      { "cursor-default pointer-events-none opacity-60": context.disabled },
    ],
  }),
  contentStart: "mr-auto",
  contentEnd: "ml-auto",
};
