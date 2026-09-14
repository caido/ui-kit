export default {
  root: ({ props, context }) => ({
    class: [
      "relative shrink-0",

      // Shape
      "border-b",
      "rounded-t-md",

      // Spacing
      "py-4 px-[1.125rem]",
      "-mb-px",

      // Colors and Conditions
      "outline-transparent",
      {
        "border-line-secondary": context.active,
        "border-line-default": !context.active,
        "text-fg-default": !context.active,

        "bg-transparent": context.active,
        "text-fg-secondary": context.active,

        "opacity-60 cursor-default user-select-none select-none pointer-events-none":
          props?.disabled,
      },

      // States

      // Transitions
      "transition-all duration-200",

      // Misc
      "cursor-pointer select-none whitespace-nowrap",
      "user-select-none",
    ],
  }),
};
