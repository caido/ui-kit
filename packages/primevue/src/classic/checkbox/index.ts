export default {
  root: {
    class: [
      "relative",

      // Alignment
      "inline-flex",
      "align-bottom",

      // Size
      "w-5",
      "h-5",

      // Misc
      "cursor-pointer",
      "select-none",
    ],
  },
  box: ({ props, context }) => ({
    class: [
      // Alignment
      "flex",
      "items-center",
      "justify-center",

      // Size
      "w-5",
      "h-5",

      // Shape
      "rounded-sm",
      "border",

      // Colors
      {
        "border-line-default": !context.checked && !props.invalid,
        "bg-surface-page":
          !context.checked && !props.invalid && !props.disabled,
        "border-fill-secondary bg-fill-secondary": context.checked,
      },

      // Invalid State
      "invalid:hover:border-line-danger",
      { "border-line-danger": props.invalid },

      // States
      {
        "peer-hover:border-line-default":
          !props.disabled && !context.checked && !props.invalid,
        "peer-hover:bg-fill-primary-hover peer-hover:border-fill-primary-hover":
          !props.disabled && context.checked,
        "peer-focus-visible:z-10": !props.disabled,
        "bg-surface-subtle select-none pointer-events-none cursor-default":
          props.disabled,
      },

      {
        "[&>svg]:text-fg-on-secondary [&>svg]:w-[0.875rem] [&>svg]:h-[0.875rem]":
          context.checked,
      },

      // Transitions
      "transition-colors",
      "duration-200",
    ],
  }),
  input: {
    class: [
      "peer",

      // Size
      "w-full ",
      "h-full",

      // Position
      "absolute",
      "top-0 left-0",
      "z-10",

      // Spacing
      "p-0",
      "m-0",

      // Shape
      "opacity-0",
      "rounded-sm",
      "border border-line-default",

      // Misc
      "appearance-none",
      "cursor-pointer",
    ],
  },
  icon: ({ context, state }) => ({
    class: [
      // Size
      "w-[0.875rem]",
      "h-[0.875rem]",

      // Colors
      {
        "text-fg-on-secondary": context.checked,
        "text-fg-primary": state.d_indeterminate,
      },

      // Transitions
      "transition-all",
      "duration-200",
    ],
  }),
};
