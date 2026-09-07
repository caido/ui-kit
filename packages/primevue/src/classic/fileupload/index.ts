export default {
  root: ({ props }) => ({
    class: [
      {
        "flex flex-wrap items-center justify-center gap-2":
          props.mode === "basic",
      },
    ],
  }),
  input: {
    class: "hidden",
  },
  header: {
    class: [
      // Flexbox
      "flex",
      "flex-wrap",

      // Colors
      "bg-surface-page",
      "text-fg-default",

      // Spacing
      "p-[1.125rem]",
      "gap-2",

      // Borders
      "border",
      "border-solid",
      "border-line-default",
      "border-b-0",

      // Shape
      "rounded-tr-lg",
      "rounded-tl-lg",
    ],
  },
  content: {
    class: [
      // Position
      "relative",

      // Colors
      "bg-surface-page",
      "text-fg-default",

      // Spacing
      "p-[1.125rem]",

      // Borders
      "border border-t-0",
      "border-line-default",

      // Shape
      "rounded-b-lg",

      //ProgressBar
      "[&>[data-pc-name=pcprogressbar]]:absolute",
      "[&>[data-pc-name=pcprogressbar]]:w-full",
      "[&>[data-pc-name=pcprogressbar]]:top-0",
      "[&>[data-pc-name=pcprogressbar]]:left-0",
      "[&>[data-pc-name=pcprogressbar]]:h-1",
    ],
  },
  file: {
    class: [
      // Flexbox
      "flex",
      "items-center",
      "flex-wrap",

      // Spacing
      "p-4",
      "mb-2",
      "last:mb-0",

      // Borders
      "border",
      "border-line-default",
      "gap-2",

      // Shape
      "rounded-sm",
    ],
  },
  fileThumbnail: "shrink-0",
  fileName: "mb-2 break-all",
  fileSize: "mr-2",
};
