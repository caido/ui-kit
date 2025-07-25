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
        "border-surface-200 dark:border-secondary-400": context.active,
        "border-surface-200 dark:border-transparent": !context.active,
        "text-surface-700 dark:text-surface-0/80": !context.active,

        "bg-surface-0 dark:bg-transparent": context.active,
        "text-secondary-400": context.active,

        "opacity-60 cursor-default user-select-none select-none pointer-events-none":
          props?.disabled,
      },

      // States
      "focus:outline-none focus:outline-offset-0 focus-visible:ring-1 ring-inset focus-visible:ring-primary-400 dark:focus-visible:ring-secondary-400",

      // Transitions
      "transition-all duration-200",

      // Misc
      "cursor-pointer select-none whitespace-nowrap",
      "user-select-none",
    ],
  }),
};
