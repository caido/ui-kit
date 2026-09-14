export default {
  root: ({ context }) => ({
    class: [
      "flex items-center justify-between bg-surface-page text-fg-subtle p-[1.125rem] font-semibold outline-transparent",
      {
        "hover:text-fg-default": !context.disabled,
      },
    ],
  }),
  toggleIcon: "inline-block text-fg-strong w-4 h-4",
};
