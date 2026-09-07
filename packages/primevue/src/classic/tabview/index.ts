export default {
  // For PrimeVue version 3
  navContainer: ({ props }) => ({
    class: [
      // Position
      "relative",

      // Misc
      { "overflow-hidden": props.scrollable },
    ],
  }),
  navContent: ({ instance }) => ({
    class: [
      // Overflow and Scrolling
      "overflow-y-hidden overscroll-contain",
      "overscroll-auto",
      "scroll-smooth",
      "[&::-webkit-scrollbar]:hidden",
    ],
  }),
  previousButton: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",

      // Position
      "!absolute",
      "top-0 left-0",
      "z-20",

      // Size and Shape
      "h-full w-10",
      "rounded-none",

      // Colors
      "bg-surface-page",
      "text-fg-default",
      "shadow-xs",
    ],
  },
  nextButton: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",

      // Position
      "!absolute",
      "top-0 right-0",
      "z-20",

      // Size and Shape
      "h-full w-10",
      "rounded-none",

      // Colors
      "text-fg-default",
      "bg-surface-page",
      "shadow-xs",
    ],
  },
  nav: {
    class: [
      // Flexbox
      "flex flex-1",

      // Spacing
      "list-none",
      "p-0 m-0",

      // Colors
      "bg-surface-page",
      "border-b border-line-default",
      "text-fg-strong",
    ],
  },
  tabpanel: {
    header: ({ props }) => ({
      class: [
        // Spacing
        "mr-0",

        // Misc
        {
          "opacity-60 cursor-default user-select-none select-none pointer-events-none":
            props?.disabled,
        },
      ],
    }),
    headerAction: ({ parent, context }) => ({
      class: [
        "relative",

        // Font
        "font-semibold",

        // Flexbox and Alignment
        "flex items-center",

        // Spacing
        "py-4 px-[1.125rem]",
        "-mb-px",

        // Shape
        "border-b-2",
        "rounded-t-md",

        // Colors and Conditions
        {
          "border-line-default": parent.state.d_activeIndex !== context.index,
          "text-fg-default": parent.state.d_activeIndex !== context.index,

          "bg-surface-page": parent.state.d_activeIndex === context.index,
          "border-line-primary": parent.state.d_activeIndex === context.index,
          "text-fg-primary": parent.state.d_activeIndex === context.index,
        },

        // States
        {
          "hover:bg-surface-raised":
            parent.state.d_activeIndex !== context.index,
          "hover:text-fg-strong": parent.state.d_activeIndex !== context.index,
        },

        // Transitions
        "transition-all duration-200",

        // Misc
        "cursor-pointer select-none text-decoration-none",
        "overflow-hidden",
        "user-select-none",
      ],
    }),
    headerTitle: {
      class: [
        // Text
        "leading-none",
        "whitespace-nowrap",
      ],
    },
  },
  panelcontainer: {
    class: [
      // Spacing
      "p-[1.125rem] pt-[0.875rem]",

      // Shape
      "border-0 rounded-none",
      "border-br-md border-bl-md",

      // Colors
      "bg-surface-page",
      "text-fg-strong",
    ],
  },
};
