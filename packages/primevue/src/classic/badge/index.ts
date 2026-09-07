export default {
  root: ({ props }) => ({
    class: [
      // Font
      "font-bold",

      {
        "text-xs leading-[1.5rem]": props.size === null,
        "text-[0.625rem] leading-[1.25rem]": props.size === "small",
        "text-lg leading-[2.25rem]": props.size === "large",
        "text-2xl leading-[3rem]": props.size === "xlarge",
      },

      // Alignment
      "text-center inline-block",

      // Size
      "p-0 px-1",
      {
        "w-2 h-2": props.value === null,
        "min-w-[1.5rem] h-[1.5rem]":
          props.value !== null && props.size === null,
        "min-w-[1.25rem] h-[1.25rem]": props.size === "small",
        "min-w-[2.25rem] h-[2.25rem]": props.size === "large",
        "min-w-[3rem] h-[3rem]": props.size === "xlarge",
      },

      // Shape
      {
        "rounded-full": props.value?.length === 1,
        "rounded-[0.71rem]": props.value?.length !== 1,
      },

      // Color
      {
        "bg-fill-primary text-fg-on-primary":
          props.severity == null || props.severity === "primary",
        "bg-fill-neutral text-fg-on-neutral": props.severity === "secondary",
        "bg-fill-success text-fg-on-success": props.severity === "success",
        "bg-fill-info text-fg-on-info":
          props.severity === "info" || props.severity === "help",
        "bg-fill-warn text-fg-on-warn": props.severity === "warn",
        "bg-fill-danger text-fg-on-danger": props.severity === "danger",
        "text-surface-900 bg-surface-0": props.severity === "contrast",
      },
    ],
  }),
};
