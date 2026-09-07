export default {
  root: ({ props }) => ({
    class: [
      //Size and Shape
      "w-96 rounded-md",

      // Positioning
      {
        "-translate-x-2/4":
          props.position == "top-center" || props.position == "bottom-center",
      },
    ],
  }),
  message: ({ props }) => ({
    class: [
      "mb-4 rounded-md w-full",
      "border border-transparent",
      "backdrop-blur-[10px] shadow-md",

      // Colors
      {
        "bg-surface-info": props.message.severity == "info",
        "bg-surface-success": props.message.severity == "success",
        "bg-surface-raised": props.message.severity == "secondary",
        "bg-surface-warn": props.message.severity == "warn",
        "bg-surface-danger": props.message.severity == "error",
        "bg-surface-0": props.message.severity == "contrast",
      },
      {
        "border-line-info": props.message.severity == "info",
        "border-line-success": props.message.severity == "success",
        "border-line-default": props.message.severity == "secondary",
        "border-line-warn": props.message.severity == "warn",
        "border-line-danger": props.message.severity == "error",
        "border-surface-0": props.message.severity == "contrast",
      },
      {
        "text-fg-info": props.message.severity == "info",
        "text-fg-success": props.message.severity == "success",
        "text-fg-default": props.message.severity == "secondary",
        "text-fg-warn": props.message.severity == "warn",
        "text-fg-danger": props.message.severity == "error",
        "text-surface-900": props.message.severity == "contrast",
      },
    ],
  }),
  messageContent: ({ props }) => ({
    class: [
      "flex p-3",
      {
        "items-start": props.message.summary,
        "items-center": !props.message.summary,
      },
    ],
  }),
  messageIcon: ({ props }) => ({
    class: [
      // Sizing and Spacing
      props.message.severity === "contrast" ||
      props.message.severity === "secondary"
        ? "w-0"
        : "w-[1.125rem] h-[1.125rem] mr-2",
      "text-lg leading-[normal]",
    ],
  }),
  messageText: {
    class: [
      // Font and Text
      "text-base leading-[normal]",
      "ml-2",
      "flex-1",
    ],
  },
  summary: {
    class: "font-medium block",
  },
  detail: ({ props }) => ({
    class: [
      "block",
      "text-sm",
      props.message.severity === "contrast"
        ? "text-surface-900"
        : "text-fg-strong",
      { "mt-2": props.message.summary },
    ],
  }),
  closeButton: ({ props }) => ({
    class: [
      // Flexbox
      "flex items-center justify-center",

      // Size
      "w-7 h-7",

      // Spacing and Misc
      "ml-auto  relative",

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
    enterFromClass: "opacity-0 translate-y-2/4",
    enterActiveClass: "transition-[transform,opacity] duration-300",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass:
      "!transition-[max-height_.45s_cubic-bezier(0,1,0,1),opacity_.3s,margin-bottom_.3s] overflow-hidden",
    leaveToClass: "max-h-0 opacity-0 mb-0",
  },
};
