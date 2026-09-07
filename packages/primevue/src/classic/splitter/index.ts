export default {
  root: ({ context }) => ({
    class: [
      // Colors
      "bg-transparent",
      "text-fg-default",

      // Shape
      "rounded-md",

      // Nested
      { "flex grow border-0": context.nested },
    ],
  }),

  gutter: ({ props }) => ({
    class: [
      // Flexbox
      "flex",
      "items-center",
      "justify-center",
      "shrink-0",

      // Colors
      "bg-transparent",
      "bg-transparent",

      // Transitions
      "transition-all",
      "duration-200",

      // Misc
      {
        "cursor-col-resize": props.layout == "horizontal",
        "cursor-row-resize": props.layout !== "horizontal",
      },
    ],
  }),
  gutterhandle: ({ props }) => ({
    class: [
      "z-20",
      // Colors
      "bg-surface-700",

      // Shape
      "rounded-md",

      //States

      // Transitions
      "transition-all",
      "duration-200",

      "m-[1px]",

      // Sizing (Conditional)
      {
        "!w-[2px] !h-10": props.layout == "horizontal",
        "!h-[2px] !w-10": props.layout !== "horizontal",
      },
    ],
  }),
};
