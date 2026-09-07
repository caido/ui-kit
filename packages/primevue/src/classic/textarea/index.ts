export default {
  root: ({ context, props, parent }) => ({
    class: [
      // Font
      "leading-none",

      // Spacing
      "m-0",
      "py-2 px-3",

      // Shape
      "rounded-md",

      // Colors
      "text-fg-strong",
      "placeholder:text-fg-muted",
      { "bg-surface-page": !context.disabled },
      "border",
      { "border-line-strong": !props.invalid },

      // Invalid State
      "invalid:hover:border-line-danger",
      { "border-line-danger": props.invalid },

      // States
      {
        "hover:border-line-strong": !context.disabled && !props.invalid,
        "focus:z-10": !context.disabled,
        "bg-surface-subtle select-none pointer-events-none cursor-default":
          context.disabled,
      },

      // Filled State *for FloatLabel
      {
        filled:
          parent.instance?.$name == "FloatLabel" &&
          props.modelValue !== null &&
          props.modelValue?.length !== 0,
      },

      // Misc
      "appearance-none",
      "transition-colors duration-200",
    ],
  }),
};
