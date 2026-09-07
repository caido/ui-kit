export default {
  root: ({ props }) => ({
    class: [
      // Display and Position
      {
        flex: props.fluid,
        "inline-flex": !props.fluid,
      },
      "max-w-full",
      "relative",
    ],
  }),
  pcInput: ({ props, parent }) => ({
    root: {
      class: [
        // Display
        "flex-auto w-[1%]",

        // Font
        "leading-none",

        // Colors
        "text-fg-subtle",
        "placeholder:text-fg-muted",
        { "bg-surface-page": !props.disabled },
        "border",
        { "border-line-strong": !props.invalid },

        // Invalid State
        "invalid:hover:border-line-danger",
        { "border-line-danger": props.invalid },

        // Spacing
        "m-0 py-2 px-3",

        // Shape
        "appearance-none",
        { "rounded-md": !props.showIcon || props.iconDisplay == "input" },
        {
          "rounded-l-md  flex-1 pr-9":
            props.showIcon && props.iconDisplay !== "input",
        },
        {
          "rounded-md flex-1 pr-9":
            props.showIcon && props.iconDisplay === "input",
        },

        // Transitions
        "transition-colors",
        "duration-200",

        // States
        {
          "hover:border-line-strong": !props.disabled && !props.invalid,
          "focus:z-10": !props.disabled,
          "bg-surface-subtle select-none pointer-events-none cursor-default":
            props.disabled,
        },

        // Filled State *for FloatLabel
        {
          filled:
            parent.instance?.$name == "FloatLabel" && props.modelValue !== null,
        },
      ],
    },
  }),
  dropdownIcon: {
    class: ["absolute top-1/2 -mt-2", "text-fg-subtle", "right-3"],
  },
  dropdown: {
    class: [
      "relative",

      // Alignments
      "items-center inline-flex text-center align-bottom justify-center",

      // Shape
      "rounded-r-md",

      // Size
      "py-2 px-0",
      "w-10",
      "leading-[normal]",

      // Colors
      "border border-l-0 border-line-default",

      // States
      "hover:bg-fill-primary-hover hover:border-fill-primary-hover",
    ],
  },
  inputIconContainer: "absolute cursor-pointer top-1/2 right-3 -mt-3",
  inputIcon: "inline-block text-base",
  panel: ({ props }) => ({
    class: [
      // Display & Position
      {
        absolute: !props.inline,
        "inline-block": props.inline,
      },

      // Size
      { "w-auto p-3 ": !props.inline },
      { "min-w-[80vw] w-auto p-3 ": props.touchUI },
      { "p-3 min-w-full": props.inline },

      // Shape
      "border rounded-lg",
      {
        "shadow-md": !props.inline,
      },

      // Colors
      "bg-surface-page",
      "border-line-default",

      //misc
      { "overflow-x-auto": props.inline },
    ],
  }),
  header: {
    class: [
      //Font
      "font-medium",

      // Flexbox and Alignment
      "flex items-center justify-between",

      // Spacing
      "p-0 pb-2",
      "m-0",

      // Shape
      "border-b",
      "rounded-t-md",

      // Colors
      "text-fg-default",
      "bg-surface-page",
      "border-line-default",
    ],
  },
  title: {
    class: [
      // Text
      "leading-7",
      "mx-auto my-0",
    ],
  },
  selectMonth: {
    class: [
      // Font
      "text-base leading-[normal]",
      "font-medium",

      //shape
      "rounded-md",

      // Colors
      "text-fg-default",

      // Transitions
      "transition duration-200",

      // Spacing
      "p-1",
      "m-0 mr-2",

      // States
      "hover:text-fg-primary",
      "focus:z-10",

      // Misc
      "cursor-pointer",
    ],
  },
  selectYear: {
    class: [
      // Font
      "text-base leading-[normal]",
      "font-medium",

      //shape
      "rounded-md",

      // Colors
      "text-fg-default",

      // Transitions
      "transition duration-200",

      // Spacing
      "p-1",
      "m-0 mr-2",

      // States
      "hover:text-fg-primary",
      "focus:z-10",

      // Misc
      "cursor-pointer",
    ],
  },
  table: {
    class: [
      // Font
      "text-base leading-[normal]",
      // Size & Shape
      "border-collapse",
      "w-full",

      // Spacing
      "m-0 mt-2",
    ],
  },
  tableHeaderCell: {
    class: [
      // Spacing
      "p-1",
      "font-medium",
    ],
  },
  weekHeader: {
    class: ["leading-5", "text-fg-subtle", "opacity-60 cursor-default"],
  },
  weekNumber: {
    class: ["text-fg-subtle", "opacity-60 cursor-default"],
  },
  weekday: {
    class: [
      // Colors
      "text-fg-muted",
      "p-1",
    ],
  },
  dayCell: {
    class: [
      // Spacing
      "p-1",
    ],
  },
  weekLabelContainer: {
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",
      "mx-auto",

      // Shape & Size
      "w-8 h-8",
      "rounded-full",
      "border-transparent border",
      "leading-[normal]",

      // Colors
      "opacity-60 cursor-default",
    ],
  },
  dayView: "w-full",
  day: ({ context }) => ({
    class: [
      // Flexbox and Alignment
      "flex items-center justify-center",
      "mx-auto",

      // Shape & Size
      "w-8 h-8",
      "rounded-full",
      "border-transparent border",
      "leading-[normal]",

      // Colors
      {
        "bg-surface-subtle text-fg-subtle":
          context.date.today && !context.selected && !context.disabled,
        "bg-transparent text-fg-subtle":
          !context.selected && !context.disabled && !context.date.today,
        "bg-surface-selected text-fg-strong":
          context.selected && !context.disabled,
      },

      // States
      "focus:z-10",
      {
        "hover:bg-surface-hover": !context.selected && !context.disabled,
      },
      {
        "opacity-60 cursor-default": context.disabled,
        "cursor-pointer": !context.disabled,
      },
    ],
  }),
  monthView: {
    class: [
      // Spacing
      "mt-2",
    ],
  },
  month: ({ context }) => ({
    class: [
      // Flexbox and Alignment
      "inline-flex items-center justify-center",

      // Size
      "w-1/3",
      "p-1",

      // Shape
      "rounded-md",

      // Colors
      {
        "text-fg-subtle bg-transparent": !context.selected && !context.disabled,
        "bg-surface-selected text-fg-strong":
          context.selected && !context.disabled,
      },

      // States
      "focus:z-10",
      {
        "hover:bg-surface-hover": !context.selected && !context.disabled,
      },

      // Misc
      "cursor-pointer",
    ],
  }),
  yearView: {
    class: [
      // Spacing
      "mt-2",
    ],
  },
  year: ({ context }) => ({
    class: [
      // Flexbox and Alignment
      "inline-flex items-center justify-center",

      // Size
      "w-1/2",
      "p-1",

      // Shape
      "rounded-md",

      // Colors
      {
        "text-fg-subtle bg-transparent": !context.selected && !context.disabled,
        "bg-surface-selected text-fg-strong":
          context.selected && !context.disabled,
      },

      // States
      "focus:z-10",
      {
        "hover:bg-surface-hover": !context.selected && !context.disabled,
      },

      // Misc
      "cursor-pointer",
    ],
  }),
  timePicker: {
    class: [
      // Flexbox
      "flex",
      "justify-center items-center",

      // Borders
      "border-t-1",
      "border-solid border-surface-200",

      // Spacing
      "pt-2 mt-2",
    ],
  },
  separatorContainer: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",

      // Spacing
      "px-2",
    ],
  },
  separator: {
    class: [
      // Text
      "text-xl",
    ],
  },
  hourPicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",

      // Spacing
      "px-2",
    ],
  },
  minutePicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",

      // Spacing
      "px-2",
    ],
  },
  secondPicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",

      // Spacing
      "px-2",
    ],
  },
  ampmPicker: {
    class: [
      // Flexbox and Alignment
      "flex",
      "items-center",
      "flex-col",

      // Spacing
      "px-2",
    ],
  },
  calendarContainer: "flex",
  calendar: "flex-auto border-l first:border-l-0 border-surface-200",
  buttonbar: {
    class: [
      // Flexbox
      "flex justify-between items-center",

      // Spacing
      "pt-2",

      // Shape
      "border-t border-line-default",
    ],
  },
  transition: {
    enterFromClass: "opacity-0 scale-y-[0.8]",
    enterActiveClass:
      "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
    leaveActiveClass: "transition-opacity duration-100 ease-linear",
    leaveToClass: "opacity-0",
  },
};
