export default {
  root: ({ props, context, parent }) => ({
    class: [
      // Font
      "leading-none",

      // Flex
      { "flex-1 w-[1%]": parent.instance.$name == "InputGroup" },

      // Spacing
      "m-0",
      { "w-full": props.fluid },

      // Size
      {
        "py-3 px-3.5": props.size == "large",
        "py-1.5 px-2": props.size == "small",
        "py-2 px-3": props.size == null,
      },

      // Shape
      { "rounded-md": parent.instance.$name !== "InputGroup" },
      {
        "first:rounded-l-md rounded-none last:rounded-r-md":
          parent.instance.$name == "InputGroup",
      },
      {
        "border-0 border-y border-l last:border-r":
          parent.instance.$name == "InputGroup",
      },
      {
        "first:ml-0 -ml-px":
          parent.instance.$name == "InputGroup" && !props.showButtons,
      },

      // Colors
      "text-fg-strong",
      "placeholder:text-fg-muted",
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

      // Misc
      "appearance-none",
      "transition-colors duration-200",
    ],
  }),
};
