export default {
  root: ({ props }) => ({
    class: [
      "inline-block relative",
      "w-10 h-6",
      "rounded-2xl",
      {
        "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  slider: ({ props }) => ({
    class: [
      // Position
      "absolute top-0 left-0 right-0 bottom-0",
      {
        "before:transform before:translate-x-4":
          props.modelValue == props.trueValue,
      },

      // Shape
      "rounded-2xl",

      // Before:
      "before:absolute before:top-1/2 before:left-1",
      "before:-mt-2",
      "before:h-4 before:w-4",
      "before:rounded-full",
      "before:duration-200",
      "before:bg-surface-0",

      // Colors
      "border",
      {
        "bg-surface-subtle": !(props.modelValue == props.trueValue),
        "bg-fill-secondary": props.modelValue == props.trueValue,
        "before:bg-surface-page": props.modelValue == props.trueValue,
        "border-transparent": !props.invalid,
      },

      // Invalid State
      { "border-line-danger": props.invalid },

      // States
      {
        "peer-hover:bg-surface-subtle":
          !(props.modelValue == props.trueValue) &&
          !props.disabled &&
          !props.invalid,
      },
      {
        "peer-hover:bg-fill-primary-hover":
          props.modelValue == props.trueValue &&
          !props.disabled &&
          !props.invalid,
      },

      // Transition
      "transition-colors duration-200",

      // Misc
      "cursor-pointer",
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
      "rounded-2xl",

      // Misc
      "appearance-none",
      "cursor-pointer",
    ],
  },
};
