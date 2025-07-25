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
      "rounded",
      "border",

      // Colors
      {
        "border-surface-300 dark:border-surface-700":
          !context.checked && !props.invalid,
        "bg-surface-0 dark:bg-surface-950":
          !context.checked && !props.invalid && !props.disabled,
        "border-secondary-400 bg-secondary-400": context.checked,
      },

      // Invalid State
      "invalid:focus:ring-danger-400",
      "invalid:hover:border-danger-400",
      { "border-danger-400 dark:border-danger-400": props.invalid },

      // States
      {
        "peer-hover:border-surface-400 dark:peer-hover:border-surface-600":
          !props.disabled && !context.checked && !props.invalid,
        "peer-hover:bg-primary-emphasis peer-hover:border-primary-emphasis":
          !props.disabled && context.checked,
        "peer-focus-visible:z-10 peer-focus-visible:outline-none peer-focus-visible:outline-offset-0 peer-focus-visible:ring-1 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-secondary-200":
          !props.disabled,
        "bg-surface-200 dark:bg-surface-700 select-none pointer-events-none cursor-default":
          props.disabled,
      },

      {
        "[&>svg]:text-primary-contrast [&>svg]:w-[0.875rem] [&>svg]:h-[0.875rem]":
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
      "rounded",
      "outline-none",
      "border border-surface-300 dark:border-surface-700",

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
        "text-primary-contrast": context.checked,
        "text-primary": state.d_indeterminate,
      },

      // Transitions
      "transition-all",
      "duration-200",
    ],
  }),
};
