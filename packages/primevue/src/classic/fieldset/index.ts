export default {
  root: {
    class: [
      // Spacing
      "p-[1.125rem] pt-0",

      // Shape
      "rounded-md",

      // Color
      "border border-line-default",
      "bg-surface-page",
      "text-fg-default",
    ],
  },
  legend: ({ props }) => ({
    class: [
      // Font
      "font-semibold",
      "leading-none",

      //Spacing
      "p-0 mb-[0.375rem]",

      // Shape
      "rounded-md",

      // Color
      "text-fg-default",
      "bg-surface-page",

      // Transition
      "transition-none",

      // States
      { "hover:bg-surface-hover": props.toggleable },
    ],
  }),
  toggleButton: ({ props }) => ({
    class: [
      // Alignments
      "flex items-center justify-center",
      "relative",

      //Spacing
      { "py-2 px-3": props.toggleable },

      // Shape
      { "rounded-md": props.toggleable },

      // Color
      {
        "text-fg-subtle hover:text-surface-900": props.toggleable,
      },

      // States
      {
        "hover:text-fg-strong": props.toggleable,
      },

      // Misc
      {
        "transition-none cursor-pointer overflow-hidden select-none":
          props.toggleable,
      },
    ],
  }),
  toggleIcon: {
    class: "mr-2 inline-block",
  },
  legendLabel: ({ props }) => ({
    class: [
      "flex items-center justify-center leading-none",
      { "py-2 px-3": !props.toggleable },
    ],
  }),
  content: {
    class: "p-0",
  },
  transition: {
    enterFromClass: "max-h-0",
    enterActiveClass:
      "overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]",
    enterToClass: "max-h-[1000px]",
    leaveFromClass: "max-h-[1000px]",
    leaveActiveClass:
      "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]",
    leaveToClass: "max-h-0",
  },
};
