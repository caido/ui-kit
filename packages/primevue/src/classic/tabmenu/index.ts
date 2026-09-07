export default {
  root: {
    class: "overflow-x-auto",
  },
  menu: {
    class: [
      // Flexbox
      "flex flex-1",

      // Spacing
      "list-none",
      "p-0 m-0",

      // Colors
      "bg-surface-page",
      "border-b-2 border-line-default",
      "text-fg-strong",
    ],
  },
  menuitem: {
    class: "mr-0",
  },
  action: ({ context, state }) => ({
    class: [
      "relative",

      // Font
      "font-semibold leading-none",

      // Flexbox and Alignment
      "flex items-center",

      // Spacing
      "py-4 px-[1.125rem]",
      "-mb-px",

      // Shape
      "border-b",
      "rounded-t-md",

      // Colors and Conditions
      {
        "border-line-default": state.d_activeIndex !== context.index,
        "text-fg-default": state.d_activeIndex !== context.index,

        "bg-surface-page": state.d_activeIndex === context.index,
        "border-line-primary": state.d_activeIndex === context.index,
        "text-fg-primary": state.d_activeIndex === context.index,
      },

      // States
      {
        "hover:text-fg-strong": state.d_activeIndex !== context.index,
      },

      // Transitions
      "transition-all duration-200",

      // Misc
      "cursor-pointer select-none text-decoration-none",
      "overflow-hidden",
      "user-select-none",
    ],
  }),
  icon: {
    class: "mr-2",
  },
};
