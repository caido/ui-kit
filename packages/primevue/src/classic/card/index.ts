export default {
  root: {
    class: [
      //Flex
      "flex flex-col",

      //Shape
      "rounded-[0.25rem]",
      "shadow-md",

      //Color
      "bg-surface-raised",
      "text-fg-strong",
    ],
  },
  body: {
    class: [
      //Flex
      "flex flex-col",
      "gap-4",

      "p-6",
    ],
  },
  caption: {
    class: [
      //Flex
      "flex flex-col",
      "gap-2",
    ],
  },
  title: {
    class: "text-xl font-semibold mb-0",
  },
  subtitle: {
    class: [
      //Font
      "font-normal",

      //Spacing
      "mb-0",

      //Color
      "text-fg-subtle",
    ],
  },
  content: {
    class: "p-0",
  },
  footer: {
    class: "p-0",
  },
};
