export default {
  root: ({ state }) => ({
    class: [
      // Shape
      "rounded-lg",
      "shadow-lg",
      "border-0",

      // Size
      "max-h-[90vh]",
      "m-0",

      // Color
      "bg-surface-page",
      "[&:last-child]:border-b",
      "border-line-default",

      // Transitions
      "transform",
      "scale-100",

      // Maximized State
      {
        "transition-none": state.maximized,
        "transform-none": state.maximized,
        "!w-screen": state.maximized,
        "!h-screen": state.maximized,
        "!max-h-full": state.maximized,
        "!top-0": state.maximized,
        "!left-0": state.maximized,
      },
    ],
  }),
  header: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-between",
      "shrink-0",

      // Spacing
      "p-6",

      // Shape
      "rounded-tl-lg",
      "rounded-tr-lg",

      // Colors
      "text-fg-default",
      "border border-b-0",
      "border-line-default",
    ],
  },
  title: {
    class: ["font-semibold text-xl leading-[normal]"],
  },
  headerActions: {
    class: ["flex items-center"],
  },
  content: ({ state, instance }) => ({
    class: [
      // Spacing
      "px-6",
      "pb-6",
      "pt-0",

      // Shape
      {
        grow: state.maximized,
        "rounded-bl-lg": !instance.$slots.footer,
        "rounded-br-lg": !instance.$slots.footer,
      },

      // Colors
      "text-fg-default",
      "border border-t-0 border-b-0",
      "border-line-default",

      // Misc
      "overflow-y-auto",
    ],
  }),
  footer: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-end",
      "shrink-0",
      "text-right",
      "gap-2",

      // Spacing
      "px-6",
      "pb-6",

      // Shape
      "border-t-0",
      "rounded-b-lg",

      // Colors
      "bg-surface-page",
      "text-fg-default",
      "border border-t-0 border-b-0",
      "border-line-default",
    ],
  },
  mask: ({ props }) => ({
    class: [
      // Transitions
      "transition-all",
      "duration-300",
      { "p-5": props.position !== "full" },

      // Background and Effects
      { "has-[.mask-active]:bg-transparent bg-black/40": props.modal },
    ],
  }),
  transition: () => {
    return {};
  },
};
