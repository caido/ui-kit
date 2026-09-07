export default {
  root: ({ props, context }) => ({
    class: [
      "relative",

      // Alignment
      "flex items-center justify-center",
      "py-2 px-4",
      "rounded-md border",

      // Color
      "bg-surface-page",
      {
        "text-fg-subtle before:bg-transparent": !context.active,
        "text-fg-strong before:bg-surface-raised": context.active,
      },

      // States
      {
        "hover:text-fg-strong": !props.disabled && !props.modelValue,
      },

      // Invalid State
      {
        "border-line-danger": props.invalid,
        "border-line-default": !props.invalid,
      },

      // Before
      "before:absolute before:left-1 before:top-1 before:w-[calc(100%-0.5rem)] before:h-[calc(100%-0.5rem)] before:rounded-[4px] before:z-0",

      // Transitions
      "transition-all duration-200",

      // Misc
      {
        "cursor-pointer": !props.disabled,
        "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  content: "relative items-center inline-flex justify-center gap-2",
  label: "font-medium leading-[normal] text-center w-full z-10 relative",
  icon: "relative z-10 mr-2",
};
