export default {
  root: ({ props }) => ({
    class: [
      //Font
      "text-xs font-bold",

      //Alignments
      "inline-flex items-center justify-center",

      //Spacing
      "px-[0.4rem] py-1",

      //Shape
      {
        "rounded-md": !props.rounded,
        "rounded-full": props.rounded,
      },

      //Colors
      {
        "bg-surface-selected text-fg-strong":
          props.severity === null || props.severity === "primary",
        "text-fg-success-strong bg-surface-success":
          props.severity === "success",
        "text-fg-default bg-surface-hover": props.severity === "secondary",
        "text-fg-info-strong bg-surface-info": props.severity === "info",
        "text-fg-warn-strong bg-surface-warn": props.severity === "warn",
        "text-fg-danger-strong bg-surface-danger": props.severity === "danger",
        "text-surface-900 bg-surface-0": props.severity === "contrast",
      },
    ],
  }),
  value: {
    class: "leading-normal",
  },
  icon: {
    class: "mr-1 text-sm",
  },
};
