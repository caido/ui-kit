export default {
  root: ({ context }) => ({
    class: [
      "relative flex flex-auto items-center gap-2 p-2 last-of-type:flex-[initial]",
      {
        "cursor-default pointer-events-none select-none opacity-60":
          context.disabled,
      },
      "[&_[data-pc-section=separator]]:has-[~[data-p-active=true]]:bg-fill-secondary",
    ],
  }),
  header: ({ props, context }) => ({
    class: [
      "inline-flex items-center border-0 cursor-pointer rounded-md outline-transparent bg-transparent p-0 gap-2",
      { "!cursor-default": context.active },
      { "cursor-auto": props.linear },
    ],
  }),
  number: ({ context }) => ({
    class: [
      // Flexbox
      "flex",
      "items-center",
      "justify-center",

      //Colors
      "border-solid border-2 border-line-default",

      // Colors (Conditional)
      context.active ? "text-fg-secondary" : "text-fg-strong", // Adjust colors as needed

      // Size and Shape
      "min-w-[2rem]",
      "h-[2rem]",
      "line-height-[2rem]",
      "rounded-full",

      // Text
      "text-lg",

      // Transitions
      "transition",
      "transition-colors",
      "transition-shadow",
      "duration-200",
    ],
  }),
  title: ({ context }) => ({
    class: [
      // Layout
      "block",
      "whitespace-nowrap",
      "overflow-hidden",
      "text-ellipsis",
      "max-w-full",

      // Text
      context.active ? "text-fg-secondary" : "text-fg-default",
      "font-medium",

      // Transitions
      "transition",
      "transition-colors",
      "transition-shadow",
      "duration-200",
    ],
  }),
};
