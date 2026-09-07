export default {
  root: ({ props }) => ({
    class: [
      "relative",
      {
        "flex flex-col h-full": props.scrollHeight === "flex",
      },
    ],
  }),
  mask: {
    class: [
      // Position
      "absolute",
      "top-0 left-0",
      "z-20",

      // Flex & Alignment
      "flex items-center justify-center",

      // Size
      "w-full h-full",

      // Color
      "bg-surface-raised",

      // Transition
      "transition duration-200",
    ],
  },
  loadingIcon: {
    class: "w-8 h-8 animate-spin",
  },
  tableContainer: ({ props }) => ({
    class: [
      // Overflow
      {
        "relative overflow-auto": props.scrollable,
        "overflow-x-auto": props.resizableColumns,
      },
    ],
  }),
  header: ({ props }) => ({
    class: [
      "font-semibold",

      // Shape
      props.showGridlines
        ? "border-x border-t border-b-0"
        : "border-y border-x-0",

      // Spacing
      "p-4",

      // Color
      "bg-surface-page",
      "border-line-default",
      "text-fg-default",
    ],
  }),
  footer: {
    class: [
      "font-semibold",

      // Shape
      "border-t-0 border-b border-x-0",

      // Spacing
      "p-4",

      // Color
      "bg-surface-page",
      "border-line-default",
      "text-fg-default",
    ],
  },
  table: {
    class: [
      // Table & Width
      "border-collapse table-fixed w-full ",
    ],
  },
  thead: ({ props }) => ({
    class: [
      // Position & Z-index
      {
        "top-0 z-40 sticky": props.scrollable,
      },
    ],
  }),
  tbody: ({ props }) => ({
    class: [
      // Block Display
      {
        block: props.scrollable,
      },
      "bg-surface-raised",
    ],
  }),
  tfoot: ({ props }) => ({
    class: [
      // Block Display
      {
        block: props.scrollable,
      },
    ],
  }),
  headerRow: ({ props }) => ({
    class: [
      // Flexbox & Width
      {
        "flex flex-nowrap w-full": props.scrollable,
      },
    ],
  }),
  row: ({ context, props }) => ({
    class: [
      // Flex
      { "flex flex-nowrap w-full": context.scrollable },

      // Color
      "text-fg-default",
      {
        "odd:bg-surface-subtle hover:bg-surface-hover odd:hover:bg-surface-hover":
          context.selected,
      },
      {
        "bg-surface-raised text-fg-subtle odd:bg-surface-subtle":
          !context.selected,
      },

      // Border
      "border-line-default",
      "border-b last:border-transparent focus:border-transparent",

      // Hover & Flexbox
      {
        "hover:bg-surface-page": context.selectable && !context.selected,
      },
    ],
  }),
  headerCell: ({ context, props }) => ({
    class: [
      "font-semibold",
      "leading-[normal]",

      // Position
      {
        "sticky z-40":
          context.scrollable &&
          context.scrollDirection === "both" &&
          context.frozen,
      },

      // Flex & Alignment
      {
        "flex flex-1 items-center": context.scrollable,
        "flex-initial shrink-0":
          context.scrollable &&
          context.scrollDirection === "both" &&
          !context.frozen,
      },
      "text-left",

      // Shape
      { "first:border-l border-y border-r": context?.showGridlines },
      "border-0 border-b border-solid",

      // Spacing
      context?.size === "small"
        ? "py-0.5 px-2"
        : context?.size === "large"
          ? "py-[0.9375rem] px-5"
          : "py-3 px-4",

      // Color
      (props.sortable === "" || props.sortable) && context.sorted
        ? "bg-surface-selected text-fg-strong"
        : "bg-surface-page text-fg-default",
      "border-line-default",

      // States
      {
        "hover:bg-surface-hover":
          (props.sortable === "" || props.sortable) && !context?.sorted,
      },

      // Transition
      { "transition duration-200": props.sortable === "" || props.sortable },

      // Misc
      {
        "overflow-hidden relative bg-clip-padding":
          context.resizable && !context.frozen,
      },
    ],
  }),
  column: {
    headerCell: ({ context, props }) => ({
      class: [
        "font-semibold",
        "leading-[normal]",

        // Position
        {
          "sticky z-40":
            context.scrollable &&
            context.scrollDirection === "both" &&
            context.frozen,
        },

        // Flex & Alignment
        {
          "flex flex-1 items-center": context.scrollable,
          "flex-initial shrink-0":
            context.scrollable &&
            context.scrollDirection === "both" &&
            !context.frozen,
        },
        "text-left",

        // Shape
        { "first:border-l border-y border-r": context?.showGridlines },
        "border-0 border-b border-solid",

        // Spacing
        context?.size === "small"
          ? "py-0.5 px-2"
          : context?.size === "large"
            ? "py-[0.9375rem] px-5"
            : "py-3 px-4",

        // Color
        (props.sortable === "" || props.sortable) && context.sorted
          ? "bg-surface-selected text-fg-strong"
          : "bg-surface-page text-fg-default",
        "border-line-default",

        // States
        {
          "hover:bg-surface-hover":
            (props.sortable === "" || props.sortable) && !context?.sorted,
        },

        // Transition
        { "transition duration-200": props.sortable === "" || props.sortable },

        // Misc
        {
          "overflow-hidden relative bg-clip-padding":
            context.resizable && !context.frozen,
        },
      ],
    }),
    bodyCell: ({ context }) => ({
      class: [
        // Font
        "leading-[normal]",

        // Position
        {
          sticky:
            context.scrollable &&
            context.scrollDirection === "both" &&
            context.frozen,
        },

        // Flex & Alignment
        {
          "flex flex-1 items-center": context.scrollable,
          "flex-initial shrink-0":
            context.scrollable &&
            context.scrollDirection === "both" &&
            !context.frozen,
        },
        "text-left",

        // Shape
        "border-line-default",
        {
          "border-x-0 border-l-0": !context.showGridlines,
        },
        { "first:border-l border-r border-b": context?.showGridlines },

        // Right block
        "first:relative first:before:absolute first:before:inset-0 first:before:w-1",
        { "first:before:bg-line-selected": context.selected },

        // Spacing
        context?.size === "small"
          ? "py-0.5 px-2"
          : context?.size === "large"
            ? "py-[0.9375rem] px-5"
            : "py-3 px-4",

        // Misc
        {
          "cursor-pointer": context.selectable,
          sticky:
            context.scrollable &&
            context.scrollDirection === "both" &&
            context.frozen,
          "border-x-0 border-l-0": !context.showGridlines,
        },
      ],
    }),
    bodyCellContent: "flex items-center gap-2",
    rowToggleIcon: ({ context }) => ({
      class: [
        // Size
        context?.size === "small"
          ? "size-[.6rem]"
          : context?.size === "large"
            ? "size-4"
            : "size-[.8rem]",
      ],
    }),
    nodeToggleButton: ({ context }) => ({
      class: [
        "relative",

        // Flex & Alignment
        "inline-flex items-center justify-center",
        "text-left align-middle",

        // Spacing
        "m-0 mr-2 p-0",

        // Size
        context.size === "small"
          ? "size-5"
          : context.size === "large"
            ? "size-7"
            : "size-6",

        // Shape
        "border-0 rounded-md",

        // Color
        "text-fg-default",
        "border-transparent",

        // States
        "hover:text-surface-200 hover:bg-surface-hover/50",

        // Transition
        "transition duration-200",

        // Misc
        "overflow-hidden",
        "cursor-pointer select-none",
      ],
    }),
    sortIcon: ({ context }) => ({
      class: [
        "ml-2 inline-block",
        context.sorted ? "text-inherit" : "fill-fg-default",
      ],
    }),
    columnResizer: {
      class: [
        "block",

        // Position
        "absolute top-0 right-0",

        // Sizing
        "w-2 h-full",

        // Spacing
        "m-0 p-0",

        // Color
        "border border-transparent",

        // Misc
        "cursor-col-resize",
      ],
    },
    transition: {
      enterFromClass: "opacity-0 scale-y-[0.8]",
      enterActiveClass:
        "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
      leaveActiveClass: "transition-opacity duration-100 ease-linear",
      leaveToClass: "opacity-0",
    },
  },
  columnResizeIndicator: {
    class: "absolute hidden w-[2px] z-20 bg-fill-primary",
  },
};
