export default {
  root: "flex [&_[data-pc-name=pclist]]:h-full",
  sourceControls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",

      // Spacing
      "p-[1.125rem]",
    ],
  },
  sourceListContainer: {
    class: [
      // Flexbox
      "grow shrink basis-2/4",

      // Shape
      "rounded-md",

      // Color
      "bg-surface-page",
      "border border-line-default",
    ],
  },
  transferControls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",

      // Spacing
      "p-[1.125rem]",
    ],
  },
  targetListContainer: {
    class: [
      // Flexbox
      "grow shrink basis-2/4",

      // Shape
      "rounded-md",

      // Color
      "bg-surface-page",
      "border border-line-default",
    ],
  },
  targetControls: {
    class: [
      // Flexbox & Alignment
      "flex xl:flex-col justify-center gap-2",

      // Spacing
      "p-[1.125rem]",
    ],
  },
  transition: {
    enterFromClass: "!transition-none",
    enterActiveClass: "!transition-none",
    leaveActiveClass: "!transition-none",
    leaveToClass: "!transition-none",
  },
};
