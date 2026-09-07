export default {
  root: {
    class: [
      // Space
      "p-4",

      // Shape
      "rounded-md",
      "border-none",

      // Color
      "bg-surface-page",
      "text-fg-default",
      "[&_[data-pc-name=pcfilter]]:w-full",
    ],
  },
  wrapper: {
    class: ["overflow-auto"],
  },
  container: {
    class: [
      // Spacing
      "m-0 p-0",

      // Misc
      "list-none overflow-auto",
    ],
  },
  node: {
    class: ["p-0 my-[2px] mx-0 first:mt-0", "rounded-md", "focus:z-10"],
  },
  nodeContent: ({ context, props }) => ({
    class: [
      // Flex and Alignment
      "flex items-center",

      // Shape
      "rounded-md",

      // Spacing
      "py-1 px-2 gap-2",

      // Colors
      context.selected
        ? "bg-surface-selected text-fg-strong "
        : "bg-transparent text-fg-subtle",

      // States
      {
        "hover:bg-surface-hover":
          (props.selectionMode == "single" ||
            props.selectionMode == "multiple") &&
          !context.selected,
      },

      // Transition
      "transition-shadow duration-200",

      {
        "cursor-pointer select-none":
          props.selectionMode == "single" || props.selectionMode == "multiple",
      },
    ],
  }),
  nodeToggleButton: ({ context }) => ({
    class: [
      // Flex and Alignment
      "inline-flex items-center justify-center",

      // Shape
      "border-0 rounded-full",

      // Size
      "w-7 h-7",

      // Colors
      "bg-transparent",
      {
        "text-fg-subtle": !context.selected,
        "text-fg-strong": context.selected,
        invisible: context.leaf,
      },

      // States
      "hover:bg-surface-hover",

      // Transition
      "transition duration-200",

      // Misc
      "cursor-pointer select-none",
    ],
  }),
  nodeIcon: ({ context }) => ({
    class: [
      // Space
      "mr-2",

      // Color
      {
        "text-fg-subtle": !context.selected,
        "text-fg-strong": context.selected,
      },
    ],
  }),
  nodeLabel: ({ context }) => ({
    class: [
      {
        "text-fg-subtle": !context.selected,
        "text-fg-strong": context.selected,
      },
    ],
  }),
  nodeChildren: {
    class: ["m-0 list-none p-0 pl-4 [&:not(ul)]:pl-0 [&:not(ul)]:my-[2px]"],
  },
  loadingIcon: {
    class: [
      "text-fg-muted",
      "absolute top-[50%] right-[50%] -mt-2 -mr-2 animate-spin",
    ],
  },
};
