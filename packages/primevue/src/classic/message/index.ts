export default {
  root: ({ props }) => ({
    class: [
      // Spacing and Shape
      "rounded-md",
      "outline",

      // Colors
      {
        "bg-surface-info": props.severity == "info",
        "bg-surface-success": props.severity == "success",
        "bg-surface-subtle": props.severity == "secondary",
        "bg-surface-warn": props.severity == "warn",
        "bg-surface-danger": props.severity == "error",
        "bg-surface-0": props.severity == "contrast",
      },
      {
        "outline-line-info": props.severity == "info",
        "outline-line-success": props.severity == "success",
        "outline-line-default": props.severity == "secondary",
        "outline-line-warn": props.severity == "warn",
        "outline-line-danger": props.severity == "error",
        "outline-surface-0": props.severity == "contrast",
      },
      {
        "text-fg-info": props.severity == "info",
        "text-fg-success": props.severity == "success",
        "text-fg-default": props.severity == "secondary",
        "text-fg-warn": props.severity == "warn",
        "text-fg-danger": props.severity == "error",
        "text-surface-900": props.severity == "contrast",
      },
    ],
  }),
  content: {
    class: [
      // Flexbox
      "flex items-center h-full",

      // Spacing
      "py-2 px-3 gap-2",
    ],
  },
  icon: {
    class: [
      // Sizing and Spacing
      "shrink-0 w-[1.125rem] h-[1.125rem]",
    ],
  },
  text: {
    class: [
      // Font and Text
      "text-base leading-[normal]",
      "font-medium",
    ],
  },
  closeButton: ({ props }) => ({
    class: [
      // Flexbox
      "flex items-center justify-center",

      // Size
      "w-7 h-7",

      // Spacing and Misc
      "ml-auto relative",

      // Shape
      "rounded-full",

      // Colors
      "bg-transparent",

      // Transitions
      "transition duration-200 ease-in-out",

      // States
      "hover:bg-surface-hover",

      // Misc
      "overflow-hidden",
    ],
  }),
  transition: {
    enterFromClass: "opacity-0",
    enterActiveClass: "transition-opacity duration-300",
    leaveFromClass: "max-h-40",
    leaveActiveClass: "overflow-hidden transition-all duration-300 ease-in",
    leaveToClass: "max-h-0 opacity-0 !m-0",
  },
};
