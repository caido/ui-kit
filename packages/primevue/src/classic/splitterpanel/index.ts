export default {
  root: ({ context }) => ({
    class: ["grow", "min-w-0", "min-h-0", { flex: context.nested }],
  }),
};
