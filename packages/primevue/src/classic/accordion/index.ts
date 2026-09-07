export default {
  // For PrimeVue version 3
  accordiontab: {
    root: {
      class: ["mb-0", "border-b border-line-default"],
    },
    header: ({ props }) => ({
      class: [
        // State
        {
          "select-none pointer-events-none cursor-default opacity-60":
            props?.disabled,
        },
      ],
    }),
    headerAction: {
      class: [
        //Font
        "font-semibold",
        "leading-none",

        // Alignments
        "flex justify-between items-center",
        "flex-row-reverse",
        "relative",

        // Sizing
        "p-[1.125rem]",

        // Shape
        "rounded-md",
        "border-0",

        // Color
        "bg-surface-page",
        "text-fg-subtle",

        // Transition
        "transition duration-200 ease-in-out",
        "transition-shadow duration-200",

        // States // Focus

        // Misc
        "cursor-pointer no-underline select-none",
      ],
    },
    headerIcon: ({ context }) => ({
      class: ["inline-block ml-2", { "text-fg-strong": context.active }],
    }),
    headerTitle: {
      class: "leading-none",
    },
    content: {
      class: [
        // Spacing
        "p-[1.125rem] pt-0",

        //Shape
        "border-0 rounded-none",

        // Color
        "bg-surface-page",
        "text-fg-subtle",
      ],
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
  },
};
