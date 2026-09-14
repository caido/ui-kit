export default {
  root: ({ props, parent }) => ({
    class: [
      // Flex
      "inline-flex",
      "relative",
      { "flex-col": props.showButtons && props.buttonLayout === "vertical" },
      { "flex-1 w-[1%]": parent.instance.$name === "InputGroup" },
      { "w-full": props.fluid },

      // Shape
      {
        "first:rounded-l-md rounded-none last:rounded-r-md":
          parent.instance.$name === "InputGroup" && !props.showButtons,
      },
      {
        "border-0 border-y border-l last:border-r border-line-default":
          parent.instance.$name === "InputGroup" && !props.showButtons,
      },
      {
        "first:ml-0 -ml-px":
          parent.instance.$name === "InputGroup" && !props.showButtons,
      },

      //Sizing
      { "!w-16": props.showButtons && props.buttonLayout == "vertical" },
    ],
  }),
  pcInput: {
    root: ({ parent, context }) => ({
      class: [
        // Font
        "leading-none",

        // Display
        "flex-auto",
        { "w-[1%]": parent.props.fluid },

        //Text
        {
          "text-center":
            parent.props.showButtons && parent.props.buttonLayout == "vertical",
        },

        // Spacing
        "py-2 px-3",
        "m-0",

        // Shape
        "rounded-md",
        {
          "rounded-l-none rounded-r-none":
            parent.props.showButtons &&
            parent.props.buttonLayout === "horizontal",
        },
        {
          "rounded-none":
            parent.props.showButtons &&
            parent.props.buttonLayout === "vertical",
        },

        {
          "border-0":
            parent.instance.$parentInstance?.$name === "InputGroup" &&
            !parent.props.showButtons,
        },

        // Colors
        "text-fg-strong",
        "placeholder:text-fg-muted",
        { "bg-surface-page": !context.disabled },
        "border",
        { "border-line-default": !parent.props.invalid },

        // Invalid State
        "invalid:hover:border-line-danger",
        { "border-line-danger": parent.props.invalid },

        // States
        { "hover:border-fill-secondary": !parent.props.invalid },
        "focus:z-10",
        {
          "bg-surface-subtle select-none pointer-events-none cursor-default":
            context.disabled,
        },

        // Filled State *for FloatLabel
        {
          filled:
            parent.instance?.$parentInstance?.$name === "FloatLabel" &&
            parent.state.d_modelValue !== null,
        },

        //Position
        {
          "order-2":
            parent.props.buttonLayout == "horizontal" ||
            parent.props.buttonLayout === "vertical",
        },
      ],
    }),
  },
  buttonGroup: ({ props }) => ({
    class: [
      "absolute",
      "z-20",

      // Flex
      "flex",
      "flex-col",

      "top-px right-px",

      {
        "h-[calc(100%-2px)]":
          props.showButtons && props.buttonLayout === "stacked",
      },
    ],
  }),
  incrementButton: ({ props }) => ({
    class: [
      // Display
      {
        "flex flex-initial shrink-0":
          props.showButtons && props.buttonLayout === "horizontal",
      },
      {
        "flex flex-auto": props.showButtons && props.buttonLayout === "stacked",
      },

      // Alignment
      "items-center",
      "justify-center",
      "text-center align-bottom",

      //Position
      "relative",
      { "order-3": props.showButtons && props.buttonLayout === "horizontal" },
      { "order-1": props.showButtons && props.buttonLayout === "vertical" },

      //Color
      "text-fg-strong",
      "bg-transparent",
      {
        "bg-surface-page":
          props.showButtons && props.buttonLayout !== "stacked",
      },
      "border border-line-default",
      { "border-0": props.showButtons && props.buttonLayout === "stacked" },
      {
        "border-l-0":
          props.showButtons &&
          props.buttonLayout !== "stacked" &&
          props.buttonLayout === "horizontal",
      },
      {
        "border-b-0":
          props.showButtons &&
          props.buttonLayout !== "stacked" &&
          props.buttonLayout === "vertical",
      },

      // Sizing
      "w-[3rem]",
      { "px-3 py-2": props.showButtons && props.buttonLayout !== "stacked" },
      { "p-0": props.showButtons && props.buttonLayout === "stacked" },
      { "w-full": props.showButtons && props.buttonLayout === "vertical" },

      // Shape
      "rounded-md",
      { "rounded-md": props.showButtons && props.buttonLayout == "stacked" },
      {
        "rounded-bl-none rounded-tl-none":
          props.showButtons && props.buttonLayout === "horizontal",
      },
      {
        "rounded-bl-none rounded-br-none":
          props.showButtons && props.buttonLayout === "vertical",
      },

      //States
      "hover:bg-surface-hover",

      //Misc
      "cursor-pointer overflow-hidden select-none",
    ],
  }),
  incrementIcon: "inline-block w-4 h-4",
  decrementButton: ({ props }) => ({
    class: [
      // Display
      {
        "flex flex-initial shrink-0":
          props.showButtons && props.buttonLayout === "horizontal",
      },
      {
        "flex flex-auto": props.showButtons && props.buttonLayout === "stacked",
      },

      // Alignment
      "items-center",
      "justify-center",
      "text-center align-bottom",

      //Position
      "relative",
      { "order-1": props.showButtons && props.buttonLayout === "horizontal" },
      { "order-3": props.showButtons && props.buttonLayout === "vertical" },

      //Color
      "text-fg-strong",
      "bg-transparent",
      {
        "bg-surface-page":
          props.showButtons && props.buttonLayout !== "stacked",
      },
      "border border-line-default",
      { "border-0": props.showButtons && props.buttonLayout === "stacked" },
      {
        "border-r-0":
          props.showButtons &&
          props.buttonLayout !== "stacked" &&
          props.buttonLayout === "horizontal",
      },
      {
        "border-t-0":
          props.showButtons &&
          props.buttonLayout !== "stacked" &&
          props.buttonLayout === "vertical",
      },

      // Sizing
      "w-[3rem]",
      { "px-3 py-2": props.showButtons && props.buttonLayout !== "stacked" },
      { "p-0": props.showButtons && props.buttonLayout === "stacked" },
      { "w-full": props.showButtons && props.buttonLayout === "vertical" },

      // Shape
      "rounded-md",
      {
        "rounded-tr-none rounded-tl-none rounded-bl-none":
          props.showButtons && props.buttonLayout === "stacked",
      },
      {
        "rounded-tr-none rounded-br-none ":
          props.showButtons && props.buttonLayout === "horizontal",
      },
      {
        "rounded-tr-none rounded-tl-none ":
          props.showButtons && props.buttonLayout === "vertical",
      },

      //States
      "hover:bg-surface-hover",

      //Misc
      "cursor-pointer overflow-hidden select-none",
    ],
  }),
  decrementIcon: "inline-block w-4 h-4",
};
