export default {
  root: ({ props }) => ({
    class: [
      "relative",

      // Flex & Alignment
      "flex items-center",
      "gap-1",

      // Misc
      {
        "opacity-60 select-none pointer-events-none cursor-default":
          props.disabled,
      },
    ],
  }),
  option: ({ props, context }) => ({
    class: [
      // Flex & Alignment
      "inline-flex items-center",

      // State

      // Misc
      {
        "cursor-pointer": !props.readonly,
        "cursor-default": props.readonly,
      },
    ],
  }),
  offIcon: ({ props }) => ({
    class: [
      // Size
      "w-4 h-4",

      // Color
      "text-fg-default",

      // State
      { "hover:text-fg-primary": !props.readonly },

      // Transition
      "transition duration-200 ease-in",
    ],
  }),
  onIcon: ({ props }) => ({
    class: [
      // Size
      "w-4 h-4",

      // Color
      "text-fg-primary",

      // State
      { "hover:text-fg-primary": !props.readonly },

      // Transition
      "transition duration-200 ease-in",
    ],
  }),
};
