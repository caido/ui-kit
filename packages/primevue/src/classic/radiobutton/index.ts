export default {
  root: {
    class: [
      "relative",

      // Flexbox & Alignment
      "inline-flex",
      "align-bottom",

      // Size
      "w-5 h-5",

      // Misc
      "cursor-pointer",
      "select-none",
    ],
  },
  box: ({ props, context }) => ({
    class: [
      // Flexbox
      "flex justify-center items-center",

      // Size
      "w-5 h-5",

      // Shape
      "border outline-transparent",
      "rounded-full",

      // Transition
      "transition duration-200 ease-in-out",

      // Colors
      {
        "text-fg-on-primary": context.checked,
        "border-line-default": !context.checked && !props.invalid,
        "border-fill-primary bg-fill-primary":
          context.checked && !props.disabled,
      },
      // Invalid State
      { "border-line-danger": props.invalid },

      // States
      {
        "peer-hover:border-line-strong":
          !props.disabled && !props.invalid && !context.checked,
        "peer-hover:border-fill-primary-hover":
          !props.disabled && !context.checked,
        "peer-hover:[&>*:first-child]:bg-fill-primary-hover":
          !props.disabled && !context.checked,
        "bg-surface-200 [&>*:first-child]:bg-fill-neutral border-line-default select-none pointer-events-none cursor-default":
          props.disabled,
      },
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
      "rounded-md",
      "border-1 border-line-default",

      // Misc
      "appearance-none",
      "cursor-pointer",
    ],
  },
  icon: ({ context }) => ({
    class: [
      "block",

      // Shape
      "rounded-full",

      // Size
      "w-3 h-3",

      // Conditions
      {
        "bg-surface-page": context.checked,
        "bg-fill-primary": !context.checked,
        "backface-hidden invisible scale-[0.1]": !context.checked,
        "transform visible translate-z-0 scale-[1,1]": context.checked,
      },

      // Transition
      "transition duration-200",
    ],
  }),
};
