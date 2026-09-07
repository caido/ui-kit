export default {
  pcinputtext: {
    root: ({ context, props, parent }) => ({
      class: [
        // Font
        "leading-none",

        // Spacing
        "m-0 py-2 px-3",

        // Colors
        "text-fg-strong",
        { "bg-surface-page": !context.disabled },

        "border",
        { "border-line-default": !props.invalid },

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
            (parent.instance?.$name == "FloatLabel" && context.filled) ||
            (parent.instance?.$parentInstance?.$name == "FloatLabel" &&
              parent.props.modelValue !== null &&
              parent.props.modelValue?.length !== 0),
        },
        parent.instance?.$name == "FloatLabel" ||
        parent.instance?.$parentInstance?.$name == "FloatLabel"
          ? "placeholder:text-transparent"
          : "placeholder:text-fg-muted",

        // Misc
        "rounded-md",
        "appearance-none",
        "transition-colors duration-200",
      ],
    }),
  },
};
