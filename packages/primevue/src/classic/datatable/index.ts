export default {
  root: ({ props }) => ({
    class: [
      "relative",

      // Flex & Alignment
      { "flex flex-col": props.scrollable && props.scrollHeight === "flex" },

      // Size
      { "h-full": props.scrollable && props.scrollHeight === "flex" },
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
      "bg-surface-page",

      // Transition
      "transition duration-200",
    ],
  },
  loadingIcon: {
    class: "w-8 h-8 animate-spin",
  },
  tableContainer: ({ props }) => ({
    class: [
      {
        relative: props.scrollable,
        "flex flex-col grow": props.scrollable && props.scrollHeight === "flex",
      },

      // Size
      { "h-full": props.scrollable && props.scrollHeight === "flex" },
    ],
  }),
  header: ({ props }) => ({
    class: [
      "font-bold",

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
  table: {
    class: "w-full border-spacing-0 border-separate",
  },
  thead: ({ context }) => ({
    class: [
      {
        "bg-surface-page top-0 z-40 sticky": context.scrollable,
      },
    ],
  }),
  tbody: ({ instance, context }) => ({
    class: [
      {
        "sticky z-20": instance.frozenRow && context.scrollable,
      },
      "bg-surface-raised",
    ],
  }),
  tfoot: ({ context }) => ({
    class: [
      {
        "bg-surface-0 bottom-0 z-0": context.scrollable,
      },
    ],
  }),
  footer: {
    class: [
      "font-bold",

      // Shape
      "border-t-0 border-b border-x-0 dark:border-b-0",

      // Spacing
      "p-4",

      // Color
      "bg-surface-raised",
      "border-line-default",
      "text-fg-default",
    ],
  },
  column: {
    headerCell: ({ context, props }) => ({
      class: [
        "font-semibold dark:font-normal",
        "leading-[normal]",

        // Position
        { "sticky z-20 border-b": props.frozen || props.frozen === "" },

        { relative: context.resizable },

        // Alignment
        "text-left",

        // Shape
        { "first:border-l border-y border-r": context?.showGridlines },
        "border-x-0 border-y-2 border-solid",

        // Spacing
        context?.size === "small"
          ? "py-[0.375rem] px-2"
          : context?.size === "large"
            ? "py-[0.9375rem] px-5"
            : "py-3 px-4",

        // Color
        (props.sortable === "" || props.sortable) && context.sorted
          ? "bg-surface-selected text-fg-strong"
          : "bg-surface-raised text-fg-default",
        "border-line-default",

        // States
        {
          "hover:bg-surface-hover/50":
            (props.sortable === "" || props.sortable) && !context?.sorted,
        },

        // Transition
        { "transition duration-200": props.sortable === "" || props.sortable },

        // Misc
        { "cursor-pointer": props.sortable === "" || props.sortable },
        {
          "overflow-hidden whitespace-nowrap border-y bg-clip-padding":
            context?.resizable, // Resizable
        },
      ],
    }),
    columnHeaderContent: {
      class: "flex items-center gap-2",
    },
    sort: ({ context }) => ({
      class: [
        context.sorted ? "text-fg-primary" : "text-surface-700",
        context.sorted ? "text-fg-primary" : "text-fg-default",
      ],
    }),
    bodyCell: ({ props, context, state, parent }) => ({
      class: [
        // Font
        "leading-[normal]",

        //Position
        { "sticky box-border border-b": parent.instance.frozenRow },
        {
          "sticky box-border border-b z-20":
            props.frozen || props.frozen === "",
        },

        // Alignment
        "text-left",

        // Shape
        "border-0 border-b dark:border-b-0 border-solid",
        { "first:border-l border-r border-b": context?.showGridlines },
        {
          "bg-surface-page":
            parent.instance.frozenRow || props.frozen || props.frozen === "",
        },

        // Spacing
        {
          "py-[0.375rem] px-2":
            context?.size === "small" && !state["d_editing"],
        },
        {
          "py-[0.9375rem] px-5":
            context?.size === "large" && !state["d_editing"],
        },
        {
          "py-3 px-4":
            context?.size !== "large" &&
            context?.size !== "small" &&
            !state["d_editing"],
        },
        { "py-[0.6rem] px-2": state["d_editing"] },

        // Color
        "border-line-default",

        {
          "overflow-hidden whitespace-nowrap border-y bg-clip-padding":
            parent.instance?.$parentInstance?.$parentInstance?.resizableColumns, // Resizable
        },
      ],
    }),
    footerCell: ({ context }) => ({
      class: [
        // Font
        "font-bold",

        // Alignment
        "text-left",

        // Shape
        "border-0 border-b border-solid",
        { "border-x border-y": context?.showGridlines },

        // Spacing
        context?.size === "small"
          ? "p-2"
          : context?.size === "large"
            ? "p-5"
            : "p-4",

        // Color
        "border-line-default",
        "text-fg-default",
        "bg-surface-page",
      ],
    }),
    sortIcon: ({ context }) => ({
      class: ["ml-2", context.sorted ? "text-inherit" : "text-fg-default"],
    }),
    columnFilter: {
      class: "inline-flex items-center ml-auto font-normal",
    },
    filterOverlay: {
      class: [
        "flex flex-col gap-2",

        // Position
        "absolute top-0 left-0",

        // Shape
        "border-0 dark:border",
        "rounded-md",
        "shadow-md",

        // Size
        "min-w-[12.5rem]",

        // Color
        "bg-surface-page",
        "text-fg-strong",
        "border-line-default",
      ],
    },
    filterConstraintList: {
      class: "m-0 p-0 py-3 list-none",
    },
    filterConstraint: ({ context }) => ({
      class: [
        // Font
        "font-normal",
        "leading-none",

        // Position
        "relative",

        // Shape
        "border-0",
        "rounded-none",

        // Spacing
        "m-0",
        "py-3 px-5",

        // Color
        { "text-fg-default": !context?.highlighted },
        {
          "bg-surface-page text-fg-default": !context?.highlighted,
        },
        { "bg-surface-selected text-fg-strong": context?.highlighted },

        //States
        {
          "hover:bg-surface-hover": !context?.highlighted,
        },
        {
          "hover:text-fg-strong hover:bg-surface-hover": !context?.highlighted,
        },

        // Transitions
        "transition-shadow",
        "duration-200",

        // Misc
        "cursor-pointer",
        "overflow-hidden",
        "whitespace-nowrap",
      ],
    }),
    filterOperator: {
      class: [
        // Shape
        "rounded-t-md",

        // Color
        "text-fg-default",
        "bg-surface-subtle",
        "[&>[data-pc-name=pcfilteroperatordropdown]]:w-full",
      ],
    },
    filter: ({ instance }) => ({
      class: [
        {
          "flex items-center w-full gap-2": instance.display === "row",
          "inline-flex ml-auto": instance.display === "menu",
        },
      ],
    }),
    filterRule: "flex flex-col gap-2",
    filterButtonbar: "flex items-center justify-between p-0",
    filterAddButtonContainer: "[&>[data-pc-name=pcfilteraddrulebutton]]:w-full",
    rowToggleButton: {
      class: [
        "relative",

        // Flex & Alignment
        "inline-flex items-center justify-center",
        "text-left",

        // Spacing
        "m-0 p-0",

        // Size
        "w-8 h-8",

        // Shape
        "border-0 rounded-full",

        // Color
        "text-fg-muted",
        "bg-transparent",

        // Transition
        "transition duration-200",

        // Misc
        "overflow-hidden",
        "cursor-pointer select-none",
      ],
    },
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
      class: "p-4 flex flex-col gap-2",
      enterFromClass: "opacity-0 scale-y-[0.8]",
      enterActiveClass:
        "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
      leaveActiveClass: "transition-opacity duration-100 ease-linear",
      leaveToClass: "opacity-0",
    },
  },
  bodyRow: ({ context, props, parent }) => ({
    class: [
      // Color
      { "bg-surface-selected text-fg-strong": context.selected },
      {
        "bg-surface-page text-fg-subtle": !context.selected,
      },
      { "font-bold bg-surface-page z-20": props.frozenRow },
      {
        "odd:bg-surface-raised odd:text-fg-strong even:bg-surface-page even:text-fg-strong":
          context.stripedRows && !context.selected,
      },
      // State
      {
        "hover:bg-surface-subtle":
          (props.selectionMode && !context.selected) ||
          parent.instance.rowHover,
      },

      // Transition
      {
        "transition duration-200":
          (props.selectionMode && !context.selected) || props.rowHover,
      },

      // Misc
      { "cursor-pointer": props.selectionMode || parent.instance.rowHover },
    ],
  }),
  rowExpansion: {
    class: "bg-surface-page text-fg-subtle",
  },
  rowGroupHeader: {
    class: ["sticky z-20", "bg-surface-page text-fg-subtle"],
  },
  rowGroupFooter: {
    class: ["sticky z-20", "bg-surface-page text-fg-subtle"],
  },
  rowToggleButton: {
    class: [
      "relative",

      // Flex & Alignment
      "inline-flex items-center justify-center",
      "text-left",

      // Spacing
      "m-0 p-0",

      // Size
      "w-8 h-8",

      // Shape
      "border-0 rounded-full",

      // Color
      "text-fg-muted",
      "bg-transparent",

      // Transition
      "transition duration-200",

      // Misc
      "overflow-hidden",
      "cursor-pointer select-none",
    ],
  },
  rowToggleIcon: {
    class: "inline-block w-4 h-4",
  },
  columnResizeIndicator: {
    class: "absolute hidden w-[2px] z-20 bg-fill-primary",
  },
};
