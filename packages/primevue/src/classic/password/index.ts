export default {
  root: ({ props }) => ({
    class: [
      "relative [&>input]:w-full",
      { "[&>input]:pr-10": props.toggleMask },
      { "flex [&>input]:w-full": props.fluid, "inline-flex": !props.fluid },
    ],
  }),
  overlay: {
    class: [
      // Spacing
      "p-3",

      // Shape
      "border",
      "shadow-md rounded-md",

      // Colors
      "bg-surface-page",
      "text-fg-default",
      "border-line-default",
    ],
  },
  meter: {
    class: [
      // Position and Overflow
      "overflow-hidden",
      "relative",

      // Shape and Size
      "border-0",
      "h-[10px]",
      "rounded-md",

      // Spacing
      "mb-3",

      // Colors
      "bg-surface-subtle",
    ],
  },
  meterLabel: ({ instance }) => ({
    class: [
      // Size
      "h-full",

      // Colors
      {
        "bg-fill-danger": instance?.meter?.strength == "weak",
        "bg-fill-warn": instance?.meter?.strength == "medium",
        "bg-fill-success": instance?.meter?.strength == "strong",
      },

      // Transitions
      "transition-all duration-1000 ease-in-out",
    ],
  }),
  maskIcon: {
    class: ["absolute top-1/2 right-3 -mt-2 z-10", "text-fg-subtle"],
  },
  unmaskIcon: {
    class: ["absolute top-1/2 right-3 -mt-2 z-10", "text-fg-subtle"],
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
